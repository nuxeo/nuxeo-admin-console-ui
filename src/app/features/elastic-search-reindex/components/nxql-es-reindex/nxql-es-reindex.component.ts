import { ReindexModalComponent } from "../../../../shared/components/reindex-modal/reindex-modal.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { reindexInfo } from "../../elastic-search-reindex.interface";
import { Component, SecurityContext } from "@angular/core";
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
    private sanitizer: DomSanitizer
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
      "Reindex the results of a NXQL query"
    );
    this.hintSanitized = this.sanitizer.bypassSecurityTrustHtml(
      ELASTIC_SEARCH_LABELS.hint
    );

    this.nxqlReindexingDoneSubscription = this.nxqlReindexingDone$.subscribe(
      (data) => {
        if (data?.commandId) {
          this.commandId = data.commandId;
          this.successDialogRef = this.dialogService.open(
            ReindexModalComponent,
            {
              disableClose: true,
              height: "320px",
              width: "550px",
              data: {
                type: ELASTIC_SEARCH_LABELS.modalType.success,
                header: `${ELASTIC_SEARCH_LABELS.reindexSucessModalTitle}`,
                successMessage: `${ELASTIC_SEARCH_LABELS.reindexingLaunched} ${data?.commandId}. ${ELASTIC_SEARCH_LABELS.copyMonitoringId}`,
                closeLabel: `${ELASTIC_SEARCH_LABELS.close}`,
                commandId: this.commandId,
                copyActionId: `${ELASTIC_SEARCH_LABELS.copyActionId}`,
                isSuccessModal: true,
              },
            }
          );

          this.successDialogClosedSubscription = this.successDialogRef
            .afterClosed()
            .subscribe((data) => {
              if (data?.isClosed) {
                this.nxqlReindexForm?.reset();
              //   this.nxqlReindexForm.controls['nxqlQuery'].setErrors(null);
               //  this.nxqlReindexForm.setErrors(null)
               // this.nxqlReindexForm.controls['nxqlQuery'].markAsUntouched();
              //  this.nxqlReindexForm.controls['nxqlQuery'].updateValueAndValidity();
                document.getElementById("nxqlQuery")?.focus();
              }
            });
        }
      }
    );

    this.nxqlReindexingErrorSubscription = this.nxqlReindexingError$.subscribe(
      (error) => {
        if (error) {
          this.errorDialogRef = this.dialogService.open(ReindexModalComponent, {
            disableClose: true,
            height: "320px",
            width: "550px",
            data: {
              type: ELASTIC_SEARCH_LABELS.modalType.error,
              header: `${ELASTIC_SEARCH_LABELS.reindexErrorModalTitle}`,
              errorMessage: `${ELASTIC_SEARCH_LABELS.reindexingError} ${error.message}`,
              closeLabel: `${ELASTIC_SEARCH_LABELS.close}`,
              isErrorModal: true,
            },
          });
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
      return ELASTIC_SEARCH_LABELS.invalidNXQLQuery;
    }
    return null;
  }

  onReindexFormSubmit(): void {
    if (this.nxqlReindexForm.valid) {
      this.confirmDialogRef = this.dialogService.open(ReindexModalComponent, {
        disableClose: true,
        height: "320px",
        width: "550px",
        data: {
          type: ELASTIC_SEARCH_LABELS.modalType.confirm,
          header: `${ELASTIC_SEARCH_LABELS.reindexConfirmationModalTitle}`,
          message: `${ELASTIC_SEARCH_LABELS.reindexWarning}`,
          isConfirmModal: true,
          abortLabel: `${ELASTIC_SEARCH_LABELS.abortLabel}`,
          continueLabel: `${ELASTIC_SEARCH_LABELS.continue}`,
          impactMessage: `${ELASTIC_SEARCH_LABELS.impactMessage}`,
          confirmContinue: `${ELASTIC_SEARCH_LABELS.continueConfirmation}`,
        },
      });

      this.confirmDialogClosedSubscription = this.confirmDialogRef
        .afterClosed()
        .subscribe((data) => {
          if (data?.isClosed) {
            const sanitizedInput = this.sanitizer.sanitize(
              SecurityContext.HTML,
              this.nxqlReindexForm?.get("nxqlQuery")?.value
            );
            this.store.dispatch(
              ReindexActions.performNxqlReindex({
                nxqlQuery: sanitizedInput,
              })
            );
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
