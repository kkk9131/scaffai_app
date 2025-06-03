# ScaffAI - 足場割付支援プラットフォーム

> 足場事業者向けの統合ワークフロー支援システム

## 🎯 プロジェクト概要

ScaffAIは、足場事業者が**最短5分**で自社案件の足場構成・見積・図面を作成できるWeb+モバイル統合アプリです。

### 主な特徴
- 🏗️ **自動足場計算**: 高度なアルゴリズムによる最適配置
- 📱 **クロスプラットフォーム**: Web + iOS/Android対応
- 💾 **リアルタイム同期**: 現場⇄事務所でシームレス連携
- 💳 **サブスクリプション**: RevenueCat統合決済システム
- 🔐 **セキュア**: Supabase + RLS完全対応

## 🏗️ アーキテクチャ

### Turborepo モノレポ構成
```
scaffai-unified/
├── apps/
│   ├── mobile/          # Expo 53 + React Native
│   └── web/             # Next.js 15 + React
├── packages/
│   ├── database/        # Supabase クライアント
│   ├── types/           # 共通型定義
│   ├── utils/           # ユーティリティ
│   └── scaffold-engine/ # 足場計算エンジン
└── docs/                # ドキュメント
```

### 技術スタック
- **Frontend**: React 19, Next.js 15, Expo 53
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Payment**: RevenueCat (iOS/Android IAP)
- **Build**: Turborepo + pnpm
- **Language**: TypeScript 5.8

## 🚀 クイックスタート

### 前提条件
- Node.js 18+
- pnpm 9+
- Expo CLI

### インストール
```bash
# リポジトリクローン
git clone https://github.com/kkk9131/scaffai_app.git
cd scaffai_app

# 依存関係インストール
pnpm install

# 環境変数設定
cp .env.example .env.local
# Supabase URLとキーを設定

# 開発サーバー起動
pnpm dev
```

### 各アプリの起動
```bash
# Web版 (localhost:3000)
pnpm dev:web

# Mobile版 (Expo)
pnpm dev:mobile

# 全体ビルド
pnpm build
```

## 📱 アプリ概要

### Mobile MVP機能
- ✅ 認証（メール・パスワード）
- ✅ サブスクリプション決済
- ✅ 足場計算エンジン
- ⏳ PDF出力・見積書
- ✅ プロジェクト保存・履歴

### Web版機能
- ✅ 図面作図（Konva.js）
- ⏳ 図面スキャン・ベクター化
- ⏳ 自動足場割付
- ⏳ CAD出力（DXF/SVG/PNG）
- ✅ プロジェクト管理

## 💳 課金システム

### プラン構成
| プラン | 月額 | 年額 | 機能 |
|--------|------|------|------|
| **Free** | ¥0 | - | 基本計算のみ |
| **Pro** | ¥2,980 | ¥29,800 | 全機能 + 図面出力 |
| **Enterprise** | ¥9,800 | ¥98,000 | 無制限 + API アクセス |

### 決済システム
- **Mobile**: RevenueCat (Apple/Google IAP)
- **Web**: Stripe (準備中)
- **同期**: Supabase Webhooks

## 🗄️ データベース

### 主要テーブル
- `users` - ユーザー情報・サブスクリプション状態
- `projects` - プロジェクト管理
- `drawings` - 図面データ（DXF/SVG）
- `conditions` - 足場条件設定
- `calculations` - 計算結果・部材リスト
- `subscriptions` - サブスクリプション詳細

### セキュリティ
- **RLS**: Row Level Security完全実装
- **認証**: Supabase Auth (JWT)
- **権限**: ユーザー単位データ分離

## 🧮 足場計算エンジン

### アルゴリズム
1. **基準割付**: 躯体長 ÷ 1800mm
2. **余長処理**: 軒の出 + 境界制約
3. **最適化**: 部材コスト・安全性考慮
4. **出力**: 部材リスト・段数・高さ

### 対応機能
- ✅ 基本割付計算
- ✅ 軒の出・境界制約
- ✅ 複雑な最適化ロジック
- ⏳ 入隅・屋根補正
- ⏳ AI提案機能

## 📄 API仕様

### 認証
```typescript
// ログイン
POST /auth/login
{
  "email": "user@example.com",
  "password": "password"
}

// レスポンス
{
  "access_token": "jwt_token",
  "user": { ... }
}
```

### 計算API
```typescript
// 足場計算実行
POST /api/calculate
{
  "building_length": 12000,
  "building_width": 8000,
  "eave_depth": 600,
  "boundaries": { ... }
}

// レスポンス
{
  "result": {
    "spans": 7,
    "levels": 3,
    "materials": [...],
    "total_cost": 150000
  }
}
```

## 🔧 開発・デプロイ

### 開発環境
```bash
# 型チェック
pnpm typecheck

# リント
pnpm lint

# テスト
pnpm test

# ビルド
pnpm build
```

### デプロイ
- **Web**: Vercel自動デプロイ
- **Mobile**: EAS Build + TestFlight/Play Store
- **Database**: Supabase管理

## 📋 ロードマップ

### Phase 1: Mobile MVP (3週間)
- [x] 認証・決済基盤
- [x] 足場計算エンジン
- [x] データ保存・履歴
- [ ] PDF出力機能

### Phase 2: Web版MVP (4週間)
- [x] 基盤構築
- [ ] 図面作図機能
- [ ] スキャン・自動割付
- [ ] CAD出力

### Phase 3: v1.0 (6週間)
- [ ] 高度な計算機能
- [ ] オフライン対応
- [ ] テスト自動化
- [ ] 本格運用開始

## 🤝 コントリビューション

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 ライセンス

This project is proprietary software. All rights reserved.

## 🔗 リンク

- [プロジェクト要件書](./docs/scaffai_requirements.md)
- [リリースロードマップ](./docs/roadmap.md)
- [マイグレーション計画](./docs/migration_plan.md)

---

**ScaffAI** - 足場業界のDXを加速する 🚀