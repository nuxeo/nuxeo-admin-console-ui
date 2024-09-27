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
import { PictureRenditionsModalComponent } from "../picture-renditions-modal/picture-renditions-modal.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import {
  RenditionsModalClosedInfo,
  RenditionsInfo,
  ErrorDetails,
} from "../../picture-renditions.interface";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PICTURE_RENDITIONS_LABELS } from "../../picture-renditions.constants";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import * as RenditionsActions from "../../store/actions";
import { PictureRendtionsService } from "../../services/picture-renditions.service";
import { NxqlPictureRenditionsState } from "../../store/reducers";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { HttpErrorResponse } from "@angular/common/http";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Nuxeo from "nuxeo";

@Component({
  selector: "picture-nxql-renditions",
  templateUrl: "./picture-nxql-renditions.component.html",
  styleUrls: ["./picture-nxql-renditions.component.scss"],
})
export class NXQLPictureRenditionComponent implements OnInit, OnDestroy {
  nxqlPictureRenditionsForm: FormGroup;
  nxqlPictureRenditionsLaunched$: Observable<RenditionsInfo>;
  nxqlPictureRenditionsError$: Observable<HttpErrorResponse | null>;
  nxqlPictureRenditionsLaunchedSubscription = new Subscription();
  nxqlPictureRenditionsErrorSubscription = new Subscription();
  pictureDialogClosedSubscription = new Subscription();
  nxqlPictureRenditionsQueryHintSanitized: SafeHtml = "";
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
  PICTURE_RENDITIONS_LABELS = PICTURE_RENDITIONS_LABELS;
  nuxeo: Nuxeo;
  spinnerVisible = false;
  spinnerStatusSubscription: Subscription = new Subscription();
  decodedUserInput = "";
  noOfDocumentsToReindex = -1;
  isRenditionsBtnDisabled = false;
  COMMON_LABELS = COMMON_LABELS;

  constructor(
    private pictureRenditionService: PictureRendtionsService,
    public dialogService: MatDialog,
    private fb: FormBuilder,
    private store: Store<{ nxqlPictureRenditions: NxqlPictureRenditionsState }>,
    private sanitizer: DomSanitizer,
    private nuxeoJSClientService: NuxeoJSClientService,
    private commonService: CommonService
  ) {
    this.nxqlPictureRenditionsForm = this.fb.group({
      nxqlQuery: ["", Validators.required],
    });
    this.nxqlPictureRenditionsLaunched$ = this.store.pipe(
      select((state) => {
        console.log(state);
        return state.nxqlPictureRenditions?.nxqlPictureRenditionsInfo})
    );
    this.nxqlPictureRenditionsError$ = this.store.pipe(
      select((state) => state.nxqlPictureRenditions?.error)
    );
  }

  ngOnInit(): void {
    console.log('1test');
    this.nuxeo = this.nuxeoJSClientService.getNuxeoInstance();
    this.pictureRenditionService.pageTitle.next(
      `${PICTURE_RENDITIONS_LABELS.NXQL_QUERY_RENDITION_TITLE}`
    );
    this.nxqlPictureRenditionsQueryHintSanitized = this.sanitizer.bypassSecurityTrustHtml(
      PICTURE_RENDITIONS_LABELS.NXQL_INPUT_HINT
    );

    this.nxqlPictureRenditionsLaunchedSubscription =
      this.nxqlPictureRenditionsLaunched$.subscribe((data) => {
        console.log('test');
        console.log(data);
        if (data?.commandId) {
          console.log('test');
          this.showRenditionsLaunchedModal(data?.commandId);
        }
      });

    this.nxqlPictureRenditionsErrorSubscription = this.nxqlPictureRenditionsError$.subscribe(
      (error) => {
        if (error) {
          this.showRenditionErrorModal({
            type: ERROR_TYPES.SERVER_ERROR,
            details: { status: error.status, message: error.message },
          });
        }
      }
    );
    this.spinnerStatusSubscription =
      this.pictureRenditionService.spinnerStatus.subscribe((status) => {
        this.spinnerVisible = status;
      });
  }

  showRenditionsLaunchedModal(commandId: string | null): void {
    this.pictureRenditionService.spinnerStatus.next(false);
    this.launchedDialogRef = this.dialogService.open(
      PictureRenditionsModalComponent,
      {
        disableClose: true,
        height: MODAL_DIMENSIONS.HEIGHT,
        width: MODAL_DIMENSIONS.WIDTH,
        data: {
          type: PICTURE_RENDITIONS_LABELS.MODAL_TYPE.launched,
          title: `${PICTURE_RENDITIONS_LABELS.RENDITION_LAUNCHED_MODAL_TITLE}`,
          launchedMessage: `${PICTURE_RENDITIONS_LABELS.RENDITION_LAUNCHED} ${commandId}. ${PICTURE_RENDITIONS_LABELS.COPY_MONITORING_ID}`,
          commandId,
        },
      }
    );

    this.launchedDialogClosedSubscription = this.launchedDialogRef
      .afterClosed()
      .subscribe(() => {
        this.onRenditionLaunchedModalClose();
      });
  }

  onRenditionLaunchedModalClose(): void {
    this.isRenditionsBtnDisabled = false;
    this.nxqlPictureRenditionsForm?.reset();
    document.getElementById("nxqlQuery")?.focus();
  }

  showRenditionErrorModal(error: ErrorDetails): void {
    this.errorDialogRef = this.dialogService.open(ErrorModalComponent, {
      disableClose: true,
      height: MODAL_DIMENSIONS.HEIGHT,
      width: MODAL_DIMENSIONS.WIDTH,
      data: {
        error,
      },
    });
    this.errorDialogClosedSubscription = this.errorDialogRef
      .afterClosed()
      .subscribe(() => {
        this.onReindexErrorModalClose();
      });
  }

  onReindexErrorModalClose(): void {
    this.isRenditionsBtnDisabled = false;
    document.getElementById("nxqlQuery")?.focus();
  }

  getErrorMessage(): string | null {
    if (this.nxqlPictureRenditionsForm?.get("nxqlQuery")?.hasError("required")) {
      return PICTURE_RENDITIONS_LABELS.REQUIRED_NXQL_QUERY_ERROR;
    }
    return null;
  }

  onNxqlPictureRenditionsFormSubmit(): void {
    console.log(1);
    if (this.nxqlPictureRenditionsForm?.valid && !this.isRenditionsBtnDisabled) {
      this.isRenditionsBtnDisabled = true;
      this.pictureRenditionService.spinnerStatus.next(true);
      const userInput = this.nxqlPictureRenditionsForm?.get("nxqlQuery")?.value?.trim();
      /* decode user input to handle path names that contain spaces, 
      which would not be decoded by default by nuxeo js client & would result in invalid api parameter */
      try {
        const decodedUserInput = decodeURIComponent(
          /* Remove leading single & double quotes in case of path, to avoid invalid nuxeo js client api parameter */
          this.commonService.removeLeadingCharacters(userInput)
        );
        this.fetchNoOfDocuments(decodedUserInput);
      } catch (error) {
        this.pictureRenditionService.spinnerStatus.next(false);
        this.showRenditionErrorModal({
          type: ERROR_TYPES.INVALID_QUERY,
          details: {
            message: ERROR_MESSAGES.INVALID_QUERY_MESSAGE,
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
        this.pictureRenditionService.spinnerStatus.next(false);
        if (
          typeof document === "object" &&
          document !== null &&
          "resultsCount" in document
        ) {
          this.noOfDocumentsToReindex = document.resultsCount
            ? (document.resultsCount as number)
            : 0;
          if (this.noOfDocumentsToReindex === 0) {
            this.pictureRenditionService.spinnerStatus.next(false);
            this.showRenditionErrorModal({
              type: ERROR_TYPES.NO_MATCHING_QUERY,
              details: {
                message: ERROR_MESSAGES.NO_MATCHING_QUERY_MESSAGE,
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
        this.pictureRenditionService.spinnerStatus.next(false);
        this.noOfDocumentsToReindex = -1;
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
            RenditionsActions.onNxqlPictureRenditionsFailure({
              error: errorJson as HttpErrorResponse,
            })
          );
        }
      });
  }

  showConfirmationModal(documentCount: number, query: string): void {
    this.confirmDialogRef = this.dialogService.open(
      PictureRenditionsModalComponent,
      {
        disableClose: true,
        height: MODAL_DIMENSIONS.HEIGHT,
        width: MODAL_DIMENSIONS.WIDTH,
        data: {
          type: PICTURE_RENDITIONS_LABELS.MODAL_TYPE.confirm,
          title: `${PICTURE_RENDITIONS_LABELS.RENDITION_LAUNCHED_MODAL_TITLE}`,
          message: `${PICTURE_RENDITIONS_LABELS.REINDEX_WARNING}`,
          documentCount,
          timeTakenToReindex: this.getHumanReadableTime(
            documentCount / PICTURE_RENDITIONS_LABELS.REFERENCE_POINT
          ),
        },
      }
    );

    this.confirmDialogClosedSubscription = this.confirmDialogRef
      .afterClosed()
      .subscribe((data) => {
        this.onConfirmationModalClose(data as RenditionsModalClosedInfo, query);
      });
  }

  onConfirmationModalClose(data: RenditionsModalClosedInfo, query: string): void {
    this.isRenditionsBtnDisabled = false;
    if (data?.continue) {
      /* The single quote is decoded and replaced with encoded backslash and single quotes, to form the request query correctly
          for picture rendition endpoint, for paths containing single quote e.g. /default-domain/ws1/Harry's-file will be built like
          /default-domain/workspaces/ws1/Harry%5C%27s-file
          Other special characters are encoded by default by nuxeo js client, but not single quote */
      try {
        console.log(2);
        this.decodedUserInput = decodeURIComponent(query).replace(
          /\\'/g,
          "%5C%27"
        );
        this.store.dispatch(
          RenditionsActions.performNxqlPictureRenditions({
            nxqlQuery: this.decodedUserInput,
          })
        );
      } catch (error) {
        this.showRenditionErrorModal({
          type: ERROR_TYPES.INVALID_QUERY,
          details: {
            message: ERROR_MESSAGES.INVALID_QUERY_MESSAGE,
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
    return this.pictureRenditionService.secondsToHumanReadable(seconds);
  }

  ngOnDestroy(): void {
    this.store.dispatch(RenditionsActions.resetNxqlPictureRenditionsState());
    this.nxqlPictureRenditionsLaunchedSubscription?.unsubscribe();
    this.nxqlPictureRenditionsErrorSubscription?.unsubscribe();
    this.pictureDialogClosedSubscription?.unsubscribe();
    this.confirmDialogClosedSubscription?.unsubscribe();
    this.launchedDialogClosedSubscription?.unsubscribe();
    this.errorDialogClosedSubscription?.unsubscribe();
  }
}
