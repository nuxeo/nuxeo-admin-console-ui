export interface BulkActionMonitoringInfo
  extends BulkActionInfoSummary,
    BulkActionInfoDetails {
  "entity-type": string | null;
}

export interface BulkActionInfoSummary {
  action: string | null;
  commandId: string | null;
  username: string | null;
  state: string | null;
  errorCount: number;
  total: number;
  submitted: string | null;
  processed: number;
}

export interface BulkActionInfoDetails {
  skipCount: number;
  processed: number;
  errorCount: number;
  error: boolean;
  scrollStart: string | null;
  scrollEnd: string | null;
  processingStart: string | null;
  processingEnd: string | null;
  completed: string | null;
  processingMillis: number;
}
