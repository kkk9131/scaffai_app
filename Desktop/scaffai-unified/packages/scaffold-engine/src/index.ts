import { ScaffoldCalculationInput, ScaffoldCalculationResult } from '@scaffai/types';

// Constants
const BOUNDARY_OFFSET = 60;
const EAVES_MARGIN_THRESHOLD_ADDITION = 80;
const STANDARD_PART_SIZE = 1800;
const DEFAULT_TARGET_MARGIN = 900;
const STAGE_UNIT_HEIGHT = 1900;
const FIRST_LAYER_MIN_HEIGHT_THRESHOLD = 950;
const TIE_COLUMN_REDUCTION_LARGE = 475;
const TIE_COLUMN_REDUCTION_SMALL = 130;
const TIE_COLUMN_MIN_HEIGHT_FOR_LARGE_REDUCTION = 550;
const TIE_COLUMN_MIN_HEIGHT_FOR_SMALL_REDUCTION = 150;

const NORMAL_PARTS = [1800, 1500, 1200, 900, 600];

interface PartCombination {
  parts: number[];
  total: number;
}

export function baseWidth(width: number, unit: number = STANDARD_PART_SIZE): number {
  return width - (width % unit);
}

export function selectParts(targetLength: number, partsOptions: number[] = NORMAL_PARTS, maxItems: number = 4): number[] {
  let best: number[] | null = null;
  
  for (let count = 1; count <= maxItems; count++) {
    const combinations = generateCombinations(partsOptions, count);
    
    for (const combo of combinations) {
      const total = combo.reduce((sum, part) => sum + part, 0);
      
      if (total >= targetLength) {
        if (best === null || 
            total < best.reduce((sum, part) => sum + part, 0) ||
            (total === best.reduce((sum, part) => sum + part, 0) && 
             combo.filter(p => p === STANDARD_PART_SIZE).length > best.filter(p => p === STANDARD_PART_SIZE).length)) {
          best = [...combo];
        }
      }
    }
  }
  
  return best || [];
}

function generateCombinations(items: number[], count: number): number[][] {
  if (count === 0) return [[]];
  if (count === 1) return items.map(item => [item]);
  
  const result: number[][] = [];
  
  function backtrack(current: number[], remaining: number) {
    if (remaining === 0) {
      result.push([...current]);
      return;
    }
    
    for (const item of items) {
      current.push(item);
      backtrack(current, remaining - 1);
      current.pop();
    }
  }
  
  backtrack([], count);
  return result;
}

function calculateInitialMargins(
  currentTotalSpan: number,
  width: number,
  leftBoundary: number | null,
  rightBoundary: number | null,
  targetMargin: number = DEFAULT_TARGET_MARGIN
): [number, number] {
  const availableMarginTotal = Math.max(0, currentTotalSpan - width);
  let leftGap = Math.floor(availableMarginTotal / 2);
  let rightGap = availableMarginTotal - leftGap;

  if (leftBoundary === null && rightBoundary === null) {
    const baseMarginHalf = Math.floor(availableMarginTotal / 2);
    if (baseMarginHalf <= targetMargin) {
      leftGap = baseMarginHalf;
      rightGap = baseMarginHalf;
    } else {
      leftGap = targetMargin;
      rightGap = targetMargin;
      const surplus = availableMarginTotal - (targetMargin * 2);
      if (surplus > 0) {
        leftGap += Math.floor(surplus / 2);
        rightGap += surplus - Math.floor(surplus / 2);
      }
    }
    return [leftGap, rightGap];
  }

  const maxAllowedLeft = leftBoundary !== null ? Math.max(0, leftBoundary - BOUNDARY_OFFSET) : Infinity;
  const maxAllowedRight = rightBoundary !== null ? Math.max(0, rightBoundary - BOUNDARY_OFFSET) : Infinity;

  leftGap = Math.max(0, Math.min(leftGap, maxAllowedLeft));
  rightGap = Math.max(0, Math.min(rightGap, maxAllowedRight));

  if (leftGap + rightGap !== availableMarginTotal) {
    if (leftGap === maxAllowedLeft && leftBoundary !== null) {
      rightGap = availableMarginTotal - leftGap;
    } else if (rightGap === maxAllowedRight && rightBoundary !== null) {
      leftGap = availableMarginTotal - rightGap;
    } else {
      leftGap = Math.floor(availableMarginTotal / 2);
      rightGap = availableMarginTotal - leftGap;
      leftGap = Math.max(0, Math.min(leftGap, maxAllowedLeft));
      rightGap = Math.max(0, Math.min(rightGap, maxAllowedRight));
      
      if (leftGap + rightGap !== availableMarginTotal) {
        if (leftGap === maxAllowedLeft && leftBoundary !== null) {
          rightGap = availableMarginTotal - leftGap;
        } else {
          leftGap = availableMarginTotal - rightGap;
        }
      }
    }
  }

  leftGap = Math.max(0, Math.min(leftGap, maxAllowedLeft));
  rightGap = Math.max(0, Math.min(rightGap, maxAllowedRight));

  return [leftGap, rightGap];
}

function calculateSpanWithBoundaries(
  width: number,
  eaves: number,
  mandatorySpecialParts: number[],
  availableNormalParts: number[],
  leftBoundary: number | null,
  rightBoundary: number | null,
  targetMargin: number = DEFAULT_TARGET_MARGIN
): [number, number[], number] {
  const base = baseWidth(width);
  const sumOfMandatorySpecial = mandatorySpecialParts.reduce((sum, part) => sum + part, 0);

  const maxAllowedLeft = leftBoundary !== null ? Math.max(0, leftBoundary - BOUNDARY_OFFSET) : Infinity;
  const maxAllowedRight = rightBoundary !== null ? Math.max(0, rightBoundary - BOUNDARY_OFFSET) : Infinity;

  const effectiveTargetLeft = Math.min(targetMargin, maxAllowedLeft);
  const effectiveTargetRight = Math.min(targetMargin, maxAllowedRight);
  const idealTargetTotalSpan = width + effectiveTargetLeft + effectiveTargetRight;
  const absoluteMaxTotalSpan = width + maxAllowedLeft + maxAllowedRight;

  const targetSumForNormalPartsIdeal = idealTargetTotalSpan - base - sumOfMandatorySpecial;
  const minSumNormalForWidthCoverage = Math.max(0, width - base - sumOfMandatorySpecial);

  let bestComboNormalParts: number[] = [];
  let minAbsDiffToTargetSumNormal = Infinity;

  const maxSumForNormalPartsAbsolute = Math.max(0, absoluteMaxTotalSpan - base - sumOfMandatorySpecial);

  for (let count = 0; count <= 4; count++) {
    const combinations = count === 0 ? [[]] : generateCombinations(availableNormalParts, count);
    
    for (const comboNormal of combinations) {
      const currentSumNormal = comboNormal.reduce((sum, part) => sum + part, 0);

      if (currentSumNormal < minSumNormalForWidthCoverage) continue;
      if (currentSumNormal > maxSumForNormalPartsAbsolute) continue;

      const diff = Math.abs(currentSumNormal - targetSumForNormalPartsIdeal);

      if (diff < minAbsDiffToTargetSumNormal) {
        minAbsDiffToTargetSumNormal = diff;
        bestComboNormalParts = [...comboNormal];
      } else if (diff === minAbsDiffToTargetSumNormal) {
        if (comboNormal.length < bestComboNormalParts.length ||
            (comboNormal.length === bestComboNormalParts.length && 
             comboNormal.filter(p => p === STANDARD_PART_SIZE).length > bestComboNormalParts.filter(p => p === STANDARD_PART_SIZE).length)) {
          bestComboNormalParts = [...comboNormal];
        }
      }
    }
  }

  if (bestComboNormalParts.length === 0 && minSumNormalForWidthCoverage > 0) {
    const fallbackNormalParts = selectParts(minSumNormalForWidthCoverage, availableNormalParts);
    if (fallbackNormalParts.length > 0) {
      if (base + sumOfMandatorySpecial + fallbackNormalParts.reduce((sum, part) => sum + part, 0) <= absoluteMaxTotalSpan) {
        bestComboNormalParts = fallbackNormalParts;
      }
    }
  }

  const finalParts = [...mandatorySpecialParts, ...bestComboNormalParts].sort((a, b) => b - a);
  const finalTotalSpan = base + finalParts.reduce((sum, part) => sum + part, 0);

  return [base, finalParts, finalTotalSpan];
}

function formatSpanParts(parts: number[]): string {
  const count = new Map<number, number>();
  parts.forEach(part => {
    count.set(part, (count.get(part) || 0) + 1);
  });

  const result: string[] = [];
  
  if (count.has(STANDARD_PART_SIZE)) {
    result.push(`${count.get(STANDARD_PART_SIZE)}span`);
    count.delete(STANDARD_PART_SIZE);
  }

  const sortedParts = Array.from(count.entries())
    .sort(([a], [b]) => b - a)
    .flatMap(([part, cnt]) => Array(cnt).fill(part));

  result.push(...sortedParts.map(part => part.toString()));

  return result.join(", ");
}

interface FaceDimensionResult {
  totalSpan: number;
  spanText: string;
  leftMargin: number;
  rightMargin: number;
  leftNote: string;
  rightNote: string;
}

function calculateFaceDimensions(
  widthVal: number,
  eavesLeftVal: number,
  eavesRightVal: number,
  boundaryLeftVal: number | null,
  boundaryRightVal: number | null,
  use150Val: number,
  use300Val: number,
  use355Val: number,
  partsMasterList: number[],
  targetMarginVal: number = DEFAULT_TARGET_MARGIN
): FaceDimensionResult {
  const eavesForSpanCalc = Math.max(eavesLeftVal, eavesRightVal);

  const mandatorySpecialParts: number[] = [];
  const specialParts = [[150, use150Val], [300, use300Val], [355, use355Val]] as const;
  
  for (const [part, count] of specialParts) {
    for (let i = 0; i < count; i++) {
      mandatorySpecialParts.push(part);
    }
  }

  const [baseVal, partsVal, totalVal] = calculateSpanWithBoundaries(
    widthVal,
    eavesForSpanCalc,
    mandatorySpecialParts,
    partsMasterList,
    boundaryLeftVal,
    boundaryRightVal,
    targetMarginVal
  );

  const [leftMargin, rightMargin] = calculateInitialMargins(
    totalVal,
    widthVal,
    boundaryLeftVal,
    boundaryRightVal,
    targetMarginVal
  );

  const thresholdLeft = eavesLeftVal + EAVES_MARGIN_THRESHOLD_ADDITION;
  const thresholdRight = eavesRightVal + EAVES_MARGIN_THRESHOLD_ADDITION;
  const currentTotalMarginSpace = Math.max(0, totalVal - widthVal);

  const maxAllowedLeft = boundaryLeftVal !== null ? Math.max(0, boundaryLeftVal - BOUNDARY_OFFSET) : Infinity;
  const maxAllowedRight = boundaryRightVal !== null ? Math.max(0, boundaryRightVal - BOUNDARY_OFFSET) : Infinity;

  let finalLeftMargin = Math.max(0, Math.min(leftMargin, maxAllowedLeft));
  let finalRightMargin = Math.max(0, Math.min(rightMargin, maxAllowedRight));

  if (finalLeftMargin + finalRightMargin !== currentTotalMarginSpace) {
    if (finalLeftMargin === maxAllowedLeft && boundaryLeftVal !== null) {
      finalRightMargin = currentTotalMarginSpace - finalLeftMargin;
    } else if (finalRightMargin === maxAllowedRight && boundaryRightVal !== null) {
      finalLeftMargin = currentTotalMarginSpace - finalRightMargin;
    } else {
      finalLeftMargin = Math.floor(currentTotalMarginSpace / 2);
      finalRightMargin = currentTotalMarginSpace - finalLeftMargin;
    }
  }

  finalLeftMargin = Math.max(0, Math.min(finalLeftMargin, maxAllowedLeft));
  finalRightMargin = Math.max(0, Math.min(finalRightMargin, maxAllowedRight));

  let needsCorrection = !(finalLeftMargin >= thresholdLeft && finalRightMargin >= thresholdRight);

  if (needsCorrection && boundaryLeftVal !== null && boundaryRightVal !== null) {
    let bestLm = finalLeftMargin;
    let bestRm = finalRightMargin;
    let bothThresholdsMet = false;

    if (maxAllowedRight >= thresholdRight) {
      const testR1a = maxAllowedRight;
      const testL1a = currentTotalMarginSpace - testR1a;
      if (testL1a >= 0 && testL1a <= maxAllowedLeft && testL1a >= thresholdLeft) {
        if (!bothThresholdsMet) {
          bestLm = testL1a;
          bestRm = testR1a;
          bothThresholdsMet = true;
        }
      }

      if (!bothThresholdsMet) {
        const testR1b = thresholdRight;
        const testL1b = currentTotalMarginSpace - testR1b;
        if (testL1b >= 0 && testL1b <= maxAllowedLeft) {
          if (testL1b >= thresholdLeft) {
            bestLm = testL1b;
            bestRm = testR1b;
            bothThresholdsMet = true;
          } else if (!(bestLm >= thresholdLeft && bestRm >= thresholdRight)) {
            bestLm = testL1b;
            bestRm = testR1b;
          }
        }
      }
    }

    if (!bothThresholdsMet && maxAllowedLeft >= thresholdLeft) {
      const testL2a = maxAllowedLeft;
      const testR2a = currentTotalMarginSpace - testL2a;
      if (testR2a >= 0 && testR2a <= maxAllowedRight && testR2a >= thresholdRight) {
        if (!bothThresholdsMet) {
          bestLm = testL2a;
          bestRm = testR2a;
          bothThresholdsMet = true;
        }
      }

      if (!bothThresholdsMet) {
        const testL2b = thresholdLeft;
        const testR2b = currentTotalMarginSpace - testL2b;
        if (testR2b >= 0 && testR2b <= maxAllowedRight) {
          if (testR2b >= thresholdRight) {
            bestLm = testL2b;
            bestRm = testR2b;
            bothThresholdsMet = true;
          } else if (!(bestLm >= thresholdLeft && bestRm >= thresholdRight)) {
            if (!(bestLm >= thresholdLeft) || testR2b > bestRm) {
              bestLm = testL2b;
              bestRm = testR2b;
            }
          }
        }
      }
    }

    finalLeftMargin = bestLm;
    finalRightMargin = bestRm;
    if (bothThresholdsMet) needsCorrection = false;
  } else if (needsCorrection) {
    if (boundaryLeftVal !== null && boundaryRightVal === null) {
      if (maxAllowedLeft >= thresholdLeft) {
        finalLeftMargin = thresholdLeft;
      } else {
        finalLeftMargin = maxAllowedLeft;
      }
      finalRightMargin = Math.max(0, currentTotalMarginSpace - finalLeftMargin);
    } else if (boundaryLeftVal === null && boundaryRightVal !== null) {
      if (maxAllowedRight >= thresholdRight) {
        finalRightMargin = thresholdRight;
      } else {
        finalRightMargin = maxAllowedRight;
      }
      finalLeftMargin = Math.max(0, currentTotalMarginSpace - finalRightMargin);
    }
  }

  finalLeftMargin = Math.max(0, Math.min(finalLeftMargin, maxAllowedLeft));
  finalRightMargin = Math.max(0, Math.min(finalRightMargin, maxAllowedRight));

  if (finalLeftMargin + finalRightMargin !== currentTotalMarginSpace && currentTotalMarginSpace >= 0) {
    if (finalLeftMargin === maxAllowedLeft && boundaryLeftVal !== null) {
      finalRightMargin = currentTotalMarginSpace - finalLeftMargin;
    } else {
      finalLeftMargin = currentTotalMarginSpace - finalRightMargin;
    }
  }

  finalLeftMargin = Math.max(0, Math.min(finalLeftMargin, maxAllowedLeft));
  finalRightMargin = Math.max(0, Math.min(finalRightMargin, maxAllowedRight));

  if (finalLeftMargin >= thresholdLeft && finalRightMargin >= thresholdRight) {
    needsCorrection = false;
  } else {
    needsCorrection = true;
  }

  const originalLeftMargin = finalLeftMargin;
  const originalRightMargin = finalRightMargin;
  let corrValForLeftNote: number | null = null;
  let corrValForRightNote: number | null = null;
  let correctionPartVal: number | null = null;

  if (needsCorrection) {
    const candidates = [150, 300, 355, 600, 900];
    
    if (originalLeftMargin < thresholdLeft) {
      for (const pCorr of candidates) {
        if (originalLeftMargin + pCorr > thresholdLeft) {
          corrValForLeftNote = pCorr;
          break;
        }
      }
      if (corrValForLeftNote === null && candidates.length > 0) {
        corrValForLeftNote = candidates[candidates.length - 1];
      }
    }

    if (originalRightMargin < thresholdRight) {
      for (const pCorr of candidates) {
        if (originalRightMargin + pCorr > thresholdRight) {
          corrValForRightNote = pCorr;
          break;
        }
      }
      if (corrValForRightNote === null && candidates.length > 0) {
        corrValForRightNote = candidates[candidates.length - 1];
      }
    }

    if (corrValForLeftNote && corrValForRightNote) {
      correctionPartVal = Math.max(corrValForLeftNote, corrValForRightNote);
    } else if (corrValForLeftNote) {
      correctionPartVal = corrValForLeftNote;
    } else if (corrValForRightNote) {
      correctionPartVal = corrValForRightNote;
    }
  }

  const basePartsForFormat = Array(Math.floor(baseVal / STANDARD_PART_SIZE)).fill(STANDARD_PART_SIZE);
  const combinedPartsForFormat = [...basePartsForFormat, ...partsVal];
  let spanPartsText = formatSpanParts(combinedPartsForFormat);

  let leftNoteStr = `${originalLeftMargin} mm`;
  if (originalLeftMargin < thresholdLeft && corrValForLeftNote !== null) {
    leftNoteStr += `(+${corrValForLeftNote})`;
  }

  let rightNoteStr = `${originalRightMargin} mm`;
  if (originalRightMargin < thresholdRight && corrValForRightNote !== null) {
    rightNoteStr += `(+${corrValForRightNote})`;
  }

  if (needsCorrection && correctionPartVal !== null) {
    const prefixStr = (originalLeftMargin < thresholdLeft && corrValForLeftNote === correctionPartVal) ? `(+${correctionPartVal})` : "";
    const suffixStr = (originalRightMargin < thresholdRight && corrValForRightNote === correctionPartVal) ? `(+${correctionPartVal})` : "";

    const currentSpanElements = spanPartsText.split(", ");
    if (prefixStr && suffixStr && prefixStr === suffixStr) {
      spanPartsText = `${prefixStr}, ${spanPartsText}, ${correctionPartVal}${suffixStr}`;
    } else if (prefixStr) {
      spanPartsText = `${prefixStr}, ${spanPartsText}`;
    } else if (suffixStr) {
      if (currentSpanElements.length > 0 && /^\d+$/.test(currentSpanElements[currentSpanElements.length - 1].replace('span', ''))) {
        currentSpanElements[currentSpanElements.length - 1] = `${currentSpanElements[currentSpanElements.length - 1]}${suffixStr}`;
        spanPartsText = currentSpanElements.join(", ");
      } else {
        spanPartsText = `${spanPartsText}, ${correctionPartVal}${suffixStr}`;
      }
    }
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

export function calcAll(input: ScaffoldCalculationInput): ScaffoldCalculationResult {
  const {
    widthNS, widthEW,
    eavesN, eavesE, eavesS, eavesW,
    boundaryN, boundaryE, boundaryS, boundaryW,
    standardHeight, roofShape, tieColumn, railingCount,
    use355NS = 0, use300NS = 0, use150NS = 0,
    use355EW = 0, use300EW = 0, use150EW = 0,
    targetMargin = DEFAULT_TARGET_MARGIN
  } = input;

  // NS direction calculation (East/West gaps)
  const nsResult = calculateFaceDimensions(
    widthNS,
    eavesE, eavesW,
    boundaryE, boundaryW,
    use150NS, use300NS, use355NS,
    NORMAL_PARTS,
    targetMargin
  );

  // EW direction calculation (North/South gaps)
  const ewResult = calculateFaceDimensions(
    widthEW,
    eavesS, eavesN,
    boundaryS, boundaryN,
    use150EW, use300EW, use355EW,
    NORMAL_PARTS,
    targetMargin
  );

  // Stage and jack-up height calculation
  const baseUnitMap: Record<string, number> = {
    "フラット": 1700,
    "勾配軒": 1900,
    "陸屋根": 1800
  };
  const baseUnit = baseUnitMap[roofShape] || 1700;
  const remainder = standardHeight - baseUnit;
  const stageUnit = STAGE_UNIT_HEIGHT;

  const initialStages = 1 + (remainder > 0 ? Math.floor(remainder / stageUnit) : 0);
  const initialLeftover = remainder - (initialStages - 1) * stageUnit;

  let firstLayerHeight: number;
  if (initialLeftover < FIRST_LAYER_MIN_HEIGHT_THRESHOLD) {
    firstLayerHeight = initialLeftover + stageUnit;
  } else {
    firstLayerHeight = initialLeftover;
  }

  const remainingAfterFirst = standardHeight - baseUnit - firstLayerHeight;
  const numStages = 1 + (remainingAfterFirst > 0 ? Math.floor(remainingAfterFirst / stageUnit) : 0);
  const leftover = standardHeight - baseUnit - (numStages - 1) * stageUnit;
  
  let jackUpHeight = leftover;
  let reductionLoops = 0;
  let tiePossible = true;

  if (tieColumn) {
    if (jackUpHeight >= TIE_COLUMN_MIN_HEIGHT_FOR_LARGE_REDUCTION) {
      while (jackUpHeight >= TIE_COLUMN_MIN_HEIGHT_FOR_LARGE_REDUCTION) {
        jackUpHeight -= TIE_COLUMN_REDUCTION_LARGE;
        reductionLoops++;
      }
      if (jackUpHeight >= TIE_COLUMN_MIN_HEIGHT_FOR_SMALL_REDUCTION) {
        jackUpHeight -= TIE_COLUMN_REDUCTION_SMALL;
      } else {
        tiePossible = false;
        jackUpHeight = leftover;
        reductionLoops = 0;
      }
    } else if (jackUpHeight >= TIE_COLUMN_MIN_HEIGHT_FOR_SMALL_REDUCTION) {
      jackUpHeight -= TIE_COLUMN_REDUCTION_SMALL;
    } else {
      tiePossible = false;
      jackUpHeight = leftover;
    }
  } else {
    while (jackUpHeight >= TIE_COLUMN_REDUCTION_LARGE) {
      jackUpHeight -= TIE_COLUMN_REDUCTION_LARGE;
      reductionLoops++;
    }
  }

  let modulesCount = 4 + (numStages - 1) * 4 + reductionLoops;
  if (railingCount === 3) {
    modulesCount += 2;
  } else if (railingCount === 2) {
    modulesCount += 1;
  }

  const finalLeftoverForFirstLayer = standardHeight - baseUnit - (numStages - 1) * stageUnit;
  if (finalLeftoverForFirstLayer < FIRST_LAYER_MIN_HEIGHT_THRESHOLD) {
    firstLayerHeight = finalLeftoverForFirstLayer + stageUnit;
  } else {
    firstLayerHeight = finalLeftoverForFirstLayer;
  }

  return {
    nsTotalSpan: nsResult.totalSpan,
    ewTotalSpan: ewResult.totalSpan,
    nsSpanStructure: nsResult.spanText,
    ewSpanStructure: ewResult.spanText,
    northGap: ewResult.rightNote, // North gap from EW calculation (right side)
    southGap: ewResult.leftNote,  // South gap from EW calculation (left side)
    eastGap: nsResult.leftNote,   // East gap from NS calculation (left side)
    westGap: nsResult.rightNote,  // West gap from NS calculation (right side)
    numStages,
    modulesCount,
    jackUpHeight,
    firstLayerHeight,
    tieOk: tiePossible,
    tieColumnUsed: tieColumn
  };
}

