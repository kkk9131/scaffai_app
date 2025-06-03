import type { SpanCalculationResult } from './types';
/**
 * Calculate optimal span configuration with boundary constraints
 * This is the core algorithm for scaffold span optimization
 */
export declare function calculateSpanWithBoundaries(width: number, eaves: number, mandatorySpecialParts: number[], availableNormalPartsList: readonly number[], leftBoundary?: number | null, rightBoundary?: number | null, targetMargin?: number, debugPrints?: boolean): SpanCalculationResult;
//# sourceMappingURL=span-calculation.d.ts.map