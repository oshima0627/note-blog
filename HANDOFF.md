# HANDOFF

最終更新: 2026-08-27（vs比較記事の2本目を執筆・**未公開の下書きまで**）

## いま何をしているのか

**目的: note販売で月10万円。方針は本人決定で「記事販売一本」。**

やることは2つ。
1. **流入を6倍にする**（実証済みの「vs比較 × 初心者」型の記事を増やす）← いまここ。2本目を執筆した
2. **その流入を商品に到達させる**（CTA導線・16本実装済み）＋ **商品を読者に合わせる**

## 実態（note API で実測・確定。2026-08-27 時点）

詳細: `analytics/2026-08-27_note-account-audit.md` / `_sales-reality.md` / `_audience-product-mismatch.md`

- 公開114本 / 全期間 40,875ビュー / フォロワー259 / 直近30日 1,677ビュー
- **生涯売上 ¥13,880**（14ヶ月・手数料前）。**2026年7月 ¥0 / 8月 ¥0**
- 未振込 ¥6,940 → **振込可能 ¥5,460 が2026年4月から放置**（本人が申請すること）
- 売上ゼロの構造的原因: 流入上位11本＝27,856ビュー（全体の68%）はすべて初心者向け。
  一方 ¥3,980帯4本はすべて事業者向けで合計126ビュー。**来ている人と売っている物が別人向け**

## 今回やったこと（2026-08-27・vs比較 2本目）

### 執筆した記事（**まだ note に投稿していない**）

`articles/drafts/2026-08-27_claude-code-vs-codex-beginner.md`

- タイトル: 「Claude Code vs Codex（ChatGPT）｜初心者はどっちを選ぶ？【2026年8月版】」
- 無料記事 / 本文2,633字 / 大見出し8 / 埋め込みCTA2（入口A ¥500 + 本命 ¥1,980）/ タグ5案
- 論旨: 2つは同ジャンルで有料の入り口はどちらも月20ドル。決め手は「既存の課金先」と
  「無料で試せるか」。Codex は無料プランにも含まれ、8ドルの Go もある

### 書く前に開いた公式ページ（前回の失敗を受けたルール）

5本すべて実際に開いて記載と突き合わせた。第三者ブログの数値は不使用。

- code.claude.com/docs/en/overview（入り口5種・デスクトップアプリに CLI 同梱・導入コマンド）
- claude.com/pricing（Free $0 / Pro $20・年払い実質$17（$200一括）/ Max $100から。Claude Code は Pro 以上）
- learn.chatgpt.com/docs/codex/cli（Codex CLI の説明文・`curl -fsSL https://chatgpt.com/codex/install.sh | sh`・
  ChatGPT サインイン・他サーフェス）
- learn.chatgpt.com/docs/pricing（Free $0 / Go $8 / Plus $20 / Pro $100から / API Key 従量。
  見出しに「Codex は Free / Go / Plus / Pro / Business / Edu / Enterprise の各プランに含まれる」）
- chatgpt.com/pricing（日本語・円表記: Go ¥1,400 / Plus ¥3,000 / Pro ¥16,800から。
  無料版の欄に「Codex へのアクセスに上限あり」）

## 検証済みの事実（実際に画面に出した出力のみ）

- 下書きのスクリプト実測: **本文2,633字 / 大見出し8 / Markdownテーブル0 / 太字`**`0**
- 誇大表現の grep（絶対・誰でも・確実に稼・驚愕・激震・爆速・神ツール・革命・必見・衝撃・完全に・ヤバ）→ **該当0**
- 出典5本のURLはすべて実際に開いて到達を確認（`learn.chatgpt.com/docs/pricing` はHTML版も表示された）
- CTAのURLは既存の実績あるキー2本（`nd69e07a7c204` / `nf6dc3eb8e78d`）
- 重複チェック: `published.json` 64本に Codex を主題にした記事は無い。
  note 側の既存 vs 記事は Claude 3.5 Sonnet / GitHub Copilot / ChatGPT / Codeium / Bolt.new / Gemini / Cursor で、Codex は未使用

## 未検証のもの

- **Codex CLI も Claude Code も、この記事のために実機で動かしてはいない。** 記述はすべて公式ページの記載
- **無料プランの Codex が CLI から使えるかは公式に明記が無い。** 記事ではその旨を書いて断定を避けた
- **note への投稿は未実施。** 記事はリポジトリの下書きのみ。`published.json` にも未登録（id:65 は投稿後に追記する）
- 1本目（vs Cursor）と CTA16本の効果はまだ測っていない。最低2週間後に測る

## 次にやること

1. **この2本目を note に公開する**（本人の許可待ち）。手順は
   `analytics/cta-funnel-plan.md` の「新規記事の公開手順」。公開したら
   - `published.json` に id:65 を type:"free" で**末尾に追記**（note_key / note_url を入れる）
   - 下書きファイル冒頭のコメントに note_url を書く
   - `/api/v3/notes/<key>` で `status:"published"` / `price:0` / h2数 / CTAリンク2 を確認
2. **本人作業**: 振込可能な ¥5,460 を申請 https://note.com/dashboard/salesmanage
3. **3本目の候補**: Claude Code vs GitHub Copilot（2026年版・既存記事5,621ビューの更新版）/
   Opus 5 と Sonnet 5 の使い分け
4. **¥1,980と¥3,980の間に、初心者向けの本命商品を作る**（いまここが空白）。
   候補「プログラミング未経験から Claude Code で最初のWebアプリを公開するまで」。
   ※ **実機で手順を通してから書くこと**
5. 主力 ¥1,980 記事 `nf6dc3eb8e78d` にクロスセルを入れる（現在リンク0本）
6. 有料26本の棚卸し（FX・競馬・AI BGM など Claude と無関係な商品が7本以上）

## 触ってはいけないところ

- **記事で扱う製品は、料金ページだけでなく製品の概要ページを必ず開いてから書く。**
  1本目（vs Cursor）で「ターミナル専用」「Node.js が必要」の2件を公開後に訂正した
- **noteエディタで JS からカーソルを設定して `type` しない。** Enterが無視され英数字が脱落する
- **数値IDのエディタURLを開いて保存しない。** 本文0文字で開き記事を壊す恐れ。**key形式を使う**
- **本文が読み込まれた（`.ProseMirror` が存在する）ことを確認してから保存する。** 7〜8秒待つ
- **パスワード・本人確認情報は Claude が入力しない。** 売上確認・振込は本人が行う
- **政治記事（立憲民主党・自民党・参政党）と株価予想記事に商品CTAを貼らない**
- **「Claude Code企業導入成功事例：売上10億円増加」（540ビュー）は数値未確認。** 導線に組み込まない
- 記事の自動生成ルーティン2本は停止したまま（`trig_01QzBCjYYyTexPkS5XJ1FhNm` /
  `trig_01DD4hdtnLL3RBxuWGHqq3nH`）。**ニュース量産は流入も売上も生まないので再開しない**
- `articles/published.json` は**末尾に追記するだけ**にする
- 出典が取れない数値・事例は書かない。第三者メディアの数値を公式扱いしない
- リモートに作業ブランチを作らず、`git push origin HEAD:main` で main に直接反映する
