export interface InputData {
    frameWidth: {
        northSouth: number | null;
        eastWest: number | null;
    };
    eaveOverhang: {
        north: number | null;
        east: number | null;
        south: number | null;
        west: number | null;
    };
    propertyLine: {
        north: boolean;
        east: boolean;
        south: boolean;
        west: boolean;
    };
    referenceHeight: number | null;
    roofShape: 'flat' | 'sloped' | 'roofDeck';
    hasTieColumns: boolean;
    eavesHandrails: number | null;
    specialMaterial: {
        northSouth: {
            material355: number | null;
            material300: number | null;
            material150: number | null;
        };
        eastWest: {
            material355: number | null;
            material300: number | null;
            material150: number | null;
        };
    };
    targetOffset: number | null;
    propertyLineDistance?: {
        north: number | null;
        east: number | null;
        south: number | null;
        west: number | null;
    };
}
export interface CalculationResult {
    ns_total_span: number;
    ew_total_span: number;
    ns_span_structure: string;
    ew_span_structure: string;
    north_gap: string;
    south_gap: string;
    east_gap: string;
    west_gap: string;
    num_stages: number;
    modules_count: number;
    jack_up_height: number;
    first_layer_height: number;
    tie_ok: boolean;
    tie_column_used: boolean;
}
export interface SpanCalculationParams {
    width: number;
    eaves: number;
    mandatorySpecialParts: number[];
    availableNormalParts: number[];
    leftBoundary?: number | null;
    rightBoundary?: number | null;
    targetMargin?: number;
}
export interface SpanCalculationResult {
    base: number;
    parts: number[];
    totalSpan: number;
}
//# sourceMappingURL=scaffold.d.ts.map