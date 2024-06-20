import { ElasticSearchReindexModalComponent } from './../elastic-search-reindex-modal/elastic-search-reindex-modal.component';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { reindexInfo } from "../../elastic-search-reindex.interface";
import { Component, OnDestroy, OnInit, SecurityContext } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ELASTIC_SEARCH_LABELS,
  ELASTIC_SEARCH_REINDEX_MODAL_EVENT,
} from "../../elastic-search-reindex.constants";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import * as ReindexActions from "../../store/actions";
import { ElasticSearchReindexService } from "../../services/elastic-search-reindex.service";
import { DocumentReindexState } from "../../store/reducers";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "document-es-reindex",
  templateUrl: "./document-es-reindex.component.html",
  styleUrls: ["./document-es-reindex.component.scss"],
})
export class DocumentESReindexComponent implements OnInit, OnDestroy {
  reindexForm: FormGroup;
  reindexingDone$: Observable<reindexInfo>;
  reindexingError$: Observable<any>;
  reindexingDoneSubscription = new Subscription();
  reindexingErrorSubscription = new Subscription();
  reindexDialogClosedSubscription = new Subscription();
  confirmDialogClosedSubscription = new Subscription();
  successDialogClosedSubscription = new Subscription();
  errorDialogClosedSubscription = new Subscription();
  successDialogRef: MatDialogRef<any, any> = {} as MatDialogRef<any, any>;
  confirmDialogRef: MatDialogRef<any, any> = {} as MatDialogRef<any, any>;
  errorDialogRef: MatDialogRef<any, any> = {} as MatDialogRef<any, any>;

  commandId = "";
  ELASTIC_SEARCH_LABELS = ELASTIC_SEARCH_LABELS;

  constructor(
    private elasticSearchReindexService: ElasticSearchReindexService,
    public dialogService: MatDialog,
    private fb: FormBuilder,
    private store: Store<{ reindex: DocumentReindexState }>,
    private sanitizer: DomSanitizer
  ) {
    this.reindexForm = this.fb.group({
      documentID: ["", Validators.required],
    });
    this.reindexingDone$ = this.store.pipe(
      select((state) => state.reindex?.reindexInfo)
    );
    this.reindexingError$ = this.store.pipe(
      select((state) => state.reindex?.error)
    );
  }

  ngOnInit(): void {
    this.elasticSearchReindexService.pageTitle.next(
      `${ELASTIC_SEARCH_LABELS.SINGLEDOCREINDEXTITLE}`
    );
    this.reindexingDoneSubscription = this.reindexingDone$.subscribe((data) => {
      if (data?.commandId) {
        this.commandId = data.commandId;
        this.successDialogRef = this.dialogService.open(ElasticSearchReindexModalComponent, {
          disableClose: true,
          height: "320px",
          width: "550px",
          data: {
            type: ELASTIC_SEARCH_LABELS.modalType.success,
            header: `${ELASTIC_SEARCH_LABELS.reindexSucessModalTitle}`,
            successMessage: `${ELASTIC_SEARCH_LABELS.reindexingLaunched} ${data?.commandId}. ${ELASTIC_SEARCH_LABELS.copyMonitoringId}`,
            isConfirmModal: false,
            closeLabel: `${ELASTIC_SEARCH_LABELS.close}`,
            commandId: this.commandId,
            copyActionId: `${ELASTIC_SEARCH_LABELS.copyActionId}`,
            isSuccessModal: true,
          },
        });

        this.successDialogClosedSubscription = this.successDialogRef
          .afterClosed()
          .subscribe((data) => {
            if (data?.isClosed) {
              this.reindexForm?.reset();
              document.getElementById("documentID")?.focus();
            }
          });
      }
    });

    this.reindexingErrorSubscription = this.reindexingError$.subscribe(
      (error) => {
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
            ?.afterClosed()
            ?.subscribe((data) => {
              if (data?.isClosed) {
                document.getElementById("documentID")?.focus();
              }
            });
        }
      }
    );
  }

  getErrorMessage(): string | null {
    if (this.reindexForm?.get("documentID")?.hasError("required")) {
      return ELASTIC_SEARCH_LABELS.invalidDocIdOrPath;
    }
    return null;
  }

  onReindexFormSubmit(): void {
    if (this.reindexForm?.valid) {
      const sanitizedInput = this.sanitizer.sanitize(
        SecurityContext.HTML,
        this.reindexForm?.get("documentID")?.value
      );
      this.store.dispatch(
        ReindexActions.performDocumentReindex({
          documentID: sanitizedInput,
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(ReindexActions.resetDocumentReindexState());
    this.reindexingDoneSubscription.unsubscribe();
    this.reindexingErrorSubscription.unsubscribe();
    this.reindexDialogClosedSubscription.unsubscribe();
    this.successDialogClosedSubscription.unsubscribe();
    this.errorDialogClosedSubscription.unsubscribe();
  }
}
