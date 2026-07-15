// スプリント2（2026-07-14〜）タスクデータ ── workitems2.html / aidd_report2.html 共通ソース
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
  meta: { sprint: 2, start: "2026-07-14", hoursPerDay: 7.2, bufferPct: 0.4 },
  // 2026年 祝日（スプリント期間にかかり得るもの）＋土日は自動除外
  holidays: ["2026-07-20", "2026-08-11", "2026-09-21", "2026-09-23"],
  bases: [
    { key: "prep",   id: "事", name: "事前工数",              color: "#0d9488" },
    { key: "auth",   id: "①", name: "認証・認可",              color: "#2563eb" },
    { key: "export", id: "②", name: "外部連携(SMS/IVR)", color: "#7c3aed" },
    { key: "file",   id: "③", name: "ファイル連携(取込/送信)", color: "#0891b2" },
    { key: "report", id: "④", name: "帳票出力(PDF生成)",       color: "#d97706" },
    { key: "reserve", id: "予", name: "予備工数",              color: "#64748b" },
  ],
  tasks: [
    // ───────── 事前工数（①②③④より前・7/14）─────────
    { name: "プランニング①・AI整備", base: "prep", person: 1, group: "事前工数", code: "P1", owner: "両", deps: [], nobuffer: true, asis: 7.2, tobe: 7.2, status: "予定", progress: 0, actual: 0, desc: "人員1：スプリント2初日の事前工数。プランニング（タスク分解・段取り・論点整理）＋AI環境整備（エージェント／worktree 等の準備）。" },
    { name: "プランニング②・AI整備", base: "prep", person: 2, group: "事前工数", code: "P2", owner: "両", deps: [], nobuffer: true, asis: 7.2, tobe: 7.2, status: "予定", progress: 0, actual: 0, desc: "人員2：スプリント2初日の事前工数。プランニング（タスク分解・段取り・論点整理）＋AI環境整備（エージェント／worktree 等の準備）。" },
    // ───────── ① 認証・認可：仕様精査 ─────────
    { name: "仕様精査(認可)～チケット合意",   base: "auth", person: 1, group: "仕様精査",   code: "SP",  owner: "両", deps: [], nobuffer: true, asis: 28.8, tobe: 28.8, status: "予定", progress: 0, actual: 0, desc: "認証・認可の要件・SEED権限データ・16bitモデルの精査と実装前の論点整理（scope複合・粒度・Cognito連携時期など）＋作業チケットのスコープ合意まで。" },
    // ───────── ① 認証・認可：基盤 ─────────
    { name: "Cognito整備",      base: "auth", person: 1, group: "基盤",       code: "A0",  owner: "BE", deps: [],                    asis: 5,  tobe: 3.0, status: "予定", progress: 0, actual: 0, desc: "Cognito ユーザープール／アプリクライアント／グループ（ロール）設定・トークンクレーム設計。AWS側整備でAI駆動範囲外の手作業を含む。JWT署名検証の前提。" },
    { name: "JWT実装",          base: "auth", person: 1, group: "基盤",       code: "A",   owner: "BE", deps: ["Cognito整備"],       asis: 8,  tobe: 3.0, status: "予定", progress: 0, actual: 0, desc: "JwtAuthGuard 本実装（Cognito署名検証・実ユーザー注入、dev-bypass温存）。最優先。" },
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
    { name: "API適用:master(個人情報系)", base: "auth", person: 1, group: "適用", code: "IA1a", owner: "BE", deps: ["Guard・デコレータ", "権限配布API"], asis: 15, tobe: 3.0, status: "予定", progress: 0, actual: 0, desc: "master 実適用の先頭。個人情報系resolverに@RequirePermission＋scopeを先行付与（≒23res/105opsのうち高リスク優先）。" },
    { name: "API適用:master(残り)", base: "auth", person: 1, group: "適用",     code: "IA1b", owner: "BE", deps: ["API適用:master(個人情報系)"], asis: 15, tobe: 3.0, status: "予定", progress: 0, actual: 0, desc: "master 残りresolver/opsへ横展開＋RF15。前半と同型で@RequirePermission＋scopeを付与。" },
    { name: "API適用:tms",      base: "auth", person: 1, group: "適用",       code: "IA2", owner: "BE", deps: ["Guard・デコレータ", "権限配布API"], asis: 24, tobe: 5.0, status: "予定", progress: 0, actual: 0, desc: "tms 8res/54ops＋RF15。自デポ/自荷主 scopeのwhere適用が主戦場。" },
    { name: "API適用:driver",   base: "auth", person: 1, group: "適用",       code: "IA3", owner: "BE", deps: ["Guard・デコレータ", "権限配布API"], asis: 10, tobe: 2.5, status: "予定", progress: 0, actual: 0, desc: "driver 1res/30ops。別紙02のactor制約と認可の責務分担を整理して付与。" },
    { name: "画面適用:admin共通", base: "auth", person: 1, group: "適用",      code: "IF1", owner: "FE", deps: ["権限ゲート(FE)", "URLガード"], asis: 8, tobe: 2.5, status: "予定", progress: 0, actual: 0, desc: "main-menu 約20リーフをcan()フィルタ＋RootLayout/isGuardedRoute配線（21ルート）。" },
    { name: "画面適用:admin各画面(前半)", base: "auth", person: 1, group: "適用", code: "IF2a", owner: "FE", deps: ["画面適用:admin共通"], asis: 14, tobe: 3.0, status: "予定", progress: 0, actual: 0, desc: "admin 21ルート前半にURL＋要素ガード。主要/個人情報系ルートのSCREEN操作キー付けを先行。" },
    { name: "画面適用:admin各画面(後半)", base: "auth", person: 1, group: "適用", code: "IF2b", owner: "FE", deps: ["画面適用:admin各画面(前半)"], asis: 14, tobe: 3.0, status: "予定", progress: 0, actual: 0, desc: "admin 残りルートにURL＋要素ガード。SCREEN操作102の残りキー付け。" },
    { name: "画面適用:driver",   base: "auth", person: 1, group: "適用",       code: "IF3", owner: "FE", deps: ["driverガード"],     asis: 16, tobe: 3.5, status: "予定", progress: 0, actual: 0, desc: "app-driver 22ルートにURL＋要素ガード。KSL/配送員のロール差を反映。" },

    // ───────── ② 外部連携（SMS/IVRシステム連携）─────────
    // 出典: .work/基盤設計_03_外部連携.md。SMS/IVRは機能軸で抽象化しドライバー化（リアル層は繋がずモックドライバーで代替）。※ファイルインポートは別基盤として切り出し。
    { name: "仕様精査(連携)",   base: "export", person: 2, group: "仕様精査", code: "SP",  owner: "両", deps: [], nobuffer: true, asis: 10.8, tobe: 7.2, status: "予定", progress: 0, actual: 0, desc: "SMS/IVR連携の精査と実装前の論点整理（連携I/F粒度・ドライバー化方針・再送/冪等）。" },
    // ── SMS/IVR連携：機能軸で抽象化＋ドライバー化（リアル層は繋がず、モックドライバーで代替。駆動UC＝再配達受付の希望日時取得）──
    { name: "連携I/F定義",      base: "export", person: 2, group: "連携",       code: "L1",  owner: "BE", deps: [],                    asis: 4,  tobe: 2.0, status: "予定", progress: 0, actual: 0, desc: "使いたい機能を機能軸のサービスI/Fに契約化（再配達受付＝顧客/荷物/希望日時/チャネル）。実ベンダーアクセスはドライバーに閉じる。" },
    { name: "連携モックドライバー", base: "export", person: 2, group: "連携",    code: "L2",  owner: "BE", deps: ["連携I/F定義"],        asis: 6,  tobe: 2.5, status: "予定", progress: 0, actual: 0, desc: "リアル層の代替。fixtureで受付データ・希望日時を返すモックドライバー（成功/失敗/遅延切替）。ベンダー確定後は実ドライバーに差替え。" },
    { name: "連携サービス・API", base: "export", person: 2, group: "連携",      code: "L3",  owner: "BE", deps: ["連携I/F定義", "連携モックドライバー"], asis: 8, tobe: 3.0, status: "予定", progress: 0, actual: 0, desc: "クライアントを束ねるバックエンドサービス＋GraphQL query/mutationで取得・取込を公開。" },
    { name: "再配達日時反映",   base: "export", person: 2, group: "連携",       code: "L4",  owner: "BE", deps: ["連携サービス・API"], asis: 5, tobe: 2.0, status: "予定", progress: 0, actual: 0, desc: "取得した再配達希望日時を配送へ反映。既存の更新経路を再利用（重複回避）。" },
    { name: "連携E2E",          base: "export", person: 2, group: "連携",       code: "L5",  owner: "両", deps: ["再配達日時反映", "連携モックドライバー"], asis: 4, tobe: 1.5, status: "予定", progress: 0, actual: 0, desc: "モックドライバー相手に『取得→反映』を1本通すE2E。失敗時の扱いも確認。" },

    // ───────── ③ ファイル連携（各基幹システムと双方向のファイル連携。前提: S3＋Transfer Family の SFTP）─────────
    // 出荷指示取込（S3→検証/マッピング→DB→配送指示書作成）と 出荷実績送信（DB→実績ファイル生成→S3配置）。いずれも特定時刻にバッチ起動。取込/生成は「定義型」基盤で対称に。
    { name: "仕様精査(ファイル連携)", base: "file", person: 2, group: "仕様精査", code: "SP", owner: "両", deps: [], nobuffer: true, asis: 10.8, tobe: 7.2, status: "予定", progress: 0, actual: 0, desc: "出荷指示取込・出荷実績送信の精査と論点整理（ファイル定義・バリデーション正本・文字コード・部分失敗ポリシー・冪等・スケジュール起動・SFTP/S3授受の前提）。" },
    { name: "S3/SFTP基盤",     base: "file", person: 2, group: "基盤", code: "F0", owner: "BE", deps: [],                                     asis: 5, tobe: 3.0, status: "予定", progress: 0, actual: 0, desc: "S3バケット＋Transfer Family による SFTP アクセス整備（各基幹システム担当者がファイル送受信）。AWS側整備でAI駆動範囲外の手作業を含む。" },
    { name: "ファイル授受基盤", base: "file", person: 2, group: "基盤", code: "F1", owner: "BE", deps: ["S3/SFTP基盤"],                        asis: 6, tobe: 2.5, status: "予定", progress: 0, actual: 0, desc: "S3 get/put＋退避・リネームのファイル授受アダプタ。取込ファイル取得／実績ファイル配置の共通経路。" },
    { name: "ファイル定義基盤", base: "file", person: 2, group: "基盤", code: "F2", owner: "BE", deps: [],                                     asis: 9, tobe: 3.5, status: "予定", progress: 0, actual: 0, desc: "取込/生成の「定義型」基盤（列マッピング・型・バリデーション）。既存エクスポート定義基盤と対称。定義1個＝1帳票。" },
    { name: "バッチ起動基盤",   base: "file", person: 2, group: "基盤", code: "F3", owner: "BE", deps: [],                                     asis: 5, tobe: 2.0, status: "予定", progress: 0, actual: 0, desc: "特定時刻キックのスケジューラ＋ジョブ実行枠＋t_batch_logs記録。取込/送信の両処理を起動。" },
    { name: "出荷指示取込",     base: "file", person: 2, group: "取込", code: "F4", owner: "BE", deps: ["ファイル授受基盤", "ファイル定義基盤", "バッチ起動基盤"], asis: 8, tobe: 3.0, status: "予定", progress: 0, actual: 0, desc: "起動→S3から取込ファイル取得→バリデーション＋マッピング→PW-DMS DB登録（$transaction・部分失敗ポリシー・冪等upsert・取込ログ）。" },
    { name: "配送指示書作成連携", base: "file", person: 2, group: "取込", code: "F5", owner: "BE", deps: ["出荷指示取込"],                       asis: 4, tobe: 1.5, status: "予定", progress: 0, actual: 0, desc: "取込完了後に配送指示書の作成処理をキック（既存処理の呼出配線）。" },
    { name: "出荷実績生成",     base: "file", person: 2, group: "送信", code: "F6", owner: "BE", deps: ["ファイル定義基盤", "バッチ起動基盤"],   asis: 6, tobe: 2.5, status: "予定", progress: 0, actual: 0, desc: "起動→PW-DMS DBから対象データ取得→定義で出荷実績ファイルを生成。" },
    { name: "実績ファイル配置", base: "file", person: 2, group: "送信", code: "F7", owner: "BE", deps: ["出荷実績生成", "ファイル授受基盤"],     asis: 3, tobe: 1.5, status: "予定", progress: 0, actual: 0, desc: "生成した出荷実績ファイルをS3へ配置（担当者がSFTPで受領）。" },
    { name: "連携E2E(ファイル)", base: "file", person: 2, group: "E2E", code: "F8", owner: "両", deps: ["配送指示書作成連携", "実績ファイル配置"], asis: 4, tobe: 1.5, status: "予定", progress: 0, actual: 0, desc: "SFTPでファイル配置→取込→指示書作成／実績生成→S3配置 を1本通すE2E（成功・部分失敗・冪等再取込）。" },

    // ───────── ④ 帳票出力（PDF帳票＝配送指示書の生成基盤。非同期生成＋生成状況テーブル＋S3成果物）─────────
    // 画面出力: 生成リクエスト→生成状況テーブルに「生成中」追加→非同期生成→S3アップロード＋状況更新(完了/エラー)。クライアントはポーリングで状況確認し、完了はURLからDL・エラーは画面表示。
    // 取込出力: 出荷指示取込後、デポごとに生成→各デポ非同期→S3アップロード＋状況更新＋帳票作成通知テーブル更新。
    { name: "仕様精査(帳票)",   base: "report", person: 2, group: "仕様精査", code: "SP", owner: "両", deps: [], nobuffer: true, asis: 10.8, tobe: 7.2, status: "予定", progress: 0, actual: 0, desc: "画面出力／取込出力の精査と論点整理（非同期生成方式・生成状況テーブル・S3成果物・ポーリング/通知テーブル・エラー扱い・デポ別並列）。" },
    { name: "状況/通知テーブル", base: "report", person: 2, group: "基盤", code: "R0", owner: "DB", deps: [],                                    asis: 4,  tobe: 2.0, status: "予定", progress: 0, actual: 0, desc: "生成状況テーブル（生成中/完了/エラー＋成果物URL）と帳票作成通知テーブルのスキーマ／seed。" },
    { name: "帳票生成エンジン", base: "report", person: 2, group: "基盤", code: "R1", owner: "BE", deps: [],                                    asis: 10, tobe: 4.0, status: "予定", progress: 0, actual: 0, desc: "PDF帳票（配送指示書）生成コア。テンプレート→データ差込→PDF化。" },
    { name: "非同期ジョブ基盤", base: "report", person: 2, group: "基盤", code: "R2", owner: "BE", deps: ["帳票生成エンジン", "状況/通知テーブル"], asis: 8, tobe: 3.5, status: "予定", progress: 0, actual: 0, desc: "非同期生成ジョブの実行枠＋生成状況更新（生成中→完了/エラー）＋S3への成果物アップロード。" },
    { name: "生成/状況API",     base: "report", person: 2, group: "基盤", code: "R3", owner: "BE", deps: ["非同期ジョブ基盤"],                   asis: 6,  tobe: 3.0, status: "予定", progress: 0, actual: 0, desc: "生成リクエスト受付mutation＋状況確認query（ポーリング用・完了時はダウンロードURLを返却）。" },
    { name: "画面出力連携(FE)", base: "report", person: 2, group: "適用", code: "R4", owner: "FE", deps: ["生成/状況API"],                     asis: 6,  tobe: 2.5, status: "予定", progress: 0, actual: 0, desc: "画面から生成リクエスト→定期ポーリングで状況確認→完了はURLからDL・エラーは画面表示（DLなし）。" },
    { name: "デポ別一括生成",   base: "report", person: 2, group: "適用", code: "R5", owner: "BE", deps: ["非同期ジョブ基盤", "出荷指示取込"],   asis: 8,  tobe: 3.5, status: "予定", progress: 0, actual: 0, desc: "出荷指示取込後、デポごとに生成開始→各デポ非同期生成→S3アップロード→生成状況更新→帳票作成通知テーブル更新。" },
    { name: "帳票E2E",          base: "report", person: 2, group: "E2E", code: "R6", owner: "両", deps: ["画面出力連携(FE)", "デポ別一括生成"],   asis: 4,  tobe: 1.5, status: "予定", progress: 0, actual: 0, desc: "画面出力（生成→ポーリング→DL）とデポ別一括生成（取込→デポ別→通知）をそれぞれ1本通すE2E。" },
    // ───────── 予備工数（各人員の残キャパを 7/31 まで確保。nobuffer＝素の時間）─────────
    { name: "予備工数1",        base: "reserve", person: 1, group: "予備工数", code: "R1",  owner: "両", deps: [], nobuffer: true, asis: 9.6, tobe: 9.6, status: "予定", progress: 0, actual: 0, desc: "人員1（①認証認可）の残キャパ。手戻り・追加調査・レビュー対応・仕様確認の往復などの予備枠（7/31 まで）。" },
    { name: "予備工数2",        base: "reserve", person: 2, group: "予備工数", code: "R2",  owner: "両", deps: [], nobuffer: true, asis: 6.4, tobe: 6.4, status: "予定", progress: 0, actual: 0, desc: "人員2（②外部連携／③ファイル連携／④帳票出力）の残キャパ。手戻り・追加調査・レビュー対応・仕様確認の往復などの予備枠（7/31 まで）。" },
  ],
};

if (typeof module !== "undefined" && module.exports) module.exports = { SPRINT2_DATA };
