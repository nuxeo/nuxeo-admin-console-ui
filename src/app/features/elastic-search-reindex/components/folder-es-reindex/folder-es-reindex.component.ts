import { ElasticSearchReindexModalComponent } from "../elastic-search-reindex-modal/elastic-search-reindex-modal.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FolderReindexState } from "../../store/reducers";
import { reindexInfo } from "../../elastic-search-reindex.interface";
import { Component, OnDestroy, OnInit, SecurityContext } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ELASTIC_SEARCH_LABELS } from "../../elastic-search-reindex.constants";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import * as ReindexActions from "../../store/actions";
import { ElasticSearchReindexService } from "../../services/elastic-search-reindex.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "folder-es-reindex",
  templateUrl: "./folder-es-reindex.component.html",
  styleUrls: ["./folder-es-reindex.component.scss"],
})
export class FolderESReindexComponent implements OnInit, OnDestroy {
  folderReindexForm: FormGroup;
  folderReindexingDone$: Observable<reindexInfo>;
  folderReindexingError$: Observable<any>;
  folderReindexingDoneSubscription = new Subscription();
  folderReindexingErrorSubscription = new Subscription();
  confirmDialogClosedSubscription = new Subscription();
  successDialogClosedSubscription = new Subscription();
  errorDialogClosedSubscription = new Subscription();
  commandId = "";
  successDialogRef: MatDialogRef<any, any> = {} as MatDialogRef<any, any>;
  confirmDialogRef: MatDialogRef<any, any> = {} as MatDialogRef<any, any>;
  errorDialogRef: MatDialogRef<any, any> = {} as MatDialogRef<any, any>;
  ELASTIC_SEARCH_LABELS = ELASTIC_SEARCH_LABELS;

  constructor(
    private elasticSearchReindexService: ElasticSearchReindexService,
    public dialogService: MatDialog,
    private fb: FormBuilder,
    private store: Store<{ folderReindex: FolderReindexState }>,
    private sanitizer: DomSanitizer
  ) {
    this.folderReindexForm = this.fb.group({
      documentID: ["", Validators.required],
    });
    this.folderReindexingDone$ = this.store.pipe(
      select((state) => state.folderReindex?.folderReindexInfo)
    );
    this.folderReindexingError$ = this.store.pipe(
      select((state) => state.folderReindex?.error)
    );
  }

  ngOnInit(): void {
    this.elasticSearchReindexService.pageTitle.next(
      `${ELASTIC_SEARCH_LABELS.FOLDERDOCREINDEXTITLE}`
    );
    this.folderReindexingDoneSubscription =
      this.folderReindexingDone$.subscribe((data) => {
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
                isSuccessModal: true,
                copyActionId: `${ELASTIC_SEARCH_LABELS.copyActionId}`,
              },
            }
          );
          this.successDialogClosedSubscription = this.successDialogRef
            .afterClosed()
            .subscribe((data) => {
              if (data?.isClosed) {
                this.folderReindexForm?.reset();
                document.getElementById("documentID")?.focus();
              }
            });
        }
      });

    this.folderReindexingErrorSubscription =
      this.folderReindexingError$.subscribe((error) => {
        if (error) {
          this.errorDialogRef = this.dialogService.open(ElasticSearchReindexModalComponent, {
            disableClose: true,
            height: "320px",
            width: "550px",
            data: {
              type: ELASTIC_SEARCH_LABELS.modalType.error,
              header: `${ELASTIC_SEARCH_LABELS.reindexErrorModalTitle}`,
              errorMessage: `${ELASTIC_SEARCH_LABELS.reindexingError}`,
              errorMessageDetails: `${ELASTIC_SEARCH_LABELS.errorDetails} ${error.message}`,
              closeLabel: `${ELASTIC_SEARCH_LABELS.close}`,
              isErrorModal: true,
            },
          });
          this.errorDialogClosedSubscription = this.errorDialogRef
            .afterClosed()
            .subscribe((data) => {
              if (data?.isClosed) {
                document.getElementById("documentID")?.focus();
              }
            });
        }
      });
  }

  getErrorMessage(): string | null {
    if (this.folderReindexForm?.get("documentID")?.hasError("required")) {
      return ELASTIC_SEARCH_LABELS.invalidDocId;
    }
    return null;
  }

  onReindexFormSubmit(): void {
    if (this.folderReindexForm?.valid) {
      this.confirmDialogRef = this.dialogService.open(ElasticSearchReindexModalComponent, {
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
              this.folderReindexForm?.get("documentID")?.value
            );
            this.store.dispatch(
              ReindexActions.performFolderReindex({
                documentID: sanitizedInput,
              })
            );
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(ReindexActions.resetFolderReindexState());
    this.folderReindexingDoneSubscription.unsubscribe();
    this.folderReindexingErrorSubscription.unsubscribe();
    this.confirmDialogClosedSubscription.unsubscribe();
    this.successDialogClosedSubscription.unsubscribe();
    this.errorDialogClosedSubscription.unsubscribe();
  }
}
