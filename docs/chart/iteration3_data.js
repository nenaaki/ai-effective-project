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
    { key: "sched",   id: "③", name: "定期実行・監視(バッチ)",    color: "#0891b2" },
    { key: "audit",   id: "④", name: "監査ログ・操作履歴",        color: "#2563eb" },
    { key: "limit",   id: "⑤", name: "タイムアウト・上限設計",    color: "#db2777" },
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

    // ───────── ③ 定期実行・監視基盤（イテレーション2のバッチ起動基盤を昇格）─────────
    { name: "仕様精査(定期実行・監視)～PM合意", base: "sched", person: 2, group: "仕様精査", code: "SP3", owner: "両", deps: [], asis: 21.6, plan: 14.4, tobe: 0, status: "予定", progress: 0, desc: "対象ジョブの棚卸し（取込・送信・帳票一括・集計）と、スケジュール定義・リトライ・多重起動・監視/通報の方針整理〜PM合意。" },
    { name: "スケジューラ基盤(定義・起動)", base: "sched", person: 2, group: "基盤", code: "S1", owner: "BE", deps: ["仕様精査(定期実行・監視)～PM合意"], asis: 26.7, plan: 4.9, tobe: 0, status: "予定", progress: 0, desc: "「ジョブ定義＝データ」でスケジュール（cron式・有効/無効・引数）を管理し、時刻起動する基盤。イテレーション2のバッチ起動基盤を汎用化。" },
    { name: "ジョブ実行履歴・状態管理", base: "sched", person: 2, group: "基盤", code: "S2", owner: "DB", deps: ["スケジューラ基盤(定義・起動)"], asis: 19.1, plan: 3.5, tobe: 0, status: "予定", progress: 0, desc: "実行履歴テーブル（開始/終了・結果・件数・エラー内容）。帳票の生成状況テーブルと同じ「状態を持つ」構造をジョブへ適用。" },
    { name: "リトライ・多重起動抑止", base: "sched", person: 2, group: "基盤", code: "S3", owner: "BE", deps: ["ジョブ実行履歴・状態管理"], asis: 15.3, plan: 2.8, tobe: 0, status: "予定", progress: 0, desc: "失敗時の再実行ポリシー（回数・間隔）と、同一ジョブの同時実行防止（実行中フラグ）。リトライ回数の上限は⑤の上限設計と揃える。" },
    { name: "失敗検知・アラート(通知連携)", base: "sched", person: 2, group: "基盤", code: "S4", owner: "BE", deps: ["リトライ・多重起動抑止"], asis: 15.3, plan: 2.8, tobe: 0, status: "予定", progress: 0, desc: "失敗・未実行・遅延を検知して②通知基盤へ通報（運用担当へアプリ内通知＋メール）。監視を人の目視に頼らない状態にする。" },
    { name: "ジョブ管理画面(一覧・手動実行・履歴)", base: "sched", person: 2, group: "適用", code: "S5", owner: "FE", deps: ["ジョブ実行履歴・状態管理"], asis: 26.7, plan: 4.9, tobe: 0, status: "予定", progress: 0, desc: "ジョブ一覧・次回実行予定・手動実行/停止・実行履歴の閲覧。運用が自分で状況を見て再実行できるようにする。" },
    { name: "既存バッチ移行(取込・送信)", base: "sched", person: 2, group: "適用", code: "S6", owner: "BE", deps: ["スケジューラ基盤(定義・起動)"], asis: 19.1, plan: 3.5, tobe: 0, status: "予定", progress: 0, desc: "イテレーション2で作った出荷指示取込・出荷実績送信のバッチを新スケジューラ配下へ移行（定義データ化）。" },
    { name: "定期実行E2E", base: "sched", person: 2, group: "E2E", code: "S7", owner: "両", deps: ["ジョブ管理画面(一覧・手動実行・履歴)", "既存バッチ移行(取込・送信)", "失敗検知・アラート(通知連携)"], asis: 11.4, plan: 2.1, tobe: 0, status: "予定", progress: 0, desc: "時刻起動→実行→履歴記録→失敗時アラートまで通す。多重起動・リトライの挙動も確認。" },
    { name: "テスト設計・実施(定期実行・監視)", base: "sched", person: 2, group: "テスト", code: "QA3", owner: "両", deps: ["定期実行E2E"], asis: 22.4, plan: 4.1, tobe: 0, status: "予定", progress: 0, desc: "③実装系24.5hに対するテスト仕様設計＋テスト実施。係数0.168。" },
    { name: "PR・レビュー対応(定期実行・監視)", base: "sched", person: 2, group: "PR", code: "PR3", owner: "両", deps: [], asis: 13.6, plan: 2.5, tobe: 0, status: "予定", progress: 0, desc: "③実装系24.5hに対するPR本文作成＋レビュー指摘対応。係数0.102。" },

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

    // ───────── ⑤ タイムアウト・上限設計（仕様精査は人員2、実装以降はレーン均衡のため人員1）─────────
    { name: "仕様精査(タイムアウト・上限)～PM合意", base: "limit", person: 2, group: "仕様精査", code: "SP5", owner: "両", deps: [], asis: 21.6, plan: 14.4, tobe: 0, status: "予定", progress: 0, desc: "「どこまで待つか・どこまで受け付けるか」を数字で決めて合意する。セッション／API／DBのタイムアウト値、一覧・出力の件数上限、ファイルサイズ上限、同時実行数、リトライ回数の上限。全画面・全APIに影響するため先に確定させる。" },
    { name: "セッションタイムアウト(FE/BE)", base: "limit", person: 1, group: "基盤", code: "T1", owner: "両", deps: ["仕様精査(タイムアウト・上限)～PM合意"], asis: 15.3, plan: 2.8, tobe: 0, status: "予定", progress: 0, desc: "無操作タイムアウト・トークン失効時の再認証導線。イテレーション2の認証・認可（Cognito/JWT）の上に載せる。" },
    { name: "API/DBタイムアウト・リトライ上限", base: "limit", person: 1, group: "基盤", code: "T2", owner: "BE", deps: ["仕様精査(タイムアウト・上限)～PM合意"], asis: 15.3, plan: 2.8, tobe: 0, status: "予定", progress: 0, desc: "API・外部連携・DBの各タイムアウト値と再試行回数の上限を共通実装。上限を超える重い処理は非同期（①）へ寄せる判断基準も明文化する。" },
    { name: "一覧・検索の件数上限/ページング", base: "limit", person: 1, group: "基盤", code: "T3", owner: "BE", deps: ["API/DBタイムアウト・リトライ上限"], asis: 22.9, plan: 4.2, tobe: 0, status: "予定", progress: 0, desc: "全一覧・検索APIに取得件数上限とページングを共通適用。データ型駆動で一括適用し、無制限の全件取得を構造的に作れないようにする。" },
    { name: "出力件数・ファイルサイズ上限", base: "limit", person: 1, group: "適用", code: "T4", owner: "両", deps: ["一覧・検索の件数上限/ページング"], asis: 19.1, plan: 3.5, tobe: 0, status: "予定", progress: 0, desc: "CSV／帳票の出力件数上限、取込ファイルのサイズ・行数上限、同時実行数の上限。①CSV出力・③定期実行の入口に同じ上限を効かせる。" },
    { name: "上限超過時UI・エラー共通化", base: "limit", person: 1, group: "適用", code: "T5", owner: "FE", deps: ["一覧・検索の件数上限/ページング"], asis: 15.3, plan: 2.8, tobe: 0, status: "予定", progress: 0, desc: "上限に当たった時の共通メッセージ（「◯件を超えました。条件を絞ってください」）と、タイムアウト時の再試行導線。画面ごとの独自文言を作らない。" },
    { name: "テスト設計・実施(タイムアウト・上限)", base: "limit", person: 1, group: "テスト", code: "QA5", owner: "両", deps: ["出力件数・ファイルサイズ上限", "上限超過時UI・エラー共通化"], asis: 14.7, plan: 2.7, tobe: 0, status: "予定", progress: 0, desc: "⑤実装系16.1hに対するテスト仕様設計＋テスト実施（上限ちょうど／上限超過／タイムアウトの境界値テストを含む）。係数0.168。" },
    { name: "PR・レビュー対応(タイムアウト・上限)", base: "limit", person: 1, group: "PR", code: "PR5", owner: "両", deps: [], asis: 8.7, plan: 1.6, tobe: 0, status: "予定", progress: 0, desc: "⑤実装系16.1hに対するPR本文作成＋レビュー指摘対応。係数0.102。" },

    // ───────── その他工数（イテレーション2の反省を反映した先取り枠）─────────
    { name: "AIエージェント不備 調査・改修枠①", base: "other", person: 1, group: "その他工数", code: "O1", owner: "両", deps: [], asis: 10.0, plan: 10.0, tobe: 0, status: "予定", progress: 0, desc: "イテレーション2の課題対応。エージェントの不備の調査・改修は毎回発生するため、実績（デバッグ／設計エージェント計28h）を踏まえ人員1分を予め見積もる。" },
    { name: "AIエージェント不備 調査・改修枠②", base: "other", person: 2, group: "その他工数", code: "O2", owner: "両", deps: [], asis: 10.0, plan: 10.0, tobe: 0, status: "予定", progress: 0, desc: "同上・人員2分。イテレーション2では見積外だったため実績が計画超過として現れた。今回は枠として明示する。" },

    // ───────── 予備工数 ─────────
    { name: "予備工数1", base: "reserve", person: 1, group: "予備工数", code: "RS1", owner: "両", deps: [], asis: 10.0, plan: 10.0, tobe: 0, status: "予定", progress: 0, desc: "人員1の予備。仕様変更・割り込み・追加調査の吸収枠。" },
    { name: "予備工数2", base: "reserve", person: 2, group: "予備工数", code: "RS2", owner: "両", deps: [], asis: 10.0, plan: 10.0, tobe: 0, status: "予定", progress: 0, desc: "人員2の予備。仕様変更・割り込み・追加調査の吸収枠。" },
    { name: "AI改善工数①", base: "reserve", person: 1, group: "予備工数", code: "AI1", owner: "両", deps: [], asis: 20.0, plan: 20.0, tobe: 0, status: "予定", progress: 0, desc: "人員1：AI駆動そのものを良くするための枠。エージェント／スキル・プロンプト・インプット資料の改善、オーケストレーションの見直しなど。イテレーション2で計画外に発生した分を、今回は最初から枠として確保する。" },
    { name: "AI改善工数②", base: "reserve", person: 2, group: "予備工数", code: "AI2", owner: "両", deps: [], asis: 20.0, plan: 20.0, tobe: 0, status: "予定", progress: 0, desc: "人員2：同上。AI駆動の改善（エージェント整備・spec運用・レビュープロセス）に充てる枠。" },
  ],
};

if (typeof module !== "undefined" && module.exports) module.exports = { ITERATION3_DATA };
