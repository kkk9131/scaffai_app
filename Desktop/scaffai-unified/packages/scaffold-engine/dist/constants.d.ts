export declare const BOUNDARY_OFFSET = 60;
export declare const EAVES_MARGIN_THRESHOLD_ADDITION = 80;
export declare const STANDARD_PART_SIZE = 1800;
export declare const DEFAULT_TARGET_MARGIN = 900;
export declare const STAGE_UNIT_HEIGHT = 1900;
export declare const FIRST_LAYER_MIN_HEIGHT_THRESHOLD = 950;
export declare const TIE_COLUMN_REDUCTION_LARGE = 475;
export declare const TIE_COLUMN_REDUCTION_SMALL = 130;
export declare const TIE_COLUMN_MIN_HEIGHT_FOR_LARGE_REDUCTION = 550;
export declare const TIE_COLUMN_MIN_HEIGHT_FOR_SMALL_REDUCTION = 150;
export declare const NORMAL_PARTS: readonly [1800, 1500, 1200, 900, 600];
export declare const BASE_UNIT_MAP: {
    readonly フラット: 1700;
    readonly 勾配軒: 1900;
    readonly 陸屋根: 1800;
};
export type RoofShape = keyof typeof BASE_UNIT_MAP;
//# sourceMappingURL=constants.d.ts.map