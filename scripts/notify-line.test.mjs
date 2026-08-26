/**
 * 通知 CLI のテスト。
 *
 * 実行: node --test scripts/notify-line.test.mjs
 *
 * ルーティンが呼ぶのはこのスクリプトだけなので、引数の解釈を間違えると
 * 記事が完成したのに通知が飛ばない。引数まわりを重点的に固める。
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { buildFlexCard, validateFlexPayload } from './flex.mjs';
import { buildSpec, parseArgs, parseRow } from './notify-line.mjs';

test('parseArgs: --row は複数回渡せる', () => {
  const args = parseArgs(['--title', 'T', '--row', 'a=1', '--row', 'b=2']);
  assert.equal(args.title, 'T');
  assert.deepEqual(args.row, ['a=1', 'b=2']);
});

test('parseArgs: --dry は値を取らない', () => {
  const args = parseArgs(['--dry', '--title', 'T']);
  assert.equal(args.dry, true);
  assert.equal(args.title, 'T');
});

test('parseArgs: 値の無いオプションは黙って無視せず落とす', () => {
  assert.throws(() => parseArgs(['--title']), /--title に値がありません/);
  assert.throws(() => parseArgs(['--title', '--status', 'info']), /--title に値がありません/);
});

test('parseRow: ラベルと値に分ける。値に = があっても壊れない', () => {
  assert.deepEqual(parseRow('文字数=約3,200字'), { label: '文字数', value: '約3,200字' });
  assert.deepEqual(parseRow('式=a=b'), { label: '式', value: 'a=b' });
  assert.throws(() => parseRow('=1'), /ラベル=値/);
  assert.throws(() => parseRow('ラベルだけ'), /ラベル=値/);
});

test('buildSpec: 記事完成通知の全部入りが描画できる', () => {
  const spec = buildSpec(
    parseArgs([
      '--status', 'success',
      '--title', 'note 無料記事が完成',
      '--headline', '個人開発で使う自動化の型',
      '--quote', '定型作業を自動化する考え方を整理した。',
      '--row', '文字数=約3,200字',
      '--row', '品質スコア=4.2',
      '--note', 'articles/drafts/2026-08-26-automation.md',
      '--link-label', 'note を開く',
      '--link-uri', 'https://note.com/example',
    ]),
  );
  assert.equal(spec.status, 'success');
  assert.equal(spec.blocks[0].kind, 'title');
  assert.equal(spec.blocks[1].kind, 'quote');
  assert.deepEqual(spec.blocks[2].rows, [
    { label: '文字数', value: '約3,200字' },
    { label: '品質スコア', value: '4.2' },
  ]);
  assert.equal(spec.action.uri, 'https://note.com/example');
  assert.deepEqual(validateFlexPayload(buildFlexCard(spec)), []);
});

test('buildSpec: altText は未指定ならタイトルと見出しから作る', () => {
  const spec = buildSpec(parseArgs(['--title', 'note 記事が完成', '--headline', '自動化の型']));
  assert.equal(spec.altText, 'note 記事が完成｜自動化の型');
});

test('buildSpec: --alt を渡せばそれを使い、長ければ切る', () => {
  const spec = buildSpec(parseArgs(['--title', 'T', '--headline', 'H', '--alt', 'あ'.repeat(500)]));
  assert.equal(spec.altText.length, 400);
});

test('buildSpec: 失敗通知は赤で送れる', () => {
  const spec = buildSpec(
    parseArgs(['--status', 'error', '--title', 'note 記事の生成に失敗', '--quote', 'ハルシネーション検査で不合格']),
  );
  assert.equal(spec.status, 'error');
  assert.deepEqual(validateFlexPayload(buildFlexCard(spec)), []);
});

test('buildSpec: title は必須', () => {
  assert.throws(() => buildSpec(parseArgs(['--headline', 'H'])), /--title は必須/);
});

test('buildSpec: 中身が空のカードは作らせない', () => {
  assert.throws(() => buildSpec(parseArgs(['--title', 'T'])), /どれか1つは必要/);
});

test('buildSpec: 未知の status は落とす', () => {
  assert.throws(
    () => buildSpec(parseArgs(['--title', 'T', '--headline', 'H', '--status', 'ok'])),
    /--status は/,
  );
});

test('buildSpec: リンクが無ければボタンを出さない', () => {
  const spec = buildSpec(parseArgs(['--title', 'T', '--headline', 'H']));
  assert.equal(spec.action, null);
  assert.equal(buildFlexCard(spec).contents.footer, undefined);
});
