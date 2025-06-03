"use strict";
// scaffold-engine/src/face-dimensions.ts
// Face dimension calculation with eaves and boundary constraints
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFaceDimensions = calculateFaceDimensions;
const constants_1 = require("./constants");
const margins_1 = require("./margins");
const span_calculation_1 = require("./span-calculation");
const utils_1 = require("./utils");
/**
 * Calculate face dimensions with comprehensive eaves and boundary handling
 * This is the main algorithm for determining scaffold layout for each building face
 */
function calculateFaceDimensions(widthVal, eavesLeftVal, eavesRightVal, boundaryLeftVal, boundaryRightVal, use150Val, use300Val, use355Val, partsMasterList, targetMarginVal = constants_1.DEFAULT_TARGET_MARGIN, faceName = "UnknownFace") {
    const debugPrints = true; // Enable debug prints for development
    if (debugPrints) {
        console.log(`\n--- Calculating for ${faceName} ---`);
        console.log(`[DEBUG ${faceName}] Inputs: width=${widthVal}, eaves_L=${eavesLeftVal}, eaves_R=${eavesRightVal}, bound_L=${boundaryLeftVal}, bound_R=${boundaryRightVal}, target_margin=${targetMarginVal}`);
    }
    const eavesForSpanCalc = Math.max(eavesLeftVal, eavesRightVal);
    // 1. Create mandatory special parts list from user specifications
    const mandatorySpecialParts = [];
    const specialPartSpecs = [
        { part: 150, count: use150Val },
        { part: 300, count: use300Val },
        { part: 355, count: use355Val }
    ];
    for (const { part, count } of specialPartSpecs) {
        for (let i = 0; i < count; i++) {
            mandatorySpecialParts.push(part);
        }
    }
    // 2. Calculate optimal span configuration using boundary constraints
    const { base: baseVal, parts: partsVal, totalSpan: totalVal } = (0, span_calculation_1.calculateSpanWithBoundaries)(widthVal, eavesForSpanCalc, mandatorySpecialParts, partsMasterList, boundaryLeftVal, boundaryRightVal, targetMarginVal, debugPrints);
    if (debugPrints) {
        console.log(`[DEBUG ${faceName}] calculate_span_with_boundaries returned: base=${baseVal}, parts=${partsVal}, total_span=${totalVal}`);
    }
    // 3. Calculate margin distribution based on final total span
    const { leftMargin: initialLeftMargin, rightMargin: initialRightMargin } = (0, margins_1.calculateInitialMargins)(totalVal, widthVal, boundaryLeftVal, boundaryRightVal, targetMarginVal, eavesLeftVal, eavesRightVal, debugPrints);
    if (debugPrints) {
        console.log(`[DEBUG ${faceName}] calculate_initial_margins returned: L_margin=${initialLeftMargin}, R_margin=${initialRightMargin}`);
    }
    // Calculate thresholds and constraints
    const thresholdLeft = eavesLeftVal + constants_1.EAVES_MARGIN_THRESHOLD_ADDITION;
    const thresholdRight = eavesRightVal + constants_1.EAVES_MARGIN_THRESHOLD_ADDITION;
    let currentTotalMarginSpace = totalVal - widthVal;
    if (currentTotalMarginSpace < 0)
        currentTotalMarginSpace = 0;
    let maxAllowedLeft = boundaryLeftVal !== null ? boundaryLeftVal - constants_1.BOUNDARY_OFFSET : Number.POSITIVE_INFINITY;
    let maxAllowedRight = boundaryRightVal !== null ? boundaryRightVal - constants_1.BOUNDARY_OFFSET : Number.POSITIVE_INFINITY;
    if (maxAllowedLeft < 0)
        maxAllowedLeft = 0;
    if (maxAllowedRight < 0)
        maxAllowedRight = 0;
    if (debugPrints) {
        console.log(`[DEBUG ${faceName}] thresholds: L=${thresholdLeft}, R=${thresholdRight} | max_allowed: L=${maxAllowedLeft}, R=${maxAllowedRight} | total_margin_space=${currentTotalMarginSpace}`);
    }
    // Initial margin adjustments
    let leftMargin = initialLeftMargin;
    let rightMargin = initialRightMargin;
    // Apply initial clipping and total adjustment
    let lmTemp = Math.max(0, Math.min(leftMargin, maxAllowedLeft));
    let rmTemp = Math.max(0, Math.min(rightMargin, maxAllowedRight));
    if (lmTemp + rmTemp !== currentTotalMarginSpace) {
        if (lmTemp === maxAllowedLeft && boundaryLeftVal !== null) {
            rmTemp = currentTotalMarginSpace - lmTemp;
        }
        else if (rmTemp === maxAllowedRight && boundaryRightVal !== null) {
            lmTemp = currentTotalMarginSpace - rmTemp;
        }
        else {
            lmTemp = Math.floor(currentTotalMarginSpace / 2);
            rmTemp = currentTotalMarginSpace - lmTemp;
        }
    }
    leftMargin = Math.max(0, Math.min(lmTemp, maxAllowedLeft));
    rightMargin = Math.max(0, Math.min(currentTotalMarginSpace - leftMargin, maxAllowedRight));
    leftMargin = Math.max(0, Math.min(currentTotalMarginSpace - rightMargin, maxAllowedLeft));
    if (debugPrints) {
        console.log(`[DEBUG ${faceName}] After initial clip & adjust: L_margin=${leftMargin}, R_margin=${rightMargin}`);
    }
    let needsCorrectionFlag = true;
    if (leftMargin >= thresholdLeft && rightMargin >= thresholdRight) {
        needsCorrectionFlag = false;
        if (debugPrints) {
            console.log(`[DEBUG ${faceName}] Initial margins already meet both thresholds. needs_correction=false`);
        }
    }
    // Double boundary optimization logic
    if (needsCorrectionFlag && boundaryLeftVal !== null && boundaryRightVal !== null) {
        if (debugPrints) {
            console.log(`[DEBUG ${faceName}] Trying distribution for double boundary.`);
        }
        let bestLm = leftMargin;
        let bestRm = rightMargin;
        let bothThresholdsMetByCandidate = false;
        // Try right-priority distribution
        if (maxAllowedRight >= thresholdRight) {
            const testR1a = maxAllowedRight;
            const testL1a = currentTotalMarginSpace - testR1a;
            if (testL1a >= 0 && testL1a <= maxAllowedLeft && testL1a >= thresholdLeft) {
                if (!bothThresholdsMetByCandidate) {
                    bestLm = testL1a;
                    bestRm = testR1a;
                    bothThresholdsMetByCandidate = true;
                }
                if (debugPrints) {
                    console.log(`[DEBUG ${faceName}] Option DB R-1a (both meet): L=${testL1a}, R=${testR1a}`);
                }
            }
            if (!bothThresholdsMetByCandidate) {
                const testR1b = thresholdRight;
                const testL1b = currentTotalMarginSpace - testR1b;
                if (testL1b >= 0 && testL1b <= maxAllowedLeft) {
                    if (testL1b >= thresholdLeft) {
                        bestLm = testL1b;
                        bestRm = testR1b;
                        bothThresholdsMetByCandidate = true;
                    }
                    else if (!(bestLm >= thresholdLeft && bestRm >= thresholdRight)) {
                        bestLm = testL1b;
                        bestRm = testR1b;
                    }
                    if (debugPrints) {
                        console.log(`[DEBUG ${faceName}] Option DB R-1b (L ${testL1b >= thresholdLeft ? '>=' : '<'} thresh): L=${testL1b}, R=${testR1b}`);
                    }
                }
            }
        }
        // Try left-priority distribution
        if (!bothThresholdsMetByCandidate && maxAllowedLeft >= thresholdLeft) {
            const testL2a = maxAllowedLeft;
            const testR2a = currentTotalMarginSpace - testL2a;
            if (testR2a >= 0 && testR2a <= maxAllowedRight && testR2a >= thresholdRight) {
                if (!bothThresholdsMetByCandidate) {
                    bestLm = testL2a;
                    bestRm = testR2a;
                    bothThresholdsMetByCandidate = true;
                }
                if (debugPrints) {
                    console.log(`[DEBUG ${faceName}] Option DB L-2a (both meet): L=${testL2a}, R=${testR2a}`);
                }
            }
            if (!bothThresholdsMetByCandidate) {
                const testL2b = thresholdLeft;
                const testR2b = currentTotalMarginSpace - testL2b;
                if (testR2b >= 0 && testR2b <= maxAllowedRight) {
                    if (testR2b >= thresholdRight) {
                        bestLm = testL2b;
                        bestRm = testR2b;
                        bothThresholdsMetByCandidate = true;
                    }
                    else if (!(bestLm >= thresholdLeft && bestRm >= thresholdRight)) {
                        if (!(bestLm >= thresholdLeft) || testR2b > bestRm) {
                            bestLm = testL2b;
                            bestRm = testR2b;
                        }
                    }
                    if (debugPrints) {
                        console.log(`[DEBUG ${faceName}] Option DB L-2b (R ${testR2b >= thresholdRight ? '>=' : '<'} thresh): L=${testL2b}, R=${testR2b}`);
                    }
                }
            }
        }
        leftMargin = bestLm;
        rightMargin = bestRm;
        if (bothThresholdsMetByCandidate) {
            needsCorrectionFlag = false;
        }
        if (debugPrints && !needsCorrectionFlag) {
            console.log(`[DEBUG ${faceName}] Solved by double boundary distribution. needs_correction=false`);
        }
    }
    else if (needsCorrectionFlag) {
        if (debugPrints) {
            console.log(`[DEBUG ${faceName}] Trying distribution for single/no boundary.`);
        }
        if (boundaryLeftVal !== null && boundaryRightVal === null) {
            // Left boundary only
            if (maxAllowedLeft >= thresholdLeft) {
                leftMargin = thresholdLeft;
            }
            else {
                leftMargin = maxAllowedLeft;
            }
            rightMargin = Math.max(0, currentTotalMarginSpace - leftMargin);
        }
        else if (boundaryLeftVal === null && boundaryRightVal !== null) {
            // Right boundary only
            if (maxAllowedRight >= thresholdRight) {
                rightMargin = thresholdRight;
            }
            else {
                rightMargin = maxAllowedRight;
            }
            leftMargin = Math.max(0, currentTotalMarginSpace - rightMargin);
        }
    }
    // Final constraint application
    leftMargin = Math.max(0, Math.min(leftMargin, maxAllowedLeft));
    rightMargin = Math.max(0, Math.min(rightMargin, maxAllowedRight));
    if (leftMargin + rightMargin !== currentTotalMarginSpace && currentTotalMarginSpace >= 0) {
        if (leftMargin === maxAllowedLeft && boundaryLeftVal !== null) {
            rightMargin = currentTotalMarginSpace - leftMargin;
        }
        else {
            leftMargin = currentTotalMarginSpace - rightMargin;
        }
    }
    leftMargin = Math.max(0, Math.min(leftMargin, maxAllowedLeft));
    rightMargin = Math.max(0, Math.min(rightMargin, maxAllowedRight));
    if (debugPrints) {
        console.log(`[DEBUG ${faceName}] After all distribution attempts: L_margin=${leftMargin}, R_margin=${rightMargin}`);
    }
    // Final threshold check
    if (leftMargin >= thresholdLeft && rightMargin >= thresholdRight) {
        needsCorrectionFlag = false;
        if (debugPrints) {
            console.log(`[DEBUG ${faceName}] Final check: Both thresholds met. needs_correction=false`);
        }
    }
    else {
        needsCorrectionFlag = true;
        if (debugPrints) {
            console.log(`[DEBUG ${faceName}] Final check: At least one threshold NOT met. needs_correction=true. (L_actual:${leftMargin} vs L_thresh:${thresholdLeft}, R_actual:${rightMargin} vs R_thresh:${thresholdRight})`);
        }
    }
    const originalLeftMargin = leftMargin;
    const originalRightMargin = rightMargin;
    let correctionPartVal = null;
    let corrValForLeftNoteStr = null;
    let corrValForRightNoteStr = null;
    // Calculate correction values if needed
    if (needsCorrectionFlag) {
        const candidates = [150, 300, 355, 600, 900];
        if (originalLeftMargin < thresholdLeft) {
            for (const pCorr of candidates) {
                if (originalLeftMargin + pCorr > thresholdLeft) {
                    corrValForLeftNoteStr = pCorr;
                    break;
                }
            }
            if (corrValForLeftNoteStr === null && candidates.length > 0) {
                corrValForLeftNoteStr = candidates[candidates.length - 1];
            }
        }
        if (originalRightMargin < thresholdRight) {
            for (const pCorr of candidates) {
                if (originalRightMargin + pCorr > thresholdRight) {
                    corrValForRightNoteStr = pCorr;
                    break;
                }
            }
            if (corrValForRightNoteStr === null && candidates.length > 0) {
                corrValForRightNoteStr = candidates[candidates.length - 1];
            }
        }
        if (corrValForLeftNoteStr && corrValForRightNoteStr) {
            correctionPartVal = Math.max(corrValForLeftNoteStr, corrValForRightNoteStr);
        }
        else if (corrValForLeftNoteStr) {
            correctionPartVal = corrValForLeftNoteStr;
        }
        else if (corrValForRightNoteStr) {
            correctionPartVal = corrValForRightNoteStr;
        }
        if (debugPrints) {
            console.log(`[DEBUG ${faceName}] Needs correction. L_corr_note=${corrValForLeftNoteStr}, R_corr_note=${corrValForRightNoteStr}, span_text_corr_val=${correctionPartVal}`);
        }
    }
    // Format span parts text
    const basePartsForFormat = Array(Math.floor(baseVal / constants_1.STANDARD_PART_SIZE)).fill(constants_1.STANDARD_PART_SIZE);
    const combinedPartsForFormat = [...basePartsForFormat, ...partsVal];
    let spanPartsText = (0, utils_1.formatSpanParts)(combinedPartsForFormat);
    // Create note strings
    let leftNoteStr = `${originalLeftMargin} mm`;
    if (originalLeftMargin < thresholdLeft && corrValForLeftNoteStr !== null) {
        leftNoteStr += `(+${corrValForLeftNoteStr})`;
    }
    let rightNoteStr = `${originalRightMargin} mm`;
    if (originalRightMargin < thresholdRight && corrValForRightNoteStr !== null) {
        rightNoteStr += `(+${corrValForRightNoteStr})`;
    }
    // Apply correction to span text if needed
    if (needsCorrectionFlag && correctionPartVal !== null) {
        const prefixStr = (originalLeftMargin < thresholdLeft && corrValForLeftNoteStr === correctionPartVal) ? `(+${correctionPartVal})` : "";
        const suffixStr = (originalRightMargin < thresholdRight && corrValForRightNoteStr === correctionPartVal) ? `(+${correctionPartVal})` : "";
        const currentSpanElements = spanPartsText.split(", ");
        if (prefixStr && suffixStr && prefixStr === suffixStr) {
            spanPartsText = `${prefixStr}, ${spanPartsText}, ${correctionPartVal}${suffixStr}`;
        }
        else if (prefixStr) {
            spanPartsText = `${prefixStr}, ${spanPartsText}`;
        }
        else if (suffixStr) {
            if (currentSpanElements.length > 0 && /^\d+$/.test(currentSpanElements[currentSpanElements.length - 1].replace('span', ''))) {
                currentSpanElements[currentSpanElements.length - 1] = `${currentSpanElements[currentSpanElements.length - 1]}${suffixStr}`;
                spanPartsText = currentSpanElements.join(", ");
            }
            else {
                spanPartsText = `${spanPartsText}, ${correctionPartVal}${suffixStr}`;
            }
        }
    }
    if (debugPrints) {
        console.log(`[DEBUG ${faceName}] Final Notes: L='${leftNoteStr}', R='${rightNoteStr}' | Span Text='${spanPartsText}'`);
        console.log(`--- End Calculating for ${faceName} ---\n`);
    }
    return {
        totalSpan: totalVal,
        spanText: spanPartsText,
        leftMargin: originalLeftMargin,
        rightMargin: originalRightMargin,
        leftNote: leftNoteStr,
        rightNote: rightNoteStr
    };
}
//# sourceMappingURL=face-dimensions.js.map