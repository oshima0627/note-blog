# Note Blog - マルチエージェント記事生成システム

## 概要
Claude/Claude Codeに関するNote向け技術記事を、複数エージェントで生成するシステム。

## 記事作成の実行方法

ユーザーが「記事を作成して」と依頼したら、以下のフローを実行する：

### フロー

1. **トピック選定 + 重複チェック**
   - Claude/Claude Codeに関するトピック候補を3〜5件生成
   - `articles/published.json` を読み込み、既存記事とキーワード・テーマが重複するトピックを除外
   - 最も価値のあるトピックを1件選定

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
