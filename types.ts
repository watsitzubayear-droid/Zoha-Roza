
export interface Signal {
  pair: string;
  time: string; // BDT format
  type: 'CALL' | 'PUT';
  probability: number;
  logic: string;
}

export interface AnalysisResult {
  nextCandle: 'GREEN' | 'RED' | 'WAIT';
  confidence: number;
  patternsIdentified: string[];
  reasoning: string;
}

export interface MarketPair {
  symbol: string;
  name: string;
  isOtc: boolean;
}
