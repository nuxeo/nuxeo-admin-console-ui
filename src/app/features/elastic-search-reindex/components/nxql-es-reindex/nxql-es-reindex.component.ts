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

// @ts-ignore
import Nuxeo from "nuxeo";

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
  nuxeo: any;
  docPath = "";
  noOfDocs = 0;

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
    this.initiateJSClient();
    this.elasticSearchReindexService.pageTitle.next(
      `${ELASTIC_SEARCH_LABELS.NXQLQUERYREINDEXTITLE}`
    );
    this.hintSanitized = this.sanitizer.bypassSecurityTrustHtml(
      ELASTIC_SEARCH_LABELS.hint
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
                header: `${ELASTIC_SEARCH_LABELS.reindexErrorModalTitle}`,
                errorMessage: `${ELASTIC_SEARCH_LABELS.reindexingError}`,
                errorMessageDetails: `${ELASTIC_SEARCH_LABELS.errorDetails} ${
                  error.status ? error.status : ""
                } ${error.message ? error.message : "Invalid input !"}`,
                closeLabel: `${ELASTIC_SEARCH_LABELS.close}`,
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

  initiateJSClient(): void {
    // const baseUrl = "http://localhost:4200/nuxeo";
    /* Creating Nuxeo client */

    this.nuxeo = new Nuxeo({
      //  baseURL: baseUrl,
      auth: {
        method: "basic",
        username: "Administrator",
        password: "Administrator",
      },
    });
  }

  getErrorMessage(): string | null {
    if (this.nxqlReindexForm?.get("nxqlQuery")?.hasError("required")) {
      return ELASTIC_SEARCH_LABELS.invalidNXQLQuery;
    }
    return null;
  }

  onReindexFormSubmit(): void {
    if (this.nxqlReindexForm.valid) {
      const sanitizedInput = this.sanitizer.sanitize(
        SecurityContext.HTML,
        this.nxqlReindexForm?.get("nxqlQuery")?.value
      );
      this.fetchNoOfDocs(sanitizedInput);
    }
  }

  fetchNoOfDocs(userInput: string | null): void {
    this.nuxeo
      .repository()
      .query({ query: userInput })
      .then((doc: any) => {
        this.noOfDocs = doc.resultsCount ? doc.resultsCount : 0;
        this.confirmDialogRef = this.dialogService.open(
          ElasticSearchReindexModalComponent,
          {
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
              noOfDocs: this.noOfDocs,
              time: `${this.noOfDocs / 2000} s`,
            },
          }
        );

        this.confirmDialogClosedSubscription = this.confirmDialogRef
          .afterClosed()
          .subscribe((data) => {
            if (data?.isClosed && data?.continue) {
              /*  this.store.dispatch(
              ReindexActions.performNxqlReindex({
                nxqlQuery: sanitizedInput,
              })
            ); */
            } else {
              document.getElementById("nxqlQuery")?.focus();
            }
          });
      })
      .catch((err: any) => err.response.json())
      .then((json: any) => {
        this.store.dispatch(
          ReindexActions.onNxqlReindexFailure({ error: json })
        );
      });
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
