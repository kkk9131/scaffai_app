import type { FaceDimensionResult } from './types';
/**
 * Calculate face dimensions with comprehensive eaves and boundary handling
 * This is the main algorithm for determining scaffold layout for each building face
 */
export declare function calculateFaceDimensions(widthVal: number, eavesLeftVal: number, eavesRightVal: number, boundaryLeftVal: number | null, boundaryRightVal: number | null, use150Val: number, use300Val: number, use355Val: number, partsMasterList: readonly number[], targetMarginVal?: number, faceName?: string): FaceDimensionResult;
//# sourceMappingURL=face-dimensions.d.ts.map