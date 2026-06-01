// 作業一覧の共通ロジック: スコア計算 / ソート / グルーピング
// workitems.html などから <script src="task_logic.js"></script> で読込

// スコア加算ウェイト (備考に「実装不可」を含む画面行は 0 固定)
const TASK_SCORE_WEIGHTS = {
  DM_DONE:  10,   // データモデル ✅ 完了
  DM_WIP:    5,   // データモデル 🔄 作業中
  UI_MOCK:   7,   // 画面項目定義 📐 モックあり
  UI_SHEET:  3,   // 画面項目定義 ✅ シートあり
};

// タスクまとめ用キー列 (これらが同じ行を1行に統合)
const TASK_GROUP_KEY_COLS = ["優先","ドメイン","画面ID","画面名","管理ID"];

// グルーピング対象外とする処理区分の部分一致キーワード (DL・印刷 行は単独行のまま)
const TASK_GROUP_EXCLUDE_PROC_KEYWORDS = ["DL", "印刷"];

function score(r){
  // 実装不可 (画面行で DM未完成) は最下位扱い
  if (!r.IFID && (r.備考||"").indexOf("実装不可") >= 0) return 0;
  let s = 0;
  const dm = r.データモデル || "";
  if (dm.indexOf("✅") >= 0) s += TASK_SCORE_WEIGHTS.DM_DONE;
  else if (dm.indexOf("🔄") >= 0) s += TASK_SCORE_WEIGHTS.DM_WIP;
  const ui = r.画面項目定義 || "";
  if (ui.indexOf("📐") >= 0) s += TASK_SCORE_WEIGHTS.UI_MOCK;
  if (ui.indexOf("✅") >= 0) s += TASK_SCORE_WEIGHTS.UI_SHEET;
  return s;
}

function sortByScore(a,b){ return (score(b)-score(a)) || (a.優先-b.優先); }
function sortDefault(a,b){
  return (a.優先-b.優先) || String(a.管理ID||a.IFID||"").localeCompare(String(b.管理ID||b.IFID||""));
}

// タスクをまとめる: ソート後、優先〜管理ID が同じ行を1行に統合
//   データモデル/画面項目定義/担当者/実施順/備考 = 先頭行採用
//   工数・実工数 = 合計 / 処理区分・処理名 = 改行結合
//   例外: DL・印刷 の行は結合せず単独行のまま
function groupTasks(data){
  const isExcluded = r => {
    const k = r.処理区分 || "";
    return TASK_GROUP_EXCLUDE_PROC_KEYWORDS.some(p => k.indexOf(p) >= 0);
  };
  const groups = new Map();
  const order = [];
  data.forEach((r, i)=>{
    const key = isExcluded(r) ? `__excl__${i}` : TASK_GROUP_KEY_COLS.map(c=>r[c]).join("|");
    if (!groups.has(key)) { groups.set(key, []); order.push(key); }
    groups.get(key).push(r);
  });
  return order.map(key=>{
    const rows = groups.get(key);
    if (rows.length === 1) return { ...rows[0] };
    const merged = { ...rows[0] };
    merged.処理区分 = rows.map(r=>r.処理区分).join("\n");
    merged.処理名   = rows.map(r=>r.処理名).join("\n");
    merged["工数(h)"] = Math.round(rows.reduce((a,r)=>a+(parseFloat(r["工数(h)"])||0),0)*10)/10;
    const eff = rows.reduce((a,r)=>a+(parseFloat(r["実工数(h)"])||0),0);
    merged["実工数(h)"] = eff > 0 ? Math.round(eff*10)/10 : "";
    return merged;
  });
}
