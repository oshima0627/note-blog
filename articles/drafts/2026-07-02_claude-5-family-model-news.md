# Claude 5ファミリー登場：Claude Codeのモデル最新まとめ

**この記事は2026年7月2日時点の情報です。** 料金・仕様は変わりやすいため、最新情報は必ずAnthropic公式でご確認ください。

**この記事でわかること**

- 新モデル「Claude Fable 5」「Claude Mythos 5」の発表内容と特徴
- 提供一時停止から再開までの経緯と、現在の利用条件・料金
- Claude Codeでの現行モデル（Opus 4.8 / Haiku 4.5）との使い分け

## Claude Fable 5 / Mythos 5とは何か

Anthropicは2026年6月9日、新モデル「Claude Fable 5」と「Claude Mythos 5」を発表しました。両者は同じ基盤モデルを共有する、いわば双子のモデルです。

- **Claude Fable 5**: 一般提供される、Anthropic史上もっとも高性能なモデル。安全対策（セーフティ分類器）を組み込んだうえで広く公開されています
- **Claude Mythos 5**: 同じ能力を持ちますが、一部の安全対策を外した限定版。サイバー防御事業者などを対象とした「Project Glasswing」経由でのみ提供されます

公式発表によると、Fable 5はソフトウェアエンジニアリングを含むほぼすべてのベンチマークで最先端の性能を達成したとされています。

技術仕様も大きく変わりました。コンテキストウィンドウ（一度に扱える文章量）は標準で100万トークン、出力は最大12.8万トークンです。また「アダプティブ思考」が常時有効で、思考の深さはeffortパラメータで調整する方式になりました。

**Claude Codeユーザーへの影響**: 大規模リポジトリの読み込みや長時間のエージェント作業に強いモデルが選択肢に加わりました。一方でFable 5には安全分類器があり、サイバーセキュリティ関連などの一部リクエストは拒否されることがあります。拒否時はOpus 4.8など別モデルへのフォールバックで対応する設計です。

出典: Anthropic公式発表、Claude Platform公式ドキュメント（末尾リンク参照）

## 提供停止から再開までの経緯

Fable 5は発表直後に異例の展開をたどりました。時系列で整理します。

- **6月9日**: Fable 5 / Mythos 5をリリース
- **6月12日**: 米国政府が輸出規制を適用し、提供を一時停止。Amazonの研究者がFable 5のセーフガードを回避する手法を発見したことが背景と公式声明で説明されています
- **6月26日**: Mythos 5が米国組織向けに再開
- **6月30日**: 米商務省がFable 5への輸出規制を解除
- **7月1日**: Claude Platform、Claude.ai、Claude Code、Claude Coworkで全世界のユーザー向けに提供再開

つまり本記事執筆時点（7月2日）は、再開直後のタイミングです。

**Claude Codeユーザーへの影響**: 「使えたはずのモデルが突然使えなくなる」ことが実際に起きました。特定モデル前提のワークフローを組んでいる場合は、フォールバック先を決めておくと安心です。

## 料金と利用条件（2026年7月2日時点）

API料金は、Fable 5 / Mythos 5ともに以下のとおりです。

- 入力: 100万トークンあたり10ドル
- 出力: 100万トークンあたり50ドル

Anthropicによると、これは前世代のMythos Preview比で半額以下とのことです。ただし後述のOpus 4.8（入力5ドル/出力25ドル）と比べると2倍の価格です。

サブスクリプション（Pro / Max / Team / 一部Enterprise）では、再開にともない**7月7日まで週間使用量の50%を上限に追加費用なし**で利用できます。それ以降は「使用クレジット」の購入が必要になる案内が出ています。

注意点として、Fable 5 / Mythos 5は30日間のデータ保持が必須で、ゼロデータ保持の対象外です。機密性の高い業務で使う場合は確認が必要です。

**Claude Codeユーザーへの影響**: Claude Codeでは/modelコマンドからモデルを切り替えられます。7月7日までの無料枠期間は、自分のタスクでFable 5を試す好機と言えます（筆者の見方）。

## 現行モデルとの使い分け（Opus 4.8 / Haiku 4.5）

Fable 5がすべてを置き換えるわけではありません。現行モデルの位置づけを整理します。

- **Claude Opus 4.8**（2026年5月28日リリース）: コーディングとエージェントタスクに強い主力モデル。料金は入力5ドル/出力25ドル（100万トークンあたり）でOpus 4.7から据え置き。Claude Codeの「dynamic workflows」（多数のサブエージェントに作業を分散する機能）と同時に発表されました
- **Claude Haiku 4.5**: 小型・高速・低価格のモデル。料金は入力1ドル/出力5ドル。定型的な修正や軽いタスク向きです

使い分けの目安は次のとおりです（筆者の見方を含みます）。

- 日常のコーディング全般: Opus 4.8を基本に
- 特に難しい設計・長時間のエージェント作業: Fable 5を検討
- 単純作業・コスト重視: Haiku 4.5
- Fable 5が拒否したリクエスト: Opus 4.8等へフォールバック

Fable 5は高性能ですが価格も高いため、全タスクをFable 5にするのではなく、難所だけ投入するのがコスト効率の良い使い方と考えられます。

## まとめ

- 6月9日にClaude 5ファミリー（Fable 5 / Mythos 5）が登場し、輸出規制による停止を経て7月1日に全世界で再開
- Fable 5はClaude Codeでも利用可能。サブスクでは7月7日まで無料枠あり
- 料金はOpus 4.8の2倍。普段はOpus 4.8、難所でFable 5という使い分けが現実的

再開直後で状況が動いています。最新情報は公式発表をご確認ください。

## 出典

- [Claude Fable 5 and Claude Mythos 5（Anthropic公式発表）](https://www.anthropic.com/news/claude-fable-5-mythos-5)
- [Introducing Claude Fable 5 and Claude Mythos 5（Claude Platform公式ドキュメント）](https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5-and-claude-mythos-5)
- [Redeploying Claude Fable 5（Anthropic公式声明）](https://www.anthropic.com/news/redeploying-fable-5)
- [Introducing Claude Opus 4.8（Anthropic公式発表）](https://www.anthropic.com/news/claude-opus-4-8)
- [Introducing Claude Haiku 4.5（Anthropic公式発表）](https://www.anthropic.com/news/claude-haiku-4-5)
- [Anthropic says Trump admin has lifted export controls（CNBC報道）](https://www.cnbc.com/amp/2026/06/30/anthropic-says-trump-admin-has-lifted-export-controls-on-claude-fable-5-and-mythos-5.html)

---

最後までお読みいただきありがとうございます。この記事が役に立ったら、**フォロー**していただけると今後のニュースまとめを見逃しません。

当アカウントでは、Claude/Claude Codeを「使う」だけでなく**収益につなげる**ための有料記事も公開しています。副業での案件獲得やClaude APIを使った個人開発マネタイズに興味がある方は、あわせてご覧ください。

<!--
type: free
title: Claude 5ファミリー登場：Claude Codeのモデル最新まとめ
keywords: Claude Fable 5, Claude Mythos 5, Claude 5ファミリー, Claude Code, Claude Opus 4.8, Claude Haiku 4.5, モデル比較, 輸出規制
target: Claude Codeを使う（使い始めたい）エンジニア・個人開発者
news_date: 2026-07-02
hashtags: #ClaudeCode #Claude #AIニュース #Anthropic #生成AI
-->
