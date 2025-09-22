export interface GeneratedAddress {
  index: number;
  address: string;
  privateKey: string;
}

export interface GenerationConfig {
  prefix: string;
  suffix: string;
  count: number | string;
  outputMode: "screen" | "file";
  ignoreCase: boolean;
}

export interface ProgressStats {
  found: number;
  total: number;
  checked: number;
  elapsedTime: number;
  isComplete: boolean;
}

export interface EthereumGeneratorState {
  isGenerating: boolean;
  shouldStop: boolean;
  results: GeneratedAddress[];
  progress: ProgressStats;
  summary?: {
    totalChecked: number;
    totalTime: number;
    searchCriteria: string;
  };
}
