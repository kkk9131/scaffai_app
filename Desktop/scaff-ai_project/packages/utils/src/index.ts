// 足場計算ユーティリティ
export class ScaffoldCalculator {
  private readonly PREFERRED_SPAN = 1800 // 1800mm優先スパン

  // 基本的な足場面積計算
  calculateScaffoldArea(perimeter: number, height: number, nokideDistance: number = 600): number {
    // 軒の出を考慮した周囲長
    const adjustedPerimeter = perimeter + (nokideDistance * 4) / 1000 // mm to m
    return adjustedPerimeter * height
  }

  // 必要な単管数計算
  calculatePipeQuantity(scaffoldArea: number): number {
    // 1平方メートルあたり約1.2本の単管が必要
    return Math.ceil(scaffoldArea * 1.2)
  }

  // 必要なクランプ数計算
  calculateClampQuantity(pipeQuantity: number): number {
    // 単管1本あたり約2.5個のクランプが必要
    return Math.ceil(pipeQuantity * 2.5)
  }

  // 足場板数計算
  calculateBoardQuantity(scaffoldArea: number): number {
    // 1平方メートルあたり約0.8枚の足場板が必要
    return Math.ceil(scaffoldArea * 0.8)
  }

  // 総コスト計算
  calculateTotalCost(materials: { name: string; quantity: number; unitPrice: number }[]): number {
    return materials.reduce((total, material) => {
      return total + (material.quantity * material.unitPrice)
    }, 0)
  }

  // 作業日数計算
  calculateWorkDays(scaffoldArea: number, workersPerDay: number = 2): number {
    // 1日あたり1人約20平方メートルの設置が可能
    const dailyCapacity = workersPerDay * 20
    return Math.ceil(scaffoldArea / dailyCapacity)
  }
}

// 単位変換ユーティリティ
export class UnitConverter {
  // ミリメートルからメートルへ
  static mmToM(mm: number): number {
    return mm / 1000
  }

  // メートルからミリメートルへ
  static mToMm(m: number): number {
    return m * 1000
  }

  // 平方メートルから坪へ
  static sqmToTsubo(sqm: number): number {
    return sqm / 3.305785
  }

  // 坪から平方メートルへ
  static tsuboToSqm(tsubo: number): number {
    return tsubo * 3.305785
  }
}

// バリデーションユーティリティ
export class ValidationUtils {
  // 正の数値チェック
  static isPositiveNumber(value: any): boolean {
    return typeof value === 'number' && value > 0
  }

  // メールアドレス形式チェック
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // 必須フィールドチェック
  static isRequired(value: any): boolean {
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim().length > 0
    return true
  }

  // 長さ制限チェック
  static isWithinLength(value: string, maxLength: number): boolean {
    return value.length <= maxLength
  }
}

// 日付ユーティリティ
export class DateUtils {
  // 日本の日付形式にフォーマット
  static formatJapaneseDate(date: Date): string {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date)
  }

  // 相対時間表示
  static getRelativeTime(date: Date): string {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}日前`
    if (hours > 0) return `${hours}時間前`
    if (minutes > 0) return `${minutes}分前`
    return '今さっき'
  }
}

// ファイルユーティリティ
export class FileUtils {
  // ファイルサイズを人間が読みやすい形式に変換
  static formatFileSize(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 B'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`
  }

  // ファイル拡張子取得
  static getFileExtension(filename: string): string {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
  }

  // MIME typeチェック
  static isImageFile(mimeType: string): boolean {
    return mimeType.startsWith('image/')
  }

  static isPDFFile(mimeType: string): boolean {
    return mimeType === 'application/pdf'
  }
}