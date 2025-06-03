// バリデーション関連ユーティリティ
export function isValidNumber(value) {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
}
export function isPositiveNumber(value) {
    return isValidNumber(value) && value > 0;
}
