# 旧Workbenchが8月17日終了：保存プロンプトは要エクスポート

※本記事は**2026年8月3日時点**の情報です。料金・仕様・日程は変わりやすいため、実行前に必ず公式ドキュメントで最新を確認してください。

Claude Console（旧Anthropic Console）の**Workbench（レガシー版）が、2026年8月17日でアクセス終了**します。あわせて、プロンプトの生成・改善・テンプレート化を行う**experimental prompt tools API も同日に廃止**されます。

保存したプロンプトやevalは新Workbenchに引き継がれません。心当たりのある方は、期限までにエクスポートが必要です。

## この記事でわかること

- 旧Workbenchで何が終わり、いつまでに何をすべきか
- 同日に廃止される3つのAPIエンドポイントと、その影響範囲
- 同じ時期にもう1つ来ている期限（Opus 4.1のAPI引退）

## 何が終わるのか

Anthropicの公式リリースノート（2026年7月17日付）には、次の2点が記載されています。

- Claude Console内の**レガシー版Workbench**（`platform.claude.com/workbench`）はサンセットされ、**アクセスは2026年8月17日で終了**する
- **保存済みのプロンプト・変数（variables）・eval は、更新版のWorkbenchではサポートされない**

更新版のWorkbenchは `platform.claude.com/playground` に置かれています。Claude公式ヘルプセンターの説明によれば、更新版はツール定義・構造化出力・コードエクスポートに対応する一方、**プロンプト履歴の保存やプロンプトの評価（eval）には対応しません**。作業中の内容はAnthropic側のサーバーに保存されず、ブラウザ内にとどまる仕様とされています。

つまり、更新版は「保存して育てる場所」ではなく「その場で試して、コードに書き出す場所」に位置づけが変わります。

### 読者への影響

Claude APIを使っていて、Consoleにプロンプトを保存・バージョン管理していた方は、**そのデータが8月17日以降アクセスできなくなります**。ヘルプセンターは、残したいプロンプト・完了結果・evalがある場合は期限前にエクスポートするよう案内しています。

エクスポートは、リリースノートによると**Workbench上のバナー、および Organizational Settings（組織設定）から**行えます。

Claude Codeだけを使っていてConsoleのWorkbenchを触っていない方は、この点の影響はありません。

## experimental prompt tools API も同日廃止

見落としやすいのがこちらです。同じリリースノートに、次の3つのエンドポイントがWorkbenchとともに**2026年8月17日に廃止**されると明記されています。

- `/v1/experimental/generate_prompt`（プロンプト生成）
- `/v1/experimental/improve_prompt`（プロンプト改善）
- `/v1/experimental/templatize_prompt`（テンプレート化）

**廃止後、これらへのリクエストはエラーを返す**とされています。

### 読者への影響

自作ツールやCI、社内の運用スクリプトからこれらを呼んでいる場合、8月17日以降に**動かなくなります**。実験的（experimental）エンドポイントは目立たない場所で使われがちなので、影響の有無はコードを検索して確かめるのが確実です。

リポジトリ全体を `v1/experimental/` で grep する、あるいはClaude Codeに「このリポジトリでexperimentalエンドポイントを呼んでいる箇所を洗い出して」と依頼すれば、数分で棚卸しできます。

なお、これらのAPIに対する**代替エンドポイントは、公式リリースノートの当該記載では案内されていません**（2026年8月3日時点で筆者が確認した範囲）。

## 8月17日までにやること

期限までの実務的な手順を、影響が大きい順に挙げます。

1. **旧Workbenchを開き、保存物の有無を確認する**。プロンプト・変数・evalが残っていれば、バナーまたは組織設定からエクスポートする
2. **`v1/experimental/generate_prompt` / `improve_prompt` / `templatize_prompt` の利用箇所をコード検索する**。ヒットしたら8月17日までに置き換えるか、機能を落とす判断をする
3. **エクスポートしたプロンプトをGit管理に移す**。更新版Workbenchは履歴を保存しないため、バージョン管理はリポジトリ側で持つのが現実的です
4. **evalはコードとして書き直す**。Anthropicの公式ドキュメントには、完全一致・コサイン類似度・LLMによる採点などをコードで実装する評価の書き方が掲載されています

筆者の見方としては、3と4は今回の廃止がなくても遅かれ早かれ必要になる作業です。Console上の保存機能に依存していたチームにとっては、プロンプトとevalをコード側の資産に移す良いきっかけになると考えられます。

## 同時期のもう1つの期限：Opus 4.1のAPI引退

Anthropicのモデル廃止ページによると、`claude-opus-4-1-20250805` は**2026年8月5日にClaude APIから引退**予定です（2026年6月5日に廃止告知）。推奨移行先は `claude-opus-4-8` とされています。

同ページには、公開モデルの引退について**少なくとも60日前に通知する**方針も記載されています。8月は5日と17日に期限が並ぶ形になるため、API連携をお持ちの方はまとめて確認しておくと安全です。

## まとめ

- 旧Workbenchのアクセス終了：**2026年8月17日**。保存プロンプト・変数・evalは更新版に引き継がれない
- `/v1/experimental/generate_prompt`・`improve_prompt`・`templatize_prompt` も**同日廃止**。以降はエラー
- あわせて `claude-opus-4-1-20250805` が**8月5日にAPI引退**

いずれも「知らないまま期限を過ぎると復旧できない」種類の変更です。エクスポートとコード検索だけなら数十分で終わります。早めに済ませておくことをおすすめします。

## 出典

- Claude Platform リリースノート（2026年7月17日の項目）: https://platform.claude.com/docs/en/release-notes/api
- How do I use the Workbench?（Claude ヘルプセンター）: https://support.claude.com/en/articles/8606378-how-do-i-use-the-workbench
- Model deprecations（Claude Platform Docs）: https://platform.claude.com/docs/en/about-claude/model-deprecations
- Using the Evaluation Tool（Claude Platform Docs）: https://platform.claude.com/docs/en/test-and-evaluate/eval-tool
- 更新版Workbench: https://platform.claude.com/playground

---

Claude / Claude Codeの公式アップデートや、料金・仕様変更のニュースを日本語でまとめています。見落とすと困る期限モノを中心に追っているので、**フォロー**しておくと取りこぼしを防げます。

Claude Codeで実際に稼ぐための実践記事（受託・API収益化・情報発信マネタイズ）は有料記事にまとめています。あわせてどうぞ。

#Claude #ClaudeCode #AI #生成AI #API

<!--
type: free
title: 旧Workbenchが8月17日終了：保存プロンプトは要エクスポート
keywords: Claude Console, Workbench, レガシー廃止, prompt tools API, generate_prompt, improve_prompt, templatize_prompt, Claude Opus 4.1
target: Claude API / Claude Codeを使うエンジニア・個人開発者
news_date: 2026-07-17
hashtags: #Claude #ClaudeCode #AI #生成AI #API
-->
