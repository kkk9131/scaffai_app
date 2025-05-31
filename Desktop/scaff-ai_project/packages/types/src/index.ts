// 基本的な型定義
export interface Point {
  x: number
  y: number
}

export interface Dimensions {
  width: number
  height: number
}

// 建物データの型定義
export interface Wall {
  id: string
  name: string
  length: number // メートル
  height: number // メートル
  nokideDistance: number // 軒の出距離（ミリメートル）
}

export interface BuildingData {
  walls: Wall[]
  totalArea: number // 平方メートル
  perimeter: number // メートル
}

// 足場計算結果の型定義
export interface Material {
  name: string
  quantity: number
  unit: string
}

export interface CalculationResult {
  scaffoldingArea: number // 足場面積（平方メートル）
  materials: Material[]
  totalCost: number // 総コスト（円）
  workDays: number // 作業日数
}

// プロジェクトの型定義
export interface Project {
  id: string
  name: string
  description: string
  buildingData?: BuildingData
  calculationResult?: CalculationResult
  createdAt: Date
  updatedAt: Date
}

// 認証関連の型定義
export interface User {
  id: string
  email: string
  displayName?: string
  companyName?: string
}

// 描画関連の型定義
export interface DrawingElement {
  id: string
  type: 'line' | 'rectangle' | 'circle' | 'text'
  position: Point
  properties: Record<string, any>
}

export interface DrawingState {
  elements: DrawingElement[]
  selectedElementId?: string
  tool: 'select' | 'line' | 'rectangle' | 'circle' | 'text'
  zoom: number
  pan: Point
}

// 計算設定の型定義
export interface CalculationSettings {
  preferredSpan: number // 優先スパン（1800mm）
  standardHeight: number // 標準高さ
  safetyFactor: number // 安全率
  materialPrices: Record<string, number> // 材料単価
}

// エラーハンドリング
export interface APIError {
  code: string
  message: string
  details?: any
}

export interface APIResponse<T> {
  data?: T
  error?: APIError
  success: boolean
}