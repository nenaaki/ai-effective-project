// イテレーション3（2026-09-01〜）タスクデータ ── workitems3.html 共通ソース
//
// name=一意の短い和名 / base=基盤キー / group=区分 / code=設計書のタスクID / owner=BE|FE|DB|両
// person=担当者番号（レーン割当）/ deps=依存タスク名 / desc=概要1行
// asis=人力想定h（実装系は plan×5.45）/ plan=計画h（PV・EV）/ tobe=実績h（AC）/ status・progress=進捗
// 配列順＝ガントのレーン着手順。deps は配列内で必ず前方を指すこと。
//
// テスト設計・実施 = 実装系plan×0.168 ／ PR・レビュー対応 = ×0.102（イテレーション2実測の暫定係数）
//   分母は「テスト/PRがまだ済んでいない実装系plan」。実装完了で減らすとテスト枠が消えるので不可。
const ITERATION3_DATA = {
  meta: { sprint: 3, start: "2026-09-01", hoursPerDay: 7.2 },
  holidays: ["2026-09-21", "2026-09-22", "2026-09-23", "2026-10-12", "2026-11-03", "2026-11-23"],
  // 記録日→その時点の累積 EV/AC（h）。週1回くらい追記する。（着手前＝空）
  evmSnapshots: {
  },
  // 予定休（人員別）。終日休はその人員の営業日から除外し、当該人員のタスクを後ろ倒しする。
  //   終日休 = "2026-09-01" ／ 半休 = "2026-09-01:0.5"（末尾の数値＝休む割合。0.25 等も可）。
  leaves: {
    "1": [],
    "2": [],
  },
  bases: [
    { key: "prep",    id: "事", name: "事前工数",                 color: "#0d9488" },
    { key: "csv",     id: "①", name: "CSV出力(非同期帳票へ移植)", color: "#d97706" },
    { key: "notify",  id: "②", name: "通知基盤",                  color: "#7c3aed" },
    { key: "audit",   id: "④", name: "監査ログ・操作履歴",        color: "#2563eb" },
    { key: "ivr",     id: "⑥", name: "IVR連携(持ち越し)",         color: "#c026d3" },
    { key: "message", id: "⑦", name: "メッセージ基盤",             color: "#0891b2" },
    { key: "other",   id: "他", name: "その他工数",               color: "#94a3b8" },
    { key: "reserve", id: "予", name: "予備工数",                 color: "#64748b" },
  ],
  tasks: [
    // ───────── 事前工数 ─────────
    { name: "プランニング①・AI整備", base: "prep", person: 1, group: "事前工数", code: "P1", owner: "両", deps: [], asis: 7.2, plan: 7.2, tobe: 0, status: "予定", progress: 0, desc: "人員1：イテレーション3初日の事前工数。プランニング（タスク分解・段取り・論点整理）＋AI環境整備（エージェント／worktree 等の準備）。" },
    { name: "プランニング②・AI整備", base: "prep", person: 2, group: "事前工数", code: "P2", owner: "両", deps: [], asis: 7.2, plan: 7.2, tobe: 0, status: "予定", progress: 0, desc: "人員2：イテレーション3初日の事前工数。プランニング（タスク分解・段取り・論点整理）＋AI環境整備（エージェント／worktree 等の準備）。" },
    { name: "仕様反映の自動化(spec→リポジトリ)", base: "prep", person: 2, group: "事前工数", code: "P3", owner: "両", deps: [], asis: 7.2, plan: 7.2, tobe: 0, status: "予定", progress: 0, desc: "イテレーション2の課題対応。リポジトリ内の仕様反映が手作業で手戻りの原因になっていたため、spec からリポジトリへの反映を自動化する（AIインプットの正本を常に最新に保つ）。" },

    // ───────── ① CSV出力（既存CSV出力を非同期帳票出力基盤へ移植）─────────
    { name: "仕様精査(CSV出力)～PM合意", base: "csv", person: 1, group: "仕様精査", code: "SP1", owner: "両", deps: [], asis: 21.6, plan: 14.4, tobe: 0, status: "予定", progress: 0, desc: "既存CSV出力の棚卸し（対象一覧・列定義・文字コード・改行・件数上限）と、非同期帳票出力基盤へ寄せる際の論点整理〜PM合意。" },
    { name: "CSV出力定義基盤", base: "csv", person: 1, group: "基盤", code: "C1", owner: "BE", deps: ["仕様精査(CSV出力)～PM合意"], asis: 22.9, plan: 4.2, tobe: 0, status: "予定", progress: 0, desc: "「定義1個＝1CSV」の出力定義型（列・並び・書式・文字コード）。イテレーション2のファイル定義基盤と同じ考え方を出力側へ適用。" },
    { name: "CSV生成エンジン(非同期基盤へ移植)", base: "csv", person: 1, group: "基盤", code: "C2", owner: "BE", deps: ["CSV出力定義基盤"], asis: 30.5, plan: 5.6, tobe: 0, status: "予定", progress: 0, desc: "PDF帳票と同じ非同期ジョブ基盤・生成状況テーブル・S3成果物の上にCSV生成を載せる。同期・その場生成をやめ、大量件数でもタイムアウトしない構造へ。" },
    { name: "生成/状況API拡張(CSV)", base: "csv", person: 1, group: "基盤", code: "C3", owner: "BE", deps: ["CSV生成エンジン(非同期基盤へ移植)"], asis: 15.3, plan: 2.8, tobe: 0, status: "予定", progress: 0, desc: "既存の生成/状況APIをCSV種別へ拡張（生成リクエスト・状況ポーリング・DL URL発行）。帳票と同一I/Fで扱う。" },
    { name: "画面出力連携(FE・CSV)", base: "csv", person: 1, group: "適用", code: "C4", owner: "FE", deps: ["生成/状況API拡張(CSV)"], asis: 19.1, plan: 3.5, tobe: 0, status: "予定", progress: 0, desc: "各画面のCSVダウンロードを非同期方式へ差し替え（リクエスト→状況表示→完了でDL／エラー表示）。帳票出力のFE部品を再利用。" },
    { name: "既存CSV出力の移行・廃止", base: "csv", person: 1, group: "適用", code: "C5", owner: "両", deps: ["画面出力連携(FE・CSV)"], asis: 22.9, plan: 4.2, tobe: 0, status: "予定", progress: 0, desc: "旧CSV出力経路を新基盤へ順次移行し、重複した実装を廃止。出力結果の同一性（列・並び・文字コード）を突合して切替。" },
    { name: "CSV E2E", base: "csv", person: 1, group: "E2E", code: "C6", owner: "両", deps: ["既存CSV出力の移行・廃止"], asis: 11.4, plan: 2.1, tobe: 0, status: "予定", progress: 0, desc: "画面操作から非同期生成・S3配置・DLまでの一連を通す。大量件数／0件／エラーの3系統を確認。" },
    { name: "テスト設計・実施(CSV)", base: "csv", person: 1, group: "テスト", code: "QA1", owner: "両", deps: ["CSV E2E"], asis: 20.5, plan: 3.8, tobe: 0, status: "予定", progress: 0, desc: "①実装系22.4hに対するテスト仕様設計＋テスト実施。係数0.168＝イテレーション2実測。" },
    { name: "PR・レビュー対応(CSV)", base: "csv", person: 1, group: "PR", code: "PR1", owner: "両", deps: [], asis: 12.5, plan: 2.3, tobe: 0, status: "予定", progress: 0, desc: "①実装系22.4hに対するPR本文作成＋レビュー指摘対応。係数0.102＝イテレーション2実測。" },

    // ───────── ② 通知基盤（アプリ内通知＋既存SMS連携I/Fの再利用）─────────
    { name: "仕様精査(通知基盤)～PM合意", base: "notify", person: 2, group: "仕様精査", code: "SP2", owner: "両", deps: [], asis: 21.6, plan: 14.4, tobe: 0, status: "予定", progress: 0, desc: "通知の種別・宛先（ロール／デポ／個人）・チャネル（アプリ内・メール・SMS）・既読管理・再送方針の整理〜PM合意。業務イベントの棚卸しを含む。" },
    { name: "通知テーブル・種別マスタ", base: "notify", person: 2, group: "基盤", code: "N1", owner: "DB", deps: ["仕様精査(通知基盤)～PM合意"], asis: 15.3, plan: 2.8, tobe: 0, status: "予定", progress: 0, desc: "通知本体・宛先・既読状態・種別マスタのテーブル設計。帳票の生成状況/通知テーブルを一般化して通知の正本にする。" },
    { name: "通知サービス・API", base: "notify", person: 2, group: "基盤", code: "N2", owner: "BE", deps: ["通知テーブル・種別マスタ"], asis: 30.5, plan: 5.6, tobe: 0, status: "予定", progress: 0, desc: "発行・一覧取得・既読更新・未読件数のBEサービス＋GraphQL。業務コードからは「通知を出す」1本の呼び出しで済む形にする。" },
    { name: "配信チャネル抽象(アプリ内/メール/SMS)", base: "notify", person: 2, group: "基盤", code: "N3", owner: "BE", deps: ["通知サービス・API"], asis: 22.9, plan: 4.2, tobe: 0, status: "予定", progress: 0, desc: "チャネルをドライバーとして差し替え可能に。SMSはイテレーション2のSMSサービスI/F（IF008）をそのまま再利用し、実装を重複させない。" },
    { name: "通知UI(ベル・一覧・既読)", base: "notify", person: 2, group: "適用", code: "N4", owner: "FE", deps: ["通知サービス・API"], asis: 26.7, plan: 4.9, tobe: 0, status: "予定", progress: 0, desc: "ヘッダのベル（未読件数）・通知一覧・既読操作・該当画面への遷移。admin共通レイアウトへ組み込む。" },
    { name: "業務イベント連携(帳票完了/取込エラー)", base: "notify", person: 2, group: "適用", code: "N5", owner: "BE", deps: ["配信チャネル抽象(アプリ内/メール/SMS)"], asis: 19.1, plan: 3.5, tobe: 0, status: "予定", progress: 0, desc: "既存基盤の完了・失敗イベントを通知へ接続（帳票/CSV生成完了、ファイル取込エラー、SMS配信失敗）。③の失敗検知の受け口にもなる。" },
    { name: "通知E2E", base: "notify", person: 2, group: "E2E", code: "N6", owner: "両", deps: ["通知UI(ベル・一覧・既読)", "業務イベント連携(帳票完了/取込エラー)"], asis: 11.4, plan: 2.1, tobe: 0, status: "予定", progress: 0, desc: "業務イベント発生→通知発行→UI表示→既読までを通す。宛先ロール違いで見えないことも確認。" },
    { name: "テスト設計・実施(通知基盤)", base: "notify", person: 2, group: "テスト", code: "QA2", owner: "両", deps: ["通知E2E"], asis: 21.3, plan: 3.9, tobe: 0, status: "予定", progress: 0, desc: "②実装系23.1hに対するテスト仕様設計＋テスト実施。係数0.168。" },
    { name: "PR・レビュー対応(通知基盤)", base: "notify", person: 2, group: "PR", code: "PR2", owner: "両", deps: [], asis: 13.1, plan: 2.4, tobe: 0, status: "予定", progress: 0, desc: "②実装系23.1hに対するPR本文作成＋レビュー指摘対応。係数0.102。" },

    // ───────── ④ 監査ログ・操作履歴 ─────────
    { name: "仕様精査(監査ログ)～PM合意", base: "audit", person: 1, group: "仕様精査", code: "SP4", owner: "両", deps: [], asis: 21.6, plan: 14.4, tobe: 0, status: "予定", progress: 0, desc: "記録対象（誰が・いつ・どの画面/APIで・何を・どう変えた）・保持期間・閲覧権限・個人情報の扱いの整理〜PM合意。" },
    { name: "監査ログテーブル設計", base: "audit", person: 1, group: "基盤", code: "D1", owner: "DB", deps: ["仕様精査(監査ログ)～PM合意"], asis: 15.3, plan: 2.8, tobe: 0, status: "予定", progress: 0, desc: "操作ログ（アクセス／操作）と変更差分ログ（前後値）を分けて設計。件数が伸びる前提でインデックス・分割を決める。" },
    { name: "記録インターセプタ(BE共通)", base: "audit", person: 1, group: "基盤", code: "D2", owner: "BE", deps: ["監査ログテーブル設計"], asis: 22.9, plan: 4.2, tobe: 0, status: "予定", progress: 0, desc: "全APIを横串で通る共通インターセプタで操作を自動記録。認証・認可のユーザー情報／権限対象カタログを流用し、業務コードに記録処理を書かせない。" },
    { name: "変更差分記録(ORM共通)", base: "audit", person: 1, group: "基盤", code: "D3", owner: "BE", deps: ["記録インターセプタ(BE共通)"], asis: 22.9, plan: 4.2, tobe: 0, status: "予定", progress: 0, desc: "ORM層で更新前後の差分を自動抽出して記録。テーブル追加時に追加実装が要らない形（データ型駆動）にする。" },
    { name: "操作履歴照会API", base: "audit", person: 1, group: "基盤", code: "D4", owner: "BE", deps: ["変更差分記録(ORM共通)"], asis: 15.3, plan: 2.8, tobe: 0, status: "予定", progress: 0, desc: "期間・ユーザー・対象・操作種別での検索API。閲覧はイテレーション2の権限判定でロール制御。" },
    { name: "操作履歴画面", base: "audit", person: 1, group: "適用", code: "D5", owner: "FE", deps: ["操作履歴照会API"], asis: 19.1, plan: 3.5, tobe: 0, status: "予定", progress: 0, desc: "操作履歴の一覧・絞り込み・差分表示（前後値）。データ型×CRUDの一覧画面パターンを再利用。" },
    { name: "保持期間・エクスポート", base: "audit", person: 1, group: "適用", code: "D6", owner: "BE", deps: ["操作履歴照会API"], asis: 11.4, plan: 2.1, tobe: 0, status: "予定", progress: 0, desc: "保持期間経過分の退避／削除と、監査提出用のエクスポート。①CSV出力基盤と③定期実行基盤に載せる。" },
    { name: "テスト設計・実施(監査ログ)", base: "audit", person: 1, group: "テスト", code: "QA4", owner: "両", deps: ["操作履歴画面", "保持期間・エクスポート"], asis: 18.0, plan: 3.3, tobe: 0, status: "予定", progress: 0, desc: "④実装系19.6hに対するテスト仕様設計＋テスト実施。係数0.168。" },
    { name: "PR・レビュー対応(監査ログ)", base: "audit", person: 1, group: "PR", code: "PR4", owner: "両", deps: [], asis: 10.9, plan: 2.0, tobe: 0, status: "予定", progress: 0, desc: "④実装系19.6hに対するPR本文作成＋レビュー指摘対応。係数0.102。" },

    // ───────── ⑥ IVR連携（イテレーション2からの持ち越し。設計まで完了・実装以降が残作業）─────────
    { name: "設計差分確認・タスク化(IVR)", base: "ivr", person: 2, group: "仕様精査", code: "IV1", owner: "両", deps: [], asis: 5.4, plan: 3.6, tobe: 0, status: "予定", progress: 0, desc: "イテレーション2で設計まで完了済み（IF007・API01〜04）。着手前に設計と現行実装の差分を確認してタスク化する。仕様精査は済んでいるため0.5日。" },
    { name: "IVRドライバー追加(外部連携基盤)", base: "ivr", person: 1, group: "基盤", code: "V1", owner: "BE", deps: ["設計差分確認・タスク化(IVR)"], asis: 15.3, plan: 2.8, tobe: 0, status: "予定", progress: 0, desc: "外部サービス連携の土台（機能I/F＋ドライバー差し替え＋開発用エミュレーター）はイテレーション2のSMS連携で構築済み。IVRベンダー向けドライバー（接続・認証・エラー変換）だけを追加し、共通部分は作り直さない。" },
    { name: "IVR受付API実装(API01〜04)", base: "ivr", person: 1, group: "適用", code: "V2", owner: "BE", deps: ["IVRドライバー追加(外部連携基盤)"], asis: 30.5, plan: 5.6, tobe: 0, status: "予定", progress: 0, desc: "IVR特有の実装の中核。コールフロー本体は他社担当で、当社範囲は電話自動応答から呼ばれるAPI01〜04（再配達の受付可否判定・登録）。設計書どおりに実装する。" },
    { name: "IF007 予約上限送信(当社→IVR)", base: "ivr", person: 1, group: "適用", code: "V3", owner: "BE", deps: ["IVR受付API実装(API01〜04)"], asis: 15.3, plan: 2.8, tobe: 0, status: "予定", progress: 0, desc: "IVR予約上限送信IF（IF007）。日次の受付可能枠をIVR側へ送信する。③定期実行・監視基盤のジョブ定義として載せ、失敗は②通知基盤へ通報する。" },
    { name: "IVR E2E(エミュレーター)", base: "ivr", person: 1, group: "E2E", code: "V4", owner: "両", deps: ["IF007 予約上限送信(当社→IVR)"], asis: 11.4, plan: 2.1, tobe: 0, status: "予定", progress: 0, desc: "SMS連携で作った開発用エミュレーターをIVR向けに使い、着信→受付→登録→上限送信までを通す。受付上限到達・対象なし・エラーの3系統を確認。" },
    { name: "テスト設計・実施(IVR)", base: "ivr", person: 1, group: "テスト", code: "QA6", owner: "両", deps: ["IVR E2E(エミュレーター)"], asis: 12.2, plan: 2.2, tobe: 0, status: "予定", progress: 0, desc: "⑥実装系13.3hに対するテスト仕様設計＋テスト実施。係数0.168。" },
    { name: "PR・レビュー対応(IVR)", base: "ivr", person: 1, group: "PR", code: "PR6", owner: "両", deps: [], asis: 7.4, plan: 1.4, tobe: 0, status: "予定", progress: 0, desc: "⑥実装系13.3hに対するPR本文作成＋レビュー指摘対応。係数0.102。" },

    // ───────── ⑦ メッセージ基盤（メッセージID×本文の一元管理と、エラー・警告のユーザー通達）─────────
    { name: "仕様精査(メッセージ基盤)～PM合意", base: "message", person: 2, group: "仕様精査", code: "SP7", owner: "両", deps: [], asis: 21.6, plan: 14.4, tobe: 0, status: "予定", progress: 0, desc: "メッセージID体系（区分・採番規則）、種別（エラー／警告／確認／完了）、引数の埋め込み仕様、表示方法（トースト／インライン／ダイアログ）、APIエラーの分類とマッピング方針の整理〜PM合意。正本はリポジトリ内の定義ファイルとし、実行時のAPI取得は行わない（サーバー障害時に文言が引けなくなるため）方針もここで確定させる。" },
    { name: "メッセージ定義(正本)・ID体系", base: "message", person: 2, group: "基盤", code: "M1", owner: "両", deps: ["仕様精査(メッセージ基盤)～PM合意"], asis: 15.3, plan: 2.8, tobe: 0, status: "予定", progress: 0, desc: "ID・本文・種別・重要度を持つ定義ファイル（リポジトリ内の正本1本）。本文は{0}{1}形式の差し込み位置を持ち、文字列の引数を後から追加できる。DBテーブルは持たず、文言は正本を直せば全画面に効く。" },
    { name: "メッセージカタログ生成(FE/BE同梱)", base: "message", person: 2, group: "基盤", code: "M2", owner: "両", deps: ["メッセージ定義(正本)・ID体系"], asis: 22.9, plan: 4.2, tobe: 0, status: "予定", progress: 0, desc: "正本からビルド時に型付きカタログを生成し、FE・BE双方へライブラリとして同梱する。引数の個数・型の不一致と未定義IDはコンパイル時に検出。実行時のメッセージ取得APIは作らない。" },
    { name: "APIエラー抽出・ID＋引数化(BE共通)", base: "message", person: 2, group: "基盤", code: "M3", owner: "BE", deps: ["メッセージカタログ生成(FE/BE同梱)"], asis: 26.7, plan: 4.9, tobe: 0, status: "予定", progress: 0, desc: "APIのバリデーションエラー・業務エラー・外部サービス障害・想定外例外を横串で拾い、メッセージIDと引数の形に変換して返す共通処理。本文は返さず、解決はFE側の同梱カタログに任せる（ログにもIDが残る）。" },
    { name: "FE共通表示部品(トースト/インライン/ダイアログ)", base: "message", person: 2, group: "適用", code: "M4", owner: "FE", deps: ["APIエラー抽出・ID＋引数化(BE共通)"], asis: 22.9, plan: 4.2, tobe: 0, status: "予定", progress: 0, desc: "同梱カタログでID＋引数から本文を解決し、種別に応じてインライン／トースト／ダイアログを自動選択する共通部品。通信断・500・メンテ中のフォールバック文言もFE側に同梱し、サーバーが応答しなくても表示できる状態にする。" },
    { name: "画面・APIバリデーションのメッセージ統合", base: "message", person: 2, group: "適用", code: "M5", owner: "両", deps: ["FE共通表示部品(トースト/インライン/ダイアログ)"], asis: 19.1, plan: 3.5, tobe: 0, status: "予定", progress: 0, desc: "画面側の入力チェックとAPI側の検証を同じメッセージIDに寄せ、同じ違反には同じ文言が出る状態にする。データ型駆動で一括適用し、画面追加時に文言を作り足さなくて済む形にする。" },
    { name: "メッセージE2E", base: "message", person: 2, group: "E2E", code: "M6", owner: "両", deps: ["画面・APIバリデーションのメッセージ統合"], asis: 11.4, plan: 2.1, tobe: 0, status: "予定", progress: 0, desc: "入力不備・業務エラー・外部サービス障害の3系統で、同じIDから同じ文言が同じ表示方法で出ることを通す。BEを停止させた状態でも通信断メッセージが出ることを確認する。" },
    { name: "テスト設計・実施(メッセージ基盤)", base: "message", person: 2, group: "テスト", code: "QA7", owner: "両", deps: ["メッセージE2E"], asis: 19.9, plan: 3.6, tobe: 0, status: "予定", progress: 0, desc: "⑦実装系21.7hに対するテスト仕様設計＋テスト実施（未定義ID・引数不一致・多重エラー・サーバー無応答の境界値を含む）。係数0.168。" },
    { name: "PR・レビュー対応(メッセージ基盤)", base: "message", person: 2, group: "PR", code: "PR7", owner: "両", deps: [], asis: 12.1, plan: 2.2, tobe: 0, status: "予定", progress: 0, desc: "⑦実装系21.7hに対するPR本文作成＋レビュー指摘対応。係数0.102。" },
    // ───────── その他工数（イテレーション2の反省を反映した先取り枠）─────────
    { name: "AIエージェント不備 調査・改修枠①", base: "other", person: 1, group: "その他工数", code: "O1", owner: "両", deps: [], asis: 10.0, plan: 10.0, tobe: 0, status: "予定", progress: 0, desc: "イテレーション2の課題対応。エージェントの不備の調査・改修は毎回発生するため、実績（デバッグ／設計エージェント計28h）を踏まえ人員1分を予め見積もる。" },
    { name: "AIエージェント不備 調査・改修枠②", base: "other", person: 2, group: "その他工数", code: "O2", owner: "両", deps: [], asis: 10.0, plan: 10.0, tobe: 0, status: "予定", progress: 0, desc: "同上・人員2分。イテレーション2では見積外だったため実績が計画超過として現れた。今回は枠として明示する。" },

    // ───────── 予備工数 ─────────
    { name: "予備工数1", base: "reserve", person: 1, group: "予備工数", code: "RS1", owner: "両", deps: [], asis: 20.0, plan: 20.0, tobe: 0, status: "予定", progress: 0, desc: "人員1の予備。仕様変更・割り込み・追加調査の吸収枠。" },
    { name: "予備工数2", base: "reserve", person: 2, group: "予備工数", code: "RS2", owner: "両", deps: [], asis: 20.0, plan: 20.0, tobe: 0, status: "予定", progress: 0, desc: "人員2の予備。仕様変更・割り込み・追加調査の吸収枠。" },
    { name: "AI改善工数①", base: "reserve", person: 1, group: "予備工数", code: "AI1", owner: "両", deps: [], asis: 20.0, plan: 20.0, tobe: 0, status: "予定", progress: 0, desc: "人員1：AI駆動そのものを良くするための枠。エージェント／スキル・プロンプト・インプット資料の改善、オーケストレーションの見直しなど。イテレーション2で計画外に発生した分を、今回は最初から枠として確保する。" },
    { name: "AI改善工数②", base: "reserve", person: 2, group: "予備工数", code: "AI2", owner: "両", deps: [], asis: 20.0, plan: 20.0, tobe: 0, status: "予定", progress: 0, desc: "人員2：同上。AI駆動の改善（エージェント整備・spec運用・レビュープロセス）に充てる枠。" },
  ],
};

if (typeof module !== "undefined" && module.exports) module.exports = { ITERATION3_DATA };
