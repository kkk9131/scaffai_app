import { ScaffoldCalculationInput } from '@scaffai/types';

// Legacy InputData structure for backwards compatibility
export interface LegacyInputData {
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

// Convert new ScaffoldCalculationInput to legacy format for UI compatibility
export function toLegacyInputData(data: ScaffoldCalculationInput): LegacyInputData {
  return {
    frameWidth: {
      northSouth: data.widthNS || null,
      eastWest: data.widthEW || null,
    },
    eaveOverhang: {
      north: data.eavesN || null,
      east: data.eavesE || null,
      south: data.eavesS || null,
      west: data.eavesW || null,
    },
    propertyLine: {
      north: data.boundaryN !== null,
      east: data.boundaryE !== null,
      south: data.boundaryS !== null,
      west: data.boundaryW !== null,
    },
    propertyLineDistance: {
      north: data.boundaryN,
      east: data.boundaryE,
      south: data.boundaryS,
      west: data.boundaryW,
    },
    referenceHeight: data.standardHeight || null,
    roofShape: mapRoofShape(data.roofShape),
    hasTieColumns: data.tieColumn,
    eavesHandrails: data.railingCount || null,
    specialMaterial: {
      northSouth: {
        material355: data.use355NS || null,
        material300: data.use300NS || null,
        material150: data.use150NS || null,
      },
      eastWest: {
        material355: data.use355EW || null,
        material300: data.use300EW || null,
        material150: data.use150EW || null,
      },
    },
    targetOffset: data.targetMargin || null,
  };
}

// Convert legacy format back to ScaffoldCalculationInput
export function fromLegacyInputData(data: LegacyInputData): ScaffoldCalculationInput {
  return {
    widthNS: data.frameWidth.northSouth || 0,
    widthEW: data.frameWidth.eastWest || 0,
    eavesN: data.eaveOverhang.north || 0,
    eavesE: data.eaveOverhang.east || 0,
    eavesS: data.eaveOverhang.south || 0,
    eavesW: data.eaveOverhang.west || 0,
    boundaryN: data.propertyLine.north ? (data.propertyLineDistance?.north || 0) : null,
    boundaryE: data.propertyLine.east ? (data.propertyLineDistance?.east || 0) : null,
    boundaryS: data.propertyLine.south ? (data.propertyLineDistance?.south || 0) : null,
    boundaryW: data.propertyLine.west ? (data.propertyLineDistance?.west || 0) : null,
    standardHeight: data.referenceHeight || 0,
    roofShape: mapRoofShapeBack(data.roofShape),
    tieColumn: data.hasTieColumns,
    railingCount: data.eavesHandrails || 0,
    use355NS: data.specialMaterial.northSouth.material355 || 0,
    use300NS: data.specialMaterial.northSouth.material300 || 0,
    use150NS: data.specialMaterial.northSouth.material150 || 0,
    use355EW: data.specialMaterial.eastWest.material355 || 0,
    use300EW: data.specialMaterial.eastWest.material300 || 0,
    use150EW: data.specialMaterial.eastWest.material150 || 0,
    targetMargin: data.targetOffset || 900,
  };
}

function mapRoofShape(roofShape: string): 'flat' | 'sloped' | 'roofDeck' {
  switch (roofShape) {
    case 'フラット':
      return 'flat';
    case '勾配軒':
      return 'sloped';
    case '陸屋根':
      return 'roofDeck';
    default:
      return 'flat';
  }
}

function mapRoofShapeBack(roofShape: 'flat' | 'sloped' | 'roofDeck'): string {
  switch (roofShape) {
    case 'flat':
      return 'フラット';
    case 'sloped':
      return '勾配軒';
    case 'roofDeck':
      return '陸屋根';
    default:
      return 'フラット';
  }
}