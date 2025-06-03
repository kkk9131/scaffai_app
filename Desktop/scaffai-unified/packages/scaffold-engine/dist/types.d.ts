export type { RoofShape } from './constants';
export interface ScaffoldInputParams {
    width_NS: number;
    width_EW: number;
    eaves_N: number;
    eaves_E: number;
    eaves_S: number;
    eaves_W: number;
    boundary_N: number | null;
    boundary_E: number | null;
    boundary_S: number | null;
    boundary_W: number | null;
    standard_height: number;
    roof_shape: "フラット" | "勾配軒" | "陸屋根";
    tie_column: boolean;
    railing_count: number;
    use_355_NS?: number;
    use_300_NS?: number;
    use_150_NS?: number;
    use_355_EW?: number;
    use_300_EW?: number;
    use_150_EW?: number;
    target_margin?: number;
}
export interface ScaffoldResult {
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
export interface FaceDimensionResult {
    totalSpan: number;
    spanText: string;
    leftMargin: number;
    rightMargin: number;
    leftNote: string;
    rightNote: string;
}
export interface SpanCalculationResult {
    base: number;
    parts: number[];
    totalSpan: number;
}
export interface MarginCalculationResult {
    leftMargin: number;
    rightMargin: number;
}
//# sourceMappingURL=types.d.ts.map