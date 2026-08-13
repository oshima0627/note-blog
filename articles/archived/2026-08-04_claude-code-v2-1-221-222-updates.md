# Claude Code v2.1.222：ワークツリー隔離の抜け穴を修正

※本記事は **2026年8月4日時点** の情報です。料金・仕様は変わりやすいため、最新は公式情報でご確認ください。

## この記事でわかること

- ワークツリーで隔離したはずのセッションが、メイン側のリポジトリを壊せてしまう不具合が修正された件
- Bashの権限チェックをすり抜けられる経路が2つ塞がれた件（zshの `[[ ]]`、Windowsのクォート付きパス）
- 認証情報ファイルの「マスク」対応など、v2.1.221で入った新機能と、更新の確認方法

Claude Code の v2.1.221 と v2.1.222 が、いずれも2026年8月4日付でリリースされました（GitHub Releases の公開日時）。npm の `@anthropic-ai/claude-code` も、8月4日時点の `latest` は 2.1.222 です。

今回はセキュリティ・権限まわりの修正が中心です。特に「隔離しているつもりだった」人に効く内容なので、順に見ていきます。

## 1. ワークツリー隔離の抜け穴（v2.1.222）

まず今回いちばん影響が大きい修正です。公式チェンジログには、次の修正が挙げられています。

> Fixed worktree-isolated sessions and their subagents being able to run destructive git commands against the main checkout; isolation now applies to file edits and Bash in every session type

意訳すると、「ワークツリーで隔離したセッションとそのサブエージェントが、メインのチェックアウトに対して破壊的なgitコマンドを実行できてしまう問題を修正した。隔離はすべてのセッション種別で、ファイル編集とBashの両方に適用されるようになった」という内容です。

**読者への影響**

Claude Code には、サブエージェントを専用のgitワークツリーで動かす隔離オプションがあります。並列でエージェントを走らせるときに、お互いの変更がぶつからないようにするための仕組みです。

この修正内容を素直に読むと、修正前は「ファイル編集は隔離されていたが、Bash経由のgitコマンドはメイン側に届いてしまうケースがあった」ということになります。`git checkout` や `git reset` のような破壊的な操作が、隔離されているつもりのセッションからメイン側に及ぶ可能性があった、と理解するのが自然です（この読み解きは筆者の見方で、Anthropicが影響範囲を個別に説明したわけではありません）。

隔離を前提に自動実行を回している人ほど、優先して更新したい修正です。

## 2. 権限チェックをすり抜ける経路が塞がれた（v2.1.221）

v2.1.221には、Bashツールの権限チェックに関する修正が2件入っています。

> Fixed a Bash tool permission-check bypass where zsh could execute hidden commands in `[[ ]]` regex conditionals; affected commands now prompt for permission

zshの `[[ ]]`（条件式）の中に隠したコマンドが、権限チェックを通らずに実行できてしまう問題です。修正後は、該当するコマンドで許可を求めるようになりました。

> Fixed PowerShell permission checks mishandling paths containing quote characters on Windows; such paths now prompt for approval

Windows側では、クォート文字を含むパスの扱いを誤る問題が修正されました。こちらも修正後は承認を求めます。

**読者への影響**

どちらも「許可していないコマンドが、許可を求めずに動きうる」という性質の不具合です。権限ルール（allow/deny）を細かく書いて運用している人ほど、前提が崩れていたことになります。

なお、いずれも修正後の挙動は「プロンプトが出る」です。更新後にこれまで通っていたコマンドで確認を求められるようになったら、この修正が理由の可能性があります。

## 3. フックによる自動許可がバックグラウンドで効きすぎていた（v2.1.222）

権限まわりではもう1件、v2.1.222の修正があります。

> Fixed PreToolUse auto-allow hooks bypassing tool restrictions in background agent tasks (summaries, compaction, renames)

`PreToolUse` フックで自動許可を設定していると、バックグラウンドのエージェントタスク（要約・コンパクション・リネーム）でツール制限を迂回できてしまう問題の修正です。

フックで承認を自動化している構成は、便利な反面「どこまで効くのか」が見えにくい部分です。自動許可フックを書いている人は、更新後に意図した範囲で効いているかを一度確認しておくとよさそうです。

## 4. v2.1.221の新機能：認証情報ファイルのマスクとFocus view

修正だけでなく、新機能も入っています。

- **認証情報ファイルの `mode: "mask"`（Linux / WSL）**: サンドボックス内のコマンドには実際の値ではなくセンチネル（ダミー値）を読ませ、外部へ出ていく通信のときにサンドボックスプロキシが本物の値へ置き換える仕組みです。ファイル全体、または `extract` 正規表現で捕捉した範囲だけをマスクできます。macOSではファイルのマスクは `deny` にフォールバックします
- **VSCode の Focus view**: ツールの実行ログを、ターンごとの折りたたみサマリの裏に隠す表示モードです。`Ctrl+Alt+F` またはコマンドパレットの「Claude Code: Toggle Focus view」で切り替えます
- **`claude-api` スキルに `prompt-audit` サブコマンド追加**: 古いモデル向けに書かれたパターンが残っていないか、プロンプトやツール説明を監査するためのものです

マスク機能について補足です。公式のサンドボックス設定ドキュメントでは、環境変数の `mask` について「プロキシがリクエスト内容を見る必要があるため `network.tlsTerminate` を設定すること」「設定しないと認証は失敗する（fail closed）」と明記されています。ファイル側のマスクは今回追加されたばかりで、同ドキュメントの記述はまだ環境変数中心に見えます。仕組みが同じプロキシ置換である以上、同様の前提と考えられますが、導入前に公式ドキュメントの最新版を確認することをおすすめします。

## 5. 気づきにくい挙動変更

最後に、エラーにはならないが動きが変わる項目をまとめます。

- **Remote Control の自動起動**: リポジトリ内の設定（`.claude/settings.json` / `.claude/settings.local.json`）からは有効化できなくなりました。無効化は引き続き可能で、有効化は `/config` からユーザースコープで行います
- **`/fork` の挙動**: フォークしたセッションは、元のセッションのチェックアウトではなく、自分専用のワークツリーを作るようになりました
- **バックグラウンドセッション**: 作業を残すためにコミットとプッシュを行い、必要なときだけドラフトPRを作り、`CLAUDE.md` のgit指示に従い、最後に必ず成果物の場所を報告するよう変更されました
- **ultraplan機能の削除**: v2.1.222で削除されました
- **`/status`** がセッション種別（`interactive` か、`attached` / `unattended` のバックグラウンドジョブか）を表示するようになりました

## いま何をすればいいか

やることはシンプルです。

1. `claude --version` で手元のバージョンを確認する
2. v2.1.220以前なら更新する（npmで入れている場合は `npm install -g @anthropic-ai/claude-code@latest`）
3. ワークツリー隔離や `PreToolUse` の自動許可フックを使っているなら、更新後に想定どおり隔離・制限されているかを確認する

特に3番目が重要です。今回の修正は「隔離や権限チェックが期待通りに効いていなかった」種類のものなので、更新して終わりではなく、自分の構成で境界を引き直せているかを見ておく価値があります。

## 出典

- Claude Code CHANGELOG（公式）: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md
- Claude Code Releases（公開日時）: https://github.com/anthropics/claude-code/releases
- Configure the sandboxed Bash tool（公式ドキュメント）: https://code.claude.com/docs/en/sandboxing
- npm `@anthropic-ai/claude-code`: https://www.npmjs.com/package/@anthropic-ai/claude-code

---

Claude Code のアップデートは週に何度も入るため、権限・サンドボックスまわりの変更は見落としやすいところです。このアカウントでは、こうした更新やAI業界のニュースを継続的にまとめています。役に立ったと感じたらフォローしていただけると励みになります。

「Claude Code を使って実際に稼ぐ」ところまで踏み込んだ実践記事は、有料記事としてまとめています。受託・個人開発・情報発信のマネタイズに興味がある方はそちらもご覧ください。

#ClaudeCode #Claude #AI #生成AI #エンジニア

<!--
type: free
title: Claude Code v2.1.222：ワークツリー隔離の抜け穴を修正
keywords: Claude Code, v2.1.221, v2.1.222, ワークツリー隔離, 権限バイパス, サンドボックス, PreToolUseフック, 認証情報マスク
target: Claude Codeを日常的に使うエンジニア・個人開発者
news_date: 2026-08-04
hashtags: #ClaudeCode #Claude #AI #生成AI #エンジニア
-->
