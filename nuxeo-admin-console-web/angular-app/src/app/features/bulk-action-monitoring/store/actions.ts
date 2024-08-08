import { BulkActionMonitoringInfo } from './../bulk-action-monitoring.interface';
import { createAction, props } from "@ngrx/store";
import { HttpErrorResponse } from "@angular/common/http";

export const performBulkActionMonitor = createAction(
  "[Admin] Perform Bulk Action Monitor",
  props<{ id: string | null }>()
);
export const onBulkActionMonitorLaunch = createAction(
  "[Admin] On Bulk Action Monitor Launch",
  props<{ bulkActionMonitoringInfo: BulkActionMonitoringInfo }>()
);
export const onBulkActionMonitorFailure = createAction(
  "[Admin] On Bulk Action Monitor Failure",
  props<{ error: HttpErrorResponse }>()
);
export const resetBulkActionMonitorState = createAction(
  "[Admin] Reset Bulk Action Monitor State"
);

