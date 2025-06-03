/**
 * Calculate base width by removing remainder from standard part size
 */
export declare function baseWidth(width: number, unit?: number): number;
/**
 * Adjust length based on width, eaves, and margin
 */
export declare function adjustLength(width: number, eaves: number, margin?: number): number;
/**
 * Select optimal parts combination for target length
 * Finds the smallest total that meets or exceeds target length
 */
export declare function selectParts(targetLength: number, partsOptions?: readonly number[], maxItems?: number): number[];
/**
 * Calculate total span from base and adjustment parts
 */
export declare function totalSpan(base: number, adjustPartsList: number[]): number;
/**
 * Format span parts into display string
 */
export declare function formatSpanParts(partsToFormat: number[]): string;
//# sourceMappingURL=utils.d.ts.map