"use strict";
// scaffold-engine/src/calc-all.ts
// Main calculation function integrating all scaffold algorithms
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcAll = calcAll;
const constants_1 = require("./constants");
const face_dimensions_1 = require("./face-dimensions");
/**
 * Main scaffold calculation function
 * Integrates all calculation algorithms for complete scaffold design
 */
function calcAll(params) {
    const { width_NS, width_EW, eaves_N, eaves_E, eaves_S, eaves_W, boundary_N, boundary_E, boundary_S, boundary_W, standard_height, roof_shape, tie_column, railing_count, use_355_NS = 0, use_300_NS = 0, use_150_NS = 0, use_355_EW = 0, use_300_EW = 0, use_150_EW = 0, target_margin = constants_1.DEFAULT_TARGET_MARGIN } = params;
    // North-South direction calculation (determines East/West gaps)
    const nsResult = (0, face_dimensions_1.calculateFaceDimensions)(width_NS, eaves_E, eaves_W, boundary_E, boundary_W, use_150_NS, use_300_NS, use_355_NS, constants_1.NORMAL_PARTS, target_margin, "NS_direction (East/West gaps)");
    // East-West direction calculation (determines North/South gaps)
    const ewResult = (0, face_dimensions_1.calculateFaceDimensions)(width_EW, eaves_S, eaves_N, boundary_S, boundary_N, use_150_EW, use_300_EW, use_355_EW, constants_1.NORMAL_PARTS, target_margin, "EW_direction (North/South gaps)");
    // Stage count and jack-up height calculation
    const baseUnit = constants_1.BASE_UNIT_MAP[roof_shape] || 1700;
    const remainder = standard_height - baseUnit;
    const stageUnit = constants_1.STAGE_UNIT_HEIGHT;
    const initialStages = 1 + (remainder > 0 ? Math.floor(remainder / stageUnit) : 0);
    const initialLeftover = remainder - (initialStages - 1) * stageUnit;
    let firstLayerHeight;
    if (initialLeftover < constants_1.FIRST_LAYER_MIN_HEIGHT_THRESHOLD) {
        firstLayerHeight = initialLeftover + stageUnit;
    }
    else {
        firstLayerHeight = initialLeftover;
    }
    const remainingAfterFirst = standard_height - baseUnit - firstLayerHeight;
    const numStages = 1 + (remainingAfterFirst > 0 ? Math.floor(remainingAfterFirst / stageUnit) : 0);
    const leftover = standard_height - baseUnit - (numStages - 1) * stageUnit;
    let jackUpHeight = leftover;
    let reductionLoops = 0;
    let tiePossible = true;
    // Tie column calculations
    if (tie_column) {
        if (jackUpHeight >= constants_1.TIE_COLUMN_MIN_HEIGHT_FOR_LARGE_REDUCTION) {
            while (jackUpHeight >= constants_1.TIE_COLUMN_MIN_HEIGHT_FOR_LARGE_REDUCTION) {
                jackUpHeight -= constants_1.TIE_COLUMN_REDUCTION_LARGE;
                reductionLoops++;
            }
            if (jackUpHeight >= constants_1.TIE_COLUMN_MIN_HEIGHT_FOR_SMALL_REDUCTION) {
                jackUpHeight -= constants_1.TIE_COLUMN_REDUCTION_SMALL;
            }
            else {
                tiePossible = false;
                jackUpHeight = leftover;
                reductionLoops = 0;
            }
        }
        else if (jackUpHeight >= constants_1.TIE_COLUMN_MIN_HEIGHT_FOR_SMALL_REDUCTION) {
            jackUpHeight -= constants_1.TIE_COLUMN_REDUCTION_SMALL;
        }
        else {
            tiePossible = false;
            jackUpHeight = leftover;
        }
    }
    else {
        while (jackUpHeight >= constants_1.TIE_COLUMN_REDUCTION_LARGE) {
            jackUpHeight -= constants_1.TIE_COLUMN_REDUCTION_LARGE;
            reductionLoops++;
        }
    }
    // Module count calculation
    let modulesCount = 4 + (numStages - 1) * 4 + reductionLoops;
    if (railing_count === 3) {
        modulesCount += 2;
    }
    else if (railing_count === 2) {
        modulesCount += 1;
    }
    // Final first layer height calculation
    const finalLeftoverForFirstLayer = standard_height - baseUnit - (numStages - 1) * stageUnit;
    if (finalLeftoverForFirstLayer < constants_1.FIRST_LAYER_MIN_HEIGHT_THRESHOLD) {
        firstLayerHeight = finalLeftoverForFirstLayer + stageUnit;
    }
    else {
        firstLayerHeight = finalLeftoverForFirstLayer;
    }
    return {
        ns_total_span: nsResult.totalSpan,
        ew_total_span: ewResult.totalSpan,
        ns_span_structure: nsResult.spanText,
        ew_span_structure: ewResult.spanText,
        north_gap: ewResult.rightNote, // EW calculation determines North gap (right side)
        south_gap: ewResult.leftNote, // EW calculation determines South gap (left side)
        east_gap: nsResult.leftNote, // NS calculation determines East gap (left side)
        west_gap: nsResult.rightNote, // NS calculation determines West gap (right side)
        num_stages: numStages,
        modules_count: modulesCount,
        jack_up_height: jackUpHeight,
        first_layer_height: firstLayerHeight,
        tie_ok: tiePossible,
        tie_column_used: tie_column
    };
}
//# sourceMappingURL=calc-all.js.map