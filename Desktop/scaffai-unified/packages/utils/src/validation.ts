// バリデーション関連ユーティリティ

export function isValidNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

export function isPositiveNumber(value: any): boolean {
  return isValidNumber(value) && value > 0;
}