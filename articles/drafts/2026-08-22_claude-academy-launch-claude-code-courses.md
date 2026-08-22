# Claude Academy公開：Claude Code・API・MCPの公式講座が集約

※本記事は2026年8月22日時点の公開情報にもとづきます。料金・仕様は変わりやすいため、最新は公式でご確認ください。

## この記事でわかること

- Anthropicが2026年8月20日に学習ハブ「Claude Academy」を公開したこと
- Claude Code・Claude API・MCPについて、どの講座が何レッスンあるのか
- 受講に何が必要か（サインイン・アカウント要件）と、確認できなかった点

## Claude Academyが公開されました

Anthropicは2026年8月20日、公式ブログ「Anthropic's approach to teaching and learning AI」で、学習ハブ **Claude Academy** を公開したと発表しました。URLは `academy.claude.com` です。

公式ブログには、使い方として次の3点が挙げられています。

- 興味のある分野と受講履歴にもとづいて講座を推薦してもらえること
- 受講の進捗とバッジ（badges）を記録できること
- Claudeに講座や学習パスを提案させる「Claude Academy Skill」を導入できること

アクセス方法は「academy.claude.com から直接」または「Claudeのプロフィールメニューの Learn more タブから」と説明されています。

**読者への影響**: これまでClaude Code関連の学習素材は、公式ドキュメント・changelog・有志のブログに散らばっていました。今回、公式が作った講座が1箇所にまとまりました。断片的に追いかけていた知識を、体系的に埋め直す場ができたことになります。

サイトの「すべてのリソース」ページには、2026年8月22日時点で **289 resources** と表示されています。これは講座（course）だけでなく、チュートリアルやユースケースも含んだ総数です。

## Claude Code向けの講座は2本あります

Claude Codeを名前に含む講座は、確認できた範囲で2本です。

### Claude Code 101（12レッスン・1クイズ・約1時間）

レッスン構成は次のとおりです。

- What is Claude Code? / How Claude Code works
- Installing Claude Code / Your first prompt
- The explore → plan → code → commit workflow
- Context management / Code review
- The CLAUDE.md file / Subagents / Skills / MCP / Hooks
- 最後にコースクイズ

「Explore → Plan → Code → Commit」という反復ワークフローが軸になっています。CLAUDE.md・サブエージェント・スキル・MCP・フックまでを1時間の枠でひととおり触る構成です。

### Claude Code in Action（9レッスン・1クイズ・約1時間）

コース説明は「Run long, hands-off Claude Code sessions you can trust: steer, configure, automate, and verify」です。長時間の放置実行を信頼できる形で回す、という主題です。

- Steering long sessions
- A CLAUDE.md that follows
- Verification skills
- Permission modes
- Hooks
- Routines and headless
- GitHub Actions and Code Review
- Trust it: Verifying unsupervised runs
- Plugins

前提条件として「Claude Codeを個別タスクで使っている経験」と「コマンドラインとGitの基本操作」が挙げられています。

**読者への影響**: 101は入門者向けですが、in Action のほうは実務寄りです。ヘッドレス実行・ルーチン・GitHub Actions・無人実行の検証を扱っています。いずれもClaude Codeを自動化に組み込む際、独学で詰まりやすい領域です。

## API・MCP・エージェント関連の講座

開発寄りの講座では、レッスン数に大きな差があります。確認できた主なものは次のとおりです。

- Building with the Claude API：67レッスン・8クイズ・約9時間
- Claude with Amazon Bedrock：65レッスン・8クイズ・約8時間
- Claude with Google Cloud's Vertex AI：66レッスン・9クイズ・約8.5時間
- Introduction to Model Context Protocol：10レッスン・1クイズ・約1時間
- Model Context Protocol: Advanced Topics：11レッスン・1クイズ・約1.5時間
- Introduction to agent skills：6レッスン・約1時間
- Introduction to subagents：4レッスン・約45分
- Claude Platform 101：13レッスン・1クイズ・約1.5時間
- Introduction to Claude Cowork：14レッスン・1クイズ・約2.5時間

**読者への影響**: API講座は約9時間と、腰を据えて取り組む分量です。一方でMCPやサブエージェントの入門は1時間前後で、週末に1本ずつ消化できる規模です。自分の穴に合わせて選べます。

## 受講に必要なもの（確認できたこと・できなかったこと）

Claude Code 101のページには、次の記載がありました。

- 進捗を保存するにはサインインが必要（「Sign in to save progress」）
- 前提として「a Claude account (Pro, Max, or Enterprise) or an API key」が必要

一方で、**受講料についての明記は、筆者が確認した公式ページ（トップ・全リソース一覧・Claude Code 101・公式ブログ）では見つけられませんでした**（2026年8月22日時点）。第三者メディアには「無料」とする記述がありますが、公式の記載を確認できていないため、本記事では断定しません。実際の条件はご自身でご確認ください。

## 下敷きはAnthropic社内の教育プログラムです

公式ブログによれば、Claude Academyの内容はAnthropicが自社の従業員に教えている方法を反映したものです。入社初日のオンボーディングで「4D AI Fluency Framework」やエージェントに何を知らせるかを教えるとされています。その後も「ever-boarding（常時オンボーディング）」と呼ぶ継続プログラムを提供しているそうです。

特徴的なのは、個別の小技ではなく「持続する考え方」を重視すると明言している点です。例として次の2つが挙げられています。

- 「today's AI is the worst AI you'll ever use（今日のAIは、あなたが今後使う中で最も性能の低いAIだ）」
- 「verify in proportion to the stakes（賭け金に見合った検証をせよ）」

**筆者の見方**: 後者はClaude Codeユーザーに直接効く指針だと思います。生成された全コードを同じ濃度でレビューするのは現実的ではありません。壊れたときの損害に応じて検証の深さを変える、という基準は運用に落としやすいはずです。

## Claude Academy Skillの実体

公式ブログが触れている「Claude Academy Skill」は、GitHubの `anthropics/skills` リポジトリに `academy-guide` という名前で置かれています。SKILL.mdの説明文は次のとおりです。

> Stop and check this skill before finishing any reply to a question about how to use Claude or a Claude product — it recommends matching courses, tutorials, and use cases from Claude Academy (academy.claude.com), Anthropic's learning hub.

Claudeへの「使い方」の質問に答える際、Academyの該当講座を合わせて案内するためのスキルです。カタログを取得したうえで提案する設計で、記憶から講座名を作り出さないこと、推薦は最大2件までとすることが方針に書かれています。

## 出典

- Anthropic公式ブログ「Anthropic's approach to teaching and learning AI」（2026年8月20日）: https://claude.com/blog/anthropics-approach-to-teaching-and-learning-ai
- Claude Academy トップ: https://academy.claude.com/
- Claude Academy 全リソース一覧: https://academy.claude.com/all
- Claude Code 101: https://academy.claude.com/courses/claude-code-101
- Claude Code in Action: https://academy.claude.com/courses/claude-code-in-action
- academy-guide スキル（anthropics/skills）: https://github.com/anthropics/skills/tree/main/skills/academy-guide

---

Claude Code・Claude APIの最新情報を追いかけて、実務で使える形にまとめています。
更新情報を見逃したくない方は、フォローしていただけると届きます。

「学ぶ」の先にある「稼ぐ」については、有料記事で具体的な手順を書いています。
受託・API収益化・情報発信など、収益化ルートごとに実践手順をまとめていますので、
気になるテーマがあればあわせてご覧ください。

#ClaudeCode #Claude #Anthropic #AI学習 #エンジニア

<!--
type: free
title: Claude Academy公開：Claude Code・API・MCPの公式講座が集約
keywords: Claude Academy, Claude Code, Claude API, MCP, AI Fluency, academy-guide, バッジ, 学習
target: Claude Code・Claude APIを使うエンジニア・個人開発者
news_date: 2026-08-20
hashtags: #ClaudeCode #Claude #Anthropic #AI学習 #エンジニア
-->
