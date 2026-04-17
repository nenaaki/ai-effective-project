# Specification as Single Source of Truth (SSOT)

## 1. Project Overview & Epics
本プロジェクトは、以下のEpic（主要機能群）を唯一のスコープとする通販サイトである。
- **Catalog Epic:** 商品一覧・詳細閲覧。S3保存の画像表示と在庫状態のリアルタイム反映。
- **Cart & Checkout Epic:** GraphQL Mutationによるカート操作と、決済完了時の注文生成。
- **Inventory Epic:** 管理者による在庫更新。在庫0以下の商品は注文不可とする。
- **Account Epic:** 注文履歴の閲覧。Auth認証に基づくデータアクセス制限。

## 2. Technical Stack (Constraints)
全実装は以下の技術スタックを厳守し、AIによる勝手なライブラリ追加を禁ずる。
- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** NestJS, GraphQL (Code First)
- **Database:** MySQL, Prisma (ORM)
- **Storage:** AWS S3 (商品画像、静的ファイル)

## 3. Data Domain Model (The Core Truth)
Prisma Schemaを真実のソースとし、以下のリレーションを維持する。
- `User` (1) --- (N) `Order`
- `Product` (N) --- (N) `Category`
- `Order` (1) --- (N) `OrderItem`
- ※価格、在庫数、注文ステータスの型定義はPrisma Schemaに準拠する。

## 4. Business Logic Rules
実装上の迷いが生じた場合、以下の優先順位で判断すること。
1. **在庫整合性:** 決済処理はトランザクションで保護し、オーバーセルを絶対に防ぐこと。
2. **価格計算の集約:** 全ての計算ロジック（税込、送料、割引）はBackendのService層に集約し、Frontendは取得した値の表示のみを行う。
3. **セキュリティ:** S3への直接アクセスを禁じ、Presigned URLを使用する。GraphQLのResolverには必ず権限ガード（Guards）を実装する。
4. **型安全性:** BackendのDTO、GraphQL Schema、Frontendの型定義を完全に一致させること。

## 5. Interaction Protocol (AI Instructions)
- **推測の禁止:** 仕様書に記載のないEpicやルール（例：ポイント機能、返品フロー等）を自己判断で実装してはならない。
- **不備の指摘:** Epic間で論理的矛盾（例：在庫がないのにカートに入れられる等）を発見した場合は、実装を停止しユーザーに確認すること。
- **生成プロセス:** 常に「1. Prisma Schemaの定義」→「2. GraphQL Schemaの生成」→「3. Logicの実装」の順序を守ること。

> **運用のポイント**
> * **Epicの追加:** もし「クーポン機能」や「レビュー機能」を追加したくなったら、このSSOTの`1. Project Overview & Epics`に追記してからAIに渡してください。
> * **技術スタックの固定:** `2. Technical Stack`に「UIライブラリはShadcn/uiを使う」などの詳細を書き足すと、デザインの一貫性がさらに高まります。
> * **詳細を語りすぎないこと:** 200行を超えないようにする。
> * **AIにとっての意味:** 憲法のようなものとして記述する。



# ユーザーストーリーの書き方

## 📝 Summary
[注文履歴一覧機能]：ユーザーがログインし、マイページから過去の注文一覧を確認できる

## 👤 User Story

**As a** 会員ユーザー

**I want to** マイページで過去の注文履歴を一覧表示したい

**So that** 自分がいつ何を注文したかを把握できる

## ✅ Acceptance Criteria (AC)
- [ ] `GET /graphql` (Query: `myOrders`) を作成し、ログイン中のユーザーの注文のみを返すこと。
- [ ] 注文一覧は `createdAt` の降順（新しい順）でソートされていること。
- [ ] フロントエンドでは、各注文の「注文日」「合計金額」「現在のステータス」を表示すること。
- [ ] 注文が存在しない場合は「まだ注文はありません」という空状態のUIを表示すること。

## 🛠 Technical Notes (Reference to SSOT)
- Auth: NestJSの `@UseGuards(JwtAuthGuard)` を使用。
- DB: Prismaの `order` モデルを使用。
- UI: Next.js の Server Components でデータをフェッチする。

## 🔗 Relations
- Depends on: #10 (Database Schema Design)

> **運用のポイント**
> - 今AIが集中すべき作業について過不足なく記載する
> - 必要と思える場合は `Summary` に親となる `Epic` を記載する
> - `User Story`は誤解しようのない機能を1つ記述する
> - `Acceptance Criteria` は「Done」と認めるための確認事項や禁止事項について記載し、曖昧さを可能な限り排除する
> - 事前確認が必要なものは、直接プロンプトに記載して会話する。または、スキーマ更新前後でタスクを分ける
> - ユーザーストーリーは実装を終えた時点で「完了」としてマークし、AIが勝手に読み込まないようにする