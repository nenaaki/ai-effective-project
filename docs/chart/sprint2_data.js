// スプリント2（2026-07-14〜）タスクデータ ── workitems2.html / aidd_report2.html 共通ソース
// 算出根拠・改定履歴は .work/sprint2_actuals.md
//
// name=一意の短い和名 / base=基盤キー / group=区分 / code=設計書のタスクID / owner=BE|FE|DB|両
// person=担当者番号（レーン割当）/ deps=依存タスク名 / desc=概要1行
// asis=人力想定h（実装系は plan×5.45）/ plan=計画h（PV・EV）/ tobe=実績h（AC）/ status・progress=進捗
// tobe の物差し: 〜2026-08-19 は「band人稼働」。2026-08-20 以降は「band AI稼働（空白20分連結）」＋実績申告。
//   セッションログはサブエージェント実行が残らず、20分超の空白で帯ごと落ちるため実態より小さく出る（実績申告で補う）。
//   2026-08-27 以降は帯をセッション単位で作る方式へ変更（並行作業を1項目に潰さない）。値は作業項目別の union AI稼働。
// 配列順＝ガントのレーン着手順。deps は配列内で必ず前方を指すこと。
//
// テスト設計・実施 = 実装系plan×0.168 ／ PR・レビュー対応 = ×0.102
//   分母は「テスト/PRがまだ済んでいない実装系plan」。実装完了で減らすとテスト枠が消えるので不可。
const SPRINT2_DATA = {
  meta: { sprint: 2, start: "2026-07-14", hoursPerDay: 7.2 },
  holidays: ["2026-07-20", "2026-08-11", "2026-09-21", "2026-09-23"],
  // 記録日→その時点の累積 EV/AC（h）。週1回くらい追記する。
  evmSnapshots: {
    "2026-07-21": { "ev": 43.2, "ac": 42.9 },
    "2026-07-29": { "ev": 136.9, "ac": 126.5 },
    "2026-08-05": { "ev": 215.2, "ac": 188.9 },
    "2026-08-12": { "ev": 255.0, "ac": 224.1 },
    "2026-08-19": { "ev": 300.4, "ac": 282.0 },
    "2026-08-25": { "ev": 323.3, "ac": 311.6 },
    "2026-08-31": { "ev": 334.3, "ac": 322.6 },
    "2026-09-02": { "ev": 334.3, "ac": 324.9 }
  },
  // 予定休（人員別）。終日休はその人員の営業日から除外し、当該人員のタスクを後ろ倒しする。
  //   終日休 = "2026-08-12" ／ 半休 = "2026-08-12:0.5"（末尾の数値＝休む割合。0.25 等も可）。
  //   半休は営業日のまま扱い、その日の稼働を 0.5 人日として EVM の PV（計画キャパシティ）に反映する。
  leaves: {
    "1": ["2026-07-16", "2026-08-12", "2026-08-14:0.5", "2026-08-19:0.5", "2026-08-20", "2026-08-21", "2026-08-22", "2026-08-23", "2026-08-24", "2026-08-25", "2026-08-26"],
    "2": ["2026-08-10", "2026-08-12", "2026-08-13", "2026-08-14", "2026-08-17:0.5"],
  },
  bases: [
    { key: "prep",   id: "事", name: "事前工数",              color: "#0d9488" },
    { key: "auth",   id: "①", name: "認証・認可",              color: "#2563eb" },
    { key: "export", id: "②", name: "外部連携(SMS)", color: "#7c3aed" },
    { key: "file",   id: "③", name: "ファイル連携(取込/送信)", color: "#0891b2" },
    { key: "report", id: "④", name: "帳票出力(PDF生成)",       color: "#d97706" },
    { key: "ivr",    id: "⑤", name: "IVR連携",                 color: "#c026d3" },
    { key: "other",  id: "他", name: "その他工数",              color: "#94a3b8" },
    { key: "reserve", id: "予", name: "予備工数",              color: "#64748b" },
  ],
  tasks: [
    // ───────── 事前工数 ─────────
    { name: "プランニング①・AI整備", base: "prep", person: 1, group: "事前工数", code: "P1", owner: "両", deps: [], asis: 7.2, plan: 7.2, tobe: 7.2, status: "完了", progress: 1, desc: "人員1：イテレーション2初日の事前工数。プランニング（タスク分解・段取り・論点整理）＋AI環境整備（エージェント／worktree 等の準備）。" },
    { name: "プランニング②・AI整備", base: "prep", person: 2, group: "事前工数", code: "P2", owner: "両", deps: [], asis: 7.2, plan: 7.2, tobe: 7.2, status: "完了", progress: 1, desc: "人員2：イテレーション2初日の事前工数。プランニング（タスク分解・段取り・論点整理）＋AI環境整備（エージェント／worktree 等の準備）。" },
    { name: "方法論・管理の事前整備", base: "prep", person: 2, group: "事前工数", code: "P3", owner: "両", deps: [], asis: 5.0, plan: 5.0, tobe: 5.0, status: "完了", progress: 1, desc: "人員2：イテレーション2の事前整備（方法論・管理）。ミッションたたき台作成／レビュープロセス検討（壁打ち・資料化）／2%修正課題の整理。" },
    { name: "AIインプット整備(正本/設計集約)", base: "prep", person: 2, group: "事前工数", code: "P4", owner: "両", deps: [], asis: 3.0, plan: 3.0, tobe: 3.0, status: "完了", progress: 1, desc: "人員2：イテレーション2着手の前段階。古くなっていたAI向けインプット資料を整備（正本データ抽出・SMS/帳票向け設計情報の集約）。仕様の不明点解消の精度を上げるための調整。予備工数2から3.0hを項目化。" },
    // ───────── ① 認証・認可 ─────────
    { name: "仕様精査(認可)①要件・SEED権限精査", base: "auth", person: 1, group: "仕様精査", code: "SP1", owner: "両", deps: [], asis: 5.35, plan: 5.35, tobe: 5.35, status: "完了", progress: 1, desc: "認証・認可の要件・SEED権限データ・16bitモデルの精査（上流）。Cognito/JWT 着手の前提。PW-229 の上流実測10.7h（07/23 要件合意3.5h＋07/24-25 権限モデル整理・spec準備7.2h）を実装ブロックの前に2等分して配置した前半分。" },
    { name: "Cognito整備",      base: "auth", person: 1, group: "基盤",       code: "A0",  owner: "BE", deps: [],                    asis: 20.7, plan: 4.2, tobe: 4, status: "完了", progress: 1, desc: "Cognito ユーザープール／アプリクライアント／グループ（ロール）設定・トークンクレーム設計。AWS側整備でAI駆動範囲外の手作業を含む。JWT署名検証の前提。" },
    { name: "JWT実装",          base: "auth", person: 1, group: "基盤",       code: "A",   owner: "BE", deps: ["Cognito整備"],       asis: 25.0, plan: 4.2, tobe: 4, status: "完了", progress: 1, desc: "JwtAuthGuard 本実装（Cognito署名検証・実ユーザー注入、dev-bypass温存）。最優先。" },
    { name: "ロールSEED",       base: "auth", person: 1, group: "テスト基盤", code: "IT1", owner: "DB", deps: ["JWT実装"], asis: 15.3, plan: 2.8, tobe: 1, status: "完了", progress: 1, desc: "17ロール代表デモユーザー＋scope差（デポ/荷主違い）。ロールピッカーの選択肢。計画2.8hに対し実績1.0h。認可の実装より先に整備したため、テスト基盤ブロックから前出しして JWT実装 の直後に配置。" },
    { name: "テスト設計・実施(認可1)", base: "auth", person: 1, group: "テスト", code: "QA1", owner: "両", deps: ["認可テスト基盤"], asis: 20.0, plan: 6.0, tobe: 6.0, status: "完了", progress: 1, desc: "AIが実施したテスト" },
    // URL判定(U1-U4)＝PW-229。旧設計の7行（権限配布API/URLガード/driverガード/判定コア/Guard・デコレータ/権限ゲート(FE)/レガシー整理）を置換・内包して完了。
    { name: "仕様精査(認可)②権限モデル整理～PM合意", base: "auth", person: 1, group: "仕様精査", code: "SP2", owner: "両", deps: ["仕様精査(認可)①要件・SEED権限精査"], asis: 5.35, plan: 5.35, tobe: 5.35, status: "完了", progress: 1, desc: "権限マトリクス精査・URL↔権限対象 対応表の作成・driver側の権限モデル決定・spec作成＋作業チケットのスコープ合意（PM承認）。URL判定ブロック(U1-U4)の実装直前。PW-229 の上流実測10.7hの後半分。" },
    { name: "認可ビット基盤(authz-bits)", base: "auth", person: 1, group: "URL判定", code: "U1", owner: "BE", deps: ["JWT実装", "仕様精査(認可)②権限モデル整理～PM合意"], asis: 18.5, plan: 3.4, tobe: 0.4, status: "完了", progress: 1, desc: "16bit のパック/アンパック共有実装（libs/shared-utils/src/authz-bits.ts・35行）。DBは既存 m_role_targets / m_role_group_targets を流用しスキーマ変更ゼロ。" },
    { name: "URL↔権限対象 対応表・権限カタログ", base: "auth", person: 1, group: "URL判定", code: "U2", owner: "BE", deps: ["認可ビット基盤(authz-bits)"], asis: 27.3, plan: 5.0, tobe: 2.0, status: "完了", progress: 1, desc: "authzRegistry（model/resolver/service）＋permission-catalog＋role-target-registry.helper。URLと権限対象の対応表をクライアントへ配布。API 157行。07/28に直値を権限カタログ化・不要URL削除・対応表を索引化。旧「権限配布API(D)」の代替であり、旧「レガシー整理(H)」（permissionGroupId依存の排除・roleGroupId一本化）も内包して完了。" },
    { name: "Edge middlewareアクセス判定(admin)", base: "auth", person: 1, group: "URL判定", code: "U3", owner: "FE", deps: ["URL↔権限対象 対応表・権限カタログ"], asis: 32.7, plan: 6.0, tobe: 3.0, status: "完了", progress: 1, desc: "middleware / route-table / access-decision / id-token / registry-client / authz-url-guard / authz-messages。「禁止されていなければアクセス可」をサーバー側(Edge)で判定する共通基盤＋admin適用。FE 1,704行＋UT 1,341行の主体。07/23はクライアント側判定で実装したが破棄し再設計（捨て工数3.5h）。旧「URLガード(F)」の代替であり、旧「判定コア(B)」「Guard・デコレータ(C)」「権限ゲート(FE)(E)」も内包して完了（URL単位判定に集約したため個別の判定コア／デコレータ／要素ゲートは不要になった）。" },
    { name: "driverアクセス判定", base: "auth", person: 1, group: "URL判定", code: "U4", owner: "FE", deps: ["Edge middlewareアクセス判定(admin)"], asis: 4.4, plan: 0.8, tobe: 0.8, status: "完了", progress: 1, desc: "app-driver のURL単位アクセス判定。login-gate による未認証リダイレクト、/ → /home リダイレクト、route-table への driver ルート登録。共通middleware(U3)を再利用するため driver 固有分は小さい。旧「driverガード(G)」の代替。" },
    // ───────── その他工数（変更管理で割り込んだ作業・人員1・PW-229と並行）─────────
    { name: "マスタ整理(水源/出荷元廃止→指示書記号)", base: "other", person: 1, group: "その他工数", code: "O1", owner: "両", deps: [], asis: 28.8, plan: 13.7, tobe: 13.66, status: "完了", progress: 1, desc: "変更管理対象の仕様変更（水源マスタ・出荷元マスタ廃止→指示書記号）。計画外の割り込み。追加392行／削除2,464行で削除が主体。仕様が3周変わり13.66hのうち3.25h(24%)が捨て工数、成果物に残ったのは実質6.3h。工程別ではテスト実施が5.79h(42.4%)で最大。asisは削除重み0.25で換算1,008行÷35行/h=28.8h。" },
    { name: "デバッグエージェント実装", base: "other", person: 1, group: "その他工数", code: "O1", owner: "両", deps: [], asis: 12.0, plan: 12.0, tobe: 12.0, status: "完了", progress: 1, desc: "変更管理対象の仕様変更（水源マスタ・出荷元マスタ廃止→指示書記号）。計画外の割り込み。追加392行／削除2,464行で削除が主体。仕様が3周変わり13.66hのうち3.25h(24%)が捨て工数、成果物に残ったのは実質6.3h。工程別ではテスト実施が5.79h(42.4%)で最大。asisは削除重み0.25で換算1,008行÷35行/h=28.8h。" },
    { name: "設計エージェント実装", base: "other", person: 1, group: "その他工数", code: "O1", owner: "両", deps: [], asis: 12.0, plan: 12.0, tobe: 16.0, status: "完了", progress: 1, desc: "" },
    // 仕様精査(認可)は当初1本(plan 28.8h)を SP1/SP2（上流実測10.7hを2等分）・SP3（画面適用）・SP4（API適用）の4本に分解。合計 plan/asis 28.8h は元と一致。
    { name: "仕様精査(画面適用)",   base: "auth", person: 1, group: "仕様精査",   code: "SP3",  owner: "両", deps: ["仕様精査(認可)②権限モデル整理～PM合意"], asis: 3.0, plan: 3.0, tobe: 3.0, status: "完了", progress: 1, desc: "画面適用（admin 21ルート＋driver 22ルート）に向けた仕様精査。要素ガードの粒度・SCREEN操作キーの割り当て・メニュー出し分けの範囲・KSL/配送員のロール差の確定。計画3.0hで完了。" },
    { name: "画面適用:admin共通", base: "auth", person: 1, group: "適用",      code: "IF1", owner: "FE", deps: ["Edge middlewareアクセス判定(admin)", "仕様精査(画面適用)"], asis: 19.1, plan: 3.5, tobe: 3.5, status: "完了", progress: 1, desc: "main-menu 約20リーフをcan()フィルタ＋RootLayout配線（21ルート）。URL単位の可否はU3で完了しているのでメニュー出し分けが主。計画どおり3.5hで完了。" },
    { name: "画面適用:admin各画面(前半)", base: "auth", person: 1, group: "適用", code: "IF2a", owner: "FE", deps: ["画面適用:admin共通"], asis: 22.9, plan: 4.2, tobe: 4.2, status: "完了", progress: 1, desc: "admin 21ルート前半に要素ガード。主要/個人情報系ルートのSCREEN操作キー付けを先行。計画どおり4.2hで完了。" },
    { name: "画面適用:admin各画面(後半)", base: "auth", person: 1, group: "適用", code: "IF2b", owner: "FE", deps: ["画面適用:admin各画面(前半)"], asis: 22.9, plan: 4.2, tobe: 4.2, status: "完了", progress: 1, desc: "admin 残りルートに要素ガード。SCREEN操作102の残りキー付け。計画どおり4.2hで完了。" },
    { name: "画面適用:driver",   base: "auth", person: 1, group: "適用",       code: "IF3", owner: "FE", deps: ["driverアクセス判定"], asis: 26.7, plan: 4.9, tobe: 5.0, status: "完了", progress: 1, desc: "app-driver 22ルートの要素ガード（KSL配送員/配送員のロール差を反映）。URL単位判定はU4で完了。PW-253（PR#170・08/04マージ・26ファイル+1093/−508）で実施し、計画4.9hに対し実績5.0h（08/03 1.1h＋08/04 3.9h、5分キャップの代表値・レンジ3.4〜6.0h。08/05のレビュー0.1hは除外）。工程配分は合意形成21%・調査/実装24%・テスト実施/成果物作成53%でテストが半分超（33項目の実ブラウザ検証・管理画面29URL×16役割の突合・権限945件のmain突合）。権限データ由来で配信内容が変わる設計のためスキーマ変更とAPI側のコード変更はゼロ、画面のJSXも9行のみで、追加1093行の主体は権限データ変換222行・FE201行・ユニットテスト346行・権限表/役割定義168行。エージェント委譲はpm 1起動6.2分のみで対話本体で完遂。" },
    { name: "ロール切替",       base: "auth", person: 1, group: "テスト基盤", code: "IT2", owner: "BE", deps: ["JWT実装", "Edge middlewareアクセス判定(admin)"], asis: 19.1, plan: 3.5, tobe: 3.5, status: "完了", progress: 1, desc: "dev-bypassにprincipal載せGuardが実注入。本番はサーバ側で厳格無効化。計画どおり3.5hで完了。" },
    { name: "ロールピッカー",   base: "auth", person: 1, group: "テスト基盤", code: "IT3", owner: "FE", deps: ["URL↔権限対象 対応表・権限カタログ", "ロール切替"], asis: 15.3, plan: 2.8, tobe: 2.8, status: "完了", progress: 1, desc: "開発ツールバーのロール選択→入り直し→permission再取得→再ゲート。計画どおり2.8hで完了。" },
    { name: "認可テスト基盤",   base: "auth", person: 1, group: "テスト基盤", code: "IT4", owner: "BE", deps: ["URL↔権限対象 対応表・権限カタログ", "ロールSEED"], asis: 30.5, plan: 5.6, tobe: 5.6, status: "完了", progress: 1, desc: "actingAs()／Playwrightロール注入／SEED由来ゴールデン権限マトリクス突合。計画どおり5.6hで完了。" },
    { name: "テスト設計・実施(認可2)", base: "auth", person: 1, group: "テスト", code: "QA1", owner: "両", deps: ["認可テスト基盤"], asis: 20.0, plan: 5.0, tobe: 5.0, status: "完了", progress: 1, desc: "AIが実施したテスト" },
    { name: "仕様精査(API適用)",   base: "auth", person: 1, group: "仕様精査",   code: "SP4",  owner: "両", deps: ["仕様精査(画面適用)"], asis: 15.1, plan: 15.1, tobe: 15.1, status: "完了", progress: 1, desc: "API適用（master 23res/105ops・tms 8res/54ops・driver 1res/30ops）に向けた仕様精査。計画どおり15.1hで完了。scope複合の扱い・自デポ/自荷主のwhere適用範囲・actor制約と認可の責務分担・Cognito連携時期などの残論点とチケット合意。PW-229では上流が全体の64%を占めており、適用フェーズでも上流が効く見込み。" },
    { name: "API適用:master(個人情報系)", base: "auth", person: 1, group: "適用", code: "IA1a", owner: "BE", deps: ["URL↔権限対象 対応表・権限カタログ", "仕様精査(API適用)"], asis: 22.9, plan: 4.2, tobe: 4.2, status: "完了", progress: 1, desc: "master 実適用の先頭。個人情報系resolverに@RequirePermission＋scopeを先行付与（≒23res/105opsのうち高リスク優先）。計画どおり4.2hで完了。※テスト実施係数の実測ポイント（.work/sprint2_actuals.md §7）。" },
    { name: "API適用:master(残り)", base: "auth", person: 1, group: "適用",     code: "IA1b", owner: "BE", deps: ["API適用:master(個人情報系)"], asis: 22.9, plan: 4.2, tobe: 4.2, status: "完了", progress: 1, desc: "master 残りresolver/opsへ横展開＋RF15。前半と同型で@RequirePermission＋scopeを付与。計画どおり4.2hで完了。" },
    { name: "API適用:tms",      base: "auth", person: 1, group: "適用",       code: "IA2", owner: "BE", deps: ["URL↔権限対象 対応表・権限カタログ"], asis: 38.2, plan: 7.0, tobe: 7.0, status: "完了", progress: 1, desc: "tms 8res/54ops＋RF15。自デポ/自荷主 scopeのwhere適用が主戦場。計画どおり7.0hで完了。" },
    { name: "API適用:driver",   base: "auth", person: 1, group: "適用",       code: "IA3", owner: "BE", deps: ["URL↔権限対象 対応表・権限カタログ"], asis: 19.1, plan: 3.5, tobe: 3.5, status: "完了", progress: 1, desc: "driver 1res/30ops。別紙02のactor制約と認可の責務分担を整理して付与。計画どおり3.5hで完了。" },
    { name: "テスト設計・実施(認可)", base: "auth", person: 1, group: "テスト", code: "QA1", owner: "両", deps: ["認可テスト基盤"], asis: 20.0, plan: 11.0, tobe: 11.0, status: "完了", progress: 1, desc: "計画11.0hどおり11.0hで完了。①のうち【テスト/PR未実施】の実装系47.6h（画面適用admin完了分11.9＋画面適用driver4.9＋テスト基盤11.9＋API適用18.9）に対するテスト仕様設計＋テスト実施＋デグレチェック範囲確認。暫定係数0.168＝PW-229実測（下流残差1.3h÷実装4.9h）。⚠️既存への横展開が主体だったPW-236の実測は1.88で約10倍高い。適用8タスク着手後に実測へ差替が必要。" },
    { name: "PR・レビュー対応(認可)", base: "auth", person: 1, group: "PR", code: "PR1", owner: "両", deps: [], asis: 26.7, plan: 4.9, tobe: 4.9, status: "完了", progress: 1, desc: "①のうち【テスト/PR未実施】の実装系47.6hに対するPR本文作成＋レビュー指摘対応。計画4.9hどおり4.9hで完了。暫定係数0.102＝PW-229実測（pr-writer 5.7分＋reviewer 24.9分）。" },

    // ───────── ③ ファイル連携（S3＋Transfer Family の SFTP 前提。人員2はこの③から着手＝③→②→④）─────────
    { name: "仕様精査(ファイル連携)～PM合意", base: "file", person: 2, group: "仕様精査", code: "SP", owner: "両", deps: [], asis: 10.8, plan: 7.2, tobe: 4.51, status: "完了", progress: 1, desc: "出荷指示取込・出荷実績送信の精査と論点整理（ファイル定義・バリデーション正本・文字コード・部分失敗ポリシー・冪等・スケジュール起動・SFTP/S3授受の前提）。ファイル連携チケット修正〜PR〜PM案内（PM承認）を含む。／住所分割の調査対応2.0hを加算（実績申告。8/24のセッションログ由来は0.78h。対象期間の実稼働が4日間だったため当初申告3.0hから調整）。" },
    { name: "仕様精査(SMS連携)～PM合意", base:"export", person:2, group:"仕様精査", code:"SP", owner:"両", deps:[], asis:10.8, plan:14.4, tobe:4.18, status:"完了", progress:1, desc:"SMS連携の精査と論点整理（機能I/F粒度・ドライバー化方針・再送/冪等・文面テンプレ・接続情報/環境変数の未確定欄）。SMS設計情報確認・親チケット起票（PM承認）着手を含む。実装より仕様精査に時間を投下し今日まで継続中（高品質インプットで実装を圧縮）。IVRは後発（要件FIX後・今回スコープ外）。／送信文言の文字数（短縮URL・70文字制約）の調査対応2.0hを加算（実績申告。対象期間の実稼働が4日間だったため当初申告3.0hから調整）。" },
    { name: "仕様精査(帳票)～PM合意",   base: "report", person: 2, group: "仕様精査", code: "SP", owner: "両", deps: [], asis: 10.8, plan: 7.2, tobe: 2.82, status: "完了", progress: 1, desc: "画面出力／取込出力の精査と論点整理（非同期生成方式・生成状況テーブル・S3成果物・ポーリング/通知テーブル・エラー扱い・デポ別並列）。帳票設計情報確認・親チケット起票（PM承認）着手を含む。RP021/RP022は含否がG1論点＝今回除外・次イテレーション。" },
    { name: "S3/SFTP基盤",     base: "file", person: 2, group: "基盤", code: "F0", owner: "BE", deps: [],                                     asis: 22.9, plan: 4.2, tobe: 9.86, status: "完了", progress: 1, desc: "S3バケット＋Transfer Family による SFTP アクセス整備（各基幹システム担当者がファイル送受信）。AWS側整備でAI駆動範囲外の手作業を含む。／PW-210-2（AWS環境・IaC現状把握0.78h＋方式決定と実装・dev反映/復旧・DBマイグレーション・PR更新 稼働4.46h＝8/18-19実測）計5.24hを計上。経過時間は12.4hでサブエージェント待ちを含むため稼働分で計上。／8/20-8/26分（PW-210 ファイル連携基盤のAWS反映：EventBridge/Transfer Family の課金・構成確認、devのLambda失敗〈DATABASE_URL未設定〉の修正・S3投入と実行確認、PR作成）4.62hを加算（band AI稼働）。" },
    { name: "ファイル授受基盤", base: "file", person: 2, group: "基盤", code: "F1", owner: "BE", deps: ["S3/SFTP基盤"],                        asis: 19.1, plan: 3.5, tobe: 2.5, status: "完了", progress: 1, desc: "S3 get/put＋退避・リネームのファイル授受アダプタ。取込ファイル取得／実績ファイル配置の共通経路。" },
    { name: "ファイル定義基盤", base: "file", person: 2, group: "基盤", code: "F2", owner: "BE", deps: [],                                     asis: 26.7, plan: 4.9, tobe: 2.5, status: "完了", progress: 1, desc: "取込/生成の「定義型」基盤（列マッピング・型・バリデーション）。既存エクスポート定義基盤と対称。定義1個＝1帳票。" },
    { name: "バッチ起動基盤",   base: "file", person: 2, group: "基盤", code: "F3", owner: "BE", deps: [],                                     asis: 15.3, plan: 2.8, tobe: 1.0, status: "完了", progress: 1, desc: "特定時刻キックのスケジューラ＋ジョブ実行枠＋t_batch_logs記録。取込/送信の両処理を起動。" },
    { name: "出荷指示取込",     base: "file", person: 2, group: "取込", code: "F4", owner: "BE", deps: ["ファイル授受基盤", "ファイル定義基盤", "バッチ起動基盤"], asis: 22.9, plan: 4.2, tobe: 4.7, status: "完了", progress: 1, desc: "起動→S3から取込ファイル取得→バリデーション＋マッピング（約53項目）→PW-DMS DB登録（$transaction・部分失敗ポリシー・冪等upsert・取込ログ）。／PW-210（サイサン定期ファイル取込修正）実測+1.0h加算（band人稼働）。" },
    { name: "配送指示書作成連携", base: "file", person: 2, group: "取込", code: "F5", owner: "BE", deps: ["出荷指示取込"],                       asis: 11.4, plan: 2.1, tobe: 2.1, status: "完了", progress: 1, desc: "取込完了後に配送指示書の作成処理をキック（既存処理の呼出配線）。／AWS 分の残作業を含め、イテレーション2クローズ（2026-08-31）で完了。工数は S3/SFTP基盤(F0) に計上済みで、ここへの追加計上はなし。" },
    { name: "サイサン指示受信(IF004)", base: "file", person: 2, group: "取込", code: "F9", owner: "BE", deps: ["ファイル定義基盤", "出荷指示取込"], asis: 11.4, plan: 2.1, tobe: 2, status: "完了", progress: 1, desc: "IF004。サイサン出荷指示の定義追加＋サイサン⇔PWフォーマット差分変換。取込本体は出荷指示取込を再利用。" },
    { name: "出荷実績生成",     base: "file", person: 2, group: "送信", code: "F6", owner: "BE", deps: ["ファイル定義基盤", "バッチ起動基盤"],   asis: 19.1, plan: 3.5, tobe: 1.99, status: "完了", progress: 1, desc: "起動→PW-DMS DBから対象データ取得→定義で出荷実績ファイル（約32項目・forU/WS別）を生成。15時までにS3配置（担当者がSFTPで受領）。／PW-210（出荷実績抽出元の切替）実測+1.01h加算（band人稼働）。／実績3.18hは実績ファイル配置(F7)と一体で実装したため plan比(3.5:2.1)で F7 へ1.19hを付替え、当行は1.99h。" },
    { name: "実績ファイル配置", base: "file", person: 2, group: "送信", code: "F7", owner: "BE", deps: ["出荷実績生成", "ファイル授受基盤"],     asis: 11.4, plan: 2.1, tobe: 1.19, status: "完了", progress: 1, desc: "生成した出荷実績ファイルをS3へ配置（担当者がSFTPで受領）。／2026-08-26 時点で完了。実績は出荷実績生成(F6)と一体で計上されていたため plan比(3.5:2.1)で F6 から1.19hを付替えた（新規の稼働ではなく③内の再配分・AC合計は不変）。" },
    { name: "サイサン実績送信(IF005)", base: "file", person: 2, group: "送信", code: "F10", owner: "BE", deps: ["ファイル定義基盤", "出荷実績生成"], asis: 11.4, plan: 2.1, tobe: 2, status: "完了", progress: 1, desc: "IF005。サイサン出荷実績の定義追加（別ファイル・サンプル無し→正解は基幹側読込検証）。生成本体は出荷実績生成を再利用。" },
    { name: "連携E2E(ファイル)", base: "file", person: 2, group: "E2E", code: "F8", owner: "両", deps: ["配送指示書作成連携", "実績ファイル配置"], asis: 11.4, plan: 2.1, tobe: 2.1, status: "完了", progress: 1, desc: "SFTPでファイル配置→取込→指示書作成／実績生成→S3配置 を1本通すE2E（成功・部分失敗・冪等再取込）。" },
    { name: "テスト設計・実施(ファイル連携)", base: "file", person: 2, group: "テスト", code: "QA3", owner: "両", deps: ["連携E2E(ファイル)"], asis: 28.9, plan: 5.3, tobe: 4.34, status: "完了", progress: 1, desc: "③実装系31.5hに対するテスト仕様設計＋テスト実施＋デグレチェック範囲確認。暫定係数0.168＝PW-229実測。新規追加型のため低係数で置いているが、既存の取込/出力処理に触る範囲が出たら見直す。" },
    { name: "PR・レビュー対応(ファイル連携)", base: "file", person: 2, group: "PR", code: "PR3", owner: "両", deps: [], asis: 17.4, plan: 3.2, tobe: 2.36, status: "完了", progress: 1, desc: "③実装系31.5hに対するPR本文作成＋レビュー指摘対応。暫定係数0.102＝PW-229実測。" },

    // ───────── ② 外部連携（SMS）※実装以降(L1-L5/QA2/PR2)はレーン均衡のため人員1が担当。仕様精査は人員2が継続し spec を渡す ─────────
    { name:"SMS連携I/F定義", base:"export", person:1, group:"基盤", code:"L1", owner:"BE", deps:[], asis:8.7, plan:1.6, tobe:0.8, status:"完了", progress:1, desc:"使いたい機能を機能軸のサービスI/Fに契約化（配信/配信結果取得/結果通知）。実ベンダーアクセスはドライバーに閉じる。仕様精査を厚くした分、実装は圧縮。" },
    { name:"SMSモックドライバー", base:"export", person:1, group:"基盤", code:"L2", owner:"BE", deps:["SMS連携I/F定義"], asis:10.9, plan:2.0, tobe:1.0, status:"完了", progress:1, desc:"アクリート実サービス⇔エミュレーターをドライバーで差替（環境変数切替・成功/失敗/遅延の応答パターン）。SoftBank番号は開通後。" },
    { name:"SMSサービス・API(IF008)", base:"export", person:1, group:"基盤", code:"L3", owner:"BE", deps:["SMS連携I/F定義","SMSモックドライバー"], asis:13.1, plan:2.4, tobe:8.42, status:"完了", progress:1, desc:"IF008の利用機能（配信・配信結果取得・結果通知）を束ねるBEサービス＋GraphQL。103pから機能選定。／PW-226（配信結果Webhook・SMS送信エラー挙動）実測+1.61h加算（band人稼働）。／8/20-8/26分（SMS送信インフラ〈AWS〉の方針合意・リソース検討、短縮URL/70文字前提の実装、デプロイ直前までの完了確認）5.2hを加算（実績申告。セッションログ由来は3.58h＝ログ実測2.48h＋サブエージェント欠落分1.10h。当初8.8hで計上したが、対象期間の実稼働が4日間で計上合計が総稼働に近づきすぎたため調整）。" },
    { name:"文面テンプレ適用", base:"export", person:1, group:"適用", code:"L4", owner:"BE", deps:["SMSサービス・API(IF008)"], asis:8.7, plan:1.6, tobe:0.50, status:"完了", progress:1, desc:"業務イベント（配送遅延・ご不在）に既存文面テンプレを適用してSMS送信。既存送信経路を再利用（重複回避）。／8/27-9/2分の実測へ置き換え：PW-226のSMS実績2.67h（band AI稼働・帯はセッション単位）のうち、PR分1.04hを除いた1.63hをL4・L5・QA2へ計画比で按分した0.50h。70文字・短縮URL制約の検証（上限ちょうど70文字で余裕なし）を含む。クローズ時の1.6h（計画消化ベース）を実測へ置き換えた。" },
    { name:"FE036 遅延SMS送信画面", base:"export", person:1, group:"適用", code:"L5", owner:"FE", deps:["SMSサービス・API(IF008)"], asis:10.9, plan:2.0, tobe:0.63, status:"完了", progress:1, desc:"遅延SMSの手動送信UI（対象選択→文面確認→送信→配信結果表示）。／8/27-9/2分の実測へ置き換え：PW-226実績の按分0.63h（計画比 L4 1.6：L5 2.0：QA2 1.6）。遅延SMS 3ケースの実送信（8/27 夜間）まで実施。クローズ時の2.0h（計画消化ベース）を実測へ置き換えた。" },
    { name:"テスト設計・実施(SMS)", base:"export", person:1, group:"テスト", code:"QA2", owner:"両", deps:["FE036 遅延SMS送信画面"], asis:8.7, plan:1.6, tobe:1.10, status:"完了", progress:1, desc:"②実装系9.6hに対するテスト仕様設計＋テスト実施。暫定係数0.168＝PW-229実測。SMS E2Eは開通申請待ちのため後発（スコープ外）。／8/27-9/2分の実測へ置き換え：既存0.60h＋PW-226実績の按分0.50h＝1.10h。webhook通知ログの確認・送信ガード対象の電話番号確認を実施。クローズ時の1.5hを実測へ置き換えた。" },
    { name:"PR・レビュー対応(SMS)", base:"export", person:1, group:"PR", code:"PR2", owner:"両", deps:[], asis:5.5, plan:1.0, tobe:2.04, status:"完了", progress:1, desc:"②実装系9.6hに対するPR本文作成＋レビュー指摘対応。暫定係数0.102＝PW-229実測。／8/27-9/2分：PR作成（8/28）とコンフリクト解消（8/31）の実測1.04hを加算。帯の指示文から按分ではなく実測で切り出した分。" },

    // ───────── ④ 帳票出力（PDF帳票＝配送指示書。非同期生成＋生成状況テーブル＋S3成果物）─────────
    { name: "状況/通知テーブル", base: "report", person: 1, group: "基盤", code: "R0", owner: "DB", deps: [],                                    asis: 15.3, plan: 2.8, tobe: 2.8, status: "完了", progress: 1, desc: "生成状況テーブル（生成中/完了/エラー＋成果物URL）と帳票作成通知テーブルのスキーマ／seed。" },
    { name: "帳票生成エンジン", base: "report", person: 1, group: "基盤", code: "R1", owner: "BE", deps: [],                                    asis: 30.5, plan: 5.6, tobe: 5.6, status: "完了", progress: 1, desc: "PDF帳票（配送指示書）生成コア。テンプレート→データ差込→PDF化。" },
    { name: "非同期ジョブ基盤", base: "report", person: 1, group: "基盤", code: "R2", owner: "BE", deps: ["帳票生成エンジン", "状況/通知テーブル"], asis: 26.7, plan: 4.9, tobe: 4.9, status: "完了", progress: 1, desc: "非同期生成ジョブの実行枠＋生成状況更新（生成中→完了/エラー）＋S3への成果物アップロード。" },
    { name: "生成/状況API",     base: "report", person: 1, group: "基盤", code: "R3", owner: "BE", deps: ["非同期ジョブ基盤"],                   asis: 22.9, plan: 4.2, tobe: 6.2, status: "完了", progress: 1, desc: "生成リクエスト受付mutation＋状況確認query（ポーリング用・完了時はダウンロードURLを返却）。" },
    { name: "画面出力連携(FE)", base: "report", person: 1, group: "適用", code: "R4", owner: "FE", deps: ["生成/状況API"],                     asis: 19.1, plan: 3.5, tobe: 5.2, status: "完了", progress: 1, desc: "画面から生成リクエスト→定期ポーリングで状況確認→完了はURLからDL・エラーは画面表示（DLなし）。" },
    { name: "デポ別一括生成",   base: "report", person: 1, group: "適用", code: "R5", owner: "BE", deps: ["非同期ジョブ基盤", "出荷指示取込"],   asis: 26.7, plan: 4.9, tobe: 7.2, status: "完了", progress: 1, desc: "出荷指示取込後、デポごとに生成開始→各デポ非同期生成→S3アップロード→生成状況更新→帳票作成通知テーブル更新。" },
    { name: "帳票E2E",          base: "report", person: 1, group: "E2E", code: "R6", owner: "両", deps: ["画面出力連携(FE)", "デポ別一括生成"],   asis: 11.4, plan: 2.1, tobe: 3.1, status: "完了", progress: 1, desc: "画面出力（生成→ポーリング→DL）とデポ別一括生成（取込→デポ別→通知）をそれぞれ1本通すE2E。" },
    { name: "テスト設計・実施(帳票)", base: "report", person: 1, group: "テスト", code: "QA4", owner: "両", deps: ["帳票E2E"], asis: 24.0, plan: 4.4, tobe: 6.5, status: "完了", progress: 1, desc: "④実装系25.9hに対するテスト仕様設計＋テスト実施＋デグレチェック範囲確認。暫定係数0.168＝PW-229実測。デポ別並列生成の検証が主。" },
    { name: "PR・レビュー対応(帳票)", base: "report", person: 1, group: "PR", code: "PR4", owner: "両", deps: [], asis: 14.2, plan: 2.6, tobe: 3.8, status: "完了", progress: 1, desc: "④実装系25.9hに対するPR本文作成＋レビュー指摘対応。暫定係数0.102＝PW-229実測。" },

    // ───────── 予備工数 ─────────
    { name: "予備工数1",        base: "reserve", person: 1, group: "予備工数", code: "R1",  owner: "両", deps: [], asis: 11.6, plan: 11.6, tobe: 11.6, status: "完了", progress: 1, desc: "人員1（①認証認可）の残キャパ。手戻り・追加調査・レビュー対応・仕様確認の往復などの予備枠。" },
    { name: "予備工数2",        base: "reserve", person: 2, group: "予備工数", code: "R2",  owner: "両", deps: [], asis: 11.4, plan: 11.4, tobe: 17.30, status: "完了", progress: 1, desc: "人員2（②SMS／③ファイル連携／④帳票出力）の残キャパ。手戻り・追加調査・レビュー対応・仕様確認の往復、横断タスク（先出し確認フォロー・G1合意往復×3基盤・KSL/IVR追跡・workitems2反映）などの予備枠。※うち3.0hはAIインプット整備として項目化。実消化=担当者PR/チケット確認・レビュー対応・チケット修正手順書作成。／PW-252（データモデル設計反映＝変更対応）実測9.18h(band人稼働)を計上。plan3.4hを大幅超過＝予備が変更対応で消費された状態。／8/20-8/26分（PW-187 要件・設計資料のリポジトリ管理、PW-243 帳票設計書の取り込み、PW-163 データモデル設計書の非表示シート除外、短時間の確認作業）2.30hを加算（band AI稼働）。／PW-281（列挙型・データモデル定義の更新／8/29-9/1）4.07hを加算＝PW-252と同じ「定義の変更対応は予備で吸収」の扱い。物差しは band AI稼働。.work/PW-281.metrics.md はサブエージェント実経過4.5h＋メインループ3.8hでAI稼働下限8.3hとするが、他項目と物差しを揃えるため帯の値を採用。" },
    // ───────── ⑤ IVR連携（後発・スコープ外。7/31に調査/チケット化のみ実施） ─────────
    { name: "IVR連携(IF007/API01-04・調査/チケット化)", base: "ivr", person: 2, group: "仕様精査", code: "IV1", owner: "両", deps: [], asis: 1.43, plan: 1.43, tobe: 1.43, status: "完了", progress: 1, desc: "IF007（IVR予約上限送信IF）・API01-04のスコープ確認とチケット化・仕様精査（7/31実施）。コールフロー本体は他社担当、当社範囲はAPI01-04。SMS要件FIX後の後発対応で今イテレーションは調査/起票のみ（スコープ外）。band実測1.43h(人稼働)を記録。／2026-08-26 時点で仕様調査は完了（追加工数なし・tobe 据え置き）。コールフロー本体および API01-04 の実装は後発。" },
    { name: "AI駆動開発の改善(aws-operator作成ほか)", base: "other", person: 2, group: "その他工数", code: "O2", owner: "両", deps: [], asis: 1.92, plan: 1.92, tobe: 1.92, status: "完了", progress: 1, desc: "aws-operatorエージェントの作成とルール化（AWSコマンド実行の人間委任・課金/セキュリティ規律）とデモ環境構築の指示。8/21・8/24実測1.92h（band AI稼働）。計画外に発生したため asis=plan=tobe で後追い項目化（IVR連携と同じ扱い）。" },
  ],
};

if (typeof module !== "undefined" && module.exports) module.exports = { SPRINT2_DATA };
