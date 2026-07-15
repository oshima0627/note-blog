# Claude Opus 4.1がAPIから引退へ：8月5日までに移行を

2026年7月15日時点の情報です。料金・仕様・日付は変わることがあるため、最新は必ず公式ドキュメントでご確認ください。

Anthropicは、旧世代モデル「Claude Opus 4.1」をClaude APIから引退（リタイア）させる予定です。引退日は2026年8月5日。この日を過ぎると、該当モデルへのAPIリクエストはエラーを返します。APIやSDKでOpus 4.1を直接使っているアプリを持つ方は、期限までに移行が必要です。

## この記事でわかること

- Claude Opus 4.1がいつ・どうなるのか（引退日と影響）
- 何に移行すればよいか（推奨モデルと確認手順）
- Anthropicの廃止ポリシーと、同時期の他モデルの動き

## Claude Opus 4.1の引退：日程と推奨移行先

Anthropicの公式「Model deprecations」ページによると、Claude Opus 4.1の扱いは次の通りです。

- 対象モデルID: `claude-opus-4-1-20250805`
- 廃止（deprecated）通知: 2026年6月5日
- 引退（retirement）日: 2026年8月5日
- 推奨移行先: Claude Opus 4.8（`claude-opus-4-8`）

Anthropicは「Deprecated（非推奨）」を、モデルはまだ動くが推奨されない状態と定義しています。引退日を過ぎると「Retired（引退）」となり、リクエストは失敗します。つまり8月5日以降、`claude-opus-4-1-20250805`を指定したAPI呼び出しはエラーになる、ということです。

### 読者への影響

影響を受けるのは、主にClaude APIやAgent SDKでモデルIDに`claude-opus-4-1-20250805`を明示指定しているケースです。

- APIを直接叩く自作アプリ・バッチ・SaaSでOpus 4.1を使っている場合、8月5日までに`claude-opus-4-8`などへ切り替えないと停止します。
- Claude Code（CLI）を既定設定のまま使っている場合、既定モデルはSonnet 5系などに移行済みのため、Opus 4.1を明示指定していなければ直接の影響は小さいと考えられます。ただし設定やスクリプトで旧モデルを指定していないか確認するのが安全です。
- なお、この日程はAnthropic運用のプラットフォーム（Claude API、Claude Platform on AWS、Microsoft Foundry）が対象です。Amazon BedrockやGoogle Cloud（Vertex AI）経由は各社が別の引退スケジュールを持つため、利用中の方はそれぞれの公式表で確認してください（筆者の見方として、ここは見落としやすい点です）。

出典: [Model deprecations - Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/model-deprecations)

## 自分が使っているか確認する方法

「そもそも自分がOpus 4.1を使っているか分からない」という場合、公式は使用状況の監査手順を案内しています。

- Claude ConsoleのUsage（使用状況）ページを開く
- 「Export」をクリックしてCSVを書き出す
- CSVでAPIキー別・モデル別の使用状況を確認する

これで旧モデルを呼んでいる箇所を特定し、引退日前に更新の優先順位を付けられます。

出典: [Model deprecations - Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/model-deprecations)

## 同じ時期に動く、もう1つの引退

Opus 4.1と同時期に、もう1つ注意したい引退があります。

- Claude Mythos Preview（`claude-mythos-preview`）が2026年7月21日に引退予定
- 移行先はClaude Mythos 5（`claude-mythos-5`）

こちらは7月21日と、Opus 4.1（8月5日）より先に期限が来ます。プレビュー版を試用していた方は、より早い対応が必要です。

出典: [Model deprecations - Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/model-deprecations)

## 補足：パラメータ側の変更も

モデルだけでなく、リクエストのパラメータにも変更があります。公式ページによると、`temperature`・`top_p`・`top_k`は、Claude Opus 4.7以降（Opus 4.8を含む）とClaude Sonnet 5では、既定値以外を設定すると400エラーを返すとされています。

移行時にこれらのパラメータを渡しているコードは、削除してプロンプト側で挙動を調整する方法が推奨されています。Opus 4.1から4.8へ移す際は、モデルIDの差し替えだけでなくこの点も合わせて確認すると安全です。

出典: [Model deprecations - Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/model-deprecations)

## Anthropicの廃止ポリシーを知っておく

今回のような引退は今後も定期的に起こります。仕組みを知っておくと慌てずに済みます。公式ページでは、モデルのライフサイクルを次の4段階で説明しています。

- Active（有効）: 完全にサポートされ、利用が推奨される
- Legacy（レガシー）: 更新は止まり、将来廃止される可能性がある
- Deprecated（非推奨）: まだ動くが推奨されず、推奨移行先と引退日が割り当てられる
- Retired（引退）: 利用不可。リクエストは失敗する

また通知については、公開モデルの引退の「少なくとも60日前」に、稼働中のデプロイを持つ顧客へ通知するとされています。今回のOpus 4.1も、6月5日通知・8月5日引退でちょうど60日の間隔です。通知はメールとドキュメントの両方で行われるため、Anthropicからのメールを見落とさないことが実務上のポイントになります。

出典: [Model deprecations - Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/model-deprecations)

## まとめ

- Claude Opus 4.1（`claude-opus-4-1-20250805`）は2026年8月5日にAPIから引退。以降のリクエストは失敗します。
- 推奨移行先はClaude Opus 4.8（`claude-opus-4-8`）。
- Console のUsage → Exportで自分の利用箇所を確認できます。
- Mythos Previewは7月21日引退と、さらに早い期限があります。
- 移行時は`temperature`等のパラメータ廃止も合わせて確認しましょう。

料金・日付・仕様は今後変わる可能性があります。移行の前に、必ず公式ドキュメントで最新情報を確認してください。

---

## 出典

- [Model deprecations - Claude Platform Docs（公式）](https://platform.claude.com/docs/en/about-claude/model-deprecations)
- [Claude Platform release notes - Claude Platform Docs（公式）](https://platform.claude.com/docs/en/release-notes/overview)

（本記事は上記の公式ドキュメントを基に、2026年7月15日時点で確認できた内容をまとめたものです。数値・日付・仕様は変更されることがあるため、対応前に必ず公式でご確認ください。）

---

**この記事が役に立ったら、フォローで最新のClaude Code・AIニュースをキャッチしてください。**
モデルの引退・料金改定・アップデートなど、開発者に効く情報を継続してまとめています。

より実践的な「Claude / Claude Codeで稼ぐ」方法（副業・受託・API収益化・情報発信マネタイズ）は、有料記事で具体的な手順とともに解説しています。あわせてご覧ください。

<!--
type: free
title: Claude Opus 4.1がAPIから引退へ：8月5日までに移行を
keywords: Claude Opus 4.1, モデル廃止, API引退, Claude Opus 4.8, 移行ガイド, Claude API, Mythos Preview
target: Claude API/SDKでモデルを指定して使うエンジニア・個人開発者
news_date: 2026-06-05
hashtags: #ClaudeCode #ClaudeAPI #AI #モデル廃止 #開発者向け
-->
