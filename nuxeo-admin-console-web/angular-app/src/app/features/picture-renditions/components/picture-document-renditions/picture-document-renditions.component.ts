import { CommonService } from './../../../../shared/services/common.service';
import { ErrorDetails, ErrorModalClosedInfo } from "./../../../../shared/types/common.interface";
import {
  COMMON_LABELS,
  ERROR_MESSAGES,
  ERROR_MODAL_LABELS,
  ERROR_TYPES,
  MODAL_DIMENSIONS,
} from "./../../../../shared/constants/common.constants";
import { ErrorModalComponent } from "./../../../../shared/components/error-modal/error-modal.component";
import { NuxeoJSClientService } from "./../../../../shared/services/nuxeo-js-client.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { PictureRenditionsService } from "../../services/picture-renditions.service";
import * as RenditionsActions from "../../store/actions";
import { PICTURE_RENDITIONS_LABELS } from '../../picture-renditions.constants';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Nuxeo from "nuxeo";
import { RenditionsInfo, RenditionsModalClosedInfo } from 'src/app/features/picture-renditions/picture-renditions.interface';
import { PictureRenditionsModalComponent } from '../picture-renditions-modal/picture-renditions-modal.component';
import { DocumentRenditionsState } from '../../store/reducers';

@Component({
  selector: "picture-document-renditions",
  templateUrl: "./picture-document-renditions.component.html",
  styleUrls: ["./picture-document-renditions.component.scss"],
})

  export class PictureDocumentRenditionsComponent implements OnInit, OnDestroy {
    documentRenditionsForm: FormGroup;
    documentRenditionsLaunched$: Observable<RenditionsInfo>;
    documentRenditionsError$: Observable<HttpErrorResponse | null>;
    documentRenditionsLaunchedSubscription = new Subscription();
    documentRenditionsErrorSubscription = new Subscription();
    renditionsDialogClosedSubscription = new Subscription();
    confirmDialogClosedSubscription = new Subscription();
    launchedDialogClosedSubscription = new Subscription();
    errorDialogClosedSubscription = new Subscription();
    launchedDialogRef: MatDialogRef<
      PictureRenditionsModalComponent,
      RenditionsModalClosedInfo
    > = {} as MatDialogRef<
      PictureRenditionsModalComponent,
      RenditionsModalClosedInfo
    >;
    confirmDialogRef: MatDialogRef<
      PictureRenditionsModalComponent,
      RenditionsModalClosedInfo
    > = {} as MatDialogRef<
      PictureRenditionsModalComponent,
      RenditionsModalClosedInfo
    >;
    errorDialogRef: MatDialogRef<ErrorModalComponent, ErrorModalClosedInfo> =
      {} as MatDialogRef<ErrorModalComponent, ErrorModalClosedInfo>;
  
    nuxeo: Nuxeo;
    isRenditionsBtnDisabled = false;
    COMMON_LABELS = COMMON_LABELS;
    PICTURE_RENDITIONS_LABELS = PICTURE_RENDITIONS_LABELS;
  
    constructor(
      private PictureRenditionsService: PictureRenditionsService, 
      public dialogService: MatDialog,
      private fb: FormBuilder,
      private store: Store<{ renditions: DocumentRenditionsState }>,
      private nuxeoJSClientService: NuxeoJSClientService,
      private commonService: CommonService
    ) {
      this.documentRenditionsForm = this.fb.group({
        documentIdentifier: ["", Validators.required],
      });
      this.documentRenditionsLaunched$ = this.store.pipe(
        select((state) => state.renditions?.renditionsInfo)
      );
      this.documentRenditionsError$ = this.store.pipe(
        select((state) => state.renditions?.error)
      );
    }
  
    ngOnInit(): void {
      this.nuxeo = this.nuxeoJSClientService.getNuxeoInstance();
      this.PictureRenditionsService.pageTitle.next(
        `${PICTURE_RENDITIONS_LABELS.DOCUMENT_RENDITIONS_TITLE}`
      );
      this.documentRenditionsLaunchedSubscription =
        this.documentRenditionsLaunched$.subscribe((data) => {
          if (data?.commandId) {
            this.showRenditionsLaunchedModal(data?.commandId);
          }
        });
  
      this.documentRenditionsErrorSubscription =
        this.documentRenditionsError$.subscribe((error) => {
          if (error) {
            this.showRenditionsErrorModal({
              type: ERROR_TYPES.SERVER_ERROR,
              details: { status: error.status, message: error.message },
            });
          }
        });
    }
  
    showRenditionsErrorModal(error: ErrorDetails): void {
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
          this.onRenditionsErrorModalClose();
        });
    }
  
    onRenditionsErrorModalClose(): void {
      this.isRenditionsBtnDisabled = false;
      document.getElementById("documentIdentifier")?.focus();
    }
  
    showRenditionsLaunchedModal(commandId: string | null): void {
      this.launchedDialogRef = this.dialogService.open(
        PictureRenditionsModalComponent,
        {
          disableClose: true,
          height: MODAL_DIMENSIONS.HEIGHT,
          width: MODAL_DIMENSIONS.WIDTH,
          data: {
            type: PICTURE_RENDITIONS_LABELS.MODAL_TYPE.launched,
            title: `${PICTURE_RENDITIONS_LABELS.RENDITIONS_LAUNCHED_MODAL_TITLE}`,
            launchedMessage: `${PICTURE_RENDITIONS_LABELS.RENDITIONS_LAUNCHED} ${commandId}. ${PICTURE_RENDITIONS_LABELS.COPY_MONITORING_ID}`,
            commandId,
          },
        }
      );
  
      this.launchedDialogClosedSubscription = this.launchedDialogRef
        .afterClosed()
        .subscribe(() => {
          this.onRenditionsLaunchedModalClose();
        });
    }
  
    onRenditionsLaunchedModalClose(): void {
      this.isRenditionsBtnDisabled = false;
      this.documentRenditionsForm?.reset();
      document.getElementById("documentIdentifier")?.focus();
    }
  
    getErrorMessage(): string | null {
      if (
        this.documentRenditionsForm?.get("documentIdentifier")?.hasError("required")
      ) {
        return PICTURE_RENDITIONS_LABELS.REQUIRED_DOCID_OR_PATH_ERROR;
      }
      return null;
    }
  
    onRenditionsFormSubmit(): void {
      if (this.documentRenditionsForm?.valid && !this.isRenditionsBtnDisabled) {
        this.isRenditionsBtnDisabled = true;
        const userInput = this.documentRenditionsForm
          ?.get("documentIdentifier")
          ?.value?.trim();
        let decodedUserInput: string | null = null;
        try {
          decodedUserInput = decodeURIComponent(
            this.commonService.removeLeadingCharacters(userInput)
          );
          this.triggerRenditions(decodedUserInput);
        } catch (error) {
          this.showRenditionsErrorModal({
            type: ERROR_TYPES.INVALID_DOC_ID_OR_PATH,
            details: {
              message: ERROR_MESSAGES.INVALID_DOC_ID_OR_PATH_MESSAGE,
            },
          });
        }
      }
    }
  
    triggerRenditions(userInput: string | null): void {
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
              const requestQuery = `${PICTURE_RENDITIONS_LABELS.SELECT_BASE_QUERY} ecm:path='${decodedPath}'`;
              this.store.dispatch(
                RenditionsActions.performDocumentPictureRenditions({
                  requestQuery: requestQuery,
                })
              );
            } catch (error) {
              this.showRenditionsErrorModal({
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
              RenditionsActions.onDocumentPictureRendtionsFailure({
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
      this.store.dispatch(RenditionsActions.resetDocumentPictureRenditionsState());
      this.documentRenditionsLaunchedSubscription?.unsubscribe();
      this.documentRenditionsErrorSubscription?.unsubscribe();
      this.renditionsDialogClosedSubscription?.unsubscribe();
      this.launchedDialogClosedSubscription?.unsubscribe();
      this.errorDialogClosedSubscription?.unsubscribe();
    }
  }

 
  
            

