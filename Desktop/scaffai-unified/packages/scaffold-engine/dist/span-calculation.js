"use strict";
// scaffold-engine/src/span-calculation.ts
// Complex span calculation with boundary constraints
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSpanWithBoundaries = calculateSpanWithBoundaries;
const constants_1 = require("./constants");
const utils_1 = require("./utils");
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
 * Calculate optimal span configuration with boundary constraints
 * This is the core algorithm for scaffold span optimization
 */
function calculateSpanWithBoundaries(width, eaves, mandatorySpecialParts, availableNormalPartsList, leftBoundary = null, rightBoundary = null, targetMargin = constants_1.DEFAULT_TARGET_MARGIN, debugPrints = false) {
    const base = (0, utils_1.baseWidth)(width);
    const sumOfMandatorySpecial = mandatorySpecialParts.reduce((sum, part) => sum + part, 0);
    // Calculate maximum allowed margins
    let maxAllowedL = leftBoundary !== null ? leftBoundary - constants_1.BOUNDARY_OFFSET : Number.POSITIVE_INFINITY;
    let maxAllowedR = rightBoundary !== null ? rightBoundary - constants_1.BOUNDARY_OFFSET : Number.POSITIVE_INFINITY;
    if (maxAllowedL < 0)
        maxAllowedL = 0;
    if (maxAllowedR < 0)
        maxAllowedR = 0;
    const effectiveTargetL = Math.min(targetMargin, maxAllowedL);
    const effectiveTargetR = Math.min(targetMargin, maxAllowedR);
    const idealTargetTotalSpan = width + effectiveTargetL + effectiveTargetR;
    const absoluteMaxTotalSpan = width + maxAllowedL + maxAllowedR;
    if (debugPrints) {
        console.log(`[DEBUG CSB_Revised] ideal_target_total_span=${idealTargetTotalSpan}, absolute_max_total_span=${absoluteMaxTotalSpan}`);
        console.log(`[DEBUG CSB_Revised] mandatory_special_parts=${mandatorySpecialParts}, sum_mandatory_special=${sumOfMandatorySpecial}`);
    }
    // Calculate target sum for normal parts
    const targetSumForNormalPartsIdeal = idealTargetTotalSpan - base - sumOfMandatorySpecial;
    if (debugPrints) {
        console.log(`[DEBUG CSB_Revised] target_sum_for_normal_parts (ideal)=${targetSumForNormalPartsIdeal}`);
    }
    // Minimum normal parts sum needed for building coverage
    let minSumNormalForWidthCoverage = width - base - sumOfMandatorySpecial;
    if (minSumNormalForWidthCoverage < 0)
        minSumNormalForWidthCoverage = 0;
    let bestComboNormalParts = [];
    let minAbsDiffToTargetSumNormal = Number.POSITIVE_INFINITY;
    // Maximum sum for normal parts (absolute constraint)
    let maxSumForNormalPartsAbsolute = absoluteMaxTotalSpan - base - sumOfMandatorySpecial;
    if (maxSumForNormalPartsAbsolute < 0)
        maxSumForNormalPartsAbsolute = 0;
    // Search for optimal normal parts combination (0 to 4 parts)
    for (let rCount = 0; rCount <= 4; rCount++) {
        for (const comboNormal of combinations([...availableNormalPartsList], rCount)) {
            const currentSumNormal = comboNormal.reduce((sum, part) => sum + part, 0);
            // Condition 1: Normal parts sum must meet minimum width coverage requirement
            if (currentSumNormal < minSumNormalForWidthCoverage) {
                continue;
            }
            // Condition 2: Normal parts sum must not exceed absolute maximum
            if (currentSumNormal > maxSumForNormalPartsAbsolute) {
                continue;
            }
            // Evaluate by closeness to ideal target
            const diff = Math.abs(currentSumNormal - targetSumForNormalPartsIdeal);
            if (diff < minAbsDiffToTargetSumNormal) {
                minAbsDiffToTargetSumNormal = diff;
                bestComboNormalParts = [...comboNormal];
            }
            else if (diff === minAbsDiffToTargetSumNormal) {
                // Prefer combinations with fewer parts or more standard parts
                if (comboNormal.length < bestComboNormalParts.length ||
                    (comboNormal.length === bestComboNormalParts.length &&
                        comboNormal.filter(p => p === constants_1.STANDARD_PART_SIZE).length >
                            bestComboNormalParts.filter(p => p === constants_1.STANDARD_PART_SIZE).length)) {
                    bestComboNormalParts = [...comboNormal];
                }
            }
        }
    }
    // Final parts configuration and total span
    const finalParts = [...mandatorySpecialParts, ...bestComboNormalParts].sort((a, b) => b - a);
    const finalTotalSpan = base + finalParts.reduce((sum, part) => sum + part, 0);
    // Fallback: if no combination found and minimum coverage is needed
    if (bestComboNormalParts.length === 0 && minSumNormalForWidthCoverage > 0) {
        if (debugPrints) {
            console.log(`[DEBUG CSB_Revised] Fallback: trying to find minimal normal parts for width coverage target ${minSumNormalForWidthCoverage}`);
        }
        // Simple fallback: use smallest parts that meet requirement
        const fallbackNormalParts = [];
        let remainingCoverage = minSumNormalForWidthCoverage;
        const sortedParts = [...availableNormalPartsList].sort((a, b) => a - b);
        for (const part of sortedParts) {
            while (remainingCoverage > 0 && fallbackNormalParts.length < 4) {
                fallbackNormalParts.push(part);
                remainingCoverage -= part;
            }
            if (remainingCoverage <= 0)
                break;
        }
        if (fallbackNormalParts.length > 0) {
            const fallbackSum = fallbackNormalParts.reduce((sum, part) => sum + part, 0);
            if (base + sumOfMandatorySpecial + fallbackSum <= absoluteMaxTotalSpan) {
                bestComboNormalParts = fallbackNormalParts;
                finalParts.length = 0;
                finalParts.push(...mandatorySpecialParts, ...bestComboNormalParts);
                finalParts.sort((a, b) => b - a);
                if (debugPrints) {
                    console.log(`[DEBUG CSB_Revised] Fallback selected normal parts: ${bestComboNormalParts}`);
                }
            }
        }
    }
    const finalTotalSpanCalculated = base + finalParts.reduce((sum, part) => sum + part, 0);
    if (debugPrints) {
        console.log(`[DEBUG CSB_Revised] Selected: base=${base}, final_parts=${finalParts}, final_total_span=${finalTotalSpanCalculated}`);
    }
    return {
        base,
        parts: finalParts,
        totalSpan: finalTotalSpanCalculated
    };
}
//# sourceMappingURL=span-calculation.js.map