# Claude公式Python SDKがv1.0に：temperature指定が廃止されました

2026年8月23日時点の情報です。料金・仕様は変わりやすいため、最新は公式ドキュメントでご確認ください。

## この記事でわかること

- Claude APIのPython SDK（`anthropic`パッケージ）が2026年8月20日にv1.0.0になったこと
- `temperature`が使えなくなるなど、コードの書き換えが必要な変更点
- バージョンを固定していない場合に何が起きるか、どう移行するか

## 何が起きたのか

Anthropicは2026年8月20日、Claude APIのPython SDKであるv1.0を公開しました。
公式のリリースノートに記載があります。
GitHubリポジトリのCHANGELOGでも、1.0.0が2026年8月20日付で記録されています。

v1.0はメジャーバージョンアップです。
つまり、後方互換のない変更（破壊的変更）が含まれます。
中身は、HTTP通信ライブラリの入れ替えと、長く非推奨だった機能の削除です。

### 読者への影響

影響が大きいのは、依存バージョンを固定していないケースです。
`requirements.txt`に`anthropic`とだけ書いている場合、
次の`pip install`ではv1.0.0が入ります。
そこにv0系向けのコードが残っていると、動かなくなる可能性があります。

CI・Dockerビルド・デプロイの場面で初めて気づく、という形になりがちです。

## 変更点1：Python 3.9では動きません

v1.0が要求するPythonは3.10以上です。
公式ドキュメントの「Requirements」に明記されています。
PyPI上のパッケージ情報でも、`requires_python`は「>=3.10」です。

v0系までは3.9でも動いていました。
Python 3.9のまま運用しているサーバーやコンテナには、v1.0は入りません。
古いイメージを使い続けている場合は、Python側の更新が先になります。

## 変更点2：temperature・top_p・top_kが引数から消えました

これが最も広く影響する変更だと考えられます（筆者の見方）。
Messages系のメソッドから、`temperature`・`top_p`・`top_k`が削除されました。

公式の移行ガイド（MIGRATION.md）は、対処として「削除する」ことを挙げています。
現行モデルはこれらのパラメータを使わない、という説明が添えられています。
まだ使う古いモデルを呼ぶ場合は、`extra_body`経由で渡す方法が案内されています。

移行ガイドに載っているコード例は次のとおりです。

変更前：

```python
client.messages.create(..., model="claude-sonnet-4-6", temperature=0.2)
```

変更後：

```python
client.messages.create(..., model="claude-sonnet-4-6", extra_body={"temperature": 0.2})
```

### 読者への影響

`temperature=0`を明示して出力を安定させる書き方は、広く使われてきました。
その行が残っていると、v1.0では引数として受け付けられません。
まずは自分のコードを`temperature`で検索するところから始めるのが確実です。

なお`output_format`をdictで渡していた箇所も変更対象です。
`output_config={"format": {...}}`という形に変わりました。
クラスを渡す`output_format=Model`の書き方は、ヘルパー側で引き続き受け付けるとされています。

## 変更点3：httpxからhttpx2に入れ替わりました

v1.0では、内部のHTTP通信が`httpx`から`httpx2`に切り替わりました。
`httpx2`は、Pydanticチームが保守しているAPI互換のフォークです。
公式ドキュメントは、元の`httpx`が現在は活発に保守されていない点を切り替えの理由としています。

自前のHTTPクライアントを渡している場合は、書き換えが必要です。
公式ドキュメントには、`http_client`引数は`httpx2`のクライアントでなければならず、
別パッケージの`httpx`のクライアントを渡すと`TypeError`になる、と書かれています。
`Timeout`やトランスポートも`httpx2`側から作ります。
型注釈の`httpx.Response`も`httpx2.Response`に直します。

### 読者への影響

見落としやすいのは、テストと監視まわりです。
`respx`や`pytest-httpx`のようなモック、
OpenTelemetryやSentryの`httpx`計装は、`httpx`本体にパッチを当てて動きます。
SDKが`httpx2`を使うと、これらは既定ではSDKの通信を捕捉できません。

公式ドキュメントの対処は、起動時に一度`httpx2.alias_httpx()`を呼ぶ方法です。
`httpx`が読み込まれるより前に実行すると、
プロセス全体で`import httpx`が`httpx2`に解決されます。

モックが効かず実際のAPIを叩いてしまう事故のほうが厄介です。
移行後は一度確認しておくと安心です。

## 変更点4：静かに壊れる細かい変更

まず、旧Text Completions APIが削除されました。
`client.completions.create()`と、定数`HUMAN_PROMPT`・`AI_PROMPT`がなくなっています。
移行先はMessages APIです。
古い書き方なので該当は少ないと考えられますが、社内スクリプトには残りがちです。

次に、非同期クライアントでの生レスポンス処理が変わりました。
`.with_raw_response`の結果の`parse()`・`text()`・`read()`・`json()`は、
awaitが必要なコルーチンになっています。
同期クライアントでも、`.text`と`.read`はプロパティからメソッドに変わりました。

`AnthropicBedrock`も挙動が変わっています。
AWSリージョンが未設定のとき、これまでは`us-east-1`が既定で使われていました。
v1.0では既定にフォールバックせず、エラーになります。
`aws_region=`引数か`AWS_REGION`環境変数での明示が必要です。

このほか、`messages.parse(stream=True)`も削除されました（`messages.stream(...)`へ）。
tool_runnerの`compaction_control`も廃止です（サーバー側の`context_management`へ）。
全項目はMIGRATION.mdに、変更前後のコード付きでまとまっています。

## いま何をすればよいか

### 1. 影響範囲を確認する

まず、いま入っているバージョンを確認します。

```python
import anthropic
print(anthropic.__version__)
```

次に、コード内を検索します。
キーワードは`temperature`・`top_p`・`top_k`・`httpx`・`completions.create`です。
1件も当たらなければ、影響は小さい可能性が高いです。

### 2. 慌てて上げないなら固定する

すぐに移行できない場合は、依存を0系に固定して時間を作る手があります。

```
anthropic<1
```

これは一時的な回避策です。
0系がいつまでサポートされるかについて、
移行ガイドや公式リリースノートに明示的な記載は見当たりませんでした（2026年8月23日時点・未確認）。
固定は移行までのつなぎと考えるのが安全です。

### 3. Claude Codeの移行コマンドを使う

Claude Codeを使っている場合は、移行を任せる手段が用意されています。
移行ガイドには「Claude Codeを使っているなら、プロジェクトで
`/claude-api upgrade python`を実行して差分をレビューするのが最短」と書かれています。

このコマンドは、Claude Code v2.1.239のchangelogに
「`anthropic`の0.xから1.xへPythonプロジェクトを移行する」機能として記載されています。
自動生成された差分は、必ず自分の目でレビューしてください。

## まとめ

- Claude APIのPython SDKが2026年8月20日にv1.0.0になりました
- Python 3.10以上が必須になり、`temperature`などの引数が削除されました
- 内部のHTTPライブラリが`httpx2`に替わり、モックや計装に影響します
- バージョン未固定のプロジェクトは、次のビルドで壊れる可能性があります

破壊的変更そのものは、公式が移行ガイドとコマンドを用意している範囲の話です。
むしろ怖いのは、依存を固定しないまま気づかずに巻き込まれるケースだと考えます（筆者の見方）。
この機会に、Claude関連の依存バージョンを見直しておくとよさそうです。

## 出典

- Claude Platform リリースノート（2026年8月20日の項）: https://platform.claude.com/docs/en/release-notes/overview
- Python SDK 移行ガイド（MIGRATION.md）: https://github.com/anthropics/anthropic-sdk-python/blob/main/MIGRATION.md
- Python SDK CHANGELOG（1.0.0は2026年8月20日）: https://github.com/anthropics/anthropic-sdk-python/blob/main/CHANGELOG.md
- Python SDK 公式ドキュメント（Requirements・HTTPクライアント設定）: https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python
- PyPI `anthropic`（バージョンと対応Python）: https://pypi.org/project/anthropic/
- Claude Code CHANGELOG（v2.1.239の`/claude-api upgrade`）: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md

---

Claude CodeとClaude APIの更新は、この記事のように定期的にまとめています。
見落とすと動かなくなる類の変更を追いかけたい方は、フォローしてお待ちください。

Claude / Claude Codeを実際の収益につなげる方法は、有料記事で扱っています。
受託・API活用・情報発信といったテーマ別に、手順と数字を具体的に書いています。
興味のある方はプロフィールからご覧ください。

<!--
type: free
title: Claude公式Python SDKがv1.0に：temperature指定が廃止されました
keywords: anthropic Python SDK, v1.0.0, temperature廃止, httpx2, 破壊的変更, Claude API, 移行ガイド, claude-api upgrade
target: Claude APIをPythonから使うエンジニア・個人開発者
news_date: 2026-08-20
hashtags: #ClaudeAPI #Python #ClaudeCode #AI開発 #SDK
-->
