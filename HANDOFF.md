# HANDOFF

最終更新: 2026-08-27（記事ルーティン2本を停止）

## いま何をしているのか

note向けの記事を、CLAUDE.md の役割分担フロー（有料ルート／無料ルート）で生成・蓄積していた。

> **2026-08-27: 記事を自動生成していたクラウドルーティン2本を停止した（本人の指示）。**
>
> | ルーティン | ID | 状態 |
> |---|---|---|
> | note無料記事作成（毎朝08:00 JST） | `trig_01QzBCjYYyTexPkS5XJ1FhNm` | **enabled: false** |
> | note有料記事作成（毎週金10:00 JST） | `trig_01DD4hdtnLL3RBxuWGHqq3nH` | **enabled: false** |
>
> **記事の自動生成は止まっている。** 再開は `RemoteTrigger update` に `{"enabled": true}`。
> 完全に消すなら https://claude.ai/code/routines から手動（API に削除は無い）。

直近の作業は 2026-08-26 の無料記事1本の生成と main への反映。
同じ 2026-08-26 に、別セッションで LINE 通知の Flex Message 化を行っている（下記「LINE通知の現状」）。

## 今回やったこと（2026-08-26 / 無料記事）

無料記事を1本、軽量フロー（企画→ニュース→管理）で生成し、main に反映した。

- **【企画】**: 候補を比較して選定した
  1. **Compliance API のセッション取得エンドポイントがベータ卒業（2026-08-26 付リリースノート）→ 選定**。
     当日付の一次情報で、業務で Claude Code を使う読者に直接影響する
  2. Claude のメモリ統合（chat と Cowork で共通化、Topics で編集・削除、センシティブ話題のトグル。8/25 の公式ブログあり）→
     一次情報はあるが、読者層（Claude Code ユーザー）への影響は Compliance API のほうが直接的なため見送り
  3. AI ウェルビーイング研究への $5M 助成（8/25）→ 読者への実務的影響が薄く見送り
  4. Claude Code changelog → **v2.1.246（8/25）が最新で、前回 id:62 で扱い済み**。新規なし
  - 既存の無料記事に Compliance API を主題にしたものは無い。id:44（8/19 の Sonnet 5 値上げ中止記事）が
    8/11 のベータ開始を**本文の付記として**触れているだけなので、続報として成立すると判断した
- **【ニュース】**: 一次情報のみで執筆。裏取りしたURLは4本（すべて記事末尾の出典に記載）
  - platform.claude.com/docs/en/release-notes/api（8/26・8/11・8/3 の各項目、Admin API の CLI/SDK 対応）
  - platform.claude.com/docs/en/manage-claude/compliance-sessions（Enterprise 限定、取得の仕組み、
    含まれる／含まれない項目、10,000バイト上限、保存期間、記録されないケース）
  - platform.claude.com/docs/en/manage-claude/compliance-api（概要・キーとスコープ・OTEL との比較）
  - platform.claude.com/docs/en/manage-claude/compliance-faq（有効化の権限、データ範囲の要約）
- **【管理】**: 品質チェックと事実確認を実施
- **保存**: `articles/drafts/2026-08-26_claude-code-compliance-session-transcripts-ga.md`
- **台帳**: `articles/published.json` に id:63 を type:"free" / news_date:2026-08-26 で追記

## 検証済みの事実

- 本文3,826字（空白除く、出典・CTA・メタデータを除く）— スクリプトで実測。目安2,000〜4,000字に収まっている
- **Markdownテーブル 0件** / 太字 `**` 0件 — スクリプトで確認
- 誇大表現の grep（「絶対」「誰でも」「確実に稼」「驚愕」「激震」「爆速」「神ツール」「革命」「必見」「衝撃」「完全に」「ヤバ」）で該当なし
- `articles/published.json` は JSON としてパース可能。記事は63本。`git diff --stat` で **30行の追加のみ**
- 記事中の事実はすべて公式ドキュメントの原文と突き合わせ済み。
  ベータ卒業（8/26）／ローカルベータ開始（8/11）／リモートベータ開始（8/3）の3つの日付、
  Enterprise 限定である旨、`read:compliance_user_data` スコープ、10,000バイト既定・約1MiB上限、
  保存6年と組織の有限保持期間の優先、記録されない5ケース、
  「URL・認証情報・個人データにマスクはかからない」の記述、Admin API の対応言語一覧。
  **架空の事例・出典なしの数値はゼロ**
- 品質チェック: 正確性9 / 出典明記9 / 鮮度10 / 読みやすさ8 / 導線8 = 平均8.8（合格ライン7.0以上）
- main への push 完了
- LINE通知を送信（`scripts/notify-line.mjs` 経由）

## 未検証のもの

- **Compliance API を実際に叩いてはいない**。すべて公式リリースノート・公式ドキュメントの記載にもとづく
- 「記録は有効化した時点から始まる」は、Activity Feed について
  「recording is not retroactive」と明記された記述と、セッション一覧に
  「取得開始前のセッションが本文なしで含まれうる」という記述から書いている。
  **セッション取得について「非遡及」と直接書かれた1文は見つけていない**ので、記事では断定を避けている
- note への投稿は未実施（下記「次にやること」参照）

## LINE通知の現状（2026-08-27 に訂正）

**⚠ リポジトリ側は Flex 化したが、実際に動いていたクラウドルーティン2本には反映されていなかった。**
`prompts/routines/*.md` は `scripts/notify-line.mjs` を呼ぶ形に書き換え済みだったが、
ルーティン本体のプロンプトは古い python 直書きのまま毎朝動いていた（2026-08-27 に全ルーティンを
棚卸しして判明）。**`scripts/notify-line.mjs` はルーチンから1度も呼ばれていない。**

**リポジトリのプロンプト雛形を直しても、ルーティン本体は変わらない。**
ルーティンは `RemoteTrigger update` でプロンプトごと差し替える必要がある。
2本とも停止したのでいまは実害はないが、再開するときは
**雛形ではなくルーティン本体のプロンプトを差し替えること。**

- 通知は `scripts/notify-line.mjs` に引数を渡す方式で用意してある。
  `prompts/routines/routine_free-article.md` / `routine_paid-article.md` も更新済み
- **スケジューラに登録されているルーチンのプロンプト本文は、まだ python 直書きの旧版だった。**
  今回はリポジトリ側の新しい手順（`scripts/notify-line.mjs`）に従って送信した。
  スケジュール設定側のプロンプトを新版に貼り直しておくとズレが解消する
- 仕様は gas-notify-hub の `docs/superpowers/specs/2026-08-26-line-flex-design.md` にある。通知を触る前に読むこと

## 次にやること

- **スケジューラ側のルーチンプロンプトを更新する**（上記「LINE通知の現状」）。
  リポジトリの `prompts/routines/routine_free-article.md` の本文をそのまま貼り直せばよい
- **note への投稿が止まったまま**。nexeed-ops のポーリング用スケジュールタスク `NotePost_Recurring` が未登録で、
  `articles/drafts/` に未投稿の記事が溜まっている。再開するなら nexeed-ops で `npm run arm:note`。
  古い記事は鮮度ガード（7日）で下書き止まりになる
- **次回の無料記事の候補**:
  - Claude のメモリ統合（chat と Cowork で共通、Topics で編集・削除、センシティブ話題は既定オフ）。
    2026-08-25 の公式ブログあり。今回の次点
  - Claude Managed Agents の 8/7 の4更新（セッション予算 `budget_reached` / advisorモデル /
    `inference_geo` / GitHubリポジトリの `.claude/skills` 自動読み込み）。鮮度は落ちている
  - Inference hooks（8/5 に Enterprise 向けベータ）。今回の記事と地続きで、まだ単独では扱っていない
  - Workbench が Playground に刷新（2026-08-18）。旧Workbenchの終了は id:35 で扱い済み
  - Claude Code v2.1.247 以降の changelog（8/26 時点では 2.1.246 が最新）
- 次回の有料記事ルーチンでは、既存の有料記事と重複しない切り口を選ぶ
- 未解決の確認事項（前回から継続）: 週次使用量上限の50%増プロモについて、
  2026-08-19 記事では「8月31日まで延長」と書いたが、第三者ブログに「8月20日で標準に戻った」との記述がある。
  公式の記載を再確認し、必要なら該当記事を訂正すること

## 触ってはいけないところ

- **ルーチンのプロンプト内で LINE の JSON を組み立てないこと。** `scripts/notify-line.mjs` に引数で渡す。
  エスケープ事故を避けるためにこの形にした
- **`--status` は実態に合わせる。** 失敗を `success` で送るとカードの色を信用できなくなる
- **`scripts/flex.mjs` は4リポジトリに複製されている。** 直すときは先に設計書を直す
- `articles/published.json` は**末尾に追記するだけ**にする。全体を json.dump で書き直すと
  既存部分が再フォーマットされ差分が膨れるので避ける（今回も文字列末尾の置換で追記した）
- 出典が取れない数値・事例は書かない。第三者メディアの数値を公式扱いしない
- 実行して確かめていない挙動を断定形で書かない
- リモートに作業ブランチを作らず、`git push origin HEAD:main` で main に直接反映する
