# HANDOFF

最終更新: 2026-08-27（vs比較の3本目を執筆。未公開の下書き）

## いま何をしているのか

目的: note販売で月10万円。方針は本人決定で「記事販売一本」。

やることは2つに絞れている。
1. 流入を6倍にする（実証済みの「vs比較 × 初心者」型の記事を増やす）
2. その流入を商品に到達させる（CTA導線）＋ 商品を読者に合わせる

いまは 1 の3本目を書き終えたところ。**公開はまだしていない。**

## 実態（note API で実測・確定）

詳細: `analytics/2026-08-27_note-account-audit.md` / `_sales-reality.md` / `_audience-product-mismatch.md`

- 公開114本 / 全期間 40,875ビュー / フォロワー259 / 直近30日 1,677ビュー
- 生涯売上 ¥13,880（14ヶ月・手数料前）。2026年7月 ¥0 / 8月 ¥0
- 流入上位11本＝27,856ビュー（全体の68%）はすべて初心者向け。プロ向けからの流入は0
- 一方 ¥3,980帯4本はすべて事業者向けで、4本合計126ビュー
  → 価格ではなく宛先の問題。¥3,980帯の商品を初心者向けに作るのが正しい
- 未振込 ¥6,940（振込可能 ¥5,460）。**本人判断でたまるまで据え置き。今回のタスクではない**

## 今回やったこと（2026-08-27・このセッション）

### vs比較の3本目を執筆 — 下書きのみ、未公開

- ファイル: `articles/drafts/2026-08-27_claude-code-vs-github-copilot-beginner.md`
- タイトル: 「Claude Code vs GitHub Copilot｜初心者はどっちから始めるべき？【2026年8月版】」
- 本文 約3,900字（空白除く）/ 大見出し9 / 表0 / 出典7件 / CTA2（入口A `nd69e07a7c204` + ¥1,980 `nf6dc3eb8e78d`）
- 切り口は1・2本目と変えた。1本目=ターミナル以外の入り口、2本目=既存の課金先で決める、
  **3本目=「補完が出発点」か「エージェントが出発点」か＋0円で始められるか**
- Copilot に既存記事は無い（`published.json` を全件検索して確認）

### 書く前に公式ページを8本開いて裏取りした（前回の再発防止ルールを適用）

- code.claude.com/docs/en/overview（入り口5種・導入コマンド・有料プラン必須）
- claude.com/pricing（Free $0 / Pro $20・年払い$17 / Max $100〜）
- docs.github.com/en/copilot/get-started/what-is-github-copilot（定義と入り口）
- docs.github.com/en/copilot/get-started/plans（Free の中身・除外項目）
- github.com/features/copilot/plans（Free $0 / Pro $10 / Pro+ $39 / Max $100）
- docs.github.com/.../coding-agent/about-coding-agent（クラウドエージェントは有料プラン限定）
- docs.github.com/.../about-copilot-cli（対応OS）
- docs.github.com/.../billing/usage-based-billing-for-individuals
  （クレジット Pro 1,500 / Pro+ 7,000 / Max 20,000、コード補完は消費しない、繰越なし）

### 執筆中に自分で直した2点

- 「Claude Code側は使用量の上限がプランごとに設定される」→ 公式で確認できないので
  「Pro に対して Max が5倍・20倍」というページ記載どおりの表現に差し替えた
- Markdown の `**`（12箇所）を全削除。**note はペーストした `**` を装飾に変換せず生で出る**

## 検証済みの事実（実際に画面に出した出力のみ）

- 下書きの構造を実測: 大見出し9 / パイプ文字0（表なし） / 空白除き3,895字 / URL 9本
- `published.json` 65件を検索し、Copilot を扱った記事が無いことを確認
- 上記8ページはすべて実際に取得して記載を突き合わせた

## 未検証のもの

- **記事はまだ note に投稿していない。** note_key 無し・`published.json` 未追記
- 実機で Copilot CTL / Copilot Free を動かしていない。記述は公式ページの記載のみに依拠
- Copilot Free の「AIクレジットの枠」は公式に数値の記載が無かった。**本文でも数値を書いていない**
- 1・2本目（`n54370e748c01` / `nfd25ea1dabf6`）とCTA16本の効果はまだ測っていない（最低2週間後）

## 次にやること

1. **3本目を note に公開する（本人の許可待ち）。**
   手順は `analytics/cta-funnel-plan.md` の「新規記事の公開手順」＋「noteエディタの操作」に全部ある。
   要点: 本文は `ClipboardEvent('paste')` の `text/html` に `<p>` を並べて一括投入。
   見出しは後から1つずつ。URLは空段落に `text/plain` で paste してカード化
2. 公開できたら `published.json` に id:66 を追記（`note_key` / `note_url` / `type:"free"`）し、
   下書き先頭に「公開済み: URL」のコメントを足す
3. 4本目の候補: Opus 5 と Sonnet 5 の使い分け / Claude Code vs Gemini CLI（2026年版に更新）
4. ¥1,980と¥3,980の間に初心者向けの本命商品を作る（いまここが空白）。
   候補「プログラミング未経験から Claude Code で最初のWebアプリを公開するまで」
   ※ 実機で手順を通してから書くこと
5. 主力 ¥1,980 記事 `nf6dc3eb8e78d` にクロスセルを入れる（現在リンク0本）
6. 2週間後に `/api/v1/stats/pv?filter=monthly` で有料記事のビュー変化を測る

## 触ってはいけないところ

- **記事を書く前に、料金ページだけでなく製品の概要ページを必ず開く。**
  1本目で2件の事実誤りを出した原因がこれ（`analytics/cta-funnel-plan.md` に記載）
- **note の本文に Markdown 記法を持ち込まない。** `**` も表も生テキストで出る
- **ブラウザ自動操作の Enter は段落を分割しない（br になるだけ）。** paste で段落を作る
- **JS からカーソルを設定して type しない。** Enterが無視され英数字が脱落する
- **`isLast` の検証を飛ばさない。** 省いた回にCTAが記事冒頭に入った
- **数値IDのエディタURLを開いて保存しない。** key形式を使う
- **`.ProseMirror` が出るまで（約10秒）保存しない**
- **パスワード・本人確認情報は Claude が入力しない。** 売上確認・振込は本人が行う
- 政治記事3本・株価予想1本・数値未確認1本（`Claude Code企業導入成功事例`）に商品CTAを貼らない
- 記事の自動生成ルーティン2本は停止したまま。ニュース量産は流入も売上も生まないので再開しない
- `articles/published.json` は末尾に追記するだけにする
- 空の下書き `n012952dc5512` が1件残っている（操作ミス由来・実害なし）
