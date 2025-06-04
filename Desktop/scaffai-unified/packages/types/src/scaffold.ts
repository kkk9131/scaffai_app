// 足場計算関連の型定義

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

export interface ScaffoldCalculationInput {
  // Building dimensions
  widthNS: number;
  widthEW: number;
  
  // Eaves measurements
  eavesN: number;
  eavesE: number;
  eavesS: number;
  eavesW: number;
  
  // Boundary constraints (null means no boundary)
  boundaryN: number | null;
  boundaryE: number | null;
  boundaryS: number | null;
  boundaryW: number | null;
  
  // Building specifications
  standardHeight: number;
  roofShape: string;
  tieColumn: boolean;
  railingCount: number;
  
  // Special parts usage for NS direction
  use355NS?: number;
  use300NS?: number;
  use150NS?: number;
  
  // Special parts usage for EW direction
  use355EW?: number;
  use300EW?: number;
  use150EW?: number;
  
  // Target margin
  targetMargin?: number;
}

export interface ScaffoldCalculationResult {
  // Span totals
  nsTotalSpan: number;
  ewTotalSpan: number;
  
  // Span structures
  nsSpanStructure: string;
  ewSpanStructure: string;
  
  // Gap measurements
  northGap: string;
  southGap: string;
  eastGap: string;
  westGap: string;
  
  // Height calculations
  numStages: number;
  modulesCount: number;
  jackUpHeight: number;
  firstLayerHeight: number;
  
  // Tie column information
  tieOk: boolean;
  tieColumnUsed: boolean;
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