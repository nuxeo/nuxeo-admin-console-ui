import { ElasticSearchReindexModalComponent } from "./../elastic-search-reindex-modal/elastic-search-reindex-modal.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { reindexInfo } from "../../elastic-search-reindex.interface";
import { Component, OnDestroy, OnInit, SecurityContext } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ELASTIC_SEARCH_LABELS,
  ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS,
} from "../../elastic-search-reindex.constants";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import * as ReindexActions from "../../store/actions";
import { ElasticSearchReindexService } from "../../services/elastic-search-reindex.service";
import { DocumentReindexState } from "../../store/reducers";
import { DomSanitizer } from "@angular/platform-browser";
// @ts-ignore
import Nuxeo from "nuxeo";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "document-es-reindex",
  templateUrl: "./document-es-reindex.component.html",
  styleUrls: ["./document-es-reindex.component.scss"],
})
export class DocumentESReindexComponent implements OnInit, OnDestroy {
  documentReindexForm: FormGroup;
  documentReindexingLaunched$: Observable<reindexInfo>;
  documentReindexingError$: Observable<HttpErrorResponse>;
  documentReindexingLaunchedSubscription = new Subscription();
  documentReindexingErrorSubscription = new Subscription();
  reindexDialogClosedSubscription = new Subscription();
  confirmDialogClosedSubscription = new Subscription();
  launchedDialogClosedSubscription = new Subscription();
  errorDialogClosedSubscription = new Subscription();
  launchedDialogRef: MatDialogRef<any, any> = {} as MatDialogRef<any, any>;
  confirmDialogRef: MatDialogRef<any, any> = {} as MatDialogRef<any, any>;
  errorDialogRef: MatDialogRef<any, any> = {} as MatDialogRef<any, any>;
  nuxeo: Nuxeo;
  ELASTIC_SEARCH_LABELS = ELASTIC_SEARCH_LABELS;

  constructor(
    private elasticSearchReindexService: ElasticSearchReindexService,
    public dialogService: MatDialog,
    private fb: FormBuilder,
    private store: Store<{ reindex: DocumentReindexState }>,
    private sanitizer: DomSanitizer
  ) {
    this.documentReindexForm = this.fb.group({
      documentIdentifier: ["", Validators.required],
    });
    this.documentReindexingLaunched$ = this.store.pipe(
      select((state) => state.reindex?.reindexInfo)
    );
    this.documentReindexingError$ = this.store.pipe(
      select((state) => state.reindex?.error)
    );
  }

  ngOnInit(): void {
    this.initiateJSClient();
    this.elasticSearchReindexService.pageTitle.next(
      `${ELASTIC_SEARCH_LABELS.DOCUMENT_REINDEX_TITLE}`
    );
    this.documentReindexingLaunchedSubscription =
      this.documentReindexingLaunched$.subscribe((data) => {
        if (data?.commandId) {
          this.showReindexLaunchedModal(data?.commandId);
        }
      });

    this.documentReindexingErrorSubscription =
      this.documentReindexingError$.subscribe((error) => {
        if (error) {
        }
      });
  }

  showReindexErrorModal(error: any): void {
    this.errorDialogRef = this.dialogService.open(
      ElasticSearchReindexModalComponent,
      {
        disableClose: true,
        height: ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS.height,
        width: ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS.width,
        data: {
          type: ELASTIC_SEARCH_LABELS.MODAL_TYPE.error,
          title: `${ELASTIC_SEARCH_LABELS.REINDEX_ERRROR_MODAL_TITLE}`,
          errorMessageHeader: `${ELASTIC_SEARCH_LABELS.REINDEXING_ERROR}`,
          error: error,
          closeLabel: `${ELASTIC_SEARCH_LABELS.CLOSE_LABEL}`,
          isErrorModal: true,
        },
      }
    );
    this.errorDialogClosedSubscription = this.errorDialogRef
      ?.afterClosed()
      ?.subscribe((data) => {
        if (data?.isClosed) {
          this.onReindexErrorModalClose();
        }
      });
  }

  onReindexErrorModalClose(): void {
    document.getElementById("documentIdentifier")?.focus();
  }

  showReindexLaunchedModal(commandId: string | null): void {
    this.launchedDialogRef = this.dialogService.open(
      ElasticSearchReindexModalComponent,
      {
        disableClose: true,
        height: ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS.height,
        width: ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS.width,
        data: {
          type: ELASTIC_SEARCH_LABELS.MODAL_TYPE.launched,
          title: `${ELASTIC_SEARCH_LABELS.REINDEX_LAUNCHED_MODAL_TITLE}`,
          launchedMessage: `${ELASTIC_SEARCH_LABELS.REINDEX_LAUNCHED} ${commandId}. ${ELASTIC_SEARCH_LABELS.COPY_MONITORING_ID}`,
          isConfirmModal: false,
          closeLabel: `${ELASTIC_SEARCH_LABELS.CLOSE_LABEL}`,
          commandId,
          copyActionId: `${ELASTIC_SEARCH_LABELS.COPY_ACTION_ID_BUTTON_LABEL}`,
          isLaunchedModal: true,
        },
      }
    );

    this.launchedDialogClosedSubscription = this.launchedDialogRef
      .afterClosed()
      .subscribe((data) => {
        if (data?.isClosed) {
          this.onReindexLaunchedModalClose();
        }
      });
  }

  onReindexLaunchedModalClose(): void {
    this.documentReindexForm?.reset();
    document.getElementById("documentIdentifier")?.focus();
  }

  initiateJSClient(): void {
    this.nuxeo = new Nuxeo({
      auth: {
        method: "basic",
        username: "Administrator",
        password: "Administrator",
      },
    });
  }

  getErrorMessage(): string | null {
    if (
      this.documentReindexForm?.get("documentIdentifier")?.hasError("required")
    ) {
      return ELASTIC_SEARCH_LABELS.INVALID_DOCID_OR_PATH_ERROR;
    }
    return null;
  }

  onReindexFormSubmit(): void {
    if (this.documentReindexForm?.valid) {
      const sanitizedUserInput = this.sanitizer.sanitize(
        SecurityContext.HTML,
        this.documentReindexForm?.get("documentIdentifier")?.value
      );
      const requestQuery = `${ELASTIC_SEARCH_LABELS.SELECT_BASE_QUERY} ecm:path='${sanitizedUserInput}'`;
   //    this.triggerReindex(sanitizedUserInput); // TODO: Remove this if api call does not need to be sent with query
      this.store.dispatch(
        ReindexActions.performDocumentReindex({
          requestQuery
        })
      ); 
    }
  }

  triggerReindex(userInput: string | null): void {
    this.nuxeo
      .repository()
      .fetch(userInput)
      .then((document: any) => {
     //   const documentPath = document.path ? document.path : "";
        const requestQuery = `${ELASTIC_SEARCH_LABELS.SELECT_BASE_QUERY} ecm:uuid='${userInput}'`;
        this.store.dispatch(
          ReindexActions.performDocumentReindex({
            requestQuery: requestQuery,
          })
        );
      })
      .catch((err: any) => err.response.json())
      .then((errorJson: any) => {
        this.store.dispatch(
          ReindexActions.onDocumentReindexFailure({ error: errorJson })
        );
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch(ReindexActions.resetDocumentReindexState());
    this.documentReindexingLaunchedSubscription?.unsubscribe();
    this.documentReindexingErrorSubscription?.unsubscribe();
    this.reindexDialogClosedSubscription?.unsubscribe();
    this.launchedDialogClosedSubscription?.unsubscribe();
    this.errorDialogClosedSubscription?.unsubscribe();
  }
}
