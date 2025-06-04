export interface ScaffoldCalculationInput {
    widthNS: number;
    widthEW: number;
    eavesN: number;
    eavesE: number;
    eavesS: number;
    eavesW: number;
    boundaryN: number | null;
    boundaryE: number | null;
    boundaryS: number | null;
    boundaryW: number | null;
    standardHeight: number;
    roofShape: string;
    tieColumn: boolean;
    railingCount: number;
    use355NS?: number;
    use300NS?: number;
    use150NS?: number;
    use355EW?: number;
    use300EW?: number;
    use150EW?: number;
    targetMargin?: number;
}
export interface ScaffoldCalculationResult {
    nsTotalSpan: number;
    ewTotalSpan: number;
    nsSpanStructure: string;
    ewSpanStructure: string;
    northGap: string;
    southGap: string;
    eastGap: string;
    westGap: string;
    numStages: number;
    modulesCount: number;
    jackUpHeight: number;
    firstLayerHeight: number;
    tieOk: boolean;
    tieColumnUsed: boolean;
}
//# sourceMappingURL=types.d.ts.map