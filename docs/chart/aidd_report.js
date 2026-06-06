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
        "<strong>実測ログ (time-log.jsonl) 追記</strong>: 計測ルール運用後に記録できたのは 動作確認・レビュー対応サイクル 2.0h (2026-05-28) と 試行特有のオーバーヘッド 0.55h (brief §7 テスト観点の往復必須化 0.22h / Playwright 依存セットアップ整備 0.33h)。上記 84 分の初期実装は計測ルール運用前のため<strong>本シナリオの ToBe 工程値は推定を含む</strong>（部分計測）。",
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
      lede: "AIDD 試行 #3 で実装した「エリアマスタ」（FE023 / PW-122）の開発工数比較。<strong>郵便番号マスタ (m_postal_code) を起点に エリア / デポ / 商品 / 商品種別 / 事業会社の結合ビュー</strong> を扱う応用マスタ画面。<strong>第1版（mockupフラット）→破棄→第2版（正規化マスタ）→ mock完全整合（案B: 全項目独立入力）</strong>まで実施。<strong>ToBe はセッションログ実測</strong>: 標準開発 14.3h（今回の mock整合セッション 11.5h ＋ 第1/2版 2.8h）＋ 試行特有のオーバーヘッド 1.0h ＝ <strong>計 15.3h</strong>。通常工程（標準開発）と<span style=\"color:#9333ea\">紫セグメント（試行特有）</span>で区別できる。",
      // ToBe は累計。元の 19.1h (第1/2版 + 推定レビュー/動作確認) に、今回 mock整合セッションの
      // 実測 (time-log.jsonl) 12.5h を加算 = 31.6h。各工程の tobe = 元値 + 今回実測の加算分。工程配分は概算。
      // 通常工程 = 標準開発、[試行特有] (紫セグメント = 「うち試行特有」集計) = AIDD試行オーバーヘッド
      tasks: [
        { key: "data-design", label: "データモデル設計 (第1/2版 + MCarrier/MProductClass 新規 + m_postal_code denormalize)", color: "var(--c-data-design)", loc: null, asis: 6,   tobe: 0.5, tobeEng: 0,    agents: ["DBアーキテクトAI"] },
        { key: "data-impl",   label: "データモデル実装 (migration 計5回 + 旧schema破棄)",       color: "var(--c-data-impl)",   loc: 200,  asis: 7,   tobe: 0.5, tobeEng: 0,    agents: ["DBアーキテクトAI", "エンジニア(削除補助)"] },
        { key: "api-impl",    label: "API設計・実装 (m-postal-code 再設計 + 配送会社/品種/denormalize + filter/ResolveField)", color: "var(--c-api-impl)", loc: 1200, asis: 27,  tobe: 2.5, tobeEng: 0,    agents: ["バックエンドAI"] },
        { key: "api-test",    label: "API単体テスト (api-implに内包)",                          color: "var(--c-api-test)",    loc: 280,  asis: 4,   tobe: 0,   tobeEng: 0,    agents: ["バックエンドAI"] },
        { key: "api-review",  label: "APIレビュー (backend-reviewer + 手修正)",                  color: "var(--c-eng-review)",  loc: null, asis: 2,   tobe: 3.0, tobeEng: 3.0,  agents: ["バックエンドレビュワーAI", "エンジニア"] },
        { key: "ux",          label: "UX設計・spec同期・方針判断 (mock正本 / 案A / 案B)",        color: "var(--c-ux)",          loc: null, asis: 8,   tobe: 3.0, tobeEng: 1.9,  agents: ["プランナーAI", "エンジニア"] },
        { key: "fe-design",   label: "フロントエンド設計 (fe-implに内包)",                       color: "var(--c-fe-design)",   loc: null, asis: 4,   tobe: 0,   tobeEng: 0,    agents: ["フロントエンドAI"] },
        { key: "fe-impl",     label: "フロントエンド実装 (第1/2版 + 確定反映→mock整合→gridドロワー→案B全項目→管理配送会社・計6周)", color: "var(--c-fe-impl)", loc: 2100, asis: 42,  tobe: 4.7, tobeEng: 0,    agents: ["フロントエンドAI"] },
        { key: "fe-test",     label: "フロントエンド単体テスト (実装なし)",                              color: "var(--c-fe-test)",     loc: null, asis: 0,   tobe: 0,   tobeEng: 0,    agents: ["—"] },
        { key: "fe-review",   label: "フロントエンドレビュー (frontend-reviewer)",               color: "var(--c-eng-review)",  loc: null, asis: 2,   tobe: 3.5, tobeEng: 3.5,  agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        { key: "verify",      label: "動作確認・mock視覚比較 (BE/FEテスター + 目視・実検証)",        color: "var(--c-verify)",      loc: null, asis: 8,   tobe: 5.6, tobeEng: 4.0,  agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
        { key: "spec-confirm", label: "仕様確認 (mock乖離→業務確認・方針判断の往復・動作確認の約半分)", color: "#d97706",              loc: null, asis: 0,   tobe: 5.6, tobeEng: 5.5,  agents: ["エンジニア (業務確認)"] },
        { key: "trial-review",          label: "[試行特有] 試行総括・乖離の構造的記録・再発防止 (mock差分→TSV構造化+memory)", color: "#9333ea", loc: null, asis: 0, tobe: 1.9, tobeEng: 1.5,  agents: ["エンジニア (人間との議論)"] },
        { key: "structure-improvement", label: "[試行特有] 構造改修・不明点TSV列規律の整備 (.claude/agents+README)",        color: "#7e22ce", loc: null, asis: 0, tobe: 0.8, tobeEng: 0.7,  agents: ["エンジニア (ルール整備)"] },
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
        "対象画面: エリアマスタ (FE023 / PW-122)。一覧 + 詳細/新規ドロワー + ファイル取込UI (通知のみ)。第1版 (m_area_postal_code フラット) → 破棄 → 第2版 (m_postal_code 正規化) → mock 完全整合 (案B: m_postal_code を denormalize し デポ/電話番号/管理配送会社/実配送会社 を直接保持・全項目独立入力)。",
        "<strong>ToBe は累計</strong>: 元の 19.1h (第1/2版 + 推定レビュー/動作確認) に、今回 mock整合セッションの実測 (time-log.jsonl) <strong>12.5h を加算</strong> = <strong>計 31.6h</strong>。今回内訳 = 標準開発 11.5h (確定回答反映 1.2h + mock整合 10.3h) + 試行特有のオーバーヘッド 1.0h (乖離の構造的記録 0.5h + 不明点TSV列規律 0.5h)。工程配分は概算。",
        "<strong>内訳の見方</strong>: 工程セグメント (青〜オレンジ系) = 標準開発、<span style=\"color:#9333ea\"><strong>紫セグメント = 試行特有のオーバーヘッド</strong></span> (= サマリの「うち試行特有」)。今回最も増えたのは <strong>動作確認 5.6h ＋ 仕様確認 5.6h</strong> (旧 verify 11.2h を分割。動作確認のうち約半分は mock乖離に伴う業務確認・方針判断＝仕様確認) と <strong>フロントエンド実装 4.7h</strong> (mock整合で計6周)。",
        "<strong>手戻りの主因 (EX-2)</strong>: mock↔実装の視覚比較 (Step2-α) を初回の動作確認で回さず、乖離の発覚が遅れた。配送会社=MCarrier・電話番号=デポ・郵便番号XXX-XXXX整形・ドロワーmockグリッド化・案B全項目入力・管理配送会社追加と、段階的に mock へ収束させたため verify と fe-impl が膨らんだ。",
        "<strong>うちエンジニア (人間) 累計 20.1h</strong> (うち今回 +5.1h): 方針判断 (mock正本/案A/案B/管理配送会社)・目視確認の往復・レビュー確認。AI が削減できるのは実装・設計・テスト生成工程で、レビュー/動作確認の人間工数は AsIs と同水準。",
        "<strong>AsIs は商品マスタのコード変更量から算出</strong>。実装工程は商品マスタの「行あたり工数」をエリアのコード量に適用: API実装 1,200行→27h (商品 450行=10h)、FE実装 2,100行→42h (商品 810行=16h)、データ実装 200行→7h、API単体テスト 280行→4h。設計・UX・レビュー・動作確認はコード量比 (商品 1,896行 → エリア 3,780行・約2.0倍) で按分。<strong>合計 約110h</strong>。",
        "削減率は <strong>110h → 31.6h で約 71%</strong> (手戻り含む累計実測ベース・経過時間で待ち/目視/休憩込み)。前回まで (ToBe 19.1h・約79%) から、mock 乖離の後追い修正で ToBe +12.5h、コード量増で AsIs 90.5h→110h に増加。<strong>改善余地</strong>: 視覚比較 (Step2-α) を初回動作確認で必須化すれば この +12.5h の大半 (verify +4.2h / fe-impl 6周) を圧縮可能。",
      ],
    },
  };

  // 「エンジニア」「エンジニア(最終確認)」等を判定する共通述語
  function isEngineer(name) { return name.startsWith("エンジニア"); }

  // ====== 合計シナリオの動的生成 ======
  function buildTotalScenario(scenarios, keys) {
    const taskKeys   = ["data-design","data-impl","api-impl","api-test","api-review","ux","fe-design","fe-impl","fe-test","fe-review","verify","spec-confirm","trial-review","structure-improvement"];
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
      "spec-confirm": "仕様確認",
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
  // workitems.html と同じ並び (優先昇順) + 「タスクをまとめる」ON 相当の順序で
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

  // postprocessWorkitems は純粋関数だが workitems / backend の両シナリオ生成で
  // 同じ結果を使うため、1 回だけ実行して結果をキャッシュする。
  let _postCache;
  function getPostprocessed() {
    if (_postCache === undefined) {
      _postCache = (typeof WORKITEMS_DATA !== 'undefined' && typeof postprocessWorkitems !== 'undefined')
        ? postprocessWorkitems(WORKITEMS_DATA)
        : null;
    }
    return _postCache;
  }

  function generateWorkitemsScenarios() {
    if (typeof WORKITEMS_DATA === 'undefined' ||
        typeof sortDefault     === 'undefined' ||
        typeof groupTasks      === 'undefined' ||
        typeof postprocessWorkitems === 'undefined') {
      return { keys: [] };
    }
    // workitems と同じ後処理を適用したうえで 優先昇順 + groupTasks
    const { SCREENS, IFS }  = getPostprocessed();
    const sortedScreens  = [...SCREENS].sort(sortDefault);
    const groupedScreens = groupTasks(sortedScreens);
    const sortedIfs      = [...IFS].sort(sortDefault);
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
          label: "[試行特有]レイアウト調整",
          color: "#fbbf24",
          asis: 0,
          tobe: 2.0, tobeEng: 1.0,
          agents: ["フロントエンドAI", "エンジニア"],
        },
      },
    },
    // お知らせ登録 (FE015) - 作業内訳の項目は商品マスタをコピー。AsIs/ToBe 等は一旦 0 (後で記入)。
    'wi-screen-DM04FE015': {
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                              color: "#ef4444", asis: 4, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (公開期間・並び順・対象範囲)",     color: "#f59e0b", asis: 9, tobe: 3 },
        { key: "edge",   label: "エッジケース漏れ (空値・公開前後・添付有無)",    color: "#8b5cf6", asis: 7, tobe: 3 },
        { key: "spec",   label: "仕様解釈ミス (公開範囲・通知対象の解釈)",        color: "#ec4899", asis: 4, tobe: 5 },
        { key: "ui",     label: "UI 細部の不整合 (一覧列・フォーム配置)",         color: "#06b6d4", asis: 6, tobe: 2 },
      ],
      bugRateNote: "※ お知らせ登録 約 2.5 KLOC × 参考レート（人力 12/KLOC ≒ 30件 / AI 5/KLOC ≒ 13件）で推定。一覧+登録の CRUD 構成で、論点は <strong>公開期間・公開範囲・通知対象の解釈</strong>。AI でも業務固有の公開ルール・通知条件は仕様で明示しないと <strong>仕様解釈ミス</strong> が残りやすい (商品マスタ等と同傾向)。",
      tasks: {
        'data-design': { asis: 4,   loc: 0,    tobe: 0.2, tobeEng: 0, agents: ["DBアーキテクトAI"] },
        'data-impl':   { asis: 6,   loc: 166,  tobe: 0.3, tobeEng: 0, agents: ["DBアーキテクトAI"] },
        'api-impl':    { asis: 8,   loc: 369,  tobe: 0.4, tobeEng: 0, agents: ["バックエンドAI"] },
        'api-test':    { asis: 3.5, loc: 256,  tobe: 0.2, tobeEng: 0, agents: ["バックエンドAI"] },
        'api-review':  { asis: 2,              tobe: 2, tobeEng: 2, agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'ux':          { asis: 5.5,            tobe: 1.5, tobeEng: 1.0, agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 3,              tobe: 0.2, tobeEng: 0, agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 33.5, loc: 1694, tobe: 1.7, tobeEng: 0, agents: ["フロントエンドAI"] },
        'fe-test':     {                                       agents: ["—"] },
        'fe-review':   {                                       agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 2.0,       tobe: 2.0, tobeEng: 1.5, agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
        'layout-adjust': {
          label: "レイアウト調整",
          color: "#fbbf24",
          asis: 0,
          tobe: 1, tobeEng: 0.5,
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

  // ====== BACKEND_TASKS (バックエンドのみ生成グループ) からタブを生成 ======
  // 入力画面が無く再実装が必要なテーブルの BE(スキーマ+Service)生成枠。
  // 工数(h) = 仕様確認 + AI実装 の合算見積りのみで AsIs/ToBe 内訳を持たないため、
  // lede / contextNotes に工数・状況・項目数を載せた簡易表示 (チャートはプレースホルダ)。
  function createBackendScenario(t) {
    const phys = t.物理名 ? `（物理名: <code>${t.物理名}</code>）` : "";
    return {
      tabLabel: t.モデル名,
      title: `${t.モデル名}（バックエンドのみ生成）`,
      lede: `入力画面を持たない<strong>バックエンドのみ生成</strong>のテーブル${phys}。種別: <strong>${t.種別 || "—"}</strong> ／ 項目数: <strong>${t.項目数 || "—"}</strong> ／ 状況: <strong>${t.状況 || "—"}</strong>。見積り工数（仕様確認 + AI実装）は <strong>${t["工数(h)"]}h</strong>。`,
      tasks: [],
      bugCategories: [],
      bugRateNote: "<em>バックエンドのみ生成のため想定バグ数は未記入。</em>",
      contextNotes: [
        "スキーマ（Prisma）＋ Service のバックエンド生成枠。入力画面は無く、画面実装の完了判定には含めない別グループ（出典: <code>.work/table_gap.md</code> ＋ データモデル設計書）。",
        `見積り工数 <strong>${t["工数(h)"]}h</strong> は仕様確認 + AI実装の合算（テーブルの複雑度・項目数で個別設定）。AsIs/ToBe の内訳は未測定。`,
        `状況: <strong>${t.状況 || "—"}</strong>。`,
      ],
      _template: true,
      _backend: true,
    };
  }
  function generateBackendScenarios() {
    if (typeof WORKITEMS_DATA === 'undefined' ||
        typeof postprocessWorkitems === 'undefined') {
      return { keys: [] };
    }
    const { BACKEND } = getPostprocessed();
    const keys = [];
    (BACKEND || []).forEach((t, i) => {
      const key = `wi-be-${i}`;
      if (scenarios[key]) return;
      scenarios[key] = createBackendScenario(t);
      keys.push(key);
    });
    return { keys };
  }
  const _be = generateBackendScenarios();

  // === バックエンド生成タブの実績注入 (予実管理) ===
  // 入力画面が無いテーブルでも、お知らせ登録(FE015)の「データモデル設計〜APIレビュー」工程に倣って
  // AsIs(人力想定)/ToBe(AI実績) を記録する。AsIs は実績LOCの規模から推定、ToBe は実測値。
  // tasks を丸ごと差し替え、lede/contextNotes も実績版に上書きして _template=false にする。
  const BACKEND_OVERRIDES = {
    // 荷主(m_shipper)・事業会社(m_company)・時間区分(m_time_slot)・配送キャパシティ の 4 マスタ。
    // AsIs: お知らせ登録の「行あたり工数」を実績LOCに適用 (data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行)。
    //       data-design はデータ実装の規模比 (485/166)。配送キャパシティ分 (DB 86 / API 229 / テスト 147) を合算済み。
    // ToBe: APIレビュー 2.5h(エンジニア) + その他工程 合計 2.0h(AI) + [試行特有] エクセル読み取り改善 2.0h(エンジニア)。
    'wi-be-2': {
      lede: "<strong>荷主</strong>(<code>m_shipper</code>)・<strong>事業会社</strong>(<code>m_company</code>)・<strong>時間区分</strong>(<code>m_time_slot</code>)・<strong>配送キャパシティ</strong> の 4 マスタを<strong>バックエンドのみ生成</strong>（入力画面なし）。実績コード量は計 <strong>2,467行</strong>（データモデル実装 485 / API設計・実装 1,131 / API単体テスト 851）。工程はお知らせ登録(FE015)の「データモデル設計〜APIレビュー」に準拠。<strong>AsIs は行数規模から推定</strong>、<strong>ToBe は実測</strong>（APIレビュー 2.5h + その他工程 合計 2.0h + <span style=\"color:#9333ea\">[試行特有] エクセル読み取り改善 2.0h</span>）。APIレビューは人がコードを確認する工数として AsIs / ToBe とも 2.5h でそろえている。",
      tasks: [
        { key: "data-design", label: "データモデル設計",        color: "var(--c-data-design)", loc: null, asis: 11.7, tobe: 0.4, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "data-impl",   label: "データモデル実装",        color: "var(--c-data-impl)",   loc: 485,  asis: 17.5, tobe: 0.5, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "api-impl",    label: "API設計・実装",           color: "var(--c-api-impl)",    loc: 1131, asis: 24.5, tobe: 0.7, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-test",    label: "API単体テスト",           color: "var(--c-api-test)",    loc: 851,  asis: 11.6, tobe: 0.4, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-review",  label: "APIレビュー (エンジニア)", color: "var(--c-eng-review)",  loc: null, asis: 2.5,  tobe: 2.5, tobeEng: 2.5, agents: ["バックエンドレビュワーAI", "エンジニア"] },
        { key: "excel-read-improve", label: "[試行特有] エクセル読み取り改善", color: "#9333ea", loc: null, asis: 0, tobe: 2.0, tobeEng: 2.0, agents: ["エンジニア"] },
      ],
      contextNotes: [
        "対象: 荷主(m_shipper)・事業会社(m_company)・時間区分(m_time_slot)・配送キャパシティ の 4 マスタ。入力画面を持たないバックエンド(Prisma スキーマ + Service)生成枠で、画面実装の完了判定には含めない別グループ（出典: <code>.work/table_gap.md</code> ＋ データモデル設計書）。",
        "<strong>実績コード量</strong>: データモデル実装 <strong>485行</strong> / API設計・実装 <strong>1,131行</strong> / API単体テスト <strong>851行</strong>（計 2,467行）。<strong>配送キャパシティ分（DB 86 / API 229 / テスト 147）を合算済み</strong>。工程区分はお知らせ登録(FE015)のデータモデル設計〜APIレビューを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行）。データモデル設計はデータ実装の規模比で按分。APIレビューは人の確認工数として AsIs / ToBe とも 2.5h でそろえる。合計 約67.8h。",
        "<strong>ToBe（AI駆動）は実測 6.5h</strong>: APIレビュー 2.5h（エンジニア）＋ その他工程（設計・実装・テスト生成）合計 2.0h（AI）＋ <strong>[試行特有] エクセル読み取り改善 2.0h（エンジニア）</strong>。削減率 約90%。レビュー・試行特有工程はエンジニアが実施する工数で、AI が削減できるのは実装系工程に限られる。",
        "想定バグ数は未記入（バックエンド生成のため別途記録予定）。",
      ],
    },
    // 権限グループ・権限対象(m_permission_group) のマスタ (10項目)。荷主(wi-be-2)と同じ構成。
    // 実績LOC: DBスキーマ(data-impl) 213 / バックエンド実装(api-impl) 724 / ユニットテスト(api-test) 224 (計1,161行)。
    // AsIs: お知らせ登録の「行あたり工数」を実績LOCに適用 (data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行)。
    //       data-design はデータ実装の規模比 (213/166) で按分、api-review は人の確認工数として ToBe とそろえる。
    // ToBe: APIレビュー 1.5h(エンジニア) + その他工程 合計 1.2h(AI)。
    'wi-be-12': {
      lede: "<strong>権限グループ・権限対象</strong>(<code>m_permission_group</code>) のマスタを<strong>バックエンドのみ生成</strong>（入力画面なし・10項目）。実績コード量は計 <strong>1,161行</strong>（DBスキーマ 213 / バックエンド実装 724 / ユニットテスト 224）。工程はお知らせ登録(FE015)の「データモデル設計〜APIレビュー」に準拠。<strong>AsIs は行数規模から推定</strong>、<strong>ToBe は実測</strong>（APIレビュー 1.5h + その他工程 合計 1.2h）。APIレビューは人がコードを確認する工数として AsIs / ToBe とも 1.5h でそろえている。",
      tasks: [
        { key: "data-design", label: "データモデル設計",        color: "var(--c-data-design)", loc: null, asis: 5.1,  tobe: 0.2, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "data-impl",   label: "データモデル実装",        color: "var(--c-data-impl)",   loc: 213,  asis: 7.7,  tobe: 0.3, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "api-impl",    label: "API設計・実装",           color: "var(--c-api-impl)",    loc: 724,  asis: 15.7, tobe: 0.4, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-test",    label: "API単体テスト",           color: "var(--c-api-test)",    loc: 224,  asis: 3.1,  tobe: 0.3, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-review",  label: "APIレビュー (エンジニア)", color: "var(--c-eng-review)",  loc: null, asis: 1.5,  tobe: 1.5, tobeEng: 1.5, agents: ["バックエンドレビュワーAI", "エンジニア"] },
      ],
      contextNotes: [
        "対象: 権限グループ・権限対象(m_permission_group) のマスタ。入力画面を持たないバックエンド(Prisma スキーマ + Service)生成枠で、画面実装の完了判定には含めない別グループ（出典: <code>.work/table_gap.md</code> ＋ データモデル設計書）。",
        "<strong>実績コード量</strong>: DBスキーマ <strong>213行</strong> / バックエンド実装 <strong>724行</strong> / ユニットテスト <strong>224行</strong>（計 1,161行）。工程区分はお知らせ登録(FE015)のデータモデル設計〜APIレビューを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行）。データモデル設計はデータ実装の規模比で按分。APIレビューは人の確認工数として AsIs / ToBe とも 1.5h でそろえる。合計 約33.1h。",
        "<strong>ToBe（AI駆動）は実測 2.7h</strong>: APIレビュー 1.5h（エンジニア）＋ その他工程（設計・実装・テスト生成）合計 1.2h（AI）。削減率 約92%。レビューはAIが書いたコードを人が確認する工数で AsIs と同水準。",
        "想定バグ数は未記入（バックエンド生成のため別途記録予定）。",
      ],
    },
    // 顧客(m_customer) のマスタ (29項目)。荷主(wi-be-2)・カレンダー(wi-be-13)と同じ構成。
    // 実績LOC: DBスキーマ(data-impl) 143 / バックエンド実装(api-impl) 624 / ユニットテスト(api-test) 377 (計1,144行)。
    // AsIs: お知らせ登録の「行あたり工数」を実績LOCに適用 (data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行)。
    //       data-design はデータ実装の規模比 (143/166) で按分、api-review は人の確認工数として ToBe とそろえる。
    // ToBe: APIレビュー 1.0h(エンジニア) + その他工程 合計 0.7h(AI)。
    'wi-be-0': {
      lede: "<strong>顧客</strong>(<code>m_customer</code>) のマスタを<strong>バックエンドのみ生成</strong>（入力画面なし・29項目）。実績コード量は計 <strong>1,144行</strong>（DBスキーマ 143 / バックエンド実装 624 / ユニットテスト 377）。工程はお知らせ登録(FE015)の「データモデル設計〜APIレビュー」に準拠。<strong>AsIs は行数規模から推定</strong>、<strong>ToBe は実測</strong>（APIレビュー 1.0h + その他工程 合計 0.7h）。APIレビューは人がコードを確認する工数として AsIs / ToBe とも 1.0h でそろえている。",
      tasks: [
        { key: "data-design", label: "データモデル設計",        color: "var(--c-data-design)", loc: null, asis: 3.4,  tobe: 0.1, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "data-impl",   label: "データモデル実装",        color: "var(--c-data-impl)",   loc: 143,  asis: 5.2,  tobe: 0.1, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "api-impl",    label: "API設計・実装",           color: "var(--c-api-impl)",    loc: 624,  asis: 13.5, tobe: 0.3, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-test",    label: "API単体テスト",           color: "var(--c-api-test)",    loc: 377,  asis: 5.2,  tobe: 0.2, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-review",  label: "APIレビュー (エンジニア)", color: "var(--c-eng-review)",  loc: null, asis: 1.0,  tobe: 1.0, tobeEng: 1.0, agents: ["バックエンドレビュワーAI", "エンジニア"] },
      ],
      contextNotes: [
        "対象: 顧客(m_customer) のマスタ。入力画面を持たないバックエンド(Prisma スキーマ + Service)生成枠で、画面実装の完了判定には含めない別グループ（出典: <code>.work/table_gap.md</code> ＋ データモデル設計書）。",
        "<strong>実績コード量</strong>: DBスキーマ <strong>143行</strong> / バックエンド実装 <strong>624行</strong> / ユニットテスト <strong>377行</strong>（計 1,144行）。工程区分はお知らせ登録(FE015)のデータモデル設計〜APIレビューを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行）。データモデル設計はデータ実装の規模比で按分。APIレビューは人の確認工数として AsIs / ToBe とも 1.0h でそろえる。合計 約28.3h。",
        "<strong>ToBe（AI駆動）は実測 1.7h</strong>: APIレビュー 1.0h（エンジニア）＋ その他工程（設計・実装・テスト生成）合計 0.7h（AI）。削減率 約94%。レビューはAIが書いたコードを人が確認する工数で AsIs と同水準。",
        "想定バグ数は未記入（バックエンド生成のため別途記録予定）。",
      ],
    },
    // カレンダー(m_business_date) のマスタ (5項目)。荷主(wi-be-2)と同じ構成。
    // 実績LOC: DBスキーマ(data-impl) 34 / バックエンド実装(api-impl) 269 / ユニットテスト(api-test) 314 (計617行)。
    // AsIs: お知らせ登録の「行あたり工数」を実績LOCに適用 (data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行)。
    //       data-design はデータ実装の規模比 (34/166) で按分、api-review は人の確認工数として ToBe とそろえる。
    // ToBe: APIレビュー 0.5h(エンジニア) + その他工程 合計 0.5h(AI)。
    'wi-be-13': {
      lede: "<strong>カレンダー</strong>(<code>m_business_date</code>) のマスタを<strong>バックエンドのみ生成</strong>（入力画面なし・5項目）。実績コード量は計 <strong>617行</strong>（DBスキーマ 34 / バックエンド実装 269 / ユニットテスト 314）。工程はお知らせ登録(FE015)の「データモデル設計〜APIレビュー」に準拠。<strong>AsIs は行数規模から推定</strong>、<strong>ToBe は実測</strong>（APIレビュー 0.5h + その他工程 合計 0.5h）。APIレビューは人がコードを確認する工数として AsIs / ToBe とも 0.5h でそろえている。",
      tasks: [
        { key: "data-design", label: "データモデル設計",        color: "var(--c-data-design)", loc: null, asis: 0.8, tobe: 0.1, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "data-impl",   label: "データモデル実装",        color: "var(--c-data-impl)",   loc: 34,   asis: 1.2, tobe: 0.1, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "api-impl",    label: "API設計・実装",           color: "var(--c-api-impl)",    loc: 269,  asis: 5.8, tobe: 0.2, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-test",    label: "API単体テスト",           color: "var(--c-api-test)",    loc: 314,  asis: 4.3, tobe: 0.1, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-review",  label: "APIレビュー (エンジニア)", color: "var(--c-eng-review)",  loc: null, asis: 0.5, tobe: 0.5, tobeEng: 0.5, agents: ["バックエンドレビュワーAI", "エンジニア"] },
      ],
      contextNotes: [
        "対象: カレンダー(m_business_date) のマスタ。入力画面を持たないバックエンド(Prisma スキーマ + Service)生成枠で、画面実装の完了判定には含めない別グループ（出典: <code>.work/table_gap.md</code> ＋ データモデル設計書）。",
        "<strong>実績コード量</strong>: DBスキーマ <strong>34行</strong> / バックエンド実装 <strong>269行</strong> / ユニットテスト <strong>314行</strong>（計 617行）。工程区分はお知らせ登録(FE015)のデータモデル設計〜APIレビューを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行）。データモデル設計はデータ実装の規模比で按分。APIレビューは人の確認工数として AsIs / ToBe とも 0.5h でそろえる。合計 約12.6h。",
        "<strong>ToBe（AI駆動）は実測 1.0h</strong>: APIレビュー 0.5h（エンジニア）＋ その他工程（設計・実装・テスト生成）合計 0.5h（AI）。削減率 約92%。レビューはAIが書いたコードを人が確認する工数で AsIs と同水準。",
        "想定バグ数は未記入（バックエンド生成のため別途記録予定）。",
      ],
    },
    // 水源・出荷元・メーカー・パレット・地域 の 5 マスタ (27項目)。荷主(wi-be-2)・顧客(wi-be-0)と同じ構成。
    // 実績LOC: DBスキーマ(data-impl) 278 / バックエンド実装(api-impl) 1,225 / ユニットテスト(api-test) 1,125 (計2,628行)。
    // AsIs: お知らせ登録の「行あたり工数」を実績LOCに適用 (data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行)。
    //       data-design はデータ実装の規模比 (6/166→×4/6) で按分、api-review は人の確認工数として ToBe とそろえる。
    //       5テーブルが同一パターンで重複が大きいため、実装系4工程は約3割控除 (×0.7)。api-review は据え置き。
    // ToBe: APIレビュー 1.0h(エンジニア) + その他工程 合計 0.7h(AI)。顧客(wi-be-0)と同構成。
    'wi-be-10': {
      lede: "<strong>水源・出荷元・メーカー・パレット・地域</strong> の 5 マスタを<strong>バックエンドのみ生成</strong>（入力画面なし・27項目）。実績コード量は計 <strong>2,628行</strong>（DBスキーマ 278 / バックエンド実装 1,225 / ユニットテスト 1,125）。工程はお知らせ登録(FE015)の「データモデル設計〜APIレビュー」に準拠。<strong>AsIs は行数規模から推定</strong>。<strong>ToBe は APIレビュー 1.0h + その他工程 合計 0.7h</strong>。APIレビューは人がコードを確認する工数として AsIs / ToBe とも 1.0h でそろえている。",
      tasks: [
        { key: "data-design", label: "データモデル設計",        color: "var(--c-data-design)", loc: null, asis: 4.7,  tobe: 0.1, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "data-impl",   label: "データモデル実装",        color: "var(--c-data-impl)",   loc: 278,  asis: 7.0,  tobe: 0.1, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "api-impl",    label: "API設計・実装",           color: "var(--c-api-impl)",    loc: 1225, asis: 18.6, tobe: 0.3, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-test",    label: "API単体テスト",           color: "var(--c-api-test)",    loc: 1125, asis: 10.8, tobe: 0.2, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-review",  label: "APIレビュー (エンジニア)", color: "var(--c-eng-review)",  loc: null, asis: 1.0,  tobe: 1.0, tobeEng: 1.0, agents: ["バックエンドレビュワーAI", "エンジニア"] },
      ],
      contextNotes: [
        "対象: 水源・出荷元・メーカー・パレット・地域 の 5 マスタ（計 27 項目）。入力画面を持たないバックエンド(Prisma スキーマ + Service)生成枠で、画面実装の完了判定には含めない別グループ（出典: <code>.work/table_gap.md</code> ＋ データモデル設計書）。",
        "<strong>実績コード量</strong>: DBスキーマ <strong>278行</strong> / バックエンド実装 <strong>1,225行</strong> / ユニットテスト <strong>1,125行</strong>（計 2,628行）。工程区分はお知らせ登録(FE015)のデータモデル設計〜APIレビューを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行）。データモデル設計はデータ実装の規模比で按分。<strong>5 テーブルが同一パターンで重複が大きいため、実装系4工程は約 3 割を控除</strong>（設計 6.7→4.7 / 実装 10.0→7.0 / API実装 26.6→18.6 / API単体テスト 15.4→10.8）。APIレビューは人の確認工数として AsIs / ToBe とも 1.0h でそろえる。合計 約42.1h。",
        "<strong>ToBe（AI駆動）は計 1.7h</strong>: APIレビュー 1.0h（エンジニア）＋ その他工程（設計・実装・テスト生成）合計 0.7h（AI）。削減率 約96%。レビューはAIが書いたコードを人が確認する工数で AsIs と同水準。",
        "想定バグ数は未記入（バックエンド生成のため別途記録予定）。",
      ],
    },
    // 配送会社(m_business) のマスタ (12項目)。荷主(wi-be-2)・カレンダー(wi-be-13)と同じ構成。
    // 実績LOC: DBスキーマ(data-impl) 43 / バックエンド実装(api-impl) 311 / ユニットテスト(api-test) 245 (計599行)。
    // AsIs: お知らせ登録の「行あたり工数」を実績LOCに適用 (data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行)。
    //       data-design はお知らせ登録の設計 4h をデータ実装の規模比 (43/166) で按分、api-review は人の確認工数として ToBe とそろえる。
    // ToBe: APIレビュー 0.5h(エンジニア) + その他工程 合計 0.5h(AI)。
    'wi-be-3': {
      lede: "<strong>配送会社</strong>(<code>m_business</code>) のマスタを<strong>バックエンドのみ生成</strong>（入力画面なし・12項目）。実績コード量は計 <strong>599行</strong>（DBスキーマ 43 / バックエンド実装 311 / ユニットテスト 245）。工程はお知らせ登録(FE015)の「データモデル設計〜APIレビュー」に準拠。<strong>AsIs は行数規模から推定</strong>、<strong>ToBe は実測</strong>（APIレビュー 0.5h + その他工程 合計 0.5h）。APIレビューは人がコードを確認する工数として AsIs / ToBe とも 0.5h でそろえている。",
      tasks: [
        { key: "data-design", label: "データモデル設計",        color: "var(--c-data-design)", loc: null, asis: 1.0,  tobe: 0.1, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "data-impl",   label: "データモデル実装",        color: "var(--c-data-impl)",   loc: 43,   asis: 1.6,  tobe: 0.1, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "api-impl",    label: "API設計・実装",           color: "var(--c-api-impl)",    loc: 311,  asis: 6.7,  tobe: 0.2, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-test",    label: "API単体テスト",           color: "var(--c-api-test)",    loc: 245,  asis: 3.3,  tobe: 0.1, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-review",  label: "APIレビュー (エンジニア)", color: "var(--c-eng-review)",  loc: null, asis: 0.5,  tobe: 0.5, tobeEng: 0.5, agents: ["バックエンドレビュワーAI", "エンジニア"] },
      ],
      contextNotes: [
        "対象: 配送会社(m_business) のマスタ。入力画面を持たないバックエンド(Prisma スキーマ + Service)生成枠で、画面実装の完了判定には含めない別グループ（出典: <code>.work/table_gap.md</code> ＋ データモデル設計書）。",
        "<strong>実績コード量</strong>: DBスキーマ <strong>43行</strong> / バックエンド実装 <strong>311行</strong> / ユニットテスト <strong>245行</strong>（計 599行）。工程区分はお知らせ登録(FE015)のデータモデル設計〜APIレビューを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行）。データモデル設計はデータ実装の規模比で按分。APIレビューは人の確認工数として AsIs / ToBe とも 0.5h でそろえる。合計 約13.1h。",
        "<strong>ToBe（AI駆動）は実測 1.0h</strong>: APIレビュー 0.5h（エンジニア）＋ その他工程（設計・実装・テスト生成）合計 0.5h（AI）。削減率 約92%。レビューはAIが書いたコードを人が確認する工数で AsIs と同水準。",
        "想定バグ数は未記入（バックエンド生成のため別途記録予定）。",
      ],
    },
    // 配送ステータス のマスタ (9項目)。荷主(wi-be-2)・配送会社(wi-be-3)と同じ構成。
    // 実績LOC: DBスキーマ(data-impl) 125 / バックエンド実装(api-impl) 326 / ユニットテスト(api-test) 285 (計736行)。
    // AsIs: お知らせ登録の「行あたり工数」を実績LOCに適用 (data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行)。
    //       data-design はお知らせ登録の設計 4h をデータ実装の規模比 (125/166) で按分、api-review は人の確認工数として ToBe とそろえる。
    // ToBe: APIレビュー 0.5h(エンジニア) + その他工程 合計 0.5h(AI)。
    'wi-be-7': {
      lede: "<strong>配送ステータス</strong> のマスタを<strong>バックエンドのみ生成</strong>（入力画面なし・9項目）。実績コード量は計 <strong>736行</strong>（DBスキーマ 125 / バックエンド実装 326 / ユニットテスト 285）。工程はお知らせ登録(FE015)の「データモデル設計〜APIレビュー」に準拠。<strong>AsIs は行数規模から推定</strong>、<strong>ToBe は実測</strong>（APIレビュー 0.5h + その他工程 合計 0.5h）。APIレビューは人がコードを確認する工数として AsIs / ToBe とも 0.5h でそろえている。",
      tasks: [
        { key: "data-design", label: "データモデル設計",        color: "var(--c-data-design)", loc: null, asis: 3.0,  tobe: 0.1, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "data-impl",   label: "データモデル実装",        color: "var(--c-data-impl)",   loc: 125,  asis: 4.5,  tobe: 0.1, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "api-impl",    label: "API設計・実装",           color: "var(--c-api-impl)",    loc: 326,  asis: 7.1,  tobe: 0.2, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-test",    label: "API単体テスト",           color: "var(--c-api-test)",    loc: 285,  asis: 3.9,  tobe: 0.1, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-review",  label: "APIレビュー (エンジニア)", color: "var(--c-eng-review)",  loc: null, asis: 0.5,  tobe: 0.5, tobeEng: 0.5, agents: ["バックエンドレビュワーAI", "エンジニア"] },
      ],
      contextNotes: [
        "対象: 配送ステータス のマスタ。入力画面を持たないバックエンド(Prisma スキーマ + Service)生成枠で、画面実装の完了判定には含めない別グループ（出典: <code>.work/table_gap.md</code> ＋ データモデル設計書）。",
        "<strong>実績コード量</strong>: DBスキーマ <strong>125行</strong> / バックエンド実装 <strong>326行</strong> / ユニットテスト <strong>285行</strong>（計 736行）。工程区分はお知らせ登録(FE015)のデータモデル設計〜APIレビューを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行）。データモデル設計はデータ実装の規模比で按分。APIレビューは人の確認工数として AsIs / ToBe とも 0.5h でそろえる。合計 約19.0h。",
        "<strong>ToBe（AI駆動）は実測 1.0h</strong>: APIレビュー 0.5h（エンジニア）＋ その他工程（設計・実装・テスト生成）合計 0.5h（AI）。削減率 約95%。レビューはAIが書いたコードを人が確認する工数で AsIs と同水準。",
        "想定バグ数は未記入（バックエンド生成のため別途記録予定）。",
      ],
    },
    // 帳票ファイル(t_report_management) のトランザクション (12項目)。荷主(wi-be-2)・配送会社(wi-be-3)と同じ構成。
    // 実績LOC: DBスキーマ(data-impl) 72 / バックエンド実装(api-impl) 324 / ユニットテスト(api-test) 188 (計584行)。
    // AsIs: お知らせ登録の「行あたり工数」を実績LOCに適用 (data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行)。
    //       data-design はお知らせ登録の設計 4h をデータ実装の規模比 (72/166) で按分、api-review は人の確認工数として ToBe とそろえる。
    // ToBe: APIレビュー 0.7h(エンジニア) + その他工程 合計 0.4h(AI)。
    'wi-be-4': {
      lede: "<strong>帳票ファイル</strong>(<code>t_report_management</code>) のトランザクションテーブルを<strong>バックエンドのみ生成</strong>（入力画面なし・12項目）。実績コード量は計 <strong>584行</strong>（DBスキーマ 72 / バックエンド実装 324 / ユニットテスト 188）。工程はお知らせ登録(FE015)の「データモデル設計〜APIレビュー」に準拠。<strong>AsIs は行数規模から推定</strong>、<strong>ToBe は実測</strong>（APIレビュー 0.7h + その他工程 合計 0.4h）。APIレビューは人がコードを確認する工数として AsIs / ToBe とも 0.7h でそろえている。",
      tasks: [
        { key: "data-design", label: "データモデル設計",        color: "var(--c-data-design)", loc: null, asis: 1.7,  tobe: 0.1, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "data-impl",   label: "データモデル実装",        color: "var(--c-data-impl)",   loc: 72,   asis: 2.6,  tobe: 0.1, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "api-impl",    label: "API設計・実装",           color: "var(--c-api-impl)",    loc: 324,  asis: 7.0,  tobe: 0.1, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-test",    label: "API単体テスト",           color: "var(--c-api-test)",    loc: 188,  asis: 2.6,  tobe: 0.1, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-review",  label: "APIレビュー (エンジニア)", color: "var(--c-eng-review)",  loc: null, asis: 0.7,  tobe: 0.7, tobeEng: 0.7, agents: ["バックエンドレビュワーAI", "エンジニア"] },
      ],
      contextNotes: [
        "対象: 帳票ファイル(t_report_management) のトランザクションテーブル。入力画面を持たないバックエンド(Prisma スキーマ + Service)生成枠で、画面実装の完了判定には含めない別グループ（出典: <code>.work/table_gap.md</code> ＋ データモデル設計書）。",
        "<strong>実績コード量</strong>: DBスキーマ <strong>72行</strong> / バックエンド実装 <strong>324行</strong> / ユニットテスト <strong>188行</strong>（計 584行）。工程区分はお知らせ登録(FE015)のデータモデル設計〜APIレビューを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行）。データモデル設計はデータ実装の規模比で按分。APIレビューは人の確認工数として AsIs / ToBe とも 0.7h でそろえる。合計 約14.6h。",
        "<strong>ToBe（AI駆動）は実測 1.1h</strong>: APIレビュー 0.7h（エンジニア）＋ その他工程（設計・実装・テスト生成）合計 0.4h（AI）。削減率 約92%。レビューはAIが書いたコードを人が確認する工数で AsIs と同水準。",
        "想定バグ数は未記入（バックエンド生成のため別途記録予定）。",
      ],
    },
    // 幹線 のトランザクション (8項目)。荷主(wi-be-2)・配送会社(wi-be-3)と同じ構成。
    // 実績LOC: DBスキーマ(data-impl) 103 / バックエンド実装(api-impl) 379 / ユニットテスト(api-test) 284 (計766行)。
    // AsIs: お知らせ登録の「行あたり工数」を実績LOCに適用 (data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行)。
    //       data-design はお知らせ登録の設計 4h をデータ実装の規模比 (103/166) で按分、api-review は人の確認工数として ToBe とそろえる。
    // ToBe: APIレビュー 0.75h(エンジニア) + その他工程 合計 0.75h(AI)。
    'wi-be-9': {
      lede: "<strong>幹線</strong> のトランザクションテーブルを<strong>バックエンドのみ生成</strong>（入力画面なし・8項目）。実績コード量は計 <strong>766行</strong>（DBスキーマ 103 / バックエンド実装 379 / ユニットテスト 284）。工程はお知らせ登録(FE015)の「データモデル設計〜APIレビュー」に準拠。<strong>AsIs は行数規模から推定</strong>、<strong>ToBe は実測</strong>（APIレビュー 0.75h + その他工程 合計 0.75h）。APIレビューは人がコードを確認する工数として AsIs / ToBe とも 0.75h でそろえている。",
      tasks: [
        { key: "data-design", label: "データモデル設計",        color: "var(--c-data-design)", loc: null, asis: 2.5,  tobe: 0.10, tobeEng: 0,    agents: ["DBアーキテクトAI"] },
        { key: "data-impl",   label: "データモデル実装",        color: "var(--c-data-impl)",   loc: 103,  asis: 3.7,  tobe: 0.15, tobeEng: 0,    agents: ["DBアーキテクトAI"] },
        { key: "api-impl",    label: "API設計・実装",           color: "var(--c-api-impl)",    loc: 379,  asis: 8.2,  tobe: 0.30, tobeEng: 0,    agents: ["バックエンドAI"] },
        { key: "api-test",    label: "API単体テスト",           color: "var(--c-api-test)",    loc: 284,  asis: 3.9,  tobe: 0.20, tobeEng: 0,    agents: ["バックエンドAI"] },
        { key: "api-review",  label: "APIレビュー (エンジニア)", color: "var(--c-eng-review)",  loc: null, asis: 0.75, tobe: 0.75, tobeEng: 0.75, agents: ["バックエンドレビュワーAI", "エンジニア"] },
      ],
      contextNotes: [
        "対象: 幹線 のトランザクションテーブル。入力画面を持たないバックエンド(Prisma スキーマ + Service)生成枠で、画面実装の完了判定には含めない別グループ（出典: <code>.work/table_gap.md</code> ＋ データモデル設計書）。",
        "<strong>実績コード量</strong>: DBスキーマ <strong>103行</strong> / バックエンド実装 <strong>379行</strong> / ユニットテスト <strong>284行</strong>（計 766行）。工程区分はお知らせ登録(FE015)のデータモデル設計〜APIレビューを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行）。データモデル設計はデータ実装の規模比で按分。APIレビューは人の確認工数として AsIs / ToBe とも 0.75h でそろえる。合計 約19.1h。",
        "<strong>ToBe（AI駆動）は実測 1.5h</strong>: APIレビュー 0.75h（エンジニア）＋ その他工程（設計・実装・テスト生成）合計 0.75h（AI）。削減率 約92%。レビューはAIが書いたコードを人が確認する工数で AsIs と同水準。",
        "想定バグ数は未記入（バックエンド生成のため別途記録予定）。",
      ],
    },
    // バッチログ の履歴テーブル (9項目)。荷主(wi-be-2)・配送ステータス(wi-be-7)と同じ構成。
    // 実績LOC: DBスキーマ(data-impl) 69 / バックエンド実装(api-impl) 318 / ユニットテスト(api-test) 190 (計577行)。
    // AsIs: お知らせ登録の「行あたり工数」を実績LOCに適用 (data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行)。
    //       data-design はお知らせ登録の設計 4h をデータ実装の規模比 (69/166) で按分、api-review は人の確認工数として ToBe とそろえる。
    // ToBe: APIレビュー 0.7h(エンジニア) + その他工程 合計 0.7h(AI実装実測)。
    'wi-be-8': {
      lede: "<strong>バッチログ</strong> の履歴テーブルを<strong>バックエンドのみ生成</strong>（入力画面なし・9項目）。実績コード量は計 <strong>577行</strong>（DBスキーマ 69 / バックエンド実装 318 / ユニットテスト 190）。工程はお知らせ登録(FE015)の「データモデル設計〜APIレビュー」に準拠。<strong>AsIs は行数規模から推定</strong>、<strong>ToBe は実測</strong>（AI実装 0.7h + APIレビュー 0.7h）。APIレビューは人がコードを確認する工数として AsIs / ToBe とも 0.7h でそろえている。",
      tasks: [
        { key: "data-design", label: "データモデル設計",        color: "var(--c-data-design)", loc: null, asis: 1.7, tobe: 0.1, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "data-impl",   label: "データモデル実装",        color: "var(--c-data-impl)",   loc: 69,   asis: 2.5, tobe: 0.1, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "api-impl",    label: "API設計・実装",           color: "var(--c-api-impl)",    loc: 318,  asis: 6.9, tobe: 0.4, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-test",    label: "API単体テスト",           color: "var(--c-api-test)",    loc: 190,  asis: 2.6, tobe: 0.1, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-review",  label: "APIレビュー (エンジニア)", color: "var(--c-eng-review)",  loc: null, asis: 0.7, tobe: 0.7, tobeEng: 0.7, agents: ["バックエンドレビュワーAI", "エンジニア"] },
      ],
      contextNotes: [
        "対象: バッチログ の履歴テーブル。入力画面を持たないバックエンド(Prisma スキーマ + Service)生成枠で、画面実装の完了判定には含めない別グループ（出典: <code>.work/table_gap.md</code> ＋ データモデル設計書）。",
        "<strong>実績コード量</strong>: DBスキーマ <strong>69行</strong> / バックエンド実装 <strong>318行</strong> / ユニットテスト <strong>190行</strong>（計 577行）。工程区分はお知らせ登録(FE015)のデータモデル設計〜APIレビューを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行）。データモデル設計はデータ実装の規模比で按分。APIレビューは人の確認工数として AsIs / ToBe とも 0.7h でそろえる。合計 約14.4h。",
        "<strong>ToBe（AI駆動）は実測 1.4h</strong>: AI実装 0.7h（設計・実装・テスト生成）＋ APIレビュー 0.7h（エンジニア）。削減率 約90%。レビューはAIが書いたコードを人が確認する工数で AsIs と同水準。",
        "想定バグ数は未記入（バックエンド生成のため別途記録予定）。",
      ],
    },
  };
  Object.entries(BACKEND_OVERRIDES).forEach(([key, override]) => {
    const s = scenarios[key];
    if (!s) return;
    Object.assign(s, override);
    s._template = false;
  });

  scenarios.total = buildTotalScenario(scenarios, REAL_KEYS_FOR_TOTAL);
  const REAL_KEYS_TABS = REAL_KEYS.filter(k => !MERGE_MAP[k]);
  const TAB_ORDER = ["total", ...REAL_KEYS_TABS, ..._wi.keys];
  // BACKEND_TASKS のタブをデポマスタ (wi-screen-DM07FE021) の直前に挿入
  if (_be.keys.length) {
    const depotIdx = TAB_ORDER.indexOf('wi-screen-DM07FE021');
    TAB_ORDER.splice(depotIdx >= 0 ? depotIdx : 1, 0, ..._be.keys);
  }
