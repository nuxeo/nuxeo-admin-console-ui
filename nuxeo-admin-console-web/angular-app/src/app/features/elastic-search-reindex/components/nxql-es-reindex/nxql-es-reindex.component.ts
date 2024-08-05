import { NuxeoJSClientService } from "./../../../../shared/services/nuxeo-js-client.service";
import { ElasticSearchReindexModalComponent } from "../elastic-search-reindex-modal/elastic-search-reindex-modal.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import {
  ReindexModalClosedInfo,
  ReindexInfo,
  ErrorDetails,
} from "../../elastic-search-reindex.interface";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ELASTIC_SEARCH_LABELS,
  ELASTIC_SEARCH_REINDEX_ERROR_MESSAGES,
  ELASTIC_SEARCH_REINDEX_ERROR_TYPES,
  ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS,
} from "../../elastic-search-reindex.constants";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import * as ReindexActions from "../../store/actions";
import { ElasticSearchReindexService } from "../../services/elastic-search-reindex.service";
import { NXQLReindexState } from "../../store/reducers";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { HttpErrorResponse } from "@angular/common/http";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Nuxeo from "nuxeo";

@Component({
  selector: "nxql-es-reindex",
  templateUrl: "./nxql-es-reindex.component.html",
  styleUrls: ["./nxql-es-reindex.component.scss"],
})
export class NXQLESReindexComponent implements OnInit, OnDestroy {
  nxqlReindexForm: FormGroup;
  nxqlReindexingLaunched$: Observable<ReindexInfo>;
  nxqlReindexingError$: Observable<HttpErrorResponse | null>;
  nxqlReindexingLaunchedSubscription = new Subscription();
  nxqlReindexingErrorSubscription = new Subscription();
  reindexDialogClosedSubscription = new Subscription();
  nxqlQueryHintSanitized: SafeHtml = "";
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
  spinnerVisible = false;
  spinnerStatusSubscription: Subscription = new Subscription();
  decodedUserInput = "";
  noOfDocumentsToReindex = -1;
  isReindexBtnDisabled = false;

  constructor(
    private elasticSearchReindexService: ElasticSearchReindexService,
    public dialogService: MatDialog,
    private fb: FormBuilder,
    private store: Store<{ nxqlReindex: NXQLReindexState }>,
    private sanitizer: DomSanitizer,
    private nuxeoJSClientService: NuxeoJSClientService
  ) {
    this.nxqlReindexForm = this.fb.group({
      nxqlQuery: ["", Validators.required],
    });
    this.nxqlReindexingLaunched$ = this.store.pipe(
      select((state) => state.nxqlReindex?.nxqlReindexInfo)
    );
    this.nxqlReindexingError$ = this.store.pipe(
      select((state) => state.nxqlReindex?.error)
    );
  }

  ngOnInit(): void {
    this.nuxeo = this.nuxeoJSClientService.getNuxeoInstance();
    this.elasticSearchReindexService.pageTitle.next(
      `${ELASTIC_SEARCH_LABELS.NXQL_QUERY_REINDEX_TITLE}`
    );
    this.nxqlQueryHintSanitized = this.sanitizer.bypassSecurityTrustHtml(
      ELASTIC_SEARCH_LABELS.NXQL_INPUT_HINT
    );

    this.nxqlReindexingLaunchedSubscription =
      this.nxqlReindexingLaunched$.subscribe((data) => {
        if (data?.commandId) {
          this.showReindexLaunchedModal(data?.commandId);
        }
      });

    this.nxqlReindexingErrorSubscription = this.nxqlReindexingError$.subscribe(
      (error) => {
        if (error) {
          this.showReindexErrorModal({
            type: ELASTIC_SEARCH_REINDEX_ERROR_TYPES.SERVER_ERROR,
            details: { status: error.status, message: error.message },
          });
        }
      }
    );
    this.spinnerStatusSubscription =
      this.elasticSearchReindexService.spinnerStatus.subscribe((status) => {
        this.spinnerVisible = status;
      });
  }

  showReindexLaunchedModal(commandId: string | null): void {
    this.elasticSearchReindexService.spinnerStatus.next(false);
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
    this.nxqlReindexForm?.reset();
    document.getElementById("nxqlQuery")?.focus();
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
          closeLabel: `${ELASTIC_SEARCH_LABELS.CLOSE_LABEL}`,
          error,
          isErrorModal: true,
        },
      }
    );
    this.errorDialogClosedSubscription = this.errorDialogRef
      .afterClosed()
      .subscribe(() => {
        this.onReindexErrorModalClose();
      });
  }

  onReindexErrorModalClose(): void {
    this.isReindexBtnDisabled = false;
    document.getElementById("nxqlQuery")?.focus();
  }

  getErrorMessage(): string | null {
    if (this.nxqlReindexForm?.get("nxqlQuery")?.hasError("required")) {
      return ELASTIC_SEARCH_LABELS.REQUIRED_NXQL_QUERY_ERROR;
    }
    return null;
  }

  onReindexFormSubmit(): void {
    if (this.nxqlReindexForm?.valid && !this.isReindexBtnDisabled) {
      this.isReindexBtnDisabled = true;
      this.elasticSearchReindexService.spinnerStatus.next(true);
      const userInput = this.nxqlReindexForm?.get("nxqlQuery")?.value?.trim();
      /* decode user input to handle path names that contain spaces, 
      which would not be decoded by default by nuxeo js client & would result in invalid api parameter */
      try {
        const decodedUserInput = decodeURIComponent(
          /* Remove leading single & double quotes in case of path, to avoid invalid nuxeo js client api parameter */
          this.elasticSearchReindexService.removeLeadingCharacters(userInput)
        );
        this.fetchNoOfDocuments(decodedUserInput);
      } catch (error) {
        this.elasticSearchReindexService.spinnerStatus.next(false);
        this.showReindexErrorModal({
          type: ELASTIC_SEARCH_REINDEX_ERROR_TYPES.INVALID_QUERY,
          details: {
            message:
              ELASTIC_SEARCH_REINDEX_ERROR_MESSAGES.INVALID_QUERY_MESSAGE,
          },
        });
      }
    }
  }

  fetchNoOfDocuments(query: string): void {
    this.nuxeo
      .repository()
      .query({ query, pageSize: 1 })
      .then((document: unknown) => {
        this.elasticSearchReindexService.spinnerStatus.next(false);
        if (
          typeof document === "object" &&
          document !== null &&
          "resultsCount" in document
        ) {
          this.noOfDocumentsToReindex = document.resultsCount
            ? (document.resultsCount as number)
            : 0;
          if (this.noOfDocumentsToReindex === 0) {
            this.elasticSearchReindexService.spinnerStatus.next(false);
            this.showReindexErrorModal({
              type: ELASTIC_SEARCH_REINDEX_ERROR_TYPES.NO_MATCHING_QUERY,
              details: {
                message:
                  ELASTIC_SEARCH_REINDEX_ERROR_MESSAGES.NO_MATCHING_QUERY_MESSAGE,
              },
            });
          } else {
            this.showConfirmationModal(
              this.noOfDocumentsToReindex as number,
              query
            );
          }
        }
      })
      .catch((err: unknown) => {
        this.elasticSearchReindexService.spinnerStatus.next(false);
        this.noOfDocumentsToReindex = -1;
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
            ReindexActions.onNxqlReindexFailure({
              error: errorJson as HttpErrorResponse,
            })
          );
        }
      });
  }

  showConfirmationModal(documentCount: number, query: string): void {
    this.confirmDialogRef = this.dialogService.open(
      ElasticSearchReindexModalComponent,
      {
        disableClose: true,
        height: ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS.HEIGHT,
        width: ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS.WIDTH,
        data: {
          type: ELASTIC_SEARCH_LABELS.MODAL_TYPE.confirm,
          title: `${ELASTIC_SEARCH_LABELS.REINDEX_CONFIRMATION_MODAL_TITLE}`,
          message: `${ELASTIC_SEARCH_LABELS.REINDEX_WARNING}`,
          isConfirmModal: true,
          abortLabel: `${ELASTIC_SEARCH_LABELS.ABORT_LABEL}`,
          continueLabel: `${ELASTIC_SEARCH_LABELS.CONTINUE}`,
          impactMessage: `${ELASTIC_SEARCH_LABELS.IMPACT_MESSAGE}`,
          confirmContinue: `${ELASTIC_SEARCH_LABELS.CONTINUE_CONFIRMATION}`,
          documentCount,
          timeTakenToReindex: this.getHumanReadableTime(
            documentCount / ELASTIC_SEARCH_LABELS.REFERENCE_POINT
          ),
        },
      }
    );

    this.confirmDialogClosedSubscription = this.confirmDialogRef
      .afterClosed()
      .subscribe((data) => {
        this.onConfirmationModalClose(data as ReindexModalClosedInfo, query);
      });
  }

  onConfirmationModalClose(data: ReindexModalClosedInfo, query: string): void {
    this.isReindexBtnDisabled = false;
    if (data?.continue) {
      /* The single quote is decoded and replaced with encoded backslash and single quotes, to form the request query correctly
          for elasticsearch reindex endpoint, for paths containing single quote e.g. /default-domain/ws1/Harry's-file will be built like
          /default-domain/workspaces/ws1/Harry%5C%27s-file
          Other special characters are encoded by default by nuxeo js client, but not single quote */
      try {
        this.decodedUserInput = decodeURIComponent(query).replace(
          /\\'/g,
          "%5C%27"
        );
        this.store.dispatch(
          ReindexActions.performNxqlReindex({
            nxqlQuery: this.decodedUserInput,
          })
        );
      } catch (error) {
        this.showReindexErrorModal({
          type: ELASTIC_SEARCH_REINDEX_ERROR_TYPES.INVALID_QUERY,
          details: {
            message:
              ELASTIC_SEARCH_REINDEX_ERROR_MESSAGES.INVALID_QUERY_MESSAGE,
          },
        });
      }
    } else {
      document.getElementById("nxqlQuery")?.focus();
    }
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

  getHumanReadableTime(seconds: number): string {
    return this.elasticSearchReindexService.secondsToHumanReadable(seconds);
  }

  ngOnDestroy(): void {
    this.store.dispatch(ReindexActions.resetNxqlReindexState());
    this.nxqlReindexingLaunchedSubscription?.unsubscribe();
    this.nxqlReindexingErrorSubscription?.unsubscribe();
    this.reindexDialogClosedSubscription?.unsubscribe();
    this.confirmDialogClosedSubscription?.unsubscribe();
    this.launchedDialogClosedSubscription?.unsubscribe();
    this.errorDialogClosedSubscription?.unsubscribe();
  }
}
