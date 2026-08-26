#!/usr/bin/env node
/**
 * ルーティンから LINE へ通知するための CLI。依存なしで動く。
 *
 * ルーティンのプロンプトに python を直書きして毎回 JSON を組み立てるのをやめ、
 * 引数を渡すだけにするためのもの。JSON エスケープの事故がここで消える。
 *
 * 使い方:
 *   node scripts/notify-line.mjs \
 *     --status success \
 *     --title "note 無料記事が完成" \
 *     --headline "記事タイトル" \
 *     --quote "2〜3行の概要" \
 *     --row "文字数=約3,200字" \
 *     --row "品質スコア=4.2" \
 *     --note "articles/drafts/2026-08-26-xxx.md" \
 *     --link-label "note を開く" --link-uri "https://note.com/..."
 *
 *   --dry を付けると送信せず、送る内容だけを出力する（LINE の通数を消費しない）
 *
 * --status: success | info | warn | error （既定 info）
 *   成功したのか失敗したのかで色が変わる。**必ず実態に合わせて渡すこと。**
 *   失敗を success で送ると、色を信用できなくなる。
 *
 * 必要な環境変数:
 *   NEXEED_LINE_CHANNEL_ACCESS_TOKEN
 *   NEXEED_LINE_USER_ID
 */
import { buildFlexCard, cardToPlainText, clip, validateFlexPayload } from './flex.mjs';

const VALID_STATUS = ['success', 'info', 'warn', 'error', 'neutral'];

/** 同じ名前を複数回渡せる素朴なパーサ。値は次の引数から取る */
export function parseArgs(argv) {
  const out = { row: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    if (key === 'dry') {
      out.dry = true;
      continue;
    }
    const value = argv[i + 1];
    if (value === undefined || value.startsWith('--')) {
      throw new Error(`--${key} に値がありません`);
    }
    i++;
    if (key === 'row') out.row.push(value);
    else out[key] = value;
  }
  return out;
}

/** "文字数=約3,200字" → { label: '文字数', value: '約3,200字' } */
export function parseRow(raw) {
  const at = raw.indexOf('=');
  if (at <= 0) throw new Error(`--row は "ラベル=値" の形で渡してください: ${raw}`);
  return { label: raw.slice(0, at).trim(), value: raw.slice(at + 1).trim() };
}

export function buildSpec(args) {
  if (!args.title) throw new Error('--title は必須です');

  const status = args.status ?? 'info';
  if (!VALID_STATUS.includes(status)) {
    throw new Error(`--status は ${VALID_STATUS.join(' | ')} のいずれかです: ${status}`);
  }

  const blocks = [];
  if (args.headline) blocks.push({ kind: 'title', text: args.headline });
  if (args.quote) blocks.push({ kind: 'quote', text: clip(args.quote, 400) });
  const rows = args.row.map(parseRow);
  if (rows.length > 0) blocks.push({ kind: 'rows', rows });
  if (args.note) {
    blocks.push({ kind: 'separator' });
    blocks.push({ kind: 'text', text: args.note, muted: true });
  }

  // 見出しだけで中身が無いと「何が起きたか分からない通知」になる
  if (blocks.length === 0) throw new Error('--headline / --quote / --row / --note のどれか1つは必要です');

  return {
    status,
    title: args.title,
    subtitle: args.subtitle,
    altText: clip(args.alt ?? [args.title, args.headline].filter(Boolean).join('｜'), 400),
    blocks,
    action: args['link-uri'] ? { label: args['link-label'] ?? '開く', uri: args['link-uri'] } : null,
  };
}

async function push(message) {
  const token = process.env.NEXEED_LINE_CHANNEL_ACCESS_TOKEN;
  const to = process.env.NEXEED_LINE_USER_ID;
  if (!token || !to) {
    throw new Error(
      'NEXEED_LINE_CHANNEL_ACCESS_TOKEN / NEXEED_LINE_USER_ID が未設定です',
    );
  }
  const res = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, messages: [message] }),
  });
  if (!res.ok) throw new Error(`LINE push failed: ${res.status} ${await res.text()}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const spec = buildSpec(args);
  const plain = cardToPlainText(spec);
  let card;
  let problems;
  try {
    card = buildFlexCard(spec);
    problems = validateFlexPayload(card);
  } catch (e) {
    // 組み立てで落ちても通知そのものを消さない
    problems = [`組み立てで例外: ${e.message}`];
  }

  if (args.dry) {
    console.log('--- 送信内容（--dry のため送信しません） ---');
    console.log(plain);
    console.log('--- altText ---');
    console.log(card ? card.altText : '(組み立てに失敗)');
    console.log('--- 検証 ---');
    console.log(problems.length === 0 ? 'OK' : problems.join('\n'));
    return;
  }

  // 見た目より「通知を失わないこと」を優先する。
  // 組み立てや送信に失敗したら、同じ内容をテキストに落として送る。
  if (!card || problems.length > 0) {
    console.error(`Flex 検証に失敗: ${problems.join(' / ')} → テキストで送信します`);
    await push({ type: 'text', text: plain.slice(0, 4900) });
    return;
  }
  try {
    await push({ type: 'flex', altText: card.altText, contents: card.contents });
  } catch (e) {
    console.error(`Flex 送信に失敗: ${e.message} → テキストで再送します`);
    await push({ type: 'text', text: plain.slice(0, 4900) });
  }
  console.log('LINE 通知を送信しました');
}

// テストから import できるよう、直接実行されたときだけ走らせる
if (process.argv[1]?.endsWith('notify-line.mjs')) {
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
