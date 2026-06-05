// 作業一覧の共通ロジック: ソート / グルーピング
// workitems.html などから <script src="task_logic.js"></script> で読込

// タスクまとめ用キー列 (これらが同じ行を1行に統合)
const TASK_GROUP_KEY_COLS = ["優先","ドメイン","画面ID","画面名","管理ID"];

// グルーピング対象外とする処理区分の部分一致キーワード (DL・印刷 行は単独行のまま)
const TASK_GROUP_EXCLUDE_PROC_KEYWORDS = ["DL", "印刷"];

// 並び順: 優先昇順 → 管理ID/IFID 昇順 (タスク優先度は 優先度・実施順 で管理する)
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
