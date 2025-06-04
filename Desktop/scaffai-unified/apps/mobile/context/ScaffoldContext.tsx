import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ScaffoldCalculationInput, ScaffoldCalculationResult } from '@scaffai/types';
import { LegacyInputData, toLegacyInputData, fromLegacyInputData } from './InputDataAdapter';

interface ScaffoldContextType {
  inputData: LegacyInputData; // Use legacy format for UI compatibility
  result: ScaffoldCalculationResult | null;
  setInputData: (data: LegacyInputData) => void;
  setResult: (result: ScaffoldCalculationResult) => void;
  clearData: () => void;
  setInputValue: (field: string, subfield: string | null, value: any) => void;
  resetInputData: () => void;
  calculateScaffold: () => Promise<void>;
  isLoading: boolean;
}

const ScaffoldContext = createContext<ScaffoldContextType | undefined>(undefined);

interface ScaffoldProviderProps {
  children: ReactNode;
}

const defaultInputData: ScaffoldCalculationInput = {
  widthNS: 0,
  widthEW: 0,
  eavesN: 0,
  eavesE: 0,
  eavesS: 0,
  eavesW: 0,
  boundaryN: null,
  boundaryE: null,
  boundaryS: null,
  boundaryW: null,
  standardHeight: 0,
  roofShape: 'フラット',
  tieColumn: false,
  railingCount: 0,
  use355NS: 0,
  use300NS: 0,
  use150NS: 0,
  use355EW: 0,
  use300EW: 0,
  use150EW: 0,
  targetMargin: 900
};

export function ScaffoldProvider({ children }: ScaffoldProviderProps) {
  const [inputData, setInputDataState] = useState<LegacyInputData>(toLegacyInputData(defaultInputData));
  const [result, setResultState] = useState<ScaffoldCalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setInputData = (data: LegacyInputData) => {
    setInputDataState(data);
  };

  const setResult = (result: ScaffoldCalculationResult) => {
    setResultState(result);
  };

  const clearData = () => {
    setInputDataState(toLegacyInputData(defaultInputData));
    setResultState(null);
  };

  const setInputValue = (field: string, subfield: string | null, value: any) => {
    setInputDataState(prev => {
      const updated = { ...prev };
      if (subfield) {
        (updated as any)[field] = {
          ...(updated as any)[field],
          [subfield]: value
        };
      } else {
        (updated as any)[field] = value;
      }
      return updated;
    });
  };

  const resetInputData = () => {
    setInputDataState(toLegacyInputData(defaultInputData));
  };

  const calculateScaffold = async () => {
    setIsLoading(true);
    try {
      // Convert legacy format to new format for calculation
      const scaffoldInput = fromLegacyInputData(inputData);
      
      // Import scaffold engine and calculate
      const { calcAll } = await import('@scaffai/scaffold-engine');
      const result = calcAll(scaffoldInput);
      setResultState(result);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScaffoldContext.Provider
      value={{
        inputData,
        result,
        setInputData,
        setResult,
        clearData,
        setInputValue,
        resetInputData,
        calculateScaffold,
        isLoading,
      }}
    >
      {children}
    </ScaffoldContext.Provider>
  );
}

export function useScaffold() {
  const context = useContext(ScaffoldContext);
  if (context === undefined) {
    throw new Error('useScaffold must be used within a ScaffoldProvider');
  }
  return context;
}