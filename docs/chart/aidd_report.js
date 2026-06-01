// 開発工数比較のシナリオ定義 / タブ構成 / 合計タブ生成
// aidd_report.html から <script src="aidd_report.js"></script> で読込

  // ====== シナリオ定義 (内部に全保持) ======
  const scenarios = {
    "depot-master": {
      tabLabel: "デポマスタ一覧・登録更新",
      title: "デポマスタ画面（一覧・登録・更新・削除） 開発工数比較 (AsIs / ToBe)",
      lede: "AIDD 試行 #1 で実装した「デポマスタ」（FE021 / PW-120）の開発工数比較。<strong>一覧表示 / 新規登録 / 更新 / 削除（論理削除）を 1 画面で完結</strong>するマスタ画面（商品マスタは一覧と登録更新が別画面・別タブだが、デポマスタは統合）。デポ + エリア + 制限 + 案内 の <strong>4 テーブル構成</strong>、ドロワー 2 階層、3 タブ（エリア情報 / 案内 / 制限）、「曜日 × 時間帯」マトリクス入力を含む複雑なマスタ画面。<strong>ToBe は実測値</strong>（セッションログから工程別に集計、議論時間込み）。AsIs は商品マスタ一覧+登録の値を規模・複雑度で按分した推定値（後で調整予定）。動作確認はこれから実施するため、結果が出次第追記する。",
      issueLink: {
        href: "problem_ex_1.html",
        tag: "EX-1 / 本試行で発見",
        title: "要件不明確時のフローが整理されていない",
        desc: "業務判断が不明、または要件不足で確認したいことが発生した場合の導線が定義されていない。停止するか／不明点以外の実装を進めるか、確認チャネル、不明点の管理、回答の組み込み方の整理が必要。",
      },
      tasks: [
        { key: "data-design", label: "データモデル設計 (4テーブル新規)",         color: "var(--c-data-design)", loc: null, asis: 10,  tobe: 0.15, tobeEng: 0,    agents: ["DBアーキテクトAI"] },
        { key: "data-impl",   label: "データモデル実装 (Prisma + migration)",   color: "var(--c-data-impl)",   loc: 178,  asis: 5,   tobe: 0.15, tobeEng: 0,    agents: ["DBアーキテクトAI"] },
        { key: "api-impl",    label: "API設計・実装 (4モジュール + DataLoader)", color: "var(--c-api-impl)",    loc: 1092, asis: 28,  tobe: 0.92, tobeEng: 0,    agents: ["バックエンドAI"] },
        { key: "api-test",    label: "API単体テスト (api-implに内包)",          color: "var(--c-api-test)",    loc: 406,  asis: 14,  tobe: 0,    tobeEng: 0,    agents: ["バックエンドAI"] },
        { key: "api-review",  label: "APIレビュー (エンジニア)",                color: "var(--c-eng-review)",  loc: null, asis: 3,   tobe: 3,    tobeEng: 3,    agents: ["バックエンドレビュワーAI", "エンジニア"] },
        { key: "ux",          label: "UX設計・spec生成・brief議論",             color: "var(--c-ux)",          loc: null, asis: 7,   tobe: 4.95, tobeEng: 2.0,  agents: ["プランナーAI", "エンジニア"] },
        { key: "fe-design",   label: "フロントエンド設計 (fe-implに内包)",       color: "var(--c-fe-design)",   loc: null, asis: 10,  tobe: 0,    tobeEng: 0,    agents: ["フロントエンドAI"] },
        { key: "fe-impl",     label: "フロントエンド実装 (タブ・マトリクス)",      color: "var(--c-fe-impl)",     loc: 2818, asis: 32,  tobe: 1.19, tobeEng: 0,    agents: ["フロントエンドAI"] },
        { key: "fe-test",     label: "フロントエンド単体テスト (実装なし)",       color: "var(--c-fe-test)",     loc: null, asis: 0,   tobe: 0,    tobeEng: 0,    agents: ["—"] },
        { key: "fe-review",   label: "フロントエンドレビュー (エンジニア)",       color: "var(--c-eng-review)",  loc: null, asis: 3,   tobe: 3,    tobeEng: 3,    agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        { key: "verify",      label: "動作確認 (BE + FE)",                       color: "var(--c-verify)",      loc: null, asis: 10,  tobe: 10,   tobeEng: 10,   agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
        { key: "trial-review",          label: "[試行特有] 試行総括・課題抽出",         color: "#9333ea", loc: null, asis: 0, tobe: 2.69, tobeEng: 1.5,  agents: ["エンジニア (人間との議論)"] },
        { key: "structure-improvement", label: "[試行特有] 構造改修 (brief/planner)",  color: "#7e22ce", loc: null, asis: 0, tobe: 1.33, tobeEng: 0.5,  agents: ["エンジニア (ルール整備)"] },
      ],
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                                   color: "#ef4444", asis: 8,  tobe: 0 },
        { key: "logic",  label: "ロジックバグ (リレーション・楽観的ロック・マトリクス)", color: "#f59e0b", asis: 14, tobe: 4 },
        { key: "edge",   label: "エッジケース漏れ (曜日×時間帯境界・空エリア等)",      color: "#8b5cf6", asis: 10, tobe: 5 },
        { key: "spec",   label: "仕様解釈ミス (業務ルール・命名規則)",                color: "#ec4899", asis: 5,  tobe: 8 },
        { key: "ui",     label: "UI 細部の不整合 (タブ切替・ドロワー階層)",          color: "#06b6d4", asis: 10, tobe: 4 },
      ],
      bugRateNote: "※ デポマスタ 約 4.5 KLOC × 商品マスタ参考レート（人力 12/KLOC、AI 5/KLOC）+ 複雑度プレミアム。4 テーブル間のリレーション・「曜日×時間帯」マトリクス・楽観的ロックなど業務ロジックが厚く、AI でも「<strong>仕様解釈ミス</strong>」「エッジケース漏れ」が残りやすい。デポコード命名規則・エリア重複ルールを brief / spec で明示するとさらに精度が上がる。",
      contextNotes: [
        "対象画面: デポマスタ（FE021 / PW-120）。一覧 + ドロワー 2 階層（depot → area）+ 3 タブ（エリア情報 / 案内 / 制限）+「曜日×時間帯」マトリクス入力。4 テーブル構成（m_depot + m_area + m_area_reservation_limit + m_area_guide）、楽観的ロック、DataLoader 必須。",
        "<strong>ToBe は実測値</strong>: セッションログ（JSONL）から工程別に集計。期間 2026-05-18 〜 2026-05-22。<strong>議論時間込み</strong>（人間がドキュメントを用意したり指示を出す時間も計上）。集計詳細は同階層 <code>depot-master-data.md</code> 参照。",
        "<strong>5/19 の 3.72h はほぼ brief / spec 議論</strong>: 第 1 試行ゆえの学習コスト多め。後続の PW-121 以降では UX 議論時間は下がる見込み。",
        "<strong>試行特有の独立工程 4.02h</strong>: 試行総括・課題抽出（2.69h）+ TDD 構造改修（1.33h）。商品マスタ実装には発生しない試行第 1 号固有の作業。次の画面では構造改修分は発生しない見込み（試行総括だけ残る）。",
        "AsIs は商品マスタ一覧+登録（合計 60.3h）を以下の係数で按分: データモデル ×5、API ×4、UX ×1.1、フロント ×2.5、レビュー・動作確認 ×1.5。複雑度プレミアム（3 タブ・2 階層・マトリクス）が +20-30% 想定。<strong>後で水野さんの判断で調整予定。</strong>",
        "削減率は <strong>122h → 27.4h で約 78%</strong>。<strong>レビュー・動作確認はエンジニアが実施する時間で AsIs と変わらない</strong>（api-review 3h / fe-review 3h / verify 10h は AI が書いたコードを人が同じ時間レビューする想定）。AI 削減が効くのは「実装」「設計」「テスト生成」工程で、そこは 90% 以上削減。商品マスタ (70% 前後) より高いのは規模・複雑度が大きく AI のレバレッジが効いた結果。",
        "改善余地: 5/19 の議論時間（3.72h）を圧縮するため、brief テンプレに「テスト観点 §7」「データモデル設計の段階的レビュー」を組み込み済（PW-121 以降適用）。",
      ],
    },
    "user-master": {
      tabLabel: "ユーザマスタ",
      title: "ユーザマスタ画面（一覧・登録・更新・削除・パスワード変更） 開発工数比較 (AsIs / ToBe)",
      lede: "AIDD 試行 #2 で実装した「ユーザマスタ」（FE020 / PW-123）の開発工数比較。<strong>一覧 + ドロワー（詳細・新規）+ パスワード変更モーダル</strong>を 1 画面で完結。<strong>m_user 拡張 + m_permission_group 新規 + m_user_shipper / m_user_depot 中間テーブル 2 本</strong>の N:N リレーション・楽観的ロック・DataLoader 必須。<strong>ToBe は実測値</strong>（セッションログから工程別に集計、議論時間込み）。AsIs は商品マスタ参考レートで規模・複雑度を按分した推定値。",
      issueLink: {
        href: "problem_ex_2.html",
        tag: "EX-2 / 本試行で発見",
        title: "モックと同一の画面が作られないケースがある",
        desc: "skeleton 抽出で階層は一致するが、grid 配置・密度・横並び/縦並び のレイアウト情報が落ちる。視覚比較を画像で行えず静的解析に代替しているため検出されない。",
      },
      tasks: [
        { key: "data-design", label: "データモデル設計 (m_user拡張 + 3テーブル新規)", color: "var(--c-data-design)", loc: null, asis: 7,   tobe: 0.10, tobeEng: 0,    agents: ["DBアーキテクトAI"] },
        { key: "data-impl",   label: "データモデル実装 (Prisma + migration)",      color: "var(--c-data-impl)",   loc: 178,  asis: 4,   tobe: 0.10, tobeEng: 0,    agents: ["DBアーキテクトAI"] },
        { key: "api-impl",    label: "API設計・実装 (m-permission-group新規 + m-user拡張 + 変更パスワードMutation)", color: "var(--c-api-impl)", loc: 900, asis: 23,  tobe: 0.80, tobeEng: 0,    agents: ["バックエンドAI"] },
        { key: "api-test",    label: "API単体テスト (api-implに内包)",            color: "var(--c-api-test)",    loc: 260,  asis: 10,  tobe: 0,    tobeEng: 0,    agents: ["バックエンドAI"] },
        { key: "api-review",  label: "APIレビュー (エンジニア)",                  color: "var(--c-eng-review)",  loc: null, asis: 2.5, tobe: 2.5,  tobeEng: 2.5,  agents: ["バックエンドレビュワーAI", "エンジニア"] },
        { key: "ux",          label: "UX設計・spec再検証・brief議論",             color: "var(--c-ux)",          loc: null, asis: 6,   tobe: 2.50, tobeEng: 1.50, agents: ["プランナーAI", "エンジニア"] },
        { key: "fe-design",   label: "フロントエンド設計 (fe-implに内包)",         color: "var(--c-fe-design)",   loc: null, asis: 8,   tobe: 0,    tobeEng: 0,    agents: ["フロントエンドAI"] },
        { key: "fe-impl",     label: "フロントエンド実装 (Detail/Create分離・MultiLevelDrawer・パスワード変更モーダル)", color: "var(--c-fe-impl)", loc: 2052, asis: 24,  tobe: 1.00, tobeEng: 0,    agents: ["フロントエンドAI"] },
        { key: "fe-test",     label: "フロントエンド単体テスト (実装なし)",         color: "var(--c-fe-test)",     loc: null, asis: 0,   tobe: 0,    tobeEng: 0,    agents: ["—"] },
        { key: "fe-review",   label: "フロントエンドレビュー (エンジニア)",         color: "var(--c-eng-review)",  loc: null, asis: 3,   tobe: 3,    tobeEng: 3,    agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        { key: "verify",      label: "動作確認 (BE + FE + mockup視覚比較)",         color: "var(--c-verify)",      loc: null, asis: 8,   tobe: 8,    tobeEng: 8,    agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
        { key: "trial-review",          label: "[試行特有] 試行総括・課題抽出",          color: "#9333ea", loc: null, asis: 0, tobe: 2.00, tobeEng: 1.50, agents: ["エンジニア (人間との議論)"] },
        { key: "structure-improvement", label: "[試行特有] 構造改修 (skip方針・JwtAuthGuard)", color: "#7e22ce", loc: null, asis: 0, tobe: 0.50, tobeEng: 0.30, agents: ["エンジニア (ルール整備)"] },
      ],
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                                       color: "#ef4444", asis: 6,  tobe: 0 },
        { key: "logic",  label: "ロジックバグ (N:N更新・楽観的ロック・パスワードハッシュ)", color: "#f59e0b", asis: 10, tobe: 3 },
        { key: "edge",   label: "エッジケース漏れ (shipperIds 空配列・FORBIDDEN分岐等)",   color: "#8b5cf6", asis: 8,  tobe: 4 },
        { key: "spec",   label: "仕様解釈ミス (値反転 status / suspensionDiv)",           color: "#ec4899", asis: 4,  tobe: 6 },
        { key: "ui",     label: "UI 細部の不整合 (ドロワー幅・3セクション grid)",           color: "#06b6d4", asis: 8,  tobe: 5 },
      ],
      bugRateNote: "※ ユーザマスタ 約 3.2 KLOC × 商品マスタ参考レート（人力 12/KLOC、AI 5/KLOC）。中間テーブル 2 本 (N:N) + 値反転マッピング (suspensionDiv ↔ status) + パスワード変更 (bcrypt + version 楽観的ロック) が業務ロジック上の重点ポイント。AI でも値反転や FORBIDDEN チェック箇所での「<strong>仕様解釈ミス</strong>」が残りやすい。UI 細部では mockup の grid-cols-4 配置を DrawerCard 縦リストに置換しており「<strong>視覚的不整合</strong>」も計上。",
      contextNotes: [
        "対象画面: ユーザマスタ（FE020 / PW-123）。一覧 + 詳細ドロワー + 新規ドロワー + パスワード変更モーダル。4 テーブル構成 (m_user 拡張 + m_permission_group + m_user_shipper + m_user_depot)。N:N リレーション 2 本、楽観的ロック、DataLoader 3 本、認可チェック (自分のパスワードのみ変更可)。",
        "<strong>ToBe は実測値</strong>: PW-115 で生成された spec / brief / skeleton を再利用 → planner 再検証 → 各 agent 順次実行。期間 2026-05-26 23:11 〜 2026-05-27 00:35 (約 84 分)。<strong>議論時間込み</strong>。集計詳細は同階層 <code>user-master-data.md</code> 参照。",
        "<strong>spec / brief / skeleton.tsx の再利用が効いた</strong>: PW-115 で旧方針時代に作られた spec が残存していたため、planner 再検証モードで「再利用 / 再生成」判定 → そのまま活用できた。UX 議論時間が大幅短縮 (デポマスタ 4.95h → ユーザマスタ 2.50h)。",
        "<strong>リワーク回数</strong>: backend 1 周 (Major 3 修正) + frontend モードA 1 周 (Major 2 修正) + モードB 1 周 (Major 2 + Minor 3 修正)。デポマスタ (backend 4 周) より大幅減。試行 2 回目の学習効果が出ている。",
        "AsIs は商品マスタ一覧+登録（合計 60.3h）を以下の係数で按分: データモデル ×3 (3 テーブル新規)、API ×3.5 (拡張 + 新規モジュール + パスワードMutation)、UX ×0.85、フロント ×2 (Detail/Create 分離 + モーダル)、レビュー・動作確認 ×1.2。複雑度プレミアム (N:N 2 本・値反転マッピング・bcrypt) で +15% 想定。",
        "削減率は <strong>95.5h → 20.5h で約 79%</strong>。<strong>レビュー・動作確認 (api-review 2.5h / fe-review 3h / verify 8h) はエンジニア工数で AsIs と同じ</strong>。AI が削減できるのは実装工程に限定される。試行 1 回目 (デポマスタ 78%) と同等水準で安定。",
        "改善余地: <strong>mockup と実装の視覚差分</strong>が依然として発生 (mockup の grid-cols-4 横並び → 実装の DrawerCard 縦リスト)。これは frontend-tester が Playwright 制約で画像比較できず静的解析に代替している構造的問題。<code>aidd-issues/PW-123_課題事例_モックと実装の視覚差分.html</code> で整理。",
      ],
    },
    "area-master": {
      tabLabel: "エリアマスタ",
      title: "エリアマスタ画面（一覧・登録・更新・削除 / CSV取込UI骨格） 開発工数比較 (AsIs / ToBe)",
      lede: "AIDD 試行 #3 で実装した「エリアマスタ」（FE023 / PW-122）の開発工数比較。<strong>郵便番号マスタ (m_postal_code) を起点に エリア / デポ / 商品 / 商品種別 / 事業会社の結合ビュー</strong> を扱う応用マスタ画面。<strong>第1版で mockup フラット構造を素直に実装 → データモデル仕様未確定で破棄 → 第2版で正規化マスタとして再実装</strong>。<strong>ToBe は実測値（第1版＋第2版の合算）</strong>。「仕様不明スキップ」方針 + データモデル後追い適用の影響を直接観察できる試行。",
      tasks: [
        { key: "data-design", label: "データモデル設計 (第1版破棄 → m_postal_code 新規 + m_area 拡張)", color: "var(--c-data-design)", loc: null, asis: 8,   tobe: 0.25, tobeEng: 0,    agents: ["DBアーキテクトAI"] },
        { key: "data-impl",   label: "データモデル実装 (旧schema 破棄 + 新schema + migration 2回)",    color: "var(--c-data-impl)",   loc: 130,  asis: 4,   tobe: 0.25, tobeEng: 0,    agents: ["DBアーキテクトAI", "エンジニア(削除補助)"] },
        { key: "api-impl",    label: "API設計・実装 (m-area-postal-code → 破棄 → m-postal-code 新規)", color: "var(--c-api-impl)",    loc: 1033, asis: 22,  tobe: 1.00, tobeEng: 0,    agents: ["バックエンドAI"] },
        { key: "api-test",    label: "API単体テスト (api-implに内包)",                                color: "var(--c-api-test)",    loc: 280,  asis: 9,   tobe: 0,    tobeEng: 0,    agents: ["バックエンドAI"] },
        { key: "api-review",  label: "APIレビュー (エンジニア)",                                       color: "var(--c-eng-review)",  loc: null, asis: 2.5, tobe: 2.5,  tobeEng: 2.5,  agents: ["バックエンドレビュワーAI", "エンジニア"] },
        { key: "ux",          label: "UX設計・spec 生成 (第1版 + 第2版 再検証)",                       color: "var(--c-ux)",          loc: null, asis: 6,   tobe: 2.20, tobeEng: 1.30, agents: ["プランナーAI", "エンジニア"] },
        { key: "fe-design",   label: "フロントエンド設計 (fe-implに内包)",                              color: "var(--c-fe-design)",   loc: null, asis: 7,   tobe: 0,    tobeEng: 0,    agents: ["フロントエンドAI"] },
        { key: "fe-impl",     label: "フロントエンド実装 (第1版 + 第2版差し替え + 「-」固定解消)",        color: "var(--c-fe-impl)",     loc: 1929, asis: 22,  tobe: 1.20, tobeEng: 0,    agents: ["フロントエンドAI"] },
        { key: "fe-test",     label: "フロントエンド単体テスト (実装なし)",                              color: "var(--c-fe-test)",     loc: null, asis: 0,   tobe: 0,    tobeEng: 0,    agents: ["—"] },
        { key: "fe-review",   label: "フロントエンドレビュー (エンジニア)",                              color: "var(--c-eng-review)",  loc: null, asis: 3,   tobe: 3,    tobeEng: 3,    agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        { key: "verify",      label: "動作確認 (BE + FE / 第2版で再走)",                                color: "var(--c-verify)",      loc: null, asis: 7,   tobe: 7,    tobeEng: 7,    agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
        { key: "trial-review",          label: "[試行特有] 試行総括・課題抽出 (mock視覚差分・データモデル後追い)", color: "#9333ea", loc: null, asis: 0, tobe: 1.40, tobeEng: 1.00, agents: ["エンジニア (人間との議論)"] },
        { key: "structure-improvement", label: "[試行特有] 仕様確定後の再設計コスト",                                 color: "#7e22ce", loc: null, asis: 0, tobe: 0.30, tobeEng: 0.20, agents: ["エンジニア (構造判断)"] },
      ],
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                                                  color: "#ef4444", asis: 5,  tobe: 0 },
        { key: "logic",  label: "ロジックバグ (テナント分離・楽観的ロック・DataLoader バッチ)",       color: "#f59e0b", asis: 9,  tobe: 3 },
        { key: "edge",   label: "エッジケース漏れ (FilterInput companyId 公開・catch throw 欠如)",   color: "#8b5cf6", asis: 7,  tobe: 4 },
        { key: "spec",   label: "仕様解釈ミス (mockup フラット vs 正規化マスタ / 配送会社未確定)",     color: "#ec4899", asis: 4,  tobe: 9 },
        { key: "ui",     label: "UI 細部の不整合 (削除項目・「-」固定箇所)",                          color: "#06b6d4", asis: 7,  tobe: 6 },
      ],
      bugRateNote: "※ エリアマスタ 約 3.0 KLOC + 第1版破棄分。データモデル仕様未確定での着手により「<strong>仕様解釈ミス</strong>」が他シナリオに比べ突出 (ToBe 9 件)。mockup の AreaData フラット構造を直接テーブル化した第1版が、正規化マスタ (m_postal_code 起点) の第2版で全面差し替えになった経緯を反映。テナント分離の FilterInput.companyId 公開は前試行 (PW-122 第1版) でも同じ Major 指摘が出ており、reviewer の検出パターンとして定着しつつある。",
      contextNotes: [
        "対象画面: エリアマスタ (FE023 / PW-122)。一覧 + 詳細ドロワー + 新規ドロワー + ファイル取込UI (通知のみ)。<strong>第1版</strong>: m_area_postal_code (フラット結合テーブル) で実装 → 動作。<strong>第2版</strong>: データモデル設計書 (<code>要件定義/for_ai/tables/</code>) 確定により m_postal_code (正規化マスタ) に再実装。第1版 backend 10 ファイル削除 + 第2版 backend 10 ファイル新規。",
        "<strong>ToBe は実測値 (第1版 + 第2版 合算)</strong>: 第1版 94 分 + 第2版 72 分 = 166 分 ≒ 2.77h。集計詳細は同階層 <code>area-master-data.md</code> 参照。",
        "<strong>「仕様不明スキップ」方針の限界</strong>: 業務判断 (CSV取込仕様・削除挙動) はスキップで進められたが、<strong>データモデル設計の根幹</strong>が未確定だった第1版は構造ごとやり直しになった。「スキップしてよい不明」と「スキップしてはいけない不明」の境界の指摘材料に。",
        "<strong>第2版の短縮効果</strong>: 同じ画面の作り直しが第1版の 76% (94 分 → 72 分) で完了。理由は (1) backend モジュール構造のパターン確立済 (2) mockup ↔ DB の責務分離が明確化 (3) reviewer 指摘パターンが先読み可能。再設計コストは想定より低い。",
        "<strong>リワーク回数</strong>: 第1版 backend 1 周 + frontend モードB 1 周。第2版 backend 1 周 + frontend モードB 1 周 + MArea 拡張サイクル 1 周。合計でデポマスタと同等。",
        "AsIs は商品マスタ参考レートで按分。データモデル ×3、API ×3.5、UX ×0.85、フロント ×1.9、レビュー・動作確認 ×1.1。応用パターン (CSV 取込 + 多テーブル結合) で +10% 想定。",
        "削減率は <strong>90.5h → 19.1h で約 79%</strong>。<strong>レビュー・動作確認 (api-review 2.5h / fe-review 3h / verify 7h) はエンジニア工数で AsIs と同じ</strong>。第1版破棄分も含めての値。データモデル仕様が事前確定していれば 第1版だけで完了し、ToBe は 16h 程度・削減率 82% 程度に届く見込み。",
        "改善余地: (a) <strong>データモデル設計書 (<code>tables/</code>) を planner 入力に必須化</strong>、(b) <strong>mockup の独自構造 (フラット結合) と DB スキーマの責務分離を最初の planner ステップで判定</strong>。「mockup を直接テーブル化しない」ガード追加で再発防止可能。",
      ],
    },
  };

  // 「エンジニア」「エンジニア(最終確認)」等を判定する共通述語
  function isEngineer(name) { return name.startsWith("エンジニア"); }

  // ====== 合計シナリオの動的生成 ======
  function buildTotalScenario(scenarios, keys) {
    const taskKeys   = ["data-design","data-impl","api-impl","api-test","api-review","ux","fe-design","fe-impl","fe-test","fe-review","verify","trial-review","structure-improvement"];
    const taskLabels = {
      "data-design": "データモデル設計",
      "data-impl":   "データモデル実装",
      "api-impl":    "API設計・実装",
      "api-test":    "API単体テスト",
      "api-review":  "APIレビュー (エンジニア)",
      "ux":          "UX設計",
      "fe-design":   "フロントエンド設計",
      "fe-impl":     "フロントエンド実装",
      "fe-test":     "フロントエンド単体テスト",
      "fe-review":   "フロントエンドレビュー (エンジニア)",
      "verify":      "動作確認",
      "trial-review":          "[試行特有] 試行総括・課題抽出",
      "structure-improvement": "[試行特有] 構造改修",
    };
    const taskColor = {};
    keys.forEach(k => scenarios[k].tasks.forEach(t => { taskColor[t.key] = taskColor[t.key] || t.color; }));

    const aggTasks = taskKeys.map(tk => {
      let loc = 0, asis = 0, tobe = 0, tobeEng = 0, hasLoc = false;
      const agentSet = new Set();
      keys.forEach(k => {
        const t = scenarios[k].tasks.find(x => x.key === tk);
        if (!t) return;
        asis    += t.asis    || 0;
        tobe    += t.tobe    || 0;
        tobeEng += t.tobeEng || 0;
        if (t.loc != null) { loc += t.loc; hasLoc = true; }
        (t.agents || []).forEach(a => {
          // 合計タブでは「エンジニア(最終確認)」「エンジニア(複雑ロジック)」等を「エンジニア」に統一
          agentSet.add(isEngineer(a) ? "エンジニア" : a);
        });
      });
      return {
        key: tk,
        label: taskLabels[tk],
        color: taskColor[tk],
        loc: hasLoc ? loc : null,
        asis,
        tobe,
        tobeEng,
        agents: Array.from(agentSet),
      };
    });

    const bugOrder  = ["syntax","logic","edge","spec","ui","encoding"];
    const bugLabels = {
      "syntax":   "構文/型エラー",
      "logic":    "ロジックバグ",
      "edge":     "エッジケース漏れ",
      "spec":     "仕様解釈ミス",
      "ui":       "UI/レイアウトの不整合",
      "encoding": "文字コード/改行コード/エスケープ",
    };
    const bugColors = {
      "syntax":   "#ef4444",
      "logic":    "#f59e0b",
      "edge":     "#8b5cf6",
      "spec":     "#ec4899",
      "ui":       "#06b6d4",
      "encoding": "#14b8a6",
    };
    const aggBugs = bugOrder.map(bk => {
      let asis = 0, tobe = 0, found = false;
      keys.forEach(k => {
        const b = scenarios[k].bugCategories.find(x => x.key === bk);
        if (!b) return;
        asis += b.asis || 0;
        tobe += b.tobe || 0;
        found = true;
      });
      return found ? { key: bk, label: bugLabels[bk], color: bugColors[bk], asis, tobe } : null;
    }).filter(Boolean);

    return {
      tabLabel: "合計",
      title: "全シナリオ合計 開発工数比較 (AsIs / ToBe)",
      lede: `本ページに含まれる全 ${keys.length} シナリオの工数・コード量・想定バグ数を合算した参考値です。複数画面を持つプロジェクト全体での AsIs / ToBe の規模感をつかむ用途。`,
      tasks: aggTasks,
      bugCategories: aggBugs,
      bugRateNote: "※ 各シナリオの想定バグ数を合算。AI駆動でも残る「仕様解釈ミス」「PDFレイアウト崩れ」「文字コード問題」などの傾向は、シナリオ単独で見るより全体での比重が分かりやすくなる。",
      contextNotes: [
        `対象: 本ページの全 ${keys.length} シナリオ (${keys.map(k => scenarios[k].tabLabel).join(" / ")}) を合算した開発工数・コード量・想定バグ数の概算。`,
        "用途: 複数画面を抱えるプロジェクトに AI 駆動を導入した場合の、全体での投資対効果の感触をつかむための数値。",
        "AsIs/ToBe の差分が <strong>絶対値で最も大きい工程</strong>はフロントエンド実装と API 設計・実装。コード量・工数とも大きく、AI のレバレッジが効きやすい領域。",
        "AI 駆動でも残る課題は <strong>仕様解釈ミス</strong> (ToBe のほうがむしろ多い場合あり)、<strong>視覚的アウトプットの検証</strong> (PDF など)、<strong>環境依存問題</strong> (文字コード等)。<strong>レビュー・動作確認のエンジニア工数は AsIs と変わらない</strong>（AI が書いたコードを人が同じ時間レビューする想定）。AI 削減が効くのは「実装」「設計」「テスト生成」工程に限定される。",
        "シナリオ別削減率の傾向: 視覚出力やドメインロジックの厚さで効きが変動 (<strong>テキスト・標準パターンに近いほど効きやすい</strong>)。",
      ],
    };
  }

  const HOURS_PER_DAY = 8;
  const REAL_KEYS = ["depot-master", "user-master", "area-master"];

  // ====== workitems データからテンプレート scenario を生成 ======
  // workitems.html の「スコア順でソート」ON + 「タスクをまとめる」ON と同じ順序で
  // 画面名 (グルーピング後) / IF名 ごとに 1 タブを生成 (中身は 0 値テンプレート)
  function createTemplateScenario(name, sourceType) {
    const labelHint = sourceType === 'if' ? `${name} (IF)` : name;
    return {
      tabLabel: labelHint,
      title: `${name} 開発工数比較 (AsIs / ToBe)`,
      lede: "<em>テンプレート: 実測値はこれから入力します。</em>",
      tasks: [
        { key: "data-design", label: "データモデル設計",                color: "var(--c-data-design)", loc: null, asis: 0, tobe: 0, tobeEng: 0, agents: [] },
        { key: "data-impl",   label: "データモデル実装",                color: "var(--c-data-impl)",   loc: null, asis: 0, tobe: 0, tobeEng: 0, agents: [] },
        { key: "api-impl",    label: "API設計・実装",                   color: "var(--c-api-impl)",    loc: null, asis: 0, tobe: 0, tobeEng: 0, agents: [] },
        { key: "api-test",    label: "API単体テスト",                   color: "var(--c-api-test)",    loc: null, asis: 0, tobe: 0, tobeEng: 0, agents: [] },
        { key: "api-review",  label: "APIレビュー (エンジニア)",        color: "var(--c-eng-review)",  loc: null, asis: 0, tobe: 0, tobeEng: 0, agents: [] },
        { key: "ux",          label: "UX設計",                          color: "var(--c-ux)",          loc: null, asis: 0, tobe: 0, tobeEng: 0, agents: [] },
        { key: "fe-design",   label: "フロントエンド設計",              color: "var(--c-fe-design)",   loc: null, asis: 0, tobe: 0, tobeEng: 0, agents: [] },
        { key: "fe-impl",     label: "フロントエンド実装",              color: "var(--c-fe-impl)",     loc: null, asis: 0, tobe: 0, tobeEng: 0, agents: [] },
        { key: "fe-test",     label: "フロントエンド単体テスト",        color: "var(--c-fe-test)",     loc: null, asis: 0, tobe: 0, tobeEng: 0, agents: [] },
        { key: "fe-review",   label: "フロントエンドレビュー (エンジニア)", color: "var(--c-eng-review)", loc: null, asis: 0, tobe: 0, tobeEng: 0, agents: [] },
        { key: "verify",      label: "動作確認",                        color: "var(--c-verify)",      loc: null, asis: 0, tobe: 0, tobeEng: 0, agents: [] },
      ],
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",    color: "#ef4444", asis: 0, tobe: 0 },
        { key: "logic",  label: "ロジックバグ",     color: "#f59e0b", asis: 0, tobe: 0 },
        { key: "edge",   label: "エッジケース漏れ", color: "#8b5cf6", asis: 0, tobe: 0 },
        { key: "spec",   label: "仕様解釈ミス",     color: "#ec4899", asis: 0, tobe: 0 },
        { key: "ui",     label: "UI 細部の不整合",  color: "#06b6d4", asis: 0, tobe: 0 },
      ],
      bugRateNote: "<em>記入予定</em>",
      contextNotes: ["<em>記入予定: 本シナリオの前提・実測値・改善余地を後から追記する</em>"],
      _template: true,
    };
  }

  function generateWorkitemsScenarios() {
    if (typeof WORKITEMS_DATA === 'undefined' ||
        typeof sortByScore     === 'undefined' ||
        typeof groupTasks      === 'undefined' ||
        typeof postprocessWorkitems === 'undefined') {
      return { keys: [] };
    }
    // workitems と同じ後処理を適用したうえで score 順 + groupTasks
    const { SCREENS, IFS }  = postprocessWorkitems(WORKITEMS_DATA);
    const sortedScreens  = [...SCREENS].sort(sortByScore);
    const groupedScreens = groupTasks(sortedScreens);
    const sortedIfs      = [...IFS].sort(sortByScore);
    const keys = [];
    groupedScreens.forEach(row => {
      const id  = row.管理ID || row.画面ID;
      if (!id) return;
      const key = `wi-screen-${id}`;
      if (scenarios[key]) return;   // 既存があれば上書きしない
      scenarios[key] = createTemplateScenario(row.画面名 || id, 'screen');
      keys.push(key);
    });
    sortedIfs.forEach(row => {
      const id  = row.IFID;
      if (!id) return;
      const key = `wi-if-${id}`;
      if (scenarios[key]) return;
      scenarios[key] = createTemplateScenario(row.IF名 || id, 'if');
      keys.push(key);
    });
    return { keys };
  }
  const _wi = generateWorkitemsScenarios();

  // 既存の手書き scenario を workitems 由来の wi-screen-* タブに統合。
  // tabLabel は workitems 由来 ("デポマスタ"/"ユーザマスタ"/"エリアマスタ") を維持、
  // 元キーは削除。→ 重複タブ解消 + 実測値・課題リンクは workitems タブで参照できる。
  const MERGE_MAP = {
    'depot-master': 'wi-screen-DM07FE021',   // デポマスタ (FE021)
    'user-master':  'wi-screen-DM07FE020',   // ユーザマスタ (FE020)
    'area-master':  'wi-screen-DM07FE023',   // エリアマスタ (FE023)
  };
  const REAL_KEYS_FOR_TOTAL = REAL_KEYS.map(k => MERGE_MAP[k] || k);
  Object.entries(MERGE_MAP).forEach(([from, to]) => {
    if (scenarios[from] && scenarios[to]) {
      const label = scenarios[to].tabLabel;
      scenarios[to] = {
        ...scenarios[from],
        tabLabel: label,
        title:    `${label} 開発工数比較 (AsIs / ToBe)`,
      };
    }
    delete scenarios[from];
  });

  // === シナリオ別 AsIs / 概算コード量 / 実測値の注入 ===
  // workitems 由来テンプレートを実データで上書き。指定キーの工程だけ差分マージ、
  // 残工程は 0 のまま (= 未測定)。tasks.<key>.{asis, tobe, tobeEng, loc, agents} を任意指定。
  const SCENARIO_OVERRIDES = {
    // 商品マスタ (FE022) - AsIs 見積もり / 担当はデポマスタと同じ
    // ToBe: 固定工程 (api-review/ux/verify) + 実装系 6工程に AsIs比で 2.5h 分配 + レイアウト調整 2h
    // バグ数: 約 1.9 KLOC × 参考レート (人力 12/KLOC ≒ 23件 / AI 5/KLOC ≒ 10件) で推定
    'wi-screen-DM07FE022': {
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                                color: "#ef4444", asis: 3, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (検索・ソート・カテゴリ階層)",       color: "#f59e0b", asis: 7, tobe: 2 },
        { key: "edge",   label: "エッジケース漏れ (空値・特殊文字・ステータス遷移)", color: "#8b5cf6", asis: 5, tobe: 2 },
        { key: "spec",   label: "仕様解釈ミス (商品コード規則・カテゴリ階層)",       color: "#ec4899", asis: 3, tobe: 4 },
        { key: "ui",     label: "UI 細部の不整合 (バッジ色・列幅・フォーム配置)",    color: "#06b6d4", asis: 5, tobe: 2 },
      ],
      bugRateNote: "※ 商品マスタ 約 1.9 KLOC × 参考レート（人力 12/KLOC ≒ 23件 / AI 5/KLOC ≒ 10件）で推定。マスタ一覧+登録更新の典型的 CRUD 構成で、論点は <strong>商品コード規則・カテゴリ階層の解釈</strong>。AI でも業務固有の命名規則・階層構造は仕様で明示しないと <strong>仕様解釈ミス</strong> が残りやすい (デポマスタ・ユーザマスタと同傾向)。",
      tasks: {
        'data-design': { asis: 3,            tobe: 0.2,                 agents: ["DBアーキテクトAI"] },
        'data-impl':   { asis: 2,  loc: 56,  tobe: 0.1,                 agents: ["DBアーキテクトAI"] },
        'api-impl':    { asis: 10, loc: 450, tobe: 0.6,                 agents: ["バックエンドAI"] },
        'api-test':    { asis: 8,  loc: 580, tobe: 0.5,                 agents: ["バックエンドAI"] },
        'api-review':  { asis: 2,            tobe: 2.0, tobeEng: 2.0,   agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'ux':          { asis: 4,            tobe: 2.0, tobeEng: 1.0,   agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 2,            tobe: 0.1,                 agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 16, loc: 810, tobe: 1.0,                 agents: ["フロントエンドAI"] },
        'fe-test':     {                                                agents: ["—"] },
        'fe-review':   {                                                agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 4,            tobe: 4.0, tobeEng: 4.0,   agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
        'layout-adjust': {
          label: "レイアウト調整",
          color: "#fbbf24",
          asis: 0,
          tobe: 2.0, tobeEng: 1.0,
          agents: ["フロントエンドAI", "エンジニア"],
        },
      },
    },
  };
  Object.entries(SCENARIO_OVERRIDES).forEach(([key, override]) => {
    const s = scenarios[key];
    if (!s) return;
    if (override.tasks) {
      Object.entries(override.tasks).forEach(([tkey, patch]) => {
        const existing = s.tasks.find(t => t.key === tkey);
        if (existing) {
          Object.assign(existing, patch);
        } else {
          // 既存テンプレートに無いキーは末尾に新規追加
          s.tasks.push({
            key: tkey,
            label: patch.label || tkey,
            color: patch.color || 'var(--c-verify)',
            loc: patch.loc ?? null,
            asis: patch.asis ?? 0,
            tobe: patch.tobe ?? 0,
            tobeEng: patch.tobeEng ?? 0,
            agents: patch.agents ?? [],
          });
        }
      });
    }
    if (override.title)        s.title = override.title;
    if (override.lede)         s.lede = override.lede;
    if (override.bugCategories) s.bugCategories = override.bugCategories;
    if (override.contextNotes) s.contextNotes = override.contextNotes;
    if (override.bugRateNote)  s.bugRateNote = override.bugRateNote;
    s._template = false;
  });

  scenarios.total = buildTotalScenario(scenarios, REAL_KEYS_FOR_TOTAL);
  const REAL_KEYS_TABS = REAL_KEYS.filter(k => !MERGE_MAP[k]);
  const TAB_ORDER = [...REAL_KEYS_TABS, ..._wi.keys, "total"];
