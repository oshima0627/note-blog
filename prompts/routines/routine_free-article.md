# ルーチン用プロンプト: 無料記事の自動作成

以下をそのままルーチン（定期実行）のプロンプトに貼り付けて使う。

---

無料記事を1本、完全自動で作成してください。CLAUDE.md の「無料記事ルートのフロー」に従います。

## 手順

1. **【企画】トピック選定**
   - WebSearchで直近1〜2週間のClaude Code・Claude・AI業界の重要ニュースを調べる
   - `articles/published.json` の無料記事（type: free）を確認し、扱い済みのニュースは除外する
     （扱い済みなら続報・別視点に切り替える。それも無ければ「規約・料金・セキュリティ等の重要情報」から選ぶ）
   - 読者（Claude Codeを使うエンジニア・個人開発者）への影響が最も大きいトピックを1つ選定する

2. **【ニュース】収集・執筆**（`prompts/07_news-curator.md` の指示に従う）
   - WebSearch/WebFetchで一次情報（公式発表・公式ドキュメント・信頼できる報道）を裏取りしてから書く
   - 出典のない情報・数値は書かない。確認できない項目は省くか「未確認」と明記する
   - 本文2,000〜4,000文字目安。「◯年◯月◯日時点」を冒頭に明記
   - 表（Markdownテーブル）は使わない。比較・一覧は箇条書き
   - 末尾に出典リンク一覧＋フォロー・有料記事への導線CTA

3. **【管理】チェック・保存**
   - 品質チェック: 正確性・出典明記・鮮度・読みやすさ・導線の5観点（平均7点以上で合格）
   - CLAUDE.md の「事実確認の手順（ハルシネーションチェック）」を実施する
   - 不合格なら1回だけ改稿し再チェック。それでも不合格なら保存せず中断し、LINEに理由を報告する
   - 合格したら `articles/drafts/YYYY-MM-DD_slug.md` に保存し、
     `articles/published.json` に追記（type: "free"、news_date、review_scores を含む）

4. **mainへ反映**
   - mainブランチにコミットし `git push origin main` する（PRは作らない）
   - コミットメッセージは記事タイトルがわかる日本語で書く

5. **LINE通知（必須・最後に必ず実行）**
   - 成功時は記事タイトルと概要を、失敗・スキップ時はその理由を送信する
   - 環境変数 `NEXEED_LINE_USER_ID` と `NEXEED_LINE_CHANNEL_ACCESS_TOKEN` を使い、
     以下の形式で送信する（JSONエスケープ事故を避けるためpython3で組み立てる）：

```bash
python3 - <<'PY'
import json, os, urllib.request
msg = """【note無料記事が完成しました】
タイトル: （記事タイトル）
概要: （2〜3行の記事概要）
文字数: 約◯,◯◯◯字 / 品質スコア平均: ◯.◯
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
- ハルシネーション対策（CLAUDE.md）を全工程で守る。捏造が1件でもあれば公開しない
- 表は使わない（noteが非対応）
- 誇大表現・煽りタイトルは使わない
- 途中でエラーが起きた場合も、必ずLINEに状況を送信してから終了する
