# ScaffAI プロジェクト移行計画

## 移行概要

既存の2つのプロジェクトを統合し、Turborepoモノレポ構成に移行します。

### 現在の構成
- `scaffai-app/` - Expo + React Native (モバイル) + Python Backend
- `web_ui/` - Vite + React (Web UI)

### 目標構成
```
scaffai-unified/
├── apps/
│   ├── web/          # web_ui → apps/web (Vite→Next.js)
│   └── mobile/       # scaffai-app → apps/mobile (Expo 53)
├── packages/
│   ├── ui/           # 共通UIコンポーネント
│   ├── types/        # 共通型定義
│   ├── scaffold-engine/  # 足場計算ロジック (Python→TypeScript)
│   ├── utils/        # 共通ユーティリティ
│   └── database/     # Supabase統合
└── tools/           # 開発ツール・スクリプト
```

## 移行戦略

### Phase 1: 基盤構築 (2-3日)
1. **Turborepoセットアップ**
   - ルートpackage.json・turbo.json作成
   - pnpm workspace設定
   - TypeScript設定統一

2. **共通パッケージ作成**
   - `packages/types` - 型定義統合
   - `packages/utils` - 共通ユーティリティ
   - `packages/database` - Supabase統合

### Phase 2: モバイルアプリ移行 (1-2日)
1. **apps/mobile作成**
   - `scaffai-app/` → `apps/mobile/`
   - Expo 53アップグレード
   - 共通パッケージ統合

2. **依存関係整理**
   - react-native-purchases統合
   - Supabase認証統合

### Phase 3: Webアプリ移行 (1-2日)
1. **apps/web作成**
   - `web_ui/` → `apps/web/`
   - Vite設定最適化
   - 共通パッケージ統合

2. **機能統合**
   - Konva.js図面エディタ
   - プロジェクト管理機能

### Phase 4: バックエンド統合 (2-3日)
1. **Python→TypeScript移行**
   - 足場計算ロジック移植
   - `packages/scaffold-engine`作成

2. **Supabase完全移行**
   - データベース設計
   - RLS設定
   - リアルタイム同期

## 技術的決定事項

### モノレポ管理
- **ツール**: Turborepo + pnpm
- **理由**: 高速ビルド、効率的キャッシング

### 認証・データベース
- **採用**: Supabase
- **理由**: PostgreSQL + Auth + Storage統合

### 決済システム
- **採用**: RevenueCat
- **理由**: iOS/Android IAP統合、Webhook対応

### 状態管理
- **Web**: Zustand
- **Mobile**: React Context + AsyncStorage

## リスク評価

### 高リスク
1. **Python→TypeScript移行**
   - 影響: 足場計算の精度
   - 対策: 段階的移行、テスト強化

2. **データベース設計**
   - 影響: 全体アーキテクチャ
   - 対策: 初期設計の徹底検討

### 中リスク
1. **Expo SDK アップグレード**
   - 影響: モバイルアプリの安定性
   - 対策: 段階的アップデート

## スケジュール

| 週 | タスク | 成果物 |
|----|--------|--------|
| W1 | 基盤構築・共通パッケージ | Turborepo設定完了 |
| W2 | モバイル・Web移行 | アプリ移行完了 |
| W3 | バックエンド統合・テスト | 統合テスト完了 |

## 移行後の利点

1. **開発効率向上**
   - 共通コード再利用
   - 統一された開発環境

2. **保守性向上**
   - 単一リポジトリ管理
   - 依存関係の透明性

3. **スケーラビリティ**
   - 新機能の迅速な追加
   - チーム開発の効率化