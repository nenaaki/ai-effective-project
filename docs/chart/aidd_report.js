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
    const taskKeys   = ["data-design","data-impl","api-impl","api-test","api-review","ux","fe-design","fe-impl","fe-test","fe-review","verify","api-optimize","layout-adjust","func-adjust","spec-confirm","trial-spec-analysis","trial-review","structure-improvement"];
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
      "api-optimize":  "API最適化",
      "layout-adjust": "レイアウト調整・仮実装",
      "func-adjust":   "機能調整",
      "spec-confirm": "仕様確認",
      "trial-spec-analysis":   "[試行特有] 仕様解析",
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
    // 帳票・ファイル出力 (処理区分が DL・印刷) は処理単位で個別タブにする。
    // (groupTasks 側で DL・印刷 は非グルーピング=処理ごとに1行で来るため、ここで処理名ラベルの個別シナリオ化)
    const fileioSeq = {};
    groupedScreens.forEach(row => {
      const id  = row.管理ID || row.画面ID;
      if (!id) return;
      const proc = row.処理区分 || "";
      const isFileIO = proc.indexOf("DL") >= 0 || proc.indexOf("印刷") >= 0;
      if (isFileIO) {
        fileioSeq[id] = (fileioSeq[id] || 0) + 1;
        const key = `wi-fileio-${id}-${fileioSeq[id]}`;
        if (scenarios[key]) return;
        scenarios[key] = createTemplateScenario(row.処理名 || row.画面名 || id, 'screen');
        keys.push(key);
        return;
      }
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
    // 配送ログCSV出力 (FE050 / DM14 帳票・ファイル出力) - データ出力・抽出の CSV ダウンロードの一つ。
    // 実績コード量: フロントエンド 188 行 (DB/API/テストなし)。
    // AsIs: 今回は行数だけでは測れない (配送ログの抽出条件・出力仕様の解釈が重い)。行数ベース試算
    //       (お知らせ登録 fe-impl 33.5h/1694行 → 3.7h) に対し、人力なら約2倍と判断し fe-impl 7.4h。
    // ToBe: AI 実測 1.0h (配送ログ workitem 実工数と一致)。削減率 約87%。
    'wi-fileio-DM14FE050-1': {
      lede: "<strong>配送ログCSV出力</strong>（FE050 / DM14 帳票・ファイル入出力）の開発工数比較。<strong>データ出力・抽出の配送ログ CSV ダウンロード</strong>機能。実績コード量はフロントエンド <strong>188 行</strong>のみ（DB/API/テストなし）。<strong>AsIs は今回、行数だけでは測れない</strong>: 配送ログの抽出条件・出力仕様の解釈が重く、行数ベースの試算（お知らせ登録(FE015) の行あたり工数を適用し 3.7h）に対し <strong>人力なら約2倍</strong>と判断して fe-impl 7.4h とした。<strong>ToBe は実績 1.0h</strong>。削減率 <strong>約87%</strong>。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                          color: "#ef4444", asis: 0, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (抽出条件・整形)",          color: "#f59e0b", asis: 1, tobe: 0 },
        { key: "edge",   label: "エッジケース漏れ (空・大量件数・文字コード)", color: "#8b5cf6", asis: 1, tobe: 1 },
        { key: "spec",   label: "仕様解釈ミス (抽出条件・出力項目の解釈)", color: "#ec4899", asis: 2, tobe: 1 },
        { key: "ui",     label: "UI 細部の不整合 (DLボタン・ファイル名)",  color: "#06b6d4", asis: 0, tobe: 0 },
      ],
      bugRateNote: "※ 配送ログCSV出力 約 0.19 KLOC × 参考レート（人力 12/KLOC ≒ 2件 / AI 5/KLOC ≒ 1件）で推定。配送ログの CSV ダウンロードで、論点は <strong>抽出条件・出力項目の解釈</strong>。行数のわりに業務ログの抽出仕様が重く、AsIs は行数試算より上振れする。",
      tasks: {
        'fe-impl':     { asis: 7.4,  loc: 188,  tobe: 1.0,  tobeEng: 0,   agents: ["フロントエンドAI"] },
      },
      contextNotes: [
        "対象: 配送ログCSV出力（FE050 / DM14 帳票・ファイル入出力）。データ出力・抽出の配送ログ CSV ダウンロード機能。",
        "<strong>実績コード量</strong>: フロントエンド <strong>188 行</strong>のみ（DB 0・API 0・ユニットテスト 0）。",
        "<strong>AsIs（人力想定）は行数だけでは測れない</strong>: 行数ベース試算（お知らせ登録の行あたり工数 fe-impl 33.5h/1694行 → 188行で 3.7h）では過小。配送ログの抽出条件・出力仕様の解釈が重く、<strong>人力なら約2倍</strong>と判断して fe-impl 7.4h とした。",
        "<strong>ToBe（AI駆動）は実績 1.0h</strong>（配送ログ workitem 実工数と一致）。削減率 <strong>約87%</strong>。レビュー・動作確認の工数は今回未計上（フロント実装工程のみの比較）。",
      ],
    },
    // 集計用リストCSV出力 (FE050 / DM14 帳票・ファイル出力) - データ出力・抽出の CSV ダウンロードの一つ。
    // 実績コード量: API 103 / フロントエンド 904 行 (DB/テストなし)。
    // AsIs: お知らせ登録(FE015) の行あたり工数を実績LOCに適用 (api-impl 8h/369行・fe-impl 33.5h/1694行)。fe-design/UX は按分過小のため実態値。合計 約25.1h。
    // ToBe: AI 1.5h + APIレビュー 0.25h + フロントレビュー 0.5h + 動作確認 0.75h = 3.0h (実績)。
    'wi-fileio-DM14FE050-4': {
      lede: "<strong>集計用リストCSV出力</strong>（FE050 / DM14 帳票・ファイル入出力）の開発工数比較。<strong>データ出力・抽出の集計用リスト CSV ダウンロード</strong>。実績コード量は API <strong>103 行</strong>・フロントエンド <strong>904 行</strong>（DB/テストなし）。<strong>AsIs は行数規模から推定</strong>（お知らせ登録(FE015) の行あたり工数を適用）。ただし UX設計 2.5h・フロント設計 1.0h は規模比按分では過小なため実態に合わせて設定。合計 約25.1h。<strong>ToBe は実績</strong>（AI 1.5h ＋ APIレビュー 0.25h ＋ フロントレビュー 0.5h ＋ 動作確認 0.75h ＝ 3.0h）。削減率 <strong>約88%</strong>。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                          color: "#ef4444", asis: 1, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (抽出条件・集計ロジック)",    color: "#f59e0b", asis: 4, tobe: 2 },
        { key: "edge",   label: "エッジケース漏れ (空・大量件数・文字コード)", color: "#8b5cf6", asis: 3, tobe: 1 },
        { key: "spec",   label: "仕様解釈ミス (集計仕様・出力項目の解釈)",  color: "#ec4899", asis: 2, tobe: 2 },
        { key: "ui",     label: "UI 細部の不整合 (抽出条件UI・DLボタン)",   color: "#06b6d4", asis: 2, tobe: 0 },
      ],
      bugRateNote: "※ 集計用リストCSV出力 約 1.0 KLOC × 参考レート（人力 12/KLOC ≒ 12件 / AI 5/KLOC ≒ 5件）で推定。集計用リストの CSV ダウンロードで、論点は <strong>抽出条件・集計仕様・出力項目の解釈</strong>。AI でも業務固有の集計ルールは仕様で明示しないと <strong>仕様解釈ミス</strong> が残りやすい。",
      tasks: {
        'api-impl':    { asis: 2.2,  loc: 103,  tobe: 0.15, tobeEng: 0,   agents: ["バックエンドAI"] },
        'ux':          { asis: 2.5,             tobe: 0.1,  tobeEng: 0,   agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 1.0,             tobe: 0.1,  tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 17.9, loc: 904,  tobe: 1.15, tobeEng: 0,   agents: ["フロントエンドAI"] },
        'api-review':  { asis: 0.25,            tobe: 0.25, tobeEng: 0.25, agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'fe-review':   { asis: 0.5,             tobe: 0.5,  tobeEng: 0.5, agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 0.75,            tobe: 0.75, tobeEng: 0.75, agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
      },
      contextNotes: [
        "対象: 集計用リストCSV出力（FE050 / DM14 帳票・ファイル入出力）。データ出力・抽出の集計用リスト CSV ダウンロード機能。",
        "<strong>実績コード量</strong>: API <strong>103 行</strong> / フロントエンド <strong>904 行</strong>（DB 0・ユニットテスト 0）。工程区分はお知らせ登録(FE015)のフォーマットを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（api-impl 8h/369行 → 2.2h・fe-impl 33.5h/1694行 → 17.9h）。UX（2.5h）・フロント設計（1.0h）は規模比按分では過小なため実態に合わせて設定。APIレビュー・フロントレビュー・動作確認は人の確認工数として AsIs / ToBe をそろえる（各0.25h / 0.5h / 0.75h）。合計 約25.1h。",
        "<strong>ToBe（AI駆動）は実績 3.0h</strong>: AI 1.5h（API実装 0.15 / FE実装 1.15 / UX 0.1 / FE設計 0.1）＋ APIレビュー 0.25h（エンジニア）＋ フロントレビュー 0.5h（エンジニア）＋ 動作確認 0.75h（エンジニア）。削減率 <strong>約88%</strong>。",
      ],
    },
    // 代引き一覧Excel出力 (FE053 / DM14 帳票・ファイル出力) - 代引き確認(DL)の Excel ダウンロード。
    // 実績コード量: フロントエンド 179 行のみ (DB/API/テストなし)。
    // AsIs: お知らせ登録(FE015) の行あたり工数を実績LOCに適用 (fe-impl 33.5h/1694行)。fe-design/UX は按分過小のため実態値。合計 約6.0h。
    // ToBe: AI 0.5h + フロントレビュー 0.25h + 動作確認 0.25h = 1.0h (実績)。
    'wi-fileio-DM14FE053-1': {
      lede: "<strong>代引き一覧Excel出力</strong>（FE053 / DM14 帳票・ファイル入出力）の開発工数比較。<strong>代引き確認(DL)の Excel ダウンロード</strong>機能。実績コード量はフロントエンド <strong>179 行</strong>のみ（DB/API/テストなし）。<strong>AsIs は行数規模から推定</strong>（お知らせ登録(FE015) の行あたり工数を適用）。ただし UX設計 1.5h・フロント設計 0.5h は規模比按分では過小なため実態に合わせて設定。合計 約6.0h。<strong>ToBe は実績</strong>（AI 0.5h ＋ フロントレビュー 0.25h ＋ 動作確認 0.25h ＝ 1.0h）。削減率 <strong>約83%</strong>。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                          color: "#ef4444", asis: 0, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (出力項目・整形)",          color: "#f59e0b", asis: 1, tobe: 0 },
        { key: "edge",   label: "エッジケース漏れ (空・大量件数・文字コード)", color: "#8b5cf6", asis: 1, tobe: 0 },
        { key: "spec",   label: "仕様解釈ミス (出力項目・フォーマットの解釈)", color: "#ec4899", asis: 1, tobe: 1 },
        { key: "ui",     label: "UI 細部の不整合 (DLボタン・ファイル名)",  color: "#06b6d4", asis: 0, tobe: 0 },
      ],
      bugRateNote: "※ 代引き一覧Excel出力 約 0.18 KLOC × 参考レート（人力 12/KLOC ≒ 2件 / AI 5/KLOC ≒ 1件）で推定。代引き一覧の Excel ダウンロードで、論点は <strong>出力項目・フォーマットの解釈</strong>。",
      tasks: {
        'ux':          { asis: 1.5,             tobe: 0.05, tobeEng: 0,   agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 0.5,             tobe: 0.05, tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 3.5,  loc: 179,  tobe: 0.4,  tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-review':   { asis: 0.25,            tobe: 0.25, tobeEng: 0.25, agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 0.25,            tobe: 0.25, tobeEng: 0.25, agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
      },
      contextNotes: [
        "対象: 代引き一覧Excel出力（FE053 / DM14 帳票・ファイル入出力）。代引き確認(DL)の Excel ダウンロード機能。",
        "<strong>実績コード量</strong>: フロントエンド <strong>179 行</strong>のみ（DB 0・API 0・ユニットテスト 0）。工程区分はお知らせ登録(FE015)のフォーマットを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（fe-impl 33.5h/1694行 → 3.5h）。UX（1.5h）・フロント設計（0.5h）は規模比按分では過小なため実態に合わせて設定。フロントレビュー・動作確認は人の確認工数として AsIs / ToBe をそろえる（各0.25h）。合計 約6.0h。",
        "<strong>ToBe（AI駆動）は実績 1.0h</strong>: AI 0.5h（FE実装 0.4 / UX 0.05 / FE設計 0.05）＋ フロントレビュー 0.25h（エンジニア）＋ 動作確認 0.25h（エンジニア）。削減率 <strong>約83%</strong>。",
      ],
    },
    // 集計用 (IF / PR03) - データ出力の集計用リスト（IF側）。実績コード量: API 747 / フロントエンド 1122 行。
    // AsIs: お知らせ登録(FE015) の行あたり工数を実績LOCに適用 (api-impl 8h/369行・fe-impl 33.5h/1694行)。UX/FE設計は按分過小のため実態値。合計 約43.4h。
    // ToBe: 4h (AI 2.5h + APIレビュー 0.25h + フロントレビュー 0.5h + 動作確認 0.75h)。
    'wi-if-PR03': {
      lede: "<strong>集計用（IF / PR03）</strong>の開発工数比較。<strong>集計用リストのデータ出力インターフェース</strong>。実績コード量は API <strong>747 行</strong>・フロントエンド <strong>1,122 行</strong>（DB/テストなし）。<strong>AsIs は行数規模から推定</strong>（お知らせ登録(FE015) の行あたり工数を適用）。ただし UX設計 2.5h・フロント設計 1.0h は規模比按分では過小なため実態に合わせて設定。合計 約43.4h。<strong>ToBe は 4h</strong>（AI 2.5h ＋ APIレビュー 0.25h ＋ フロントレビュー 0.5h ＋ 動作確認 0.75h）。削減率 <strong>約91%</strong>。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                          color: "#ef4444", asis: 2, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (抽出条件・集計ロジック)",    color: "#f59e0b", asis: 7, tobe: 3 },
        { key: "edge",   label: "エッジケース漏れ (空・大量件数・文字コード)", color: "#8b5cf6", asis: 6, tobe: 2 },
        { key: "spec",   label: "仕様解釈ミス (集計仕様・出力項目の解釈)",  color: "#ec4899", asis: 4, tobe: 3 },
        { key: "ui",     label: "UI 細部の不整合 (抽出条件UI・DLボタン)",   color: "#06b6d4", asis: 4, tobe: 1 },
      ],
      bugRateNote: "※ 集計用（IF）約 1.9 KLOC × 参考レート（人力 12/KLOC ≒ 23件 / AI 5/KLOC ≒ 9件）で推定。集計用リストのデータ出力で、論点は <strong>抽出条件・集計仕様・出力項目の解釈</strong>。AI でも業務固有の集計ルールは仕様で明示しないと <strong>仕様解釈ミス</strong> が残りやすい。",
      tasks: {
        'api-impl':    { asis: 16.2, loc: 747,  tobe: 1.1,  tobeEng: 0,   agents: ["バックエンドAI"] },
        'ux':          { asis: 2.5,             tobe: 0.1,  tobeEng: 0,   agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 1.0,             tobe: 0.1,  tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 22.2, loc: 1122, tobe: 1.2,  tobeEng: 0,   agents: ["フロントエンドAI"] },
        'api-review':  { asis: 0.25,            tobe: 0.25, tobeEng: 0.25, agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'fe-review':   { asis: 0.5,             tobe: 0.5,  tobeEng: 0.5, agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 0.75,            tobe: 0.75, tobeEng: 0.75, agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
      },
      contextNotes: [
        "対象: 集計用（IF / PR03）。集計用リストのデータ出力インターフェース。",
        "<strong>実績コード量</strong>: API <strong>747 行</strong> / フロントエンド <strong>1,122 行</strong>（DB 0・ユニットテスト 0）。工程区分はお知らせ登録(FE015)のフォーマットを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（api-impl 8h/369行 → 16.2h・fe-impl 33.5h/1694行 → 22.2h）。UX（2.5h）・フロント設計（1.0h）は規模比按分では過小なため実態に合わせて設定。APIレビュー・フロントレビュー・動作確認は人の確認工数として AsIs / ToBe をそろえる（各0.25h / 0.5h / 0.75h）。合計 約43.4h。",
        "<strong>ToBe（AI駆動）は 4.0h</strong>: AI 2.5h（API実装 1.1 / FE実装 1.2 / UX 0.1 / FE設計 0.1）＋ APIレビュー 0.25h（エンジニア）＋ フロントレビュー 0.5h（エンジニア）＋ 動作確認 0.75h（エンジニア）。削減率 <strong>約91%</strong>。",
      ],
    },
    // 対応履歴登録 (IF / PR12) - システム設定・CSVアップロード（取込）インターフェース。実績コード量: API 278 / フロントエンド 573 行（DB/テストなし）。
    // AsIs: お知らせ登録(FE015) の行あたり工数を実績LOCに適用 (api-impl 8h/369行 → 6.0h・fe-impl 33.5h/1694行 → 11.3h)。UX/FE設計は按分過小のため実態値。合計 約21.3h。
    // ToBe: 2h (AI 1.0h + APIレビュー 0.25h + フロントレビュー 0.25h + 動作確認 0.5h) (実績)。削減率 約91%。
    'wi-if-PR12': {
      lede: "<strong>対応履歴登録（IF / PR12）</strong>の開発工数比較。<strong>対応履歴の CSV アップロード（取込）インターフェース</strong>。実績コード量は API <strong>278 行</strong>・フロントエンド <strong>573 行</strong>（DB/テストなし）。<strong>AsIs は行数規模から推定</strong>（お知らせ登録(FE015) の行あたり工数を適用）。ただし UX設計 2.0h・フロント設計 1.0h は規模比按分では過小なため実態に合わせて設定。合計 約21.3h。<strong>ToBe は実績 2.0h</strong>（AI 1.0h ＋ APIレビュー 0.25h ＋ フロントレビュー 0.25h ＋ 動作確認 0.5h）。削減率 <strong>約91%</strong>。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                            color: "#ef4444", asis: 1, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (取込・登録・検証)",          color: "#f59e0b", asis: 4, tobe: 2 },
        { key: "edge",   label: "エッジケース漏れ (空・重複・文字コード・大量件数)", color: "#8b5cf6", asis: 3, tobe: 1 },
        { key: "spec",   label: "仕様解釈ミス (取込仕様・項目マッピングの解釈)", color: "#ec4899", asis: 2, tobe: 1 },
        { key: "ui",     label: "UI 細部の不整合 (アップロードUI・結果表示)",  color: "#06b6d4", asis: 0, tobe: 0 },
      ],
      bugRateNote: "※ 対応履歴登録（IF）約 0.85 KLOC × 参考レート（人力 12/KLOC ≒ 10件 / AI 5/KLOC ≒ 4件）で推定。対応履歴の CSV 取込で、論点は <strong>取込仕様・項目マッピング・重複/文字コードの解釈</strong>。AI でも業務固有の取込ルールは仕様で明示しないと <strong>仕様解釈ミス</strong> が残りやすい。",
      tasks: {
        'api-impl':    { asis: 6.0,  loc: 278,  tobe: 0.4,  tobeEng: 0,   agents: ["バックエンドAI"] },
        'ux':          { asis: 2.0,             tobe: 0.05, tobeEng: 0,   agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 1.0,             tobe: 0.05, tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 11.3, loc: 573,  tobe: 0.5,  tobeEng: 0,   agents: ["フロントエンドAI"] },
        'api-review':  { asis: 0.25,            tobe: 0.25, tobeEng: 0.25, agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'fe-review':   { asis: 0.25,            tobe: 0.25, tobeEng: 0.25, agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 0.5,             tobe: 0.5,  tobeEng: 0.5, agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
      },
      contextNotes: [
        "対象: 対応履歴登録（IF / PR12）。システム設定・対応履歴の CSV アップロード（取込）インターフェース。",
        "<strong>実績コード量</strong>: API <strong>278 行</strong> / フロントエンド <strong>573 行</strong>（DB 0・ユニットテスト 0）。工程区分はお知らせ登録(FE015)のフォーマットを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（api-impl 8h/369行 → 6.0h・fe-impl 33.5h/1694行 → 11.3h）。UX（2.0h）・フロント設計（1.0h）は規模比按分では過小なため実態に合わせて設定。APIレビュー・フロントレビュー・動作確認は人の確認工数として AsIs / ToBe をそろえる（各0.25h / 0.25h / 0.5h）。合計 約21.3h。",
        "<strong>ToBe（AI駆動）は実績 2.0h</strong>: AI 1.0h（API実装 0.4 / FE実装 0.5 / UX 0.05 / FE設計 0.05）＋ APIレビュー 0.25h（エンジニア）＋ フロントレビュー 0.25h（エンジニア）＋ 動作確認 0.5h（エンジニア）。削減率 <strong>約91%</strong>。",
      ],
    },
    // 訪問不在登録(FE032)・配車戻し登録(FE033)・その他未完了登録(FE034)・ドライバー持出登録(FE030) は
    // 配送完了登録(FE031) と同一画面／同一コンポーネントの一機能として一括実装したため、単独の実装工数は発生しない。
    // タイトル下 (lede) にその旨だけを記載する。
    'wi-screen-DM11FE030': {
      lede: "<strong>ドライバー持出登録</strong>（FE030 / DM11 ドライバー業務）。<strong>配送完了登録画面（FE031）と同一コンポーネントの一機能だったため、一括実装した。</strong>工数は配送完了登録に内包され、単独の実装工数は発生していない。",
    },
    'wi-screen-DM11FE032': {
      lede: "<strong>訪問不在登録</strong>（FE032 / DM11 ドライバー業務）。<strong>配送完了登録画面（FE031）にある一機能だったため、一括実装した。</strong>工数は配送完了登録に内包され、単独の実装工数は発生していない。",
    },
    'wi-screen-DM11FE033': {
      lede: "<strong>配車戻し登録</strong>（FE033 / DM11 ドライバー業務）。<strong>配送完了登録画面（FE031）にある一機能だったため、一括実装した。</strong>工数は配送完了登録に内包され、単独の実装工数は発生していない。",
    },
    'wi-screen-DM11FE034': {
      lede: "<strong>その他未完了登録</strong>（FE034 / DM11 ドライバー業務）。<strong>配送完了登録画面（FE031）にある一機能だったため、一括実装した。</strong>工数は配送完了登録に内包され、単独の実装工数は発生していない。",
    },
    // 配送完了登録 (FE031 / DM11 ドライバー業務) - 配送先（荷物）情報表示 + 配送完了登録。
    // 実績コード量: API 336 / フロントエンド 1,365 行 (DB/テストなし)。
    // AsIs: お知らせ登録(FE015) の行あたり工数を実績LOCに適用 (api-impl 8h/369行・fe-impl 33.5h/1694行)。fe-design/UX は規模比で按分。合計 約41.5h。
    // ToBe: AI 1.0h + APIレビュー 0.25h + フロントレビュー 0.25h + 動作確認 0.5h + API最適化 2.0h(うちエンジニア1.0h) = 4.0h (実績)。
    'wi-screen-DM11FE031': {
      lede: "<strong>配送完了登録</strong>（FE031 / DM11 ドライバー業務）の開発工数比較。<strong>配送先（荷物）情報表示＋配送完了登録</strong>を行う画面。実績コード量は API <strong>336 行</strong>・フロントエンド <strong>1,365 行</strong>（DB/テストなし）。<strong>AsIs は行数規模から推定</strong>（お知らせ登録(FE015) の行あたり工数を適用）。合計 約41.5h。<strong>ToBe は実績</strong>（AI 1.0h ＋ APIレビュー 0.25h ＋ フロントレビュー 0.25h ＋ 動作確認 0.5h ＋ API最適化 2.0h ＝ 4.0h）。削減率 <strong>約90%</strong>。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                          color: "#ef4444", asis: 2,  tobe: 0 },
        { key: "logic",  label: "ロジックバグ (完了登録・状態遷移・検証)",  color: "#f59e0b", asis: 7,  tobe: 3 },
        { key: "edge",   label: "エッジケース漏れ (二重登録・欠損・境界)",  color: "#8b5cf6", asis: 5,  tobe: 2 },
        { key: "spec",   label: "仕様解釈ミス (完了条件・登録項目の解釈)",  color: "#ec4899", asis: 4,  tobe: 4 },
        { key: "ui",     label: "UI 細部の不整合 (入力フォーム・SP表示)",   color: "#06b6d4", asis: 5,  tobe: 2 },
      ],
      bugRateNote: "※ 配送完了登録 約 1.7 KLOC × 参考レート（人力 12/KLOC ≒ 20件 / AI 5/KLOC ≒ 9件）で推定。情報表示＋完了登録の構成で、論点は <strong>完了条件・登録項目・状態遷移の解釈</strong>。",
      tasks: {
        'data-design': { asis: 0,                 tobe: 0, tobeEng: 0, agents: ["—"] },
        'data-impl':   { asis: 0,    loc: 0,      tobe: 0, tobeEng: 0, agents: ["—"] },
        'api-impl':    { asis: 7.3,  loc: 336,    tobe: 0.2,  tobeEng: 0,    agents: ["バックエンドAI"] },
        'api-test':    { asis: 0,    loc: 0,      tobe: 0,    tobeEng: 0,    agents: ["—"] },
        'api-review':  { asis: 0.25,             tobe: 0.25, tobeEng: 0.25, agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'ux':          { asis: 3.8,               tobe: 0.1,  tobeEng: 0,    agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 2.4,               tobe: 0.05, tobeEng: 0,    agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 27.0, loc: 1365,   tobe: 0.65, tobeEng: 0,    agents: ["フロントエンドAI"] },
        'fe-test':     {                                                    agents: ["—"] },
        'fe-review':   { asis: 0.25,             tobe: 0.25, tobeEng: 0.25, agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 0.5,               tobe: 0.5,  tobeEng: 0.5,  agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
        'api-optimize': {
          label: "API最適化",
          color: "#fbbf24",
          asis: 0,
          tobe: 2.0, tobeEng: 1.0,
          agents: ["バックエンドAI", "エンジニア"],
        },
      },
      contextNotes: [
        "対象画面: 配送完了登録（FE031 / DM11 ドライバー業務）。配送先（荷物）情報表示と配送完了登録を行う。",
        "<strong>実績コード量</strong>: API <strong>336 行</strong> / フロントエンド <strong>1,365 行</strong>（DB 0・ユニットテスト 0）。工程区分はお知らせ登録(FE015)のフォーマットを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（api-impl 8h/369行 → 7.3h・fe-impl 33.5h/1694行 → 27.0h）。フロント設計（2.4h）・UX（3.8h）は規模比で按分。APIレビュー（0.25h）・フロントレビュー（0.25h）・動作確認（0.5h）は人の確認工数として AsIs / ToBe をそろえる。合計 約41.5h。",
        "<strong>ToBe（AI駆動）は実績 4.0h</strong>: AI 1.0h（API実装 0.2 / UX 0.1 / FE設計 0.05 / FE実装 0.65）＋ APIレビュー 0.25h（エンジニア）＋ フロントレビュー 0.25h（エンジニア）＋ 動作確認 0.5h（エンジニア）＋ API最適化 2.0h（うちエンジニア 1.0h）。削減率 <strong>約90%</strong>。AI が削減できるのは実装・設計工程で、レビュー・動作確認・API最適化の人間工数は AsIs と同水準。",
      ],
    },
    // ○○○完了登録 (FE044 / DM12 ○○○ドライバー業務) - スキャンした配送情報表示 + 完了登録。配送完了登録(FE031)のDM12版。
    // 実績コード量: API 228 / ユニットテスト 338 / フロントエンド 423 行。
    // AsIs: お知らせ登録(FE015) の行あたり工数を実績LOCに適用 (api-impl 8h/369行 → 4.9h・api-test 3.5h/256行 → 4.6h・fe-impl 33.5h/1694行 → 8.4h)。fe-design/UX は規模比で按分。合計 約21.3h。
    // ToBe: AI 2.0h + APIレビュー 0.25h + フロントレビュー 0.25h + 動作確認 0.5h = 3.0h (実績)。削減率 約86%。
    'wi-screen-DM12FE044': {
      lede: "<strong>○○○完了登録</strong>（FE044 / DM12 ○○○ドライバー業務）の開発工数比較。<strong>スキャンした配送情報表示＋完了登録</strong>を行う画面（配送完了登録(FE031)のDM12版）。実績コード量は API <strong>228 行</strong>・ユニットテスト <strong>338 行</strong>・フロントエンド <strong>423 行</strong>。<strong>AsIs は行数規模から推定</strong>（お知らせ登録(FE015) の行あたり工数を適用）。合計 約21.3h。<strong>ToBe は実績</strong>（AI 2.0h ＋ APIレビュー 0.25h ＋ フロントレビュー 0.25h ＋ 動作確認 0.5h ＝ 3.0h）。削減率 <strong>約86%</strong>。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                          color: "#ef4444", asis: 1, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (完了登録・状態遷移・検証)",  color: "#f59e0b", asis: 3, tobe: 1 },
        { key: "edge",   label: "エッジケース漏れ (二重登録・欠損・境界)",  color: "#8b5cf6", asis: 2, tobe: 1 },
        { key: "spec",   label: "仕様解釈ミス (完了条件・登録項目の解釈)",  color: "#ec4899", asis: 2, tobe: 2 },
        { key: "ui",     label: "UI 細部の不整合 (入力フォーム・SP表示)",   color: "#06b6d4", asis: 1, tobe: 1 },
      ],
      bugRateNote: "※ ○○○完了登録 約 0.65 KLOC（製品コード・テスト除く）× 参考レート（人力 12/KLOC ≒ 8件 / AI 5/KLOC ≒ 3件）で推定。スキャンした配送情報表示＋完了登録の構成で、論点は <strong>完了条件・登録項目・状態遷移の解釈</strong>。",
      tasks: {
        'api-impl':    { asis: 4.9,  loc: 228,  tobe: 0.6,  tobeEng: 0,    agents: ["バックエンドAI"] },
        'api-test':    { asis: 4.6,  loc: 338,  tobe: 0,    tobeEng: 0,    agents: ["バックエンドAI"] },
        'ux':          { asis: 1.5,             tobe: 0.2,  tobeEng: 0,    agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 0.9,             tobe: 0.1,  tobeEng: 0,    agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 8.4,  loc: 423,  tobe: 1.1,  tobeEng: 0,    agents: ["フロントエンドAI"] },
        'api-review':  { asis: 0.25,            tobe: 0.25, tobeEng: 0.25, agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'fe-review':   { asis: 0.25,            tobe: 0.25, tobeEng: 0.25, agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 0.5,             tobe: 0.5,  tobeEng: 0.5,  agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
      },
      contextNotes: [
        "対象画面: ○○○完了登録（FE044 / DM12 ○○○ドライバー業務）。スキャンした配送情報表示と完了登録を行う。配送完了登録(FE031)のDM12版。",
        "<strong>実績コード量</strong>: API <strong>228 行</strong> / ユニットテスト <strong>338 行</strong> / フロントエンド <strong>423 行</strong>。工程区分はお知らせ登録(FE015)のフォーマットを流用。ユニットテストは API単体テストとして計上。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（api-impl 8h/369行 → 4.9h・api-test 3.5h/256行 → 4.6h・fe-impl 33.5h/1694行 → 8.4h）。フロント設計（0.9h）・UX（1.5h）は規模比で按分。APIレビュー（0.25h）・フロントレビュー（0.25h）・動作確認（0.5h）は人の確認工数として AsIs / ToBe をそろえる。合計 約21.3h。",
        "<strong>ToBe（AI駆動）は実績 3.0h</strong>: AI 2.0h（API実装 0.6 / FE実装 1.1 / UX 0.2 / FE設計 0.1、API単体テストは api-impl に内包）＋ APIレビュー 0.25h（エンジニア）＋ フロントレビュー 0.25h（エンジニア）＋ 動作確認 0.5h（エンジニア）。削減率 <strong>約86%</strong>。AI が削減できるのは実装・設計工程で、レビュー・動作確認の人間工数は AsIs と同水準。",
      ],
    },
    // 配送先詳細 (FE029 / DM11 ドライバー業務) - 配送先詳細情報表示。
    // 実績コード量: フロントエンド 102 行のみ (DB/API/テストなし)。
    // AsIs: お知らせ登録(FE015) の行あたり工数を実績LOCに適用 (fe-impl 33.5h/1694行)。fe-design/UX は按分過小のため各2.0hに設定。合計 約6.2h。
    // ToBe: AI 0.25h + フロントレビュー 0.1h(エンジニア) + 動作確認 0.1h(エンジニア) = 0.45h (実績)。
    'wi-screen-DM11FE029': {
      lede: "<strong>配送先詳細</strong>（FE029 / DM11 ドライバー業務）の開発工数比較。<strong>配送先詳細情報表示</strong>の軽量な閲覧画面。実績コード量はフロントエンド <strong>102 行</strong>のみ（DB/API なし）。<strong>AsIs は行数規模から推定</strong>（お知らせ登録(FE015) の行あたり工数を適用）。ただし UX設計・フロント設計は規模比按分では過小なため各 2.0h に設定。合計 約6.2h。<strong>ToBe は実績</strong>（AI 0.25h ＋ フロントレビュー 0.1h ＋ 動作確認 0.1h ＝ 0.45h）。削減率 <strong>約93%</strong>。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                          color: "#ef4444", asis: 0, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (表示制御・項目マッピング)",  color: "#f59e0b", asis: 1, tobe: 0 },
        { key: "edge",   label: "エッジケース漏れ (空・欠損項目)",         color: "#8b5cf6", asis: 1, tobe: 0 },
        { key: "spec",   label: "仕様解釈ミス (表示項目の解釈)",           color: "#ec4899", asis: 1, tobe: 1 },
        { key: "ui",     label: "UI 細部の不整合 (詳細レイアウト)",        color: "#06b6d4", asis: 1, tobe: 1 },
      ],
      bugRateNote: "※ 配送先詳細 約 0.10 KLOC × 参考レート（人力 12/KLOC ≒ 1件 / AI 5/KLOC ≒ 1件未満）で推定。詳細情報表示の軽量な閲覧画面で、論点は <strong>表示項目の解釈</strong>。",
      tasks: {
        'data-design': { asis: 0,                tobe: 0,    tobeEng: 0,   agents: ["—"] },
        'data-impl':   { asis: 0,    loc: 0,     tobe: 0,    tobeEng: 0,   agents: ["—"] },
        'api-impl':    { asis: 0,    loc: 0,     tobe: 0,    tobeEng: 0,   agents: ["—"] },
        'api-test':    { asis: 0,    loc: 0,     tobe: 0,    tobeEng: 0,   agents: ["—"] },
        'api-review':  { asis: 0,                tobe: 0,    tobeEng: 0,   agents: ["—"] },
        'ux':          { asis: 2.0,              tobe: 0.03, tobeEng: 0,   agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 2.0,              tobe: 0.02, tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 2.0,  loc: 102,   tobe: 0.2,  tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-test':     {                                                   agents: ["—"] },
        'fe-review':   { asis: 0.1,              tobe: 0.1,  tobeEng: 0.1, agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 0.1,              tobe: 0.1,  tobeEng: 0.1, agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
      },
      contextNotes: [
        "対象画面: 配送先詳細（FE029 / DM11 ドライバー業務）。配送先の詳細情報表示の軽量な閲覧画面。",
        "<strong>実績コード量</strong>: フロントエンド <strong>102 行</strong>のみ（DB 0・API 0・ユニットテスト 0）。工程区分はお知らせ登録(FE015)のフォーマットを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（fe-impl 33.5h/1694行 → 2.0h）。フロント設計・UX は規模比按分では過小なため各 2.0h に設定。フロントレビュー・動作確認は人の確認工数として AsIs / ToBe をそろえる（各0.1h）。合計 約6.2h。",
        "<strong>ToBe（AI駆動）は実績 0.45h</strong>: AI 0.25h（FE実装 0.2 / UX 0.03 / FE設計 0.02）＋ フロントレビュー 0.1h（エンジニア）＋ 動作確認 0.1h（エンジニア）。削減率 <strong>約93%</strong>。",
      ],
    },
    // お知らせ表示 (FE039 / DM11 ドライバー業務) - ドライバー向けお知らせ一覧表示。
    // 実績コード量: DB 0 / API 114 / ユニットテスト 0 / フロントエンド 54 行。
    // AsIs: お知らせ登録(FE015) の行あたり工数を実績LOCに適用 (api-impl 8h/369行)。fe-impl 2.0h・fe-design 0.5h・UX 3.0h は按分過小のため実態値に設定。合計 約8.75h。
    // ToBe: AI 1.0h + APIレビュー 0.25h + フロントレビュー 0.25h + 動作確認 0.25h = 1.75h (実績)。
    'wi-screen-DM11FE039': {
      lede: "<strong>お知らせ表示</strong>（FE039 / DM11 ドライバー業務）の開発工数比較。<strong>ドライバー向けお知らせ一覧表示</strong>の軽量な閲覧画面。実績コード量は API <strong>114 行</strong>・フロントエンド <strong>54 行</strong>（DB/テストなし）。<strong>AsIs は行数規模から推定</strong>（お知らせ登録(FE015) の行あたり工数を適用）。ただし UX設計 3.0h・フロント設計 0.5h・フロント実装 2.0h は規模比按分では過小なため実態に合わせて設定。合計 約8.75h。<strong>ToBe は実績</strong>（AI 1.0h ＋ APIレビュー 0.25h ＋ フロントレビュー 0.25h ＋ 動作確認 0.25h ＝ 1.75h）。削減率 <strong>約80%</strong>。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                          color: "#ef4444", asis: 0, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (並び順・公開範囲)",         color: "#f59e0b", asis: 1, tobe: 0 },
        { key: "edge",   label: "エッジケース漏れ (空・公開前後)",         color: "#8b5cf6", asis: 1, tobe: 0 },
        { key: "spec",   label: "仕様解釈ミス (表示対象・公開条件の解釈)", color: "#ec4899", asis: 1, tobe: 1 },
        { key: "ui",     label: "UI 細部の不整合 (一覧表示)",              color: "#06b6d4", asis: 1, tobe: 1 },
      ],
      bugRateNote: "※ お知らせ表示 約 0.17 KLOC × 参考レート（人力 12/KLOC ≒ 2件 / AI 5/KLOC ≒ 1件）で推定。ドライバー向けお知らせ一覧の軽量な閲覧画面で、論点は <strong>表示対象・公開条件の解釈</strong>。",
      tasks: {
        'data-design': { asis: 0,                tobe: 0,    tobeEng: 0,   agents: ["—"] },
        'data-impl':   { asis: 0,    loc: 0,     tobe: 0,    tobeEng: 0,   agents: ["—"] },
        'api-impl':    { asis: 2.5,  loc: 114,   tobe: 0.6,  tobeEng: 0,   agents: ["バックエンドAI"] },
        'api-test':    { asis: 0,    loc: 0,     tobe: 0,    tobeEng: 0,   agents: ["—"] },
        'api-review':  { asis: 0.25,             tobe: 0.25, tobeEng: 0.25, agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'ux':          { asis: 3.0,              tobe: 0.1,  tobeEng: 0,   agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 0.5,              tobe: 0.05, tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 2.0,  loc: 54,    tobe: 0.25, tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-test':     {                                                   agents: ["—"] },
        'fe-review':   { asis: 0.25,             tobe: 0.25, tobeEng: 0.25, agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 0.25,             tobe: 0.25, tobeEng: 0.25, agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
      },
      contextNotes: [
        "対象画面: お知らせ表示（FE039 / DM11 ドライバー業務）。ドライバー向けお知らせ一覧表示の軽量な閲覧画面。",
        "<strong>実績コード量</strong>: API <strong>114 行</strong> / フロントエンド <strong>54 行</strong>（DB 0・ユニットテスト 0）。工程区分はお知らせ登録(FE015)のフォーマットを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（api-impl 8h/369行 → 2.5h）。フロント実装（2.0h）・フロント設計（0.5h）・UX（3.0h）は規模比按分では過小なため実態に合わせて設定。APIレビュー・フロントレビュー・動作確認は人の確認工数として AsIs / ToBe をそろえる（各0.25h）。合計 約8.75h。",
        "<strong>ToBe（AI駆動）は実績 1.75h</strong>: AI 1.0h（API実装 0.6 / UX 0.1 / FE設計 0.05 / FE実装 0.25）＋ APIレビュー 0.25h（エンジニア）＋ フロントレビュー 0.25h（エンジニア）＋ 動作確認 0.25h（エンジニア）。削減率 <strong>約80%</strong>。実装が小規模なため、人の確認工数（レビュー・動作確認）の比重が大きく削減率は低め。",
      ],
    },
    // 本日結果表示 (FE040 / DM11 ドライバー業務) - 本日の配送実績サマリー表示。
    // 実績コード量: API 10 / フロントエンド 96 行 (DB/テストなし)。
    // AsIs: お知らせ登録(FE015) の行あたり工数を実績LOCに適用 (api-impl 8h/369行・fe-impl 33.5h/1694行)。
    //       fe-design/UX は按分過小のため実態値(UX 2.0h・fe-design 0.5h)に設定。合計 約5.4h。
    // ToBe: AI 0.25h + APIレビュー 0.25h + フロントレビュー 0.25h + 動作確認 0.25h = 1.0h (実績)。
    'wi-screen-DM11FE040': {
      lede: "<strong>本日結果表示</strong>（FE040 / DM11 ドライバー業務）の開発工数比較。<strong>本日の配送実績サマリー表示</strong>の軽量な閲覧画面。実績コード量は API <strong>10 行</strong>・フロントエンド <strong>96 行</strong>（DB/テストなし）。<strong>AsIs は行数規模から推定</strong>（お知らせ登録(FE015) の行あたり工数を適用）。ただし UX設計 2.0h・フロント設計 0.5h は規模比按分では過小なため実態に合わせて設定。合計 約5.4h。<strong>ToBe は実績</strong>（AI 0.25h ＋ APIレビュー 0.25h ＋ フロントレビュー 0.25h ＋ 動作確認 0.25h ＝ 1.0h）。削減率 <strong>約81%</strong>。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                          color: "#ef4444", asis: 0, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (実績集計・サマリー算出)",    color: "#f59e0b", asis: 1, tobe: 0 },
        { key: "edge",   label: "エッジケース漏れ (空・該当なし・日付境界)", color: "#8b5cf6", asis: 1, tobe: 0 },
        { key: "spec",   label: "仕様解釈ミス (集計対象・表示項目の解釈)",  color: "#ec4899", asis: 1, tobe: 1 },
        { key: "ui",     label: "UI 細部の不整合 (サマリー表示・SP表示)",   color: "#06b6d4", asis: 1, tobe: 1 },
      ],
      bugRateNote: "※ 本日結果表示 約 0.11 KLOC × 参考レート（人力 12/KLOC ≒ 1件 / AI 5/KLOC ≒ 1件未満）で推定。本日の配送実績サマリー表示の軽量な閲覧画面で、論点は <strong>集計対象・表示項目の解釈</strong>。",
      tasks: {
        'data-design': { asis: 0,                tobe: 0,    tobeEng: 0,   agents: ["—"] },
        'data-impl':   { asis: 0,    loc: 0,     tobe: 0,    tobeEng: 0,   agents: ["—"] },
        'api-impl':    { asis: 0.2,  loc: 10,    tobe: 0.05, tobeEng: 0,   agents: ["バックエンドAI"] },
        'api-test':    { asis: 0,    loc: 0,     tobe: 0,    tobeEng: 0,   agents: ["—"] },
        'api-review':  { asis: 0.25,             tobe: 0.25, tobeEng: 0.25, agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'ux':          { asis: 2.0,              tobe: 0.05, tobeEng: 0,   agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 0.5,              tobe: 0.05, tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 1.9,  loc: 96,    tobe: 0.1,  tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-test':     {                                                   agents: ["—"] },
        'fe-review':   { asis: 0.25,             tobe: 0.25, tobeEng: 0.25, agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 0.25,             tobe: 0.25, tobeEng: 0.25, agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
      },
      contextNotes: [
        "対象画面: 本日結果表示（FE040 / DM11 ドライバー業務）。本日の配送実績サマリーを表示する軽量な閲覧画面。",
        "<strong>実績コード量</strong>: API <strong>10 行</strong> / フロントエンド <strong>96 行</strong>（DB 0・ユニットテスト 0）。工程区分はお知らせ登録(FE015)のフォーマットを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（api-impl 8h/369行 → 0.2h・fe-impl 33.5h/1694行 → 1.9h）。UX（2.0h）・フロント設計（0.5h）は規模比按分では過小なため実態に合わせて設定。APIレビュー・フロントレビュー・動作確認は人の確認工数として AsIs / ToBe をそろえる（各0.25h）。合計 約5.4h。",
        "<strong>ToBe（AI駆動）は実績 1.0h</strong>: AI 0.25h（API実装 0.05 / UX 0.05 / FE設計 0.05 / FE実装 0.1）＋ APIレビュー 0.25h（エンジニア）＋ フロントレビュー 0.25h（エンジニア）＋ 動作確認 0.25h（エンジニア）。削減率 <strong>約81%</strong>。実装が小規模なため、人の確認工数（レビュー・動作確認）の比重が大きく削減率は低め。",
      ],
    },
    // 本日業務終了 (FE041 / DM11 ドライバー業務) - 業務終了メッセージ表示。
    // 実績コード量: フロントエンド 100 行のみ (DB/API/テストなし)。
    // AsIs: お知らせ登録(FE015) の行あたり工数を実績LOCに適用 (fe-impl 33.5h/1694行)。
    //       fe-design/UX は按分過小のため実態値(UX 1.5h・fe-design 0.5h)に設定。合計 約4.5h。
    // ToBe: AI 0.25h + フロントレビュー 0.25h + 動作確認 0.25h = 0.75h (実績)。
    'wi-screen-DM11FE041': {
      lede: "<strong>本日業務終了</strong>（FE041 / DM11 ドライバー業務）の開発工数比較。<strong>業務終了メッセージ表示</strong>の軽量な閲覧画面。実績コード量はフロントエンド <strong>100 行</strong>のみ（DB/API/テストなし）。<strong>AsIs は行数規模から推定</strong>（お知らせ登録(FE015) の行あたり工数を適用）。ただし UX設計 1.5h・フロント設計 0.5h は規模比按分では過小なため実態に合わせて設定。合計 約4.5h。<strong>ToBe は実績</strong>（AI 0.25h ＋ フロントレビュー 0.25h ＋ 動作確認 0.25h ＝ 0.75h）。削減率 <strong>約83%</strong>。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                          color: "#ef4444", asis: 0, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (表示制御)",                 color: "#f59e0b", asis: 0, tobe: 0 },
        { key: "edge",   label: "エッジケース漏れ (表示条件・該当なし)",    color: "#8b5cf6", asis: 1, tobe: 0 },
        { key: "spec",   label: "仕様解釈ミス (メッセージ内容・表示条件の解釈)", color: "#ec4899", asis: 1, tobe: 1 },
        { key: "ui",     label: "UI 細部の不整合 (メッセージ表示・SP表示)", color: "#06b6d4", asis: 1, tobe: 1 },
      ],
      bugRateNote: "※ 本日業務終了 約 0.10 KLOC × 参考レート（人力 12/KLOC ≒ 1件 / AI 5/KLOC ≒ 1件未満）で推定。業務終了メッセージ表示の軽量な閲覧画面で、論点は <strong>表示条件・メッセージ内容の解釈</strong>。",
      tasks: {
        'data-design': { asis: 0,                tobe: 0,    tobeEng: 0,   agents: ["—"] },
        'data-impl':   { asis: 0,    loc: 0,     tobe: 0,    tobeEng: 0,   agents: ["—"] },
        'api-impl':    { asis: 0,    loc: 0,     tobe: 0,    tobeEng: 0,   agents: ["—"] },
        'api-test':    { asis: 0,    loc: 0,     tobe: 0,    tobeEng: 0,   agents: ["—"] },
        'api-review':  { asis: 0,                tobe: 0,    tobeEng: 0,   agents: ["—"] },
        'ux':          { asis: 1.5,              tobe: 0.05, tobeEng: 0,   agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 0.5,              tobe: 0.05, tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 2.0,  loc: 100,   tobe: 0.15, tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-test':     {                                                   agents: ["—"] },
        'fe-review':   { asis: 0.25,             tobe: 0.25, tobeEng: 0.25, agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 0.25,             tobe: 0.25, tobeEng: 0.25, agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
      },
      contextNotes: [
        "対象画面: 本日業務終了（FE041 / DM11 ドライバー業務）。業務終了メッセージを表示する軽量な閲覧画面。",
        "<strong>実績コード量</strong>: フロントエンド <strong>100 行</strong>のみ（DB 0・API 0・ユニットテスト 0）。工程区分はお知らせ登録(FE015)のフォーマットを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（fe-impl 33.5h/1694行 → 2.0h）。UX（1.5h）・フロント設計（0.5h）は規模比按分では過小なため実態に合わせて設定。フロントレビュー・動作確認は人の確認工数として AsIs / ToBe をそろえる（各0.25h）。合計 約4.5h。",
        "<strong>ToBe（AI駆動）は実績 0.75h</strong>: AI 0.25h（FE実装 0.15 / UX 0.05 / FE設計 0.05）＋ フロントレビュー 0.25h（エンジニア）＋ 動作確認 0.25h（エンジニア）。削減率 <strong>約83%</strong>。実装が小規模なため、人の確認工数（レビュー・動作確認）の比重が大きく削減率は低め。",
      ],
    },
    // 未配車検索(FE037) は 翌日配車表示(FE036) とクエリーが異なるだけの同一画面のため、
    // 翌日配車表示側でまとめて実装した。単独の実装工数は発生しない。タイトル下(lede)にその旨を記載。
    'wi-screen-DM11FE037': {
      lede: "<strong>未配車検索</strong>（FE037 / DM11 ドライバー業務）。<strong>翌日配車表示画面（FE036）とクエリーが異なるだけの同一画面だったため、翌日配車表示の方でまとめて実装した。</strong>工数は翌日配車表示に内包され、単独の実装工数は発生していない。",
    },
    // 翌日配車表示 (FE036 / DM11 ドライバー業務) - お問い合わせ番号検索 + 翌日配車予定一覧表示。
    // 実績コード量: DB 0 / API 77 / ユニットテスト 400 / フロントエンド 77 行。
    // AsIs: お知らせ登録(FE015) の「行あたり工数」を実績LOCに適用 (api-impl 8h/369行・api-test 3.5h/256行・fe-impl 33.5h/1694行)。
    //       fe-design/UX は按分過小のため実態値(UX 3.5h・fe-design 0.5h)に設定。合計 約13.7h。
    // ToBe: AI 0.4h + APIレビュー 0.25h + フロントレビュー 0.25h + 動作確認 0.5h + クエリー調整 1.0h(うちエンジニア0.75h) = 2.4h。
    'wi-screen-DM11FE036': {
      lede: "<strong>翌日配車表示</strong>（FE036 / DM11 ドライバー業務）の開発工数比較。<strong>お問い合わせ番号検索＋翌日配車予定一覧表示</strong>を行う閲覧画面。実績コード量は API <strong>77 行</strong>・ユニットテスト <strong>400 行</strong>・フロントエンド <strong>77 行</strong>（DB なし）。<strong>AsIs は行数規模から推定</strong>（お知らせ登録(FE015) の行あたり工数を適用）。ただし UX設計 3.5h・フロント設計 0.5h は規模比按分では過小なため実態に合わせて設定。合計 約13.7h。<strong>ToBe は実績</strong>（AI 0.4h ＋ APIレビュー 0.25h ＋ フロントレビュー 0.25h ＋ 動作確認 0.5h ＋ クエリー調整 1.0h ＝ 2.4h）。削減率 <strong>約82%</strong>。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                          color: "#ef4444", asis: 0, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (検索・並び順・一覧集約)",    color: "#f59e0b", asis: 1, tobe: 0 },
        { key: "edge",   label: "エッジケース漏れ (空・該当なし・日付境界)", color: "#8b5cf6", asis: 1, tobe: 0 },
        { key: "spec",   label: "仕様解釈ミス (表示項目・検索仕様の解釈)",  color: "#ec4899", asis: 1, tobe: 1 },
        { key: "ui",     label: "UI 細部の不整合 (一覧表示)",              color: "#06b6d4", asis: 1, tobe: 1 },
      ],
      bugRateNote: "※ 翌日配車表示 約 0.15 KLOC（製品コード・テスト除く）× 参考レート（人力 12/KLOC ≒ 2件 / AI 5/KLOC ≒ 1件）で推定。お問い合わせ番号検索＋翌日配車予定一覧の閲覧画面で、論点は <strong>表示項目・検索仕様の解釈</strong>。",
      tasks: {
        'data-design': { asis: 0,                tobe: 0,    tobeEng: 0,   agents: ["—"] },
        'data-impl':   { asis: 0,    loc: 0,     tobe: 0,    tobeEng: 0,   agents: ["—"] },
        'api-impl':    { asis: 1.7,  loc: 77,    tobe: 0.15, tobeEng: 0,   agents: ["バックエンドAI"] },
        'api-test':    { asis: 5.5,  loc: 400,   tobe: 0.1,  tobeEng: 0,   agents: ["バックエンドAI"] },
        'api-review':  { asis: 0.25,             tobe: 0.25, tobeEng: 0.25, agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'ux':          { asis: 3.5,              tobe: 0.03, tobeEng: 0,   agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 0.5,              tobe: 0.02, tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 1.5,  loc: 77,    tobe: 0.1,  tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-test':     {                                                   agents: ["—"] },
        'fe-review':   { asis: 0.25,             tobe: 0.25, tobeEng: 0.25, agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 0.5,              tobe: 0.5,  tobeEng: 0.5, agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
        'query-adjust': {
          label: "クエリー調整",
          color: "#fbbf24",
          asis: 0,
          tobe: 1.0, tobeEng: 0.75,
          agents: ["バックエンドAI", "エンジニア"],
        },
      },
      contextNotes: [
        "対象画面: 翌日配車表示（FE036 / DM11 ドライバー業務）。お問い合わせ番号検索・翌日配車予定一覧表示を行う閲覧画面。",
        "<strong>実績コード量</strong>: API <strong>77 行</strong> / ユニットテスト <strong>400 行</strong> / フロントエンド <strong>77 行</strong>（DB 0）。工程区分はお知らせ登録(FE015)のフォーマットを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（api-impl 8h/369行 → 1.7h・api-test 3.5h/256行 → 5.5h・fe-impl 33.5h/1694行 → 1.5h）。UX（3.5h）・フロント設計（0.5h）は規模比按分では過小なため実態に合わせて設定。APIレビュー・フロントレビュー・動作確認は人の確認工数として AsIs / ToBe をそろえる（各0.25h / 0.25h / 0.5h）。合計 約13.7h。",
        "<strong>ToBe（AI駆動）は実績 2.4h</strong>: AI 0.4h（API実装 0.15 / API単体テスト 0.1 / UX 0.03 / FE設計 0.02 / FE実装 0.1）＋ APIレビュー 0.25h（エンジニア）＋ フロントレビュー 0.25h（エンジニア）＋ 動作確認 0.5h（エンジニア）＋ クエリー調整 1.0h（うちエンジニア 0.75h）。削減率 <strong>約82%</strong>。ユニットテスト 400 行を含み、実装比で API単体テストの AsIs（5.5h）が大きい点が特徴。クエリー調整は未配車検索（FE037・クエリー差分のみの同一画面）を同画面にまとめるための調整工数。",
      ],
    },
    // 予定日変更 (FE035 / DM11 ドライバー業務) - 配送先（荷物）情報表示 + 配送履歴表示 + 配送予定日の変更。
    // 実績コード量: DB 12 / API 252 / ユニットテスト 212 / フロントエンド 274 行。
    // AsIs: お知らせ登録(FE015) の行あたり工数を実績LOCに適用 (data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行・fe-impl 33.5h/1694行)。
    //       data-design/fe-design/UX は按分過小のため実態値(UX 3.0h・fe-design 0.5h・data-design 0.3h)に設定。
    //       さらに画面が持つ処理の難易度を考慮し、実装系工程(実装・設計・UX・単体テスト)に難易度プレミアム ×2 を適用。API不具合修正 8.0h を加算。合計 約46.0h。
    // ToBe: AI 1.6h + APIレビュー 0.25h + フロントレビュー 0.25h + 動作確認 1.5h + API不具合修正 0.5h(AI) + 画面調整 1.0h(うちエンジニア0.5h) = 5.1h (実績)。
    'wi-screen-DM11FE035': {
      lede: "<strong>予定日変更</strong>（FE035 / DM11 ドライバー業務）の開発工数比較。<strong>配送先（荷物）情報表示＋配送履歴表示＋配送予定日の変更</strong>を行う画面。実績コード量は DB <strong>12 行</strong>・API <strong>252 行</strong>・ユニットテスト <strong>212 行</strong>・フロントエンド <strong>274 行</strong>。<strong>AsIs は行数規模から推定し、画面が持つ処理の難易度を考慮して実装系工程（実装・設計・UX・単体テスト）を2倍</strong>に設定（お知らせ登録(FE015) の行あたり工数を適用）。さらに API不具合修正（人力 8.0h）を加算。合計 約46.0h。<strong>ToBe は実績</strong>（AI 1.6h ＋ APIレビュー 0.25h ＋ フロントレビュー 0.25h ＋ 動作確認 1.5h ＋ API不具合修正 0.5h ＋ 画面調整 1.0h ＝ 5.1h）。削減率 <strong>約89%</strong>。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                              color: "#ef4444", asis: 0, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (変更可能条件・期限判定・履歴反映)", color: "#f59e0b", asis: 2, tobe: 1 },
        { key: "edge",   label: "エッジケース漏れ (日付境界・変更不可状態・欠損)", color: "#8b5cf6", asis: 2, tobe: 1 },
        { key: "spec",   label: "仕様解釈ミス (変更可否条件・予定日の正本の解釈)", color: "#ec4899", asis: 1, tobe: 1 },
        { key: "ui",     label: "UI 細部の不整合 (日付入力・SP表示)",          color: "#06b6d4", asis: 1, tobe: 0 },
      ],
      bugRateNote: "※ 予定日変更 約 0.54 KLOC × 参考レート（人力 12/KLOC ≒ 6件 / AI 5/KLOC ≒ 3件）で推定。配送先（荷物）情報表示＋配送履歴表示＋予定日変更の構成で、論点は <strong>変更可能条件・期限・配送明細/履歴への反映の解釈</strong>。AI でも業務固有の変更可否ルールは仕様で明示しないと <strong>仕様解釈ミス</strong> が残りやすい。",
      tasks: {
        'data-design': { asis: 0.6,             tobe: 0.05, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        'data-impl':   { asis: 0.8,  loc: 12,   tobe: 0.15, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        'api-impl':    { asis: 11.0, loc: 252,  tobe: 0.55, tobeEng: 0,   agents: ["バックエンドAI"] },
        'api-test':    { asis: 5.8,  loc: 212,  tobe: 0.1,  tobeEng: 0,   agents: ["バックエンドAI"] },
        'api-review':  { asis: 0.25,            tobe: 0.25, tobeEng: 0.25, agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'ux':          { asis: 6.0,             tobe: 0.1,  tobeEng: 0,   agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 1.0,             tobe: 0.05, tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 10.8, loc: 274,  tobe: 0.6,  tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-test':     {                                                  agents: ["—"] },
        'fe-review':   { asis: 0.25,            tobe: 0.25, tobeEng: 0.25, agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 1.5,             tobe: 1.5,  tobeEng: 1.5, agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
        'api-bugfix': {
          label: "API不具合修正",
          color: "#fbbf24",
          asis: 8.0,
          tobe: 0.5, tobeEng: 0,
          agents: ["バックエンドAI"],
        },
        'screen-adjust': {
          label: "画面調整",
          color: "#fbbf24",
          asis: 0,
          tobe: 1.0, tobeEng: 0.5,
          agents: ["フロントエンドAI", "エンジニア"],
        },
      },
      contextNotes: [
        "対象画面: 予定日変更（FE035 / DM11 ドライバー業務）。配送先（荷物）情報表示・配送履歴表示に加え、配送予定日の変更を行う。",
        "<strong>実績コード量</strong>: DB <strong>12 行</strong> / API <strong>252 行</strong> / ユニットテスト <strong>212 行</strong> / フロントエンド <strong>274 行</strong>。工程区分はお知らせ登録(FE015)のフォーマットを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行・fe-impl 33.5h/1694行）。データモデル設計・フロント設計・UX は規模比按分では過小なため実態に合わせて設定。<strong>さらに画面が持つ処理の難易度を考慮し、実装系工程（実装・設計・UX・単体テスト）に難易度プレミアム ×2 を適用</strong>（api-impl 5.5→11.0h・api-test 2.9→5.8h・fe-impl 5.4→10.8h・UX 3.0→6.0h・データ実装 0.4→0.8h・データモデル設計 0.3→0.6h・フロント設計 0.5→1.0h）。APIレビュー・フロントレビュー・動作確認は人の確認工数として AsIs / ToBe をそろえる（各0.25h / 0.25h / 1.5h）。<strong>さらに API不具合修正（人力 8.0h）を加算</strong>（難易度プレミアム対象外）。合計 約46.0h。",
        "<strong>ToBe（AI駆動）は実績 5.1h</strong>: AI 1.6h（API実装 0.55 / API単体テスト 0.1 / FE実装 0.6 / UX 0.1 / データ実装 0.15 / FE設計 0.05 / データモデル設計 0.05）＋ APIレビュー 0.25h（エンジニア）＋ フロントレビュー 0.25h（エンジニア）＋ 動作確認 1.5h（エンジニア）＋ API不具合修正 0.5h（AI）＋ 画面調整 1.0h（うちエンジニア 0.5h）。削減率 <strong>約89%</strong>。AI が削減できるのは実装・設計・単体テスト・不具合修正工程で、レビュー・動作確認・画面調整の人間工数は残る。",
      ],
    },
    // トップページ (FE028 / DM11 ドライバー業務) - お問い合わせ番号検索 + 配送状況サマリー + 本日の配送先一覧。
    // 実績コード量: API 145 / フロントエンド 3,134 行 (DB/テストなし)。現時点(着手中)の値。
    // AsIs: お知らせ登録(FE015) の行あたり工数を実績LOCに適用 (api-impl 8h/369行・fe-impl 33.5h/1694行)。fe-design/UX は規模比で按分。合計 約79.8h。
    // ToBe: AI 2.0h + APIレビュー 0.25h(エンジニア) + フロントレビュー 0.7h(エンジニア) + 動作確認 0.8h(エンジニア) = 3.75h (実績)。
    'wi-screen-DM11FE028': {
      lede: "<strong>トップページ</strong>（FE028 / DM11 ドライバー業務）の開発工数比較。<strong>お問い合わせ番号検索＋配送状況サマリー＋本日の配送先一覧</strong>を表示するドライバー用トップ。実績コード量は API <strong>145 行</strong>・フロントエンド <strong>3,134 行</strong>（DB/テストなし・現時点/着手中）。<strong>AsIs は行数規模から推定</strong>（お知らせ登録(FE015) の行あたり工数を適用）。合計 約79.8h。<strong>ToBe は実績</strong>（AI 2.0h ＋ APIレビュー 0.25h ＋ フロントレビュー 0.7h ＋ 動作確認 0.8h ＝ 3.75h）。削減率 <strong>約95%</strong>。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                            color: "#ef4444", asis: 3,  tobe: 0 },
        { key: "logic",  label: "ロジックバグ (検索・サマリー集計・一覧)",    color: "#f59e0b", asis: 11, tobe: 4 },
        { key: "edge",   label: "エッジケース漏れ (空・該当なし・日付境界)",  color: "#8b5cf6", asis: 8,  tobe: 3 },
        { key: "spec",   label: "仕様解釈ミス (表示項目・検索仕様の解釈)",    color: "#ec4899", asis: 6,  tobe: 6 },
        { key: "ui",     label: "UI 細部の不整合 (レイアウト・SP表示)",       color: "#06b6d4", asis: 8,  tobe: 3 },
      ],
      bugRateNote: "※ トップページ 約 3.0 KLOC × 参考レート（人力 12/KLOC ≒ 36件 / AI 5/KLOC ≒ 15件）で推定。検索＋サマリー＋一覧の構成で、論点は <strong>表示項目・検索仕様の解釈</strong>。",
      tasks: {
        'data-design': { asis: 0,                 tobe: 0,    tobeEng: 0,   agents: ["—"] },
        'data-impl':   { asis: 0,    loc: 0,      tobe: 0,    tobeEng: 0,   agents: ["—"] },
        'api-impl':    { asis: 3.1,  loc: 145,    tobe: 0.5,  tobeEng: 0,    agents: ["バックエンドAI"] },
        'api-test':    { asis: 0,    loc: 0,      tobe: 0,    tobeEng: 0,    agents: ["—"] },
        'api-review':  { asis: 0.25,             tobe: 0.25, tobeEng: 0.25, agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'ux':          { asis: 7.3,               tobe: 0.05, tobeEng: 0,   agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 5.6,               tobe: 0.05, tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 62.0, loc: 3134,   tobe: 1.4,  tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-test':     {                                                    agents: ["—"] },
        'fe-review':   { asis: 0.7,               tobe: 0.7,  tobeEng: 0.7, agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 0.8,               tobe: 0.8,  tobeEng: 0.8, agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
      },
      contextNotes: [
        "対象画面: トップページ（FE028 / DM11 ドライバー業務）。お問い合わせ番号検索・配送状況サマリー・本日の配送先一覧を表示するドライバー用トップ。現時点（着手中）の実績で集計。",
        "<strong>実績コード量</strong>: API <strong>145 行</strong> / フロントエンド <strong>3,134 行</strong>（DB 0・ユニットテスト 0、現時点）。工程区分はお知らせ登録(FE015)のフォーマットを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（api-impl 8h/369行 → 3.1h・fe-impl 33.5h/1694行 → 62.0h）。フロント設計（5.6h）・UX（7.3h）は規模比で按分。APIレビュー（0.25h）・フロントレビュー（0.7h）・動作確認（0.8h）は人の確認工数として AsIs / ToBe をそろえる。合計 約79.8h。",
        "<strong>ToBe（AI駆動）は実績 3.75h</strong>: AI 2.0h（API実装 0.5 / UX 0.05 / FE設計 0.05 / FE実装 1.4）＋ APIレビュー 0.25h（エンジニア）＋ フロントレビュー 0.7h（エンジニア）＋ 動作確認 0.8h（エンジニア）。削減率 <strong>約95%</strong>。AI が削減できるのは実装・設計工程で、レビュー・動作確認の人間工数は AsIs と同水準。",
      ],
    },
    // トップメニュー (FE011 / DM04) - 既存コンポーネントの細微な変更と組み合わせで解決したため実装は軽量。
    // 実績コード量: フロントエンド 1,108 行 (DB/API/テストなし)。
    // AsIs: お知らせ登録(FE015) の行あたり工数を実績LOCに適用 (fe-impl 33.5h/1694行)。
    //       fe-design は規模比で按分。UX は「組み合わせ設計を要した」ため通常按分(約2.45h)の約6倍 ≒ 14.7h に設定。合計 約40.6h。
    // ToBe: AI 2.0h + フロントレビュー 1.0h(エンジニア) + 動作確認 1.0h(エンジニア) + レイアウト調整 2.0h(うちエンジニア1.0h) = 6.0h (実績)。
    'wi-screen-DM04FE011': {
      lede: "<strong>トップメニュー</strong>（FE011 / DM04 管理情報通知）の開発工数比較。<strong>既存コンポーネントの細微な変更と組み合わせ</strong>で解決したため実装は軽量（フロントエンド <strong>1,108 行</strong>、DB/API なし）。<strong>AsIs は行数規模から推定</strong>（お知らせ登録(FE015) の行あたり工数を適用）。ただし<strong>クレバーな組み合わせ設計を要したため UX 設計を通常の約6倍（通常 ≒2.45h → ≒14.7h）</strong>に設定。AsIs 合計 約40.6h。<strong>ToBe は実績</strong>（AI 2.0h ＋ フロントレビュー 1.0h ＋ 動作確認 1.0h ＋ レイアウト調整 2.0h ＋ フロントエンド調整（コンポーネント組み込み）1.0h ＝ 7.0h）。削減率 <strong>約83%</strong>。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                            color: "#ef4444", asis: 1, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (一覧集約・遷移・表示制御)",    color: "#f59e0b", asis: 4, tobe: 1 },
        { key: "edge",   label: "エッジケース漏れ (空・件数0・権限差)",       color: "#8b5cf6", asis: 3, tobe: 1 },
        { key: "spec",   label: "仕様解釈ミス (表示項目・遷移先の解釈)",      color: "#ec4899", asis: 2, tobe: 2 },
        { key: "ui",     label: "UI 細部の不整合 (レイアウト・コンポーネント組合せ)", color: "#06b6d4", asis: 4, tobe: 1 },
      ],
      bugRateNote: "※ トップメニュー 約 1.1 KLOC × 参考レート（人力 12/KLOC ≒ 13件 / AI 5/KLOC ≒ 6件）で推定。既存コンポーネントの組み合わせで構成するため、論点は <strong>表示項目・遷移先の解釈とコンポーネント組合せ</strong>。",
      tasks: {
        'data-design': { asis: 0,                 tobe: 0, tobeEng: 0, agents: ["—"] },
        'data-impl':   { asis: 0,    loc: 0,      tobe: 0, tobeEng: 0, agents: ["—"] },
        'api-impl':    { asis: 0,    loc: 0,      tobe: 0, tobeEng: 0, agents: ["—"] },
        'api-test':    { asis: 0,    loc: 0,      tobe: 0, tobeEng: 0, agents: ["—"] },
        'api-review':  { asis: 0,                 tobe: 0, tobeEng: 0, agents: ["—"] },
        'ux':          { asis: 14.7,              tobe: 0.45, tobeEng: 0,   agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 2.0,               tobe: 0.15, tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 21.9, loc: 1108,   tobe: 1.4,  tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-test':     {                                                    agents: ["—"] },
        'fe-review':   { asis: 1.0,               tobe: 1.0,  tobeEng: 1.0, agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 1.0,               tobe: 1.0,  tobeEng: 1.0, agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
        'layout-adjust': {
          label: "レイアウト調整",
          color: "#fbbf24",
          asis: 0,
          tobe: 2.0, tobeEng: 1.0,
          agents: ["フロントエンドAI", "エンジニア"],
        },
        'fe-component-adjust': {
          label: "フロントエンド調整(コンポーネント組み込み)",
          color: "#fbbf24",
          asis: 0,
          tobe: 1.0, tobeEng: 1.0,
          agents: ["エンジニア"],
        },
      },
      contextNotes: [
        "対象画面: トップメニュー（FE011 / DM04 管理情報通知）。配送日変更リスト・お知らせ・未配車リスト・掲示板などのサマリーを集約表示。既存コンポーネントの細微な変更と組み合わせで解決したため実装は軽量。",
        "<strong>実績コード量</strong>: フロントエンド <strong>1,108 行</strong>（DB 0・API 0・ユニットテスト 0）。工程区分はお知らせ登録(FE015)のフォーマットを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（fe-impl 33.5h/1694行 → 21.9h）。フロント設計は規模比で按分（2.0h）。<strong>UX 設計は『既存コンポーネントの組み合わせ設計』を要したため通常按分（約2.45h）の約6倍 ≒ 14.7h</strong>に設定。フロントレビュー・動作確認は人の確認工数として AsIs / ToBe をそろえる（各1.0h）。合計 約40.6h。",
        "<strong>ToBe（AI駆動）は実績 7.0h</strong>: AI 2.0h（UX 0.45 / FE設計 0.15 / FE実装 1.4）＋ フロントレビュー 1.0h（エンジニア）＋ 動作確認 1.0h（エンジニア）＋ レイアウト調整 2.0h（うちエンジニア 1.0h）＋ フロントエンド調整（コンポーネント組み込み）1.0h（エンジニア）。削減率 <strong>約83%</strong>。AI が削減できるのは実装・設計工程で、レビュー・動作確認・調整の人間工数は AsIs と同水準。",
      ],
    },
    // デポ掲示板 (FE013) / 〇〇掲示板 (FE014) - 共通実装のため 2画面の実績合計を 50% ずつ按分。
    // 実績コード量(2画面合計): DB 0 / バックエンド 378 / ユニットテスト 0 / フロントエンド 968 行。
    // AsIs: お知らせ登録(FE015) の行あたり工数を実績LOCに適用 (api-impl 8h/369行・fe-impl 33.5h/1694行)。
    //       fe-design/UX は規模比で按分、レビュー・動作確認は人の確認工数として AsIs=ToBe。2画面合計 約34.5h → 各画面 17.25h。
    // ToBe(2画面合計): AI 1.5h + BEレビュー 0.5h + FEレビュー 1.0h + 動作確認 1.0h + 機能調整 1.0h = 5.0h → 各画面 2.5h。
    'wi-screen-DM04FE013': {
      lede: "<strong>デポ掲示板</strong>（FE013 / DM04 管理情報通知）の開発工数比較。〇〇掲示板(FE014)と共通実装のため、<strong>2掲示板の実績合計を 50% ずつ按分</strong>した値。実績コード量(2画面合計)は DB <strong>0 行</strong>・バックエンド <strong>378 行</strong>・ユニットテスト <strong>0 行</strong>・フロントエンド <strong>968 行</strong>。<strong>AsIs は行数規模から推定</strong>（お知らせ登録(FE015) の行あたり工数を適用、本画面ぶん＝50%）、<strong>ToBe は実績</strong>（AI 0.75h ＋ バックエンドレビュー 0.25h ＋ フロントレビュー 0.5h ＋ 動作確認 0.5h ＋ 機能調整 0.5h ＝ 2.5h／いずれも合計の50%）。さらに本画面は工程先頭に <strong>[試行特有]仕様解析 4.0h（人間・按分対象外）</strong>を含み、<strong>ToBe 合計は 6.5h（試行あり）</strong>。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                            color: "#ef4444", asis: 1, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (検索・並び順・掲示対象)",      color: "#f59e0b", asis: 3, tobe: 1 },
        { key: "edge",   label: "エッジケース漏れ (空・期間境界・該当なし)",  color: "#8b5cf6", asis: 2, tobe: 1 },
        { key: "spec",   label: "仕様解釈ミス (掲示対象・公開範囲の解釈)",    color: "#ec4899", asis: 1, tobe: 1 },
        { key: "ui",     label: "UI 細部の不整合 (一覧列・フォーム配置)",     color: "#06b6d4", asis: 1, tobe: 1 },
      ],
      bugRateNote: "※ デポ掲示板 約 0.67 KLOC（2画面合計 約1.35 KLOC の50%）× 参考レート（人力 12/KLOC ≒ 8件 / AI 5/KLOC ≒ 3件）で推定。掲示板の一覧・登録構成で、論点は <strong>掲示対象・公開範囲の解釈</strong>。",
      tasks: {
        'data-design': { asis: 0,                tobe: 0,    tobeEng: 0,    agents: ["—"] },
        'data-impl':   { asis: 0,    loc: 0,     tobe: 0,    tobeEng: 0,    agents: ["—"] },
        'api-impl':    { asis: 4.1,  loc: 189,   tobe: 0.20, tobeEng: 0,    agents: ["バックエンドAI"] },
        'api-test':    { asis: 0,    loc: 0,     tobe: 0,    tobeEng: 0,    agents: ["—"] },
        'api-review':  { asis: 0.25,             tobe: 0.25, tobeEng: 0.25, agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'ux':          { asis: 1.5,              tobe: 0.05, tobeEng: 0,    agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 0.85,             tobe: 0.05, tobeEng: 0,    agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 9.55, loc: 484,   tobe: 0.45, tobeEng: 0,    agents: ["フロントエンドAI"] },
        'fe-test':     {                                                    agents: ["—"] },
        'fe-review':   { asis: 0.5,              tobe: 0.5,  tobeEng: 0.5,  agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 0.5,              tobe: 0.5,  tobeEng: 0.5,  agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
        'func-adjust': {
          label: "機能調整",
          color: "#fbbf24",
          asis: 0,
          tobe: 0.5, tobeEng: 0.5,
          agents: ["フロントエンドAI", "エンジニア"],
        },
      },
      contextNotes: [
        "対象画面: デポ掲示板（FE013 / DM04 管理情報通知）。〇〇掲示板(FE014)と共通実装のため、2掲示板の実績合計を 50% ずつ按分した値で表示する。",
        "<strong>デポ掲示板のみ</strong>: 工程の先頭に <strong>[試行特有]仕様解析 4.0h（人間・按分対象外）</strong>を追加（試行特有のため AsIs なし）。本画面 ToBe は 按分分 2.5h ＋ 仕様解析 4.0h ＝ <strong>6.5h</strong>。",
        "<strong>実績コード量（2画面合計）</strong>: DB <strong>0 行</strong> / バックエンド <strong>378 行</strong> / ユニットテスト <strong>0 行</strong> / フロントエンド <strong>968 行</strong>。本画面ぶんは各 50%（API 189 行・FE 484 行）。工程区分はお知らせ登録(FE015)のフォーマットを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（api-impl 8h/369行・fe-impl 33.5h/1694行）。フロント設計・UX は規模比で按分。バックエンド/フロントレビュー・動作確認は人の確認工数として AsIs / ToBe をそろえる。2画面合計 約34.5h → 本画面（50%）約17.25h。",
        "<strong>ToBe（AI駆動）は実績</strong>: 2画面合計 AI 1.5h ＋ バックエンドレビュー 0.5h ＋ フロントレビュー 1.0h ＋ 動作確認 1.0h ＋ 機能調整 1.0h ＝ 5.0h。本画面（50%）は 2.5h。削減率 <strong>約85%</strong>。",
        "想定バグ数は規模（本画面 約0.67 KLOC）から推定。",
      ],
    },
    'wi-screen-DM04FE014': {
      lede: "<strong>〇〇掲示板</strong>（FE014 / DM04 管理情報通知）の開発工数比較。デポ掲示板(FE013)と共通実装のため、<strong>2掲示板の実績合計を 50% ずつ按分</strong>した値。実績コード量(2画面合計)は DB <strong>0 行</strong>・バックエンド <strong>378 行</strong>・ユニットテスト <strong>0 行</strong>・フロントエンド <strong>968 行</strong>。<strong>AsIs は行数規模から推定</strong>（お知らせ登録(FE015) の行あたり工数を適用、本画面ぶん＝50%）、<strong>ToBe は実績</strong>（AI 0.75h ＋ バックエンドレビュー 0.25h ＋ フロントレビュー 0.5h ＋ 動作確認 0.5h ＋ 機能調整 0.5h ＝ 2.5h／いずれも合計の50%）。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                            color: "#ef4444", asis: 1, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (検索・並び順・掲示対象)",      color: "#f59e0b", asis: 3, tobe: 1 },
        { key: "edge",   label: "エッジケース漏れ (空・期間境界・該当なし)",  color: "#8b5cf6", asis: 2, tobe: 1 },
        { key: "spec",   label: "仕様解釈ミス (掲示対象・公開範囲の解釈)",    color: "#ec4899", asis: 1, tobe: 1 },
        { key: "ui",     label: "UI 細部の不整合 (一覧列・フォーム配置)",     color: "#06b6d4", asis: 1, tobe: 1 },
      ],
      bugRateNote: "※ 〇〇掲示板 約 0.67 KLOC（2画面合計 約1.35 KLOC の50%）× 参考レート（人力 12/KLOC ≒ 8件 / AI 5/KLOC ≒ 3件）で推定。掲示板の一覧・登録構成で、論点は <strong>掲示対象・公開範囲の解釈</strong>。",
      tasks: {
        'data-design': { asis: 0,                tobe: 0,    tobeEng: 0,    agents: ["—"] },
        'data-impl':   { asis: 0,    loc: 0,     tobe: 0,    tobeEng: 0,    agents: ["—"] },
        'api-impl':    { asis: 4.1,  loc: 189,   tobe: 0.20, tobeEng: 0,    agents: ["バックエンドAI"] },
        'api-test':    { asis: 0,    loc: 0,     tobe: 0,    tobeEng: 0,    agents: ["—"] },
        'api-review':  { asis: 0.25,             tobe: 0.25, tobeEng: 0.25, agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'ux':          { asis: 1.5,              tobe: 0.05, tobeEng: 0,    agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 0.85,             tobe: 0.05, tobeEng: 0,    agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 9.55, loc: 484,   tobe: 0.45, tobeEng: 0,    agents: ["フロントエンドAI"] },
        'fe-test':     {                                                    agents: ["—"] },
        'fe-review':   { asis: 0.5,              tobe: 0.5,  tobeEng: 0.5,  agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 0.5,              tobe: 0.5,  tobeEng: 0.5,  agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
        'func-adjust': {
          label: "機能調整",
          color: "#fbbf24",
          asis: 0,
          tobe: 0.5, tobeEng: 0.5,
          agents: ["フロントエンドAI", "エンジニア"],
        },
      },
      contextNotes: [
        "対象画面: 〇〇掲示板（FE014 / DM04 管理情報通知）。デポ掲示板(FE013)と共通実装のため、2掲示板の実績合計を 50% ずつ按分した値で表示する。",
        "<strong>実績コード量（2画面合計）</strong>: DB <strong>0 行</strong> / バックエンド <strong>378 行</strong> / ユニットテスト <strong>0 行</strong> / フロントエンド <strong>968 行</strong>。本画面ぶんは各 50%（API 189 行・FE 484 行）。工程区分はお知らせ登録(FE015)のフォーマットを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（api-impl 8h/369行・fe-impl 33.5h/1694行）。フロント設計・UX は規模比で按分。バックエンド/フロントレビュー・動作確認は人の確認工数として AsIs / ToBe をそろえる。2画面合計 約34.5h → 本画面（50%）約17.25h。",
        "<strong>ToBe（AI駆動）は実績</strong>: 2画面合計 AI 1.5h ＋ バックエンドレビュー 0.5h ＋ フロントレビュー 1.0h ＋ 動作確認 1.0h ＋ 機能調整 1.0h ＝ 5.0h。本画面（50%）は 2.5h。削減率 <strong>約85%</strong>。",
        "想定バグ数は規模（本画面 約0.67 KLOC）から推定。",
      ],
    },
    // 顧客情報詳細 (FE002 / DM01) - 顧客・配送情報の表示 + 各種メモ編集 (荷主メモ/特記事項/作業メモ)。
    // 実績コード量: DB 105 / API 82 / ユニットテスト 71 / フロントエンド 1,157 行。
    // AsIs: お知らせ登録(FE015) の「行あたり工数」を実績LOCに適用 (data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行・fe-impl 33.5h/1694行)。
    //       data-design/fe-design/UX は規模比で按分、api-review/動作確認は人の確認工数として AsIs=ToBe。合計 約39.6h。
    // ToBe: AI実装 2.0h + APIレビュー 0.5h(エンジニア) + 動作確認 2.0h(エンジニア) = 4.5h (実績)。
    'wi-screen-DM01FE002': {
      lede: "<strong>顧客情報詳細</strong>（FE002 / DM01 配送情報確認）の開発工数比較。<strong>顧客・配送情報の表示＋荷主メモ/特記事項/作業メモの編集</strong>を行う画面。実績コード量は DB <strong>105 行</strong>・API <strong>82 行</strong>・ユニットテスト <strong>71 行</strong>・フロントエンド <strong>1,157 行</strong>。<strong>AsIs は行数規模から推定</strong>（お知らせ登録(FE015) の行あたり工数を適用）、<strong>ToBe は実績</strong>（AI 実装 2.0h ＋ APIレビュー 0.5h ＋ フロントレビュー 1.5h ＋ 動作確認 2.0h ＋ レイアウト調整・仮実装 4.5h ＝ 10.5h）。レビュー・動作確認は人がコードを確認する工数として AsIs / ToBe をそろえている。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                                color: "#ef4444", asis: 2, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (購入履歴集計・メモ更新・表示制御)", color: "#f59e0b", asis: 6, tobe: 2 },
        { key: "edge",   label: "エッジケース漏れ (空値・長文メモ・履歴なし)",     color: "#8b5cf6", asis: 5, tobe: 2 },
        { key: "spec",   label: "仕様解釈ミス (メモ種別・表示項目の解釈)",         color: "#ec4899", asis: 3, tobe: 3 },
        { key: "ui",     label: "UI 細部の不整合 (詳細レイアウト・編集フォーム)",   color: "#06b6d4", asis: 4, tobe: 2 },
      ],
      bugRateNote: "※ 顧客情報詳細 約 1.4 KLOC × 参考レート（人力 12/KLOC ≒ 17件 / AI 5/KLOC ≒ 7件）で推定。表示＋複数メモ編集の構成で、論点は <strong>メモ種別・表示項目の解釈</strong>。AI でも業務固有の表示ルール・メモ運用は仕様で明示しないと <strong>仕様解釈ミス</strong> が残りやすい。",
      tasks: {
        'data-design': { asis: 2.5,             tobe: 0.15, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        'data-impl':   { asis: 3.8,  loc: 105,  tobe: 0.20, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        'api-impl':    { asis: 1.8,  loc: 82,   tobe: 0.10, tobeEng: 0,   agents: ["バックエンドAI"] },
        'api-test':    { asis: 1.0,  loc: 71,   tobe: 0.05, tobeEng: 0,   agents: ["バックエンドAI"] },
        'api-review':  { asis: 0.5,             tobe: 0.5,  tobeEng: 0.5, agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'ux':          { asis: 3.1,             tobe: 0.15, tobeEng: 0,   agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 2.0,             tobe: 0.10, tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 22.9, loc: 1157, tobe: 1.25, tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-test':     {                                                  agents: ["—"] },
        'fe-review':   { asis: 1.5,             tobe: 1.5,  tobeEng: 1.5, agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 2.0,             tobe: 2.0,  tobeEng: 2.0, agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
        'layout-adjust': {
          label: "レイアウト調整・仮実装",
          color: "#fbbf24",
          asis: 0,
          tobe: 4.5, tobeEng: 4.0,
          agents: ["フロントエンドAI", "エンジニア"],
        },
      },
      contextNotes: [
        "対象画面: 顧客情報詳細（FE002 / DM01 配送情報確認）。顧客・配送情報の表示に加え、荷主メモ・特記事項・作業メモの編集を行う。",
        "<strong>実績コード量</strong>: DB <strong>105 行</strong> / API <strong>82 行</strong> / ユニットテスト <strong>71 行</strong> / フロントエンド <strong>1,157 行</strong>（計 約1,415行）。工程区分はお知らせ登録(FE015)のフォーマットを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行・fe-impl 33.5h/1694行）。データモデル設計・フロント設計・UX は規模比で按分。APIレビュー・フロントレビュー・動作確認は人の確認工数として AsIs / ToBe をそろえる。合計 約41.1h。",
        "<strong>ToBe（AI駆動）は実績 10.5h</strong>: AI 実装 2.0h（DB/API/テスト/UX/FE 設計・実装）＋ APIレビュー 0.5h（エンジニア）＋ フロントレビュー 1.5h（エンジニア）＋ 動作確認 2.0h（エンジニア）＋ レイアウト調整・仮実装 4.5h（うちエンジニア 4.0h）。削減率 <strong>約74%</strong>。AI が削減できるのは実装・設計工程で、レビュー・動作確認・レイアウト調整の人間工数は AsIs と同水準。",
        "想定バグ数は規模（約1.4 KLOC）から推定。表示＋複数メモ編集のため、メモ種別・表示項目の解釈が論点。",
      ],
    },
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
    // 配送日変更リスト (FE017 / DM06 変更情報管理) - 配送日変更の一覧表示 + 条件検索。
    // 実績コード量: DB 65 / API 405 / ユニットテスト 448 / フロントエンド 870 行。
    // AsIs: お知らせ登録(FE015) の行あたり工数を実績LOCに適用 (data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行・fe-impl 33.5h/1694行)。
    //       データモデル設計・フロント設計・UX は規模比で按分。合計 約40.9h。
    // ToBe: AI 1.0h + APIレビュー 0.25h + フロントレビュー 0.25h + 動作確認 0.5h
    //       + フロントエンド調整 1.0h(うちエンジニア0.5h) + バックエンド調整 1.0h(うちエンジニア0.5h) = 4.0h (実績)。
    'wi-screen-DM06FE017': {
      lede: "<strong>配送日変更リスト</strong>（FE017 / DM06 変更情報管理）の開発工数比較。<strong>配送日変更の一覧表示＋条件検索</strong>を行う画面。実績コード量は DB <strong>65 行</strong>・API <strong>405 行</strong>・ユニットテスト <strong>448 行</strong>・フロントエンド <strong>870 行</strong>。<strong>AsIs は行数規模から推定</strong>（お知らせ登録(FE015) の行あたり工数を適用）。データモデル設計・フロント設計・UX は規模比で按分。合計 約40.9h。<strong>ToBe は実績</strong>（AI 1.0h ＋ APIレビュー 0.25h ＋ フロントレビュー 0.25h ＋ 動作確認 0.5h ＋ フロントエンド調整 1.0h ＋ バックエンド調整 1.0h ＝ 4.0h）。削減率 <strong>約90%</strong>。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                            color: "#ef4444", asis: 2,  tobe: 0 },
        { key: "logic",  label: "ロジックバグ (変更リスト集計・条件検索・状態判定)", color: "#f59e0b", asis: 5,  tobe: 2 },
        { key: "edge",   label: "エッジケース漏れ (空・該当なし・日付境界)",  color: "#8b5cf6", asis: 3,  tobe: 1 },
        { key: "spec",   label: "仕様解釈ミス (変更対象・表示項目の解釈)",    color: "#ec4899", asis: 3,  tobe: 3 },
        { key: "ui",     label: "UI 細部の不整合 (一覧表示・SP表示)",         color: "#06b6d4", asis: 3,  tobe: 1 },
      ],
      bugRateNote: "※ 配送日変更リスト 約 1.34 KLOC（製品コード・テスト除く）× 参考レート（人力 12/KLOC ≒ 16件 / AI 5/KLOC ≒ 7件）で推定。配送日変更の一覧表示＋条件検索の構成で、論点は <strong>変更対象・検索条件・表示項目の解釈</strong>。AI でも業務固有の変更管理ルールは仕様で明示しないと <strong>仕様解釈ミス</strong> が残りやすい。",
      tasks: {
        'data-design': { asis: 1.5,             tobe: 0.03, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        'data-impl':   { asis: 2.3,  loc: 65,   tobe: 0.1,  tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        'api-impl':    { asis: 8.8,  loc: 405,  tobe: 0.4,  tobeEng: 0,   agents: ["バックエンドAI"] },
        'api-test':    { asis: 6.1,  loc: 448,  tobe: 0.1,  tobeEng: 0,   agents: ["バックエンドAI"] },
        'api-review':  { asis: 0.25,            tobe: 0.25, tobeEng: 0.25, agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'ux':          { asis: 2.5,             tobe: 0.05, tobeEng: 0,   agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 1.5,             tobe: 0.02, tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 17.2, loc: 870,  tobe: 0.3,  tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-test':     {                                                  agents: ["—"] },
        'fe-review':   { asis: 0.25,            tobe: 0.25, tobeEng: 0.25, agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 0.5,             tobe: 0.5,  tobeEng: 0.5, agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
        'fe-adjust': {
          label: "フロントエンド調整",
          color: "#fbbf24",
          asis: 0,
          tobe: 1.0, tobeEng: 0.5,
          agents: ["フロントエンドAI", "エンジニア"],
        },
        'be-adjust': {
          label: "バックエンド調整",
          color: "#fbbf24",
          asis: 0,
          tobe: 1.0, tobeEng: 0.5,
          agents: ["バックエンドAI", "エンジニア"],
        },
      },
      contextNotes: [
        "対象画面: 配送日変更リスト（FE017 / DM06 変更情報管理）。配送日変更の一覧表示と条件検索を行う。",
        "<strong>実績コード量</strong>: DB <strong>65 行</strong> / API <strong>405 行</strong> / ユニットテスト <strong>448 行</strong> / フロントエンド <strong>870 行</strong>（計 約1,788行）。工程区分はお知らせ登録(FE015)のフォーマットを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（data-impl 6h/166行 → 2.3h・api-impl 8h/369行 → 8.8h・api-test 3.5h/256行 → 6.1h・fe-impl 33.5h/1694行 → 17.2h）。データモデル設計（1.5h）・フロント設計（1.5h）・UX（2.5h）は規模比で按分。APIレビュー・フロントレビュー・動作確認は人の確認工数として AsIs / ToBe をそろえる（各0.25h / 0.25h / 0.5h）。合計 約40.9h。",
        "<strong>ToBe（AI駆動）は実績 4.0h</strong>: AI 1.0h（API実装 0.4 / API単体テスト 0.1 / FE実装 0.3 / データ実装 0.1 / UX 0.05 / データモデル設計 0.03 / FE設計 0.02）＋ APIレビュー 0.25h（エンジニア）＋ フロントレビュー 0.25h（エンジニア）＋ 動作確認 0.5h（エンジニア）＋ フロントエンド調整 1.0h（うちエンジニア 0.5h）＋ バックエンド調整 1.0h（うちエンジニア 0.5h）。削減率 <strong>約90%</strong>。AI が削減できるのは実装・設計工程で、レビュー・動作確認・調整の人間工数は残る。",
      ],
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
    // 帳票作成通知 (FE012 / DM04) - 閲覧画面（条件検索 + 帳票通知一覧表示）。帳票ファイル・バッチログ
    // （バックエンドのみ生成テーブル）を参照する読み取り専用画面のため DB 工程は発生しない（実績 DB 0 行）。
    // AsIs: お知らせ登録(FE015) の「行あたり工数」を実績LOCに適用 (api-impl 8h/369行・fe-impl 33.5h/1694行)。
    //       設計・UX は LOC 規模比で按分 (fe-design は fe-impl 比 767/1694、UX は実装LOC合計比 842/2485)。
    // ToBe: AI実装 0.75h + APIレビュー 0.25h(エンジニア) + 動作確認 0.5h(エンジニア) = 1.5h。
    'wi-screen-DM04FE012': {
      lede: "<strong>帳票作成通知</strong>（FE012 / DM04 管理情報通知）の開発工数比較。<strong>条件検索 + 帳票通知一覧表示</strong>の読み取り専用（閲覧）画面で、帳票ファイル・バッチログ（バックエンドのみ生成テーブル）を参照するため<strong>DB 工程は発生しない</strong>（実績 DB 0 行）。実績コード量はバックエンド <strong>75 行</strong>・フロントエンド <strong>767 行</strong>。工程はお知らせ登録(FE015)のフォーマットに準拠。<strong>AsIs は行数規模から推定</strong>（FE015 の行あたり工数を適用）、<strong>ToBe は AI 実装 0.75h + APIレビュー 0.25h + 動作確認 0.5h + レイアウト調整 1.0h</strong>。レビュー・動作確認は人がコードを確認する工数として AsIs / ToBe をそろえている。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                              color: "#ef4444", asis: 1, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (検索条件・並び順・絞り込み)",     color: "#f59e0b", asis: 3, tobe: 1 },
        { key: "edge",   label: "エッジケース漏れ (該当なし・期間境界・空結果)",  color: "#8b5cf6", asis: 2, tobe: 1 },
        { key: "spec",   label: "仕様解釈ミス (帳票種別・通知対象の解釈)",        color: "#ec4899", asis: 2, tobe: 2 },
        { key: "ui",     label: "UI 細部の不整合 (一覧列・検索フォーム配置)",     color: "#06b6d4", asis: 2, tobe: 1 },
      ],
      bugRateNote: "※ 帳票作成通知 約 0.84 KLOC × 参考レート（人力 12/KLOC ≒ 10件 / AI 5/KLOC ≒ 4件）で推定。条件検索 + 一覧表示の読み取り専用画面で、論点は <strong>検索条件・並び順・帳票種別/通知対象の解釈</strong>。AI でも業務固有の帳票種別・通知条件は仕様で明示しないと <strong>仕様解釈ミス</strong> が残りやすい（お知らせ登録・商品マスタと同傾向）。",
      tasks: {
        'data-design': { asis: 0,    loc: 0,   tobe: 0,    tobeEng: 0,    agents: ["—"] },
        'data-impl':   { asis: 0,    loc: 0,   tobe: 0,    tobeEng: 0,    agents: ["—"] },
        'api-impl':    { asis: 1.6,  loc: 75,  tobe: 0.10, tobeEng: 0,    agents: ["バックエンドAI"] },
        'api-test':    { asis: 0,    loc: 0,   tobe: 0,    tobeEng: 0,    agents: ["—"] },
        'api-review':  { asis: 0.25,           tobe: 0.25, tobeEng: 0.25, agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'ux':          { asis: 1.9,            tobe: 0.15, tobeEng: 0,    agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 1.4,            tobe: 0.05, tobeEng: 0,    agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 15.2, loc: 767, tobe: 0.45, tobeEng: 0,    agents: ["フロントエンドAI"] },
        'fe-test':     {                                                  agents: ["—"] },
        'fe-review':   {                                                  agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 0.5,            tobe: 0.5,  tobeEng: 0.3,  agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
        'layout-adjust': {
          label: "レイアウト調整",
          color: "#fbbf24",
          asis: 0,
          tobe: 1, tobeEng: 0.75,
          agents: ["フロントエンドAI", "エンジニア"],
        },
      },
      contextNotes: [
        "対象画面: 帳票作成通知（FE012 / DM04 管理情報通知）。条件検索 + 帳票通知一覧表示の読み取り専用（閲覧）画面。帳票ファイル・バッチログ（バックエンドのみ生成テーブル）を参照するため、画面側に DB 工程は発生しない（実績 DB 0 行・ユニットテスト 0 行）。",
        "<strong>実績コード量</strong>: バックエンド <strong>75 行</strong> / フロントエンド <strong>767 行</strong>（DB 0・ユニットテスト 0）。工程区分はお知らせ登録(FE015)のフォーマットを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（api-impl 8h/369行・fe-impl 33.5h/1694行）。設計・UX 工程は LOC 規模比で按分（fe-design は fe-impl 比 767/1694、UX は実装LOC合計比 842/2485）。APIレビュー・動作確認は人の確認工数として AsIs / ToBe をそろえる。合計 約20.9h。",
        "<strong>ToBe（AI駆動）は 2.5h</strong>: AI 実装 0.75h（API実装 0.10 / UX 0.15 / FE設計 0.05 / FE実装 0.45）＋ APIレビュー 0.25h（エンジニア）＋ 動作確認 0.5h（うちエンジニア 0.3h）＋ レイアウト調整 1.0h（うちエンジニア 0.75h）。削減率 <strong>約88%</strong>。AI が削減できるのは実装・設計工程で、レビュー・動作確認・レイアウト調整の人間工数は AsIs と同水準。",
        "想定バグ数は規模（約0.84 KLOC）から推定。閲覧専用画面のため検索条件・並び順・該当なし境界・帳票種別の解釈が論点。",
      ],
    },
    // 配送情報照会 (FE001 / PW-134) — 閲覧スコープ。ToBe は実測 (time-log.jsonl): 標準開発 8.0h + 試行特有 1.43h = 計9.43h。
    // AsIs は実装系工程を実績LOC(概算)から推定、レビュー/動作確認/仕様確認は人間工数として AsIs=ToBe。試行特有(紫)= 系統B。
    'wi-screen-DM01FE001': {
      lede: "AIDD 試行「配送情報照会」(FE001 / PW-134) の開発工数比較。<strong>t_delivery_history を根に 検索16条件・一覧15列・代表行(最新のみ)表示</strong>を扱う<strong>閲覧スコープ</strong>の画面。<strong>第1版(縮退8列)を撤回し v2 で mock 完全準拠</strong>へ作り直し、PR#79 レビュー対応・main 取り込みまで実施。<strong>ToBe は実測</strong>(time-log.jsonl): 標準開発 8.0h ＋ <span style=\"color:#9333ea\">試行特有 1.43h</span> ＝ 計 9.43h。AsIs は実績コード量(概算)から推定。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                                              color: "#ef4444", asis: 6,  tobe: 0 },
        { key: "logic",  label: "ロジックバグ (DISTINCT ON最新表示・担当者検索・認可・楽観ロック)", color: "#f59e0b", asis: 12, tobe: 4 },
        { key: "edge",   label: "エッジケース漏れ (電話番号ハイフン正規化・日付範囲・空検索)",        color: "#8b5cf6", asis: 9,  tobe: 4 },
        { key: "spec",   label: "仕様解釈ミス (配送ステータス語彙差 mock12種 vs uc10種・縮退撤回)",   color: "#ec4899", asis: 4,  tobe: 8 },
        { key: "ui",     label: "UI 細部の不整合 (15列・複数OR検索タグ・履歴表示方法)",              color: "#06b6d4", asis: 8,  tobe: 5 },
      ],
      bugRateNote: "※ 配送情報照会 約 1.9 KLOC。データモデル仕様(配送ステータス語彙)未確定での着手により「<strong>仕様解釈ミス</strong>」が突出 (ToBe 8件): mock COMPLETION_STATUS 12種 vs backend uc準拠10種の語彙差、第1版の縮退8列を v2 で mock 完全準拠へ撤回した経緯を反映。電話番号のハイフン有無正規化・最新行表示(DISTINCT ON)の担当者検索バグは実測で発生し修正済。",
      tasks: {
        'data-design': { asis: 4,             tobe: 0.2,                 agents: ["DBアーキテクトAI"] },
        'data-impl':   { asis: 4,   loc: 120, tobe: 0.3,                 agents: ["DBアーキテクトAI"] },
        'api-impl':    { asis: 15,  loc: 700, tobe: 1.4,                 agents: ["バックエンドAI"] },
        'api-test':    { asis: 3.5, loc: 250, tobe: 0.2,                 agents: ["バックエンドAI"] },
        'api-review':  { asis: 1.8,           tobe: 1.8, tobeEng: 1.8,   agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'ux':          { asis: 6,             tobe: 0.8, tobeEng: 0.5,   agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 4,             tobe: 0,                   agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 18,  loc: 900, tobe: 1.3,                 agents: ["フロントエンドAI"] },
        'fe-test':     {                                                 agents: ["—"] },
        'fe-review':   { asis: 0.5,           tobe: 0.5, tobeEng: 0.5,   agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 1.3,           tobe: 1.3, tobeEng: 1.2,   agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
        'spec-confirm':          { label: "仕様確認 (配送ステータス語彙・縮退撤回の方針判断)",            color: "#d97706", asis: 0, tobe: 0.5, tobeEng: 0.5, agents: ["エンジニア (業務確認)"] },
        'trial-review':          { label: "[試行特有] 縮退ルート禁止ドクトリン確立・課題抽出",            color: "#9333ea", asis: 0, tobe: 0.6, tobeEng: 0.6, agents: ["エンジニア (人間との議論)"] },
        'structure-improvement': { label: "[試行特有] 構造改修 (validate-brief §2-5/2-6・tester raw diff)", color: "#7e22ce", asis: 0, tobe: 0.5, tobeEng: 0.4, agents: ["エンジニア (ルール整備)"] },
      },
      contextNotes: [
        "対象画面: 配送情報照会 (FE001 / PW-134)。t_delivery_history を根に 検索16条件 + 一覧15列 + 代表行(最新のみ)表示。閲覧スコープ(CRUD なし)。第1版の縮退8列/6条件を撤回し v2 で mock 完全準拠(全15列16条件・暫定backing列+denormalize)へ作り直し。",
        "<strong>ToBe は実測</strong> (time-log.jsonl・2026-06-04〜06-08): 標準開発(系統A) 8.0h ＋ <span style=\"color:#9333ea\">試行特有(系統B) 1.43h</span> ＝ 計 9.43h。系統B内訳 = 縮退課題の構造分析 0.6h(cat2) + ルール実装 0.5h(cat1) + チェック漏れ是正 0.33h(cat2)。",
        "<strong>手戻りの主因</strong>: 第1版で『API/DB未対応』を理由に8列へ縮退 → mock と乖離 → v2 で全面 mock 準拠へ撤回。縮退ルートの自己判断が後追い修正(verify/fe-impl/仕様確認)を生んだ。再発防止として validate-brief に承認記録チェック(§2-6)・tester に raw diff 主義を組込み(紫: 構造改修)。",
        "<strong>AsIs は実績コード量(概算)から推定</strong>: 実装系工程に商品マスタ参考レート(api 8h/369行・fe 16h/810行・data 6h/166行・test 3.5h/256行)を適用。レビュー/動作確認/仕様確認は人間工数として AsIs=ToBe。合計 約58h → ToBe 9.43h(削減 約84%)。LOC は概算。",
      ],
    },
    // 代引き確認 (FE010 / PW-141) — 閲覧スコープ。ToBe は実測 (time-log.jsonl): 標準開発 1.5h(試行特有 0h)。
    // 確立済みフローを1セッションで通過。スキーマ変更なし(既存 invoicePrintings 拡張)。LOC は PR#84 diff (fe 約596 / api 約77 / seed 47)。
    // ※ 画面処理側の「代引き確認」は FE010(DM03 一覧表示)。FE053 は「代引き確認(DL)」(Excel出力)で別タブ。
    'wi-screen-DM03FE010': {
      lede: "AIDD 試行「代引き確認」(FE010 / PW-141) の開発工数比較。<strong>t_invoice_printing を根に 一覧10列・検索3条件・代引き額合計</strong>を表示する<strong>閲覧スコープ</strong>の画面。<strong>スキーマ変更なし</strong>(既存 invoicePrintings を拡張)。<strong>確立済みフローを1セッションで通過し ToBe 実測 1.5h</strong>(試行特有オーバーヘッド 0h)。AsIs は実績コード量から推定。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                                          color: "#ef4444", asis: 3, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (代引き額合計の絞り込み連動・DataLoader N+1)",      color: "#f59e0b", asis: 6, tobe: 2 },
        { key: "edge",   label: "エッジケース漏れ (代引き有無混在・日付範囲・@db.Date TZ)",        color: "#8b5cf6", asis: 5, tobe: 2 },
        { key: "spec",   label: "仕様解釈ミス (エリア名/配送担当者名 源なし・お問い合わせ番号正本)", color: "#ec4899", asis: 3, tobe: 4 },
        { key: "ui",     label: "UI 細部の不整合 (10列維持・Excel未実装通知文言)",                color: "#06b6d4", asis: 4, tobe: 2 },
      ],
      bugRateNote: "※ 代引き確認 約 0.7 KLOC(フロント 596行 + API拡張 77行)。スキーマ変更なしの閲覧画面で論点は <strong>源なし列(エリア名・配送担当者名)の扱い</strong>と <strong>お問い合わせ番号の正本</strong>(ifSlipNo か ifCustomerControlNo)。mock 列は縮退せず暫定『-』で維持し questions/PW-141.tsv に記録。確立済みフローで手戻りは reviewer Major 2件(内部ID漏洩・any型)のみ。",
      tasks: {
        'data-design': { asis: 1,             tobe: 0.05,                agents: ["—"] },
        'data-impl':   { asis: 0.5, loc: 47,  tobe: 0.1,                 agents: ["バックエンドAI(seed)"] },
        'api-impl':    { asis: 1.7, loc: 77,  tobe: 0.3,                 agents: ["バックエンドAI"] },
        'api-test':    { asis: 0,             tobe: 0,                   agents: ["—"] },
        'api-review':  { asis: 0.2,           tobe: 0.2, tobeEng: 0.2,   agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'ux':          { asis: 2,             tobe: 0.15, tobeEng: 0.1,  agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 1,             tobe: 0,                   agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 11.7, loc: 596, tobe: 0.45,              agents: ["フロントエンドAI"] },
        'fe-test':     {                                                 agents: ["—"] },
        'fe-review':   { asis: 0.1,           tobe: 0.1, tobeEng: 0.1,   agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 0.15,          tobe: 0.15, tobeEng: 0.15, agents: ["フロントエンドテスターAI", "エンジニア"] },
      },
      contextNotes: [
        "対象画面: 代引き確認 (FE010 / PW-141)。t_invoice_printing を根に 一覧10列 + 検索3条件(デポ複数/エリア複数/配送完了日範囲) + 代引き額合計フッタ + Excel出力(未実装通知)。閲覧スコープ。<strong>スキーマ変更なし</strong>(既存 invoicePrintings に depotIds/日付範囲 filter・depot ResolveField・codAmountTotal 集計を追加)。",
        "<strong>ToBe は実測</strong> (time-log.jsonl・2026-06-08): 標準開発(系統A) <strong>1.5h</strong> を1セッションで通過。<span style=\"color:#9333ea\">試行特有(系統B) 0h</span>。/start-task→planner→backend(seed+API)→reviewer+Major2件修正→frontend(skeleton/A/実装/B)→tester→サイドバー導線→PR まで。",
        "<strong>確立済みフローの効果</strong>: PW-134 までに投じた構造改修(縮退ルート禁止・raw diff・不明点TSV規律)が効き、手戻りは reviewer Major 2件(DataLoader内部ID漏洩→null・where any→Prisma型)のみ。PW-134(系統A 8.0h)比で大幅短縮。暫定(エリア名/配送担当者名=源なし『-』・お問い合わせ番号=ifSlipNo・Excel未実装通知)は questions/PW-141.tsv に記録(mock 列は縮退せず維持)。",
        "<strong>AsIs は実績コード量から推定</strong>: フロント 596行→11.7h(商品マスタ 16h/810行)、API拡張 77行→1.7h、seed 47行→0.5h。レビュー/動作確認は人間工数として AsIs=ToBe。合計 約18.3h → ToBe 1.5h(削減 約92%)。",
      ],
    },
    // 配車登録 (FE004 / PW-144 / DM02 配車管理) — 閲覧スコープ。ToBe は実測 (time-log.jsonl): 標準開発 3.9h (試行特有は計測対象外)。
    // スキーマ変更なし・新規バックエンドAPIなし (既存 searchDeliveryHistory 流用)。ドロワー対応は別タスク(FE001/PW-134・FE036)との兼ね合いで見送り→後工程で吸収。
    // LOC は PR#87 diff (frontend のみ 約1,261行・backend 0)。AsIs は実績コード量から推定。
    'wi-screen-DM02FE004': {
      lede: "AIDD 試行「配車登録」(FE004 / PW-144) の開発工数比較。<strong>t_delivery_history を searchDeliveryHistory で参照し 検索3条件(配車日/ドライバー/デポ)・配車結果一覧10列・配車状況バッジ・行クリック詳細ドロワー</strong>を扱う<strong>閲覧スコープ</strong>の画面。<strong>スキーマ変更なし・新規バックエンドAPIなし</strong>(既存 searchDeliveryHistory 流用で API追加不要と確定)。配車登録/一括操作は後続スコープ。<strong>ドロワーの内容整合は別タスク(FE001/PW-134 共有・FE036)との兼ね合いで本対応では見送り→後工程で吸収</strong>。<strong>ToBe は実測</strong>(time-log) <strong>3.9h</strong>(標準開発のみ／試行特有は計測対象外)。AsIs は実績コード量(概算)から推定。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                                          color: "#ef4444", asis: 3, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (3段結合の件数欠落・日付ISO・絞り込み連動)",      color: "#f59e0b", asis: 5, tobe: 2 },
        { key: "edge",   label: "エッジケース漏れ (日付形式 / 時間帯フォールバック / 履歴未生成)", color: "#8b5cf6", asis: 3, tobe: 1 },
        { key: "spec",   label: "仕様解釈ミス (配車状況値定義・配車日vs配送予定日・時間帯語彙差)", color: "#ec4899", asis: 2, tobe: 4 },
        { key: "ui",     label: "UI 細部の不整合 (時間帯整形・カレンダーpopper被り・10列維持)",   color: "#06b6d4", asis: 4, tobe: 2 },
      ],
      bugRateNote: "※ 配車登録 約 1.26 KLOC(フロントのみ)。閲覧スコープで論点は <strong>配車状況の値定義</strong>(mock DISPATCH_STATUS vs 実データ isShipped/deliveryStatus)・<strong>配車日と配送予定日の区別</strong>・<strong>時間帯の語彙差</strong>(時～時 7区分 vs コロン 4区分)で「<strong>仕様解釈ミス</strong>」が突出(ToBe 4件)。いずれも mock 列は縮退せず暫定対応のうえ questions/PW-144.tsv に記録。3段クライアント結合の件数欠落は reviewer モードB で検出し searchDeliveryHistory 単一クエリへ寄せ直して構造解消。",
      tasks: {
        'data-design': { asis: 0,             tobe: 0,                   agents: ["—"] },
        'data-impl':   { asis: 0,   loc: 0,   tobe: 0,                   agents: ["—"] },
        'api-impl':    { asis: 0,   loc: 0,   tobe: 0,                   agents: ["—"] },
        'api-test':    { asis: 0,   loc: 0,   tobe: 0,                   agents: ["—"] },
        'api-review':  { asis: 0,             tobe: 0,                   agents: ["—"] },
        'ux':          { asis: 4,             tobe: 0.5, tobeEng: 0.3,   agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 1,             tobe: 0,                   agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 24.7, loc: 1261, tobe: 0.7, tobeEng: 0,   agents: ["フロントエンドAI"] },
        'fe-test':     {                                                 agents: ["—"] },
        'fe-review':   { asis: 0.3,           tobe: 0.3, tobeEng: 0.3,   agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 2.4,           tobe: 2.4, tobeEng: 2.2,   agents: ["フロントエンドテスターAI", "エンジニア"] },
      },
      contextNotes: [
        "対象画面: 配車登録 (FE004 / PW-144 / DM02 配車管理)。searchDeliveryHistory を根に 検索3条件(配車日/ドライバー/デポ) + 配車結果一覧10列 + 配車状況バッジ + 行クリック詳細ドロワー + 未配車情報ドロワー(静的)。閲覧スコープ(配車登録/一括配車/戻しは後続)。<strong>スキーマ変更なし・新規バックエンドAPIなし</strong>(既存 searchDeliveryHistory 流用で API追加不要と planner が確定)。",
        "<strong>ToBe は実測</strong> (time-log.jsonl・2026-06-09〜06-10): <strong>3.9h</strong> (実装1.5h + 動作確認・修正2.0h + コミット/PR/CI 0.4h)。コミット&PR は翌日(06-10)実施で日跨ぎ。select-ready-task 改善・questions 書式改善などの試行特有作業は計測対象外。",
        "<strong>ドロワー対応は本対応で見送り → 後工程で吸収</strong>: ①行クリックの詳細ドロワーは FE001 配送情報照会(PW-134)の DeliveryHistoryDetailDrawer を再利用。FE001 を別担当が作成中のため内容整合は触らず別起票(PW-144_10)。②未配車情報ドロワーは集計API未定義で mock 同等の静的表示のみ(FE005未配車リスト/FE037未配車検索 寄り・PW-144_3)。③配車一覧(全DR)の配送順/時間帯色は FE036 翌日配車の領域でスコープ外(PW-144_8/_9)。",
        "<strong>手戻り</strong>: frontend-reviewer モードB で Critical2(3段クライアント結合の件数欠落: limit1000・複数 deliveryListNo 未対応) + Major2 → spec 通り searchDeliveryHistory 単一クエリへ寄せ直して構造解消。動作確認で 日付ISO形式(スラッシュ→ハイフン)・カレンダーpopperのサイドバー背面被り・時間帯整形 を修正。planner 起動は3回中2回 Stream idle timeout で空振り。",
        "<strong>AsIs は実績コード量(概算)から推定</strong>: フロント 約1,261行 → 24.7h(商品マスタ 16h/810行)。バックエンドは新規実装なし(0h)。UX/設計/レビュー/動作確認は人間工数として AsIs=ToBe。合計 約32h → ToBe 3.9h(削減 約88%)。LOC は概算。",
      ],
    },
    // 未配車リスト (FE005 / PW-174 / DM02 配車管理) — 閲覧スコープ。ToBe は実測 (time-log.jsonl): 3.26h (標準開発 約2.7h + 試行特有=デグレチェック出力形式の定義 約0.6h)。
    // 新規バックエンドAPI 2本 (unassignedDeliverySummary / unassignedDeliveries)・スキーマ変更なし (seed に住所1件のみ追加)。配車登録(FE004)の「未配車情報」ドロワー内に配線。
    // LOC は PR#124 diff (frontend 約644行・backend 実装 約470行＋テスト 384行)。AsIs は実績コード量から推定。
    'wi-screen-DM02FE005': {
      lede: "AIDD 試行「未配車リスト」(FE005 / PW-174) の開発工数比較。<strong>保管中の配送を 郵便番号→住所→エリア→デポ で デポ×エリア×時間帯 に集計するサマリ＋セルクリック明細drill-down</strong>を扱う<strong>閲覧スコープ</strong>の画面。配車登録(FE004)の「未配車情報」ドロワー内に配線(新規ページなし)。<strong>新規バックエンドAPI 2本</strong>(unassignedDeliverySummary / unassignedDeliveries)・<strong>スキーマ変更なし</strong>(seed に集計経路解決用の住所1件のみ追加)。<strong>ToBe は実測</strong>(time-log) <strong>3.26h</strong>(標準開発 約2.7h ＋ <span style=\"color:#9333ea\">試行特有=デグレチェック出力形式の定義 約0.6h</span>)。AsIs は実績コード量(概算)から推定。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                                          color: "#ef4444", asis: 3, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (認可: 未取得ユーザー時の全デポ可視)",            color: "#f59e0b", asis: 4, tobe: 1 },
        { key: "edge",   label: "エッジケース漏れ (日付スラッシュ未変換 / 本日UTCズレ / seed集計経路欠落)", color: "#8b5cf6", asis: 3, tobe: 2 },
        { key: "spec",   label: "仕様解釈ミス (デポ名種別 / 時間帯マッピング / 予定日既定)",     color: "#ec4899", asis: 2, tobe: 2 },
        { key: "ui",     label: "UI 細部の不整合 (空状態 / ページネーション / エリア候補連動)",   color: "#06b6d4", asis: 3, tobe: 2 },
      ],
      bugRateNote: "※ 未配車リスト 約 1.5 KLOC(フロント 644行＋バックエンド 実装470行/テスト384行)。論点は <strong>未配車の判定ルール</strong>(保管中×郵便番号→住所→エリア→デポ集計・PW-144_3)・<strong>デポ名の種別</strong>(物流/配送・PW-144_13)・<strong>時間帯列マッピング</strong>(PW-144_15)で「仕様解釈ミス」が残る(mock列は縮退せず暫定対応＋questions/PW-144.tsv記録)。<strong>tester ゲートが静的レビュー後の実バグ2件</strong>(日付スラッシュ未変換で検索常時空・「本日」UTCズレ)を捕捉し修正。",
      tasks: {
        'data-design': { asis: 0,              tobe: 0,                    agents: ["—"] },
        'data-impl':   { asis: 0.2,  loc: 11,  tobe: 0.05,                 agents: ["バックエンドAI"] },
        'api-impl':    { asis: 9,    loc: 470, tobe: 0.4,                  agents: ["バックエンドAI"] },
        'api-test':    { asis: 5.5,  loc: 384, tobe: 0.1,                  agents: ["バックエンドAI"] },
        'api-review':  { asis: 0.35,           tobe: 0.35, tobeEng: 0.35,  agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'ux':          { asis: 3,              tobe: 0.3,  tobeEng: 0.2,   agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 1,              tobe: 0,                    agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 12.6, loc: 644, tobe: 0.5,  tobeEng: 0,     agents: ["フロントエンドAI"] },
        'fe-test':     {                                                   agents: ["—"] },
        'fe-review':   { asis: 0.4,            tobe: 0.4,  tobeEng: 0.4,   agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 0.55,           tobe: 0.55, tobeEng: 0.5,   agents: ["フロントエンドテスターAI", "エンジニア"] },
        'structure-improvement': { label: "[試行特有] デグレチェック出力形式の定義", color: "#7e22ce", asis: 0, tobe: 0.6, tobeEng: 0.6, agents: ["エンジニア"] },
      },
      contextNotes: [
        "対象画面: 未配車リスト (FE005 / PW-174 / DM02 配車管理)。保管中(005000)の配送を 郵便番号→m_address→m_area→m_depot で デポ×エリア×時間帯 に集計するサマリ + セルクリックで明細drill-down。配車登録(FE004)の「未配車情報」ドロワー内に配線(新規ページなし)。閲覧スコープ(配車操作は対象外)。<strong>新規API 2本</strong>(集計/明細)・<strong>スキーマ変更なし</strong>(seed に住所4600008を1件追加し集計経路を解決)。",
        "<strong>ToBe は実測</strong> (time-log.jsonl・2026-06-24): <strong>3.26h</strong>(メインループ アクティブwall-clock・20分ギャップ閾値)。内訳: 標準開発 約2.7h(planner調査/分解 + API実装/テスト + FE実装 + 各reviewer/tester + 動作確認) ＋ <span style=\"color:#9333ea\">試行特有 約0.6h(デグレチェック出力形式の定義=ハーネス強化)</span>。サブエージェント逐次計上は約1.99h(18体)。",
        "<strong>手戻り</strong>: backend-reviewer が Major3件(未取得ユーザー時の全デポ可視=認可・status毎回query=性能・逆引き重複)を検出→修正。backend-tester が seed欠損(保管中の郵便番号4600008が住所マスタ不在で集計常時空)を検出→seed補完。frontend-reviewer が Blocker(空状態/Pagination/フッター消失)・Major(エリア候補UX/日付空query)を検出→修正。<strong>frontend-tester が静的レビューで見逃した実バグ2件</strong>(日付スラッシュ未変換・JST本日ズレ)を捕捉→修正。",
        "<strong>AsIs は実績コード量(概算)から推定</strong>: フロント 約644行→12.6h・バックエンド実装 約470行→9h・API単体テスト 384行→5.5h。UX/レビュー/動作確認は人間工数として AsIs=ToBe。合計 約32.6h → ToBe 3.26h(削減 約90%)。<span style=\"color:#9333ea\">試行特有のデグレチェック形式定義 0.6h は AsIs に対応物なし(0)</span>。LOC は概算。",
      ],
    },
    // 配送管理マップ (FE007 / PW-176 / DM03 配送管理) — 閲覧スコープ・フルスタック。ToBe は実測 (time-log.jsonl): 5.66h(系統A・試行特有0)。
    // DB: m_customers に緯度経度カラム(Decimal(9,6) nullable)追加。API: DeliverySummary に lat/lng(Float)露出。FE: 検索/リスト/ドロワー/凡例 + 埋め込みGoogleマップ + 色分けピン。2フェーズ(非地図→地図)。LOC は PR#128 diff (FE 約1509・BE 約33・prisma 約100)。
    'wi-screen-DM03FE007': {
      lede: "AIDD 試行「配送管理マップ」(FE007 / PW-176) の開発工数比較。<strong>配送先を埋め込み Google マップ上に色分けピンで表示し、検索/一覧/詳細ドロワーと連動</strong>する<strong>閲覧スコープ</strong>の画面。<strong>フルスタック</strong>(DB=m_customers に緯度経度カラム追加・API=DeliverySummary に座標露出・FE=埋め込み地図＋ピン)。座標は取込時ジオコーディングで算出する方針が業務確定し、2フェーズ(非地図→地図)で完結。<strong>ToBe は実測</strong>(time-log) <strong>5.66h</strong>(系統A・試行特有0)。AsIs は実績コード量(概算)から推定。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                                                  color: "#ef4444", asis: 3, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (未配車判定=保管中・エリアareaId是正・ピン色優先)",        color: "#f59e0b", asis: 4, tobe: 2 },
        { key: "edge",   label: "エッジケース漏れ (deliveryDate epoch-ms表示クラッシュ / 座標NULL非描画)", color: "#8b5cf6", asis: 3, tobe: 1 },
        { key: "spec",   label: "仕様解釈ミス (ピングリフ id→便番号 / status語彙↔code / 地図種別トグル)",  color: "#ec4899", asis: 3, tobe: 2 },
        { key: "ui",     label: "UI 細部の不整合 (凡例色#E55D42 / (仮)表示 / ドロワー左オフセット)",      color: "#06b6d4", asis: 3, tobe: 1 },
      ],
      bugRateNote: "※ 配送管理マップ 約 1.6 KLOC(FE 約1509行＋BE 約33行＋prisma 約100行)。論点は <strong>配送先座標の backing</strong>(高・業務確定で m_customers に緯度経度カラム追加・取込時ジオコーディング)・<strong>未配車判定</strong>(保管中005000・FE005整合)・<strong>ピングリフの識別子</strong>(id末尾→便番号に是正)で「仕様解釈ミス」が残る(mock縮退せず暫定＋questions/PW-176.tsv _1〜_8 記録)。<strong>frontend-tester が静的レビュー後の実バグ</strong>(deliveryDate が epoch-ms で届き .slice クラッシュ→検索後リスト全滅)を捕捉→toJSTDateStr で修正。",
      tasks: {
        'data-design': { asis: 1.5,            tobe: 0.3, tobeEng: 0.2, agents: ["DBアーキテクトAI", "エンジニア"] },
        'data-impl':   { asis: 1.5,  loc: 100, tobe: 0.2,               agents: ["DBアーキテクトAI"] },
        'api-impl':    { asis: 1,    loc: 33,  tobe: 0.3,               agents: ["バックエンドAI"] },
        'api-test':    { asis: 0.5,  loc: 0,   tobe: 0.1,               agents: ["バックエンドテスターAI"] },
        'api-review':  { asis: 0.3,            tobe: 0.3, tobeEng: 0.3, agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'ux':          { asis: 3,              tobe: 0.5, tobeEng: 0.4, agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 1.5,            tobe: 0,                 agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 29.6, loc: 1509, tobe: 2.8, tobeEng: 0,  agents: ["フロントエンドAI"] },
        'fe-test':     {                                                agents: ["—"] },
        'fe-review':   { asis: 0.5,            tobe: 0.5, tobeEng: 0.4, agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 1,              tobe: 0.7, tobeEng: 0.5, agents: ["フロントエンドテスターAI", "エンジニア"] },
      },
      contextNotes: [
        "対象画面: 配送管理マップ (FE007 / PW-176 / DM03 配送管理・mock=delivery-manage)。検索(デポ＋エリア/担当者＋配送予定日) + 左ペイン配送リスト(表示順切替・便番号) + 詳細ドロワー(既存流用) + 凡例 + <strong>埋め込み Google マップ(@vis.gl/react-google-maps)＋色分けピン</strong>。閲覧スコープ。フルスタック: <strong>DB=m_customers に緯度経度カラム(Decimal(9,6) nullable)追加</strong>・API=DeliverySummary に座標(Float)露出・FE=地図/ピン/(仮)表示。",
        "<strong>ToBe は実測</strong> (time-log.jsonl・2026-06-29〜06-30): <strong>5.66h</strong>(メインループ アクティブwall-clock・20分ギャップ閾値・素span24.36hから夜間909分等を除外)。系統A のみ(試行特有=系統B 0)。サブエージェント逐次計上は約3.41h(21体)。2フェーズ: フェーズ1(非地図・検索/リスト/ドロワー/サイドバー)→中間質疑(status/未配車/areaId/座標方針)→フェーズ2(T1 db→T2 be→T3 fe=埋め込み地図＋ピン)。",
        "<strong>手戻り</strong>: frontend-reviewer がフェーズ1 Major2+Minor3、フェーズ2 Major1(ピングリフ id.slice→便番号に是正)を検出→修正。<strong>frontend-tester が静的レビューで見逃した実バグ</strong>(deliveryDate が DateTime スカラー=epoch-ms で届き .slice でクラッシュ→検索後リストが全滅)を捕捉→toJSTDateStr で number/ISO 両対応に修正。backend-reviewer Minor1・backend-tester は clean(座標が number で返り NULL=null を確認)。",
        "<strong>AsIs は実績コード量(概算)から推定</strong>: フロント 約1509行→29.6h・バックエンド 約33行→0.6h・prisma/seed 約100行→1.5h。UX/レビュー/動作確認は人間工数として AsIs を計上。合計 約40h → ToBe 5.66h(削減 約86%)。<strong>純粋な機能実装(試行特有のオーバーヘッド無し)</strong>。LOC は概算。",
      ],
    },
    // ステータスチェック (FE006 / PW-150 / DM03 配送管理) — スキャン照合・閲覧中心。ToBe は実測 (time-log.jsonl): 1.5h。
    // 新規API・スキーマ変更なし (searchDeliveryHistory + 既存詳細ドロワー流用)。git worktree による並行開発 (PW-151 と同時)。
    'wi-screen-DM03FE006': {
      lede: "AIDD 試行「ステータスチェック」(FE006 / PW-150) の開発工数比較。<strong>お問い合わせ番号のスキャン照合で配送を一覧に蓄積し、12列＋クライアント集計（件数/代引き額合計）を目視チェック</strong>する画面。<strong>新規API・スキーマ変更なし</strong>（searchDeliveryHistory＋既存詳細ドロワー流用）。<strong>git worktree による並行開発</strong>（幹線スケジュールと同時進行）。<strong>ToBe は実測</strong>(time-log): 計 <strong>1.5h</strong>（実装1.1h＋人間テスト支援0.2h＋PR統合0.2h）。AsIs は実績コード量(概算)から推定。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                                       color: "#ef4444", asis: 2, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (スキャン蓄積・重複検知・集計)",              color: "#f59e0b", asis: 3, tobe: 0 },
        { key: "edge",   label: "エッジケース漏れ (部分一致ヒット / 未ヒット / 連続スキャン)", color: "#8b5cf6", asis: 2, tobe: 1 },
        { key: "spec",   label: "仕様解釈ミス (ステータス語彙12vs10・エリア名・完了日時)",     color: "#ec4899", asis: 2, tobe: 4 },
        { key: "ui",     label: "UI 細部の不整合 (確認ダイアログのz-index・自動スクロール)",   color: "#06b6d4", asis: 3, tobe: 1 },
      ],
      bugRateNote: "※ ステータスチェック 約 0.55 KLOC(フロントのみ)。API は部分一致のため <strong>FE側の完全一致 post フィルタ</strong>が必須（検証で確認）。仕様解釈系（ステータス語彙12種vs10コード・エリア名取得経路・完了日時の表示規則・スキャン時のデポ/荷主スコープ）は questions/PW-150.tsv に記録し暫定実装で継続。テスターが共有 ConfirmModal の z-index 不足（ドロワー基盤1200未満で確認ダイアログが隠れる）を検出→ z-[1300] へ修正し再検証合格（既存画面にも効く修正）。",
      tasks: {
        'data-design': { asis: 0,              tobe: 0,                  agents: ["—"] },
        'data-impl':   { asis: 0,   loc: 0,    tobe: 0,                  agents: ["—"] },
        'api-impl':    { asis: 0,   loc: 0,    tobe: 0,                  agents: ["—"] },
        'api-test':    { asis: 0,   loc: 0,    tobe: 0,                  agents: ["—"] },
        'ux':          { asis: 2,              tobe: 0.1, tobeEng: 0.1,  agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 0.5,            tobe: 0,                  agents: ["プランナーAI"] },
        'fe-impl':     { asis: 10.6, loc: 540, tobe: 0.8, tobeEng: 0,    agents: ["フロントエンドAI"] },
        'fe-test':     {                                                 agents: ["—"] },
        'fe-review':   { asis: 0.3,            tobe: 0.2, tobeEng: 0.1,  agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 1.5,            tobe: 0.4, tobeEng: 0.3,  agents: ["フロントエンドテスターAI", "エンジニア"] },
      },
      contextNotes: [
        "対象画面: ステータスチェック (FE006 / PW-150 / DM03 配送管理・mock=completion-check)。スキャンバー＋一覧12列＋クライアント集計＋既存 DeliveryHistoryDetailContent 流用の詳細ドロワー。<strong>新規API・スキーマ変更なし</strong>（detect-api-gaps でギャップ0を確認）。",
        "<strong>ToBe は実測</strong> (time-log.jsonl・2026-06-11〜06-12): 実装 <strong>1.1h</strong>（planner 一気通貫: validate-brief→spec→実装→自己レビュー→screen-check）＋ 人間テスト支援・修正 0.2h ＋ PR統合(コンフリクト解消按分) 0.2h ＝ <strong>計 1.5h</strong>。",
        "<strong>git worktree による並行開発</strong>: 幹線スケジュール(PW-151)と同時進行（壁時計重複あり）。ポート分離（FE:4001 / API:3000共用）で独立検証。",
        "<strong>手戻り</strong>: テスターが ConfirmModal の z-index 不足（ドロワー表示中に削除確認が隠れる）を Major 検出 → z-[1300] へ修正・再検証合格。スキャン完全一致は API が部分一致のため FE post フィルタで実装（INV0000005 が INV00000050 にヒットしないことを実データ検証）。",
        "<strong>AsIs は実績コード量(概算)から推定</strong>: フロント 約540行 → 10.6h（商品マスタ 16h/810行）。バックエンド新規なし(0h)。合計 約15h → ToBe 1.5h（<strong>削減 約90%</strong>）。LOC は概算。",
      ],
    },
    // 幹線スケジュール (FE055 / PW-151 / DM14 帳票・ファイル入出力) — 照会スコープ。ToBe は実測: 2.0h。
    // BE filter拡張(月範囲/複数デポ)＋seed追加＋FEマトリクス。git worktree による並行開発 (PW-150 と同時)。
    'wi-screen-DM14FE055': {
      lede: "AIDD 試行「幹線スケジュール」(FE055 / PW-151) の開発工数比較。<strong>対象年月×デポ（複数）でマトリクス照会</strong>（出荷元×項目19行×日別・曜日2段・本日強調・行合計）する<strong>照会スコープ</strong>の画面。backend は既存 trunkLines の <strong>filter 拡張のみ</strong>（月範囲・複数デポ・非破壊）・スキーマ変更なし。<strong>git worktree による並行開発</strong>（ステータスチェックと同時進行）。<strong>ToBe は実測</strong>(time-log): 計 <strong>2.0h</strong>（実装0.8h＋人間テスト・不具合2件修正1.0h＋PR統合0.2h）。AsIs は実績コード量(概算)から推定。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                                        color: "#ef4444", asis: 3, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (日付範囲パース・行合計・月日数生成)",          color: "#f59e0b", asis: 4, tobe: 1 },
        { key: "edge",   label: "エッジケース漏れ (データ無し月 / 月末日数 / 必須未入力)",     color: "#8b5cf6", asis: 3, tobe: 1 },
        { key: "spec",   label: "仕様解釈ミス (都道府県・前月残・quantity_div・水源/出荷元)",   color: "#ec4899", asis: 3, tobe: 4 },
        { key: "ui",     label: "UI 細部の不整合 (月選択カレンダー・本日列強調・3列グリッド)",  color: "#06b6d4", asis: 4, tobe: 2 },
      ],
      bugRateNote: "※ 幹線スケジュール 約 1.16 KLOC(BE 約280行＋FE 約880行)。人間テストで実不具合2件を検出→即修正: ①<strong>YYYYMMDD の未パース</strong>（new Date('20260601')=Invalid Date。単体テストがISO形式で書かれており取りこぼし→YYYYMMDDケースを追加） ②<strong>対象年月が日選択カレンダーになる</strong>（共有 DatePicker が showMonthYearPicker を透過せず＋月選択用CSSが tailwind.css に丸ごと欠落→mock から移植し3列×4行グリッドで mock 同等を実機検証）。取得元未確定の列（都道府県・前月残）は「-」仮表示＋questions/PW-151.tsv 記録で縮退なし。",
      tasks: {
        'data-design': { asis: 0,              tobe: 0,                  agents: ["—"] },
        'data-impl':   { asis: 0,   loc: 0,    tobe: 0,                  agents: ["—"] },
        'api-impl':    { asis: 3,   loc: 280,  tobe: 0.2, tobeEng: 0,    agents: ["バックエンドAI"] },
        'api-test':    { asis: 0.5, loc: 0,    tobe: 0,                  agents: ["バックエンドAI"] },
        'ux':          { asis: 3,              tobe: 0.1, tobeEng: 0.1,  agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 0.5,            tobe: 0,                  agents: ["プランナーAI"] },
        'fe-impl':     { asis: 17.4, loc: 880, tobe: 0.5, tobeEng: 0,    agents: ["フロントエンドAI"] },
        'fe-test':     {                                                 agents: ["—"] },
        'fe-review':   { asis: 0.3,            tobe: 0.2, tobeEng: 0.1,  agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 2,              tobe: 1.0, tobeEng: 0.8,  agents: ["フロントエンドテスターAI", "エンジニア"] },
      },
      contextNotes: [
        "対象画面: 幹線スケジュール (FE055 / PW-151 / DM14 帳票・ファイル入出力・正本の画面定義は FE025 表記)。対象年月（月選択カレンダー・必須）×デポ複数選択 → 出荷元×項目19行×日別のマトリクス。インポート/エクスポート/入力は mock 自体がスタブのため同等の通知スタブ。",
        "<strong>backend は非破壊の filter 拡張のみ</strong>: TTrunkLineFilterInput に targetDateFrom/To・depotIds を nullable 追加（既存の単一指定の挙動不変・単体テスト26件）。seed に幹線デモデータ（3デポ×当月/前月・3,477行）と Slim系商品3種を追加。",
        "<strong>ToBe は実測</strong> (time-log.jsonl・2026-06-11〜06-12): 実装 <strong>0.8h</strong>（planner 一気通貫。validate-brief 規則2-5 で一旦停止→brief の言い回し修正・承認行追記で再開）＋ 人間テスト支援・不具合2件修正 1.0h ＋ PR統合(コンフリクト解消按分) 0.2h ＝ <strong>計 2.0h</strong>。",
        "<strong>手戻り（人間テストで検出・即日修正）</strong>: ①YYYYMMDD 未パース（Invalid Date）→ ISO 変換パース＋単体テスト追加 ②月選択カレンダー不全（共有 DatePicker の showMonthYearPicker 非透過＋月選択CSSの欠落）→ 透過対応＋mock の CSS 移植・実機で 3列×4行グリッドを mock と比較検証。seed 投入はフックにより人間実行（投入前はデータ無し検証で代替）。",
        "<strong>AsIs は実績コード量(概算)から推定</strong>: バックエンド 約280行 → 3h＋テスト0.5h、フロント 約880行 → 17.4h（商品マスタ 16h/810行）。合計 約26.7h → ToBe 2.0h（<strong>削減 約93%</strong>）。LOC は概算。",
      ],
    },
    // 配送予定一覧 (FE003 / PW-121 / DM01 配送情報確認) — 閲覧スコープ。ToBe は実測: 系統A 3.5h(系統B 0)。レビュー中(完了ではない)。
    // deliveries(FE001) 流用。backend: depotNames逆引き・水源列/水源別サマリーQuery・seed整合。driver改名取りこぼし(既存バグ)を同梱。スキーマ変更なし。
    'wi-screen-DM01FE003': {
      lede: "AIDD 試行「配送予定一覧」(FE003 / PW-121) の開発工数比較。<strong>t_delivery を根に 検索4条件・一覧15列・水源別サマリーフッター</strong>を扱う<strong>閲覧スコープ</strong>の画面。<strong>配送情報照会(FE001)を流用</strong>し、backend は depotNames 逆引き・水源列(DeliverySummary.waterSource)・水源別サマリー Query・seed 整合を追加（スキーマ変更なし）。<strong>PW-159 改名取りこぼし(driver)の既存バグも同梱修正</strong>。<strong>ToBe は実測</strong>(time-log) <strong>3.5h</strong>(標準開発のみ／試行特有 0h)。<strong>本タスクはレビュー中（完了ではない）</strong>。AsIs は実績コード量(概算)から推定。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                                              color: "#ef4444", asis: 3, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (depotNames郵便番号逆引き・水源行代表・サマリー集計)",   color: "#f59e0b", asis: 5, tobe: 2 },
        { key: "edge",   label: "エッジケース漏れ (指定日From=To・水源未紐づけ・空検索)",             color: "#8b5cf6", asis: 3, tobe: 1 },
        { key: "spec",   label: "仕様解釈ミス (水源行代表ルール・荷主集約・完了日時・完了区分の正本)",   color: "#ec4899", asis: 2, tobe: 4 },
        { key: "ui",     label: "UI 細部の不整合 (15列維持・返品済↔返品済み正規化・除外操作非表示)",     color: "#06b6d4", asis: 4, tobe: 1 },
      ],
      bugRateNote: "※ 配送予定一覧 約 0.9 KLOC(フロント 約650行＋API拡張 約200行)。閲覧スコープで論点は <strong>複数明細時の水源「行代表」ルール</strong>(高・暫定 先頭明細代表)・<strong>seed の完了区分整合</strong>(受取拒否=未完了/仮登録)・<strong>完了区分 is_completed↔completion_type の正本</strong>で「<strong>仕様解釈ミス</strong>」が突出(ToBe 4件)。いずれも mock 列は縮退せず暫定対応＋ questions/PW-121.tsv 記録。検証で水源列が seed の商品↔水源未紐づけにより空 → seed 補完＋再 seed で実値化を確認。",
      tasks: {
        'data-design': { asis: 0,             tobe: 0,                   agents: ["—"] },
        'data-impl':   { asis: 0.5, loc: 45,  tobe: 0.2,                 agents: ["バックエンドAI(seed)"] },
        'api-impl':    { asis: 4,   loc: 200, tobe: 0.6,                 agents: ["バックエンドAI"] },
        'api-test':    { asis: 1,   loc: 60,  tobe: 0.1,                 agents: ["バックエンドAI"] },
        'api-review':  { asis: 0.3,           tobe: 0.3, tobeEng: 0.3,   agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'ux':          { asis: 4,             tobe: 0.3, tobeEng: 0.2,   agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 1,             tobe: 0,                   agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 13,  loc: 650, tobe: 0.8, tobeEng: 0,     agents: ["フロントエンドAI"] },
        'fe-test':     {                                                 agents: ["—"] },
        'fe-review':   { asis: 0.3,           tobe: 0.3, tobeEng: 0.2,   agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 2,             tobe: 0.7, tobeEng: 0.5,   agents: ["バックエンドテスターAI", "フロントエンドテスターAI", "エンジニア"] },
        'driver-fix':  { label: "[既存バグ修正] driver改名取りこぼし(tDeliveryManagement→tDelivery)", color: "#475569", asis: 2, tobe: 0.2, tobeEng: 0, agents: ["バックエンドAI"] },
      },
      contextNotes: [
        "対象画面: 配送予定一覧 (FE003 / PW-121 / DM01 配送情報確認・mock=delivery-schedule)。t_delivery を根に 検索4条件(デポ名/配送担当者名/指定日/ステータス11種) + 一覧15列 + 水源別サマリーフッター。閲覧スコープ(操作=指示書再発行/配送完了登録・予定日別件数ドロワーは非表示で除外)。配送情報照会(FE001/deliveries)を流用。<strong>スキーマ変更なし</strong>(水源・デポ逆引きとも既存リレーションで到達)。",
        "<strong>ToBe は実測</strong> (time-log.jsonl・2026-06-17〜06-18): 標準開発(系統A) <strong>3.5h</strong>。<span style=\"color:#9333ea\">試行特有(系統B) 0h</span>。/start-task→planner(spec/gap/不明点PW-121_1〜_7)→backend(depotNames逆引き・水源列/サマリーQuery・seed整合)→reviewer/tester→frontend(skeleton/A/実装/B)→driver改名修正→再seed後に再検証→サイドバー→4コミット→PR#107。<strong>本タスクはレビュー中（完了ではない）</strong>のため、今後の動作確認・レビュー対応で増分の可能性あり。",
        "<strong>手戻り</strong>: backend-reviewer Major(初回4件→修正)、frontend-reviewer モードA/B 指摘修正。検証で <strong>水源列が空</strong>(seed が商品↔水源を未紐づけ)→ seed 補完＋再 seed で 富士山/南アルプス/阿蘇 を実値化。<strong>driver の改名取りこぼし</strong>(tDeliveryManagement 残存6箇所＝既存 main バグ・getTomorrowDeliveries等が実行時クラッシュ)を発見し同梱修正。デポ名検索はデモ営業所のみ実データ(他デポはseed無し・拡張不要で確定)。",
        "<strong>AsIs は実績コード量(概算)から推定</strong>: フロント 約650行→13h(商品マスタ 16h/810行)、API拡張 約200行→4h、seed 約45行→0.5h。レビュー/動作確認/UX/driver修正は人間工数として AsIs を計上。合計 約28h → ToBe 3.5h(削減 約88%)。LOC は概算。",
      ],
    },
    // 未配車リスト (FE005 / DM02FE005 / DM02 配車管理) — 閲覧リスト。ToBe実測 3.26h(workitems)。
    // AsIs・内訳・想定バグは類似閲覧画面(翌日配車表示 FE036)基準の概算。レビュー・動作確認は AI でも削減されず人手で発生(asis=tobe)。スキーマ変更なし。
    'wi-screen-DM02FE005': {
      lede: "AIDD「未配車リスト」(FE005 / DM02 配車管理) の開発工数比較。<strong>未配車の配送明細を一覧表示する閲覧画面</strong>(既存の 配送/配送会社 を流用・スキーマ変更なし)。<strong>ToBe は実測 3.26h</strong>。<strong>うち レビュー・動作確認 約2.0h は AI でも削減されず人手で発生</strong>(asis=tobe)。AsIs は類似の閲覧画面(翌日配車表示 FE036)を基準にした推定 約14h → <strong>削減 約77%</strong>。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                       color: "#ef4444", asis: 0, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (未配車抽出条件・並び順)",  color: "#f59e0b", asis: 1, tobe: 0 },
        { key: "edge",   label: "エッジケース漏れ (該当なし・空)",        color: "#8b5cf6", asis: 1, tobe: 0 },
        { key: "spec",   label: "仕様解釈ミス (表示項目・抽出仕様)",       color: "#ec4899", asis: 1, tobe: 1 },
        { key: "ui",     label: "UI 細部の不整合 (一覧表示)",             color: "#06b6d4", asis: 1, tobe: 0 },
      ],
      bugRateNote: "※ 未配車リスト 約 0.2 KLOC(閲覧リスト)。参考レート(人力 12/KLOC ≒ 2件 / AI 5/KLOC ≒ 1件)で推定。論点は表示項目・未配車の抽出条件の解釈。",
      tasks: {
        'data-design': { asis: 0,             tobe: 0,                   agents: ["—"] },
        'data-impl':   { asis: 0,   loc: 0,   tobe: 0,                   agents: ["—"] },
        'api-impl':    { asis: 3.5, loc: 90,  tobe: 0.4, tobeEng: 0,     agents: ["バックエンドAI"] },
        'api-test':    { asis: 2.5, loc: 180, tobe: 0.1, tobeEng: 0,     agents: ["バックエンドAI"] },
        'api-review':  { asis: 0.5,           tobe: 0.5, tobeEng: 0.5,   agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'ux':          { asis: 2,             tobe: 0.16, tobeEng: 0.1,  agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 0.5,           tobe: 0.1, tobeEng: 0,     agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 3.5, loc: 130, tobe: 0.5, tobeEng: 0,     agents: ["フロントエンドAI"] },
        'fe-test':     {                                                 agents: ["—"] },
        'fe-review':   { asis: 0.5,           tobe: 0.5, tobeEng: 0.5,   agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 1,             tobe: 1.0, tobeEng: 1.0,   agents: ["フロントエンドテスターAI", "エンジニア"] },
      },
      contextNotes: [
        "対象画面: 未配車リスト (FE005 / DM02FE005 / DM02 配車管理)。未配車の配送明細を一覧表示する閲覧画面。既存の 配送(t_delivery)・配送会社 を流用想定で <strong>スキーマ変更なし・新規API最小</strong>。配車登録(FE004)の未配車情報ドロワー(PW-144_3・静的表示)とは別の独立リスト画面。",
        "<strong>ToBe は実測 3.26h</strong> (workitems time-log)。<strong>うち レビュー(API/FE 各0.5h)＋動作確認 1.0h ＝ 約2.0h は人手工数で AsIs と同水準</strong>(AI で削減されない)。AI が削減するのは API/FE 実装・単体テスト工程に限定され、ToBe の約6割が人手のレビュー・動作確認。",
        "<strong>AsIs は類似の閲覧画面から推定</strong>: 翌日配車表示(FE036・閲覧)を基準に API/FE 実装・単体テスト・UX を概算。合計 約14h → ToBe 3.26h(<strong>削減 約77%</strong>)。<strong>内訳・AsIs・想定バグは概算</strong>(確定実測は ToBe 合計 3.26h)。工程別の time-log 内訳が出れば差し替え可能。",
      ],
    },
    'wi-screen-DM03FE008': {
      lede: "AIDD 試行「配送状況」(FE008 / PW-185) の開発工数比較。<strong>地域×都道府県×デポ×エリア×荷主×商品 を行、時間帯×(配送数/未完了/訪問完了/完了率)＋前日繰越2列を列とする集計マトリクス</strong>＋2段ドロワー(明細→配送詳細)の<strong>閲覧スコープ</strong>画面。新規スキーマ変更なし・集計API1本(既存資産を流用)。実装後に業務確認(SME)で集計を12ステータス内訳→3種+率へ確定、加えて<strong>実機レビューで多数の細部不具合を検出・修正</strong>(件数不一致・地理データ不整合・UI細部)。<strong>ToBe は実測</strong>(time-log) <strong>6.50h</strong>(系統A) ＋ <span style=\"color:#9333ea\">試行特有(系統B) 0.02h</span>。AsIs は実績コード量(概算)から推定。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                                                     color: "#ef4444", asis: 3, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (権限スコープ非対称・前日繰越日付/時間帯マッピング・0件バグ・JST/UTCズレ)", color: "#f59e0b", asis: 9, tobe: 7 },
        { key: "edge",   label: "エッジケース漏れ (荷主null不一致・同エリア重複行・荷主options空・pointer-eventsブロック)", color: "#8b5cf6", asis: 7, tobe: 6 },
        { key: "spec",   label: "仕様解釈ミス (12→3種集計確定・荷主グループ定義・前日繰越起算・ドリルダウン粒度)",       color: "#ec4899", asis: 4, tobe: 6 },
        { key: "ui",     label: "UI 細部の不整合 (ドロワー幅逆転・件数ラベル・地理不整合表示・顧客1名固定)",             color: "#06b6d4", asis: 3, tobe: 4 },
      ],
      bugRateNote: "※ 配送状況 約 2.9 KLOC(FE 約1.67KLOC＋BE 約0.71KLOC＋seed 約0.53KLOC)。実機レビューで<strong>件数一致の穴</strong>(同region/prefecture/depot/shipper/productで異area複数行・productNamesフィルタ未適用の既存潜在バグ)と<strong>seed全体のJST/UTC構造バグ</strong>(new Date().setHours(0,0,0,0)がローカル0時切り詰め→@db.Date保存時に前日ズレ)を検出、根本修正まで実施(questions/PW-185.tsv _5)。荷主グループ定義・前日繰越起算・ドリルダウン時間帯粒度は暫定実装で継続(_1・_3・_4)。",
      tasks: {
        'data-design': { asis: 0,               tobe: 0,                  agents: ["—"] },
        'data-impl':   { asis: 8,   loc: 528,   tobe: 0.3,                agents: ["バックエンドAI"] },
        'api-impl':    { asis: 20,  loc: 710,   tobe: 1.0, tobeEng: 0.1,  agents: ["バックエンドAI", "エンジニア"] },
        'api-test':    { asis: 2,   loc: 0,     tobe: 0.4, tobeEng: 0.1,  agents: ["バックエンドテスターAI", "エンジニア"] },
        'api-review':  { asis: 0.5,             tobe: 0.3, tobeEng: 0.2,  agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'ux':          { asis: 4,               tobe: 0.8, tobeEng: 0.4,  agents: ["プランナーAI", "エンジニア"] },
        'fe-design':   { asis: 1,               tobe: 0.2,                agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 33,  loc: 1669,  tobe: 2.1, tobeEng: 0.1,  agents: ["フロントエンドAI"] },
        'fe-test':     {                                                  agents: ["—"] },
        'fe-review':   { asis: 0.5,             tobe: 0.3, tobeEng: 0.2,  agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 3,               tobe: 1.1, tobeEng: 0.9,  agents: ["フロントエンドテスターAI", "エンジニア"] },
      },
      contextNotes: [
        "対象画面: 配送状況 (FE008 / PW-185 / DM03 配送管理・mock=delay)。検索(荷主グループ/荷主/地域/デポ/商品) + 集計マトリクス(行=地域×都道府県×デポ×エリア×荷主×商品、列=時間帯×(配送数/未完了/訪問完了/完了率)＋前日繰越2列) + セルクリックで2段ドロワー(明細一覧→配送詳細)。閲覧スコープ・DBスキーマ変更なし。既存 FE007 資産(ステータス値カタログ・時間帯マスタ・エリア直リレーション)を流用。",
        "<strong>ToBe は実測</strong> (time-log.jsonl・2026-06-30〜07-01): <strong>6.50h</strong>(メインループ アクティブwall-clock・20分ギャップ閾値・素span15.35hから夜間443分等を除外)。系統A のみ(試行特有=系統B 0.02h・handoffスキルへのmock URL追加を分離)。サブエージェント逐次計上は約3.64h(19体・resume含め40回)。",
        "<strong>手戻り</strong>: backend-reviewer/tester が複数ラウンド(件数一致の権限スコープ非対称・時間帯マッピングキー不一致・regionNames+日付0件バグ)を検出→修正・再検証。frontend-reviewer(モードA/B)が構造・実装の両面でMajor計4件検出→修正。frontend-testerが実行時にクリア非動作・ドリルダウン0件・pointer-eventsブロックを検出→修正。<strong>SME業務確認で集計仕様が12ステータス内訳→3種+率に確定</strong>し、確定仕様への整理作業(リファクタ)が発生。<strong>ユーザーの画面実機レビューで多数の追加不具合</strong>(ドロワー幅逆転・×位置/配色・件数ラベル・前日繰越日付範囲・地図ピン非表示・地理データ不整合・ドリルダウン顧客固定化)を検出→都度修正。",
        "<strong>AsIs は実績コード量(概算)から推定</strong>: フロント 約1669行→33h・バックエンド 約710行→20h・seed(データ)約528行→8h。UX/レビュー/動作確認は人間工数として AsIs を計上(動作確認は特に手戻りが多く3h)。合計 約72h → ToBe 6.50h(削減 約91%)。<strong>手戻り比率が高い試行</strong>(仕様確定前実装・実機レビュー起因の追加修正が多数)。LOC は概算(origin/main比・非マージコミットのnumstat集計)。",
      ],
    },
    'wi-screen-DM13FE046': {
      lede: "AIDD 試行「番号入力」(FE046 / PW-182 / DM13 お客様WEB) の開発工数比較。未ログインの顧客がお問い合わせ番号だけで自分の配送状況を確認できる、再配送フローの入口画面。<strong>このアプリ初の未ログイン公開GraphQL Query</strong>を新設し、<strong>backend-reviewerが社内向け内部文言(t_delivery_memos.work_content_code)の生値露出という情報漏洩を検出</strong>、履歴機能を安全側(空配列)に是正。あわせて<strong>app-customer全体に一度も移植されていなかった共通レイアウト(ヘッダー)を初移植</strong>、正本に根拠のないシード形式(inquiry_no の「INV」接頭辞)を是正。<strong>ToBe は実測</strong>(time-log) <strong>5.6h</strong>(実装3.5h＋検証・是正2.1h)。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                                                   color: "#ef4444", asis: 1, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (内部文言の情報漏洩・重複inquiryNoの一意特定・キャッシュfetchPolicy)", color: "#f59e0b", asis: 5, tobe: 3 },
        { key: "edge",   label: "エッジケース漏れ (配送履歴0件時のUI非表示・番号バリデーション境界)",             color: "#8b5cf6", asis: 4, tobe: 2 },
        { key: "spec",   label: "仕様解釈ミス (画面ID誤表記=FE046→正本FE048・シード桁数/接頭辞不整合・荷主名表示優先順位)", color: "#ec4899", asis: 5, tobe: 4 },
        { key: "ui",     label: "UI 細部の不整合 (共通ヘッダー未移植・お問い合わせ番号の表示フォーマット)",        color: "#06b6d4", asis: 4, tobe: 3 },
      ],
      bugRateNote: "※ 番号入力 約1.2 KLOC(FE 約476行＋BE 約241行)。<strong>公開エンドポイントの情報漏洩</strong>(内部運用文言の生値返却)を実装後レビューで検出・是正。<strong>画面ID自体の誤表記</strong>(ダッシュボード上FE046だが正本ではFE048。FE046は別画面「KSL完了登録」)も判明。荷主名表示・配送履歴の要否等はquestions/PW-182.tsvに8件記録し暫定実装で継続。",
      tasks: {
        'data-design': { asis: 0.2,             tobe: 0,                  agents: ["—"] },
        'data-impl':   { asis: 0.2, loc: 4,     tobe: 0.1,                agents: ["バックエンドAI"] },
        'api-impl':    { asis: 7,   loc: 241,   tobe: 1.2,                agents: ["バックエンドAI"] },
        'api-test':    { asis: 1,               tobe: 0.3,                agents: ["バックエンドテスターAI"] },
        'api-review':  { asis: 0.5,             tobe: 0.3, tobeEng: 0.1,  agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'ux':          { asis: 2,               tobe: 0.2,                agents: ["プランナーAI"] },
        'fe-design':   { asis: 0.5,             tobe: 0.1,                agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 10,  loc: 476,   tobe: 1.8, tobeEng: 0.1,  agents: ["フロントエンドAI"] },
        'fe-review':   { asis: 0.5,             tobe: 0.3, tobeEng: 0.1,  agents: ["フロントエンドレビュワーAI", "エンジニア"] },
        'verify':      { asis: 3,               tobe: 1.3, tobeEng: 0.9,  agents: ["フロントエンドテスターAI", "エンジニア"] },
      },
      contextNotes: [
        "対象画面: 番号入力 (FE046 / PW-182 / DM13 お客様WEB・mock=app-customer-mockup/redelivery)。お問い合わせ番号の入力→照会→状態別(訪問不在/完了/保管期限切れ/該当なし)画面振り分け。再配送依頼フォーム自体(FE049相当)はスコープ外。未ログイン公開Query新設のためDBスキーマ変更は最小限(既存t_deliveriesのみ)。",
        "<strong>ToBe は実測</strong> (time-log.jsonl・2026-07-01〜02): <strong>5.6h</strong>(実装系統A 3.5h＋動作確認・是正 2.1h)。worktree並列実装(PW-183/184と同時進行)のため按分値。",
        "<strong>手戻り</strong>: backend-reviewerが公開エンドポイントの内部文言(work_content_code)露出を検出→history空配列返却に是正、@Argsのバリデーション追加。frontend-reviewerが番号表示フォーマット・fetchPolicy未指定を指摘→是正。<strong>ユーザーとの対面検証</strong>で、app-customer全体に共通ヘッダーが無いこと・シードのinquiry_no形式(INV接頭辞)が正本(11桁数字)に根拠がないことを発見、いずれもコード修正(RootLayout移植・シード是正)まで実施。ダッシュボード上の画面ID表記(FE046)自体が正本の画面IDと食い違っている(正本はFE048)ことも判明。",
        "<strong>AsIs は実績コード量から推定</strong>: フロント 約476行→10h・バックエンド 約241行→7h。レビュー・動作確認は人間工数としてAsIsを計上(初の公開エンドポイントのため確認工数を厚めに見積り)。合計 約24.9h → ToBe 5.6h(削減 約78%)。",
      ],
    },
    'wi-screen-DM03FE009': {
      lede: "AIDD 試行「○○○配送状況」(FE009 / PW-183 / DM03 配送管理) の開発工数比較。○○○社の配送を<strong>デポ×荷主単位</strong>のカードに集約し、持出区分(翌日配送便/本日配送便/未完了)ごとの出発時刻・使用車両台数・完了/不在/未完了件数を表示、便名・着点コード別の明細もドロワーで確認できる画面。<strong>便を表す新規データモデル(TDispatchTrip)を追加</strong>したが、<strong>共有開発DBへのマイグレーション適用は安全機構により保留中</strong>(既存DBのマイグレーション履歴と実スキーマの乖離を検知)。実装中に<strong>対象日判定のJST/UTC構造バグ</strong>を発見・修正。<strong>ToBe は実測</strong>(time-log) <strong>5.4h</strong>(実装3.0h＋検証・是正2.4h)。",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                                                   color: "#ef4444", asis: 1, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (対象日判定JST/UTCズレ・荷主フィルタのApolloキャッシュ)",             color: "#f59e0b", asis: 6, tobe: 5 },
        { key: "edge",   label: "エッジケース漏れ (持出区分「未完了」の抽出条件・荷主データ権限0件時の挙動)",       color: "#8b5cf6", asis: 5, tobe: 3 },
        { key: "spec",   label: "仕様解釈ミス (便データ構造自体が正本未確定・対象日と持出区分ラベルの対応関係)",     color: "#ec4899", asis: 6, tobe: 5 },
        { key: "ui",     label: "UI 細部の不整合 (検索前一覧非表示という独自仕様のmock逸脱)",                       color: "#06b6d4", asis: 3, tobe: 3 },
      ],
      bugRateNote: "※ ○○○配送状況 約2.1 KLOC(FE 約830行＋BE 約578行＋DB(schema) 約137行)。<strong>「便」データ構造自体がチケット確認事項として未確定</strong>(高ブロッカー、千葉さん確認待ちのまま暫定実装で継続)。<strong>共有DBのマイグレーション履歴と実スキーマの乖離</strong>(他ブランチ由来とみられる破壊的DDL混在)を検知し、安全のためDB反映を保留(questions/PW-183.tsv・db-architectメモに記録)。",
      tasks: {
        'data-design': { asis: 3,               tobe: 0.5,                agents: ["DBアーキテクトAI"] },
        'data-impl':   { asis: 9,   loc: 137,   tobe: 0.6,                agents: ["DBアーキテクトAI"] },
        'api-impl':    { asis: 16.5, loc: 578,  tobe: 1.3,                agents: ["バックエンドAI"] },
        'api-test':    { asis: 1,               tobe: 0.2,                agents: ["バックエンドテスターAI"] },
        'api-review':  { asis: 0.5,             tobe: 0.2,                agents: ["バックエンドレビュワーAI"] },
        'ux':          { asis: 2,               tobe: 0.2,                agents: ["プランナーAI"] },
        'fe-design':   { asis: 0.5,             tobe: 0.1,                agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 16.6, loc: 830,  tobe: 1.5, tobeEng: 0.1,  agents: ["フロントエンドAI"] },
        'fe-review':   { asis: 0.5,             tobe: 0.3,                agents: ["フロントエンドレビュワーAI"] },
        'verify':      { asis: 3,               tobe: 0.5, tobeEng: 0.5,  agents: ["フロントエンドテスターAI", "エンジニア"] },
      },
      contextNotes: [
        "対象画面: ○○○配送状況 (FE009 / PW-183 / DM03 配送管理・mock=app-admin-mockup/ksl)。デポ×荷主カード一覧＋持出区分別集計＋便名/着点コード別ドロワー明細。新規データモデル(TDispatchTrip)が必要だった非マスタ画面の一例。",
        "<strong>ToBe は実測</strong> (time-log.jsonl・2026-07-01〜02): <strong>5.4h</strong>(実装系統A 3.0h＋動作確認・是正 2.4h)。worktree並列実装(PW-182/184と同時進行)のため按分値。",
        "<strong>手戻り・特記事項</strong>: 共有開発DBへの新規マイグレーション適用時、既存DBのマイグレーション履歴と実スキーマの乖離(他ブランチ由来の破壊的DDL混在)を検知し安全機構がブロック→専用の分離DBを新設し安全に検証。検証データ整備中に<strong>対象日「本日/翌日」判定がUTC基準になっており深夜0時〜朝9時(JST)は前日扱いになる実バグ</strong>を発見・修正(コミット8d677f1e)。regression-scopeはフロントエンド側(const.ts resolveTripDateIso)にも同種のJST未対応が疑われる点を指摘、未調査のまま残っている。",
        "<strong>AsIs は実績コード量から推定</strong>: フロント 約830行→16.6h・バックエンド 約578行→16.5h・DB(新規モデル設計)約137行→12h。UX/レビュー/動作確認は人間工数として計上。合計 約48h → ToBe 5.4h(削減 約89%)。<strong>共有DBへのマイグレーション適用は未完了</strong>のため本番相当環境での動作確認は別途必要。",
      ],
    },
    'wi-fileio-DM14FE051-1': {
      lede: "AIDD 試行「日付変更一括登録」(FE018 / PW-184 / DM06 管理画面・ダッシュボード上はFE051「一括登録」に対応履歴一括登録[FE019]と束ねて登録) の開発工数比較。CSVアップロードで複数件の配送日変更依頼を一括登録する<strong>部分成功方式</strong>のMutation。backend-reviewerが<strong>他ユーザーの結果が全件見えるデータ権限漏れ・楽観的ロック欠如・正本と矛盾するステータス判定</strong>の3件のMajorを検出し是正、新規テスト16件を追加。<strong>ToBe は実測</strong>(time-log) <strong>4.3h</strong>(実装3.0h＋検証・是正1.3h)。<strong>注記: このFE051行はFE018+FE019の2画面分を表す。本エントリはFE018(日付変更)分のみの実績であり、FE019(対応履歴一括登録)は未着手のため進捗50%として計上する。</strong>",
      bugCategories: [
        { key: "syntax", label: "構文/型エラー",                                                   color: "#ef4444", asis: 1, tobe: 0 },
        { key: "logic",  label: "ロジックバグ (データ権限漏れ・楽観的ロック欠如・ステータス判定リストが正本と矛盾)", color: "#f59e0b", asis: 8, tobe: 6 },
        { key: "edge",   label: "エッジケース漏れ (CSV空行による行番号ズレ・日付実在性検証漏れ[2026/02/30])",       color: "#8b5cf6", asis: 5, tobe: 4 },
        { key: "spec",   label: "仕様解釈ミス (元チケットがFE018+FE019を束ね画面IDも誤表記=FE051→正本FE018・受付中止テーブル不明)", color: "#ec4899", asis: 4, tobe: 3 },
        { key: "ui",     label: "UI 細部の不整合 (共通エラーハンドラ未使用・列幅調整)",                             color: "#06b6d4", asis: 2, tobe: 2 },
      ],
      bugRateNote: "※ 日付変更一括登録 約1.3 KLOC(FE 約631行＋BE 約696行)。元チケットは対応履歴一括登録(FE019)と1チケット・画面IDも誤表記(FE051)だったため、レビュー段階で日付変更一括登録(FE018)単独にスコープを是正(FE019は別チケット化が必要)。backend-reviewerが正本(m-delivery-status.md)の「配送日以降の変更可否」列と実装の対象外ステータスリストの矛盾(住所不明・受取拒否・転居を誤ってブロック対象にしていた)を検出。questions/PW-184.tsvに11件記録。",
      tasks: {
        'data-design': { asis: 0,               tobe: 0,                  agents: ["—"] },
        'data-impl':   { asis: 0,               tobe: 0,                  agents: ["—"] },
        'api-impl':    { asis: 19.9, loc: 696,  tobe: 1.4,                agents: ["バックエンドAI"] },
        'api-test':    { asis: 1,               tobe: 0.3,                agents: ["バックエンドテスターAI"] },
        'api-review':  { asis: 0.5,             tobe: 0.3, tobeEng: 0.1,  agents: ["バックエンドレビュワーAI", "エンジニア"] },
        'ux':          { asis: 1,               tobe: 0.1,                agents: ["プランナーAI"] },
        'fe-design':   { asis: 0.5,             tobe: 0.1,                agents: ["フロントエンドAI"] },
        'fe-impl':     { asis: 12.6, loc: 631,  tobe: 1.3, tobeEng: 0.1,  agents: ["フロントエンドAI"] },
        'fe-review':   { asis: 0.5,             tobe: 0.3,                agents: ["フロントエンドレビュワーAI"] },
        'verify':      { asis: 3,               tobe: 0.5, tobeEng: 0.3,  agents: ["フロントエンドテスターAI", "エンジニア"] },
      },
      contextNotes: [
        "対象画面: 日付変更一括登録 (FE018 / PW-184 / DM06 管理画面・mock=app-admin-mockup/bulk-date-change)。CSVアップロード→行ごとの業務ルール判定(キャパ超過/受付中止/当日/対象外ステータス/番号不一致)→部分成功で更新→結果一覧・エラー表示→登録結果CSVダウンロード。対応履歴一括登録(FE019)は別画面のためスコープ外。",
        "<strong>ToBe は実測</strong> (time-log.jsonl・2026-07-01〜02): <strong>4.3h</strong>(実装系統A 3.0h＋動作確認・是正 1.3h)。worktree並列実装(PW-182/183と同時進行)のため按分値。JISSI_KOUSU_HはFE018分のみを計上し進捗50%扱い(FE019分は含まない)。",
        "<strong>手戻り</strong>: backend-reviewerがMajor3件(他ユーザーの一括登録結果が全件閲覧可能なデータ権限漏れ／楽観的ロックversion欠如／対象外ステータスリストが正本と矛盾)を検出→是正、新規テスト16件追加。frontend-reviewerがMajor1件(共通エラーハンドラ未使用)・CSV空行による行番号ズレを検出→是正。<strong>ユーザーとの対面検証</strong>で「登録結果ダウンロードに無関係なものが混ざる」と報告を受け調査した結果、実装は正本通り(本日実行者分の累積ダウンロード)で正しく、混入していたのは検証セッション中にAI側が投入したテストデータと判明(バグではなく検証環境の後片付け課題)。",
        "<strong>AsIs は実績コード量から推定</strong>: フロント 約631行→12.6h・バックエンド 約696行→19.9h。レビュー・動作確認は人間工数として計上。合計 約38h → ToBe 4.3h(削減 約89%)。",
      ],
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

  // デポ掲示板 (FE013): 工数の先頭に [試行特有]仕様解析 (人間のToBe 4.0h) を追加。
  // override は新規キーを末尾に積むため、ここで先頭に unshift する。これによりデポ掲示板は「試行あり」側になる。
  (function addDepotBoardTrialSpec() {
    const s = scenarios['wi-screen-DM04FE013'];
    if (s && !s.tasks.some(t => t.key === 'trial-spec-analysis')) {
      s.tasks.unshift({
        key: 'trial-spec-analysis',
        label: '[試行特有]仕様解析',
        color: '#9333ea',
        loc: null, asis: 0, tobe: 4.0, tobeEng: 4.0,
        agents: ['エンジニア'],
      });
    }
  })();

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
    // ToBe: APIレビュー 0.8h(エンジニア) + その他工程 合計 0.7h(AI実装実測)。
    'wi-be-8': {
      lede: "<strong>バッチログ</strong> の履歴テーブルを<strong>バックエンドのみ生成</strong>（入力画面なし・9項目）。実績コード量は計 <strong>577行</strong>（DBスキーマ 69 / バックエンド実装 318 / ユニットテスト 190）。工程はお知らせ登録(FE015)の「データモデル設計〜APIレビュー」に準拠。<strong>AsIs は行数規模から推定</strong>、<strong>ToBe は実測</strong>（AI実装 0.7h + APIレビュー 0.8h）。APIレビューは人がコードを確認する工数として AsIs / ToBe とも 0.8h でそろえている。",
      tasks: [
        { key: "data-design", label: "データモデル設計",        color: "var(--c-data-design)", loc: null, asis: 1.7, tobe: 0.1, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "data-impl",   label: "データモデル実装",        color: "var(--c-data-impl)",   loc: 69,   asis: 2.5, tobe: 0.1, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "api-impl",    label: "API設計・実装",           color: "var(--c-api-impl)",    loc: 318,  asis: 6.9, tobe: 0.4, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-test",    label: "API単体テスト",           color: "var(--c-api-test)",    loc: 190,  asis: 2.6, tobe: 0.1, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-review",  label: "APIレビュー (エンジニア)", color: "var(--c-eng-review)",  loc: null, asis: 0.8, tobe: 0.8, tobeEng: 0.8, agents: ["バックエンドレビュワーAI", "エンジニア"] },
      ],
      contextNotes: [
        "対象: バッチログ の履歴テーブル。入力画面を持たないバックエンド(Prisma スキーマ + Service)生成枠で、画面実装の完了判定には含めない別グループ（出典: <code>.work/table_gap.md</code> ＋ データモデル設計書）。",
        "<strong>実績コード量</strong>: DBスキーマ <strong>69行</strong> / バックエンド実装 <strong>318行</strong> / ユニットテスト <strong>190行</strong>（計 577行）。工程区分はお知らせ登録(FE015)のデータモデル設計〜APIレビューを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行）。データモデル設計はデータ実装の規模比で按分。APIレビューは人の確認工数として AsIs / ToBe とも 0.8h でそろえる。合計 約14.5h。",
        "<strong>ToBe（AI駆動）は実測 1.5h</strong>: AI実装 0.7h（設計・実装・テスト生成）＋ APIレビュー 0.8h（エンジニア）。削減率 約90%。レビューはAIが書いたコードを人が確認する工数で AsIs と同水準。",
        "想定バグ数は未記入（バックエンド生成のため別途記録予定）。",
      ],
    },
    // 出発時間 のトランザクション (6項目)。荷主(wi-be-2)・幹線(wi-be-9)と同じ構成。
    // 実績LOC: DBスキーマ(data-impl) 68 / バックエンド実装(api-impl) 250 / ユニットテスト(api-test) 231 (計549行)。
    // AsIs: お知らせ登録の「行あたり工数」を実績LOCに適用 (data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行)。
    //       data-design はお知らせ登録の設計 4h をデータ実装の規模比 (68/166) で按分、api-review は人の確認工数として ToBe とそろえる。
    // ToBe: APIレビュー 0.8h(エンジニア) + その他工程 合計 0.6h(AI実装実測)。
    'wi-be-11': {
      lede: "<strong>出発時間</strong> のトランザクションテーブルを<strong>バックエンドのみ生成</strong>（入力画面なし・6項目）。実績コード量は計 <strong>549行</strong>（DBスキーマ 68 / バックエンド実装 250 / ユニットテスト 231）。工程はお知らせ登録(FE015)の「データモデル設計〜APIレビュー」に準拠。<strong>AsIs は行数規模から推定</strong>、<strong>ToBe は実測</strong>（AI実装 0.6h + APIレビュー 0.8h）。APIレビューは人がコードを確認する工数として AsIs / ToBe とも 0.8h でそろえている。",
      tasks: [
        { key: "data-design", label: "データモデル設計",        color: "var(--c-data-design)", loc: null, asis: 1.6, tobe: 0.08, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "data-impl",   label: "データモデル実装",        color: "var(--c-data-impl)",   loc: 68,   asis: 2.5, tobe: 0.12, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "api-impl",    label: "API設計・実装",           color: "var(--c-api-impl)",    loc: 250,  asis: 5.4, tobe: 0.24, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-test",    label: "API単体テスト",           color: "var(--c-api-test)",    loc: 231,  asis: 3.2, tobe: 0.16, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-review",  label: "APIレビュー (エンジニア)", color: "var(--c-eng-review)",  loc: null, asis: 0.8, tobe: 0.80, tobeEng: 0.8, agents: ["バックエンドレビュワーAI", "エンジニア"] },
      ],
      contextNotes: [
        "対象: 出発時間 のトランザクションテーブル。入力画面を持たないバックエンド(Prisma スキーマ + Service)生成枠で、画面実装の完了判定には含めない別グループ（出典: <code>.work/table_gap.md</code> ＋ データモデル設計書）。",
        "<strong>実績コード量</strong>: DBスキーマ <strong>68行</strong> / バックエンド実装 <strong>250行</strong> / ユニットテスト <strong>231行</strong>（計 549行）。工程区分はお知らせ登録(FE015)のデータモデル設計〜APIレビューを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行）。データモデル設計はデータ実装の規模比で按分。APIレビューは人の確認工数として AsIs / ToBe とも 0.8h でそろえる。合計 約13.5h。",
        "<strong>ToBe（AI駆動）は実測 1.4h</strong>: AI実装 0.6h（設計・実装・テスト生成）＋ APIレビュー 0.8h（エンジニア）。削減率 約90%。レビューはAIが書いたコードを人が確認する工数で AsIs と同水準。",
        "想定バグ数は未記入（バックエンド生成のため別途記録予定）。",
      ],
    },
    // 解約新規案件 のトランザクション (11項目)。荷主(wi-be-2)・幹線(wi-be-9)と同じ構成。
    // 実績LOC: DBスキーマ(data-impl) 99 / バックエンド実装(api-impl) 408 / ユニットテスト(api-test) 266 (計773行)。
    // AsIs: お知らせ登録の「行あたり工数」を実績LOCに適用 (data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行)。
    //       data-design はお知らせ登録の設計 4h をデータ実装の規模比 (99/166) で按分、api-review は人の確認工数として ToBe とそろえる。
    // ToBe: APIレビュー 1.0h(エンジニア) + その他工程 合計 1.0h(AI実装実測) + リレーション修正 0.3h(うちエンジニア 0.1h)。
    'wi-be-5': {
      lede: "<strong>解約新規案件</strong> のトランザクションテーブルを<strong>バックエンドのみ生成</strong>（入力画面なし・11項目）。実績コード量は計 <strong>773行</strong>（DBスキーマ 99 / バックエンド実装 408 / ユニットテスト 266）。工程はお知らせ登録(FE015)の「データモデル設計〜APIレビュー」に準拠。<strong>AsIs は行数規模から推定</strong>、<strong>ToBe は実測</strong>（AI実装 1.0h + APIレビュー 1.0h + リレーション修正 0.3h）。APIレビューは人がコードを確認する工数として AsIs / ToBe とも 1.0h でそろえている。",
      tasks: [
        { key: "data-design", label: "データモデル設計",        color: "var(--c-data-design)", loc: null, asis: 2.4, tobe: 0.1, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "data-impl",   label: "データモデル実装",        color: "var(--c-data-impl)",   loc: 99,   asis: 3.6, tobe: 0.2, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "api-impl",    label: "API設計・実装",           color: "var(--c-api-impl)",    loc: 408,  asis: 8.8, tobe: 0.5, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-test",    label: "API単体テスト",           color: "var(--c-api-test)",    loc: 266,  asis: 3.6, tobe: 0.2, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-review",  label: "APIレビュー (エンジニア)", color: "var(--c-eng-review)",  loc: null, asis: 1.0, tobe: 1.0, tobeEng: 1.0, agents: ["バックエンドレビュワーAI", "エンジニア"] },
        { key: "relation-fix", label: "リレーション修正",        color: "#9333ea",              loc: null, asis: 0,   tobe: 0.3, tobeEng: 0.1, agents: ["バックエンドAI", "エンジニア"] },
      ],
      contextNotes: [
        "対象: 解約新規案件 のトランザクションテーブル。入力画面を持たないバックエンド(Prisma スキーマ + Service)生成枠で、画面実装の完了判定には含めない別グループ（出典: <code>.work/table_gap.md</code> ＋ データモデル設計書）。",
        "<strong>実績コード量</strong>: DBスキーマ <strong>99行</strong> / バックエンド実装 <strong>408行</strong> / ユニットテスト <strong>266行</strong>（計 773行）。工程区分はお知らせ登録(FE015)のデータモデル設計〜APIレビューを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行）。データモデル設計はデータ実装の規模比で按分。APIレビューは人の確認工数として AsIs / ToBe とも 1.0h でそろえる。合計 約19.4h。",
        "<strong>ToBe（AI駆動）は実測 2.3h</strong>: AI実装 1.0h（設計・実装・テスト生成）＋ APIレビュー 1.0h（エンジニア）＋ <strong>リレーション修正 0.3h（うちエンジニア 0.1h）</strong>。削減率 約88%。レビュー・リレーション修正はエンジニアが実施する工数で AsIs と同水準。",
        "想定バグ数は未記入（バックエンド生成のため別途記録予定）。",
      ],
    },
    // 住所(郵便番号)(m_postcode) のマスタ (21項目)。荷主(wi-be-2)・顧客(wi-be-0)と同じ構成。
    // 実績LOC: DBスキーマ(data-impl) 309 / バックエンド実装(api-impl) 504 / ユニットテスト(api-test) 340 (計1,153行)。
    // AsIs: お知らせ登録の「行あたり工数」を実績LOCに適用 (data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行)。
    //       data-design はお知らせ登録の設計 4h をデータ実装の規模比 (309/166) で按分、api-review は人の確認工数として ToBe とそろえる。
    // ToBe: APIレビュー 0.8h(エンジニア) + その他工程 合計 1.0h(AI実装実測)。
    'wi-be-1': {
      lede: "<strong>住所(郵便番号)</strong>(<code>m_postcode</code>) のマスタを<strong>バックエンドのみ生成</strong>（入力画面なし・21項目）。実績コード量は計 <strong>1,153行</strong>（DBスキーマ 309 / バックエンド実装 504 / ユニットテスト 340）。工程はお知らせ登録(FE015)の「データモデル設計〜APIレビュー」に準拠。<strong>AsIs は行数規模から推定</strong>、<strong>ToBe は実測</strong>（AI生成 1.0h + APIレビュー 0.8h）。APIレビューは人がコードを確認する工数として AsIs / ToBe とも 0.8h でそろえている。",
      tasks: [
        { key: "data-design", label: "データモデル設計",        color: "var(--c-data-design)", loc: null, asis: 7.4,  tobe: 0.2, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "data-impl",   label: "データモデル実装",        color: "var(--c-data-impl)",   loc: 309,  asis: 11.2, tobe: 0.3, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "api-impl",    label: "API設計・実装",           color: "var(--c-api-impl)",    loc: 504,  asis: 10.9, tobe: 0.3, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-test",    label: "API単体テスト",           color: "var(--c-api-test)",    loc: 340,  asis: 4.6,  tobe: 0.2, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-review",  label: "APIレビュー (エンジニア)", color: "var(--c-eng-review)",  loc: null, asis: 0.8,  tobe: 0.8, tobeEng: 0.8, agents: ["バックエンドレビュワーAI", "エンジニア"] },
      ],
      contextNotes: [
        "対象: 住所(郵便番号)(m_postcode) のマスタ。入力画面を持たないバックエンド(Prisma スキーマ + Service)生成枠で、画面実装の完了判定には含めない別グループ（出典: <code>.work/table_gap.md</code> ＋ データモデル設計書）。",
        "<strong>実績コード量</strong>: DBスキーマ <strong>309行</strong> / バックエンド実装 <strong>504行</strong> / ユニットテスト <strong>340行</strong>（計 1,153行）。工程区分はお知らせ登録(FE015)のデータモデル設計〜APIレビューを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行）。データモデル設計はデータ実装の規模比で按分。APIレビューは人の確認工数として AsIs / ToBe とも 0.8h でそろえる。合計 約34.9h。",
        "<strong>ToBe（AI駆動）は実測 1.8h</strong>: AI生成 1.0h（設計・実装・テスト生成）＋ APIレビュー 0.8h（エンジニア）。削減率 約95%。レビューはAIが書いたコードを人が確認する工数で AsIs と同水準。",
        "想定バグ数は未記入（バックエンド生成のため別途記録予定）。",
      ],
    },
    // 配送メモ のトランザクション (10項目)。荷主(wi-be-2)・解約新規案件(wi-be-5)と同じ構成。
    // 実績LOC: DBスキーマ(data-impl) 97 / バックエンド実装(api-impl) 376 / ユニットテスト(api-test) 380 (計853行)。
    // AsIs: お知らせ登録の「行あたり工数」を実績LOCに適用 (data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行)。
    //       data-design はお知らせ登録の設計 4h をデータ実装の規模比 (97/166) で按分、api-review は人の確認工数として ToBe とそろえる。
    // ToBe: APIレビュー 1.0h(エンジニア) + その他工程 合計 0.75h(AI実装実測)。
    'wi-be-6': {
      lede: "<strong>配送メモ</strong> のトランザクションテーブルを<strong>バックエンドのみ生成</strong>（入力画面なし・10項目）。実績コード量は計 <strong>853行</strong>（DBスキーマ 97 / バックエンド実装 376 / ユニットテスト 380）。工程はお知らせ登録(FE015)の「データモデル設計〜APIレビュー」に準拠。<strong>AsIs は行数規模から推定</strong>、<strong>ToBe は実測</strong>（AI生成 0.75h + APIレビュー 1.0h）。APIレビューは人がコードを確認する工数として AsIs / ToBe とも 1.0h でそろえている。",
      tasks: [
        { key: "data-design", label: "データモデル設計",        color: "var(--c-data-design)", loc: null, asis: 2.3, tobe: 0.10, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "data-impl",   label: "データモデル実装",        color: "var(--c-data-impl)",   loc: 97,   asis: 3.5, tobe: 0.15, tobeEng: 0,   agents: ["DBアーキテクトAI"] },
        { key: "api-impl",    label: "API設計・実装",           color: "var(--c-api-impl)",    loc: 376,  asis: 8.2, tobe: 0.30, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-test",    label: "API単体テスト",           color: "var(--c-api-test)",    loc: 380,  asis: 5.2, tobe: 0.20, tobeEng: 0,   agents: ["バックエンドAI"] },
        { key: "api-review",  label: "APIレビュー (エンジニア)", color: "var(--c-eng-review)",  loc: null, asis: 1.0, tobe: 1.00, tobeEng: 1.0, agents: ["バックエンドレビュワーAI", "エンジニア"] },
      ],
      contextNotes: [
        "対象: 配送メモ のトランザクションテーブル。入力画面を持たないバックエンド(Prisma スキーマ + Service)生成枠で、画面実装の完了判定には含めない別グループ（出典: <code>.work/table_gap.md</code> ＋ データモデル設計書）。",
        "<strong>実績コード量</strong>: DBスキーマ <strong>97行</strong> / バックエンド実装 <strong>376行</strong> / ユニットテスト <strong>380行</strong>（計 853行）。工程区分はお知らせ登録(FE015)のデータモデル設計〜APIレビューを流用。",
        "<strong>AsIs（人力想定）は行数規模から推定</strong>: お知らせ登録の『行あたり工数』を実績LOCに適用（data-impl 6h/166行・api-impl 8h/369行・api-test 3.5h/256行）。データモデル設計はデータ実装の規模比で按分。APIレビューは人の確認工数として AsIs / ToBe とも 1.0h でそろえる。合計 約20.2h。",
        "<strong>ToBe（AI駆動）は実測 1.75h</strong>: AI生成 0.75h（設計・実装・テスト生成）＋ APIレビュー 1.0h（エンジニア）。削減率 約91%。レビューはAIが書いたコードを人が確認する工数で AsIs と同水準。",
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

  // === 合計の下の小計2種 ===
  // サイドバーで「(試行)」が付くシナリオ (= [試行特有] 工程を含む) / 付かないシナリオを、
  // それぞれ別に合算した小計タブを生成して 合計 の直後に並べる。
  (function buildTrialSubtotals() {
    const hasTrial = s => !!s && (s.tasks || []).some(t => (t.label || "").includes("[試行特有]"));
    const hasData  = s => {
      if (!s) return false;
      const t = (s.tasks || []).some(x => (x.asis || 0) > 0 || (x.tobe || 0) > 0 || (x.loc || 0) > 0);
      const b = (s.bugCategories || []).some(c => (c.asis || 0) > 0 || (c.tobe || 0) > 0);
      return t || b;
    };
    const tabKeys      = TAB_ORDER.filter(k => k !== "total");
    const dataKeys     = tabKeys.filter(k => hasData(scenarios[k]));
    const trialKeys    = dataKeys.filter(k => hasTrial(scenarios[k]));
    const nonTrialKeys = dataKeys.filter(k => !hasTrial(scenarios[k]));

    // 合計 = データのある全シナリオを合算 (= 小計(試行あり) + 小計(試行なし) と一致)。
    // dataKeys は trialKeys と nonTrialKeys の互いに素な和集合なので、各工程・バグ数とも
    // 「合計 = 小計あり + 小計なし」が必ず成り立つ。
    scenarios.total = Object.assign(buildTotalScenario(scenarios, dataKeys), {
      tabLabel: "合計",
      title: `全シナリオ合計 開発工数比較 (AsIs / ToBe) (${dataKeys.length}件)`,
      lede: `本ページでデータが入力済みの全 ${dataKeys.length} シナリオを合算した参考値です。内訳は直下の <strong>小計(試行あり)</strong> + <strong>小計(試行なし)</strong> に一致します。`,
    });

    scenarios["total-trial"] = Object.assign(buildTotalScenario(scenarios, trialKeys), {
      tabLabel: "小計 (試行あり)",
      title: `小計: サイドバーで「(試行)」が付く ${trialKeys.length} シナリオ合計 (AsIs / ToBe)`,
      lede: `サイドバーで <strong>(試行)</strong> が付く ${trialKeys.length} シナリオ（AIDD 試行の [試行特有] 工程を含む）の工数・コード量・想定バグ数を合算した小計です。`,
    });
    scenarios["total-nontrial"] = Object.assign(buildTotalScenario(scenarios, nonTrialKeys), {
      tabLabel: "小計 (試行なし)",
      title: `小計: サイドバーで「(試行)」が付かない ${nonTrialKeys.length} シナリオ合計 (AsIs / ToBe)`,
      lede: `サイドバーで <strong>(試行)</strong> が付かない ${nonTrialKeys.length} シナリオ（[試行特有] 工程を含まない）の工数・コード量・想定バグ数を合算した小計です。`,
    });

    const ti = TAB_ORDER.indexOf("total");
    TAB_ORDER.splice(ti + 1, 0, "total-trial", "total-nontrial");
  })();
