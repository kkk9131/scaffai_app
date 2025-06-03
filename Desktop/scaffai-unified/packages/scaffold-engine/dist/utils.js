"use strict";
// scaffold-engine/src/utils.ts
// Core utility functions for scaffold calculations
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseWidth = baseWidth;
exports.adjustLength = adjustLength;
exports.selectParts = selectParts;
exports.totalSpan = totalSpan;
exports.formatSpanParts = formatSpanParts;
const constants_1 = require("./constants");
/**
 * Calculate base width by removing remainder from standard part size
 */
function baseWidth(width, unit = constants_1.STANDARD_PART_SIZE) {
    return width - (width % unit);
}
/**
 * Adjust length based on width, eaves, and margin
 */
function adjustLength(width, eaves, margin = constants_1.EAVES_MARGIN_THRESHOLD_ADDITION) {
    const reminder = width % constants_1.STANDARD_PART_SIZE;
    const sideSpace = (eaves + margin) * 2;
    return reminder + sideSpace;
}
/**
 * Generate all combinations of array elements with repetition
 */
function* combinations(arr, count) {
    if (count === 0) {
        yield [];
        return;
    }
    for (let i = 0; i < arr.length; i++) {
        for (const combo of combinations(arr, count - 1)) {
            yield [arr[i], ...combo];
        }
    }
}
/**
 * Select optimal parts combination for target length
 * Finds the smallest total that meets or exceeds target length
 */
function selectParts(targetLength, partsOptions = constants_1.NORMAL_PARTS, maxItems = 4) {
    let best = null;
    for (let rCount = 1; rCount <= maxItems; rCount++) {
        for (const combo of combinations([...partsOptions], rCount)) {
            const total = combo.reduce((sum, part) => sum + part, 0);
            if (total >= targetLength) {
                if (best === null ||
                    total < best.reduce((sum, part) => sum + part, 0) ||
                    (total === best.reduce((sum, part) => sum + part, 0) &&
                        combo.filter(p => p === constants_1.STANDARD_PART_SIZE).length >
                            best.filter(p => p === constants_1.STANDARD_PART_SIZE).length)) {
                    best = [...combo];
                }
            }
        }
    }
    return best || [];
}
/**
 * Calculate total span from base and adjustment parts
 */
function totalSpan(base, adjustPartsList) {
    return base + adjustPartsList.reduce((sum, part) => sum + part, 0);
}
/**
 * Format span parts into display string
 */
function formatSpanParts(partsToFormat) {
    const count = new Map();
    // Count occurrences of each part
    for (const part of partsToFormat) {
        count.set(part, (count.get(part) || 0) + 1);
    }
    const result = [];
    // Handle standard parts first
    if (count.has(constants_1.STANDARD_PART_SIZE)) {
        const standardCount = count.get(constants_1.STANDARD_PART_SIZE);
        result.push(`${standardCount}span`);
        count.delete(constants_1.STANDARD_PART_SIZE);
    }
    // Add remaining parts in descending order
    const sortedParts = Array.from(count.entries())
        .sort(([a], [b]) => b - a)
        .flatMap(([part, partCount]) => Array(partCount).fill(part));
    result.push(...sortedParts.map(String));
    return result.join(", ");
}
//# sourceMappingURL=utils.js.map