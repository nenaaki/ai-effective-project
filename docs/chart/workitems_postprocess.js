// workitems データの後処理パイプライン
// workitems.html / aidd_report.html から
//   <script src="workitems_postprocess.js"></script>
// で読込
//
// 役割:
//   raw WORKITEMS_DATA を受け取り、SCREENS / IFS 配列に
//   優先順位調整・SHEET_ITEMS統合・スコープ判定・工数計算・状況/担当者割当 等を
//   一括で適用した結果を返す純粋関数。
//
// 使い方:
//   const { SCREENS, IFS } = postprocessWorkitems(WORKITEMS_DATA);

// === 工数計算用 定数・係数 ===
const EFFORT = {
  BASE_HOURS: 3.0,
  ITEM_WEIGHT: 0.005,
  IF_HOURS: 4,
  PROC:  { 閲覧: 0.7, 編集: 1.0, 新規登録: 1.3, DL印刷: 1.1 },
  SCOPE: { 両方: 1.0, BEのみ: 0.5 },
  ASSET: { 両方: 0.85, 片方: 0.95, なし: 1.0 }
};
// 状況→進捗率 (バーンダウン・EVMで使用)。状況からの初期値導出に使うが、
// 後処理で r.進捗率 を別フィールドとして付与するため、以降は r.進捗率 を直接参照する。
const STATUS_PROGRESS = { "実装完了": 1.0, "レビュー中": 0.7, "着手中": 0.5 };

function procFactor(k){
  if (k.indexOf("閲覧") >= 0) return EFFORT.PROC.閲覧;
  if (k.indexOf("新規登録") >= 0) return EFFORT.PROC.新規登録;
  if (k.indexOf("編集") >= 0) return EFFORT.PROC.編集;
  if (k.indexOf("DL") >= 0 || k.indexOf("印刷") >= 0) return EFFORT.PROC.DL印刷;
  return EFFORT.PROC.編集;
}
function assetFactor(hasMock, hasSheet){
  if (hasMock && hasSheet) return EFFORT.ASSET.両方;
  if (hasMock || hasSheet) return EFFORT.ASSET.片方;
  return EFFORT.ASSET.なし;
}

// スコープ判定:
//   IF行 = バックエンドのみ
//   DM✅完成 + UI ready → ""
//   DM✅完成 + UI not ready → バックエンドのみ
//   DM作業中 (🔄) → 待機中 (タイムライン表示対象)
//   それ以外 → 実装不可
function scope(r){
  if (r.IFID) return "バックエンドのみ";
  const dm = r.データモデル || "";
  const ui = r.画面項目定義 || "";
  const beReady = dm.indexOf("✅") >= 0;
  const beWip   = dm.indexOf("🔄") >= 0;
  const feAnyReady = ui.indexOf("📐") >= 0 || ui.indexOf("✅") >= 0;
  if (beReady && feAnyReady) return "";
  if (beReady && !feAnyReady) return "バックエンドのみ";
  if (beWip) return "待機中";
  return "実装不可";
}

function calcEffort(r, PROC_ITEMS, SCREEN_PROC_ITEMS){
  const bk = r.備考 || "";
  if (r.IFID) return EFFORT.IF_HOURS;
  if (bk.indexOf("実装不可") >= 0 && !r.画面項目定義) return 0;
  const ui = r.画面項目定義 || "";
  const m = ui.match(/\((\d+)項目\)/);
  let items = m ? parseInt(m[1], 10) : 0;
  if (!items) {
    const key = `${r.画面名}|${r.処理名}`;
    items = SCREEN_PROC_ITEMS[key] ?? PROC_ITEMS[r.処理名] ?? 0;
  }
  const kC = procFactor(r.処理区分 || "");
  const sC = bk.indexOf("バックエンドのみ") >= 0 ? EFFORT.SCOPE.BEのみ : EFFORT.SCOPE.両方;
  const aC = assetFactor(ui.indexOf("📐") >= 0, ui.indexOf("✅") >= 0);
  const v = (1 + items * EFFORT.ITEM_WEIGHT) * kC * sC * aC * EFFORT.BASE_HOURS;
  return Math.round(v * 10) / 10;
}

// === メインパイプライン (純粋関数) ===
// rawData を mutate しない。新しい SCREENS / IFS 配列を返す。
function postprocessWorkitems(rawData){
  const {
    SHEET_ITEMS = {},
    PROC_ITEMS = {},
    SCREEN_PROC_ITEMS = {},
    TANTOU_MAP = {},
    JISSI_MAP = {},
    STATUS_MAP = {},
    PROGRESS_MAP = {},
    JISSI_KOUSU_H = {},
  } = rawData;
  const SCREENS = rawData.SCREENS.map(r => ({ ...r }));
  const IFS     = rawData.IFS.map(r => ({ ...r }));

  // 1. 優先順位調整: マスタ画面=0, 非マスタの 0→1 / 1→2
  SCREENS.forEach(r=>{
    const isMaster = (r.画面名||"").indexOf("マスタ") >= 0;
    if (isMaster) r.優先 = 0;
    else if (r.優先 === 0) r.優先 = 1;
    else if (r.優先 === 1) r.優先 = 2;
  });

  // 2. SHEET_ITEMS 統合 (画面名一致行に ✅シートあり (X項目) を付与)
  SCREENS.forEach(r=>{
    if (!(r.画面名 in SHEET_ITEMS)) return;
    const itemCount = SHEET_ITEMS[r.画面名];
    const sheetTag = `✅シートあり (${itemCount}項目)`;
    const ui = r.画面項目定義 || "";
    if (ui.indexOf("✅") >= 0) return;
    if (ui === "" || ui.indexOf("🔄") >= 0) {
      r.画面項目定義 = sheetTag;
    } else {
      r.画面項目定義 = `${ui} / ${sheetTag}`;
    }
  });

  // 3. 全画面モック完了: 📐 が無い行に 📐モックあり (X項目) を付与 / 🔄作成予定 は削除
  SCREENS.forEach(r=>{
    let ui = r.画面項目定義 || "";
    ui = ui.replace(/🔄作成予定\s*\/\s*/g, "")
           .replace(/\s*\/\s*🔄作成予定/g, "")
           .replace(/^🔄作成予定$/g, "");
    if (ui.indexOf("📐") === -1) {
      const key = `${r.画面名}|${r.処理名}`;
      const items = (key in SCREEN_PROC_ITEMS) ? SCREEN_PROC_ITEMS[key]
                  : (r.処理名 in PROC_ITEMS ? PROC_ITEMS[r.処理名] : null);
      const mockTag = items != null ? `📐モックあり (${items}項目)` : "📐モックあり";
      ui = ui ? `${mockTag} / ${ui}` : mockTag;
    }
    r.画面項目定義 = ui;
  });

  // 4. 📐モックあり (A項目) / ✅シートあり (B項目) の併記行を、シート側項目数の単一表示に集約
  SCREENS.forEach(r=>{
    const ui = r.画面項目定義 || "";
    const mockM  = ui.match(/📐モックあり\s*\((\d+)項目\)/);
    const sheetM = ui.match(/✅シートあり\s*\((\d+)項目\)/);
    if (mockM && sheetM) r.画面項目定義 = `📐モックあり (${sheetM[1]}項目)`;
  });

  // 5. 備考にスコープ判定を反映
  [...SCREENS, ...IFS].forEach(r=>{
    const s = scope(r);
    if (s) r.備考 = r.備考 ? `${s} / ${r.備考}` : s;
  });

  // 6. 工数(h) 計算
  [...SCREENS, ...IFS].forEach(r=>{ r["工数(h)"] = calcEffort(r, PROC_ITEMS, SCREEN_PROC_ITEMS); });

  // 7. 備考が空欄の行 (両方ready) は「着手可能」と表示
  [...SCREENS, ...IFS].forEach(r=>{
    if (!r.備考) r.備考 = "着手可能";
  });

  // 8. 担当者・実施順の事前割当 (画面名単位)
  SCREENS.forEach(r=>{
    if (r.画面名 in TANTOU_MAP) r.担当者 = TANTOU_MAP[r.画面名];
    if (r.画面名 in JISSI_MAP)  r.実施順 = JISSI_MAP[r.画面名];
  });

  // 9. 状況 (進捗ステータス) + 進捗率 (別フィールド)
  //    r.状況: テキスト / r.進捗率: 0-1 数値 — 後で個別に編集できるよう分離管理
  SCREENS.forEach(r=>{
    if (r.画面名 in STATUS_MAP) {
      r.状況 = STATUS_MAP[r.画面名];
      r.進捗率 = STATUS_PROGRESS[r.状況] ?? 0;
    }
  });
  // IFは一律「実装不可」(進捗率 0)
  IFS.forEach(r=>{ r.状況 = "実装不可"; r.進捗率 = 0; });

  // 10. 状況 fallback: 空欄なら備考の内容を取り込む。進捗率も未設定なら 状況から推定。
  [...SCREENS, ...IFS].forEach(r=>{
    if (!r.状況) r.状況 = r.備考;
    if (r.進捗率 == null) r.進捗率 = STATUS_PROGRESS[r.状況] ?? 0;
  });

  // 11. PROGRESS_MAP (画面名 / IFID 別) があれば 進捗率 を個別上書き (0-100 % で指定 → 0-1 に変換)
  [...SCREENS, ...IFS].forEach(r=>{
    const k = r.画面名 || r.IFID || "";
    if (k && (k in PROGRESS_MAP)) r.進捗率 = PROGRESS_MAP[k] / 100;
  });

  // 11. 実工数(h): 画面単位の合計を最初の行に設定
  const _firstSeen = {};
  SCREENS.forEach(r=>{
    if ((r.画面名 in JISSI_KOUSU_H) && !_firstSeen[r.画面名]) {
      _firstSeen[r.画面名] = true;
      r["実工数(h)"] = JISSI_KOUSU_H[r.画面名];
    }
  });

  return { SCREENS, IFS };
}
