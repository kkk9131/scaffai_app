// 日付関連ユーティリティ

export function formatDate(date: Date): string {
  return date.toLocaleDateString('ja-JP');
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString('ja-JP');
}