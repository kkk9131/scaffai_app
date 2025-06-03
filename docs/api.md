# ScaffAI API 仕様

## 概要

ScaffAI の API は Supabase をベースとした RESTful API です。
認証には JWT トークンを使用し、リアルタイム機能を提供します。

## 認証

### ログイン
```typescript
POST /auth/v1/token
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}

// レスポンス
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "user_metadata": {}
  }
}
```

### ユーザー登録
```typescript
POST /auth/v1/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password",
  "data": {
    "full_name": "山田太郎"
  }
}
```

## プロジェクト管理

### プロジェクト一覧取得
```typescript
GET /rest/v1/projects
Authorization: Bearer <access_token>

// レスポンス
[
  {
    "id": "uuid",
    "name": "プロジェクト1",
    "description": "説明",
    "owner_id": "uuid",
    "site_address": "東京都渋谷区...",
    "status": "draft",
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
]
```

### プロジェクト作成
```typescript
POST /rest/v1/projects
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "新規プロジェクト",
  "description": "プロジェクトの説明",
  "site_address": "東京都渋谷区1-1-1"
}
```

### プロジェクト詳細取得
```typescript
GET /rest/v1/projects?id=eq.{project_id}&select=*,drawings(*),conditions(*),calculations(*)
Authorization: Bearer <access_token>

// レスポンス
{
  "id": "uuid",
  "name": "プロジェクト1",
  "drawings": [
    {
      "id": "uuid",
      "name": "図面1",
      "svg_blob": "<svg>...</svg>",
      "scale": 1.0
    }
  ],
  "conditions": {
    "eave_depths": [600, 800],
    "boundaries": {"left": 1000, "right": 1000},
    "roof_type": "flat"
  },
  "calculations": [
    {
      "id": "uuid",
      "result_json": {...},
      "cost": 150000
    }
  ]
}
```

## 足場計算

### 計算実行
```typescript
POST /rest/v1/calculations
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "project_id": "uuid",
  "algo_version": "1.0",
  "result_json": {
    "building_length": 12000,
    "building_width": 8000,
    "eave_depth": 600,
    "boundaries": {
      "left": 1000,
      "right": 1000,
      "front": 800,
      "back": 1200
    },
    "special_materials": ["355"],
    "calculation_result": {
      "spans": 7,
      "levels": 3,
      "total_length": 14000,
      "total_width": 10000,
      "materials": [
        {
          "name": "建枠",
          "specification": "1800×1219",
          "quantity": 42,
          "unit_price": 1200,
          "total_price": 50400
        }
      ]
    }
  },
  "cost": 150000
}
```

## サブスクリプション

### 現在のサブスクリプション取得
```typescript
GET /rest/v1/rpc/get_user_subscription
Authorization: Bearer <access_token>

// レスポンス
{
  "subscription_id": "uuid",
  "plan_type": "pro",
  "status": "active",
  "expires_at": "2025-12-31T23:59:59Z",
  "is_trial": false,
  "is_active": true
}
```

### サブスクリプション履歴
```typescript
GET /rest/v1/subscriptions
Authorization: Bearer <access_token>

// レスポンス
[
  {
    "id": "uuid",
    "plan_type": "pro",
    "status": "active",
    "starts_at": "2025-01-01T00:00:00Z",
    "expires_at": "2025-12-31T23:59:59Z",
    "price_cents": 298000,
    "currency": "JPY",
    "platform": "ios"
  }
]
```

## リアルタイム機能

### プロジェクト変更監視
```typescript
import { supabase } from './supabase'

const subscription = supabase
  .channel('project-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'projects',
      filter: `owner_id=eq.${userId}`
    },
    (payload) => {
      console.log('プロジェクト変更:', payload)
    }
  )
  .subscribe()

// 購読解除
subscription.unsubscribe()
```

### 計算進捗監視
```typescript
const subscription = supabase
  .channel('calculation-progress')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'calculations',
      filter: `project_id=eq.${projectId}`
    },
    (payload) => {
      console.log('計算完了:', payload.new)
    }
  )
  .subscribe()
```

## エラーハンドリング

### エラーレスポンス形式
```typescript
{
  "error": {
    "code": "PGRST301",
    "message": "Forbidden",
    "details": "Row level security policy violation",
    "hint": null
  }
}
```

### 一般的なエラーコード
- `PGRST301` - 認証エラー
- `PGRST116` - リソースが見つからない
- `PGRST202` - バリデーションエラー
- `PGRST204` - 権限エラー

## レート制限

- **認証エンドポイント**: 60リクエスト/分
- **一般API**: 1000リクエスト/分
- **リアルタイム接続**: 100接続/ユーザー

## SDK 使用例

### TypeScript/JavaScript
```typescript
import { 
  authService, 
  projectService, 
  subscriptionService 
} from '@scaffai/database'

// ログイン
const { data, error } = await authService.signIn(
  'user@example.com', 
  'password'
)

// プロジェクト作成
const project = await projectService.createProject({
  name: '新規プロジェクト',
  description: 'テストプロジェクト'
})

// 計算実行
const calculation = await projectService.createCalculation({
  project_id: project.id,
  algo_version: '1.0',
  result_json: calculationData
})
```

### React Native
```typescript
import { revenueCatService } from '@scaffai/mobile/lib/revenuecat'

// RevenueCat初期化
await revenueCatService.initialize()

// ユーザー識別
await revenueCatService.identifyUser(user.id)

// サブスクリプション購入
const offering = await revenueCatService.getCurrentOffering()
if (offering?.availablePackages[0]) {
  const result = await revenueCatService.purchasePackage(
    offering.availablePackages[0]
  )
}
```