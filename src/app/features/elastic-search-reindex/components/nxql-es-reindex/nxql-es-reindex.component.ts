import { ReindexModalComponent } from "../../../../shared/components/reindex-modal/reindex-modal.component";
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
  ELASTIC_SEARCH_LABELS,
  ELASTIC_SEARCH_REINDEX_MODAL_EVENT,
} from "../../elastic-search-reindex.constants";
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
  reindexingDone$: Observable<reindexInfo>;
  reindexingError$: Observable<any>;
  reindexingDoneSubscription = new Subscription();
  reindexingErrorSubscription = new Subscription();
  reindexDialogClosedSubscription = new Subscription();
  commandId = "";
  hintSanitized: SafeHtml = "";
  @Output() pageTitle: EventEmitter<string> = new EventEmitter();

  constructor(
    private elasticSearchReindexService: ElasticSearchReindexService,
    public dialogService: MatDialog,
    private commonService: CommonService,
    private fb: FormBuilder,
    private store: Store<{ nxqlReindex: NXQLReindexState }>,
    private sanitizer: DomSanitizer
  ) {
    this.nxqlReindexForm = this.fb.group({
      nxqlQuery: ["", Validators.required],
    });
    this.reindexingDone$ = this.store.pipe(
      select((state) => state.nxqlReindex?.nxqlReindexInfo)
    );
    this.reindexingError$ = this.store.pipe(
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

    this.reindexingDoneSubscription = this.reindexingDone$.subscribe((data) => {
      if (data?.commandId) {
        this.commandId = data.commandId;
        this.dialogService.open(ReindexModalComponent, {
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
              type: ELASTIC_SEARCH_LABELS.modalType.error,
              header: `${ELASTIC_SEARCH_LABELS.reindexErrorModalTitle}`,
              errorMessage: `${ELASTIC_SEARCH_LABELS.reindexingError} ${error.message}`,
              closeLabel: `${ELASTIC_SEARCH_LABELS.close}`,
              isErrorModal: true,
            },
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
      const dialogRef = this.dialogService.open(ReindexModalComponent, {
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

      this.reindexDialogClosedSubscription = dialogRef
        .afterClosed()
        .subscribe((data) => {
          if (data?.isClosed) {
            if (
              data?.event === ELASTIC_SEARCH_REINDEX_MODAL_EVENT.isConfirmed
            ) {
              const sanitizedInput = this.sanitizer.sanitize(
                SecurityContext.HTML,
                this.nxqlReindexForm?.get("nxqlQuery")?.value
              );
              this.store.dispatch(
                ReindexActions.performNxqlReindex({
                  nxqlQuery: sanitizedInput,
                })
              );
              this.nxqlReindexForm?.reset();
            }
            document.getElementById("nxqlQuery")?.focus();
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(ReindexActions.resetNxqlReindexState());
    this.reindexingDoneSubscription.unsubscribe();
    this.reindexingErrorSubscription.unsubscribe();
    this.reindexDialogClosedSubscription.unsubscribe();
  }
}
