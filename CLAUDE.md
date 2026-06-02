# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## このリポジトリの性質

**`ai-effective-project` は「AI駆動開発（AIDD）」の試行・効果測定を記録する資料リポジトリ**であり、アプリのコードベースではない。対象は配送管理システム **「PW」** で、PW に AIDD をどう適用し、どんな効果・課題が出たかを、社長・関係者への **状況説明／相談資料** としてまとめている。

- 成果物は `docs/` 配下の **D2図・HTMLスライド／ダッシュボード・Markdown分析**。
- PW 本体のアプリ実装（NestJS / Next.js / Prisma 等）は別リポジトリ（親 `pw-dms`）にあり、本リポジトリはそれを **説明する側**。親 `pw-dms/CLAUDE.md` のバックエンド/フロント実装ルールは、本リポジトリの静的資料には適用されない。

## ビルド・テストは無い（重要）

`package.json` もビルドツールもテストランナーも**存在しない**。ファイルはブラウザで直接開いて確認する静的資産。

- **HTML**: ブラウザで直接開く（自己完結。インライン CSS/SVG/JS）。
- **D2図**: `.d2` を `d2` CLI で `.svg` に変換し、`.svg` を md/html から参照する。`*.d2` が真実、`*.svg` は生成物。
  - 例: `d2 docs/agent-03/agent.d2 docs/agent-03/agent.svg`
  - `.d2` を編集したら対応する `.svg` を**再生成してコミット**する。
- ⚠️ `docs/problem-01/CLAUDE.md` と `docs/problem-02/CLAUDE.md` の `npm run build` / `npm test` 等は、**AIDD の spec駆動生成を例示するサンプル成果物**であり、本リポジトリのコマンドではない。混同しないこと。

## HTML資料の1画面チェック（推奨ワークフロー）

資料は「1ページに収まる」ことが要件（後述ルール）。ヘッドレスブラウザで実機確認できる：

```bash
# Windows/WSL の Edge で 1280x720 のスクショを撮る例
EDGE="/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
"$EDGE" --headless --disable-gpu --hide-scrollbars --window-size=1280,720 \
  --screenshot="C:\\temp\\out.png" "file:///C:/temp/page.html"
```

タブで内容を切り替える資料は、検証したいタブに `active` クラスを移したコピーを描画して確認する。

## リポジトリ構成（大枠）

- `docs/agent-01..03/`, `docs/problem-01..02/`, `docs/timeline-01/` — **D2 → SVG** の図（エージェント構成・課題・タイムライン）。
- `docs/ai-04..06/` — テーマ別の **HTMLスライド集**（各 `index.html` がハブ。AIDDプロセス / エージェントフロー / V字モデル・自動テスト等）。
- `docs/ai-effective-functions/` — **Markdown 分析**（AIに指示しやすい/しにくい実装カテゴリ、spec駆動運用、品質・デリバリ、ユーザーストーリー）。
- `docs/chart/` — **インタラクティブなダッシュボード／レポート**（下記データ分離）と、課題事例 `problem_ex_*.html`、議事 `minutes_*.html`。`chart/index.html` がドキュメント一覧ハブ。

## chart ダッシュボードのアーキテクチャ（データ/ロジック/ビュー分離）

`docs/chart/` の `workitems.html` と `aidd_report.html` は、複数の `.js` を**読込順に** `<script src>` で取り込む構成。役割が分離されている：

- `workitems.js` — **データのみ**。グローバル `WORKITEMS_DATA = { SCREENS:[], IFS:[] }`。**進捗の更新はこのファイルを編集**し、ページ再読込で反映。
- `workitems_postprocess.js` — **純粋関数** `postprocessWorkitems(WORKITEMS_DATA)` → `{ SCREENS, IFS }`。工数計算・スコープ判定・状況/担当者割当をまとめて適用。
- `task_logic.js` — 共通ロジック（スコア計算・ソート・グルーピング）。重み定数 `TASK_SCORE_WEIGHTS` など。
- `aidd_report.js` — レポート（AsIs/ToBe 工数比較・EVM）固有のロジック。
- `*.html` — **ビュー**。読込順は data → logic → postprocess →（report）→ 描画スクリプト。

データはステータスを絵文字で表現する（`✅`=完了 / `🔄`=作業中・予定 / `📐`=モックあり 等）。`workitems.js` 編集時はこの表記規約に従う。

## 資料作成ルール（超前提）

新しい資料、特に `docs/chart/` の課題事例を作るときは次の4原則を守る：

1. **1枚に収める** — 1ページ（1画面・スクロールなし）。`overflow:hidden` + `height:100%` の連鎖で担保。収まらなければ情報を削るかタブを足す。
2. **既存フォーマット準拠・複雑化しない** — 社長向けの状況説明・相談資料として使えること。独自レイアウトを足さない。
3. **情報量は必要最低限** — 1ファイル=1課題。論点は3〜4個まで。
4. **構造的に見せる** — 文章を積まず、タブ・SVG図・タグ・カードで整理する。

- **正本フォーマット**（複製元）: `docs/chart/problem_ex_1.html` / `problem_ex_2.html`。新規はこれを複製して中身を差し替える（ゼロから書かない）。
- **配色は意味で固定**: 青=主要 / アンバー=課題 / 赤=人・問題 / 緑=結論・決定 / 藍=管理 / グレー=通常業務。
- 課題事例は `problem_ex_{連番}.html` で作り、`chart/index.html` の一覧（`class="issue"`）に登録する。
- （ローカルのみ・gitignore）詳細な CSS/SVG/構造規約は `.claude/rules/shiryo-format.md` を参照。

## 規約

- **言語**: 入出力は日本語、内部思考は英語。資料・コミットメッセージも日本語。
- **Git**: リモート `nenaaki/ai-effective-project`、メインブランチ `main`。ユーザーの明示指示なしにコミットしない。
- **cSpell**: 独自語は `.vscode/settings.json` の `cSpell.words` に小文字で追加（現状: `autoincrement`, `claudecode`, `ssot`）。
- **`.gitignore`**: `.claude/` と `.work/` は追跡外。
