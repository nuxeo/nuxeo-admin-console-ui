import { ReindexModalComponent } from '../../../../shared/components/reindex-modal/reindex-modal.component';
import { CommonService } from "./../../../../shared/services/common.service";
import { MatDialog } from "@angular/material/dialog";
import { reindexInfo } from "../../elastic-search-reindex.interface";
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  SecurityContext,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ELASTIC_SEARCH_MESSAGES,
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
  commandId = "";
  @Output() pageTitle: EventEmitter<string> = new EventEmitter();

  constructor(
    private elasticSearchReindexService: ElasticSearchReindexService,
    public dialogService: MatDialog,
    private commonService: CommonService,
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
      "Reindex a single document"
    );
    this.reindexingDoneSubscription = this.reindexingDone$.subscribe((data) => {
      if (data?.commandId) {
        this.commandId = data.commandId;
        const dialogRef = this.dialogService.open(
          ReindexModalComponent,
          {
            disableClose: true,
            height: "320px",
            width: "550px",
            data: {
              type: ELASTIC_SEARCH_MESSAGES.modalType.success,
              header: `${ELASTIC_SEARCH_MESSAGES.reindexSucessModalTitle}`,
              successMessage: `${ELASTIC_SEARCH_MESSAGES.reindexingLaunched} ${data?.commandId}. ${ELASTIC_SEARCH_MESSAGES.copyMonitoringId}`,
              isConfirmModal: false,
              closeLabel: `${ELASTIC_SEARCH_MESSAGES.close}`,
              actionId: this.commandId,
              isSuccessModal: true
            },
          }
        );

        this.reindexDialogClosedSubscription = dialogRef
          .afterClosed()
          .subscribe((data) => {
            if (
              data?.isClosed &&
              data?.event === ELASTIC_SEARCH_REINDEX_MODAL_EVENT.isLaunched
            ) {
              this.reindexForm.reset();
            }
            document.getElementById("documentID")?.focus();
          });
      }
    });

    this.reindexingErrorSubscription = this.reindexingError$.subscribe(
      (error) => {
        if (error) {
          this.dialogService.open(ReindexModalComponent, {
            disableClose: true,
            height: "320px",
            width: "550px",
            data: {
              type: ELASTIC_SEARCH_MESSAGES.modalType.error,
              header: `${ELASTIC_SEARCH_MESSAGES.reindexErrorModalTitle}`,
              errorMessage: `${ELASTIC_SEARCH_MESSAGES.reindexingError} ${error.message}`,
              closeLabel: `${ELASTIC_SEARCH_MESSAGES.close}`,
              isErrorModal: true
            },
          });
        }
      }
    );
  }

  getErrorMessage(): string | null {
    if (this.reindexForm.get("documentID")?.hasError("required")) {
      return ELASTIC_SEARCH_MESSAGES.invalidDocIdOrPath;
    }
    return null;
  }

  onReindexFormSubmit(): void {
    if (this.reindexForm.valid) {
      const sanitizedInput = this.sanitizer.sanitize(
        SecurityContext.HTML,
        this.reindexForm?.get("documentID")?.value
      );
      this.store.dispatch(
        ReindexActions.performDocumentReindex({
          docId: sanitizedInput,
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(ReindexActions.resetDocumentReindexState());
    this.reindexingDoneSubscription.unsubscribe();
    this.reindexingErrorSubscription.unsubscribe();
  }
}
