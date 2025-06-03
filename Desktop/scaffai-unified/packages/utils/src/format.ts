// フォーマット関連ユーティリティ

export function formatNumber(value: number, decimals: number = 0): string {
  return value.toFixed(decimals);
}

export function formatCurrency(value: number): string {
  return `¥${value.toLocaleString()}`;
}