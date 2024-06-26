import { performDocumentReindex } from "./../../store/actions";
import { ElasticSearchReindexModalComponent } from "../elastic-search-reindex-modal/elastic-search-reindex-modal.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FolderReindexState } from "../../store/reducers";
import { reindexInfo } from "../../elastic-search-reindex.interface";
import { Component, OnDestroy, OnInit, SecurityContext } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ELASTIC_SEARCH_LABELS } from "../../elastic-search-reindex.constants";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import * as ReindexActions from "../../store/actions";
import { ElasticSearchReindexService } from "../../services/elastic-search-reindex.service";
import { DomSanitizer } from "@angular/platform-browser";
// @ts-ignore
import Nuxeo from "nuxeo";

@Component({
  selector: "folder-es-reindex",
  templateUrl: "./folder-es-reindex.component.html",
  styleUrls: ["./folder-es-reindex.component.scss"],
})
export class FolderESReindexComponent implements OnInit, OnDestroy {
  folderReindexForm: FormGroup;
  folderReindexingDone$: Observable<reindexInfo>;
  folderReindexingError$: Observable<any>;
  folderReindexingDoneSubscription = new Subscription();
  folderReindexingErrorSubscription = new Subscription();
  confirmDialogClosedSubscription = new Subscription();
  successDialogClosedSubscription = new Subscription();
  errorDialogClosedSubscription = new Subscription();
  commandId = "";
  successDialogRef: MatDialogRef<any, any> = {} as MatDialogRef<any, any>;
  confirmDialogRef: MatDialogRef<any, any> = {} as MatDialogRef<any, any>;
  errorDialogRef: MatDialogRef<any, any> = {} as MatDialogRef<any, any>;
  ELASTIC_SEARCH_LABELS = ELASTIC_SEARCH_LABELS;
  nuxeo: Nuxeo;
  docUid = "";
  noOfDocs = 0;
  sanitizedUserInput: string | null = "";

  constructor(
    private elasticSearchReindexService: ElasticSearchReindexService,
    public dialogService: MatDialog,
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
    this.folderReindexingError$ = this.store.pipe(
      select((state) => state.folderReindex?.error)
    );
  }

  ngOnInit(): void {
    this.initiateJSClient();

    this.elasticSearchReindexService.pageTitle.next(
      `${ELASTIC_SEARCH_LABELS.FOLDER_DOC_REINDEX_TITLE}`
    );
    this.folderReindexingDoneSubscription =
      this.folderReindexingDone$.subscribe((data) => {
        if (data?.commandId) {
          this.commandId = data.commandId;
          this.successDialogRef = this.dialogService.open(
            ElasticSearchReindexModalComponent,
            {
              disableClose: true,
              height: "320px",
              width: "550px",
              data: {
                type: ELASTIC_SEARCH_LABELS.modalType.success,
                title: `${ELASTIC_SEARCH_LABELS.REINDEX_SUCESS_MODAL_TITLE}`,
                successMessage: `${ELASTIC_SEARCH_LABELS.REINDEXING_LAUNCHED} ${data?.commandId}. ${ELASTIC_SEARCH_LABELS.COPY_MONITORING_ID}`,
                closeLabel: `${ELASTIC_SEARCH_LABELS.CLOSE}`,
                commandId: this.commandId,
                isSuccessModal: true,
                COPY_ACTION_ID: `${ELASTIC_SEARCH_LABELS.COPY_ACTION_ID}`,
              },
            }
          );
          this.successDialogClosedSubscription = this.successDialogRef
            .afterClosed()
            .subscribe((data) => {
              if (data?.isClosed) {
                this.folderReindexForm?.reset();
                document.getElementById("documentID")?.focus();
              }
            });
        }
      });

    this.folderReindexingErrorSubscription =
      this.folderReindexingError$.subscribe((error) => {
        if (error) {
          this.errorDialogRef = this.dialogService.open(
            ElasticSearchReindexModalComponent,
            {
              disableClose: true,
              height: "320px",
              width: "550px",
              data: {
                type: ELASTIC_SEARCH_LABELS.modalType.error,
                title: `${ELASTIC_SEARCH_LABELS.REINDEX_ERRROR_MODAL_TITLE}`,
                errorMessage: `${ELASTIC_SEARCH_LABELS.REINDEXING_ERROR}`,
                error: error,
                closeLabel: `${ELASTIC_SEARCH_LABELS.CLOSE}`,
                isErrorModal: true,
              },
            }
          );
          this.errorDialogClosedSubscription = this.errorDialogRef
            .afterClosed()
            .subscribe((data) => {
              if (data?.isClosed) {
                document.getElementById("documentID")?.focus();
              }
            });
        }
      });
  }

  initiateJSClient(): void {
    // const baseUrl = "http://localhost:4200/nuxeo";
    /* Creating Nuxeo client */

    this.nuxeo = new Nuxeo({
      //  baseURL: baseUrl,
      auth: {
        method: "basic",
        username: "Administrator",
        password: "Administrator",
      },
    });
  }
  getErrorMessage(): string | null {
    if (this.folderReindexForm?.get("documentID")?.hasError("required")) {
      return ELASTIC_SEARCH_LABELS.INVALID_DOC_ID;
    }
    return null;
  }

  onReindexFormSubmit(): void {
    if (this.folderReindexForm?.valid) {
      this.sanitizedUserInput = this.sanitizer.sanitize(
        SecurityContext.HTML,
        this.folderReindexForm?.get("documentID")?.value
      );
      this.fetchNoOfDocs(this.sanitizedUserInput);
    }
  }

  fetchNoOfDocs(userInput: string | null): void {
    this.nuxeo
      .repository()
      .fetch(userInput)
      .then((doc: any) => {
        this.docUid = doc.uid ? doc.uid : "";
        if (this.docUid) {
          //  const requestQuery = `SELECT COUNT(ecm:uuid) FROM Document WHERE ecm:uuid='${this.docUid}'`;
          const requestQuery = `SELECT * FROM Document WHERE ecm:uuid='${this.docUid}'`;
          this.nuxeo
            .repository()
            .query({ query: requestQuery })
            .then((doc: any) => {
              this.noOfDocs = doc.resultsCount ? doc.resultsCount : 0;
              this.confirmDialogRef = this.dialogService.open(
                ElasticSearchReindexModalComponent,
                {
                  disableClose: true,
                  height: "320px",
                  width: "550px",
                  data: {
                    type: ELASTIC_SEARCH_LABELS.modalType.confirm,
                    title: `${ELASTIC_SEARCH_LABELS.REINDEX_CONFIRMATION_MODAL_TITLE}`,
                    message: `${ELASTIC_SEARCH_LABELS.REINDEX_WARNING}`,
                    isConfirmModal: true,
                    ABORT_LABEL: `${ELASTIC_SEARCH_LABELS.ABORT_LABEL}`,
                    continueLabel: `${ELASTIC_SEARCH_LABELS.CONTINUE}`,
                    IMPACT_MESSAGE: `${ELASTIC_SEARCH_LABELS.IMPACT_MESSAGE}`,
                    confirmContinue: `${ELASTIC_SEARCH_LABELS.CONTINUE_CONFIRMATION}`,
                    noOfDocs: this.noOfDocs,
                    time: `${this.noOfDocs / 2000} s`,
                  },
                }
              );

              this.confirmDialogClosedSubscription = this.confirmDialogRef
                .afterClosed()
                .subscribe((data) => {
                  if (data?.isClosed && data?.continue) {
                    this.store.dispatch(
                      ReindexActions.performFolderReindex({
                        documentID: this.docUid,
                      })
                    );
                  } else {
                    document.getElementById("documentID")?.focus();
                  }
                });
            })
            .catch((err: any) => err.response.json())
            .then((json: any) => {
              this.store.dispatch(
                ReindexActions.onFolderReindexFailure({ error: json })
              );
            });
        }
      })
      .catch((err: any) => err.response.json())
      .then((json: any) => {
        this.store.dispatch(
          ReindexActions.onFolderReindexFailure({ error: json })
        );
      });

    /* Retrieve the root of the default repository */
    /* this.nuxeo
      .repository()
      .fetch("/")
      .then(function (doc: any) {
        console.log(doc);
      })
      .catch(function (error: any) {
        console.log(error);
      }); */

    /* Retrieve root document children */
    /* this.nuxeo
      .operation("Document.GetChildren")
      .input("/")
      .execute()
      .then(function (docs: any) {
        console.log(docs);
      })
      .catch(function (error: any) {
        console.log(error);
      }); */

    /* Fetch an user */

    /* this.nuxeo
      .users()
      .fetch("Administrator")
      .then(function (user: any) {
        console.log(user);
      }); */
  }

  ngOnDestroy(): void {
    this.store.dispatch(ReindexActions.resetFolderReindexState());
    this.folderReindexingDoneSubscription.unsubscribe();
    this.folderReindexingErrorSubscription.unsubscribe();
    this.confirmDialogClosedSubscription.unsubscribe();
    this.successDialogClosedSubscription.unsubscribe();
    this.errorDialogClosedSubscription.unsubscribe();
  }
}
