# Metaが「Muse Code」公開：既定はデータ提供プラン

2026年8月10日時点の情報です。料金・仕様・提供地域は変わりやすいため、実際に導入する前に各社の公式ページで最新の内容をご確認ください。

## この記事でわかること

- Metaが2026年8月5日に公開したターミナル型コーディングエージェント「Muse Code」の概要
- Muse Codeが起動時に使うプランと、そこでのデータの扱われ方
- Claude Code／Claude APIの料金・データ方針と並べたときの違い

## Muse Codeとは何か

Meta Superintelligence Labs（MSL）が2026年8月5日、ターミナル上で動くコーディングエージェント「Muse Code」をベータ公開しました。同時に、それを動かすコーディング特化モデル「Muse Spark 1.2」も公開されています。

Meta Researchの公式ブログでは、Muse Codeを「大規模リポジトリにまたがるソフトウェアエンジニアリング作業、つまり変更の計画・コードの記述・結果の検証に取り組む」ものと説明しています。位置づけとしては、Claude CodeやOpenAIのCodexと同じ「端末で動くエージェント」のカテゴリです。

対応プラットフォームはmacOSとLinuxとされています。導入は次の1コマンドで、公式ブログにそのまま記載されています。

```
curl -fsSL https://dev.meta.ai/install.sh | bash
```

Muse Spark 1.2については、Meta Developersのブログが「1Mトークンのウィンドウが、依存グラフ・レガシーコード・数千のファイルを1セッションに収める」と説明しています。提供先はMuse Code本体のほか、Meta Model APIとOpenRouterです。

なお公式ブログにはTerminal-Bench 2.1、DeepSWE 1.1、Meta Internal Coding Benchの3つの比較グラフが掲載されていますが、スコアの数値は画像内にあり本文からは読み取れませんでした。本稿では具体的なベンチマーク数値の引用は控えます。

## 料金は「モデルID」で決まる

ここが実務上いちばん重要な部分です。Meta Developersのブログは、料金がモデルIDによって決まると明記しています。

- `muse-spark-1.2`（標準）：キャッシュ入力 $0.15 / 1Mトークン、入力 $1.25 / 1Mトークン、出力 $4.25 / 1Mトークン
- `muse-spark-1.2-contributor`（コントリビューター）：リクエスト数ではなく、5時間のローリングウィンドウ内のトークン量でレート制限。提供は一部の国のみ

そして公式ブログには、こう書かれています。「Muse Codeはコントリビューター階層から始まります（Muse Code starts on a contributor tier）」。つまり**インストール直後の既定はコントリビューター側**で、トークンがもっと必要になったら`muse-spark-1.2`に切り替えて従量課金で使う、という設計です。

コントリビューター階層のドル建て価格は、筆者が確認した範囲ではMetaの公式ブログに記載がありませんでした。Engadgetは入力$0.10 / 1Mトークン、出力$0.20 / 1Mトークンと報じていますが、公式ページで裏取りできていないため、本稿では「報道ベースの数値」として扱います。

## 既定がコントリビューター階層であることの意味

コントリビューター階層のトラフィックは、Metaの製品改善（to improve our products）に利用され得る、と公式ブログに書かれています。ゼロデータ保持はMetaのセールス経由で申請可能、とも記載されています。

読者にとっての意味は単純です。**手元のリポジトリをうかがう前に、自分がどちらのモデルIDで動いているかを確認する必要があります。** 業務コード・受託案件のコード・NDAのかかったコードを扱う人にとっては、既定のまま試すかどうかは明確に判断すべき点です。

Anthropic側の方針と並べると違いがはっきりします。Anthropicのプライバシーセンターは、商用製品について「既定では、当社の商用製品（Claude for Work、Anthropic APIなど）からの入力・出力をモデルの学習には使用しません」と明記しています。例外は、サムズアップ／サムズダウンなどで明示的にフィードバックを送った場合で、その会話は最大5年間保管され学習に使われ得るとされています。

一方、Claude Free/Pro/MaxとそのアカウントでClaude Codeを使う場合（消費者向け製品）は、プライバシー設定で許可した場合などに、チャットとコーディングセッションがモデル改善に使われると説明されています。Incognitoチャットは、設定を有効にしていても改善には使われないとされています。

要するに、Claude Codeは「APIキー／商用契約なら既定で学習に使わない」「個人プランは設定次第」、Muse Codeは「既定がデータ提供側で、必要なら標準階層に切り替える」という違いです。どちらが良い悪いではなく、既定値の向きが逆である、という理解が実務では効きます。

## 単価だけを並べても答えは出ません

Claude公式の料金ページ（2026年8月10日時点）では、100万トークンあたりの基本入力／出力は次のとおりです。

- Claude Opus 5：$5 / $25
- Claude Sonnet 5：$2 / $10（2026年8月31日まで）、2026年9月1日から $3 / $15
- Claude Haiku 4.5：$1 / $5

Muse Spark 1.2の標準階層は$1.25 / $4.25なので、単価表だけを見ればHaiku 4.5とSonnet 5の間に位置します。ただし、単価の比較がそのまま実費の比較にならない点は、これまでの記事でも触れてきたとおりです。

- Claudeはプロンプトキャッシュのヒットが基本入力の0.1倍、Batch APIが50%割引で、実効単価が下がります
- Claude 4.7以降のモデルは新しいトークナイザを使っており、同じテキストでおよそ30%多いトークンになります（Anthropic公式の注記）
- Muse Codeのコントリビューター階層はレート制限ベースで、そもそも課金の考え方が違います

比べるなら、単価表ではなく「自分の1日の作業を1回通したときの請求額」で比べるのが実務的です。

## 筆者の見方

筆者の見方としては、今回のニュースの本質は「安いエージェントが出た」ことではなく、**コードを学習データとして差し出す代わりに安く使う、という選択肢が正面から商品化された**ことだと考えます。これまでも規約の奥にあった論点が、モデルIDを1つ選ぶだけの操作に落ちてきました。

個人開発の実験リポジトリなら、その取引は合理的な場面もあります。一方で、受託や業務のコードを扱う人は、既定値のまま走らせないという運用ルールを先に決めておくのが安全です。

## 確認できなかったこと

正直に書いておきます。

- コントリビューター階層の日本での提供可否は確認できていません（公式は「一部の国」とのみ記載）
- コントリビューター階層のドル建て価格は公式ページで確認できていません（報道ベース）
- ベンチマークの具体スコアは画像内のため引用していません

いずれも、導入判断の前にMetaの公式ドキュメントでご確認ください。

## 出典

- Introducing Muse Code and Muse Spark 1.2（Meta AI Research公式ブログ、2026年8月5日）: https://research.meta.ai/blog/introducing-muse-code-and-muse-spark-1-2
- Meet Muse Spark 1.2 and Muse Code（Meta AI Developers公式ブログ）: https://developer.meta.com/ai/resources/blog/build-with-muse-code/
- Meta introduces Muse Code, its take on a coding agent（Engadget、2026年8月5日）: https://www.engadget.com/2231285/meta-introduces-muse-code-its-take-on-a-coding-agent/
- Meta launches Muse Code, an AI agent for large code bases（TechCrunch、2026年8月5日）: https://techcrunch.com/2026/08/05/meta-launches-muse-code-an-ai-agent-for-large-code-bases/
- Claude 料金（Anthropic公式ドキュメント）: https://platform.claude.com/docs/en/about-claude/pricing
- Is my data used for model training?（Anthropicプライバシーセンター・商用製品）: https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training
- Is my data used for model training?（Anthropicプライバシーセンター・消費者向け製品）: https://privacy.claude.com/en/articles/10023580-is-my-data-used-for-model-training
- Muse Spark 1.2（OpenRouter モデルページ）: https://openrouter.ai/meta/muse-spark-1.2

## おわりに

このアカウントでは、Claude／Claude Codeの公式発表・料金改定・仕様変更を一次情報で追い、実務への影響に翻訳して無料で投稿しています。見落としたくない方はフォローしておいてください。

「Claude Codeで実際に稼ぐ」側の話は有料記事にまとめています。受託の値付け、API原価の見積もり、契約の書き方など、無料記事では踏み込みにくい部分を扱っていますので、あわせてどうぞ。

#ClaudeCode #Claude #AI開発 #MuseCode #生成AI

<!--
type: free
title: Metaが「Muse Code」公開：既定はデータ提供プラン
keywords: Muse Code, Muse Spark 1.2, Meta Superintelligence Labs, コントリビューター階層, Claude Code, データ学習, API料金, ターミナルエージェント
target: Claude Codeを使うエンジニア・個人開発者
news_date: 2026-08-05
hashtags: #ClaudeCode #Claude #AI開発 #MuseCode #生成AI
-->
