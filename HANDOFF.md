# HANDOFF

最終更新: 2026-08-24（無料記事ルーチン 2本目）

## いま何をしているのか

note向けの記事を、CLAUDE.md の役割分担フロー（有料ルート／無料ルート）で生成・蓄積している。
無料記事・有料記事とも、スケジュール実行のルーチンで追加している。

## 今回やったこと（2026-08-24 / 無料記事・同日2本目）

無料記事を1本、軽量フロー（企画→ニュース→管理）で生成し、`git push origin HEAD:main` で main に反映した。
作業ブランチは `claude/gallant-hypatia-nam86w`（リモートには push していない。main にのみ反映）。

- **【企画】**: 直近の一次情報を確認して候補を比較した
  1. Claude Code v2.1.240 / 241（8/22・8/23）→ いずれも "Bug fixes and reliability improvements" の1行のみで**記事化不可**
  2. Claude Platform リリースノートの最新は 8/20 の Python SDK v1.0 → id:59 で扱い済み
  3. Claude Tag（Slack）の全会話コンテキスト対応（8/24）→ 一次情報が見つからず（VentureBeat等の報道のみ。
     公式の Introducing Claude Tag は 6/23 付で今回の更新の記載なし）。Enterprise/Team 向けで読者層とのズレもあり見送り
  4. Managed Agents の 8/7 の4更新 → 一次情報あり。次点（17日前で鮮度が落ちる）
  5. **Claude Security のスキャンが Mythos 5 に（8/21）→ 選定**。公式ブログ＋製品ページ＋Claude Code公式ドキュメントで裏取り可能
- **【ニュース】**: 一次情報のみで執筆。裏取りしたURLは5本（すべて記事末尾の出典に記載）
  - claude.com/blog/bringing-claude-mythos-5-to-more-defenders（8/21・Mythos 5対応、0xDAF $35M、Cyber Verification Program拡大）
  - claude.com/product/claude-security（Enterprise公開ベータ、GitHub接続、CWE/確信度/深刻度、反対検証、パッチは人がレビュー）
  - claude.com/blog/claude-security-public-beta（4/30・公開ベータ開始時の内容）
  - code.claude.com/docs/en/claude-security（claude-security プラグイン。前提条件・出力先・パッチ非自動適用・非決定性）
  - code.claude.com/docs/en/security-guidance（security-guidance プラグイン。全プラン・3層・コスト・無効化）
- **【管理】**: 品質チェックと事実確認を実施
- **保存**: `articles/drafts/2026-08-24_claude-security-mythos-5-scans.md`
- **台帳**: `articles/published.json` に id:61 を type:"free" / news_date:2026-08-21 で追記

## 検証済みの事実

- 本文3,338字（空白除く、出典・CTA・メタデータを除く）— スクリプトで実測。目安2,000〜4,000字に収まっている
- **Markdownテーブル 0件** / 太字 `**` 0件 / 見出しの半角コロン 0件 — スクリプトで確認
- 誇大表現の grep（「絶対」「誰でも」「確実に稼」「驚愕」「激震」「爆速」「神ツール」「革命」）で該当なし
- `articles/published.json` は JSON としてパース可能。記事は61本。`git diff --stat` で **30行の追加のみ**
- 記事中の事実（Mythos 5対応／Enterprise公開ベータ／CWE・確信度・深刻度／0xDAF の3,500万ドル／
  Cyber Verification Program の拡大／claude-security プラグインの前提条件・出力先・パッチ非自動適用／
  security-guidance の全プラン提供・3層・追加コストなしの層）はすべて上記一次情報と突き合わせ済み。
  **架空の事例・出典なしの数値はゼロ**
- 品質チェック: 正確性9 / 出典明記9 / 鮮度9 / 読みやすさ8 / 導線8 = 平均8.6（合格ライン7.0以上）
- main への push 完了（`b5b2db6..097d879`）
- LINE通知を送信（push status 200）

## 未検証のもの

- **プラグインを実際にインストールして動かしてはいない**。すべて公式ドキュメントの記載にもとづく
- マネージド版 Claude Security の課金方式（既存プランのトークン使用量として課金されるか、
  別アドオンが要るか）は**公式一次情報で確認できなかった**ため、記事には書いていない。
  第三者ブログには「追加アドオン不要」との記述があるが未検証
- note への投稿は未実施（下記「次にやること」参照）

## 次にやること

- **note への投稿が止まったまま**。nexeed-ops のポーリング用スケジュールタスク `NotePost_Recurring` が未登録で、
  `articles/drafts/` に未投稿の記事が溜まっている（前回時点で15件＋今回の1件）。
  再開するなら nexeed-ops で `npm run arm:note`。古い記事は鮮度ガード（7日）で下書き止まりになる
- **次回の無料記事の候補**（いずれも一次情報あり）:
  - Claude Managed Agents の8/7の4更新（セッション予算 `budget_reached` / advisorモデル /
    `inference_geo`（us指定は1.1倍課金）/ GitHubリポジトリの `.claude/skills` 自動読み込み）
  - Workbench が Playground に刷新（2026-08-18）。旧Workbenchの終了は id:35 で扱い済み
  - Claude Tag の全会話コンテキスト対応（8/24）。**公式の一次情報が出たら**扱う
  - Claude Code v2.1.242 以降の changelog（240・241 は1行のみで記事化不可だった）
- 次回の有料記事ルーチンでは、既存16本と重複しない切り口を選ぶ
- 未解決の確認事項（前回から継続）: 週次使用量上限の50%増プロモについて、
  2026-08-19 記事では「8月31日まで延長」と書いたが、第三者ブログに「8月20日で標準に戻った」との記述がある。
  公式の記載を再確認し、必要なら該当記事を訂正すること

## 触ってはいけないところ

- `articles/published.json` は**末尾に追記するだけ**にする。全体を json.dump で書き直すと
  既存部分が再フォーマットされ差分が膨れるので避ける（今回も文字列末尾の置換で追記した）
- 出典が取れない数値・事例は書かない。第三者メディアの数値を公式扱いしない
- 実行して確かめていない挙動を断定形で書かない
- リモートに作業ブランチを作らず、`git push origin HEAD:main` で main に直接反映する
