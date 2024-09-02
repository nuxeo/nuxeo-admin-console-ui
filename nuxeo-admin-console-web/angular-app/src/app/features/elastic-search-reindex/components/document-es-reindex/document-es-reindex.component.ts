import { NuxeoJSClientService } from "./../../../../shared/services/nuxeo-js-client.service";
import {
  ELASTIC_SEARCH_LABELS,
  ELASTIC_SEARCH_REINDEX_ERROR_MESSAGES,
  ELASTIC_SEARCH_REINDEX_ERROR_TYPES,
} from "./../../elastic-search-reindex.constants";
import { ElasticSearchReindexModalComponent } from "./../elastic-search-reindex-modal/elastic-search-reindex-modal.component";
import {
  ErrorDetails,
  ReindexModalClosedInfo,
} from "./../../elastic-search-reindex.interface";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ReindexInfo } from "../../elastic-search-reindex.interface";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS } from "../../elastic-search-reindex.constants";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import * as ReindexActions from "../../store/actions";
import { ElasticSearchReindexService } from "../../services/elastic-search-reindex.service";
import { DocumentReindexState } from "../../store/reducers";
import { HttpErrorResponse } from "@angular/common/http";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Nuxeo from "nuxeo";

@Component({
  selector: "document-es-reindex",
  templateUrl: "./document-es-reindex.component.html",
  styleUrls: ["./document-es-reindex.component.scss"],
})
export class DocumentESReindexComponent implements OnInit, OnDestroy {
  documentReindexForm: FormGroup;
  documentReindexingLaunched$: Observable<ReindexInfo>;
  documentReindexingError$: Observable<HttpErrorResponse | null>;
  documentReindexingLaunchedSubscription = new Subscription();
  documentReindexingErrorSubscription = new Subscription();
  reindexDialogClosedSubscription = new Subscription();
  confirmDialogClosedSubscription = new Subscription();
  launchedDialogClosedSubscription = new Subscription();
  errorDialogClosedSubscription = new Subscription();
  launchedDialogRef: MatDialogRef<
    ElasticSearchReindexModalComponent,
    ReindexModalClosedInfo
  > = {} as MatDialogRef<
    ElasticSearchReindexModalComponent,
    ReindexModalClosedInfo
  >;
  confirmDialogRef: MatDialogRef<
    ElasticSearchReindexModalComponent,
    ReindexModalClosedInfo
  > = {} as MatDialogRef<
    ElasticSearchReindexModalComponent,
    ReindexModalClosedInfo
  >;
  errorDialogRef: MatDialogRef<
    ElasticSearchReindexModalComponent,
    ReindexModalClosedInfo
  > = {} as MatDialogRef<
    ElasticSearchReindexModalComponent,
    ReindexModalClosedInfo
  >;

  ELASTIC_SEARCH_LABELS = ELASTIC_SEARCH_LABELS;
  nuxeo: Nuxeo;
  isReindexBtnDisabled = false;

  constructor(
    private elasticSearchReindexService: ElasticSearchReindexService,
    public dialogService: MatDialog,
    private fb: FormBuilder,
    private store: Store<{ reindex: DocumentReindexState }>,
    private nuxeoJSClientService: NuxeoJSClientService
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
    this.nuxeo = this.nuxeoJSClientService.getNuxeoInstance();
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
          this.showReindexErrorModal({
            type: ELASTIC_SEARCH_REINDEX_ERROR_TYPES.SERVER_ERROR,
            details: { status: error.status, message: error.message },
          });
        }
      });
  }

  showReindexErrorModal(error: ErrorDetails): void {
    this.errorDialogRef = this.dialogService.open(
      ElasticSearchReindexModalComponent,
      {
        disableClose: true,
        height: ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS.HEIGHT,
        width: ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS.WIDTH,
        data: {
          type: ELASTIC_SEARCH_LABELS.MODAL_TYPE.error,
          title: `${ELASTIC_SEARCH_LABELS.REINDEX_ERRROR_MODAL_TITLE}`,
          errorMessageHeader: `${ELASTIC_SEARCH_LABELS.REINDEXING_ERROR}`,
          error,
          closeLabel: `${ELASTIC_SEARCH_LABELS.CLOSE_LABEL}`,
          isErrorModal: true,
        },
      }
    );
    this.errorDialogClosedSubscription = this.errorDialogRef
      ?.afterClosed()
      ?.subscribe(() => {
        this.onReindexErrorModalClose();
      });
  }

  onReindexErrorModalClose(): void {
    this.isReindexBtnDisabled = false;
    document.getElementById("documentIdentifier")?.focus();
  }

  showReindexLaunchedModal(commandId: string | null): void {
    this.launchedDialogRef = this.dialogService.open(
      ElasticSearchReindexModalComponent,
      {
        disableClose: true,
        height: ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS.HEIGHT,
        width: ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS.WIDTH,
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
      .subscribe(() => {
        this.onReindexLaunchedModalClose();
      });
  }

  onReindexLaunchedModalClose(): void {
    this.isReindexBtnDisabled = false;
    this.documentReindexForm?.reset();
    document.getElementById("documentIdentifier")?.focus();
  }

  getErrorMessage(): string | null {
    if (
      this.documentReindexForm?.get("documentIdentifier")?.hasError("required")
    ) {
      return ELASTIC_SEARCH_LABELS.REQUIRED_DOCID_OR_PATH_ERROR;
    }
    return null;
  }

  onReindexFormSubmit(): void {
    if (this.documentReindexForm?.valid && !this.isReindexBtnDisabled) {
      this.isReindexBtnDisabled = true;
      const userInput = this.documentReindexForm
        ?.get("documentIdentifier")
        ?.value?.trim();
      let decodedUserInput: string | null = null;
      try {
        decodedUserInput = decodeURIComponent(
          this.elasticSearchReindexService.removeLeadingCharacters(userInput)
        );
        this.triggerReindex(decodedUserInput);
      } catch (error) {
        this.showReindexErrorModal({
          type: ELASTIC_SEARCH_REINDEX_ERROR_TYPES.INVALID_DOC_ID_OR_PATH,
          details: {
            message:
              ELASTIC_SEARCH_REINDEX_ERROR_MESSAGES.INVALID_DOC_ID_OR_PATH_MESSAGE,
          },
        });
      }
    }
  }

  triggerReindex(userInput: string | null): void {
    this.nuxeo
      .repository()
      .fetch(userInput)
      .then((document: unknown) => {
        if (
          typeof document === "object" &&
          document !== null &&
          "path" in document
        ) {
          const doc = document as { path: string };
          /* The single quote is decoded and replaced with encoded backslash and single quotes, to form the request query correctly
          for elasticsearch reindex endpoint, for paths containing single quote e.g. /default-domain/ws1/Harry's-file will be built like
          /default-domain/workspaces/ws1/Harry%5C%27s-file
          Other special characters are encoded by default by nuxeo js client, but not single quote */
          try {
            const decodedPath =
              doc.path.indexOf("'") > -1
                ? this.elasticSearchReindexService.decodeAndReplaceSingleQuotes(
                    decodeURIComponent(doc.path)
                  )
                : doc.path;
            const requestQuery = `${ELASTIC_SEARCH_LABELS.SELECT_BASE_QUERY} ecm:path='${decodedPath}'`;
            this.store.dispatch(
              ReindexActions.performDocumentReindex({
                requestQuery: requestQuery,
              })
            );
          } catch (error) {
            this.showReindexErrorModal({
              type: ELASTIC_SEARCH_REINDEX_ERROR_TYPES.INVALID_DOC_ID_OR_PATH,
              details: {
                message:
                  ELASTIC_SEARCH_REINDEX_ERROR_MESSAGES.INVALID_DOC_ID_OR_PATH_MESSAGE,
              },
            });
          }
        }
      })
      .catch((err: unknown) => {
        if (this.checkIfErrorHasResponse(err)) {
          return (
            err as { response: { json: () => Promise<unknown> } }
          ).response.json();
        } else {
          return Promise.reject(ELASTIC_SEARCH_LABELS.UNEXPECTED_ERROR);
        }
      })
      .then((errorJson: unknown) => {
        if (typeof errorJson === "object" && errorJson !== null) {
          this.store.dispatch(
            ReindexActions.onDocumentReindexFailure({
              error: errorJson as HttpErrorResponse,
            })
          );
        }
      });
  }

  checkIfErrorHasResponse(err: unknown): boolean {
    return (
      typeof err === "object" &&
      err !== null &&
      "response" in err &&
      typeof (err as { response: unknown }).response === "object" &&
      (err as { response: { json: unknown } }).response !== null &&
      "json" in (err as { response: { json: unknown } }).response &&
      typeof (err as { response: { json: () => Promise<unknown> } }).response
        .json === "function"
    );
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
