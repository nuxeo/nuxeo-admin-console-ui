export interface BulkActionMonitoringInfo {
  "entity-type": string | null;
  commandId: string | null;
  state: string | null;
  processed: number;
  skipCount: number;
  error: boolean;
  errorCount: number;
  total: number;
  action: string | null;
  username: string | null;
  submitted: string | null;
  scrollStart: string | null;
  scrollEnd: string | null;
  processingStart: string | null;
  processingEnd: string | null;
  completed: string | null;
  processingMillis: number;
}
