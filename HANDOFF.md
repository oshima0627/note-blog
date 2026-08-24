# HANDOFF

最終更新: 2026-08-24

## いま何をしているのか

note向けの記事を、CLAUDE.md の役割分担フロー（有料ルート／無料ルート）で生成・蓄積している。
無料記事・有料記事とも、スケジュール実行のルーチンで追加している。

## 今回やったこと（2026-08-24 / 無料記事）

無料記事を1本、軽量フロー（企画→ニュース→管理）で生成した。作業は worktree
`.claude/worktrees/scheduled-article-posting-2d5de6`（ブランチ `claude/free-article-posting-67d430`）で行い、
`git push origin HEAD:main` でリモートの main に反映した。

- **【企画】**: 公式リリースノートと Claude Code の CHANGELOG を確認。候補と判断は次のとおり
  1. Claude Code v2.1.240 / v2.1.241 → いずれも "Bug fixes and reliability improvements" の1行のみで**記事化不可**（前回と同じ）
  2. 2026-08-19 のベータ卒業まとめ＋browser use ツール新設 → **選定**（published.json に未掲載）
  3. Claude Managed Agents の 8/7 の4更新 → 次点。今回の記事に一部（8/19分のドメイン制限等）だけ取り込んだ
  4. 2026-08-20 の Python SDK v1.0 → 前回（id:59）で扱い済みのため除外
- **【ニュース】**: 一次情報のみで執筆。裏取りしたURLは6本（すべて記事末尾の出典に記載）
  - platform.claude.com のリリースノート全文（8/19・8/20 の項を逐語確認）
  - computer use ツールのドキュメント（`computer_toolset_20260801`、バッチ操作、zoom既定有効、
    `configs`、`computer_20251124` からの移行手順）
  - browser use ツールのドキュメント（`browser_toolset_20260801`、メンバー一覧、既定無効の4メンバー、
    クライアント側ホスト、Claude API 限定）
  - Files API ドキュメント（`expires_in_seconds`/`expires_at`、`page`/`next_page`、`ids[]`）
  - Agent Skills の API ガイド（現行ドキュメントに beta ヘッダーの記載がないことを確認）
  - Managed Agents のツール設定ページ（出典として記載）
- **【管理】**: 品質チェックと事実確認を実施。第三者ブログが「5機能がGA」と書いていたが、
  公式リリースノートでは **ベータ卒業は4つ、browser use は新設** だったため、記事は公式の区分に合わせた
- **保存**: `articles/drafts/2026-08-24_claude-api-beta-graduation-browser-use.md`
- **台帳**: `articles/published.json` に id:60 を type:"free" / news_date:2026-08-19 で追記

## 検証済みの事実

- 本文3,297字（空白除く、出典・CTA・メタデータを除く）— スクリプトで実測。目安2,000〜4,000字に収まっている
- **Markdownテーブル 0件** — 行頭 `|` の行が0であることをスクリプトで確認
- 見出しの半角コロン 0件（全角「：」に統一）／太字 `**` 0件（既存記事に合わせた）— スクリプトで確認
- 誇大表現の grep（「絶対」「誰でも」「確実に稼」「驚愕」「激震」「爆速」「神」「革命」）で該当なし
- `articles/published.json` は JSON としてパース可能。記事は60本。
  `git diff --stat` で **30行の追加のみ**（既存部分の再フォーマットなし）を確認
- 記事中の技術的主張（4機能のベータ卒業／browser use の新設とメンバー構成／computer use のバッチ操作・
  zoom既定有効・17メンバー化・`toolset_name` 必須／Files API はヘッダーを外すと新応答形式に切り替わる／
  Skills・Admin API はヘッダーを送り続けても不変／Managed Agents のドメイン制限）は
  すべて上記の一次情報と突き合わせ済み。**架空の事例・出典なしの数値はゼロ**
- 品質チェック: 正確性9 / 出典明記9 / 鮮度9 / 読みやすさ8 / 導線8 = 平均8.6（合格ライン7.0以上）

## 未検証のもの

- **実際にAPIを叩いての動作確認はしていない**。すべて公式ドキュメント・リリースノートの記載にもとづく。
  とくに「Files API のヘッダーを外すと応答形式が変わる」はリリースノートの記述であり、実挙動は未確認
- browser use のトークン効率（要素参照のほうがスクリーンショット連打より効率的）は
  公式が「より効率的になりうる」と述べているだけで、実測値は未確認。記事でも断定していない
- note への投稿は未実施（nexeed-ops の note-post タスクによる下書き自動作成は未確認）
- **LINE通知は送っていない**。今回は対話セッションでの依頼だったため、ルーチン手順5をスキップした。
  スケジュール実行時は routine_free-article.md のとおり送信すること

## 次にやること

- **次回の無料記事の候補**（いずれも一次情報あり）:
  - Claude Managed Agents の8/7の4更新（セッション予算 `budget_reached` / advisorモデル /
    `inference_geo`（us指定は1.1倍課金）/ GitHubリポジトリの `.claude/skills` 自動読み込み）
  - Workbench が Playground に刷新（2026-08-18）。旧Workbenchの終了（8/17）は id:35 で扱い済みなので、
    後継の Playground 側の話として書けば重複しない
  - Compliance API が Cowork / Claude Code のローカルセッション記録に対応（2026-08-11、Enterprise向け・beta）
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
- 出典が取れない数値・事例は書かない。第三者メディアの数値を公式扱いしない。
  今回のように第三者ブログと公式で件数の数え方が食い違うことがある
- 実行して確かめていない挙動を断定形で書かない
- worktree 作業時、ローカルの `main` は別 worktree でチェックアウトされているため
  `git checkout main` はできない。`git push origin HEAD:main` でリモートに反映する
