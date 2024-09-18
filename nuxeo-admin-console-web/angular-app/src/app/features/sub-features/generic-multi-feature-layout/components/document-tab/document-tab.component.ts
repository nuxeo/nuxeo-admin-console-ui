import { CommonService } from './../../../../shared/services/common.service';
import { ErrorModalClosedInfo } from "./../../../../shared/types/common.interface";
import {
  COMMON_LABELS,
  ERROR_MESSAGES,
  ERROR_MODAL_LABELS,
  ERROR_TYPES,
  MODAL_DIMENSIONS,
} from "./../../../../shared/constants/common.constants";
import { ErrorModalComponent } from "./../../../../shared/components/error-modal/error-modal.component";
import { NuxeoJSClientService } from "./../../../../shared/services/nuxeo-js-client.service";
import {
  ELASTIC_SEARCH_LABELS,
} from "./../../elastic-search-reindex.constants";
import { ElasticSearchReindexModalComponent } from "./../elastic-search-reindex-modal/elastic-search-reindex-modal.component";
import {
  ErrorDetails,
  ReindexModalClosedInfo,
} from "../../generic-multi-feature-layout.interface";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ReindexInfo } from "../../generic-multi-feature-layout.interface";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
  selector: "document-tab",
  templateUrl: "./document-tab.component.html",
  styleUrls: ["./document-tab.component.scss"],
})
export class DocumentTabComponent implements OnInit, OnDestroy {
  inputForm: FormGroup;
  actionLaunched$: Observable<ReindexInfo>;
  actionError$: Observable<HttpErrorResponse | null>;
  actionLaunchedSubscription = new Subscription();
  actionErrorSubscription = new Subscription();
  actionDialogClosedSubscription = new Subscription();
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
  isSubmitBtnDisabled = false;
  COMMON_LABELS = COMMON_LABELS;

  constructor(
    private elasticSearchReindexService: ElasticSearchReindexService,
    public dialogService: MatDialog,
    private fb: FormBuilder,
    private store: Store<{ reindex: DocumentReindexState }>,
    private nuxeoJSClientService: NuxeoJSClientService,
    private commonService: CommonService
  ) {
    this.inputForm = this.fb.group({
      documentIdentifier: ["", Validators.required],
    });
    this.actionLaunched$ = this.store.pipe(
      select((state) => state.reindex?.reindexInfo)
    );
    this.actionError$ = this.store.pipe(
      select((state) => state.reindex?.error)
    );
  }

  ngOnInit(): void {
    this.nuxeo = this.nuxeoJSClientService.getNuxeoInstance();
    this.elasticSearchReindexService.pageTitle.next(
      `${ELASTIC_SEARCH_LABELS.DOCUMENT_REINDEX_TITLE}`
    );
    this.actionLaunchedSubscription =
      this.actionLaunched$.subscribe((data) => {
        if (data?.commandId) {
          this.showActionLaunchedModal(data?.commandId);
        }
      });

    this.actionErrorSubscription =
      this.actionError$.subscribe((error) => {
        if (error) {
          this.showActionErrorModal({
            type: ERROR_TYPES.SERVER_ERROR,
            details: { status: error.status, message: error.message },
          });
        }
      });
  }

  showActionErrorModal(error: ErrorDetails): void {
    this.errorDialogRef = this.dialogService.open(ErrorModalComponent, {
      disableClose: true,
      height: MODAL_DIMENSIONS.HEIGHT,
      width: MODAL_DIMENSIONS.WIDTH,
      data: {
        error,
      },
    });
    this.errorDialogClosedSubscription = this.errorDialogRef
      ?.afterClosed()
      ?.subscribe(() => {
        this.onActionErrorModalClose();
      });
  }

  onActionErrorModalClose(): void {
    this.isSubmitBtnDisabled = false;
    document.getElementById("documentIdentifier")?.focus();
  }

  showActionLaunchedModal(commandId: string | null): void {
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
    this.isSubmitBtnDisabled = false;
    this.inputForm?.reset();
    document.getElementById("documentIdentifier")?.focus();
  }

  getErrorMessage(): string | null {
    if (
      this.inputForm?.get("documentIdentifier")?.hasError("required")
    ) {
      return ELASTIC_SEARCH_LABELS.REQUIRED_DOCID_OR_PATH_ERROR;
    }
    return null;
  }

  onReindexFormSubmit(): void {
    if (this.inputForm?.valid && !this.isSubmitBtnDisabled) {
      this.isSubmitBtnDisabled = true;
      const userInput = this.inputForm
        ?.get("documentIdentifier")
        ?.value?.trim();
      let decodedUserInput: string | null = null;
      try {
        decodedUserInput = decodeURIComponent(
          this.commonService.removeLeadingCharacters(userInput)
        );
        this.triggerReindex(decodedUserInput);
      } catch (error) {
        this.showActionErrorModal({
          type: ERROR_TYPES.INVALID_DOC_ID_OR_PATH,
          details: {
            message: ERROR_MESSAGES.INVALID_DOC_ID_OR_PATH_MESSAGE,
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
                ? this.commonService.decodeAndReplaceSingleQuotes(
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
            this.showActionErrorModal({
              type: ERROR_TYPES.INVALID_DOC_ID_OR_PATH,
              details: {
                message:
                ERROR_MESSAGES.INVALID_DOC_ID_OR_PATH_MESSAGE,
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
          return Promise.reject(ERROR_MODAL_LABELS.UNEXPECTED_ERROR);
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
    this.actionLaunchedSubscription?.unsubscribe();
    this.actionErrorSubscription?.unsubscribe();
    this.actionDialogClosedSubscription?.unsubscribe();
    this.launchedDialogClosedSubscription?.unsubscribe();
    this.errorDialogClosedSubscription?.unsubscribe();
  }
}
