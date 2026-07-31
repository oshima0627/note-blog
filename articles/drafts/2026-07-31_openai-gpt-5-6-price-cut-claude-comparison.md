# GPT-5.6が最大80%値下げ：Claudeユーザーが見るべき点

※本記事は**2026年7月31日時点**の公開情報にもとづきます。料金・仕様は変わりやすいため、最新は各社の公式ページでご確認ください。

## この記事でわかること

- OpenAIが2026年7月30日に実施したGPT-5.6の値下げ内容（どのモデルがいくらになったか）
- 同日時点のClaude各モデルのAPI料金と、8月31日に控える期限
- 単価だけで比較すると実費とズレる理由（トークナイザ・キャッシュ・バッチ）

## 1. OpenAIがGPT-5.6の2モデルを値下げ

OpenAIは2026年7月30日、GPT-5.6シリーズのうち2モデルのAPI料金を引き下げました。GPT-5.6シリーズ（Sol / Terra / Luna）は2026年7月9日に公開されたばかりで、公開から約3週間での改定です。

100万トークンあたりの入力／出力単価は次のとおりです。

- **GPT-5.6 Luna**（最小・最安）: 1ドル / 6ドル → **0.20ドル / 1.20ドル**（約80%減）
- **GPT-5.6 Terra**（中間）: 2.50ドル / 15ドル → **2ドル / 12ドル**（約20%減）
- **GPT-5.6 Sol**（最上位）: **5ドル / 30ドル**（据え置き）

あわせて、APIの「Priority processing」が同日付で「**Fast mode**」に改称されました。OpenAIの公式ドキュメントによると、gpt-5.6-solで標準処理より最大2.5倍速く、料金は標準に対して割増になります。割増幅は公式ドキュメントに明記がなく、報道では「2倍」とされています。既存の `service_tier: "priority"` 指定はそのまま動作し、`"fast"` でも指定できます。

値下げの理由についてOpenAIは、モデル設計・推論システム・周辺ソフトウェアの効率化によるものと説明していると報じられています。

## 2. Claude側の料金（2026年7月31日時点）

比較のため、Anthropicの公式pricingページに記載されている100万トークンあたりの単価を挙げます。

- **Claude Opus 5**: 5ドル / 25ドル
- **Claude Sonnet 5**: 2ドル / 10ドル（**2026年8月31日まで**の導入価格。9月1日から3ドル / 15ドル）
- **Claude Haiku 4.5**: 1ドル / 5ドル
- **Claude Fable 5 / Mythos 5**: 10ドル / 50ドル
- **Fast mode**（リサーチプレビュー、Opus 5・Opus 4.8対象）: 10ドル / 50ドル

割引の仕組みも公式に明記されています。Batch APIは入力・出力とも50%オフ、プロンプトキャッシュのヒット時は基本入力単価の0.1倍です。実運用ではこの2つで実費が大きく変わります。

なお、Claude Sonnet 5の導入価格が8月31日で終わる点は当ブログでも7月3日に触れましたが、**期限まで残り1か月**です。従量課金でSonnet 5を使っている方は、9月以降のコスト再計算を先にやっておくと安全です。

## 3. 単価の単純比較が実費とズレる3つの理由

**理由1：トークナイザが違う**

Anthropicの公式pricingページには、Claude 4.7以降のモデル（Opus 5・Sonnet 5を含む）とClaude Mythos Previewが新しいトークナイザを使っており、**同じテキストでも約30%多くトークンを生成する**と注記されています。増加幅は内容と処理内容によります。つまり「1トークンあたりの単価」を各社横並びで比べると、実際の請求額とはズレます。比較するなら、自分の代表的なワークロードを実際に流してドル建ての実費を見るのが確実です。

**理由2：キャッシュとバッチの効き方が違う**

同じ処理でも、プロンプトキャッシュが効く設計（長い共通コンテキストを繰り返し使う）か、非同期でよい処理（Batch API）かで実費は数分の一になります。定価表だけの比較では、この差が抜け落ちます。

**理由3：料金と適性は別軸**

コーディングやエージェント用途では、安いモデルで試行回数が増えれば総コストは下がりません。安さは選定基準の一つでしかない、というのが**筆者の見方**です。

## 4. Claude Codeユーザーへの影響

整理すると次のようになります。

- **Claude CodeをPro / Maxのサブスクで使っている場合**：今回のOpenAIの値下げも、Claudeのトークン単価も、直接の請求には影響しません。影響するのは使用量上限のほうです。
- **API / Agent SDKを従量課金で使っている場合**：影響します。特に大量の分類・要約・抽出といった「賢さより量」のバッチ処理は、モデル選定を見直す価値があります。
- **どちらの場合も**：8月31日で終わるSonnet 5の導入価格は、9月以降の見積もりに反映しておく必要があります。

いま取れる具体的な行動は3つです。第一に、直近1か月のAPI利用をタスク種別（コーディング / 分類・抽出 / 要約）に分けて棚卸しすること。第二に、キャッシュとBatch APIが適用できていない処理がないか確認すること。第三に、9月1日以降のSonnet 5単価で見積もりを引き直すことです。

## 出典

- OpenAI公式: Advancing the price-performance frontier with GPT-5.6 — https://openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6/
- OpenAI公式ドキュメント: Fast mode（Priority processingは2026年7月30日にFast modeへ改称） — https://developers.openai.com/api/docs/guides/fast-mode
- InfoWorld: OpenAI drops GPT-5.6 Luna and Terra API prices by up to 80% — https://www.infoworld.com/article/4203865/openai-drops-gpt-5-6-luna-and-terra-api-prices-by-up-to-80.html
- ITBrief: OpenAI cuts GPT-5.6 API prices & adds faster Sol mode — https://itbrief.com.au/story/openai-cuts-gpt-5-6-api-prices-adds-faster-sol-mode
- CNBC: OpenAI cuts prices for two of its GPT-5.6 AI models — https://www.cnbc.com/2026/07/30/open-ai-price-cut-gpt.html
- Anthropic公式: Claude Platform Pricing（モデル単価・キャッシュ・Batch・トークナイザ注記） — https://platform.claude.com/docs/en/about-claude/pricing

※GPT-5.6シリーズの公開日（2026年7月9日）、改定前の単価、およびSolの据え置き単価は報道ベースの情報です。OpenAI公式の発表ページは執筆時にアクセスできなかったため、数値は上記の複数報道とOpenAI公式ドキュメントを突き合わせて確認しています。Sol単価は必ず公式の料金ページでご確認ください。

## おわりに

値下げの発表が続くと「乗り換えるべきか」と考えたくなりますが、実費を決めるのは定価表ではなく、自分のワークロードの形です。まずは棚卸しから始めるのが遠回りに見えて確実だと考えています。

このアカウントでは、Claude / Claude Codeの最新情報を一次情報ベースでまとめています。更新を見逃したくない方はフォローしていただけると嬉しいです。

「稼ぐ」側の具体的な設計図（受託の値付け・契約・原価計算など）は有料記事にまとめていますので、あわせてご覧ください。

<!--
type: free
title: GPT-5.6が最大80%値下げ：Claudeユーザーが見るべき点
keywords: GPT-5.6, OpenAI 値下げ, API料金, Claude Sonnet 5, Claude Opus 5, トークナイザ, プロンプトキャッシュ, Batch API
target: Claude / Claude CodeをAPI従量課金またはサブスクで使うエンジニア・個人開発者
news_date: 2026-07-30
hashtags: #Claude #ClaudeCode #OpenAI #API料金 #生成AI
-->
