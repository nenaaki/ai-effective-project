# docs\problem-01 開発ガイド (AI駆動実装)

このディレクトリのプロジェクトは、`specification.*` の定義から AI が DTO、API、ORM、テストを自動生成するスタイルを採用しています。

## 開発・ビルドコマンド
- ビルド: `npm run build`
- テスト: `npm test`
- 型チェック: `npm run type-check`
- lint修正: `npm run lint:fix`

## 実装規約 (AIへの指示)
AIによる実装の一貫性を保つため、以下のルールを遵守してください。

### 1. データ構造とID
- **ID型:** 全体で `ULID` を使用。
- **タイムスタンプ:** `createdAt`, `updatedAt` を全テーブルに含め、ORMレベルで自動更新。
- **削除仕様:** 
  - 属性 `softDelete`: 論理削除を採用。`deletedAt` カラムを自動生成し、検索時は自動で除外する。
  - 属性 `hardDelete`: 物理削除を採用。リレーションにおいて `onDelete: 'CASCADE'` などのカスケード設定を有効化できる。

### 2. API & DTO
- **形態:** REST API (JSON)。
- **バリデーション:** `Zod` または `class-validator` による入力値チェックを必須とする。
- **DTO:** `specification.*` で定義された型を厳格に反映する。

### 3. ORM & インデックス
- **属性:** 
  - `history`: 履歴保持が必要な場合は履歴テーブルを自動生成。
  - `upsert`: 重複時は自動的に Update を行う。
- **インデックス:** 外部キーおよび検索頻度の高いカラムには AI が自動で Index を付与する。

### 4. テスト方針
- AI は実装と同時に、正常系・異常系の単体テスト（Unit Test）を必ず生成する。
