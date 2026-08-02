# DeepSeek V4 Flash 0731が公開：Claude Codeの接続先にもできます

※本記事は **2026年8月2日時点**の公開情報にもとづきます。料金・仕様は変更されやすいため、最新は各社の公式ページでご確認ください。

## この記事でわかること

- DeepSeekが2026年7月31日に公開した「DeepSeek-V4-Flash-0731」の中身と、公式が出したベンチマーク結果
- ClaudeのAPI料金と並べたときの価格差（1M（100万）トークンあたり）
- DeepSeek公式ドキュメントが案内している、Claude Codeの接続先を切り替える方法と、その前に確認したい点

---

## 何が公開されたのか

DeepSeekは2026年7月31日、**DeepSeek-V4-Flash-0731** を公開しました（公開日は同社モデル名および同日付の複数の技術メディア報道によります）。モデルカードには「DeepSeek-V4-Flashの正式リリースであり、プレビュー版に取って代わる」と記載されています。モデルの重みはHugging Faceで**MITライセンス**として公開されています。

DeepSeekのAPIドキュメントには「`deepseek-v4-flash` モデルはDeepSeek-V4-Flash-0731に更新された。呼び出し方法は変わらず、`deepseek-v4-flash` を指定すれば最新版が使える」と記載されています。すでにこのモデル名を使っている実装は、自動的に新しい版に切り替わることになります。

公式のモデルカードによると、0731版はアーキテクチャを大きく変えたものではなく、**エージェント能力を中心に再学習したもの**とされています。モデルカードには「活性化パラメータ数がはるかに少ないにもかかわらず、下記ベンチマークでDeepSeek-V4-Pro（プレビュー）を上回る」と書かれています。

**読者への影響**: 重みがMITで公開されているため、自前環境での検証や社内利用の選択肢が増えます。一方、APIをすでに使っている場合はモデルの挙動が変わっている可能性があるため、プロンプトやエージェントの回帰確認をおすすめします。

## 公式ベンチマーク：Opus 4.8との比較が載っています

興味深いのは、DeepSeekのモデルカードが比較対象にClaude Opus 4.8を含めている点です。数値はすべてDeepSeekが公表したものです。順に「0731版 / プレビュー版 / V4-Proプレビュー / GLM-5.2 / Opus-4.8」です。

- Terminal Bench 2.1: 82.7 / 61.8 / 72.1 / 81.0 / **85.0**
- DeepSWE: 54.4 / 7.3 / 12.8 / 46.2 / **58.0**
- Cybergym: 76.7 / 38.7 / 52.7 / 記載なし / **83.1**
- NL2Repo: 54.2 / 39.4 / 38.5 / 48.9 / **69.7**
- Toolathlon-Verified: 70.3 / 49.7 / 55.9 / 59.9 / **76.2**
- Agents' Last Exam: 25.2 / 15.8 / 16.5 / 23.8 / **25.7**

読み方の注意が2つあります。ひとつは、**掲載された全項目でOpus 4.8が最上位**である点です。0731版はプレビュー版から大きく伸びましたが、Claudeの上位モデルを抜いたという結果ではありません。

もうひとつは、**比較にClaude Opus 5が含まれていない**点です。Opus 5は2026年7月24日に公開されており、このモデルカードの比較対象には入っていません。ベンチマークはあくまで公表元の測定条件によるものと考えたほうが安全です。

## 料金：桁が違います

DeepSeekの公式料金ページによると、`deepseek-v4-flash` は次の通りです（1Mトークンあたり）。

- 入力（キャッシュミス）: 0.14ドル
- 入力（キャッシュヒット）: 0.0028ドル
- 出力: 0.28ドル
- コンテキスト長: 1M / 最大出力: 384K

参考に、`deepseek-v4-pro` は入力0.435ドル・出力0.87ドルです。

一方、Anthropicの公式料金ページにあるClaudeの料金は次の通りです。

- Claude Opus 5: 入力5ドル / 出力25ドル
- Claude Sonnet 5: 入力2ドル / 出力10ドル（2026年8月31日までの導入価格。9月1日から3ドル / 15ドル）
- Claude Haiku 4.5: 入力1ドル / 出力5ドル

単価だけを見れば1桁以上の差があります。ただし比較には注意点があります。Anthropicの料金ページには、**Claude 4.7以降のモデルは新しいトークナイザを使っており、同じテキストで約30%多くトークンを生成する**という注記があります。つまり単価の比だけでは実際の請求額の比になりません。

またDeepSeekの料金ページには、**ピーク／オフピーク料金の導入が「近日」として予告**されています。ピーク時間帯（北京時間9:00〜12:00および14:00〜18:00）は通常の2倍と記載されていますが、開始日は本稿執筆時点で公表されていません。長期のコスト前提に置くのは早いと考えられます。

## Claude Codeの接続先として使う方法

DeepSeekは**Anthropic互換のエンドポイント**を提供しています。公式ドキュメントに記載されている内容は次の通りです。

- ベースURL: `https://api.deepseek.com/anthropic`
- 設定する環境変数: `ANTHROPIC_BASE_URL` と `ANTHROPIC_API_KEY`
- モデル名のマッピング: Claude Opus系は `deepseek-v4-pro` に、Claude SonnetおよびHaiku系は `deepseek-v4-flash` に振り分けられる

DeepSeek側のドキュメントでは、この設定によりClaude Codeから同社のモデルを使えると案内されています。

**筆者の見方**として、実際に切り替える前に確認しておきたい点を挙げます。

第一に、**課金の枠組みが変わります**。Claude CodeをPro/Maxのサブスクリプションで使っている場合、接続先を変えれば従量課金に移ります。安いのはトークン単価であって、月額との比較は使用量次第です。

第二に、**Claude Codeの各機能が同じように動く保証はありません**。互換エンドポイントはあくまでDeepSeek側の提供であり、Anthropicが動作を保証しているものではありません。サブエージェントやツール周りの挙動は、切り替え後に自分のワークフローで確かめる必要があります。

第三に、**送信するコードの扱い**です。業務コードを流す場合は、利用規約とデータの取り扱いを自分で読んで判断してください。ここは価格差では埋められない論点です。

## まとめ

- DeepSeek-V4-Flash-0731は2026年7月31日公開。重みはMIT、APIはパブリックベータ
- DeepSeek公式のベンチマークでは、掲載全項目でOpus 4.8が上位。Opus 5は比較対象に含まれていない
- 単価はDeepSeekが大幅に安い。ただしトークナイザ差とピーク料金の予告があり、単価比＝請求額比ではない
- Anthropic互換エンドポイントでClaude Codeの接続先にできるが、課金枠組み・動作保証・データ取り扱いは別途確認が必要

コスト削減の候補として検証する価値はあります。一方で「そのまま乗り換える」という判断は、自分の代表的なタスクで実測してからでも遅くないと考えられます。

---

## 出典

- DeepSeek-V4-Flash-0731 モデルカード（Hugging Face）: https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-0731
- DeepSeek API ドキュメント（Anthropic互換API）: https://api-docs.deepseek.com/guides/anthropic_api
- DeepSeek API 料金: https://api-docs.deepseek.com/quick_start/pricing
- Anthropic 公式料金ページ: https://platform.claude.com/docs/en/about-claude/pricing
- Anthropic「Introducing Claude Opus 5」: https://www.anthropic.com/news/claude-opus-5
- MarkTechPost（2026年7月31日、公開日の報道）: https://www.marktechpost.com/2026/07/31/deepseek-upgrades-deepseek-v4-flash-0731-with-major-agentic-and-coding-gains/

---

このアカウントでは、Claude / Claude Codeの最新情報と、実務での使い方を継続的にまとめています。
役に立ったと感じたら、フォローしておくと次回の更新が届きます。

「Claude Codeで実際に稼ぐ」ための具体的な手順（受託・単価設計・納品フロー）は、有料記事にまとめています。あわせてご覧ください。

<!--
type: free
title: DeepSeek V4 Flash 0731が公開：Claude Codeの接続先にもできます
keywords: DeepSeek V4 Flash, DeepSeek-V4-Flash-0731, Claude Code, Anthropic互換API, API料金, Terminal Bench, MITライセンス, Opus 5
target: Claude Code / Claude APIを使うエンジニア・個人開発者
news_date: 2026-07-31
hashtags: #DeepSeek #ClaudeCode #AI開発 #API料金 #生成AI
-->
