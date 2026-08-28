# HANDOFF

最終更新: 2026-08-28（vs比較3本目を公開＋初心者向け有料記事の下書きを作成）

## いま何をしているのか

目的: note販売で月10万円。方針は本人決定で「記事販売一本」。

やることは2つ。
1. 流入を6倍にする（「vs比較 × 初心者」型）← **3本公開済み**
2. **商品を読者に合わせる** ← いまここ。**初心者向け有料記事の下書きが完成。未公開**

## 実態（note API で実測。数字は 2026-08-27 時点の監査）

詳細: `analytics/2026-08-27_note-account-audit.md` / `_sales-reality.md` / `_audience-product-mismatch.md`

- 公開115本 / 全期間 40,875ビュー / フォロワー259 / 直近30日 1,677ビュー
- 生涯売上 ¥13,880（14ヶ月・手数料前）。2026年7月 ¥0 / 8月 ¥0
- 未振込 ¥6,940。**本人判断で据え置き。たまってから申請する**
- 売上ゼロの構造的原因: 流入は初心者向けに集中、¥3,980帯7本はすべて事業者向け。
  **来ている人と売っている物が別人向け**

## 今回やったこと（2026-08-28）

### 1. vs比較の3本目を公開した

**https://note.com/oshima0627/n/ncf5da0d7b604**（2026-08-28 16:05 JST / 無料）
「Claude Code vs GitHub Copilot｜初心者はどっちから始めるべき？【2026年8月版】」
`articles/published.json` に id:66 を追記済み。

### 2. 初心者向け有料記事の下書きを作った（**未公開**）

- ファイル: `articles/drafts/2026-08-28_claude-code-first-webapp-deploy.md`
- 「プログラミング未経験から、Claude Codeで最初のWebアプリを公開するまで【全手順・実機検証済み】」
- 想定価格 **¥3,980** / 本文 **9,517字**（空白除く）/ 大見出し14・小見出し13 / 表0・太字0・バッククォート0
- **有料ライン: 「第0章 先にお金の話をします」の直前**（無料部分で実物URLと検証環境まで見せる）
- 埋め込みCTA2（¥1,980 `nf6dc3eb8e78d` + 入口A ¥500 `nd69e07a7c204`）
- `published.json` には**まだ追記していない**（既存65件はすべて note_key 付き。公開時に id:67 を追記する）

### 3. 記事のために実機で手順を最後まで通した（HANDOFF の制約に対応）

サンプルアプリ「時給ログ」を作って実際に公開した。

- **公開URL: https://jikyu-log.oshima6-27.workers.dev**（Cloudflare Workers・稼働中）
- リポジトリ: https://github.com/oshima0627/jikyu-log（**パブリック**）
- 中身は HTML/CSS/JS の3ファイル＋`wrangler.jsonc` のみ。ビルド無し・localStorage 保存

**当初 GitHub Pages でデプロイしたが、本人の指示で Workers に切り替えた。**
Pages は `gh api -X DELETE repos/oshima0627/jikyu-log/pages` で削除済み。

## 検証済みの事実（実際に画面に出した出力のみ）

### 公開した無料記事（note API `/api/v3/notes/ncf5da0d7b604`）

- `status:"published"` / `price:0` / `publish_at:2026-08-28T16:05:21+09:00`
- `<h2>` 9個 / `<table>` 0個 / `<figure>` 2個 / `**` 0 / `|` 0
- CTA両方（`nd69e07a7c204` / `nf6dc3eb8e78d`）が本文に存在
- ハッシュタグ5件を **`data.hashtag_notes`** で確認（`data.hashtags` は空に見えるので誤判定注意）
- 転記ミスゼロを **len 4038 / hash 1019815352** の照合で確認

### 実機検証（2026-08-28・すべて実行して出力を確認）

環境: Windows 11 (10.0.26200) / Node v24.1.0 / npm 11.3.0 / git 2.49.0.windows.1 /
Claude Code **2.1.233** / wrangler **4.127.0**

- アプリの計算: 150分・5,000円 を入力 → 画面に「今週の作業 2.5 時間 / 報酬 5,000 円 / 実質時給 2,000 円」
- 生成ファイルの実サイズ: index.html 939 / style.css 792 / app.js 1,991 バイト（計3,722）
- `npx serve -l 5173 .` → `INFO Accepting connections at http://localhost:5173`、HTTP 200
- **サブパス配下のパス検証**: `/jikyu-log/` の下で `./style.css` → **200**、`/style.css` → **404**
- `git init` の既定ブランチが **master** になった（git 2.49.0.windows.1・init.defaultBranch 未設定）
- `npx wrangler deploy` 実出力: 3ファイル upload 1.01秒 / Uploaded 4.06秒 / Deployed 1.91秒（計約7秒）
- 公開後の挙動: `/` `/style.css` `/app.js` → **200**、`/index.html` → **307**（`/` へリダイレクト）、
  存在しないパス → **404**
- GitHub Pages（切替前）: 有効化から15秒間隔ポーリングの3回目で 200。Pages API は現在 404（削除済み）

### 公式ページで裏取りした事実

- Claude Code は Pro/Max/Team/Enterprise/Console が必要。**Freeプランでは使えない**（公式に明記）
- Claude Pro 月$20（年払い実質$17・$200前払い）/ Max $100から
- Windows導入: PowerShell `irm https://claude.ai/install.ps1 | iex` /
  CMD `curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd` /
  WinGet `winget install Anthropic.ClaudeCode`
- ネイティブインストーラーは **Node.js 不要**。npm経由なら Node.js 22以上
- Workers 無料枠: 1日10万リクエスト。**静的アセットへのリクエストは無料かつ無制限**。有料は月$5から
- Workers 静的サイトは `main` 不要、`assets.directory` だけでよい
- note手数料: 事務手数料 クレカ5%/キャリア15%/PayPay7%/AmazonPay7%/noteポイント10%/PayPal6.5%、
  プラットフォーム利用料（売上−事務手数料）の10%、振込手数料270円。
  公式の計算例: 1,000円クレカ1件 → 振込585円

## 未検証のもの

- **有料記事はまだ note に投稿していない。** note_key 無し・`published.json` 未追記
- **note で有料記事を出す操作（価格設定・有料ラインの位置指定）は一度もやっていない。**
  `analytics/cta-funnel-plan.md` の手順は無料記事のもの。**有料化の画面操作は未知**
- 手順は **Windows 11 でしか通していない**。macOS / Linux は未検証（記事にもその旨を明記済み）
- wrangler の**初回ログイン画面は見ていない**（検証環境が認証済みだったため。記事にも明記済み）
- **旧 GitHub Pages URL `https://oshima0627.github.io/jikyu-log/` がまだ HTTP 200 を返す。**
  Pages 自体は削除済み（API は 404）なので CDN キャッシュの残り。**いつ落ちるかは未確認**
- vs比較3本とCTA16本の効果はまだ測っていない（最短で 2026-09-10 以降）

## 次にやること

1. **有料記事を note に公開する（本人の許可待ち）。** 手順は無料記事と同じだが、
   公開設定画面で「有料」を選び、価格 **¥3,980** と**有料ラインの位置**を指定する必要がある。
   有料ラインは原稿末尾のコメントに書いた位置（第0章の直前）
2. 公開できたら `published.json` に id:67 を追記（`type:"paid"` / `price:3980` / `note_key` / `note_url`）し、
   原稿先頭に「公開済み: URL」のコメントを足す
3. **検証用リポジトリとWorkerの扱いを決める**（記事の実物サンプルとして残す / 削除する）。
   削除するなら `gh repo delete oshima0627/jikyu-log` と `npx wrangler delete`。
   **残す場合、記事内のURLが生きている必要がある**
4. 主力 ¥1,980 記事 `nf6dc3eb8e78d` にクロスセルを入れる（現在リンク0本）
5. 有料26本の棚卸し（FX・競馬・AI BGM など Claude と無関係な商品が7本以上）
6. 2週間後に `/api/v1/stats/pv?filter=monthly` でビュー変化を測る

## 触ってはいけないところ

- **記事で扱う製品は、料金ページだけでなく製品の概要ページを必ず開いてから書く。**
  1本目（vs Cursor `n54370e748c01`）で「ターミナル専用」「Node.js が必要」の2件を公開後に訂正した
- **手順記事は実機で通してから書く。** 通していない部分は「未検証」と本文に明記する
- **note の本文に Markdown 記法を持ち込まない。** `**` も表もバックティックも生テキストで出る
- **noteエディタ: Enter は段落を分割しない（brになる）。** 段落は `text/html` の paste で入れる。
  埋め込みカードは「段落を空にしてから `text/plain` の URL を paste」。**複数なら後ろから**
- **大見出しは Ctrl+Alt+2**（JS選択と併用可）。ただし**取りこぼすので index 一覧を照合して再実行する**
- **JS でカーソルを置いてから `type` しない**（英数字が脱落する）
- **数値IDのエディタURLを開いて保存しない。** key形式を使う
- **`.ProseMirror` が出るまで（約10秒）保存しない**
- **パスワード・本人確認情報は Claude が入力しない。** 売上確認・振込は本人が行う
- **振込申請を「次にやること」として再提案しない。** 2026-08-27 に本人が判断済みの保留
- **公開（note への投稿・外部サービスへのデプロイ）は毎回、本人の許可を取ってから実行する**
- **政治記事（立憲民主党・自民党・参政党）と株価予想記事に商品CTAを貼らない**
- **「Claude Code企業導入成功事例：売上10億円増加」（540ビュー）は数値未確認。** 導線に組み込まない
- 記事の自動生成ルーティン2本は停止したまま。ニュース量産は流入も売上も生まないので再開しない
- `articles/published.json` は**末尾に追記するだけ**。JSON を再書き出しすると `8.0` → `8` の
  無関係な差分が出るので、出たら戻す
- 出典が取れない数値・事例は書かない。**案件相場は出典が取れなかったので有料記事に金額を書いていない**
- リモートに作業ブランチを作らず、`git push origin HEAD:main` で main に直接反映する
- 空の下書き `n012952dc5512` が1件残っている（操作ミス由来・実害なし）
