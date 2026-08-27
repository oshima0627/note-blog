# Claude Code vs GitHub Copilot｜初心者はどっちから始めるべき？【2026年8月版】

<!-- 事実確認: 2026-08-27 に以下の公式ページを実際に開いて記載を突き合わせた
       - code.claude.com/docs/en/overview（Claude Code の入り口・導入方法・必要なプラン）
       - claude.com/pricing（Claude のプランと価格・USD表記）
       - docs.github.com/en/copilot/get-started/what-is-github-copilot（Copilot の定義と入り口）
       - docs.github.com/en/copilot/get-started/plans（各プランの価格と Free の制限）
       - github.com/features/copilot/plans（価格表・Free に含まれる機能）
       - docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent（クラウドエージェント）
       - docs.github.com/en/copilot/concepts/agents/about-copilot-cli（Copilot CLI）
       - docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-individuals（AIクレジット）
     未検証: 実機で Copilot CLI を動かしてはいない。記述はすべて公式ページの記載にもとづく
     Copilot Free の「AIクレジットの枠」は公式に「allowance がある」とだけ書かれ、
     具体的な数値は上記ページに記載がなかったため、本文でも数値を書いていない -->

対象読者：AIにコードを書かせたいが、Claude Code と GitHub Copilot のどちらから入ればいいか決めかねている方

この記事で分かること：2つの性格の違い、2026年8月時点の料金、無料で始められるか、決め方

## 先に結論

・0円で始めたい → GitHub Copilot（無料プランがあります）
・月額を抑えたい → GitHub Copilot（有料の入り口が10ドル。Claude は20ドル）
・「まるごと任せる」体験が目的 → Claude Code
・すでに Claude Pro / Max を払っている → Claude Code（追加費用なし）

Claude Code には無料プランがありません。一方 Copilot には0円のプランがあり、しかもそこにコマンドラインのエージェントが含まれています。財布を開く前に試せるという一点で、初心者にとっての入りやすさは Copilot が上です。

## GitHub Copilot とは何か

公式ドキュメントの説明はこうです。「より速く、より少ない労力でコードを書くのを助けるAIコーディングアシスタント」。

Copilot の出発点はコード補完です。エディタで打っている途中に続きを提案してくれる、あの機能が本体でした。そこにチャット、エージェントモード、コマンドライン、GitHub上で動くクラウドエージェントが積み上がって、いまの形になっています。

対して Claude Code は、公式に「コードベースを読み、ファイルを編集し、コマンドを実行するエージェント型コーディングツール」と書かれています。出発点がエージェントです。

## 違いは「補完」か「丸ごと任せる」か

ここが一番大きな差で、料金より先に理解しておく価値があります。

補完型は、あなたが手を動かしている前提の道具です。書く速度が上がります。コードを読める人ほど効きます。

エージェント型は、あなたが指示を出して結果を確認する道具です。「ログイン画面を作って」と言うと、複数のファイルを自分で作って、コマンドまで実行します。コードが読めなくても、動くものは出てきます。

初心者にとっては、この差は「勉強になるか」と「早く形になるか」の差でもあります。どちらが正しいということはありません。ただ、自分がどちらを求めているのかは、はっきりさせてから選んだほうがいいです。

なお Copilot にもエージェントモードとCLIがあり、Claude Code もエディタから使えます。両者は機能としては近づいています。違うのは、どちらが製品の中心に置かれているかです。

## 料金（2026年8月27日時点）

Claude（公式ページはドル表記）

・Free：0ドル。Claude Code は含まれません
・Pro：月額20ドル（年払いなら実質17ドル）。Claude Code はここから
・Max：月100ドルから

GitHub Copilot（公式ページはドル表記）

・Free：0ドル
・Pro：月額10ドル
・Pro+：月額39ドル
・Max：月額100ドル

有料の入り口は Copilot が10ドル、Claude が20ドルです。倍の差があります。

ただし、有料プランで見ているものが違います。Copilot の有料プランは「コード補完は無制限」で、チャット・CLI・クラウドエージェントの利用はAIクレジットという月ごとの枠を消費します（Pro は月1,500クレジット、Pro+ は7,000、Max は20,000。持ち越しはできず毎月リセットされると公式に書かれています）。Claude 側は Pro に対して Max が「5倍」「20倍」の利用量という形でプランが分かれています。

つまり「10ドルなら Copilot が半額でお得」とは単純に言えません。エージェントをどれだけ回すかで消費が変わります。

## 無料で始められるのは Copilot だけ

Copilot Free の中身を、公式の記載どおりに並べます。

・月2,000回のコード補完
・Copilot CLI と Copilot アプリ
・エディタ・GitHub Mobile・GitHubウェブ・Windows Terminal でのチャット
・AIクレジットの枠（金額の記載はありません）
・モデルは自動選択のみ（手動でのモデル選択・プレミアムモデルは対象外）

注意点が2つあります。ひとつは、Free は「組織やエンタープライズ経由で Copilot を使えない個人開発者のみ」が対象と明記されていること。もうひとつは、GitHub上で `@copilot` と呼んで動かすクラウドエージェントは「すべての有料プランで利用可能」と書かれていて、Free の対象ではないことです。

それでも、0円で CLI とエージェントモードに触れるのは大きい。Claude Code は Free プランに含まれないので、最低でも月20ドルからです。

## どこで動くか

Claude Code は、ターミナル、VS Code、JetBrains、デスクトップアプリ、ブラウザ（claude.ai/code）から使えます。デスクトップアプリには Claude Code が同梱されているので、CLI を別に入れる必要はないと公式に書かれています（有料プランが必要です）。導入はコマンド1行、Homebrew や WinGet でも入ります。

Copilot は、エディタ、GitHubのウェブサイト、GitHub Mobile、Windows Terminal、コマンドライン、そして Copilot アプリから使えます。Copilot CLI は Linux・macOS・Windows（PowerShell / WSL）に対応と公式に書かれています。

どちらも「黒い画面専用」ではありません。ターミナルが苦手だから無理、という理由で外す必要はどちらにもありません。

## タイプ別の選び方

Copilot から始めたほうがいい人

・とにかく0円で試したい
・すでに GitHub を日常的に使っている
・自分でコードを書きながら、書く速度を上げたい
・月額を10ドルに抑えたい

Claude Code から始めたほうがいい人

・コードは読めなくていいので、動くものを早く出したい
・すでに Claude Pro や Max を払っている
・複数ファイルにまたがる作業を、まるごと任せたい

決められない人は、Copilot Free で1週間さわってください。0円で失うものがありません。そのうえで「自分で書くより、任せたい」と思ったら Claude Code に20ドルを払う。この順番なら、使わないサブスクだけが残る事故を避けられます。

そして2つ同時に契約しないこと。うまくいかないときに、ツールが悪いのか指示が悪いのかを切り分けられなくなります。まず片方で1本作り切る。それからです。

## まとめ

・Copilot は補完が出発点、Claude Code はエージェントが出発点
・有料の入り口は Copilot 10ドル、Claude 20ドル
・0円で始められるのは Copilot だけ（CLIとエージェントモードを含む）
・ただし Copilot はチャット・CLI・クラウドエージェントがAIクレジットを消費する
・GitHub上のクラウドエージェントは有料プラン限定
・どちらもターミナル専用ではない

ツール選定は1日で終わらせて、残りの時間を「1本作り切ること」に使ってください。

## 出典

Claude Code 公式ドキュメント（入り口・導入方法）：https://code.claude.com/docs/en/overview

Claude 料金プラン（公式）：https://www.claude.com/pricing

GitHub Copilot とは（公式ドキュメント）：https://docs.github.com/en/copilot/get-started/what-is-github-copilot

GitHub Copilot のプラン（公式ドキュメント）：https://docs.github.com/en/copilot/get-started/plans

GitHub Copilot 料金ページ（公式）：https://github.com/features/copilot/plans

Copilot CLI（公式ドキュメント）：https://docs.github.com/en/copilot/concepts/agents/about-copilot-cli

AIクレジットの消費（公式ドキュメント）：https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-individuals

料金・プラン構成は変更されることがあります。本記事は2026年8月27日時点の公式ページの記載にもとづいています。申し込み前に必ず公式でご確認ください。

---

この記事が役に立ったなら

どちらを選んでも、次に必要なのは「何をやらせるか」です。手を動かす側の記事も書いています。

▼ まず1本試すなら（500円）
https://note.com/oshima0627/n/nd69e07a7c204

▼ 副業として月10万円を目指す全体像（1,980円）
https://note.com/oshima0627/n/nf6dc3eb8e78d

Claude CodeとAI開発の最新情報を発信しています。フォローしていただくと更新が届きます。

<!-- ハッシュタグ: #ClaudeCode #GitHubCopilot #プログラミング初心者 #AI開発 #副業 -->
