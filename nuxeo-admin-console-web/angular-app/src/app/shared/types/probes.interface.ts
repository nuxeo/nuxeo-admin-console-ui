export interface ProbeStatus {
  "entity-type"?: string;
  neverExecuted: boolean;
  success: boolean;
  infos: {
    info: string;
  };
}

export interface ProbeHistory {
  lastRun: string | null;
  lastSuccess: string;
  lastFail: string;
}

export interface ProbeCounts {
  run: number;
  success: number;
  failure: number;
}

export interface Probe {
  "entity-type"?: string;
  name: string;
  status: ProbeStatus;
  history: ProbeHistory;
  counts?: ProbeCounts;
  time?: number;
}

export interface ProbesResponse {
  "entity-type"?: string;
  entries: Probe[];
}
