# 要件構造化AI導入効果レポート（PW-115 vs PW-116 比較）

- 作成日: 2026-05-18
- 対象画面: ユーザマスタ画面（FE020）
- 比較ブランチ: f/PW-115（要件構造化なし）vs f/PW-116（要件構造化あり）

---

## 0. エグゼクティブサマリ

要件構造化AI群（`id-assignment-engine（ID付与エンジン）`〜`acceptance-test-design-ai（受入テスト設計AI）`）を導入した場合、**要件解像度・トレーサビリティ・欠落検出能力・mock整合維持の4点で明確な効果がある**。約 27 分で 60 Gherkin シナリオまで到達し、PW-115 では検出できなかった構造的問題（独断具体化・自己矛盾・YAML欠陥など）を 07 が検出した。

ただし、本パイプラインは「**要件→受入テスト**」までを担い、PW-115 が達成した「**要件→動く実装**」までは到達しない。両者は**補完関係**にあり、`spec-consistency-reviewer-ai（仕様一貫性レビュワーAI）` の出力を planner の入力に繋ぐことで PW-115 の弱点（planner spec への独自判断混入）を予防できる可能性が見えた。

ネガティブ要素（補助資料の自律参照・YAML構文エラー・ID粒度乖離など）は仕様改修で解消可能。**改善付きで導入推奨**。

---

## 1. 比較対象の定義

| | PW-115 | PW-116 |
|---|---|---|
| アプローチ | brief.md + mockup → planner → 各 spec → 実装 | 要件定義書 → 8エージェント → タグ付き Gherkin |
| 入力規模 | brief.md 22行 + mockup ソース | 要件定義書 77行 + 非機能項目一覧 13行 |
| エージェント数 | 9（planner / db-architect / backend × 4 / frontend × 4） | 8（01〜08） |
| 実行時間 | 約 1 時間 43 分 | 約 27 分 |
| 中間生成物 | spec.md × 3（db/backend/frontend）合計 763 行 | 章立て / ID付き / アトミック / BR / UC / 用語集 / レビュー |
| 最終成果物 | 動く画面 + API + DBスキーマ + テスト | 60 Gherkin シナリオ + 未充足レポート + Backlog 起票案 10 件 |

---

## 2. 観点別の比較

### 2.1 要件解像度

**PW-115 の入力**:
- `specs/frontend-engineer/user-master.brief.md`（22行）
  - 内容: 「mockupパス: projects/app-admin-mockup/src/features/user/」「mockup全実装デフォルト」「status (1=休止/2=稼働) ↔ suspensionDiv (0=稼働中/1=休止中)：値反転」のみ
  - **画面項目1つ1つの仕様は記述されていない**（mockup を読めの一言）
- mockup ソース（参照のみ・暗黙の仕様）

**PW-116 の入力**:
- `inputs/requirements.md`（要件定義書、77行・68項目）
  - 各項目の「エリア / セクション / 項目名 / UI種別 / 検索方式 / 表示順 / 仕様 / 備考」が表形式で網羅
  - 「2026/04/06 顧客レビューア」コメント4件（未確定事項の追跡可能）

**評価**: PW-116 の入力は **本質的に異なる粒度の情報源**。要件定義書は「何を作るべきか」を一次情報として持つが、brief + mockup は「どう作るべきか」を二次情報として持つ。前者は推測補完を不要にし、後者は推測補完を誘発する構造。

---

### 2.2 データモデル設計

**PW-115（手動駆動・実装あり）**:
- `m_user` 拡張: katakanaName / permissionGroupId / operationEndDate を追加、depotId を削除
- `m_permission_group` 新規（権限グループのマスタ化）
- `m_user_shipper` / `m_user_depot` 中間テーブル新規（N:N 化）
- マイグレーション `20260513034011_pw_115_add_user_master_extension` を発行
- planner が **mockup ソース** から「shipperName: string[]」を見て N:N 必要と判断、`db-architect` spec に落とし込んだ

**PW-116（パイプライン駆動・素材整理のみ）**:
- 直接的なDBスキーマは生成されない
- `business-rule-extraction-ai（業務ルール抽出AI）` の出力（BR-001〜BR-016）が API バリデーション・状態遷移の素材として利用可能
- `glossary-generation-ai（用語集生成AI）` の出力（TERM-001〜TERM-022）がエンティティ識別の素材として利用可能
- 「N:N にすべき」「権限グループをマスタ化すべき」という設計判断は **生成されない**

**評価**: PW-116 はDB設計を直接出力しないが、**設計判断のための素材を整理**する。db-architect の入力として 04 と 06 の出力を渡せば、PW-115 と同等以上の設計品質が期待できる（特に 04 が指摘した「ステータスと稼働期間の優先関係未定義」は PW-115 の DB 設計時には議論されていない）。

---

### 2.3 バックエンド実装

**PW-115（実装あり）**:
- 約 30 ファイルの新規・変更
- `changeMUserPassword` mutation（旧パスワード bcrypt 照合 + 自分自身チェック + version 楽観ロック）
- backend-reviewer Round 4 まで実施し、Critical/Major 解消
- backend-tester で `DateTimeScalar.parseLiteral` / `NotFoundException マッピング` / `PrismaError マッピング` / `mock-user-id UUID化` を runtime で検出・修正

**PW-116（API契約の素材を整理）**:
- 業務ルール YAML が DTO バリデーション・エラーマッピングの根拠として使える
  - BR-001（電話番号フォーマット） → `@Matches(/^[0-9]{10,11}$/)`
  - BR-016（稼働開始日・終了日の前後関係制約） → カスタムバリデーション
- ただし Resolver/Service/DTO の実装ファイルは生成されない

**評価**: PW-116 は実装支援だが、置換はしない。ただし **04 が生成した「業務ルール欠落候補 15 件」（パスワード強度未定義・ステータスと稼働期間の優先関係未定義など）は、PW-115 のバリデーション設計時に存在しなかった視点**であり、PW-115 の `newPassword: @MinLength(8)` という単純なバリデーションを「業務ルールベースに統一する」契機になる。

---

### 2.4 フロントエンド実装（**最重要の発見**）

**PW-115（mock 逸脱の発生源）**:
- `user-drawer.tsx` (593行): UserDetailDrawer + UserCreateDrawer の **2 コンポーネント分割**
  - mockup は **1 つの UserDrawer** で item の有無により新規/編集を兼用する設計
- UserCreateDrawer に **`<input type="password">` を追加**（mock には存在しない）
- 起源: `specs/frontend-engineer/user-master.md` § 8 バリデーション (line 190)
  ```
  | userPassword | ✅ (create only) | string | - | @IsString + @IsNotEmpty |
  ```
- これは **planner が brief + mockup を読んで spec を生成した際に独自判断で追加した**。理由は「DB 必須カラムで新規作成にはパスワードが必要」という技術的妥当性のみ。
- frontend-reviewer モード A / B / 再 B のいずれも mock 逸脱を検出できず

**PW-116（mock 整合の維持）**:
- `outputs/08_gherkin/UC003_user_create.feature` の「正常登録」シナリオ:
  ```gherkin
  When 荷主プルダウンで「荷主A」を選択する
  And デポの検索付きマルチセレクトで「東京デポ」を選択する
  And 氏名テキストボックスに "山田 太郎" を入力する
  And カタカナ氏名テキストボックスに "ヤマダ タロウ" を入力する
  And 電話番号テキストボックスに "09012345678" を入力する
  And 権限グループのコンボボックスで「デポ運行管理者」を選択する
  And 稼働開始日のカレンダーコントロールで「2026/06/01」を選択する
  And ステータスのチョイスチップスで「稼働中」を選択する
  And 「登録」ボタンを押下する
  ```
- **パスワード入力ステップが存在しない**（要件定義書通り）
- 04 業務ルール抽出にも「新規登録時パスワード入力」のBRは生成されない
- 07 がパスワード変更モーダル（UC-007）と新規登録（UC-003）を別UCとして明確に分離

**評価**: **PW-116 のパイプラインを `planner の前段` に挟めば、PW-115 で起きた「planner 独自判断による mock 逸脱」を予防できる可能性が高い**。なぜなら、Gherkin 段階で「新規登録時にパスワード入力なし」が明示されており、これを spec の入力にすれば planner が `userPassword | ✅ (create only)` と勝手に書くインセンティブが消える。

---

### 2.5 オーケストレーション・ハンドリングのしやすさ

**PW-115（9エージェント直列・実装中心）**:
- 順序: `planner` → `db-architect` → `backend-engineer` → `backend-reviewer × 4` → `backend-tester × 2` → `frontend-engineer Phase1` → `frontend-reviewer A` → `frontend-engineer Phase2` → `frontend-reviewer B × 2` → `frontend-tester`
- 並列ポイント少（backend と frontend Phase1 のみ並列）
- リワーク多: backend-reviewer 4 回・frontend-reviewer 3 回
- 約 1 時間 43 分

**PW-116（8エージェント・要件構造化中心）**:
- 順序: `chapter-structuring-ai（章立て構造化AI）` → `id-assignment-engine（ID付与エンジン）` → `atomic-requirement-ai（アトミック要件分解AI）` → (`business-rule-extraction-ai（業務ルール抽出AI）` + `glossary-generation-ai（用語集生成AI）` 並列) → `usecase-formatting-ai（ユースケース整形AI）` → `acceptance-test-design-ai（受入テスト設計AI）` → `spec-consistency-reviewer-ai（仕様一貫性レビュワーAI）`
- 並列ポイントあり（04 + 06 同時実行）
- リワーク 0 回（初回 1 周で完走）
- 約 27 分

**評価**: PW-116 は **約 1/4 の時間** で完走。並列化も効いている。ただし PW-115 は実装まで含むため、単純な時間比較は不公平。「要件整理フェーズ」だけ取り出せば、PW-115 の planner（約 5 分）に対して PW-116 は約 27 分。**ただし PW-116 の方が成果物が圧倒的に多い**（Gherkin/BR/UC/用語集）ので、価値あたりの時間効率は良好。

---

### 2.6 品質・トレーサビリティ

**PW-115**:
- 「mockup全実装」という曖昧な前提により、要件 ↔ 実装のトレーサビリティが弱い
- spec ↔ 実装 のトレーサビリティはある（DTO バリデーション表→実装デコレータ）
- テストは spec.ts（ユニット）と screen-check（ランタイム検証）のみ
- 「カバレッジ」という概念は spec に存在しない

**PW-116**:
- 4方向トレース可能: REQ-ID ↔ BR-ID ↔ UC-ID ↔ Gherkin タグ
- カバレッジ指標が定量化されている:
  - A1（機能要件カバレッジ）: 100%
  - E1（浮きシナリオ）: 0
  - E2（孤立要件）: 0
  - E3（層間整合）: 100%
- 未充足要件は `unfulfilled_report.md` に明示分離

**評価**: PW-116 は **品質指標が明確で、要件カバレッジを客観的に測定可能**。これは PW-115 では存在しなかった視点。

---

### 2.7 推測補完問題の検出能力

**PW-115**:
- planner 自身が `userPassword | ✅ (create only)` を spec に埋め込む（推測補完）
- backend-reviewer Round 1 で `UpdateMUserInput.userPassword` 削除は指摘するが、`CreateMUserInput.userPassword` は残す（部分的な検出）
- frontend-reviewer A / B / 再B はいずれも mock 逸脱を未検出
- 結果として「動く実装」は完成したが、mock との構造一致は失われた

**PW-116**:
- `spec-consistency-reviewer-ai（仕様一貫性レビュワーAI）` が ISSUE-001 を検出:
  - `acceptance-test-design-ai（受入テスト設計AI）` が UC008 で `Given システム管理者権限を持つユーザがログイン済みである` と独断で具体化
  - BR-011 は「権限グループ未定義」と明示しているのに、テスト前提を勝手に絞り込んだ → 検出済み
- ISSUE-002（代表エリアの自己矛盾）も検出: 表示要件のみで編集 UI がない
- `business-rule-extraction-ai（業務ルール抽出AI）` が **15 件の欠落候補**を提示
  - 「パスワード強度未定義」「ステータスと稼働期間の優先関係未定義」「パスワード変更実行者制御の矛盾」など

**評価**: **PW-116 は推測補完を事後検出する自浄作用を持つ**。PW-115 が見逃した同種の問題（mock 逸脱）を、構造的に近いケース（独断具体化）として検出している。ただし「未然防止」ではなく「事後検出」である点は改善余地。

---

### 2.8 業務ルール・欠落事項の発見

**PW-115**: 業務ルール抽出という工程自体が存在しない。spec の「バリデーション表」が代用されているが、これは技術制約の列挙にすぎない。

**PW-116**: `business-rule-extraction-ai（業務ルール抽出AI）` が業務ルール 16 件 + 欠落候補 15 件を明示。例えば:
- BR-016（稼働開始日・終了日の前後関係制約）: PW-115 では言及なし、UI 側でインライン警告するのが望ましいとのみ記述
- 欠落候補（パスワード強度未定義）: PW-115 では `@MinLength(8)` と決め打ち、業務ルールとしての議論なし
- 欠落候補（ステータスと稼働期間の優先関係）: PW-115 の実装では稼働終了日後の表示挙動が未定義のまま動いている

**評価**: PW-116 は **業務ルールを構造化された形で抽出し、欠落を機械的に検出する**。PW-115 では暗黙のまま実装に進んでいた事項を可視化する。

---

## 3. ポジティブな影響（11件）

| # | 効果 | 根拠 |
|---|---|---|
| P1 | 要件解像度の劇的向上 | brief 22行 → 要件定義書 77行 → Gherkin 60 シナリオ |
| P2 | 4方向トレーサビリティ | REQ ⇄ BR ⇄ UC ⇄ Gherkin タグ完備、A1/E1/E2/E3 全 100% |
| P3 | 欠落事項の機械的発見 | 04 が欠落候補 15 件、08 が未充足 4 件、10 件の Backlog 起票案 |
| P4 | mock 整合の維持 | UC-003 にパスワード入力なし。planner spec の独自判断問題（userPassword 埋め込み）が発生しない |
| P5 | 並列実行可能 | 04 + 06 並列、約 27 分で end-to-end 完走 |
| P6 | 品質指標の定量化 | A1=100% / E1=0 / E2=0 / E3=100% で要件カバレッジ測定可能 |
| P7 | 自浄作用 | 07 が独断具体化（ISSUE-001）・自己矛盾（ISSUE-002）を事後検出 |
| P8 | テスト可能な成果物 | タグ付き Gherkin が E2E/受入テストに直接使える |
| P9 | Backlog 起票候補の自動抽出 | 10 件の未決事項をチケット候補として整理 |
| P10 | 業務SMEレビューの集中 | 機械チェック後の「業務妥当性のみ」に集中可能 |
| P11 | 用語ゆれの可視化 | 「ステータス vs 状態」「ユーザID vs ログインID」を 06 / 07 が検出 |

---

## 4. ネガティブな影響（10件）

| # | 影響 | 根拠 / 解消策 |
|---|---|---|
| N1 | 実装そのものを生成しない | PW-115 のような「動く画面」までは到達しない。**補完関係**として PW-115 と統合する必要 |
| N2 | 入力5点セットの整備コスト | 要件定義書を `inputs/` に整形するコストがある。今回は1ファイルコピーで済んだが、画面が増えると整形が必要 |
| N3 | エージェントの境界越え | 01/03/04/06 が補助資料を自律参照。再現性・決定論性が損なわれる → **責務境界の厳格化で解消可能** |
| N4 | YAML 構文エラー | 04 出力に 19 箇所の構文エラー。下流が機械処理不可 → **yamllint 必須化で解消可能** |
| N5 | ID 粒度の乖離 | 01 (L2) と 03 (枝番) で Gherkin タグが L2 止まり、部分カバー検出不可 → **採番ポリシー統一で解消可能** |
| N6 | 独断具体化を未然防止できず | 08 のシステム管理者権限独断指定は 07 で事後検出のみ → **05→07→08 順序変更で改善可能** |
| N7 | 業務知識の限界 | 「代表エリア」のようなドメイン固有概念は要件文だけでは判定困難 → **業務SMEレビュー必須** |
| N8 | UC は人間が書く前提 | 05 は素案までで UC を完成させない → 仕様通りだが業務SMEの作業負荷あり |
| N9 | 設計フェーズ持越し事項の扱い | REQ-10 系の扱いがエージェント間で曖昧 → **明示的なポリシー策定必要** |
| N10 | コスト | 8 エージェント実行（特に Sonnet 系）の API コスト。1サイクル 27 分で 50 万トークン以上 |

---

## 5. PW-115 でなぜ mock 逸脱が起きたか（深掘り）

PW-115 で **「userPassword 入力欄を新規作成 Drawer に追加した」** 問題は、以下の連鎖で発生：

```
brief.md「mockup全実装デフォルト」（22行）
  ↓
planner が brief + mockup + Prisma schema を読む
  ↓
planner: 「mockup には新規作成画面がない」
       + 「DB の m_user.userPassword は NOT NULL」
       + 「新規作成 API には userPassword が必要」
  ↓
planner が独自判断で spec に書き込む:
  - § 8 バリデーション: 「userPassword | ✅ (create only) | @IsNotEmpty」
  - § 10 実装ファイル: 「features/user/components/user-drawer.tsx」（mockup と同じ1ファイル）
  ↓
frontend-engineer フェーズ1（スケルトン抽出）:
  - スケルトン 482 行目に
    「{/* UserDetailDrawer と同じセクション3構造（ID は非表示、userPassword 入力あり） */}」
  - **planner spec の userPassword 必須を尊重してスケルトン化**
  ↓
frontend-reviewer モードA: スケルトンと mockup の比較で「userPassword 入力」をスルー
  ↓
frontend-engineer フェーズ2: スケルトンを実装に展開
  - UserDetailDrawer と UserCreateDrawer の 2 コンポーネント化
  - <input type="password"> 追加
  ↓
frontend-reviewer モードB（×2回）: いずれも mock 逸脱を検出せず通過
  ↓
動く実装は完成。しかし mock とは構造が異なる
```

**この問題は PW-116 のパイプラインを spec 生成の前段に挟むことで予防可能**:
- 02 → 08 が「mockup 由来の要件（パスワード入力ステップなし）」を Gherkin として明文化
- planner はこれを入力にすれば「userPassword 必須」と独自判断する根拠を失う
- 仮に planner が独自判断したとしても、07 が「Gherkin に無い項目を spec に追加」として検出可能

---

## 6. 結論

### 導入効果の判定

**効果あり**。以下の 4 つで明確：

1. **要件解像度**: 22行 brief → 77行画面項目定義書 → 60 Gherkin への解像度向上
2. **トレーサビリティ**: REQ ⇄ BR ⇄ UC ⇄ Gherkin タグの 4 方向トレース
3. **自浄作用**: 07 が独断具体化・自己矛盾を事後検出
4. **mock 整合の維持**: planner spec の「userPassword 埋め込み」型問題が原理的に発生しない

### 改善が必要な点

ネガティブ要素は **すべて仕様改修で解消可能**:
- N3（境界越え）: エージェント定義の責務境界を厳格化
- N4（YAML 構文）: 04 出力に yamllint ステップ追加
- N5（ID 粒度）: 採番ポリシー統一（01 で枝番採番 or req_map 拡張）
- N6（事後検出）: 05→07→08 にパイプライン順序変更
- N9（持越し扱い）: 設計フェーズ持越しのポリシー明文化

### 推奨アクション

1. **エージェント定義の改修**（N3〜N6、N9）を実施
2. **改修後パイプラインで同じユーザマスタ入力を再実行**（STEP2 検証）
3. **PW-116 パイプラインを `planner の前段` に統合する PoC**（PW-115 の問題を予防できるか検証）
4. **業務SMEレビュープロセスの正式化**（07 結果を業務側に渡す運用設計）
5. **別画面（商品マスタ等）で再現性確認**（STEP3 検証）

### 一行結論

> **PW-116 パイプラインは「要件→受入テスト」を担い、PW-115 パイプラインは「要件→実装」を担う。両者を PW-116 → PW-115 の順で連結すれば、PW-115 単独では予防できない独自判断問題（mock 逸脱）を構造的に予防できる可能性がある。** 改修付きで本格導入を推奨。
