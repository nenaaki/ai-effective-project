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

// 工数(h) は各タスク行に固定値で登録する方針 (旧: 係数ベースの自動計算は廃止)。
// SCREENS / IFS は workitems.js の各行 "工数(h)"、CHANGE / BACKEND も同様にデータ側で保持する。

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

  // 1. 優先順位はソースデータ(workitems.js)に直接記載する方針。ここでの動的調整は行わない。
  //    (マスタ画面=0 / 非マスタ 1・5・10・50 / IF=101 を WORKITEMS_DATA 側で直接指定済み)

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

  // SCREENS / IFS は同一オブジェクト参照を共有 (mutate するだけ) なので、
  // 全行走査用の結合配列は 1 回だけ作って使い回す。
  const ALL = [...SCREENS, ...IFS];

  // 5. 備考にスコープ判定を反映
  ALL.forEach(r=>{
    const s = scope(r);
    if (s) r.備考 = r.備考 ? `${s} / ${r.備考}` : s;
  });

  // 6. 工数(h): データ側の固定値をそのまま採用 (未指定は 0)
  ALL.forEach(r=>{ r["工数(h)"] = Number(r["工数(h)"]) || 0; });

  // 7. 備考が空欄の行 (両方ready) は「着手可能」と表示
  ALL.forEach(r=>{
    if (!r.備考) r.備考 = "着手可能";
  });

  // 8. 担当者・実施順の事前割当 (画面名単位)
  SCREENS.forEach(r=>{
    if (r.画面名 in TANTOU_MAP) r.担当者 = TANTOU_MAP[r.画面名];
    if (r.画面名 in JISSI_MAP)  r.実施順 = JISSI_MAP[r.画面名];
  });

  // 9. 状況 (進捗ステータス)。進捗率は PROGRESS_MAP で独立管理するため、ここでは触らない
  SCREENS.forEach(r=>{
    if (r.画面名 in STATUS_MAP) r.状況 = STATUS_MAP[r.画面名];
  });
  // IFは一律「実装不可」(進捗率 0)
  IFS.forEach(r=>{ r.状況 = "実装不可"; r.進捗率 = 0; });

  // 10. 状況 fallback: 空欄なら備考の内容を取り込む。進捗率は未設定なら 0 (PROGRESS_MAP が後で上書き)
  ALL.forEach(r=>{
    if (!r.状況) r.状況 = r.備考;
    if (r.進捗率 == null) r.進捗率 = 0;
  });

  // 11. PROGRESS_MAP (画面名 / IFID 別) があれば 進捗率 を個別上書き (0-100 % で指定 → 0-1 に変換)
  ALL.forEach(r=>{
    const k = r.画面名 || r.IFID || "";
    if (k && (k in PROGRESS_MAP)) r.進捗率 = PROGRESS_MAP[k] / 100;
  });

  // 12. 実工数(h): 画面単位の合計を最初の行に設定
  const _firstSeen = {};
  SCREENS.forEach(r=>{
    if ((r.画面名 in JISSI_KOUSU_H) && !_firstSeen[r.画面名]) {
      _firstSeen[r.画面名] = true;
      r["実工数(h)"] = JISSI_KOUSU_H[r.画面名];
    }
  });

  // 13. 変更対応グループ: 画面実装とは別枠の独立グループ。
  //   後発の仕様変更に対応するためのバッファ枠。工数は固定値。
  //   SCREENS には混ぜない (画面実装の集計・完了判定に含めないため、別配列で返す)。
  const CHANGE = (rawData.CHANGE_TASKS || []).map(c=>{
    // 「〇〇まとめ」系は資料整理グループ、それ以外は変更対応グループ (色・別枠扱いは共通)
    const isShiryo = (c.画面名 || "").includes("まとめ");
    const groupName = isShiryo ? "資料整理" : "変更対応";
    return {
    優先: c.優先 ?? 200,
    ドメイン: groupName,
    画面ID: "",
    画面名: c.画面名 || groupName,
    管理ID: "",
    処理区分: "",
    処理名: groupName,
    データモデル: "",
    画面項目定義: "",
    状況: "予定",
    進捗率: 0,
    "工数(h)": c["工数(h)"] ?? 46,
    "実工数(h)": "",
    担当者: null,
    実施順: null,
    };
  });

  // 14. バックエンドのみ生成グループ: 入力画面が無く未完(再実装要)のテーブルの
  //   バックエンド(スキーマ＋Service)生成枠。工数 = 仕様確認(h) + AI実装(h) の固定値。
  //   画面実装の集計・完了判定には含めない別グループ (SCREENS には混ぜず別配列で返す)。
  //   ガント/EVMの集計キー用に 画面名 = モデル名 を持たせる。
  //   優先1: グループ内のタスクは一律 優先1 (画面処理と同等の最優先で実施)。
  const BACKEND = (rawData.BACKEND_TASKS || []).map(t=>({
    優先: t.優先 ?? 1,
    ドメイン: "バックエンド生成",
    種別: t.種別 || "",
    モデル名: t.モデル名 || "",
    物理名: t.物理名 || "",
    画面名: t.モデル名 || "",
    項目数: t.項目数 ?? "",
    状況: t.状況 || "予定",
    進捗率: t.進捗率 != null ? t.進捗率 / 100 : 0,   // データ側は 0-100% で指定 → 0-1 に変換
    "工数(h)": t["工数(h)"] ?? 0,
    "実工数(h)": t["実工数(h)"] ?? "",
    担当者: t.担当者 ?? null,
    実施順: t.実施順 ?? null,
  }));

  return { SCREENS, IFS, CHANGE, BACKEND };
}
