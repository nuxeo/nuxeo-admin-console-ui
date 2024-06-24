import { ElasticSearchReindexModalComponent } from "../elastic-search-reindex-modal/elastic-search-reindex-modal.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { reindexInfo } from "../../elastic-search-reindex.interface";
import { Component, SecurityContext, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ELASTIC_SEARCH_LABELS } from "../../elastic-search-reindex.constants";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import * as ReindexActions from "../../store/actions";
import { ElasticSearchReindexService } from "../../services/elastic-search-reindex.service";
import { NXQLReindexState } from "../../store/reducers";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
@Component({
  selector: "nxql-es-reindex",
  templateUrl: "./nxql-es-reindex.component.html",
  styleUrls: ["./nxql-es-reindex.component.scss"],
})
export class NXQLESReindexComponent {
  nxqlReindexForm: FormGroup;
  nxqlReindexingDone$: Observable<reindexInfo>;
  nxqlReindexingError$: Observable<any>;
  nxqlReindexingDoneSubscription = new Subscription();
  nxqlReindexingErrorSubscription = new Subscription();
  reindexDialogClosedSubscription = new Subscription();
  commandId = "";
  hintSanitized: SafeHtml = "";
  confirmDialogClosedSubscription = new Subscription();
  successDialogClosedSubscription = new Subscription();
  errorDialogClosedSubscription = new Subscription();
  successDialogRef: MatDialogRef<any, any> = {} as MatDialogRef<any, any>;
  confirmDialogRef: MatDialogRef<any, any> = {} as MatDialogRef<any, any>;
  errorDialogRef: MatDialogRef<any, any> = {} as MatDialogRef<any, any>;
  ELASTIC_SEARCH_LABELS = ELASTIC_SEARCH_LABELS;

  constructor(
    private elasticSearchReindexService: ElasticSearchReindexService,
    public dialogService: MatDialog,
    private fb: FormBuilder,
    private store: Store<{ nxqlReindex: NXQLReindexState }>,
    private sanitizer: DomSanitizer,
    private cdref: ChangeDetectorRef
  ) {
    this.nxqlReindexForm = this.fb.group({
      nxqlQuery: ["", Validators.required],
    });
    this.nxqlReindexingDone$ = this.store.pipe(
      select((state) => state.nxqlReindex?.nxqlReindexInfo)
    );
    this.nxqlReindexingError$ = this.store.pipe(
      select((state) => state.nxqlReindex?.error)
    );
  }

  ngOnInit(): void {
    this.elasticSearchReindexService.pageTitle.next(
      `${ELASTIC_SEARCH_LABELS.NXQL_QUERY_REINDEX_TITLE}`
    );
    this.hintSanitized = this.sanitizer.bypassSecurityTrustHtml(
      ELASTIC_SEARCH_LABELS.HINT
    );

    this.nxqlReindexingDoneSubscription = this.nxqlReindexingDone$.subscribe(
      (data) => {
        if (data?.commandId) {
          this.commandId = data.commandId;
          this.successDialogRef = this.dialogService.open(
            ElasticSearchReindexModalComponent,
            {
              disableClose: true,
              height: "320px",
              width: "550px",
              data: {
                type: ELASTIC_SEARCH_LABELS.modalType.success,
                header: `${ELASTIC_SEARCH_LABELS.REINDEX_SUCESS_MODAL_TITLE}`,
                successMessage: `${ELASTIC_SEARCH_LABELS.REINDEXING_LAUNCHED} ${data?.commandId}. ${ELASTIC_SEARCH_LABELS.COPY_MONITORING_ID}`,
                closeLabel: `${ELASTIC_SEARCH_LABELS.CLOSE}`,
                commandId: this.commandId,
                COPY_ACTION_ID: `${ELASTIC_SEARCH_LABELS.COPY_ACTION_ID}`,
                isSuccessModal: true,
              },
            }
          );

          this.successDialogClosedSubscription = this.successDialogRef
            .afterClosed()
            .subscribe((data) => {
              if (data?.isClosed) {
                this.nxqlReindexForm?.reset();
                this.nxqlReindexForm.controls["nxqlQuery"].markAsUntouched();
                this.nxqlReindexForm.markAsUntouched();
                this.nxqlReindexForm.controls["nxqlQuery"].markAsPristine();
                this.nxqlReindexForm.markAsPristine();
                this.nxqlReindexForm.controls[
                  "nxqlQuery"
                ].updateValueAndValidity();
                this.nxqlReindexForm.updateValueAndValidity();
                document.getElementById("nxqlQuery")?.focus();
                // this.cdref.detectChanges();
              }
            });
        }
      }
    );

    this.nxqlReindexingErrorSubscription = this.nxqlReindexingError$.subscribe(
      (error) => {
        if (error) {
          this.errorDialogRef = this.dialogService.open(
            ElasticSearchReindexModalComponent,
            {
              disableClose: true,
              height: "320px",
              width: "550px",
              data: {
                type: ELASTIC_SEARCH_LABELS.modalType.error,
                header: `${ELASTIC_SEARCH_LABELS.REINDEX_ERRROR_MODAL_TITLE}`,
                errorMessage: `${ELASTIC_SEARCH_LABELS.REINDEXING_ERROR}`,
                errorMessageDetails: `${ELASTIC_SEARCH_LABELS.ERROR_DETAILS} ${error.message}`,
                closeLabel: `${ELASTIC_SEARCH_LABELS.CLOSE}`,
                isErrorModal: true,
              },
            }
          );
          this.errorDialogClosedSubscription = this.errorDialogRef
            .afterClosed()
            .subscribe((data) => {
              if (data?.isClosed) {
                document.getElementById("nxqlQuery")?.focus();
              }
            });
        }
      }
    );
  }

  getErrorMessage(): string | null {
    if (this.nxqlReindexForm?.get("nxqlQuery")?.hasError("required")) {
      return ELASTIC_SEARCH_LABELS.INVALID_NXQL_QUERY;
    }
    return null;
  }

  onReindexFormSubmit(): void {
    if (this.nxqlReindexForm.valid) {
      this.confirmDialogRef = this.dialogService.open(
        ElasticSearchReindexModalComponent,
        {
          disableClose: true,
          height: "320px",
          width: "550px",
          data: {
            type: ELASTIC_SEARCH_LABELS.modalType.confirm,
            header: `${ELASTIC_SEARCH_LABELS.REINDEX_CONFIRMATION_MODAL_TITLE}`,
            message: `${ELASTIC_SEARCH_LABELS.REINDEX_WARNING}`,
            isConfirmModal: true,
            ABORT_LABEL: `${ELASTIC_SEARCH_LABELS.ABORT_LABEL}`,
            continueLabel: `${ELASTIC_SEARCH_LABELS.CONTINUE}`,
            IMPACT_MESSAGE: `${ELASTIC_SEARCH_LABELS.IMPACT_MESSAGE}`,
            confirmContinue: `${ELASTIC_SEARCH_LABELS.CONTINUE_CONFIRMATION}`,
          },
        }
      );

      this.confirmDialogClosedSubscription = this.confirmDialogRef
        .afterClosed()
        .subscribe((data) => {
          if (data?.isClosed && data?.continue) {
            const sanitizedInput = this.sanitizer.sanitize(
              SecurityContext.HTML,
              this.nxqlReindexForm?.get("nxqlQuery")?.value
            );
            this.store.dispatch(
              ReindexActions.performNxqlReindex({
                nxqlQuery: sanitizedInput,
              })
            );
          } else {
            document.getElementById("nxqlQuery")?.focus();
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(ReindexActions.resetNxqlReindexState());
    this.nxqlReindexingDoneSubscription.unsubscribe();
    this.nxqlReindexingErrorSubscription.unsubscribe();
    this.reindexDialogClosedSubscription.unsubscribe();
    this.confirmDialogClosedSubscription.unsubscribe();
    this.successDialogClosedSubscription.unsubscribe();
    this.errorDialogClosedSubscription.unsubscribe();
  }
}
