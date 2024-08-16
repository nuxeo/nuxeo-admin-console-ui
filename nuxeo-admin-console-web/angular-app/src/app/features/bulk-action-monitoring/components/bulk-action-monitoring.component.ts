import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { CommonService } from './../../../shared/services/common.service';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Store, select } from "@ngrx/store";
import * as BulkActionMonitoringActions from "../store/actions";
import { HttpErrorResponse } from "@angular/common/http";
import { BulkActionMonitoringState } from "../store/reducers";
import { ErrorModalComponent } from './../../../shared/components/error-modal/error-modal.component';
import { ErrorDetails } from '../../elastic-search-reindex/elastic-search-reindex.interface';
import { ErrorModalClosedInfo } from '../../../shared/types/common.interface';
import { BULK_ACTION_LABELS } from "../bulk-action-monitoring.constants";
import { COMMON_LABELS, ERROR_MESSAGES, ERROR_MODAL_LABELS, ERROR_TYPES, MODAL_DIMENSIONS } from "../../../shared/constants/common.constants";
import { BulkActionMonitoringInfo } from '../bulk-action-monitoring.interface';

@Component({
  selector: "bulk-action-monitoring",
  templateUrl: "./bulk-action-monitoring.component.html",
  styleUrls: ["./bulk-action-monitoring.component.scss"],
})
export class BulkActionMonitoringComponent implements OnInit, OnDestroy {
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
  decodedUserInput = "";
  pageTitle = BULK_ACTION_LABELS.BULK_ACTION_TITLE;
  COMMON_LABELS = COMMON_LABELS;
  bulkActionResponse: BulkActionMonitoringInfo = {} as BulkActionMonitoringInfo;

  constructor(
    private commonService: CommonService,
    public dialogService: MatDialog,
    private fb: FormBuilder,
    private store: Store<{ bulkActionMonitoring: BulkActionMonitoringState }>,
    private route: ActivatedRoute,
    private router: Router
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
    this.route.paramMap.subscribe(params => {
      const bulkActionId = params.get('bulkActionId');
      if (bulkActionId) {
        this.bulkActionMonitoringForm.patchValue({ bulkActionId });
        this.onBulkActionFormSubmit();  // Auto-submit the form if needed
      }
    });

    this.bulkActionLaunchedSubscription =
      this.bulkActionMonitoringLaunched$.subscribe((data) => {
        if (data?.commandId) {
          this.bulkActionResponse = data;
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
            details: { status: error.error.status, message: error.error.message },
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
      /* The single quote is decoded and replaced with encoded backslash and single quotes, to form the request query correctly
          for bulk action monitoring endpoint. Other special characters are encoded by default by nuxeo js client, but not single quote */
      try {
        this.decodedUserInput =
          this.commonService.decodeAndReplaceSingleQuotes(
            decodeURIComponent(this.userInput)
          );
        this.store.dispatch(
          BulkActionMonitoringActions.performBulkActionMonitor({
            id: this.userInput,
          })
        );
        // Navigate to the URL with the bulk action ID
        this.router.navigate(['/bulk-action-monitoring', this.userInput]);
      } catch (error) {
        this.showBulkActionErrorModal({
          type: ERROR_TYPES.INVALID_ACTION_ID,
          details: {
            message: ERROR_MESSAGES.INVALID_ACTION_ID_MESSAGE,
          },
        });
      }
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
