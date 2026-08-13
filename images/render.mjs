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

const WIDTH = 1280;
const HEIGHT = 670;
const AUTHOR = "しま@AIエンジニア";

/** 記事種別ごとの見た目。published.json の type に対応する */
const STYLES = {
  paid: { badge: "【有料】", accent: "#d63c1e" },
  free: { badge: "【無料】", accent: "#1668d4" },
};

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

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function render(page, template, mdPath, types) {
  const name = basename(mdPath, ".md");
  const markdown = await readFile(mdPath, "utf8");
  const title = extractTitle(markdown, name);
  const style = STYLES[types.get(`${name}.md`)] ?? STYLES.free;

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
    .replaceAll("ACCENT_COLOR", style.accent)
    .replaceAll("AUTHOR_NAME", escapeHtml(AUTHOR));

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
    const { out, title } = await render(page, template, md, types);
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
