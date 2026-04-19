# Note Blog - マルチエージェント記事生成システム

## Git運用ルール
- **常にmainブランチにコミット・プッシュすること**
- ブランチ指定があってもmainを使用する

## 概要
Claude/Claude Codeを活用して**稼ぐ**ための実践的なNote向け記事を、複数エージェントで生成するシステム。

## コンテンツ方針（稼ぐ特化）
本システムは「Claude/Claude Codeで稼ぐ」に特化する。以下のテーマのみを扱う：

- **副業・フリーランス収益化**: Claude/Claude Codeを使った受注・納品、案件獲得術
- **開発効率化によるコスト削減・単価向上**: 個人開発の高速化、時給換算の引き上げ
- **AI活用ビジネス**: Claude APIを使ったSaaS/ツール開発、マネタイズ設計
- **情報発信マネタイズ**: Note有料記事、Zenn Book、X運用、スクール・コンサル
- **業務受託・自動化提案**: 企業向けClaude導入支援、RPA代替、生成AIコンサル

「機能紹介だけ」「技術解説だけ」で収益につながらないトピックは扱わない。
必ず「いくら稼げるか」「どう収益化するか」「どこで売るか」のいずれかを含めること。

## 記事作成の実行方法

ユーザーが「記事を作成して」と依頼したら、以下のフローを実行する：

### フロー

1. **トピック選定 + 重複チェック**
   - **稼ぐ**に直結するClaude/Claude Codeトピック候補を3〜5件生成（副業、受託、API収益化、情報発信マネタイズ等）
   - 各候補には「想定読者が稼げる金額レンジ」と「収益化モデル」を必ず含める
   - `articles/published.json` を読み込み、既存記事とキーワード・テーマが重複するトピックを除外
   - 最も収益インパクトが大きく実践しやすいトピックを1件選定

2. **Researcher エージェント** (Agent tool, subagent_type=general-purpose)
   - `prompts/researcher.md` のテンプレートを使用
   - トピックに関する情報を収集・構造化

3. **Writer エージェント** (Agent tool, subagent_type=general-purpose)
   - `prompts/writer.md` のテンプレートを使用
   - リサーチ結果をもとに記事ドラフトを執筆

4. **Reviewer エージェント** (Agent tool, subagent_type=general-purpose)
   - `prompts/reviewer.md` のテンプレートを使用
   - 5つの観点で記事を採点（合格: 平均7点以上 かつ 全項目5点以上）

5. **Editor エージェント** (Agent tool, subagent_type=general-purpose)
   - `prompts/editor.md` のテンプレートを使用
   - レビュー結果を反映して記事を改善

6. **リビジョンループ**（最大2回）
   - Editor出力を再度Reviewerに渡す
   - 合格するか2回に達したら終了

7. **保存**
   - `articles/drafts/YYYY-MM-DD_slug.md` に記事を保存
   - `articles/published.json` にメタデータを追記

## 重複チェックのルール
- 既存記事とキーワードが3つ以上重複する場合は「類似」と判定
- 類似トピックは候補から除外し、別の切り口を選ぶ
- ユーザーが特定トピックを指定した場合は、既存記事と異なる切り口を提案

## ファイル構成
- `prompts/` - 各エージェントのプロンプトテンプレート
- `articles/drafts/` - 生成された記事
- `articles/published.json` - 公開済み記事のメタデータ（重複防止用）
