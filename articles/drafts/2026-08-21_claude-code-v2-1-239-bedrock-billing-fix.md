# Claude Code v2.1.239：Bedrockでの課金が二重になる不具合を修正

2026年8月21日時点の情報です。

Claude Code の v2.1.239 が公開されました。修正・改善が数十項目に及ぶ大きな更新です。
この記事では、その中でも「お金」と「使用量」に直接関わる変更を中心にまとめます。

## この記事でわかること

- Amazon Bedrock 経由の利用で、課金対象のAPI呼び出しが二重になっていた不具合とその発生条件
- コスト見積もりに、データレジデンシーの1.1倍が反映されるようになったこと
- Python SDK が 1.0 になり、移行を助けるコマンドが追加されたこと

## 1. Bedrock＋プロキシで、課金が二重になっていた

### 概要

公式changelogの v2.1.239 に、次の修正が記載されています。

> Fixed Bedrock streaming behind proxies that strip the response Content-Type header, which silently doubled billed API calls by re-running every turn non-streaming

意訳すると「Content-Type ヘッダーを取り除くプロキシの背後では Bedrock のストリーミングが失敗し、毎ターンが非ストリーミングで再実行された結果、課金対象のAPI呼び出しが気づかれないまま二重になっていた」という内容です。

つまり、条件がそろうと1ターンにつき2回分が課金されていたことになります。

### 発生条件

公式の記述から読み取れる条件は、次の3つがそろった場合です。

- 接続先が Amazon Bedrock であること
- 通信が、レスポンスの Content-Type ヘッダーを削るプロキシを経由していること
- ストリーミングで動作していること

社内ネットワークや、独自のプロキシを挟む構成が該当しやすい条件です。

### 読者への影響

Claude API に直接つなぐ利用や、Pro / Max のサブスクリプション利用は、この条件に当てはまりません。
影響を受けうるのは、Bedrock を業務で使い、かつプロキシを経由している環境です。

心当たりがある場合は、AWSのコスト管理画面で該当期間の利用額を確認しておくとよいでしょう。
なお、過去分の返金や補填に関する公式の案内は、確認できませんでした（2026年8月21日時点）。

また同じ v2.1.239 では、Bedrock を SSO プロファイルと `awsAuthRefresh` で使うとき、HTTPSプロキシ配下で起動時にハングする不具合も修正されています。認証情報の事前チェックが `HTTPS_PROXY` を参照するようになりました。

## 2. コスト見積もりに、データレジデンシーの1.1倍が反映

v2.1.239 では、`/cost`・ステータスライン・`--max-budget-usd` のコスト見積もりが、データレジデンシー用ワークスペースの「US限定推論の1.1倍」を含むようになりました。

この1.1倍は、Claude Code の新しい料金ではありません。もともと公式の料金体系にあるものです。
公式ドキュメントは次のように定めています。

> Claude 4.6 and later models: US-only inference (`inference_geo: "us"`) is priced at 1.1x the standard rate across all token pricing categories (input tokens, output tokens, cache writes, and cache reads).

対象は入力トークン・出力トークン・キャッシュ書き込み・キャッシュ読み取りのすべてです。
`inference_geo: "global"`（既定）は標準料金です。

### 読者への影響

これまでは、US限定推論を使っていても表示上のコストは標準料金で計算されていました。今回の変更で、表示が実際の請求に近づきます。

該当するワークスペースを使っている場合、`/cost` の数字が以前より約10%大きく出ることになります。これは値上げではなく、表示の精度が上がった結果です。

なお、この1.1倍が適用されるのは Claude API（ファーストパーティ）と Claude Platform on AWS です。Amazon Bedrock と Google Cloud は、それぞれ独自の地域別料金体系だと公式に記載されています。

## 3. 使用量の上限まわりが分かりやすくなりました

お金に関わる改善が、ほかに2点あります。

- 月間の支出上限を使い切ったときのメッセージに、セッション上限や週次上限がいつリセットされるかも表示されるようになりました
- 永続リトライモード（`CLAUDE_CODE_RETRY_WATCHDOG`）が、組織の支出上限超過とクレジット切れでは即座に失敗するようになりました。従来はリセットを待ち続けていました

後者は、リトライを仕込んだ自動実行が延々と待ち続ける事態を防ぐ変更です。

## 4. Python SDK の 1.x 移行コマンドが追加

`/claude-api upgrade` が追加されました。Python プロジェクトを `anthropic` の 0.x から 1.x へ移行するためのコマンドです。
あわせて、バンドルされているスキルの Python リファレンスが 1.x 向けに更新されました。タイムアウトの指定は `httpx.Timeout` ではなく `anthropic.Timeout` を使う、といった変更が反映されています。

背景として、`anthropic` の Python パッケージは 1.0.0 が 2026年8月20日にリリースされています。公式リポジトリには 0.x からの移行ガイド（MIGRATION.md）が用意されています。

**筆者の見方**：メジャーバージョンアップの直後にCLI側の移行支援が入るのは、実務では助かる流れです。ただし移行は破壊的変更を伴うため、コマンド任せにせず、生成された差分は必ず自分で確認することをおすすめします。

## 5. そのほか、効きそうな修正

同じ v2.1.239 から、影響が分かりやすいものを挙げます。

- Windows でセッション間メッセージングが利用可能になりました。`SendMessage` と `ListAgents` で、複数マシンのセッション同士がやりとりできます（macOS・Linux と同様）
- BOM（UTF-8のバイトオーダーマーク）で始まる `.md` のエージェント・スキル・コマンドが、黙って無視されていた不具合が修正されました
- 作業ディレクトリを削除したあと、フックが「posix_spawn ENOENT」で失敗する不具合が修正されました
- `WebFetch` が、期限切れのページ内容をセッション中ずっとメモリに保持していた不具合が修正されました（本来は15分）
- ログインコード欄などのマスク入力が、`Ctrl+Y` で他の場所に貼り付けられたり、プロンプト履歴に残ったりする問題が修正されました
- JetBrains の IDE ターミナルで、`Edit`・`Write` が約5秒止まる問題が修正されました
- Linux のサンドボックスで、`extensions.worktreeConfig` を設定したリポジトリのgitコマンドがすべて失敗していた不具合が修正されました

## 今日やること

1. `claude --version` でバージョンを確認する
2. Bedrock をプロキシ経由で使っているなら、該当期間のAWS利用額を見ておく
3. データレジデンシー用ワークスペースを使っているなら、`/cost` の数字が変わることを把握しておく
4. `anthropic` 0.x を使う Python プロジェクトがあれば、`/claude-api upgrade` での移行を検討する

Claude Code は自動更新に対応しているため、多くの環境では順次適用されます。すぐ試したい場合は手動で更新してください。

料金と仕様は変わりやすい項目です。最新の内容は必ず公式ドキュメントでご確認ください。

（本文中の「筆者の見方」以外は、すべて下記の一次情報にもとづく事実です。）

## 出典

- Claude Code changelog（公式・v2.1.239）: https://code.claude.com/docs/en/changelog
- Claude Code CHANGELOG.md（公式リポジトリ）: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md
- Data residency（公式ドキュメント・1.1倍の料金規定）: https://platform.claude.com/docs/en/manage-claude/data-residency
- anthropic（Python パッケージ・1.0.0 / 2026年8月20日リリース）: https://pypi.org/project/anthropic/
- anthropic-sdk-python v1 移行ガイド: https://github.com/anthropics/anthropic-sdk-python/blob/main/MIGRATION.md

---

**この記事が役に立ったら、フォローしていただけると更新の見落としが減ります。**

Claude Code・Claudeの重要なアップデートや、開発者に影響のあるニュースを継続的にまとめています。

有料記事では、Claude / Claude Code を使って実際に収益につなげる方法（受託・個人開発・API活用・情報発信）を、手順と数字まで踏み込んで解説しています。よろしければあわせてご覧ください。

#ClaudeCode #Claude #Anthropic #AI開発 #開発効率化

<!--
type: free
title: Claude Code v2.1.239：Bedrockでの課金が二重になる不具合を修正
keywords: Claude Code, v2.1.239, Amazon Bedrock, 二重課金, データレジデンシー, inference_geo, anthropic SDK 1.0, changelog
target: Claude Codeを日常的に使うエンジニア・個人開発者
news_date: 2026-08-21
hashtags: #ClaudeCode #Claude #Anthropic #AI開発 #開発効率化
-->
