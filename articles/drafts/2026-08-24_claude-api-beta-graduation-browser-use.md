# Claude APIの4機能がベータ卒業：browser useツールも新登場

2026年8月24日時点の情報です。仕様は変わりやすいため、最新は公式ドキュメントでご確認ください。

## この記事でわかること

- 2026年8月19日にClaude APIの4つの機能がベータを卒業したこと
- 同日に新設された「browser use」ツールで何ができるか、computer useとの違い
- betaヘッダーを外すときの注意点（Files APIは外すと応答形式が変わります）

## 何が起きたのか

Anthropicは2026年8月19日、Claude APIの複数機能をベータから正式提供に切り替えたと発表しました。
公式のリリースノートに記載があります。
ベータを卒業したのは次の4つです。

- computer useツール（`computer_toolset_20260801`）
- Files API（`/v1/files`）
- Agent SkillsとSkills API（`/v1/skills`）
- Admin APIのユーザー管理エンドポイント（Claude Enterprise向け）

さらに同じ日に、browser useツール（`browser_toolset_20260801`）が新しく追加されました。
これはベータ卒業ではなく新設です。

### 読者への影響

APIを直接叩いている、あるいはSDKでエージェントを組んでいる場合、
これまで付けていた`anthropic-beta`ヘッダーの多くが不要になります。
ただし「外しても同じ動きをする」ものと「外すと挙動が変わる」ものがあります。後述します。

## computer useツールが正式提供になりました

画面のスクリーンショットを見て座標をクリックする、いわゆるパソコン操作のツールです。
正式版のツールセット名は`computer_toolset_20260801`で、betaヘッダーは不要になりました。

公式ドキュメントによると、正式版では次の点が変わっています。

- 1ターンで複数の操作を返す「バッチ操作」に対応（返ってきた順に逐次実行し、失敗したらそこで止める）
- 領域を拡大して見る`zoom`が既定で有効
- `configs`でメンバーごとに有効・無効を設定できる
- リクエストから`display_width_px`・`display_height_px`・`display_number`が不要に

対応モデルはClaude Fable 5、Claude Mythos 5、Claude Opus 5、Claude Sonnet 5、Claude Opus 4.8です。
以前のベータ版（`computer_20251124`）も引き続き使えます。

注意したいのは、既存の実装をそのまま移せない点です。
旧版は`computer`という1つのツールに`action`を渡す形でしたが、
正式版は`left_click`のように17個のメンバーツールに分かれています。
ツール結果には`toolset_name`を付ける必要もあります。移行手順は公式ドキュメントに手順つきで載っています。

## 新設されたbrowser useツール

`browser_toolset_20260801`は、自分のアプリケーションが動かすブラウザをClaudeに操作させるツールセットです。
デスクトップ全体ではなく、ブラウザのビューポートの中だけを扱います。

computer useとの違いで大きいのは、画面のピクセルだけでなく「ページの構造を読める」ことです。

- `read_page`でアクセシビリティツリーを読み、要素に`ref_1`のような参照が付く
- `find`で自然言語による要素検索ができる
- `form_input`でフォームの値を直接設定できる
- タブの新規作成・切り替え・一覧・クローズに対応

スクリーンショットを何度も撮り直すより、要素参照と構造読み取りのほうがトークン効率がよいとされています。

### 注意点

- ブラウザを動かすのは自分のアプリ側です。Anthropic側でブラウザがホストされるわけではありません
- Claude API限定で、Amazon Bedrock・Google Cloud・Microsoft Foundryでは使えません
- `javascript_exec`・`file_upload`・`read_console`・`read_network`の4つは既定で無効です
- 公式ドキュメントは、Webページの内容を信用できない入力として扱うよう注意を促しています

## Files APIは外すと応答形式が変わります

ここが今回いちばん気をつけたい部分です。
`/v1/files`と、アップロード済みファイルを参照するMessages APIのリクエストで、
`files-api-2025-04-14`ヘッダーが不要になりました。

ただしリリースノートによれば、ヘッダーなしのリクエストは新しい応答形式になります。
具体的には、アップロード時の`expires_in_seconds`と`expires_at`によるファイル有効期限、
そして一覧取得の`page`・`next_page`によるページングと`ids[]`フィルタです。
ヘッダーを送り続けているリクエストは、これまでどおり動き、従来の応答形式を返します。

つまり「もう不要だから」とヘッダーを消すだけで、レスポンスをパースしている箇所が壊れる可能性があります。
消す前に、一覧取得まわりの処理を確認しておくのが安全です。

一方、Agent Skills・Skills API（`skills-2025-10-02`）と、
Claude EnterpriseのAdmin APIユーザー管理（`ce-user-management-2026-07-13`）は、
ヘッダーを送り続けても動作は変わらないとされています。

## Claude Managed Agents側の更新

同じ8月19日に、エージェント基盤側でも更新が入っています。

- `web_search`・`web_fetch`が到達できるサイトを`allowed_domains`・`blocked_domains`で制限できるようになりました
- `web_fetch`は`max_content_tokens`、`web_search`は`user_location`も指定できます
- セルフホストのサンドボックスでメモリストアをマウントできるようになりました
- Claude Consoleのセッションビューアが刷新され、タイムラインやコスト・イベントを見るInspectorが追加されました

ドメイン制限は、エージェントに外部サイトを読ませる構成でのリスクを減らせます。
社内利用でエージェントを組んでいるなら、真っ先に見ておきたい項目だと考えます（筆者の見方）。

## 何をすればいいか

- ベータヘッダーを付けている箇所を洗い出す
- Skills・Admin APIのヘッダーは、外しても外さなくても動く（優先度は低い）
- Files APIのヘッダーは、外す前に応答形式の差分を確認する
- computer useを使っているなら、正式版への移行は別作業として計画する（リクエスト形状が変わります）
- ブラウザ操作をさせたいなら、computer useではなくbrowser useを検討する

## まとめ

- 2026年8月19日、Claude APIでcomputer use・Files API・Agent Skills・Admin APIユーザー管理がベータを卒業しました
- 同日、ブラウザ操作に特化したbrowser useツールが新設されました
- ヘッダーを外すだけで済むものと、移行作業が必要なものが混ざっています
- とくにFiles APIは、ヘッダーを外すと応答形式が新しいものに切り替わります

ベータ卒業のニュースは地味に見えますが、実装に触る必要があるかどうかが機能ごとに違います。
まとめて外して壊す、というのがいちばんありがちな失敗だと考えます（筆者の見方）。

## 出典

- Claude Platform リリースノート（2026年8月19日・20日の項）: https://platform.claude.com/docs/en/release-notes/overview
- computer use ツール（`computer_toolset_20260801`と移行手順）: https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool
- browser use ツール（`browser_toolset_20260801`）: https://platform.claude.com/docs/en/agents-and-tools/tool-use/browser-use-tool
- Files API（有効期限・ページング・`ids[]`）: https://platform.claude.com/docs/en/build-with-claude/files
- Agent Skills をAPIで使う: https://platform.claude.com/docs/en/build-with-claude/skills-guide
- Claude Managed Agents のツール設定: https://platform.claude.com/docs/en/managed-agents/tools

---

Claude CodeとClaude APIの更新は、この記事のように定期的にまとめています。
「気づかないうちに壊れる」種類の変更を追いたい方は、フォローしてお待ちください。

Claude / Claude Codeを実際の収入につなげる方法は、有料記事のほうで扱っています。
受託・API活用・情報発信といったテーマ別に、手順と数字を具体的に書いています。
興味のある方はプロフィールからご覧ください。

<!--
type: free
title: Claude APIの4機能がベータ卒業：browser useツールも新登場
keywords: Claude API, browser use, computer use, Files API, Agent Skills, betaヘッダー, GA, Managed Agents
target: Claude APIでエージェントやツール連携を実装しているエンジニア・個人開発者
news_date: 2026-08-19
hashtags: #ClaudeAPI #ClaudeCode #AI開発 #エージェント #ブラウザ自動化
-->
