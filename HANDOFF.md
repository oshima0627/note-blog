# HANDOFF

最終更新: 2026-08-23

## いま何をしているのか

note向けの記事を、CLAUDE.md の役割分担フロー（有料ルート／無料ルート）で生成・蓄積している。
無料記事・有料記事とも、スケジュール実行のルーチンで追加している。

## 今回やったこと（2026-08-23 / 無料記事ルーチン）

無料記事を1本、軽量フロー（企画→ニュース→管理）で生成した。

- **【企画】**: WebSearch と公式一次情報で直近のニュースを調査。候補は4つ
  1. Claude Code v2.1.240 / v2.1.241 → いずれも "Bug fixes and reliability improvements" の1行のみで**記事化不可**
  2. `anthropic` Python SDK v1.0.0（2026-08-20）の破壊的変更 → **選定**
  3. Managed Agents の4更新（セッション予算・advisorモデル・inference_geo・GitHub上のスキル）→ 次点。API/エンタープライズ寄り
  4. computer use のGA・browser useツールセット新設（2026-08-19）→ 次点。未着手
  published.json の無料記事に Python SDK v1.0 を主題にしたものがないことを確認済み
  （v2.1.239 の記事で `/claude-api upgrade` に1行触れているのみ）
- **【ニュース】**: 一次情報のみで執筆。裏取りしたURLは6本（すべて記事末尾の出典に記載）
  - platform.claude.com のリリースノート（8/20の項）を全文取得
  - `anthropic-sdk-python` の MIGRATION.md を2回フェッチ（1回目は概要、2回目は該当箇所の逐語引用）
  - 同リポジトリの CHANGELOG.md で 1.0.0 の日付を確認
  - Python SDK 公式ドキュメント（Requirements / HTTPクライアント設定 / alias_httpx）
  - PyPI の JSON API で version=1.0.0・requires_python=">=3.10" を確認
  - claude-code の CHANGELOG で v2.1.239 の `/claude-api upgrade` 追加を確認
- **【管理】**: 品質チェックと事実確認を実施。「v1.0で temperature を渡すと引数エラーになる」という
  **実行時挙動は未検証だったため**「引数として受け付けられません」に修正した
- **保存**: `articles/drafts/2026-08-23_anthropic-python-sdk-v1-breaking-changes.md`
- **台帳**: `articles/published.json` に id:59 を type:"free" / news_date:2026-08-20 で追記
- main にコミットして push（commit a960260）

## 検証済みの事実

- 本文3,873字（空白除く、出典・CTA・メタデータを除く）。出典＋CTAを含めると4,675字 —
  スクリプトで実測。目安2,000〜4,000字に収まっている
- **Markdownテーブル 0件** — 行頭 `|` の行が0であることをスクリプトで確認
- 誇大表現の grep（「絶対」「誰でも」「確実に稼」「驚愕」「激震」「爆速」等）で該当なし
- 見出しの半角コロン 0件（全角「：」に統一済み）— スクリプトで確認
- published.json は JSON としてパース可能。記事は59本になった。
  `git diff --stat` で **30行の追加のみ**（既存部分の再フォーマットなし）を確認
- 記事中の技術的主張（Python 3.10必須／temperature・top_p・top_k削除／extra_body回避策の
  コード例／httpx2とalias_httpx／Text Completions削除／非同期with_raw_responseのawait化／
  AnthropicBedrockのus-east-1フォールバック廃止／`/claude-api upgrade python`）は
  すべて上記の一次情報と突き合わせ済み。**架空の事例・出典なしの数値はゼロ**
- 品質チェック: 正確性9 / 出典明記9 / 鮮度9 / 読みやすさ8 / 導線8 = 平均8.6（合格ライン7.0以上）

## 未検証のもの

- **0.x系のサポート期限**: MIGRATION.md・公式リリースノートのいずれにも記載が見当たらなかった。
  記事内でも「明示的な記載は見当たりませんでした（未確認）」と明示している
- **v1.0で `temperature=` を渡したときの実際の例外種別**: コードを実行して確認していない。
  記事では挙動を断定せず「引数として受け付けられません」と書いた
- 実際に `pip install anthropic` で1.0.0を入れての動作確認はしていない。すべて公式記載にもとづく
- note への投稿は未実施（nexeed-ops の note-post タスクによる下書き自動作成は未確認）

## 次にやること

- **次回の無料記事の候補**（今回の次点。いずれも一次情報あり）:
  - Claude Managed Agents の4更新（セッション予算 `budget_reached` / advisorモデル /
    `inference_geo`（us指定は1.1倍課金）/ GitHubリポジトリの `.claude/skills` 自動読み込み）
  - computer use ツールのGA（`computer_toolset_20260801`）と browser use ツールの新設
    （`browser_toolset_20260801`、2026-08-19）
  - エンタープライズ向けデータ保持ポリシー変更（**公式発表が出たら記事化する**。
    現時点でも報道ベースのみで公式発表は確認できていない）
  - Claude Code v2.1.242 以降の changelog（v2.1.240・241 は1行のみで記事化不可だった）
- 次回の有料記事ルーチンでは、既存16本（国内受託・SaaS・コンサル・note・講座・物販・Agent SDK・
  LINEボット・年収アップ・レガシー改修・M&A・APIコスト削減・法人研修・海外PF・ドル建て受注）と
  重複しない切り口を選ぶ
- 未解決の確認事項（前回から継続）: 週次使用量上限の50%増プロモについて、
  2026-08-19 記事では「8月31日まで延長」と書いたが、第三者ブログに「8月20日で標準に戻った」との記述がある。
  公式の記載を再確認し、必要なら該当記事を訂正すること

## 触ってはいけないところ

- `articles/published.json` は**末尾に追記するだけ**にする。全体を json.dump で書き直すと
  既存部分が再フォーマットされ差分が膨れるので避ける（今回も文字列末尾の置換で追記した）
- 出典が取れない数値・事例は書かない。第三者メディアの数値を公式扱いしない
- 実行して確かめていない挙動（例外の種類・エラーメッセージ）を断定形で書かない
