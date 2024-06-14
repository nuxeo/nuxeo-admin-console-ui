import { CommonService } from "./../../../../shared/services/common.service";
import { MatDialog } from "@angular/material/dialog";
import { ReindexState } from "../../store/reducers";
import { reindexInfo } from "../../elastic-search-reindex.interface";
import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ELASTIC_SEARCH_MESSAGES } from "../../elastic-search-reindex.constants";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import * as ReindexActions from "../../store/actions";
import { ReindexConfirmationModalComponent } from "src/app/shared/components/reindex/reindex-confirmation-modal/reindex-confirmation-modal.component";
import { ElasticSearchReindexService } from "../../services/elastic-search-reindex.service";

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
  @Output() pageTitle: EventEmitter<string> = new EventEmitter();
  constructor(
    private elasticSearchReindexService: ElasticSearchReindexService,
    public dialogService: MatDialog,
    private commonService: CommonService,
    private fb: FormBuilder,
    private store: Store<{ reindex: ReindexState }>
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
  this.elasticSearchReindexService.pageTitle.next("Reindex a single document");
    this.reindexDialogClosedSubscription =
      this.commonService.reindexDialogClosed.subscribe((isDialogClosed) => {
        if (isDialogClosed) {
          this.reindexForm.reset();
        }
      });
    this.reindexingDoneSubscription = this.reindexingDone$.subscribe((data) => {
      console.log(data?.commandId);
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
        console.log(error);
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
    if (this.reindexForm.get("documentID")?.hasError("required")) {
      return ELASTIC_SEARCH_MESSAGES.invalidDocIdOrPath;
    }
    return null;
  }

  onSubmit() {
    if (this.reindexForm.valid) {
      this.store.dispatch(
        ReindexActions.performReindex({
          docId: this.reindexForm?.get("documentID")?.value,
        })
      );
      console.log("Reindexing is done");
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(ReindexActions.resetReindexState());
    this.reindexingDoneSubscription.unsubscribe();
    this.reindexingErrorSubscription.unsubscribe();
  }
}
