# Claude Code Hooks入門：AIの操作を100%制御する仕組み

**対象読者**: Claude Codeを使い始めた開発者、AIエージェントの動作をより厳密に管理したい方
**この記事でわかること**: Claude Code Hooksの仕組み、主要なユースケース、具体的な設定方法

---

## CLAUDE.mdだけでは不十分な理由

Claude Codeを使っていて、こんな経験はないでしょうか。

「CLAUDE.mdにルールを書いたのに、守ってくれないことがある」

実はCLAUDE.mdはあくまでプロンプトの一部であり、経験的に守られないケースが一定の割合で発生します。ガイドラインとしては優秀ですが、「絶対に守らせたいルール」には向きません。ファイルのフォーマット忘れや、危険なコマンドの実行を確実に防ぎたい場面では、もっと強力な仕組みが必要です。

そこで登場するのが **Claude Code Hooks** です。

## Claude Code Hooksとは何か

Hooksは、Claude Codeのライフサイクル中に**自動実行されるシェルコマンド**です。ファイル書き込みの直後やBashコマンドの実行前など、特定のタイミングで確実に動作します。

最大の特徴は**遵守率100%**という点です。CLAUDE.mdが「お願い」なら、Hooksは「強制」です。条件に合致すれば、例外なく実行されます。

## 6つのイベントタイプ

Hooksが発火するタイミングは6種類あります。

- **PreToolUse** — ツール実行の直前。唯一アクションをブロックできるイベント
- **PostToolUse** — ツール実行の直後。自動フォーマットに最適
- **SessionStart** — セッション開始時。コンテキストの自動注入に使う
- **Stop** — Claudeの応答完了時。後処理や通知に活用
- **Notification** — Claudeが通知を送るとき。デスクトップ通知の連携に便利
- **UserPromptSubmit** — ユーザーがプロンプトを送信したとき

特に重要なのはPreToolUseとPostToolUseの2つです。この2つだけで多くのユースケースをカバーできます。

## Hookが受け取るデータ

Hookコマンドは標準入力（stdin）としてJSON形式のデータを受け取ります。以下はBashツール実行時の例です。

```json
{
  "tool_name": "Bash",
  "tool_input": {
    "command": "npm test"
  }
}
```

Writeツールの場合は次のようになります。

```json
{
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/home/user/project/src/index.ts",
    "content": "..."
  }
}
```

`tool_input`のフィールドはツールごとに異なります。Bashなら`command`、Write/Editなら`file_path`が含まれます。この構造を理解しておくと、カスタムHookを書く際にスムーズです。

## 実践ユースケース3選

### 1. ファイル保存時に自動フォーマット（PostToolUse）

ClaudeがファイルをWriteまたはEditしたら、自動でPrettierを実行します。フォーマット忘れがゼロになります。

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$CLAUDE_FILE_PATH\""
          }
        ]
      }
    ]
  }
}
```

`matcher`には正規表現が使えます。`"Write|Edit"`で、書き込み系ツールの両方に対応しています。

### 2. 危険なコマンドを事前ブロック（PreToolUse）

`rm -rf`や`DROP TABLE`のような破壊的コマンドを、実行前に検知して止めます。

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python3 -c \"import json, sys; d=json.load(sys.stdin); cmd=d.get('tool_input',{}).get('command',''); sys.exit(2 if any(x in cmd for x in ['rm -rf','DROP TABLE']) else 0)\""
          }
        ]
      }
    ]
  }
}
```

ポイントは**終了コード**です。Hookの終了コードによって動作が変わります。

- **終了コード0** — 許可。ツール実行がそのまま進む
- **終了コード1** — エラー。Hookの実行失敗として扱われる（ツール実行自体は中断される）
- **終了コード2** — ブロック。ツール実行を明示的に拒否し、Claudeにその旨が伝えられる

意図的にツール実行を止めたい場合は、終了コード1ではなく**必ず終了コード2**を使いましょう。

### 3. 重要ファイルへの書き込み保護（PreToolUse）

`.env`や`package-lock.json`など、Claudeに触られたくないファイルを保護できます。

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "python3 -c \"import json, sys; d=json.load(sys.stdin); p=d.get('tool_input',{}).get('file_path',''); protected=['.env','.env.local','package-lock.json']; sys.exit(2 if any(p.endswith(f) for f in protected) else 0)\""
          }
        ]
      }
    ]
  }
}
```

matcherで`Write|Edit`を指定し、コマンド内で`file_path`をチェックする構成です。保護したいファイルは`protected`リストに追加するだけで拡張できます。

この方法なら、機密情報を含むファイルをAIが誤って変更するリスクをゼロにできます。

## 設定ファイルの3つのレベル

Hooksの設定は3箇所に配置できます。

| レベル | ファイルパス | 用途 |
|---|---|---|
| ユーザー全体 | `~/.claude/settings.json` | 全プロジェクト共通のルール |
| プロジェクト | `.claude/settings.json` | チームで共有するルール（Git管理可） |
| ローカル | `.claude/settings.local.json` | 個人用の設定（Git管理外） |

チーム開発では`.claude/settings.json`をGitにコミットすることで、メンバー全員に同じHooksを適用できます。個人的な通知設定などは`.claude/settings.local.json`に書くのがおすすめです。

## 設定方法

設定は2通りあります。

1. **`/hooks`コマンド** — Claude Code内でインタラクティブに設定できるUI
2. **JSON手動編集** — 上記の設定ファイルを直接編集

初めての方は`/hooks`コマンドが直感的です。慣れたらJSON編集の方が効率的でしょう。

## Git hooksとの使い分け

似た名前のGit hooksとは役割が異なります。

- **Git hooks**: `git commit`や`git push`の前後に実行。人間のGit操作を制御する
- **Claude Code Hooks**: ファイル書き込みやコマンド実行の前後に実行。AIの操作を制御する

両者は補完関係にあります。Git hooksは「自分自身のミスから守る」仕組み。Claude Code Hooksは「AIエージェントのミスから守る」仕組みです。

Claudeが`git commit`を実行する場合、PreToolUse → git commit → Git hookの順で処理されます。両方設定しておくのが安全です。

## 知っておくべき注意点

- Hookのstdout（標準出力）はClaudeのコンテキストに注入されます。機密情報を出力しないよう注意してください
- アクションをブロックできるのはPreToolUseだけです。PostToolUseでは手遅れです
- Hookコマンドは標準入力としてJSON形式のデータを受け取ります。ツール名や引数の情報が含まれます
- `disableAllHooks`設定で一括無効化できますが、管理者設定の階層が尊重されます

## まとめ

- **Claude Code Hooksは遵守率100%の自動実行ルール**。CLAUDE.mdの「お願い」と違い、確実に動作する
- **PreToolUseとPostToolUseが最重要**。危険コマンドのブロックと自動フォーマットだけでも導入価値が高い
- **チーム共有が簡単**。`.claude/settings.json`をGitにコミットするだけで全員に適用できる

CLAUDE.mdで「だいたい守ってくれる」から、Hooksで「100%守らせる」へ。まずは自動フォーマットのHookから試してみてください。

<!--
title: Claude Code Hooks入門：AIの操作を100%制御する仕組み
keywords: Claude Code, Hooks, 自動化, コード品質, AI制御, PreToolUse, PostToolUse, stdin, 終了コード
target: Claude Codeを使い始めた開発者、AIエージェントの動作を厳密に管理したい方
-->
