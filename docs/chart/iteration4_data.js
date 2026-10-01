// イテレーション4（2026-10-01〜）タスクデータ ── workitems4.html 共通ソース
//
// name=一意の短い和名 / base=基盤キー / group=区分 / code=設計書のタスクID / owner=BE|FE|DB|両
// person=担当者番号（レーン割当）/ deps=依存タスク名 / desc=概要1行
// asis=人力想定h（実装系は plan×5.45・仕様精査は ×1.5）/ plan=計画h（PV・EV）/ tobe=実績h（AC）/ status・progress=進捗
// 配列順＝ガントのレーン着手順。deps は配列内で必ず前方を指すこと。
//
// テスト設計・実施 = 実装系plan×0.168 ／ PR・レビュー対応 = ×0.102（イテレーション2実測の暫定係数）
//   分母は「テスト/PRがまだ済んでいない実装系plan」。実装完了で減らすとテスト枠が消えるので不可。
const ITERATION4_DATA = {
  meta: { sprint: 4, start: "2026-10-01", hoursPerDay: 7.2 },
  holidays: ["2026-10-12", "2026-11-03", "2026-11-23"],
  // 記録日→その時点の累積 EV/AC（h）。週1回くらい追記する。（着手前＝空）
  evmSnapshots: {
  },
  // 予定休（人員別）。終日休はその人員の営業日から除外し、当該人員のタスクを後ろ倒しする。
  //   終日休 = "2026-10-01" ／ 半休 = "2026-10-01:0.5"（末尾の数値＝休む割合。0.25 等も可）。
  leaves: {
  },
  bases: [
    { key: "prep",    id: "事", name: "事前工数",                 color: "#0d9488" },
    { key: "migrate", id: "①", name: "巨大データ移行(3億件想定)", color: "#d97706" },
    { key: "infra", id: "②", name: "インフラ4環境(dev/stg/prd)", color: "#4f46e5" },
    { key: "harness", id: "③", name: "結合テスト・シナリオテスト構築", color: "#dc2626" },
    { key: "ngfix", id: "④", name: "結合テストNG対応・AI原因分析", color: "#0891b2" },
    { key: "other",   id: "他", name: "その他工数",               color: "#94a3b8" },
    { key: "reserve", id: "予", name: "予備工数",                 color: "#64748b" },
  ],
  tasks: [
    // ───────── 事前工数 ─────────
    { name: "プランニング①・AI整備", base: "prep", person: 1, group: "事前工数", code: "P1", owner: "両", deps: [], asis: 7.2, plan: 7.2, tobe: 0, status: "予定", progress: 0, desc: "人員1：イテレーション4初日の事前工数。プランニング（タスク分解・段取り・論点整理）＋AI環境整備（エージェント／worktree 等の準備）。" },
    { name: "プランニング②・AI整備", base: "prep", person: 2, group: "事前工数", code: "P2", owner: "両", deps: [], asis: 7.2, plan: 7.2, tobe: 0, status: "予定", progress: 0, desc: "人員2：イテレーション4初日の事前工数。プランニング（タスク分解・段取り・論点整理）＋AI環境整備（エージェント／worktree 等の準備）。" },

    // ───────── ① 巨大データ移行(3億件想定) ─────────
    { name: "仕様精査(移行対象・現行データ棚卸し)～PM合意", base: "migrate", person: 1, group: "仕様精査", code: "M1", owner: "両", deps: [], asis: 21.6, plan: 14.4, tobe: 0, status: "予定", progress: 0, desc: "移行対象テーブル・件数・現行データの実態（欠損・重複・文字コード）の棚卸しと、移行方式の論点整理〜PM合意。停止可能時間と再実行の前提もここで確定させる。" },
    { name: "移行方式設計(分割・並列・リラン)", base: "migrate", person: 1, group: "基盤", code: "M2", owner: "BE", deps: ["仕様精査(移行対象・現行データ棚卸し)～PM合意"], asis: 45.8, plan: 8.4, tobe: 0, status: "予定", progress: 0, desc: "3億件を一括で流さない前提の分割単位（期間・キー範囲）と並列度、途中失敗からのリランをどう成立させるかを決める。" },
    { name: "移行スクリプト基盤(抽出・変換・投入)", base: "migrate", person: 1, group: "基盤", code: "M3", owner: "BE", deps: ["移行方式設計(分割・並列・リラン)"], asis: 61, plan: 11.2, tobe: 0, status: "予定", progress: 0, desc: "抽出・変換・投入を1本のジョブ定義で回す基盤。変換ルールは定義として外に出し、対象追加でコードを書き足さない形にする。" },
    { name: "件数・整合性の検証設計(突合・サンプリング)", base: "migrate", person: 1, group: "基盤", code: "M4", owner: "両", deps: ["移行スクリプト基盤(抽出・変換・投入)"], asis: 45.8, plan: 8.4, tobe: 0, status: "予定", progress: 0, desc: "移行元と移行先の件数突合、キー単位のチェックサム、値のサンプリング比較。どこまで確認できたら合格とするかを定義する。" },
    { name: "性能検証(本番相当データのリハーサル)", base: "migrate", person: 1, group: "適用", code: "M5", owner: "BE", deps: ["件数・整合性の検証設計(突合・サンプリング)"], asis: 61, plan: 11.2, tobe: 0, status: "予定", progress: 0, desc: "本番相当の件数で実行し、所要時間・リソース・ロック・ログ量を測る。停止可能時間に収まらない場合の分割見直しまでを含む。" },
    { name: "移行手順書・切替/切戻し設計", base: "migrate", person: 1, group: "適用", code: "M6", owner: "両", deps: ["性能検証(本番相当データのリハーサル)"], asis: 30.5, plan: 5.6, tobe: 0, status: "予定", progress: 0, desc: "当日の手順（実行順・確認点・判断基準）と、失敗時の切戻し。人が判断する箇所を明示する。" },
    { name: "移行リハーサルE2E", base: "migrate", person: 1, group: "E2E", code: "M7", owner: "両", deps: ["移行手順書・切替/切戻し設計"], asis: 22.9, plan: 4.2, tobe: 0, status: "予定", progress: 0, desc: "抽出→変換→投入→検証→切替までを通しで1回流す。途中失敗からのリランも確認する。" },
    { name: "テスト設計・実施(巨大データ移行(3億件想定))", base: "migrate", person: 1, group: "テスト", code: "QAM", owner: "両", deps: ["移行リハーサルE2E"], asis: 44.7, plan: 8.2, tobe: 0, status: "予定", progress: 0, desc: "①実装系49hに対するテスト仕様設計＋テスト実施。係数0.168＝イテレーション2実測。" },
    { name: "PR・レビュー対応(巨大データ移行(3億件想定))", base: "migrate", person: 1, group: "PR", code: "PRM", owner: "両", deps: [], asis: 27.3, plan: 5, tobe: 0, status: "予定", progress: 0, desc: "①実装系49hに対するPR本文作成＋レビュー指摘対応。係数0.102＝イテレーション2実測。" },

    // ───────── ② インフラ4環境(dev/stg/prd) ─────────
    { name: "仕様精査(環境構成の正本化)～PM合意", base: "infra", person: 2, group: "仕様精査", code: "I1", owner: "両", deps: [], asis: 21.6, plan: 14.4, tobe: 0, status: "予定", progress: 0, desc: "開発環境・dev・stg・prd の4環境について、構成の正本をどこに置き何を差分として持つかの整理〜PM合意。「AIでカチッと管理する」の到達点をここで定義する。" },
    { name: "環境定義の正本化(構成・パラメータ差分)", base: "infra", person: 2, group: "基盤", code: "I2", owner: "両", deps: ["仕様精査(環境構成の正本化)～PM合意"], asis: 61, plan: 11.2, tobe: 0, status: "予定", progress: 0, desc: "環境ごとに散っている構成・パラメータを1つの正本に集約し、環境差分だけを差分として持つ形にする。" },
    { name: "環境差分の検出・比較", base: "infra", person: 2, group: "基盤", code: "I3", owner: "両", deps: ["環境定義の正本化(構成・パラメータ差分)"], asis: 45.8, plan: 8.4, tobe: 0, status: "予定", progress: 0, desc: "正本と実環境、環境同士の差分を機械的に検出する。想定外の手作業変更を検知できる状態にする。" },
    { name: "構築/更新の自動化(dev・stg・prd)", base: "infra", person: 2, group: "適用", code: "I4", owner: "両", deps: ["環境差分の検出・比較"], asis: 61, plan: 11.2, tobe: 0, status: "予定", progress: 0, desc: "正本から各環境の構築・更新を実行する。手順書ではなく実行可能な形にし、環境の作り直しを現実的にする。" },
    { name: "AIエージェント向け環境操作の型", base: "infra", person: 2, group: "適用", code: "I5", owner: "両", deps: ["構築/更新の自動化(dev・stg・prd)"], asis: 45.8, plan: 8.4, tobe: 0, status: "予定", progress: 0, desc: "AIが環境を読み取り・変更提案するための入口を定義する。何を触ってよいかの境界と確認手順を型として置く。" },
    { name: "監視・コスト可視化の接続", base: "infra", person: 2, group: "適用", code: "I6", owner: "両", deps: ["AIエージェント向け環境操作の型"], asis: 30.5, plan: 5.6, tobe: 0, status: "予定", progress: 0, desc: "環境ごとの稼働監視とコストを同じ正本に紐づけて見えるようにする。" },
    { name: "環境E2E(dev→stg→prd の一巡)", base: "infra", person: 2, group: "E2E", code: "I7", owner: "両", deps: ["監視・コスト可視化の接続"], asis: 22.9, plan: 4.2, tobe: 0, status: "予定", progress: 0, desc: "同じ定義から3環境を更新し、差分検出が期待どおり空になることを確認する。" },
    { name: "テスト設計・実施(インフラ4環境(dev/stg/prd))", base: "infra", person: 2, group: "テスト", code: "QAI", owner: "両", deps: ["環境E2E(dev→stg→prd の一巡)"], asis: 44.7, plan: 8.2, tobe: 0, status: "予定", progress: 0, desc: "②実装系49hに対するテスト仕様設計＋テスト実施。係数0.168＝イテレーション2実測。" },
    { name: "PR・レビュー対応(インフラ4環境(dev/stg/prd))", base: "infra", person: 2, group: "PR", code: "PRI", owner: "両", deps: [], asis: 27.3, plan: 5, tobe: 0, status: "予定", progress: 0, desc: "②実装系49hに対するPR本文作成＋レビュー指摘対応。係数0.102＝イテレーション2実測。" },

    // ───────── ③ 結合テスト・シナリオテスト構築 ─────────
    { name: "仕様精査(シナリオ・テストデータの棚卸し)～PM合意", base: "harness", person: 1, group: "仕様精査", code: "H1", owner: "両", deps: [], asis: 21.6, plan: 14.4, tobe: 0, status: "予定", progress: 0, desc: "既存のテストシナリオ・テストデータの棚卸しと、前段プロセスの設計〜PM合意。2026-09-17 MTG の「インプットが100%正しい前提で作らない」方針に沿う。" },
    { name: "インプット精度の評価工程", base: "harness", person: 1, group: "基盤", code: "H2", owner: "両", deps: ["仕様精査(シナリオ・テストデータの棚卸し)～PM合意"], asis: 61, plan: 11.2, tobe: 0, status: "予定", progress: 0, desc: "シナリオ・テストデータがAIに正しく認識できる状態かを評価する工程。記載の曖昧さ・仕様との乖離を検出して差し戻す。" },
    { name: "サンプリング手動確認(AIアシスト)", base: "harness", person: 1, group: "適用", code: "H3", owner: "両", deps: ["インプット精度の評価工程"], asis: 45.8, plan: 8.4, tobe: 0, status: "予定", progress: 0, desc: "人が画面を見ながらAIアシストで数件通し、前提情報の正しさを担保する。全自動で回す前の関門。" },
    { name: "軽量ハーネス(スクリプト生成・実行)", base: "harness", person: 1, group: "基盤", code: "H4", owner: "両", deps: ["サンプリング手動確認(AIアシスト)"], asis: 76.3, plan: 14, tobe: 0, status: "予定", progress: 0, desc: "シナリオから再利用可能なテストスクリプトを生成し、実行・再実行できる軽量な仕組み。使い捨てにせず GitHub に保存し、手元で再確認できる状態にする。" },
    { name: "仕様変更の影響範囲抽出", base: "harness", person: 1, group: "適用", code: "H5", owner: "両", deps: ["軽量ハーネス(スクリプト生成・実行)"], asis: 61, plan: 11.2, tobe: 0, status: "予定", progress: 0, desc: "仕様変更から、再実行すべきシナリオ・対象画面/APIを抽出する。変更のたびに全件流さずに済む状態にする。" },
    { name: "網羅範囲の可視化", base: "harness", person: 1, group: "適用", code: "H6", owner: "両", deps: ["仕様変更の影響範囲抽出"], asis: 45.8, plan: 8.4, tobe: 0, status: "予定", progress: 0, desc: "画面・API × シナリオの網羅状況を可視化し、どこが手薄かを見えるようにする。" },
    { name: "結合テストE2E(ハーネス一巡)", base: "harness", person: 1, group: "E2E", code: "H7", owner: "両", deps: ["網羅範囲の可視化"], asis: 22.9, plan: 4.2, tobe: 0, status: "予定", progress: 0, desc: "精度確認→スクリプト生成→実行→結果集約までを通しで回す。" },
    { name: "テスト設計・実施(結合テスト・シナリオテスト構築)", base: "harness", person: 1, group: "テスト", code: "QAH", owner: "両", deps: ["結合テストE2E(ハーネス一巡)"], asis: 52.3, plan: 9.6, tobe: 0, status: "予定", progress: 0, desc: "③実装系57.4hに対するテスト仕様設計＋テスト実施。係数0.168＝イテレーション2実測。" },
    { name: "PR・レビュー対応(結合テスト・シナリオテスト構築)", base: "harness", person: 1, group: "PR", code: "PRH", owner: "両", deps: [], asis: 32.2, plan: 5.9, tobe: 0, status: "予定", progress: 0, desc: "③実装系57.4hに対するPR本文作成＋レビュー指摘対応。係数0.102＝イテレーション2実測。" },

    // ───────── ④ 結合テストNG対応・AI原因分析 ─────────
    { name: "仕様精査(NG項目の分類・受け口)～PM合意", base: "ngfix", person: 2, group: "仕様精査", code: "G1", owner: "両", deps: [], asis: 10.8, plan: 7.2, tobe: 0, status: "予定", progress: 0, desc: "NG項目をどう受け取り、どう分類するか（実装不具合／シナリオ側の誤り／データ起因／環境起因）の整理〜PM合意。" },
    { name: "NG項目の取り込み・台帳化", base: "ngfix", person: 2, group: "基盤", code: "G2", owner: "両", deps: ["仕様精査(NG項目の分類・受け口)～PM合意"], asis: 45.8, plan: 8.4, tobe: 0, status: "予定", progress: 0, desc: "手作業の転記・集計をやめ、テスト結果とエビデンスから台帳を自動で起こす。" },
    { name: "原因分析(NG→原因カテゴリ)", base: "ngfix", person: 2, group: "基盤", code: "G3", owner: "両", deps: ["NG項目の取り込み・台帳化"], asis: 76.3, plan: 14, tobe: 0, status: "予定", progress: 0, desc: "NGの内容・ログ・差分から原因カテゴリを推定して仕分ける。シナリオ側の誤りをここで切り分け、実装側の修正と混ぜない。" },
    { name: "バグ密度・テスト密度の集計", base: "ngfix", person: 2, group: "適用", code: "G4", owner: "両", deps: ["原因分析(NG→原因カテゴリ)"], asis: 45.8, plan: 8.4, tobe: 0, status: "予定", progress: 0, desc: "機能・モジュールごとのバグ密度とテスト密度を集計し、品質が薄い箇所を特定する。" },
    { name: "開発への差し戻し回路", base: "ngfix", person: 2, group: "適用", code: "G5", owner: "両", deps: ["バグ密度・テスト密度の集計"], asis: 45.8, plan: 8.4, tobe: 0, status: "予定", progress: 0, desc: "単体テストのやり直し・ブロッキングバグの優先修正を、通知とチケットで開発側へ差し戻す。" },
    { name: "品質収束レポート", base: "ngfix", person: 2, group: "適用", code: "G6", owner: "両", deps: ["開発への差し戻し回路"], asis: 30.5, plan: 5.6, tobe: 0, status: "予定", progress: 0, desc: "収束状況（残NG・再発・密度の推移）を定点で出す。次に何を直すべきかが読める形にする。" },
    { name: "NG対応E2E", base: "ngfix", person: 2, group: "E2E", code: "G7", owner: "両", deps: ["品質収束レポート"], asis: 22.9, plan: 4.2, tobe: 0, status: "予定", progress: 0, desc: "NG検出→分類→差し戻し→再テストまでを通しで回す。" },
    { name: "テスト設計・実施(結合テストNG対応・AI原因分析)", base: "ngfix", person: 2, group: "テスト", code: "QAG", owner: "両", deps: ["NG対応E2E"], asis: 44.7, plan: 8.2, tobe: 0, status: "予定", progress: 0, desc: "④実装系49hに対するテスト仕様設計＋テスト実施。係数0.168＝イテレーション2実測。" },
    { name: "PR・レビュー対応(結合テストNG対応・AI原因分析)", base: "ngfix", person: 2, group: "PR", code: "PRG", owner: "両", deps: [], asis: 27.3, plan: 5, tobe: 0, status: "予定", progress: 0, desc: "④実装系49hに対するPR本文作成＋レビュー指摘対応。係数0.102＝イテレーション2実測。" },

    // ───────── その他工数（イテレーション3の運用を踏襲した先取り枠）─────────
    { name: "AIエージェント不備 調査・改修枠①", base: "other", person: 1, group: "その他工数", code: "O1", owner: "両", deps: [], asis: 10.0, plan: 10.0, tobe: 0, status: "予定", progress: 0, desc: "エージェントの不備の調査・改修は毎回発生するため、人員1分を予め枠として見積もる。" },
    { name: "AIエージェント不備 調査・改修枠②", base: "other", person: 2, group: "その他工数", code: "O2", owner: "両", deps: [], asis: 10.0, plan: 10.0, tobe: 0, status: "予定", progress: 0, desc: "同上・人員2分。" },

    // ───────── 予備工数 ─────────
    { name: "予備工数1", base: "reserve", person: 1, group: "予備工数", code: "RS1", owner: "両", deps: [], asis: 20.0, plan: 20.0, tobe: 0, status: "予定", progress: 0, desc: "人員1の予備。仕様変更・割り込み・追加調査の吸収枠。" },
    { name: "予備工数2", base: "reserve", person: 2, group: "予備工数", code: "RS2", owner: "両", deps: [], asis: 20.0, plan: 20.0, tobe: 0, status: "予定", progress: 0, desc: "人員2の予備。仕様変更・割り込み・追加調査の吸収枠。" },
    { name: "AI改善工数①", base: "reserve", person: 1, group: "予備工数", code: "AI1", owner: "両", deps: [], asis: 20.0, plan: 20.0, tobe: 0, status: "予定", progress: 0, desc: "人員1：AI駆動そのものを良くするための枠。エージェント／スキル・プロンプト・インプット資料の改善、オーケストレーションの見直しなど。" },
    { name: "AI改善工数②", base: "reserve", person: 2, group: "予備工数", code: "AI2", owner: "両", deps: [], asis: 20.0, plan: 20.0, tobe: 0, status: "予定", progress: 0, desc: "人員2：同上。AI駆動の改善（エージェント整備・spec運用・レビュープロセス）に充てる枠。" },
  ],
};

if (typeof module !== "undefined" && module.exports) module.exports = { ITERATION4_DATA };
