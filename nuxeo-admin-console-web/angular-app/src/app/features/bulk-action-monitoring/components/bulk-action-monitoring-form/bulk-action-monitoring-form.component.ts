import { CommonService } from "../../../../shared/services/common.service";
import { ErrorModalComponent } from "../../../../shared/components/error-modal/error-modal.component";
import {
  COMMON_LABELS,
  ERROR_MODAL_LABELS,
  MODAL_DIMENSIONS,
} from "../../../../shared/constants/common.constants";
import { BULK_ACTION_LABELS } from "../../bulk-action-monitoring.constants";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import * as BulkActionMonitoringActions from "../../store/actions";
import { HttpErrorResponse } from "@angular/common/http";
import { BulkActionMonitoringState } from "../../store/reducers";
import { ErrorModalClosedInfo } from "../../../../shared/types/common.interface";
import { BulkActionMonitoringInfo } from "../../bulk-action-monitoring.interface";
import { ErrorDetails } from "../../../elastic-search-reindex/elastic-search-reindex.interface";

@Component({
  selector: "bulk-action-monitoring-form",
  templateUrl: "./bulk-action-monitoring-form.component.html",
  styleUrls: ["./bulk-action-monitoring-form.component.scss"],
})
export class BulkActionMonitoringFormComponent implements OnInit, OnDestroy {
  @Output() setBulkActionResponse =
    new EventEmitter<BulkActionMonitoringInfo>();
  bulkActionMonitoringForm: FormGroup;
  bulkActionError$: Observable<HttpErrorResponse | null>;
  bulkActionErrorSubscription = new Subscription();
  bulkActionLaunchedSubscription = new Subscription();
  errorDialogClosedSubscription = new Subscription();
  errorDialogRef: MatDialogRef<ErrorModalComponent, ErrorModalClosedInfo> =
    {} as MatDialogRef<ErrorModalComponent, ErrorModalClosedInfo>;
  bulkActionMonitoringLaunched$: Observable<BulkActionMonitoringInfo>;
  BULK_ACTION_LABELS = BULK_ACTION_LABELS;
  isBulkActionBtnDisabled = false;
  userInput = "";
  COMMON_LABELS = COMMON_LABELS;
  bulkActionResponse: BulkActionMonitoringInfo = {} as BulkActionMonitoringInfo;

  constructor(
    private commonService: CommonService,
    public dialogService: MatDialog,
    private fb: FormBuilder,
    private store: Store<{ bulkActionMonitoring: BulkActionMonitoringState }>
  ) {
    this.bulkActionMonitoringForm = this.fb.group({
      bulkActionId: ["", Validators.required],
    });

    this.bulkActionMonitoringLaunched$ = this.store.pipe(
      select((state) => state.bulkActionMonitoring?.bulkActionMonitoringInfo)
    );

    this.bulkActionError$ = this.store.pipe(
      select((state) => state.bulkActionMonitoring?.error)
    );
  }

  ngOnInit(): void {
    this.bulkActionLaunchedSubscription =
      this.bulkActionMonitoringLaunched$.subscribe((data) => {
        if (data?.commandId) {
          this.bulkActionResponse = data;
          this.setBulkActionResponse.emit(this.bulkActionResponse);
          this.isBulkActionBtnDisabled = false;
          this.bulkActionMonitoringForm.reset();
          document.getElementById("bulkActionId")?.focus();
        } else {
          this.bulkActionResponse = {} as BulkActionMonitoringInfo;
        }
      });
    this.bulkActionErrorSubscription = this.bulkActionError$.subscribe(
      (error) => {
        if (error && error.error) {
          this.showBulkActionErrorModal({
            type: ERROR_MODAL_LABELS.SERVER_ERROR,
            details: {
              status: error.error.status,
              message: error.error.message,
            },
          });
        }
      }
    );
  }

  showBulkActionErrorModal(error: ErrorDetails): void {
    this.store.dispatch(
      BulkActionMonitoringActions.resetBulkActionMonitorState()
    );
    this.errorDialogRef = this.dialogService.open(ErrorModalComponent, {
      disableClose: true,
      height: MODAL_DIMENSIONS.HEIGHT,
      width: MODAL_DIMENSIONS.WIDTH,
      data: {
        error,
      },
    });
    this.errorDialogClosedSubscription = this.errorDialogRef
      ?.afterClosed()
      ?.subscribe(() => {
        this.onBulkActionModalClose();
      });
  }

  onBulkActionModalClose(): void {
    this.isBulkActionBtnDisabled = false;
    document.getElementById("bulkActionId")?.focus();
  }

  getErrorMessage(): string | null {
    if (
      this.bulkActionMonitoringForm?.get("bulkActionId")?.hasError("required")
    ) {
      return BULK_ACTION_LABELS.REQUIRED_BULK_ACTION_ID_ERROR;
    }
    return null;
  }

  onBulkActionFormSubmit(): void {
    if (this.bulkActionMonitoringForm?.valid && !this.isBulkActionBtnDisabled) {
      this.isBulkActionBtnDisabled = true;
      this.userInput = this.commonService.removeLeadingCharacters(
        this.bulkActionMonitoringForm?.get("bulkActionId")?.value.trim()
      );
      this.store.dispatch(
        BulkActionMonitoringActions.performBulkActionMonitor({
          id: this.userInput,
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(
      BulkActionMonitoringActions.resetBulkActionMonitorState()
    );
    this.bulkActionLaunchedSubscription?.unsubscribe();
    this.bulkActionErrorSubscription?.unsubscribe();
    this.errorDialogClosedSubscription?.unsubscribe();
  }
}
