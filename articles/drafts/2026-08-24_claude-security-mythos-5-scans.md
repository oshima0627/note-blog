# Claude SecurityがMythos 5に：Claude Code側の使い分けも整理

この記事は2026年8月24日時点の情報です。提供条件や対象プランは変わることがあるため、最新は公式ページでご確認ください。

この記事でわかること

- Anthropicが8月21日に発表した、Claude SecurityのMythos 5対応の中身
- Enterpriseプランでない人が、Claude Codeで使える脆弱性スキャンの選択肢
- 「書きながら防ぐ」「まとめて洗う」「PRで止める」の使い分け

## 8月21日に発表されたこと

Anthropicは2026年8月21日、公式ブログ「Bringing the cybersecurity capabilities of Claude Mythos 5 to more defenders」で、Claude Securityのスキャンが Claude Mythos 5 で動くようになったと発表しました。Mythos 5 は、同社がこれまでで最も高いサイバーセキュリティ能力を組み込んだとするモデルです。

Claude Security は、コードベースを走査して脆弱性を見つけ、人間のレビュー前提で修正パッチ案を出すサービスです。公式サイトによると、現在は Claude Enterprise 向けの公開ベータで、管理コンソールから有効化します。GitHubリポジトリを接続してスキャンし、検出結果には CWE（共通脆弱性タイプ一覧）の分類、確信度、深刻度、推奨される修正が付きます。

公式サイトは、検出した内容として「メモリ破壊、インジェクション、認証バイパス、複雑なロジックの誤り」を挙げています。また、見つけた項目はそのまま出すのではなく、Claude自身が反対の立場から検証する工程を通してから報告される、と説明されています。

同じ発表では、次の2つも示されました。

- Defender Advantage Fund（0xDAF）の設立。オープンソースの脆弱性修正、スキャンと修正の自動化、新しい防御手法の実験に取り組む組織へ、3,500万ドル分のクレジットを提供するとしています
- Cyber Verification Program の拡大。審査を通った防御側の利用者に対して Opus・Sonnet の制限を緩和する既存プログラムを広げ、Mythos 級のアクセスも後続で提供するとしています

## 読者への影響：Enterpriseでなくても入口はあります

ここが本題です。マネージド版の Claude Security は Enterprise プラン向けで、個人開発者はそのまま使えません。ただし Claude Code 側に、別系統の入口が2つ用意されています。

いずれも Mythos 5 で動くわけではない点は、先に押さえておいてください。Claude Code のプラグインは、あなたが Claude Code で使えるモデルを使います。

## 1. まとめて洗う：Claude Security プラグイン（ベータ）

Claude Code 公式ドキュメントによると、Claude Security プラグインは、セッション内で複数のClaudeエージェントによる脆弱性スキャンを実行します。アーキテクチャを把握し、脅威モデルを作り、脆弱性を探し、報告前に別のエージェントが各検出項目を独立に検証する、という流れです。

導入と実行は次のとおりです。

- `/plugin install claude-security@claude-plugins-official` でインストールします
- `/claude-security` を実行すると、コードベース全体のスキャン、変更分のスキャン、パッチ案の作成という3つのメニューが出ます
- 結果はリポジトリ内の `CLAUDE-SECURITY-<タイムスタンプ>/` に書き出されます
- パッチは自動適用されません。`patches/F1.patch` のような形で置かれ、`git apply` するかどうかは利用者の判断です

前提条件は、有料プランと Claude Code v2.1.154 以降、`python3` 3.9.6 以降です。Proプランの場合は `/config` の Dynamic workflows を有効にする必要があります。スキャンは自分のプランの使用量を消費し、時間もトークンも相応にかかると明記されています。

ドキュメントは、マネージド版が届かない場所に届くことをプラグインの利点として挙げています。GitLab や Bitbucket のリポジトリ、外部から接続できないネットワーク上のコードなどです。一方で「スキャンは非決定的で、同じコードでも2回のスキャンで違う項目が出うる」とも明記されています。定期的に回す前提の道具、という位置づけです。

## 2. 書きながら防ぐ：security guidance プラグイン

もう1つは security guidance プラグインです。公式ドキュメントに「すべてのプランで利用できます」と書かれており、Claudeが書いたコードをその場でレビューさせるものです。

`/plugin install security-guidance@claude-plugins-official` で入れると、以降は自動で動きます。レビューは3段階です。

- ファイル編集ごと：`eval(` や `pickle`、`dangerouslySetInnerHTML` などの危険なパターンを文字列一致で検出します。モデル呼び出しがないため追加コストはかかりません
- ターン終了ごと：そのターンの差分を、別のClaudeがバックグラウンドでレビューします。認可バイパスやSSRFなど、文字列一致では拾えない問題が対象です
- Claudeがコミット・プッシュしたとき：周辺コードまで読む、より深いレビューが走ります

レビューを書いたClaude自身にやらせない設計になっている点が特徴です。ターン終了時とコミット時のレビューは、別の呼び出しとして新しいコンテキストで実行されます。ただし、いずれの層も書き込みやコミットを止めるわけではなく、見落としもあり得るとドキュメントは明記しています。

`.claude/claude-security-guidance.md` に自分のリポジトリ固有のルールを書けます。「/admin 配下は必ず権限チェックを通す」といった内容です。不要なら `SECURITY_GUIDANCE_DISABLE=1` で止められます。

## 使い分けの整理

公式ドキュメントの整理を、そのまま並べます。

- 書きながら：security guidance プラグイン（全プラン）
- 単発で今のブランチを見る：`/security-review` コマンド
- まとめて深く洗う：Claude Security プラグイン（有料プラン、ベータ）
- プルリクエスト時：Code Review（TeamとEnterpriseプラン）
- 監視つきのマネージド運用：Claude Security 製品（Enterpriseプラン）
- CI：既存の静的解析・依存関係スキャナ

筆者の見方ですが、個人開発者がまず入れるなら security guidance プラグインだと思います。追加コストがかからない層が含まれており、放っておいても動くためです。そのうえで、リリース前など節目で Claude Security プラグインを回す形が現実的でしょう。

なお、Fable 5 を使っていると「Fable 5's safeguards flagged this message」という表示が出て、処理が自動的に Opus に切り替わることがあります。ドキュメントはこれを想定内の挙動としており、スキャン自体は完了するとしています。

## 注意点

公式ドキュメントは「Claudeは間違えることがあるため、提案されたパッチは必ずレビューしてください。重要なシステムでは特にそうです」と明記しています。パッチが自動適用されない設計も、これを前提にしたものです。

また、これらは既存のセキュリティツールを置き換えるものではない、とも書かれています。静的解析や依存関係スキャンと並べて使うことが想定されています。

## 出典

- Bringing the cybersecurity capabilities of Claude Mythos 5 to more defenders（Anthropic公式ブログ、2026年8月21日）: https://claude.com/blog/bringing-claude-mythos-5-to-more-defenders
- Claude Security（製品ページ）: https://claude.com/product/claude-security
- Claude Security is now in public beta（Anthropic公式ブログ、2026年4月30日）: https://claude.com/blog/claude-security-public-beta
- Scan your codebase for vulnerabilities（Claude Code公式ドキュメント）: https://code.claude.com/docs/en/claude-security
- Catch security issues as Claude writes code（Claude Code公式ドキュメント）: https://code.claude.com/docs/en/security-guidance

## おわりに

このアカウントでは、Claude / Claude Code の公式発表を一次情報で確認して、日本語でまとめています。更新を追いたい方はフォローしていただけると励みになります。

Claude Code を使って実際に稼ぐ側の話（受託・API収益化・情報発信）は、有料記事のほうで手順まで書いています。あわせてどうぞ。

<!--
type: free
title: Claude SecurityがMythos 5に：Claude Code側の使い分けも整理
keywords: Claude Security, Mythos 5, 脆弱性スキャン, Claude Code, プラグイン, security-guidance, CWE, Defender Advantage Fund
target: Claude Codeを使うエンジニア・個人開発者
news_date: 2026-08-21
hashtags: #ClaudeCode #Claude #セキュリティ #AI #個人開発
-->
