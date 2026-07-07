// スプリント2（2026-07-13〜）タスクデータ ── workitems2.html / aidd_report2.html 共通ソース
// 出典: .work/基盤設計_01_認証認可.md / _02_配送ステータスイベント.md / _03_外部連携.md のタスク分解
//
// 各タスク:
//   name   : 短い和名（指示時に使う識別子。プロジェクト内で一意）
//   base   : 所属基盤キー（auth / status / export）
//   group  : 基盤内の区分（基盤 / テスト基盤 / 適用 など）
//   code   : 元設計書のタスクID（A / IT4 / IA1 …）
//   owner  : スキル区分（BE / FE / DB / 両）
//   person : 担当者番号（1 or 2）。カレンダー/バーンダウン/EVM のレーン割当。ここを編集すれば担当を変えられる（省略時は auth→1 / 他→2）
//   deps   : 依存タスクの短い和名（表示用。無ければ空配列）
//   asis   : AsIs（人力想定・概算h）
//   tobe   : ToBe（AI駆動見込み・素のh。バッファ前）
//   status / progress / actual : 進捗管理用（着手前は 予定 / 0 / 0）
//   desc   : 概要（1行）
//
// バッファ込みToBe = tobe × (1 + BUFFER_PCT) は各ビューで算出（計画・ガント・バーンダウンに使用）。
const SPRINT2_DATA = {
  meta: { sprint: 2, start: "2026-07-13", hoursPerDay: 7.2, bufferPct: 0.4 },
  // 2026年 祝日（スプリント期間にかかり得るもの）＋土日は自動除外
  holidays: ["2026-07-20", "2026-08-11", "2026-09-21", "2026-09-23"],
  bases: [
    { key: "auth",   id: "①", name: "認証・認可",              color: "#2563eb" },
    { key: "status", id: "②", name: "配送ステータス遷移",      color: "#0891b2" },
    { key: "export", id: "③", name: "外部連携(Export/Import)", color: "#7c3aed" },
    { key: "reserve", id: "予", name: "予備工数",              color: "#64748b" },
  ],
  tasks: [
    // ───────── ① 認証・認可：仕様精査 ─────────
    { name: "仕様精査(認可)",   base: "auth", person: 1, group: "仕様精査",   code: "SP",  owner: "両", deps: [], nobuffer: true, asis: 10.8, tobe: 7.2, status: "予定", progress: 0, actual: 0, desc: "認証・認可の要件・SEED権限データ・16bitモデルの精査と実装前の論点整理（scope複合・粒度・Cognito連携時期など）。" },
    // ───────── ① 認証・認可：基盤 ─────────
    { name: "JWT実装",          base: "auth", person: 1, group: "基盤",       code: "A",   owner: "BE", deps: [],                    asis: 8,  tobe: 3.0, status: "予定", progress: 0, actual: 0, desc: "JwtAuthGuard 本実装（Cognito署名検証・実ユーザー注入、dev-bypass温存）。最優先。" },
    { name: "判定コア",         base: "auth", person: 1, group: "基盤",       code: "B",   owner: "BE", deps: ["JWT実装"],           asis: 12, tobe: 4.0, status: "予定", progress: 0, actual: 0, desc: "resolveAccess/can/allowedScope＋accessBits DataLoader＋scope→where変換＋16bit単体テスト。" },
    { name: "Guard・デコレータ", base: "auth", person: 1, group: "基盤",       code: "C",   owner: "BE", deps: ["判定コア"],          asis: 6,  tobe: 2.5, status: "予定", progress: 0, actual: 0, desc: "PermissionGuard＋@RequirePermission。高リスクMutationから付与、scopeをbuildPrismaWhere統合。" },
    { name: "権限配布API",       base: "auth", person: 1, group: "基盤",       code: "D",   owner: "BE", deps: ["判定コア"],          asis: 6,  tobe: 2.5, status: "予定", progress: 0, actual: 0, desc: "getUserPermission本実装。menu/operation/scope可否マップを返す、schema.gql更新。" },
    { name: "権限ゲート(FE)",    base: "auth", person: 1, group: "基盤",       code: "E",   owner: "FE", deps: ["権限配布API"],       asis: 8,  tobe: 3.5, status: "予定", progress: 0, actual: 0, desc: "PermissionGate＋usePermission＋PERMISSION_KEYS。menu/PII列の出し分け。" },
    { name: "URLガード",         base: "auth", person: 1, group: "基盤",       code: "F",   owner: "FE", deps: ["権限配布API", "権限ゲート(FE)"], asis: 4, tobe: 1.5, status: "予定", progress: 0, actual: 0, desc: "app-admin isGuardedRoute にルート→権限マップ追加、無権限は /forbidden。" },
    { name: "driverガード",      base: "auth", person: 1, group: "基盤",       code: "G",   owner: "FE", deps: ["権限配布API"],       asis: 5,  tobe: 2.0, status: "予定", progress: 0, actual: 0, desc: "app-driver に未認証リダイレクト＋permissionガードを新設（現状ゼロ）。" },
    { name: "レガシー整理",      base: "auth", person: 1, group: "基盤",       code: "H",   owner: "BE", deps: ["Guard・デコレータ"], asis: 4,  tobe: 2.0, status: "予定", progress: 0, actual: 0, desc: "m-permission-* feature と permissionGroupId 依存を削除、roleGroupId 一本化。" },
    // ───────── ① 認証・認可：テスト基盤 ─────────
    { name: "ロールSEED",       base: "auth", person: 1, group: "テスト基盤", code: "IT1", owner: "DB", deps: ["判定コア"],          asis: 4,  tobe: 2.0, status: "予定", progress: 0, actual: 0, desc: "17ロール代表デモユーザー＋scope差（デポ/荷主違い）。ロールピッカーの選択肢。" },
    { name: "ロール切替",       base: "auth", person: 1, group: "テスト基盤", code: "IT2", owner: "BE", deps: ["JWT実装", "判定コア"], asis: 6, tobe: 2.5, status: "予定", progress: 0, actual: 0, desc: "dev-bypassにprincipal載せGuardが実注入。本番はサーバ側で厳格無効化。" },
    { name: "ロールピッカー",   base: "auth", person: 1, group: "テスト基盤", code: "IT3", owner: "FE", deps: ["権限配布API", "ロール切替"], asis: 5, tobe: 2.0, status: "予定", progress: 0, actual: 0, desc: "開発ツールバーのロール選択→入り直し→permission再取得→再ゲート。" },
    { name: "認可テスト基盤",   base: "auth", person: 1, group: "テスト基盤", code: "IT4", owner: "BE", deps: ["Guard・デコレータ", "権限配布API", "ロールSEED"], asis: 12, tobe: 4.0, status: "予定", progress: 0, actual: 0, desc: "actingAs()／Playwrightロール注入／SEED由来ゴールデン権限マトリクス突合。" },
    // ───────── ① 認証・認可：適用（横展開）─────────
    { name: "API適用:master",   base: "auth", person: 1, group: "適用",       code: "IA1", owner: "BE", deps: ["Guard・デコレータ", "権限配布API"], asis: 30, tobe: 6.0, status: "予定", progress: 0, actual: 0, desc: "master 実適用≒23res/105ops＋RF15。個人情報系を先頭に@RequirePermission＋scope。" },
    { name: "API適用:tms",      base: "auth", person: 1, group: "適用",       code: "IA2", owner: "BE", deps: ["Guard・デコレータ", "権限配布API"], asis: 24, tobe: 5.0, status: "予定", progress: 0, actual: 0, desc: "tms 8res/54ops＋RF15。自デポ/自荷主 scopeのwhere適用が主戦場。" },
    { name: "API適用:driver",   base: "auth", person: 1, group: "適用",       code: "IA3", owner: "BE", deps: ["Guard・デコレータ", "権限配布API"], asis: 10, tobe: 2.5, status: "予定", progress: 0, actual: 0, desc: "driver 1res/30ops。別紙02のactor制約と認可の責務分担を整理して付与。" },
    { name: "画面適用:admin共通", base: "auth", person: 1, group: "適用",      code: "IF1", owner: "FE", deps: ["権限ゲート(FE)", "URLガード"], asis: 8, tobe: 2.5, status: "予定", progress: 0, actual: 0, desc: "main-menu 約20リーフをcan()フィルタ＋RootLayout/isGuardedRoute配線（21ルート）。" },
    { name: "画面適用:admin各画面", base: "auth", person: 1, group: "適用",    code: "IF2", owner: "FE", deps: ["画面適用:admin共通"], asis: 28, tobe: 6.0, status: "予定", progress: 0, actual: 0, desc: "admin 21ルートにURL＋要素ガード。SCREEN操作102のキー付けが実体。" },
    { name: "画面適用:driver",   base: "auth", person: 1, group: "適用",       code: "IF3", owner: "FE", deps: ["driverガード"],     asis: 16, tobe: 3.5, status: "予定", progress: 0, actual: 0, desc: "app-driver 22ルートにURL＋要素ガード。KSL/配送員のロール差を反映。" },

    // ───────── ② 配送ステータス遷移 ─────────
    { name: "仕様精査(遷移)",   base: "status", person: 2, group: "仕様精査", code: "SP",  owner: "両", deps: [], nobuffer: true, asis: 10.8, tobe: 7.2, status: "予定", progress: 0, actual: 0, desc: "ステータス遷移正本（No.1〜17）・seed差分・遷移マトリクスの精査と実装前の論点整理（サブ化・可否3表・予定日=配車日ガード）。" },
    { name: "ステータスseed再編", base: "status", person: 2, group: "基盤",    code: "0",   owner: "DB", deps: [],                    asis: 6,  tobe: 3.0, status: "予定", progress: 0, actual: 0, desc: "確定モデルへseed更新＋既存データ付け替え（004→010001等・003000新設・003003廃止）。最優先。" },
    { name: "定数正本化",       base: "status", person: 2, group: "基盤",      code: "A",   owner: "BE", deps: ["ステータスseed再編"], asis: 4, tobe: 2.0, status: "予定", progress: 0, actual: 0, desc: "StatusCode/DeliveryEvent(E01〜E47)/Actorを型・定数化、codegenでFE配布。" },
    { name: "遷移マトリクス",   base: "status", person: 2, group: "基盤",      code: "B",   owner: "BE", deps: ["ステータスseed再編", "定数正本化"], asis: 6, tobe: 3.0, status: "予定", progress: 0, actual: 0, desc: "§3をTransitionRule[]へ。名前付きfrom集合の定数化、有効遷移の網羅レビュー。" },
    { name: "遷移サービス",     base: "status", person: 2, group: "基盤",      code: "C",   owner: "BE", deps: ["遷移マトリクス"],    asis: 12, tobe: 4.0, status: "予定", progress: 0, actual: 0, desc: "唯一の遷移入口。actor制約＋from制約＋$transaction＋memo＋楽観ロック＋単体テスト。" },
    { name: "ハンドラー基盤",   base: "status", person: 2, group: "基盤",      code: "C2",  owner: "BE", deps: ["遷移サービス"],      asis: 7,  tobe: 3.0, status: "予定", progress: 0, actual: 0, desc: "in-tx/post-commit 2レーン骨格＋outbox＋@TransitionHandler自己登録。" },
    { name: "mutation巻取り",   base: "status", person: 2, group: "基盤",      code: "D",   owner: "BE", deps: ["遷移サービス"],      asis: 8,  tobe: 3.0, status: "予定", progress: 0, actual: 0, desc: "updateDeliveryStatus/荷役confirm群をTransitionService経由へ。副作用if撤去。" },
    { name: "自動遷移配線",     base: "status", person: 2, group: "基盤",      code: "E",   owner: "BE", deps: ["遷移サービス"],      asis: 5,  tobe: 2.0, status: "予定", progress: 0, actual: 0, desc: "E01/02/03/05をバッチ・取込・WEB連携から呼ぶ。t_batch_logs記録。" },
    { name: "記録正規化",       base: "status", person: 2, group: "基盤",      code: "F",   owner: "BE", deps: ["遷移サービス"],      asis: 3,  tobe: 1.5, status: "予定", progress: 0, actual: 0, desc: "t_delivery_memos の workContent/workType をイベント由来で統一。" },
    { name: "FE連携",           base: "status", person: 2, group: "基盤",      code: "G",   owner: "FE", deps: ["定数正本化", "mutation巻取り"], asis: 8, tobe: 3.0, status: "予定", progress: 0, actual: 0, desc: "business-actionsをstatusCode直送信→イベント送信へ。持ち戻りサブ化UI反映。" },
    { name: "遷移図ドキュメント", base: "status", person: 2, group: "基盤",    code: "H",   owner: "両", deps: ["遷移マトリクス"],    asis: 3,  tobe: 1.5, status: "予定", progress: 0, actual: 0, desc: "ステータス×イベントのマトリクス図を成果物化、m-delivery-status.md反映。" },

    // ───────── ③ 外部連携（Export/Import）─────────
    { name: "仕様精査(連携)",   base: "export", person: 2, group: "仕様精査", code: "SP",  owner: "両", deps: [], nobuffer: true, asis: 10.8, tobe: 7.2, status: "予定", progress: 0, actual: 0, desc: "エクスポート既存基盤／インポート新設の精査と実装前の論点整理（レジストリ化・ファイル授受方式・バリデーション正本・文字コード）。" },
    { name: "Exportレジストリ", base: "export", person: 2, group: "Export",   code: "E1",  owner: "FE", deps: [],                    asis: 6,  tobe: 2.5, status: "予定", progress: 0, actual: 0, desc: "EXPORT_REGISTRY集約＋export-tableのmap描画化（SWCバグを1グループで先行検証）。" },
    { name: "Formatter抽象化",  base: "export", person: 2, group: "Export",   code: "E2",  owner: "FE", deps: [],                    asis: 6,  tobe: 2.5, status: "予定", progress: 0, actual: 0, desc: "ExportFormatter I/F。csv/excel実装。cod-confirmation独自Excelの吸収検討。" },
    { name: "列権限メタ",       base: "export", person: 2, group: "Export",   code: "E3",  owner: "FE", deps: ["Exportレジストリ", "権限ゲート(FE)"], asis: 3, tobe: 1.5, status: "予定", progress: 0, actual: 0, desc: "列定義にformat/必要権限メタ。認可基盤(①)連携でPII列を自動出し分け。" },
    { name: "export切出し",     base: "export", person: 2, group: "Export",   code: "E4",  owner: "BE", deps: [],                    asis: 4,  tobe: 2.0, status: "予定", progress: 0, actual: 0, desc: "delivery同居の2メソッドをexport featureへ分離、include/行組立を共通ヘルパに。" },
    { name: "単票データソース", base: "export", person: 2, group: "Export",   code: "E5",  owner: "BE", deps: [],                    asis: 8,  tobe: 3.0, status: "予定", progress: 0, actual: 0, desc: "IVR受電/WEB受信/対応履歴の専用クエリ実装、misc-reportsの'-'ダミー解消。" },
    { name: "授受方式選定",     base: "export", person: 2, group: "Import",   code: "I1",  owner: "BE", deps: [],                    asis: 3,  tobe: 1.5, status: "予定", progress: 0, actual: 0, desc: "Uploadスカラー/Base64/署名付きURLのいずれか決定＋PoC。" },
    { name: "Importエンジン",   base: "export", person: 2, group: "Import",   code: "I2",  owner: "FE", deps: ["授受方式選定"],      asis: 9,  tobe: 3.5, status: "予定", progress: 0, actual: 0, desc: "ImportDefinition＋useCsvImport。パース→検証→プレビュー→反映→結果表示。" },
    { name: "import feature",   base: "export", person: 2, group: "Import",   code: "I3",  owner: "BE", deps: ["授受方式選定"],      asis: 8,  tobe: 3.0, status: "予定", progress: 0, actual: 0, desc: "一括登録mutation・$transaction・部分失敗ポリシー・冪等upsert・取込ログ。" },
    { name: "初回Import定義",   base: "export", person: 2, group: "Import",   code: "I4",  owner: "両", deps: ["Importエンジン", "import feature"], asis: 5, tobe: 2.0, status: "予定", progress: 0, actual: 0, desc: "業務優先度の高い1件（お客様情報変更依頼 取込等）で縦貫検証。" },
    // ───────── 予備工数（各人員の残キャパを 7/31 まで確保。nobuffer＝素の時間）─────────
    { name: "予備工数1",        base: "reserve", person: 1, group: "予備工数", code: "R1",  owner: "両", deps: [], nobuffer: true, asis: 13.8, tobe: 13.8, status: "予定", progress: 0, actual: 0, desc: "人員1（①認証認可）の残キャパ。手戻り・追加調査・レビュー対応・仕様確認の往復などの予備枠（7/31 まで）。" },
    { name: "予備工数2",        base: "reserve", person: 2, group: "予備工数", code: "R2",  owner: "両", deps: [], nobuffer: true, asis: 19.9, tobe: 19.9, status: "予定", progress: 0, actual: 0, desc: "人員2（②③）の残キャパ。手戻り・追加調査・レビュー対応・仕様確認の往復などの予備枠（7/31 まで）。" },
  ],
};

if (typeof module !== "undefined" && module.exports) module.exports = { SPRINT2_DATA };
