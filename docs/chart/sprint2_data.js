// スプリント2（2026-07-14〜）タスクデータ ── workitems2.html / aidd_report2.html 共通ソース
// 出典: .work/基盤設計_01_認証認可.md / _02_配送ステータスイベント.md / _03_外部連携.md のタスク分解
//       .work/sprint2_actuals.md（AsIs再算出・実績反映・認可タスク組み替えの算出台帳）
//
// 各タスク:
//   name   : 短い和名（指示時に使う識別子。プロジェクト内で一意）
//   base   : 所属基盤キー（auth / status / export / other …）
//   group  : 基盤内の区分（基盤 / URL判定 / テスト基盤 / 適用 / テスト / PR など）
//   code   : 元設計書のタスクID（A / IT4 / IA1 …）
//   owner  : スキル区分（BE / FE / DB / 両）
//   person : 担当者番号（1 or 2）。カレンダー/バーンダウン/EVM のレーン割当。ここを編集すれば担当を変えられる（省略時は auth→1 / 他→2）
//   deps   : 依存タスクの短い和名（表示用。無ければ空配列）
//   asis   : 人力予想工数（人力で作った場合の想定・概算h）
//   plan   : 予定工数（AI駆動の計画見積・バッファ込みの最終予定h）
//   tobe   : 実績工数（AI駆動で実際にかかったh。完了時に確定・未完了は 0。バーンダウンの AC も兼ねる）
//   status / progress : 進捗管理用（着手前は 予定 / 0）
//   desc   : 概要（1行）
//
// plan は計画（PV・ガント・バーンダウン理想線・EV）に、tobe は実績（ToBe実績・AC）に使用する。
//
// ── asis の算出根拠（2026-07-29 改定・詳細は .work/sprint2_actuals.md）─────────────
// 実装系タスクの asis は `plan × 5.45`。レバレッジ 5.45 は PW-229 の実測から導出:
//   PW-229 追加3,202行 ÷ 人力35行/h = 91.5h（AsIs） ÷ ToBe 16.8h = ×5.45
//   人力単価35行/h は JWT実装の実測倍率6.25（asis25.0/tobe4）から逆算した30.5〜36.9行/hの中央値。
//   ユニットテスト（PW-229では1,341行＝42%）も実装コストに含める方針。
// 据え置き（レバレッジ対象外）: 事前工数（人力でも同じだけかかる）／予備工数／仕様精査（AIで縮まらない）
//   ／Cognito整備・JWT実装（実測asisが既にある）／マスタ整理（行数から直接算出）。
//
// ── テスト・PR工程の係数（同上）───────────────────────────────────
// 各基盤の「テスト設計・実施」「PR・レビュー対応」は実装系 plan に係数を掛けた枠。
//   テスト設計・実施 0.168 ／ PR・レビュー対応 0.102（合計0.27＝PW-229実測: 下流残差1.3h÷実装4.9h）
// ⚠️ 係数の分母は「【テスト/PR がまだ済んでいない】実装系 plan」。"未完の実装系" にしてはいけない。
//    実装が完了してもそのテストとPRは残るので、実装完了で分母を減らすとテスト枠が消えてしまう。
//    分母から外すのは、テストとPRまで通し終えた分だけ。
//   ⚠️ 既存への横展開が主体だったPW-236の実測は テスト実施だけで1.88（約10倍）。
//      「適用」着手後に実測へ差し替える必要がある（最大+183hの未計上リスク）。
// なお PM承認は各「仕様精査(◯◯)～PM合意」に含まれるため、別枠を設けていない。
const SPRINT2_DATA = {
  meta: { sprint: 2, start: "2026-07-14", hoursPerDay: 7.2 },
  // 2026年 祝日（スプリント期間にかかり得るもの）＋土日は自動除外
  holidays: ["2026-07-20", "2026-08-11", "2026-09-21", "2026-09-23"],
  // EVM 週次スナップショット（記録日→その時点の累積 EV/AC・h）。週1回くらい追記する。
  // 例: "2026-07-18": { ev: 20.0, ac: 18.5 } ／ 空なら EVM は PV（計画値）のみ表示。
  // ※AC は実測値（Σ tobe）を入れる。手で丸めたり調整したりしない。
  //   ただし現状 AC の内訳は人員1に偏っている: 人員1は PW-229(16.8h)/PW-236(13.66h) のメトリクス実測
  //   だが、人員2の07/22-29は未計測で仕様精査の progress からの自己申告値。実測が取れたら AC を見直す。
  //   下記スナップショットは記録時点の値。タスクの plan/progress/tobe を後から動かすと
  //   ライブ値（EVMタブ下部に表示される Σ計画×進捗 / Σ実工数）とはずれる。
  evmSnapshots: {
    "2026-07-21": { "ev": 43.2, "ac": 42.9 },
    "2026-07-29": { "ev": 104.6, "ac": 94.1 }
  },
  // 予定休（人員別・YYYY-MM-DD）。その人員の営業日から個別に除外し、当該人員のタスクは翌営業日へ後ろ倒し。
  leaves: {
    "1": ["2026-07-16"],
    "2": [],
  },
  bases: [
    { key: "prep",   id: "事", name: "事前工数",              color: "#0d9488" },
    { key: "auth",   id: "①", name: "認証・認可",              color: "#2563eb" },
    { key: "export", id: "②", name: "外部連携(SMS)", color: "#7c3aed" },
    { key: "file",   id: "③", name: "ファイル連携(取込/送信)", color: "#0891b2" },
    { key: "report", id: "④", name: "帳票出力(PDF生成)",       color: "#d97706" },
    { key: "other",  id: "他", name: "その他工数",              color: "#94a3b8" },
    { key: "reserve", id: "予", name: "予備工数",              color: "#64748b" },
  ],
  tasks: [
    // ───────── 事前工数（①②③④より前・7/14）─────────
    { name: "プランニング①・AI整備", base: "prep", person: 1, group: "事前工数", code: "P1", owner: "両", deps: [], asis: 7.2, plan: 7.2, tobe: 7.2, status: "完了", progress: 1, desc: "人員1：スプリント2初日の事前工数。プランニング（タスク分解・段取り・論点整理）＋AI環境整備（エージェント／worktree 等の準備）。" },
    { name: "プランニング②・AI整備", base: "prep", person: 2, group: "事前工数", code: "P2", owner: "両", deps: [], asis: 7.2, plan: 7.2, tobe: 7.2, status: "完了", progress: 1, desc: "人員2：スプリント2初日の事前工数。プランニング（タスク分解・段取り・論点整理）＋AI環境整備（エージェント／worktree 等の準備）。" },
    { name: "方法論・管理の事前整備", base: "prep", person: 2, group: "事前工数", code: "P3", owner: "両", deps: [], asis: 5.0, plan: 5.0, tobe: 5.0, status: "完了", progress: 1, desc: "人員2：イテレーション2の事前整備（方法論・管理）。ミッションたたき台作成／レビュープロセス検討（壁打ち・資料化）／2%修正課題の整理。" },
    { name: "AIインプット整備(正本/設計集約)", base: "prep", person: 2, group: "事前工数", code: "P4", owner: "両", deps: [], asis: 3.0, plan: 3.0, tobe: 3.0, status: "完了", progress: 1, desc: "人員2：イテレーション2着手の前段階。古くなっていたAI向けインプット資料を整備（正本データ抽出・SMS/帳票向け設計情報の集約）。仕様の不明点解消の精度を上げるための調整。予備工数2から3.0hを項目化。" },
    // ───────── ① 認証・認可：仕様精査（完了分・上流）─────────
    // 当初1本だった「仕様精査(認可)～PM合意」(plan 28.8h) を4本に分解した。上流はもともと
    // Cognito/JWT・U1-U4 より先に走っているため、1本のまま完了作業の後ろに置くと時系列が逆転する。
    //   SP1 5.35h(完了) ＋ SP2 5.35h(完了) … PW-229 の上流実測10.7h を2等分し実装ブロックの前へ
    //   SP3 3.0h(完了)  … 画面適用の仕様精査。画面適用ブロックの直前
    //   SP4 15.1h(着手中75%・実績12.0h) … API適用の仕様精査。API適用ブロックの直前
    // 4本の合計 plan/asis 28.8h は元と一致する。
    { name: "仕様精査(認可)①要件・SEED権限精査", base: "auth", person: 1, group: "仕様精査", code: "SP1", owner: "両", deps: [], asis: 5.35, plan: 5.35, tobe: 5.35, status: "完了", progress: 1, desc: "認証・認可の要件・SEED権限データ・16bitモデルの精査（上流）。Cognito/JWT 着手の前提。PW-229 の上流実測10.7h（07/23 要件合意3.5h＋07/24-25 権限モデル整理・spec準備7.2h）を実装ブロックの前に2等分して配置した前半分。" },
    // ───────── ① 認証・認可：基盤（Cognito/JWT は実施済み＝完了作業として過去に配置）─────────
    { name: "Cognito整備",      base: "auth", person: 1, group: "基盤",       code: "A0",  owner: "BE", deps: [],                    asis: 20.7, plan: 4.2, tobe: 4, status: "完了", progress: 1, desc: "Cognito ユーザープール／アプリクライアント／グループ（ロール）設定・トークンクレーム設計。AWS側整備でAI駆動範囲外の手作業を含む。JWT署名検証の前提。" },
    { name: "JWT実装",          base: "auth", person: 1, group: "基盤",       code: "A",   owner: "BE", deps: ["Cognito整備"],       asis: 25.0, plan: 4.2, tobe: 4, status: "完了", progress: 1, desc: "JwtAuthGuard 本実装（Cognito署名検証・実ユーザー注入、dev-bypass温存）。最優先。" },
    { name: "ロールSEED",       base: "auth", person: 1, group: "テスト基盤", code: "IT1", owner: "DB", deps: ["JWT実装"], asis: 15.3, plan: 2.8, tobe: 1, status: "完了", progress: 1, desc: "17ロール代表デモユーザー＋scope差（デポ/荷主違い）。ロールピッカーの選択肢。計画2.8hに対し実績1.0h。認可の実装より先に整備したため、テスト基盤ブロックから前出しして JWT実装 の直後に配置。" },
    // ───────── ① 認証・認可：URL単位アクセス判定の基盤（PW-229・完了）─────────
    // 当初は「resolver/要素単位の権限判定」前提の分解だったが、PW-229 で実際に作られたのは
    // 「サーバー側(Edge middleware)でURL単位に判定する」方式（禁止されていなければアクセス可）。
    // これに伴い旧設計の7行を削除し、本ブロック(U1-U4)に置き換えた:
    //   置換 … 権限配布API(D)→U2 / URLガード(F)→U3 / driverガード(G)→U4
    //   内包 … 判定コア(B)・Guard・デコレータ(C)・権限ゲート(FE)(E)→U3 / レガシー整理(H)→U2
    // 認可基盤は本ブロックで完了。残る①の作業は「適用（resolver/画面への横展開）」と「テスト基盤」のみ。
    // ※U1-U3 は plan(計画14.4h) > tobe(実績6.2h)。内包した旧行の計画分を織り込んで各+3hしているため。
    //   tobe は PW-229 メトリクスの実測どおり。
    { name: "仕様精査(認可)②権限モデル整理～PM合意", base: "auth", person: 1, group: "仕様精査", code: "SP2", owner: "両", deps: ["仕様精査(認可)①要件・SEED権限精査"], asis: 5.35, plan: 5.35, tobe: 5.35, status: "完了", progress: 1, desc: "権限マトリクス精査・URL↔権限対象 対応表の作成・driver側の権限モデル決定・spec作成＋作業チケットのスコープ合意（PM承認）。URL判定ブロック(U1-U4)の実装直前。PW-229 の上流実測10.7hの後半分。" },
    { name: "認可ビット基盤(authz-bits)", base: "auth", person: 1, group: "URL判定", code: "U1", owner: "BE", deps: ["JWT実装", "仕様精査(認可)②権限モデル整理～PM合意"], asis: 18.5, plan: 3.4, tobe: 0.4, status: "完了", progress: 1, desc: "16bit のパック/アンパック共有実装（libs/shared-utils/src/authz-bits.ts・35行）。DBは既存 m_role_targets / m_role_group_targets を流用しスキーマ変更ゼロ。" },
    { name: "URL↔権限対象 対応表・権限カタログ", base: "auth", person: 1, group: "URL判定", code: "U2", owner: "BE", deps: ["認可ビット基盤(authz-bits)"], asis: 27.3, plan: 5.0, tobe: 2.0, status: "完了", progress: 1, desc: "authzRegistry（model/resolver/service）＋permission-catalog＋role-target-registry.helper。URLと権限対象の対応表をクライアントへ配布。API 157行。07/28に直値を権限カタログ化・不要URL削除・対応表を索引化。旧「権限配布API(D)」の代替であり、旧「レガシー整理(H)」（permissionGroupId依存の排除・roleGroupId一本化）も内包して完了。" },
    { name: "Edge middlewareアクセス判定(admin)", base: "auth", person: 1, group: "URL判定", code: "U3", owner: "FE", deps: ["URL↔権限対象 対応表・権限カタログ"], asis: 32.7, plan: 6.0, tobe: 3.0, status: "完了", progress: 1, desc: "middleware / route-table / access-decision / id-token / registry-client / authz-url-guard / authz-messages。「禁止されていなければアクセス可」をサーバー側(Edge)で判定する共通基盤＋admin適用。FE 1,704行＋UT 1,341行の主体。07/23はクライアント側判定で実装したが破棄し再設計（捨て工数3.5h）。旧「URLガード(F)」の代替であり、旧「判定コア(B)」「Guard・デコレータ(C)」「権限ゲート(FE)(E)」も内包して完了（URL単位判定に集約したため個別の判定コア／デコレータ／要素ゲートは不要になった）。" },
    { name: "driverアクセス判定", base: "auth", person: 1, group: "URL判定", code: "U4", owner: "FE", deps: ["Edge middlewareアクセス判定(admin)"], asis: 4.4, plan: 0.8, tobe: 0.8, status: "完了", progress: 1, desc: "app-driver のURL単位アクセス判定。login-gate による未認証リダイレクト、/ → /home リダイレクト、route-table への driver ルート登録。共通middleware(U3)を再利用するため driver 固有分は小さい。旧「driverガード(G)」の代替。" },
    // ───────── その他工数（変更管理で割り込んだ作業・人員1・PW-229と並行）─────────
    { name: "マスタ整理(水源/出荷元廃止→指示書記号)", base: "other", person: 1, group: "その他工数", code: "O1", owner: "両", deps: [], asis: 28.8, plan: 13.7, tobe: 13.66, status: "完了", progress: 1, desc: "変更管理対象の仕様変更（水源マスタ・出荷元マスタ廃止→指示書記号）。計画外の割り込み。追加392行／削除2,464行で削除が主体。仕様が3周変わり13.66hのうち3.25h(24%)が捨て工数、成果物に残ったのは実質6.3h。工程別ではテスト実施が5.79h(42.4%)で最大。asisは削除重み0.25で換算1,008行÷35行/h=28.8h。" },
    // ───────── ① 認証・認可：仕様精査（適用フェーズ向け・適用ブロックの直前に置く）─────────
    // 当初1本だった「仕様精査(認可)～PM合意」(plan 28.8h) を4本に分解した。
    //   SP1 5.35h(完了) ＋ SP2 5.35h(完了) … PW-229 の上流実測10.7h を2等分
    //   SP3 3.0h(完了)  … 画面適用の仕様精査。画面適用ブロックの直前
    //   SP4 15.1h(着手中75%・実績12.0h) … API適用の仕様精査。API適用ブロックの直前
    // 4本の合計は plan/asis 28.8h で元と一致する（tobe は 13.7h＝上流10.7＋SP3 3.0）。
    { name: "仕様精査(画面適用)",   base: "auth", person: 1, group: "仕様精査",   code: "SP3",  owner: "両", deps: ["仕様精査(認可)②権限モデル整理～PM合意"], asis: 3.0, plan: 3.0, tobe: 3.0, status: "完了", progress: 1, desc: "画面適用（admin 21ルート＋driver 22ルート）に向けた仕様精査。要素ガードの粒度・SCREEN操作キーの割り当て・メニュー出し分けの範囲・KSL/配送員のロール差の確定。計画3.0hで完了。" },
    // ───────── ① 認証・認可：適用（画面・FE。URL単位判定が済んでいるので要素ガードから先行）─────────
    { name: "画面適用:admin共通", base: "auth", person: 1, group: "適用",      code: "IF1", owner: "FE", deps: ["Edge middlewareアクセス判定(admin)", "仕様精査(画面適用)"], asis: 19.1, plan: 3.5, tobe: 3.5, status: "完了", progress: 1, desc: "main-menu 約20リーフをcan()フィルタ＋RootLayout配線（21ルート）。URL単位の可否はU3で完了しているのでメニュー出し分けが主。計画どおり3.5hで完了。" },
    { name: "画面適用:admin各画面(前半)", base: "auth", person: 1, group: "適用", code: "IF2a", owner: "FE", deps: ["画面適用:admin共通"], asis: 22.9, plan: 4.2, tobe: 4.2, status: "完了", progress: 1, desc: "admin 21ルート前半に要素ガード。主要/個人情報系ルートのSCREEN操作キー付けを先行。計画どおり4.2hで完了。" },
    { name: "画面適用:admin各画面(後半)", base: "auth", person: 1, group: "適用", code: "IF2b", owner: "FE", deps: ["画面適用:admin各画面(前半)"], asis: 22.9, plan: 4.2, tobe: 4.2, status: "完了", progress: 1, desc: "admin 残りルートに要素ガード。SCREEN操作102の残りキー付け。計画どおり4.2hで完了。" },
    { name: "画面適用:driver",   base: "auth", person: 1, group: "適用",       code: "IF3", owner: "FE", deps: ["driverアクセス判定"], asis: 26.7, plan: 4.9, tobe: 0, status: "予定", progress: 0, desc: "app-driver 22ルートの要素ガード（KSL/配送員のロール差を反映）。URL単位判定はU4で完了。planはURL＋要素で積んだ4.9hを据え置いており、着手時に実測して見直す。" },
    // ───────── ① 認証・認可：テスト基盤 ─────────
    { name: "ロール切替",       base: "auth", person: 1, group: "テスト基盤", code: "IT2", owner: "BE", deps: ["JWT実装", "Edge middlewareアクセス判定(admin)"], asis: 19.1, plan: 3.5, tobe: 0, status: "予定", progress: 0, desc: "dev-bypassにprincipal載せGuardが実注入。本番はサーバ側で厳格無効化。" },
    { name: "ロールピッカー",   base: "auth", person: 1, group: "テスト基盤", code: "IT3", owner: "FE", deps: ["URL↔権限対象 対応表・権限カタログ", "ロール切替"], asis: 15.3, plan: 2.8, tobe: 0, status: "予定", progress: 0, desc: "開発ツールバーのロール選択→入り直し→permission再取得→再ゲート。" },
    { name: "認可テスト基盤",   base: "auth", person: 1, group: "テスト基盤", code: "IT4", owner: "BE", deps: ["URL↔権限対象 対応表・権限カタログ", "ロールSEED"], asis: 30.5, plan: 5.6, tobe: 0, status: "予定", progress: 0, desc: "actingAs()／Playwrightロール注入／SEED由来ゴールデン権限マトリクス突合。" },
    // ───────── ① 認証・認可：適用（API・BE の横展開）─────────
    { name: "仕様精査(API適用)",   base: "auth", person: 1, group: "仕様精査",   code: "SP4",  owner: "両", deps: ["仕様精査(画面適用)"], asis: 15.1, plan: 15.1, tobe: 12, status: "着手中", progress: 0.75, desc: "API適用（master 23res/105ops・tms 8res/54ops・driver 1res/30ops）に向けた仕様精査。計画15.1hに対し12.0h消費・75%完了（残 3.8h）。scope複合の扱い・自デポ/自荷主のwhere適用範囲・actor制約と認可の責務分担・Cognito連携時期などの残論点とチケット合意。当初 plan 28.8h から SP1/SP2(上流10.7h)・SP3(画面適用3.0h)を切り出した残り。PW-229では上流が全体の64%を占めており、適用フェーズでも上流が効く見込み。" },
    { name: "API適用:master(個人情報系)", base: "auth", person: 1, group: "適用", code: "IA1a", owner: "BE", deps: ["URL↔権限対象 対応表・権限カタログ", "仕様精査(API適用)"], asis: 22.9, plan: 4.2, tobe: 0, status: "予定", progress: 0, desc: "master 実適用の先頭。個人情報系resolverに@RequirePermission＋scopeを先行付与（≒23res/105opsのうち高リスク優先）。※テスト実施係数の実測ポイント（.work/sprint2_actuals.md §7）。" },
    { name: "API適用:master(残り)", base: "auth", person: 1, group: "適用",     code: "IA1b", owner: "BE", deps: ["API適用:master(個人情報系)"], asis: 22.9, plan: 4.2, tobe: 0, status: "予定", progress: 0, desc: "master 残りresolver/opsへ横展開＋RF15。前半と同型で@RequirePermission＋scopeを付与。" },
    { name: "API適用:tms",      base: "auth", person: 1, group: "適用",       code: "IA2", owner: "BE", deps: ["URL↔権限対象 対応表・権限カタログ"], asis: 38.2, plan: 7.0, tobe: 0, status: "予定", progress: 0, desc: "tms 8res/54ops＋RF15。自デポ/自荷主 scopeのwhere適用が主戦場。" },
    { name: "API適用:driver",   base: "auth", person: 1, group: "適用",       code: "IA3", owner: "BE", deps: ["URL↔権限対象 対応表・権限カタログ"], asis: 19.1, plan: 3.5, tobe: 0, status: "予定", progress: 0, desc: "driver 1res/30ops。別紙02のactor制約と認可の責務分担を整理して付与。" },
    // ───────── ① 認証・認可：テスト／PR（PW-229実測の係数で確保。詳細は .work/sprint2_actuals.md §3）─────────
    { name: "テスト設計・実施(認可)", base: "auth", person: 1, group: "テスト", code: "QA1", owner: "両", deps: ["認可テスト基盤"], asis: 43.6, plan: 8.0, tobe: 0, status: "予定", progress: 0, desc: "①のうち【テスト/PR未実施】の実装系47.6h（画面適用admin完了分11.9＋画面適用driver4.9＋テスト基盤11.9＋API適用18.9）に対するテスト仕様設計＋テスト実施＋デグレチェック範囲確認。暫定係数0.168＝PW-229実測（下流残差1.3h÷実装4.9h）。⚠️既存への横展開が主体だったPW-236の実測は1.88で約10倍高い。適用8タスク着手後に実測へ差替が必要。" },
    { name: "PR・レビュー対応(認可)", base: "auth", person: 1, group: "PR", code: "PR1", owner: "両", deps: [], asis: 26.7, plan: 4.9, tobe: 0, status: "予定", progress: 0, desc: "①のうち【テスト/PR未実施】の実装系47.6hに対するPR本文作成＋レビュー指摘対応。暫定係数0.102＝PW-229実測（pr-writer 5.7分＋reviewer 24.9分）。" },

    // ───────── ③ ファイル連携（各基幹システムと双方向のファイル連携。前提: S3＋Transfer Family の SFTP）─────────
    // 出荷指示取込（S3→検証/マッピング→DB→配送指示書作成）と 出荷実績送信（DB→実績ファイル生成→S3配置）。いずれも特定時刻にバッチ起動。取込/生成は「定義型」基盤で対称に。※人員2の着手はこの③を先頭にする（配列順＝レーン着手順：③→②→④）。
    { name: "仕様精査(ファイル連携)～PM合意", base: "file", person: 2, group: "仕様精査", code: "SP", owner: "両", deps: [], asis: 10.8, plan: 7.2, tobe: 1.5, status: "着手中", progress: 0.21, desc: "出荷指示取込・出荷実績送信の精査と論点整理（ファイル定義・バリデーション正本・文字コード・部分失敗ポリシー・冪等・スケジュール起動・SFTP/S3授受の前提）。ファイル連携チケット修正〜PR〜PM案内（PM承認）を含む。" },
    // ②SMS・④帳票の仕様精査は前倒し着手（現在進行中）のため、③仕様精査の直後にまとめて配置し「今日」まで走らせる。実装ブロック（F/L/R）はこの後ろ。
    { name: "仕様精査(SMS連携)～PM合意", base:"export", person:2, group:"仕様精査", code:"SP", owner:"両", deps:[], asis:10.8, plan:14.4, tobe:0.75, status:"着手中", progress:0.05, desc:"SMS連携の精査と論点整理（機能I/F粒度・ドライバー化方針・再送/冪等・文面テンプレ・接続情報/環境変数の未確定欄）。SMS設計情報確認・親チケット起票（PM承認）着手を含む。実装より仕様精査に時間を投下し今日まで継続中（高品質インプットで実装を圧縮）。IVRは後発（要件FIX後・今回スコープ外）。" },
    { name: "仕様精査(帳票)～PM合意",   base: "report", person: 2, group: "仕様精査", code: "SP", owner: "両", deps: [], asis: 10.8, plan: 7.2, tobe: 0.75, status: "着手中", progress: 0.10, desc: "画面出力／取込出力の精査と論点整理（非同期生成方式・生成状況テーブル・S3成果物・ポーリング/通知テーブル・エラー扱い・デポ別並列）。帳票設計情報確認・親チケット起票（PM承認）着手を含む。RP021/RP022は含否がG1論点＝今回除外・次スプリント。" },
    { name: "S3/SFTP基盤",     base: "file", person: 2, group: "基盤", code: "F0", owner: "BE", deps: [],                                     asis: 22.9, plan: 4.2, tobe: 0, status: "予定", progress: 0, desc: "S3バケット＋Transfer Family による SFTP アクセス整備（各基幹システム担当者がファイル送受信）。AWS側整備でAI駆動範囲外の手作業を含む。" },
    { name: "ファイル授受基盤", base: "file", person: 2, group: "基盤", code: "F1", owner: "BE", deps: ["S3/SFTP基盤"],                        asis: 19.1, plan: 3.5, tobe: 0.5, status: "着手中", progress: 0.14, desc: "S3 get/put＋退避・リネームのファイル授受アダプタ。取込ファイル取得／実績ファイル配置の共通経路。" },
    { name: "ファイル定義基盤", base: "file", person: 2, group: "基盤", code: "F2", owner: "BE", deps: [],                                     asis: 26.7, plan: 4.9, tobe: 0, status: "予定", progress: 0, desc: "取込/生成の「定義型」基盤（列マッピング・型・バリデーション）。既存エクスポート定義基盤と対称。定義1個＝1帳票。" },
    { name: "バッチ起動基盤",   base: "file", person: 2, group: "基盤", code: "F3", owner: "BE", deps: [],                                     asis: 15.3, plan: 2.8, tobe: 0, status: "予定", progress: 0, desc: "特定時刻キックのスケジューラ＋ジョブ実行枠＋t_batch_logs記録。取込/送信の両処理を起動。" },
    { name: "出荷指示取込",     base: "file", person: 2, group: "取込", code: "F4", owner: "BE", deps: ["ファイル授受基盤", "ファイル定義基盤", "バッチ起動基盤"], asis: 22.9, plan: 4.2, tobe: 0, status: "予定", progress: 0, desc: "起動→S3から取込ファイル取得→バリデーション＋マッピング（約53項目）→PW-DMS DB登録（$transaction・部分失敗ポリシー・冪等upsert・取込ログ）。" },
    { name: "配送指示書作成連携", base: "file", person: 2, group: "取込", code: "F5", owner: "BE", deps: ["出荷指示取込"],                       asis: 11.4, plan: 2.1, tobe: 0, status: "予定", progress: 0, desc: "取込完了後に配送指示書の作成処理をキック（既存処理の呼出配線）。" },
    { name: "サイサン指示受信(IF004)", base: "file", person: 2, group: "取込", code: "F9", owner: "BE", deps: ["ファイル定義基盤", "出荷指示取込"], asis: 11.4, plan: 2.1, tobe: 0, status: "予定", progress: 0, desc: "IF004。サイサン出荷指示の定義追加＋サイサン⇔PWフォーマット差分変換。取込本体は出荷指示取込を再利用。" },
    { name: "出荷実績生成",     base: "file", person: 2, group: "送信", code: "F6", owner: "BE", deps: ["ファイル定義基盤", "バッチ起動基盤"],   asis: 19.1, plan: 3.5, tobe: 0, status: "予定", progress: 0, desc: "起動→PW-DMS DBから対象データ取得→定義で出荷実績ファイル（約32項目・forU/WS別）を生成。15時までにS3配置（担当者がSFTPで受領）。" },
    { name: "実績ファイル配置", base: "file", person: 2, group: "送信", code: "F7", owner: "BE", deps: ["出荷実績生成", "ファイル授受基盤"],     asis: 11.4, plan: 2.1, tobe: 0, status: "予定", progress: 0, desc: "生成した出荷実績ファイルをS3へ配置（担当者がSFTPで受領）。" },
    { name: "サイサン実績送信(IF005)", base: "file", person: 2, group: "送信", code: "F10", owner: "BE", deps: ["ファイル定義基盤", "出荷実績生成"], asis: 11.4, plan: 2.1, tobe: 0, status: "予定", progress: 0, desc: "IF005。サイサン出荷実績の定義追加（別ファイル・サンプル無し→正解は基幹側読込検証）。生成本体は出荷実績生成を再利用。" },
    { name: "連携E2E(ファイル)", base: "file", person: 2, group: "E2E", code: "F8", owner: "両", deps: ["配送指示書作成連携", "実績ファイル配置"], asis: 11.4, plan: 2.1, tobe: 0, status: "予定", progress: 0, desc: "SFTPでファイル配置→取込→指示書作成／実績生成→S3配置 を1本通すE2E（成功・部分失敗・冪等再取込）。" },
    { name: "テスト設計・実施(ファイル連携)", base: "file", person: 2, group: "テスト", code: "QA3", owner: "両", deps: ["連携E2E(ファイル)"], asis: 28.9, plan: 5.3, tobe: 0, status: "予定", progress: 0, desc: "③未完実装系31.5hに対するテスト仕様設計＋テスト実施＋デグレチェック範囲確認。暫定係数0.168＝PW-229実測。新規追加型のため低係数で置いているが、既存の取込/出力処理に触る範囲が出たら見直す。" },
    { name: "PR・レビュー対応(ファイル連携)", base: "file", person: 2, group: "PR", code: "PR3", owner: "両", deps: [], asis: 17.4, plan: 3.2, tobe: 0, status: "予定", progress: 0, desc: "③未完実装系31.5hに対するPR本文作成＋レビュー指摘対応。暫定係数0.102＝PW-229実測。" },

    // ───────── ② 外部連携（SMS）─────────
    // SMS特化。アクリート実サービス⇔エミュレータをドライバーで差替。IVR・再配達受付UCは後発（要件FIX 7月中・スコープ外）。SMS E2Eも後発（開通申請待ち＝7月以降）。駆動UC=配送遅延/ご不在通知。※仕様精査(SMS連携)は前倒し着手のため③仕様精査群の直後に配置済み。実装(L1-L5)は仕様精査への時間投下により工数圧縮（16.8→9.6h）。
    // ※レーン均衡のため実装以降（L1-L5 / QA2 / PR2 = 12.2h）は人員1が担当する。①の認可基盤が
    //   URL単位判定に集約されて完了し人員1に余力が出たため。仕様精査(SMS連携)は着手中なので
    //   人員2が継続し、spec を渡して人員1が実装する引き継ぎになる（spec駆動の受け渡し）。
    { name:"SMS連携I/F定義", base:"export", person:1, group:"基盤", code:"L1", owner:"BE", deps:[], asis:8.7, plan:1.6, tobe:0, status:"予定", progress:0, desc:"使いたい機能を機能軸のサービスI/Fに契約化（配信/配信結果取得/結果通知）。実ベンダーアクセスはドライバーに閉じる。仕様精査を厚くした分、実装は圧縮。" },
    { name:"SMSモックドライバー", base:"export", person:1, group:"基盤", code:"L2", owner:"BE", deps:["SMS連携I/F定義"], asis:10.9, plan:2.0, tobe:0, status:"予定", progress:0, desc:"アクリート実サービス⇔エミュレーターをドライバーで差替（環境変数切替・成功/失敗/遅延の応答パターン）。SoftBank番号は開通後。" },
    { name:"SMSサービス・API(IF008)", base:"export", person:1, group:"基盤", code:"L3", owner:"BE", deps:["SMS連携I/F定義","SMSモックドライバー"], asis:13.1, plan:2.4, tobe:0, status:"予定", progress:0, desc:"IF008の利用機能（配信・配信結果取得・結果通知）を束ねるBEサービス＋GraphQL。103pから機能選定。" },
    { name:"文面テンプレ適用", base:"export", person:1, group:"適用", code:"L4", owner:"BE", deps:["SMSサービス・API(IF008)"], asis:8.7, plan:1.6, tobe:0, status:"予定", progress:0, desc:"業務イベント（配送遅延・ご不在）に既存文面テンプレを適用してSMS送信。既存送信経路を再利用（重複回避）。" },
    { name:"FE036 遅延SMS送信画面", base:"export", person:1, group:"適用", code:"L5", owner:"FE", deps:["SMSサービス・API(IF008)"], asis:10.9, plan:2.0, tobe:0, status:"予定", progress:0, desc:"遅延SMSの手動送信UI（対象選択→文面確認→送信→配信結果表示）。" },
    { name:"テスト設計・実施(SMS)", base:"export", person:1, group:"テスト", code:"QA2", owner:"両", deps:["FE036 遅延SMS送信画面"], asis:8.7, plan:1.6, tobe:0, status:"予定", progress:0, desc:"②未完実装系9.6hに対するテスト仕様設計＋テスト実施。暫定係数0.168＝PW-229実測。SMS E2Eは開通申請待ちのため後発（スコープ外）。" },
    { name:"PR・レビュー対応(SMS)", base:"export", person:1, group:"PR", code:"PR2", owner:"両", deps:[], asis:5.5, plan:1.0, tobe:0, status:"予定", progress:0, desc:"②未完実装系9.6hに対するPR本文作成＋レビュー指摘対応。暫定係数0.102＝PW-229実測。" },
    // ───────── ④ 帳票出力（PDF帳票＝配送指示書の生成基盤。非同期生成＋生成状況テーブル＋S3成果物）─────────
    // 画面出力: 生成リクエスト→生成状況テーブルに「生成中」追加→非同期生成→S3アップロード＋状況更新(完了/エラー)。クライアントはポーリングで状況確認し、完了はURLからDL・エラーは画面表示。
    // 取込出力: 出荷指示取込後、デポごとに生成→各デポ非同期→S3アップロード＋状況更新＋帳票作成通知テーブル更新。
    // ※仕様精査(帳票)は前倒し着手のため③仕様精査群の直後に配置済み。
    { name: "状況/通知テーブル", base: "report", person: 2, group: "基盤", code: "R0", owner: "DB", deps: [],                                    asis: 15.3, plan: 2.8, tobe: 0, status: "予定", progress: 0, desc: "生成状況テーブル（生成中/完了/エラー＋成果物URL）と帳票作成通知テーブルのスキーマ／seed。" },
    { name: "帳票生成エンジン", base: "report", person: 2, group: "基盤", code: "R1", owner: "BE", deps: [],                                    asis: 30.5, plan: 5.6, tobe: 0, status: "予定", progress: 0, desc: "PDF帳票（配送指示書）生成コア。テンプレート→データ差込→PDF化。" },
    { name: "非同期ジョブ基盤", base: "report", person: 2, group: "基盤", code: "R2", owner: "BE", deps: ["帳票生成エンジン", "状況/通知テーブル"], asis: 26.7, plan: 4.9, tobe: 0, status: "予定", progress: 0, desc: "非同期生成ジョブの実行枠＋生成状況更新（生成中→完了/エラー）＋S3への成果物アップロード。" },
    { name: "生成/状況API",     base: "report", person: 2, group: "基盤", code: "R3", owner: "BE", deps: ["非同期ジョブ基盤"],                   asis: 22.9, plan: 4.2, tobe: 0, status: "予定", progress: 0, desc: "生成リクエスト受付mutation＋状況確認query（ポーリング用・完了時はダウンロードURLを返却）。" },
    { name: "画面出力連携(FE)", base: "report", person: 2, group: "適用", code: "R4", owner: "FE", deps: ["生成/状況API"],                     asis: 19.1, plan: 3.5, tobe: 0, status: "予定", progress: 0, desc: "画面から生成リクエスト→定期ポーリングで状況確認→完了はURLからDL・エラーは画面表示（DLなし）。" },
    { name: "デポ別一括生成",   base: "report", person: 2, group: "適用", code: "R5", owner: "BE", deps: ["非同期ジョブ基盤", "出荷指示取込"],   asis: 26.7, plan: 4.9, tobe: 0, status: "予定", progress: 0, desc: "出荷指示取込後、デポごとに生成開始→各デポ非同期生成→S3アップロード→生成状況更新→帳票作成通知テーブル更新。" },
    { name: "帳票E2E",          base: "report", person: 2, group: "E2E", code: "R6", owner: "両", deps: ["画面出力連携(FE)", "デポ別一括生成"],   asis: 11.4, plan: 2.1, tobe: 0, status: "予定", progress: 0, desc: "画面出力（生成→ポーリング→DL）とデポ別一括生成（取込→デポ別→通知）をそれぞれ1本通すE2E。" },
    { name: "テスト設計・実施(帳票)", base: "report", person: 2, group: "テスト", code: "QA4", owner: "両", deps: ["帳票E2E"], asis: 24.0, plan: 4.4, tobe: 0, status: "予定", progress: 0, desc: "④未完実装系25.9hに対するテスト仕様設計＋テスト実施＋デグレチェック範囲確認。暫定係数0.168＝PW-229実測。デポ別並列生成の検証が主。" },
    { name: "PR・レビュー対応(帳票)", base: "report", person: 2, group: "PR", code: "PR4", owner: "両", deps: [], asis: 14.2, plan: 2.6, tobe: 0, status: "予定", progress: 0, desc: "④未完実装系25.9hに対するPR本文作成＋レビュー指摘対応。暫定係数0.102＝PW-229実測。" },
    // ───────── 予備工数（各人員の残キャパを確保。素の時間）─────────
    { name: "予備工数1",        base: "reserve", person: 1, group: "予備工数", code: "R1",  owner: "両", deps: [], asis: 9.6, plan: 9.6, tobe: 0, status: "予定", progress: 0, desc: "人員1（①認証認可）の残キャパ。手戻り・追加調査・レビュー対応・仕様確認の往復などの予備枠。" },
    { name: "予備工数2",        base: "reserve", person: 2, group: "予備工数", code: "R2",  owner: "両", deps: [], asis: 3.4, plan: 3.4, tobe: 1.75, status: "着手中", progress: 0.51, desc: "人員2（②SMS／③ファイル連携／④帳票出力）の残キャパ。手戻り・追加調査・レビュー対応・仕様確認の往復、横断タスク（先出し確認フォロー・G1合意往復×3基盤・KSL/IVR追跡・workitems2反映）などの予備枠。※うち3.0hはAIインプット整備として項目化。実消化=礼貴さんPR/チケット確認・レビュー対応・チケット修正手順書作成。" },
  ],
};

if (typeof module !== "undefined" && module.exports) module.exports = { SPRINT2_DATA };
