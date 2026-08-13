/**
 * note 見出し画像ジェネレータ
 *
 *   node render.mjs --article ../articles/drafts/2026-08-13_foo.md
 *   node render.mjs --all            # 画像が無い記事だけ生成
 *   node render.mjs --all --force    # 既存画像も作り直す（テンプレ変更時）
 *
 * 出力: articles/images/<記事と同じbasename>.png (1280x670)
 *
 * タイトルは記事ファイル先頭の `# 見出し` を使う。これは nexeed-ops の
 * note-post が投稿タイトルを決めるルールと同じなので、画像と投稿がずれない。
 */
import { chromium } from "playwright";
import { readFile, writeFile, mkdir, readdir, access } from "node:fs/promises";
import { dirname, join, basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "..");
const DRAFTS = join(REPO, "articles", "drafts");
const OUT_DIR = join(REPO, "articles", "images");
const BG_DIR = join(HERE, "backgrounds");

const WIDTH = 1280;
const HEIGHT = 670;
const AUTHOR = "しま@AIエンジニア";

/** 記事種別ごとの見た目。published.json の type に対応する */
const STYLES = {
  paid: { badge: "有料記事", accent: "#ffc94d", badgeBg: "linear-gradient(180deg,#ffd679,#e39c1b)", badgeFg: "#21160a" },
  free: { badge: "無料記事", accent: "#7fd4ff", badgeBg: "linear-gradient(180deg,#9fdcff,#2f9bd6)", badgeFg: "#04202e" },
};

/**
 * 背景イラストのテーマ。タイトルに含まれる語で決める。
 * 上から順に判定し、最初に当たったものを使う。当たらなければ news。
 */
const THEMES = [
  { name: "money", re: /稼|収益|副業|売る|売却|受託|案件|単価|年収|報酬|マネタイズ|物販|万円|課金|価格|値[上下]げ|料金/ },
  { name: "sec", re: /権限|脆弱|セキュリティ|規約|リスク|監査|抜け穴|透かし|プライバシー|データ提供|終了|引退|廃止|注意/ },
  { name: "news", re: /.*/ },
];

/** 記事ごとに背景を決める。同じ記事なら毎回同じ背景になる */
function pickBackground(title, slug, available) {
  const theme = THEMES.find((t) => t.re.test(title)).name;
  const pool = available.filter((f) => f.startsWith(theme));
  const list = pool.length > 0 ? pool : available;
  // slug の文字コード和で選ぶ。決定的なので再生成しても picture が変わらない
  const hash = [...slug].reduce((a, c) => a + c.charCodeAt(0), 0);
  return list[hash % list.length];
}

/** 先頭の `# 見出し` を取り出す。無ければファイル名を使う */
function extractTitle(markdown, fallback) {
  const m = markdown.match(/^\s*#\s+(.+?)\s*$/m);
  return m ? m[1] : fallback;
}

/** これより長い塊はさらに助詞で切る(全角の目安文字数) */
const MAX_SEGMENT = 11;

/**
 * タイトルを「途中で改行されると読みにくい塊」に分ける。
 *
 * CSS に任せると「Claude Code製サー / ビスを売る」のように単語の途中で
 * 割れてしまう。句読点と助詞の位置で切っておき、テンプレート側では
 * 塊の内部で改行させない(white-space: nowrap)ことで読みやすくする。
 */
export function segmentTitle(title) {
  // 句読点・閉じ括弧・区切り記号の直後で切る
  let parts = title.split(/(?<=[。、，：；！？」』）\]｜・／])/).filter(Boolean);

  // 長すぎる塊は助詞の直後でさらに切る(助詞は前の塊に残す)
  parts = parts.flatMap((p) =>
    [...p].length <= MAX_SEGMENT ? [p] : p.split(/(?<=[をでにはがとへも]|から|まで|より)/).filter(Boolean),
  );

  // 1〜2文字の欠片は前の塊にくっつける(行頭に「を」だけ残るのを防ぐ)
  const merged = [];
  for (const p of parts) {
    if (merged.length > 0 && [...p].length <= 2) merged[merged.length - 1] += p;
    else merged.push(p);
  }
  return merged;
}

/**
 * タイトルの中で色を変える一語を選ぶ。
 *
 * 人気記事の見出し画像は例外なく、金額・期日・件数といった「読者が反応する数字」か
 * 固有名詞を1箇所だけ強調していた。全部を強調すると効果が消えるので1箇所に絞る。
 * 該当が無ければ強調しない(色を使わない方がまし)。
 */
export function pickHighlight(title) {
  const patterns = [
    // 金額(月10万円・年収+50万・5万円〜・$2/$10)
    /[月年]?\+?[\d,]+\s*万円?(?:〜|台|以上)?/,
    /[月年]?[\d,]+\s*円/,
    /\$[\d.]+(?:\/\$[\d.]+)?/,
    // 割合・倍率
    /[\d.]+\s*[%％]|[\d.]+\s*倍/,
    // 期日
    /\d{1,2}月\d{1,2}日/,
    // 件数・手順数
    /[\d,]+\s*(?:ステップ|本|件|行|人|日間|分)/,
    // 鉤括弧の中身(『教材』「Muse Code」など)。
    // 長い引用は1行まるごと色が付いて強調にならないので10文字までに絞る
    /[「『][^」』]{2,10}[」』]/,
  ];
  for (const re of patterns) {
    const m = title.match(re);
    if (m) return m[0];
  }
  return null;
}

async function loadTypes() {
  const raw = await readFile(join(REPO, "articles", "published.json"), "utf8");
  const map = new Map();
  for (const a of JSON.parse(raw).articles ?? []) {
    if (a.file) map.set(basename(a.file), a.type);
  }
  return map;
}

/**
 * 記事本文から検証できる事実だけをチップにする。
 *
 * 「月100万円」のような読者の成果を装う数字は入れない。ここに出すのは
 * 記事を数えれば誰でも確認できるもの(手順数・文字数・出典数)に限る。
 */
function buildChips(markdown) {
  const chips = [];

  const steps = markdown.match(/全(\d+)ステップ/);
  if (steps) chips.push(`全${steps[1]}ステップ`);

  const chars = markdown.replace(/\s/g, "").length;
  if (chars >= 8000) chips.push(`${Math.round(chars / 1000)},000字`);

  const urls = new Set(markdown.match(/https?:\/\/[^\s)]+/g) ?? []);
  if (urls.size >= 3) chips.push(`出典${urls.size}本`);

  return chips.slice(0, 3);
}

/**
 * 見出し画像の下に置く一行。記事の最初の「中身のある」段落から作る。
 *
 * ニュース記事は冒頭が「※◯年◯月◯日時点の情報です」という注記で始まることが多く、
 * それをそのまま出すと見出し画像が注意書きになってしまうので飛ばす。
 */
function buildLead(markdown) {
  const body = markdown.replace(/^\s*#\s+.+$/m, "");
  for (const line of body.split("\n")) {
    const s = line.trim();
    // 見出し・箇条書き・引用・HTMLコメントは飛ばす
    if (!s || /^[#\-*>|<]/.test(s)) continue;
    // 日付の注記・断り書きは本文ではないので飛ばす
    if (/^[※注]|時点の情報|最新は公式|本記事は/.test(s)) continue;
    const plain = s.replace(/\*\*|`|\[([^\]]+)\]\([^)]+\)/g, "$1");
    return plain.length > 46 ? `${plain.slice(0, 46)}…` : plain;
  }
  return "";
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function render(page, template, mdPath, types, backgrounds) {
  const name = basename(mdPath, ".md");
  const markdown = await readFile(mdPath, "utf8");
  const title = extractTitle(markdown, name);
  const style = STYLES[types.get(`${name}.md`)] ?? STYLES.free;

  const bgFile = pickBackground(title, name, backgrounds);
  const bgData = await readFile(join(BG_DIR, bgFile));
  const bgUri = `data:image/png;base64,${bgData.toString("base64")}`;

  const chipsHtml = buildChips(markdown)
    .map((c) => `<span class="chip">${escapeHtml(c)}</span>`)
    .join("");

  // replaceAll を使う: テンプレート冒頭のコメントが各トークンを説明のために
  // 含んでおり、replace だとコメント側だけが置換されて本体に残る。
  // タイトルは HTML に差し込むのでエスケープする。
  // 塊ごとに span で包む。テンプレート側でこの span を改行禁止にしている。
  // 強調する語は <b> でくるむ(塊をまたぐ場合は塊の中の該当部分だけ)。
  const highlight = pickHighlight(title);
  const titleHtml = segmentTitle(title)
    .map((s) => `<span>${emphasize(escapeHtml(s), highlight)}</span>`)
    .join("");

  const html = template
    .replaceAll("TITLE_HTML", titleHtml)
    .replaceAll("BADGE_TEXT", style.badge)
    .replaceAll("BADGE_BG", style.badgeBg)
    .replaceAll("BADGE_FG", style.badgeFg)
    .replaceAll("CHIPS_HTML", chipsHtml)
    .replaceAll("LEAD_TEXT", escapeHtml(buildLead(markdown)))
    .replaceAll("ACCENT_COLOR", style.accent)
    .replaceAll("AUTHOR_NAME", escapeHtml(AUTHOR))
    // 背景は最後に差し込む。base64 に他のトークンが現れても壊れないようにするため
    .replaceAll("BG_DATA_URI", bgUri);

  await page.setContent(html, { waitUntil: "load" });
  await page.waitForFunction(() => window.__fitted === true);

  // タイトルが長すぎると読めない大きさまで縮む。気づけるように警告を出す
  const fit = await page.evaluate(() => ({ size: window.__fittedSize, overflowed: window.__overflowed }));
  if (fit.overflowed) {
    console.warn(`  ⚠ 収まりきりませんでした(${fit.size}px)。タイトルを短くしてください: ${title}`);
  } else if (fit.size < 44) {
    console.warn(`  ⚠ 文字が小さめです(${fit.size}px)。タイトルを短くすると読みやすくなります: ${title}`);
  }

  const out = join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
  return { out, title };
}

function escapeHtml(s) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

/** エスケープ済みの塊の中に強調語があれば <b> でくるむ */
function emphasize(escapedChunk, highlight) {
  if (!highlight) return escapedChunk;
  const target = escapeHtml(highlight);
  const at = escapedChunk.indexOf(target);
  if (at < 0) return escapedChunk;
  return (
    escapedChunk.slice(0, at) + `<b>${target}</b>` + escapedChunk.slice(at + target.length)
  );
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const all = args.includes("--all");
  const one = args[args.indexOf("--article") + 1];

  if (!all && args.indexOf("--article") === -1) {
    console.error("usage: node render.mjs (--all [--force] | --article <path.md>)");
    process.exit(1);
  }

  let targets;
  if (all) {
    const files = await readdir(DRAFTS);
    targets = files.filter((f) => f.endsWith(".md")).map((f) => join(DRAFTS, f));
  } else {
    targets = [resolve(one)];
  }

  await mkdir(OUT_DIR, { recursive: true });
  const types = await loadTypes();
  const template = await readFile(join(HERE, "template.html"), "utf8");
  const backgrounds = (await readdir(BG_DIR)).filter((f) => f.endsWith(".png")).sort();
  if (backgrounds.length === 0) {
    throw new Error(`背景イラストがありません: ${BG_DIR}`);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });

  let made = 0;
  let skipped = 0;
  for (const md of targets) {
    const png = join(OUT_DIR, `${basename(md, ".md")}.png`);
    if (!force && (await exists(png))) {
      skipped++;
      continue;
    }
    const { out, title } = await render(page, template, md, types, backgrounds);
    console.log(`${basename(out)}  <-  ${title}`);
    made++;
  }

  await browser.close();
  console.log(`\n生成 ${made} 件 / スキップ ${skipped} 件 -> articles/images/`);
}

// 直接実行されたときだけ動かす(segmentTitle を import して検証できるようにするため)
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
