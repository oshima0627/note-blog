# ルーチン用プロンプト: 有料記事の自動作成

以下をそのままルーチン（定期実行）のプロンプトに貼り付けて使う。

---

有料記事（稼ぐ特化）を1本、完全自動で作成してください。CLAUDE.md の「有料記事ルートのフロー」に従い、【管理】が進行役となって各役割を Agent tool（subagent_type=general-purpose）で順に起動します。

## 手順

1. **【企画】**（`prompts/01_planner.md`）
   - 稼ぐ特化テーマ候補を3〜5件生成（収益額レンジ・収益化モデル・根拠つき）
   - `articles/published.json` の有料記事（type: paid）とキーワードが3つ以上重複する候補は除外
   - 重複しない候補が1つも作れない場合は中断し、LINEにその旨を報告して終了する
   - 最有力テーマを1件選定

2. **【市場分析】**（`prompts/02_market-analyst.md`）
   - 読者ニーズ・収益化モデル・相場・競合・差別化を調査
   - 相場・数値は出典つきで収集。確認できない場合は捏造せず「確認できなかった」と明記
   - 仕様・料金はWebSearchで最新の公式情報を確認する

3. **【構成】**（`prompts/03_architect.md`）
   - 「収益ゴール→手順→注意点」の流れで本文8,000字以上のアウトラインを設計
   - 表は使わない設計にする（noteが非対応）

4. **【執筆】**（`prompts/04_writer.md`）
   - 本文8,000文字以上。リサーチ結果にない事実（数値・事例・固有名詞）を新たに作らない
   - 文字数不足は事実の水増しでなく手順の深掘りで補う

5. **【販売設計】**（`prompts/05_sales-designer.md`）
   - タイトル案・導入・導線・CTA・有料化ライン・ハッシュタグを最適化

6. **改善ループ**（最大2回）
   - 【管理】の品質チェック（収益化明確性・実行可能性・正確性・構成・独自性。
     平均7点以上かつ全項目5点以上、収益化・実行可能性は6点以上）
   - 販売設計の高価値な指摘（リード改善・CTA等）を執筆に反映する

7. **【管理】事実確認・保存**
   - CLAUDE.md の「事実確認の手順（ハルシネーションチェック）」を必ず実施
   - 合格したら `articles/drafts/YYYY-MM-DD_slug.md` に保存し、
     `articles/published.json` に追記（type: "paid"、monetization_model、income_range、review_scores を含む）
   - 2回の改善ループ後も不合格なら保存せず中断し、LINEに理由を報告する

8. **mainへ反映**
   - mainブランチにコミットし `git push origin main` する（PRは作らない）
   - コミットメッセージは記事タイトルがわかる日本語で書く

9. **LINE通知（必須・最後に必ず実行）**
   - 成功時は記事タイトルと概要を、失敗・スキップ時はその理由を送信する
   - 環境変数 `NEXEED_LINE_USER_ID` と `NEXEED_LINE_CHANNEL_ACCESS_TOKEN` を使い、
     以下の形式で送信する（JSONエスケープ事故を避けるためpython3で組み立てる）：

```bash
python3 - <<'PY'
import json, os, urllib.request
msg = """【note有料記事が完成しました】
タイトル: （記事タイトル）
概要: （2〜3行の記事概要）
想定収益: （income_range） / 収益化モデル: （monetization_model）
文字数: 約◯,◯◯◯字 / 品質スコア平均: ◯.◯
有料化ライン: （販売設計の提案があれば1行で）
保存先: articles/drafts/（ファイル名）
※noteへの投稿は手動です。内容を確認して公開してください。"""
req = urllib.request.Request(
    "https://api.line.me/v2/bot/message/push",
    data=json.dumps({
        "to": os.environ["NEXEED_LINE_USER_ID"],
        "messages": [{"type": "text", "text": msg}],
    }).encode(),
    headers={
        "Content-Type": "application/json",
        "Authorization": "Bearer " + os.environ["NEXEED_LINE_CHANNEL_ACCESS_TOKEN"],
    },
)
print("LINE push status:", urllib.request.urlopen(req).status)
PY
```

## 制約（必ず守る）
- ハルシネーション対策（CLAUDE.md）を全工程で守る。架空の事例・出典なし数値は禁止
- 表は使わない（noteが非対応）
- 誇大表現（根拠のない「絶対」「誰でも」）は使わない。金額は「目安」と明記
- 途中でエラーが起きた場合も、必ずLINEに状況を送信してから終了する
