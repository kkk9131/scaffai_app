"use strict";
// scaffold-engine/src/margins.ts
// Margin calculation functions
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateInitialMargins = calculateInitialMargins;
const constants_1 = require("./constants");
/**
 * Calculate initial margins with boundary constraints
 */
function calculateInitialMargins(currentTotalSpan, width, leftBoundaryVal, rightBoundaryVal, targetMarginVal = constants_1.DEFAULT_TARGET_MARGIN, eavesLeftForThreshold = 0, eavesRightForThreshold = 0, debugPrints = false) {
    if (debugPrints) {
        console.log(`[DEBUG] calculateInitialMargins: total_span=${currentTotalSpan}, width=${width}, L_b=${leftBoundaryVal}, R_b=${rightBoundaryVal}, target=${targetMarginVal}`);
    }
    let availableMarginTotal = currentTotalSpan - width;
    if (availableMarginTotal < 0)
        availableMarginTotal = 0;
    if (debugPrints) {
        console.log(`[DEBUG] calculateInitialMargins: available_margin_total=${availableMarginTotal}`);
    }
    let leftGap = Math.floor(availableMarginTotal / 2);
    let rightGap = availableMarginTotal - leftGap;
    if (debugPrints) {
        console.log(`[DEBUG] calculateInitialMargins: initial L_gap=${leftGap}, R_gap=${rightGap}`);
    }
    // Handle case with no boundaries
    if (leftBoundaryVal === null && rightBoundaryVal === null) {
        const baseMarginHalf = Math.floor(availableMarginTotal / 2);
        if (baseMarginHalf <= targetMarginVal) {
            leftGap = baseMarginHalf;
            rightGap = baseMarginHalf;
        }
        else {
            leftGap = targetMarginVal;
            rightGap = targetMarginVal;
            const surplus = availableMarginTotal - (targetMarginVal * 2);
            if (surplus > 0) {
                leftGap += Math.floor(surplus / 2);
                rightGap += surplus - Math.floor(surplus / 2);
            }
        }
        if (debugPrints) {
            console.log(`[DEBUG] calculateInitialMargins (no boundary): final L_gap=${leftGap}, R_gap=${rightGap}`);
        }
        return { leftMargin: leftGap, rightMargin: rightGap };
    }
    // Calculate maximum allowed margins
    let maxAllowedLeft = leftBoundaryVal !== null ? leftBoundaryVal - constants_1.BOUNDARY_OFFSET : Number.POSITIVE_INFINITY;
    let maxAllowedRight = rightBoundaryVal !== null ? rightBoundaryVal - constants_1.BOUNDARY_OFFSET : Number.POSITIVE_INFINITY;
    if (maxAllowedLeft < 0)
        maxAllowedLeft = 0;
    if (maxAllowedRight < 0)
        maxAllowedRight = 0;
    if (debugPrints) {
        console.log(`[DEBUG] calculateInitialMargins: max_L_allow=${maxAllowedLeft}, max_R_allow=${maxAllowedRight}`);
    }
    // Apply initial constraints
    leftGap = Math.max(0, Math.min(leftGap, maxAllowedLeft));
    rightGap = Math.max(0, Math.min(rightGap, maxAllowedRight));
    if (debugPrints) {
        console.log(`[DEBUG] calculateInitialMargins (after initial clip): L_gap=${leftGap}, R_gap=${rightGap}`);
    }
    // Adjust if sum doesn't match available margin
    if (leftGap + rightGap !== availableMarginTotal) {
        if (debugPrints) {
            console.log(`[DEBUG] calculateInitialMargins: sum L+R (${leftGap + rightGap}) != available (${availableMarginTotal}), adjusting...`);
        }
        if (leftGap === maxAllowedLeft && leftBoundaryVal !== null) {
            rightGap = availableMarginTotal - leftGap;
        }
        else if (rightGap === maxAllowedRight && rightBoundaryVal !== null) {
            leftGap = availableMarginTotal - rightGap;
        }
        else {
            leftGap = Math.floor(availableMarginTotal / 2);
            rightGap = availableMarginTotal - leftGap;
            leftGap = Math.max(0, Math.min(leftGap, maxAllowedLeft));
            rightGap = Math.max(0, Math.min(rightGap, maxAllowedRight));
            if (leftGap + rightGap !== availableMarginTotal) {
                if (leftGap === maxAllowedLeft && leftBoundaryVal !== null) {
                    rightGap = availableMarginTotal - leftGap;
                }
                else {
                    leftGap = availableMarginTotal - rightGap;
                }
            }
        }
        if (debugPrints) {
            console.log(`[DEBUG] calculateInitialMargins: Re-adjusted to L_gap=${leftGap}, R_gap=${rightGap}`);
        }
    }
    // Final constraints
    leftGap = Math.max(0, Math.min(leftGap, maxAllowedLeft));
    rightGap = Math.max(0, Math.min(rightGap, maxAllowedRight));
    if (debugPrints) {
        console.log(`[DEBUG] calculateInitialMargins (final): L_gap=${leftGap}, R_gap=${rightGap}`);
    }
    return { leftMargin: leftGap, rightMargin: rightGap };
}
//# sourceMappingURL=margins.js.map