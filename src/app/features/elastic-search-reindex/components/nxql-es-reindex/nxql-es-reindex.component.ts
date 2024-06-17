import { CommonService } from "./../../../../shared/services/common.service";
import { MatDialog } from "@angular/material/dialog";
import { reindexInfo } from "../../elastic-search-reindex.interface";
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ELASTIC_SEARCH_MESSAGES,
  ELASTIC_SEARCH_REINDEX_MODAL_EVENT,
} from "../../elastic-search-reindex.constants";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import * as ReindexActions from "../../store/actions";
import { ReindexConfirmationModalComponent } from "src/app/shared/components/reindex/reindex-confirmation-modal/reindex-confirmation-modal.component";
import { ElasticSearchReindexService } from "../../services/elastic-search-reindex.service";
import { ReindexSuccessModalComponent } from "src/app/shared/components/reindex/reindex-success-modal/reindex-success-modal.component";
import { NXQLReindexState } from "../../store/reducers";
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
  @Output() pageTitle: EventEmitter<string> = new EventEmitter();

  constructor(
    private elasticSearchReindexService: ElasticSearchReindexService,
    public dialogService: MatDialog,
    private commonService: CommonService,
    private fb: FormBuilder,
    private store: Store<{ reindex: NXQLReindexState }>
  ) {
    this.nxqlReindexForm = this.fb.group({
      nxqlQuery: ["", Validators.required],
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
      "Reindex the results of a NXQL query"
    );

    this.reindexDialogClosedSubscription =
      this.commonService.reindexDialogClosed.subscribe((data) => {
        if (data?.isClosed) {
          if (data?.event === ELASTIC_SEARCH_REINDEX_MODAL_EVENT.isConfirmed) {
            this.store.dispatch(
              ReindexActions.performNxqlReindex({
                docId: this.nxqlReindexForm?.get("nxqlQuery")?.value,
              })
            );
          }
          this.nxqlReindexForm.reset();
        }
      });

    this.reindexingDoneSubscription = this.reindexingDone$.subscribe((data) => {
      if (data?.commandId) {
        this.dialogService.open(ReindexConfirmationModalComponent, {
          disableClose: true,
          data: {
            type: ELASTIC_SEARCH_MESSAGES.modalType.success,
            title: `${ELASTIC_SEARCH_MESSAGES.reindexConfirmationModalTitle}`,
            message: `${ELASTIC_SEARCH_MESSAGES.reindexingLaunched} ${data?.commandId}. ${ELASTIC_SEARCH_MESSAGES.copyMonitoringId}`,
          },
        });
      }
    });

    this.reindexingErrorSubscription = this.reindexingError$.subscribe(
      (error) => {
        if (error) {
          this.dialogService.open(ReindexConfirmationModalComponent, {
            disableClose: true,
            data: {
              type: ELASTIC_SEARCH_MESSAGES.modalType.error,
              title: `${ELASTIC_SEARCH_MESSAGES.reindexErrorModalTitle}`,
              message: `${ELASTIC_SEARCH_MESSAGES.reindexingError} ${error.message}`,
            },
          });
        }
      }
    );
  }

  getErrorMessage(): string | null {
    if (this.nxqlReindexForm.get("nxqlQuery")?.hasError("required")) {
      return ELASTIC_SEARCH_MESSAGES.invalidDocId;
    }
    return null;
  }

  onReindexFormSubmit(): void {
    if (this.nxqlReindexForm.valid) {
      this.dialogService.open(ReindexSuccessModalComponent, {
        disableClose: true,
        data: {
          type: ELASTIC_SEARCH_MESSAGES.modalType.confirm,
          title: `${ELASTIC_SEARCH_MESSAGES.reindexConfirmationModalTitle}`,
          message: `${ELASTIC_SEARCH_MESSAGES.reindexWarning}`,
        },
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
