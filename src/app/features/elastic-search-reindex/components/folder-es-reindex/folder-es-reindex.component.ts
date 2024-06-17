import { ReindexModalComponent } from '../../../../shared/components/reindex-modal/reindex-modal.component';
import { CommonService } from "./../../../../shared/services/common.service";
import { MatDialog } from "@angular/material/dialog";
import { FolderReindexState } from "../../store/reducers";
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
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "folder-es-reindex",
  templateUrl: "./folder-es-reindex.component.html",
  styleUrls: ["./folder-es-reindex.component.scss"],
})
export class FolderESReindexComponent implements OnInit, OnDestroy {
  folderReindexForm: FormGroup;
  folderReindexingDone$: Observable<reindexInfo>;
  reindexingError$: Observable<any>;
  folderReindexingDoneSubscription = new Subscription();
  reindexingErrorSubscription = new Subscription();
  reindexDialogClosedSubscription = new Subscription();
  commandId = "";
  @Output() pageTitle: EventEmitter<string> = new EventEmitter();

  constructor(
    private elasticSearchReindexService: ElasticSearchReindexService,
    public dialogService: MatDialog,
    private commonService: CommonService,
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
    this.reindexingError$ = this.store.pipe(
      select((state) => state.folderReindex?.error)
    );
  }

  ngOnInit(): void {
    this.elasticSearchReindexService.pageTitle.next(
      "Reindex a document and all of its children"
    );
    this.folderReindexingDoneSubscription =
      this.folderReindexingDone$.subscribe((data) => {
        if (data?.commandId) {
          this.commandId = data.commandId;
          this.dialogService.open(ReindexModalComponent, {
            disableClose: true,
            height: "320px",
            width: "550px",
            data: {
              type: ELASTIC_SEARCH_MESSAGES.modalType.success,
              header: `${ELASTIC_SEARCH_MESSAGES.reindexSucessModalTitle}`,
              successMessage: `${ELASTIC_SEARCH_MESSAGES.reindexingLaunched} ${data?.commandId}. ${ELASTIC_SEARCH_MESSAGES.copyMonitoringId}`,
              closeLabel: `${ELASTIC_SEARCH_MESSAGES.close}`,
              actionId: this.commandId,
              isSuccessModal: true
            },
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
    if (this.folderReindexForm.get("documentID")?.hasError("required")) {
      return ELASTIC_SEARCH_MESSAGES.invalidDocId;
    }
    return null;
  }

  onReindexFormSubmit(): void {
    if (this.folderReindexForm.valid) {
      const dialogRef = this.dialogService.open(
        ReindexModalComponent,
        {
          disableClose: true,
          height: "320px",
          width: "550px",
          data: {
            type: ELASTIC_SEARCH_MESSAGES.modalType.confirm,
            header: `${ELASTIC_SEARCH_MESSAGES.reindexConfirmationModalTitle}`,
            message: `${ELASTIC_SEARCH_MESSAGES.reindexWarning}`,
            isConfirmModal: true,
            abortLabel: `${ELASTIC_SEARCH_MESSAGES.abortLabel}`,
            continueLabel: `${ELASTIC_SEARCH_MESSAGES.continue}`,
            impactMessage: `${ELASTIC_SEARCH_MESSAGES.impactMessage}`
          },
        }
      );
      this.reindexDialogClosedSubscription = dialogRef
        .afterClosed()
        .subscribe((data) => {
          if (data?.isClosed) {
            if (
              data?.event === ELASTIC_SEARCH_REINDEX_MODAL_EVENT.isConfirmed
            ) {
              const sanitizedInput = this.sanitizer.sanitize(
                SecurityContext.HTML,
                this.folderReindexForm?.get("documentID")?.value
              );
              this.store.dispatch(
                ReindexActions.performFolderReindex({
                  docId: sanitizedInput,
                })
              );
              this.folderReindexForm.reset();
            }
          }
          document.getElementById("documentID")?.focus();
        });
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(ReindexActions.resetFolderReindexState());
    this.folderReindexingDoneSubscription.unsubscribe();
    this.reindexingErrorSubscription.unsubscribe();
    this.reindexDialogClosedSubscription.unsubscribe();
  }
}
