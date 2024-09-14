import { CommonService } from './../../../../shared/services/common.service';
import { ErrorModalClosedInfo } from "./../../../../shared/types/common.interface";
import { ErrorModalComponent } from "./../../../../shared/components/error-modal/error-modal.component";
import {
  COMMON_LABELS,
  ERROR_MESSAGES,
  ERROR_MODAL_LABELS,
  ERROR_TYPES,
  MODAL_DIMENSIONS,
} from "./../../../../shared/constants/common.constants";
import { NuxeoJSClientService } from "./../../../../shared/services/nuxeo-js-client.service";
import { ElasticSearchReindexModalComponent } from "../elastic-search-reindex-modal/elastic-search-reindex-modal.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FolderReindexState } from "../../store/reducers";
import {
  ErrorDetails,
  ReindexInfo,
  ReindexModalClosedInfo,
} from "../../elastic-search-reindex.interface";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ELASTIC_SEARCH_LABELS,
} from "../../elastic-search-reindex.constants";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import * as ReindexActions from "../../store/actions";
import { ElasticSearchReindexService } from "../../services/elastic-search-reindex.service";
import { HttpErrorResponse } from "@angular/common/http";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Nuxeo from "nuxeo";

@Component({
  selector: "folder-es-reindex",
  templateUrl: "./folder-es-reindex.component.html",
  styleUrls: ["./folder-es-reindex.component.scss"],
})
export class FolderESReindexComponent implements OnInit, OnDestroy {
  folderReindexForm: FormGroup;
  folderReindexingLaunched$: Observable<ReindexInfo>;
  folderReindexingError$: Observable<HttpErrorResponse | null>;
  folderReindexingLaunchedSubscription = new Subscription();
  folderReindexingErrorSubscription = new Subscription();
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
  errorDialogRef: MatDialogRef<ErrorModalComponent, ErrorModalClosedInfo> =
    {} as MatDialogRef<ErrorModalComponent, ErrorModalClosedInfo>;
  ELASTIC_SEARCH_LABELS = ELASTIC_SEARCH_LABELS;
  nuxeo: Nuxeo;
  spinnerVisible = false;
  spinnerStatusSubscription: Subscription = new Subscription();
  userInput = "";
  decodedUserInput = "";
  isReindexBtnDisabled = false;
  COMMON_LABELS = COMMON_LABELS;

  constructor(
    private elasticSearchReindexService: ElasticSearchReindexService,
    public dialogService: MatDialog,
    private fb: FormBuilder,
    private store: Store<{ folderReindex: FolderReindexState }>,
    private nuxeoJSClientService: NuxeoJSClientService,
    private commonService: CommonService
  ) {
    this.folderReindexForm = this.fb.group({
      documentID: ["", Validators.required],
    });
    this.folderReindexingLaunched$ = this.store.pipe(
      select((state) => state.folderReindex?.folderReindexInfo)
    );
    this.folderReindexingError$ = this.store.pipe(
      select((state) => state.folderReindex?.error)
    );
  }

  ngOnInit(): void {
    this.nuxeo = this.nuxeoJSClientService.getNuxeoInstance();
    this.elasticSearchReindexService.pageTitle.next(
      `${ELASTIC_SEARCH_LABELS.FOLDER_REINDEX_TITLE}`
    );
    this.folderReindexingLaunchedSubscription =
      this.folderReindexingLaunched$.subscribe((data) => {
        if (data?.commandId) {
          this.showReindexLaunchedModal(data?.commandId);
        }
      });

    this.folderReindexingErrorSubscription =
      this.folderReindexingError$.subscribe((error) => {
        if (error) {
          this.showReindexErrorModal({
            type: ERROR_TYPES.SERVER_ERROR,
            details: { status: error.status, message: error.message },
          });
        }
      });

    this.spinnerStatusSubscription =
      this.elasticSearchReindexService.spinnerStatus.subscribe((status) => {
        this.spinnerVisible = status;
      });
  }

  showReindexErrorModal(error: ErrorDetails): void {
    this.elasticSearchReindexService.spinnerStatus.next(false);
    this.errorDialogRef = this.dialogService.open(ErrorModalComponent, {
      disableClose: true,
      height: MODAL_DIMENSIONS.HEIGHT,
      width: MODAL_DIMENSIONS.WIDTH,
      data: {
        error,
        userInput: this.userInput
      },
    });
    this.errorDialogClosedSubscription = this.errorDialogRef
      .afterClosed()
      .subscribe(() => {
        this.onReindexErrorModalClose();
      });
  }

  onReindexErrorModalClose(): void {
    this.isReindexBtnDisabled = false;
    this.elasticSearchReindexService.spinnerStatus.next(false);
    document.getElementById("documentID")?.focus();
  }

  showReindexLaunchedModal(commandId: string | null): void {
    this.launchedDialogRef = this.dialogService.open(
      ElasticSearchReindexModalComponent,
      {
        disableClose: true,
        height: MODAL_DIMENSIONS.HEIGHT,
        width: MODAL_DIMENSIONS.WIDTH,
        data: {
          type: ELASTIC_SEARCH_LABELS.MODAL_TYPE.launched,
          title: `${ELASTIC_SEARCH_LABELS.REINDEX_LAUNCHED_MODAL_TITLE}`,
          launchedMessage: `${ELASTIC_SEARCH_LABELS.REINDEX_LAUNCHED} ${commandId}. ${ELASTIC_SEARCH_LABELS.COPY_MONITORING_ID}`,
          commandId,
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
    this.folderReindexForm?.reset();
    document.getElementById("documentID")?.focus();
  }

  getErrorMessage(): string | null {
    if (this.folderReindexForm?.get("documentID")?.hasError("required")) {
      return ELASTIC_SEARCH_LABELS.REQUIRED_DOCID_ERROR;
    }
    return null;
  }

  onReindexFormSubmit(): void {
    if (this.folderReindexForm?.valid && !this.isReindexBtnDisabled) {
      this.isReindexBtnDisabled = true;
      this.elasticSearchReindexService.spinnerStatus.next(true);
      this.userInput = this.commonService.removeLeadingCharacters(
        this.folderReindexForm?.get("documentID")?.value.trim()
      );
      /* The single quote is decoded and replaced with encoded backslash and single quotes, to form the request query correctly
          for elasticsearch reindex endpoint, for paths containing single quote e.g. /default-domain/ws1/Harry's-file will be built like
          /default-domain/workspaces/ws1/Harry%5C%27s-file
          Other special characters are encoded by default by nuxeo js client, but not single quote */
      try {
        this.decodedUserInput =
          this.commonService.decodeAndReplaceSingleQuotes(
            decodeURIComponent(this.userInput)
          );
        const requestQuery = `${ELASTIC_SEARCH_LABELS.SELECT_BASE_QUERY} ecm:uuid='${this.decodedUserInput}' 
         OR ecm:ancestorId='${this.decodedUserInput}' AND ${ELASTIC_SEARCH_LABELS.SELECT_QUERY_CONDITIONS}`;
        this.fetchNoOfDocuments(requestQuery);
      } catch (error) {
        this.showReindexErrorModal({
          type: ERROR_TYPES.INVALID_DOC_ID,
          details: {
            message: ERROR_MESSAGES.INVALID_DOC_ID_MESSAGE,
          },
        });
      }
    }
  }

  fetchNoOfDocuments(query: string | null): void {
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
          const documentCount = document.resultsCount
            ? (document.resultsCount as number)
            : 0;
          if (documentCount === 0) {
            this.showReindexErrorModal({
              type: ERROR_TYPES.NO_DOCUMENT_ID_FOUND,
              details: {
                message: ERROR_MESSAGES.NO_DOCUMENT_ID_FOUND_MESSAGE,
              },
            });
          } else {
            this.showConfirmationModal(documentCount);
          }
        }
      })
      .catch((err: unknown) => {
        this.elasticSearchReindexService.spinnerStatus.next(false);
        if (this.checkIfErrorHasResponse(err)) {
          return (
            err as { response: { json: () => Promise<unknown> } }
          ).response.json();
        } else {
          return Promise.reject(ERROR_MODAL_LABELS.UNEXPECTED_ERROR);
        }
      })
      .then((errorJson: unknown) => {
        if (typeof errorJson === "object" && errorJson !== null) {
          this.store.dispatch(
            ReindexActions.onFolderReindexFailure({
              error: errorJson as HttpErrorResponse,
            })
          );
        }
      });
  }

  showConfirmationModal(documentCount: number): void {
    this.confirmDialogRef = this.dialogService.open(
      ElasticSearchReindexModalComponent,
      {
        disableClose: true,
        height: MODAL_DIMENSIONS.HEIGHT,
        width: MODAL_DIMENSIONS.WIDTH,
        data: {
          type: ELASTIC_SEARCH_LABELS.MODAL_TYPE.confirm,
          title: `${ELASTIC_SEARCH_LABELS.REINDEX_CONFIRMATION_MODAL_TITLE}`,
          message: `${ELASTIC_SEARCH_LABELS.REINDEX_WARNING}`,
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
        this.onConfirmationModalClose(data);
      });
  }

  onConfirmationModalClose(modalData: unknown): void {
    this.isReindexBtnDisabled = false;
    const data = modalData as ReindexModalClosedInfo;
    if (data?.continue) {
      const requestQuery = `${ELASTIC_SEARCH_LABELS.SELECT_BASE_QUERY} ecm:uuid='${this.decodedUserInput}' OR ecm:ancestorId='${this.decodedUserInput}'`;
      this.store.dispatch(
        ReindexActions.performFolderReindex({
          requestQuery,
        })
      );
    } else {
      document.getElementById("documentID")?.focus();
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
    this.store.dispatch(ReindexActions.resetFolderReindexState());
    this.folderReindexingLaunchedSubscription?.unsubscribe();
    this.folderReindexingErrorSubscription?.unsubscribe();
    this.confirmDialogClosedSubscription?.unsubscribe();
    this.launchedDialogClosedSubscription?.unsubscribe();
    this.errorDialogClosedSubscription?.unsubscribe();
    this.spinnerStatusSubscription?.unsubscribe();
  }
}
