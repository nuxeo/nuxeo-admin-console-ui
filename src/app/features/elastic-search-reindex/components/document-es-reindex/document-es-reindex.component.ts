import { ElasticSearchReindexModalComponent } from "./../elastic-search-reindex-modal/elastic-search-reindex-modal.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { reindexInfo } from "../../elastic-search-reindex.interface";
import { Component, OnDestroy, OnInit, SecurityContext } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ELASTIC_SEARCH_LABELS,
  ELASTIC_SEARCH_REINDEX_MODAL_EVENT,
} from "../../elastic-search-reindex.constants";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import * as ReindexActions from "../../store/actions";
import { ElasticSearchReindexService } from "../../services/elastic-search-reindex.service";
import { DocumentReindexState } from "../../store/reducers";
import { DomSanitizer } from "@angular/platform-browser";

// @ts-ignore
import Nuxeo from "nuxeo";

@Component({
  selector: "document-es-reindex",
  templateUrl: "./document-es-reindex.component.html",
  styleUrls: ["./document-es-reindex.component.scss"],
})
export class DocumentESReindexComponent implements OnInit, OnDestroy {
  reindexForm: FormGroup;
  reindexingDone$: Observable<reindexInfo>;
  REINDEXING_ERROR$: Observable<any>;
  reindexingDoneSubscription = new Subscription();
  reindexingErrorSubscription = new Subscription();
  reindexDialogClosedSubscription = new Subscription();
  confirmDialogClosedSubscription = new Subscription();
  successDialogClosedSubscription = new Subscription();
  errorDialogClosedSubscription = new Subscription();
  successDialogRef: MatDialogRef<any, any> = {} as MatDialogRef<any, any>;
  confirmDialogRef: MatDialogRef<any, any> = {} as MatDialogRef<any, any>;
  errorDialogRef: MatDialogRef<any, any> = {} as MatDialogRef<any, any>;

  commandId = "";
  ELASTIC_SEARCH_LABELS = ELASTIC_SEARCH_LABELS;
  nuxeo: any;
  docPath = "";

  constructor(
    private elasticSearchReindexService: ElasticSearchReindexService,
    public dialogService: MatDialog,
    private fb: FormBuilder,
    private store: Store<{ reindex: DocumentReindexState }>,
    private sanitizer: DomSanitizer
  ) {
    this.reindexForm = this.fb.group({
      documentID: ["", Validators.required],
    });
    this.reindexingDone$ = this.store.pipe(
      select((state) => state.reindex?.reindexInfo)
    );
    this.REINDEXING_ERROR$ = this.store.pipe(
      select((state) => state.reindex?.error)
    );
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

  ngOnInit(): void {
    this.initiateJSClient();
    this.elasticSearchReindexService.pageTitle.next(
      `${ELASTIC_SEARCH_LABELS.SINGLE_DOC_REINDEX_TITLE}`
    );
    this.reindexingDoneSubscription = this.reindexingDone$.subscribe((data) => {
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
              isConfirmModal: false,
              closeLabel: `${ELASTIC_SEARCH_LABELS.CLOSE}`,
              commandId: this.commandId,
              COPY_ACTION_ID: `${ELASTIC_SEARCH_LABELS.COPY_ACTION_ID}`,
              isSuccessModal: true,
            },
          }
        );

        this.successDialogClosedSubscription = this.successDialogRef
          .afterClosed()
          .subscribe((data) => {
            if (data?.isClosed) {
              this.reindexForm?.reset();
              document.getElementById("documentID")?.focus();
            }
          });
      }
    });

    this.reindexingErrorSubscription = this.REINDEXING_ERROR$.subscribe(
      (error) => {
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
                errorMessageHeader: `${ELASTIC_SEARCH_LABELS.REINDEXING_ERROR}`,
                error: error,
                closeLabel: `${ELASTIC_SEARCH_LABELS.CLOSE}`,
                isErrorModal: true,
              },
            }
          );
          this.errorDialogClosedSubscription = this.errorDialogRef
            ?.afterClosed()
            ?.subscribe((data) => {
              if (data?.isClosed) {
                document.getElementById("documentID")?.focus();
              }
            });
        }
      }
    );
  }

  getErrorMessage(): string | null {
    if (this.reindexForm?.get("documentID")?.hasError("required")) {
      return ELASTIC_SEARCH_LABELS.INVALID_DOCID_OR_PATH;
    }
    return null;
  }

  onReindexFormSubmit(): void {
    if (this.reindexForm?.valid) {
      const sanitizedInput = this.sanitizer.sanitize(
        SecurityContext.HTML,
        this.reindexForm?.get("documentID")?.value
      );
      this.triggerReindex(sanitizedInput);
    }
  }

  triggerReindex(userInput: string | null): void {
    this.nuxeo
      .repository()
      .fetch(userInput)
      .then((doc: any) => {
        this.docPath = doc.path ? doc.path : "";
        const selectStatement = "SELECT * FROM Document WHERE";
        const requestQuery = `${selectStatement} ecm:path='${this.docPath}'`;
        this.store.dispatch(
          ReindexActions.performDocumentReindex({
            documentID: requestQuery,
          })
        );
      })
      .catch((err: any) => err.response.json())
      .then((json: any) => {
        this.store.dispatch(
          ReindexActions.onDocumentReindexFailure({ error: json })
        );
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch(ReindexActions.resetDocumentReindexState());
    this.reindexingDoneSubscription.unsubscribe();
    this.reindexingErrorSubscription.unsubscribe();
    this.reindexDialogClosedSubscription.unsubscribe();
    this.successDialogClosedSubscription.unsubscribe();
    this.errorDialogClosedSubscription.unsubscribe();
  }
}
