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
   - 共有設定（ESLint・Prettier・TypeScript）

2. **Packages構築**
   - `packages/types/` - 共通型定義
   - `packages/utils/` - 共通ユーティリティ
   - `packages/ui/` - 基本UIコンポーネント

### Phase 2: コア移行 (3-4日)
1. **足場計算エンジン移行**
   - `scaffai-app/backend/core/calc_span.py` → `packages/scaffold-engine/`
   - Python → TypeScript 変換
   - 型安全性確保・テスト追加

2. **モバイルアプリ移行**
   - `scaffai-app/` → `apps/mobile/`
   - 共有パッケージ利用に変更
   - Context → 共有状態管理

### Phase 3: Web統合 (2-3日)
1. **Web UI移行**
   - `web_ui/` → `apps/web/`
   - Vite → Next.js 15 変換
   - 共有コンポーネント利用

2. **状態管理統合**
   - Zustand → 共有状態管理
   - API層統合

### Phase 4: 最適化 (1-2日)
1. **パフォーマンス最適化**
   - Tree shaking最適化
   - ビルド時間短縮

2. **テスト・CI/CD**
   - 統合テスト
   - GitHub Actions

## 詳細移行手順

### 1. 共有可能なコード特定

#### 足場計算ロジック
**移行対象**: `scaffai-app/backend/core/calc_span.py`
- 複雑な足場計算アルゴリズム (460行)
- 定数定義・ヘルパー関数
- **移行先**: `packages/scaffold-engine/`

#### 型定義
**抽出対象**:
- `scaffai-app/context/ScaffoldContext.tsx` の型定義
- `web_ui/store/projectStore.ts` のProject型
- **移行先**: `packages/types/`

#### UIコンポーネント
**共通化対象**:
- フォーム関連 (InputField, RadioField, SwitchField)
- レイアウト (Header, Sidebar)
- **移行先**: `packages/ui/`

### 2. パッケージ依存関係分析

#### scaffai-app の主要依存関係
```json
{
  "expo": "~53.0.0",
  "react-native": "0.79.1",
  "@supabase/supabase-js": "^2.39.7",
  "tailwindcss": "^3.4.1",
  "zod": "^3.22.4"
}
```

#### web_ui の主要依存関係
```json
{
  "react": "^18.3.1",
  "vite": "^5.4.2",
  "konva": "^9.3.6",
  "react-konva": "^18.2.10",
  "zustand": "^4.5.2"
}
```

#### 共通依存関係
- React 18
- TailwindCSS
- TypeScript

### 3. 段階的移行プロセス

#### Step 1: Turborepoセットアップ
```bash
# ルートpackage.json作成
pnpm init

# Turborepo追加
pnpm add -D turbo

# ワークスペース設定
# pnpm-workspace.yaml作成
```

#### Step 2: 共有パッケージ作成
```bash
# packages/types
mkdir -p packages/types/src
cd packages/types && pnpm init

# packages/utils
mkdir -p packages/utils/src
cd packages/utils && pnpm init

# packages/ui
mkdir -p packages/ui/src
cd packages/ui && pnpm init
```

#### Step 3: 足場計算エンジン移行
```typescript
// packages/scaffold-engine/src/calculator.ts
export class ScaffoldCalculator {
  static calculateSpan(params: CalculationParams): CalculationResult {
    // Python calc_span.py のロジックを TypeScript に変換
  }
}
```

#### Step 4: モバイルアプリ移行
```bash
# 既存コードを apps/mobile にコピー
cp -r scaffai-app/frontend/UI apps/mobile

# 共有パッケージに依存を変更
# package.json の dependencies 更新
```

#### Step 5: Web UI移行
```bash
# Vite → Next.js 変換
# 既存 src/ 構造を Next.js App Router に対応
```

### 4. 技術的考慮事項

#### 足場計算ロジックの TypeScript 変換
```python
# Python (元)
def calculate_span_with_boundaries(width, eaves, mandatory_special_parts...):
    # 複雑な計算ロジック
    return base, parts, total_span
```

```typescript
// TypeScript (変換後)
export function calculateSpanWithBoundaries(
  params: SpanCalculationParams
): SpanCalculationResult {
  // 型安全な実装
  return { base, parts, totalSpan };
}
```

#### 状態管理統合
```typescript
// packages/types/src/scaffold.ts
export interface ScaffoldState {
  inputData: InputData;
  calculationResult: CalculationResult | null;
  projects: Project[];
}

// packages/utils/src/state.ts
export const useScaffoldStore = create<ScaffoldState>(...);
```

#### API統合
```typescript
// packages/utils/src/api.ts
export class ScaffoldAPI {
  static async calculate(params: CalculationParams) {
    // 統一されたAPI呼び出し
  }
}
```

### 5. 並列開発可能なタスク

#### 並列開発提案

**チーム A: Backend & Engine**
- 足場計算エンジンのTypeScript変換
- 共通型定義の策定
- API統合層の実装

**チーム B: Frontend & UI**
- 共通UIコンポーネントの抽出
- モバイルアプリの移行
- Web UIのNext.js変換

**チーム C: Infrastructure**
- Turborepoセットアップ
- CI/CD構築
- テスト環境整備

### 6. リスク管理

#### 主要リスク
1. **計算ロジック変換**: Python → TypeScript で精度低下
2. **状態管理**: 異なる状態管理ライブラリの統合
3. **ビルド時間**: モノレポ化でビルド時間増加

#### 対策
1. **計算精度**: 詳細なテストケースで検証
2. **段階的移行**: 既存機能を段階的に移行
3. **キャッシュ最適化**: Turborepoキャッシュ活用

### 7. 成功指標

#### 技術指標
- ビルド時間: 全体 < 5分
- テストカバレッジ: > 80%
- 型安全性: TypeScript strict mode

#### 開発効率
- 共有コード再利用率: > 60%
- 新機能開発速度: 2倍向上
- バグ修正時間: 50%短縮

### 8. 移行後の恩恵

#### 開発効率
- **コード重複解消**: 足場計算ロジックの一元化
- **型安全性**: 全体を通した型の一貫性
- **ホットリロード**: 変更の即座反映

#### 保守性
- **一元管理**: 依存関係・設定の統一
- **テスト統合**: 統一されたテスト戦略
- **デプロイ**: 一括デプロイメント

#### 拡張性
- **新プラットフォーム**: 容易な追加
- **機能追加**: 共有ロジックの活用
- **パフォーマンス**: Tree shaking最適化

## 次のステップ

1. **Phase 1開始**: Turborepoセットアップ
2. **並列開発チーム編成**: 責任分担明確化
3. **マイルストーン設定**: 週次進捗確認

この移行計画により、効率的で保守性の高い統合プラットフォームを構築できます。