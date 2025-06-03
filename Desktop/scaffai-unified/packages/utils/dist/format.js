// フォーマット関連ユーティリティ
export function formatNumber(value, decimals = 0) {
    return value.toFixed(decimals);
}
export function formatCurrency(value) {
    return `¥${value.toLocaleString()}`;
}
