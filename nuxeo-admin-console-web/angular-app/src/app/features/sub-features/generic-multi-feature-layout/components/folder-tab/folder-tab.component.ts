import { VIDEO_RENDITIONS_LABELS } from "./../../../../video-renditions-generation/video-renditions-generation.constants";
import { FULLTEXT_REINDEX_LABELS } from "src/app/features/fulltext-reindex/fulltext-reindex.constants";
import { REST_END_POINTS } from "./../../../../../shared/constants/rest-end-ponts.constants";
import { MatDialog } from "@angular/material/dialog";
import { MatDialogRef } from "@angular/material/dialog";
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { Observable, Subject, takeUntil} from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Nuxeo from "nuxeo";
import {
  ERROR_MESSAGES,
  ERROR_TYPES,
  GENERIC_LABELS,
  MODAL_DIMENSIONS,
  featuresRequiringOnlyId,
} from "../../generic-multi-feature-layout.constants";
import { GenericModalComponent } from "../generic-modal/generic-modal.component";
import {
  ActionInfo,
  ErrorDetails,
  FeatureData,
  GenericModalClosedInfo,
  labelsList,
} from "../../generic-multi-feature-layout.interface";
import { GenericMultiFeatureUtilitiesService } from "../../services/generic-multi-feature-utilities.service";
import { ErrorModalComponent } from "../error-modal/error-modal.component";
import { ErrorModalClosedInfo } from "../../../../../shared/types/common.interface";
import { NuxeoJSClientService } from "../../../../../shared/services/nuxeo-js-client.service";
import { FolderActionState } from "../../store/reducers";
import * as FeatureActions from "../../store/actions";
import {
  FEATURES,
  FeaturesKey,
  featureMap,
  getFeatureKeyByValue,
} from "../../generic-multi-feature-layout.mapping";
@Component({
  selector: "folder-tab",
  templateUrl: "./folder-tab.component.html",
  styleUrls: ["./folder-tab.component.scss"],
  standalone: false
})
export class FolderTabComponent implements OnInit, OnDestroy {
  spinnerVisible = false;
  userInput = "";
  decodedUserInput = "";
  inputForm: FormGroup;
  folderActionLaunched$: Observable<ActionInfo>;
  folderActionError$: Observable<HttpErrorResponse | null>;
  launchedDialogRef: MatDialogRef<
    GenericModalComponent,
    GenericModalClosedInfo
  > = {} as MatDialogRef<GenericModalComponent, GenericModalClosedInfo>;
  errorDialogRef: MatDialogRef<ErrorModalComponent, ErrorModalClosedInfo> =
    {} as MatDialogRef<ErrorModalComponent, ErrorModalClosedInfo>;
  confirmDialogRef: MatDialogRef<
    GenericModalComponent,
    GenericModalClosedInfo
  > = {} as MatDialogRef<GenericModalComponent, GenericModalClosedInfo>;
  GENERIC_LABELS = GENERIC_LABELS;
  VIDEO_RENDITIONS_LABELS = VIDEO_RENDITIONS_LABELS;
  FULLTEXT_REINDEX_LABELS = FULLTEXT_REINDEX_LABELS
  nuxeo: Nuxeo;
  isSubmitBtnDisabled = false;
  templateConfigData: FeatureData = {} as FeatureData;
  templateLabels: labelsList = {} as labelsList;
  requestQuery = "";
  activeFeature: FeaturesKey = {} as FeaturesKey;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    public dialogService: MatDialog,
    private fb: FormBuilder,
    private store: Store<{ folderAction: FolderActionState }>,
    private nuxeoJSClientService: NuxeoJSClientService,
    private genericMultiFeatureUtilitiesService: GenericMultiFeatureUtilitiesService
  ) {
    this.inputForm = this.fb.group({
      inputIdentifier: ["", Validators.required],
      force: [false],
    });
    this.nuxeo = this.nuxeoJSClientService.getNuxeoInstance();
    this.folderActionLaunched$ = this.store.pipe(
      select((state) => state.folderAction?.folderActionInfo)
    );
    this.folderActionError$ = this.store.pipe(
      select((state) => state.folderAction?.error)
    );
    this.genericMultiFeatureUtilitiesService.spinnerStatus
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        this.spinnerVisible = status;
      });
  }

  ngOnInit(): void {
    this.nuxeo = this.nuxeoJSClientService.getNuxeoInstance();
    const featureConfig = featureMap();
    this.activeFeature =
      this.genericMultiFeatureUtilitiesService.getActiveFeature();
    const featureKey = getFeatureKeyByValue(this.activeFeature) as FeaturesKey;
    if (this.activeFeature && this.activeFeature in featureConfig) {
      this.templateConfigData = featureConfig[FEATURES[featureKey]](
        GENERIC_LABELS.FOLDER
      ) as FeatureData;
      this.templateLabels = this.templateConfigData?.labels;
      this.genericMultiFeatureUtilitiesService.pageTitle.next(
        this.templateLabels.pageTitle
      );
    }
    if(this.isFeatureFullTextReindex()) {
      this.inputForm.addControl(
        FULLTEXT_REINDEX_LABELS.FORCE,
        new FormControl("false")
      );
    }
    if (this.isFeatureVideoRenditions()) {
      this.inputForm.addControl(
        VIDEO_RENDITIONS_LABELS.CONVERSION_NAME_KEY,
        new FormControl("")
      );
      this.inputForm.addControl(
        VIDEO_RENDITIONS_LABELS.RECOMPUTE_ALL_VIDEO_INFO_KEY,
        new FormControl("false")
      );
    }

    this.folderActionLaunched$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data?.commandId) {
          this.showActionLaunchedModal(data?.commandId);
        }
      });

    this.folderActionError$.pipe(takeUntil(this.destroy$)).subscribe(
      (error) => {
        if (error) {
          this.showActionErrorModal({
            type: ERROR_TYPES.SERVER_ERROR,
            details: { status: error.status, message: error.message },
          });
        }
      }
    );
  }

  showActionErrorModal(error: ErrorDetails): void {
    this.genericMultiFeatureUtilitiesService.spinnerStatus.next(false);
    this.errorDialogRef = this.dialogService.open(ErrorModalComponent, {
      disableClose: true,
      hasBackdrop: true,
      height: MODAL_DIMENSIONS.HEIGHT,
      width: MODAL_DIMENSIONS.WIDTH,
      data: {
        error,
        userInput: this.userInput,
      },
    });
    this.errorDialogRef
      ?.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onActionErrorModalClose();
      });

    this.errorDialogRef
      .afterOpened()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const dialogElement = document.querySelector(
          ".cdk-dialog-container"
        ) as HTMLElement;
        if (dialogElement) {
          dialogElement.focus();
        }
      });
  }

  onActionErrorModalClose(): void {
    this.isSubmitBtnDisabled = false;
    this.genericMultiFeatureUtilitiesService.spinnerStatus.next(false);
    document.getElementById("inputIdentifier")?.focus();
  }

  showActionLaunchedModal(commandId: string | null): void {
    this.launchedDialogRef = this.dialogService.open(GenericModalComponent, {
      disableClose: true,
      hasBackdrop: true,
      height: MODAL_DIMENSIONS.HEIGHT,
      width: MODAL_DIMENSIONS.WIDTH,
      data: {
        type: GENERIC_LABELS.MODAL_TYPE.launched,
        title: `${GENERIC_LABELS.ACTION_LAUNCHED_MODAL_TITLE}`,
        launchedMessage: `${GENERIC_LABELS.ACTION_LAUNCHED} ${commandId}. ${GENERIC_LABELS.COPY_MONITORING_ID}`,
        commandId,
      },
    });

    this.launchedDialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onActionLaunchedModalClose();
      });

    this.launchedDialogRef
      .afterOpened()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const dialogElement = document.querySelector(
          ".cdk-dialog-container"
        ) as HTMLElement;
        if (dialogElement) {
          dialogElement.focus();
        }
      });
  }

  onActionLaunchedModalClose(): void {
    this.isSubmitBtnDisabled = false;
    this.inputForm?.get("inputIdentifier")?.reset();
    if (this.isFeatureVideoRenditions()) {
      this.inputForm?.get("conversionNames")?.reset();
    }
    document.getElementById("inputIdentifier")?.focus();
  }

  isIdAndPathRequired(activeFeature: string): boolean {
    return !featuresRequiringOnlyId.includes(activeFeature);
  }

  getErrorMessage(): string | null {
    const areIdAndPathRequired = this.isIdAndPathRequired(
      this.activeFeature as string
    );
    const hasRequiredError = this.inputForm
      ?.get("inputIdentifier")
      ?.hasError("required");
    if (hasRequiredError) {
      if (areIdAndPathRequired) {
        return GENERIC_LABELS.REQUIRED_DOCID_OR_PATH_ERROR;
      }
      return GENERIC_LABELS.REQUIRED_DOCID_ERROR;
    }
    return null;
  }

  onFormSubmit(): void {
    if (this.inputForm?.valid && !this.isSubmitBtnDisabled) {
      this.isSubmitBtnDisabled = true;
      this.genericMultiFeatureUtilitiesService.spinnerStatus.next(true);
      this.userInput =
        this.genericMultiFeatureUtilitiesService.removeLeadingCharacters(
          this.inputForm?.get("inputIdentifier")?.value.trim()
        );
      /* The single quote is decoded and replaced with encoded backslash and single quotes, to form the request query correctly
          for the action endpoint, for paths containing single quote e.g. /default-domain/ws1/Harry's-file will be built like
          /default-domain/workspaces/ws1/Harry%5C%27s-file
          Other special characters are encoded by default by nuxeo js client, but not single quote */
      const areIdAndPathRequired = this.isIdAndPathRequired(
        this.activeFeature as string
      );
      try {
        this.decodedUserInput =
          this.genericMultiFeatureUtilitiesService.decodeAndReplaceSingleQuotes(
            decodeURIComponent(this.userInput)
          );
        this.triggerAction(this.decodedUserInput);
      } catch (error) {
        this.showActionErrorModal({
          type: areIdAndPathRequired
            ? ERROR_TYPES.INVALID_DOC_ID_OR_PATH
            : ERROR_TYPES.INVALID_DOC_ID,
          details: {
            message: areIdAndPathRequired
              ? ERROR_MESSAGES.INVALID_DOC_ID_OR_PATH_MESSAGE
              : ERROR_MESSAGES.INVALID_DOC_ID_MESSAGE,
          },
        });
      }
    }
  }

  triggerAction(userInput: string): void {
    const areIdAndPathRequired = this.isIdAndPathRequired(
      this.activeFeature as string
    );

    if (areIdAndPathRequired) {
      this.nuxeo
        .repository()
        .fetch(userInput)
        .then((document: unknown) => {
          if (
            typeof document === "object" &&
            document !== null &&
            "uid" in document
          ) {
            const doc = document as { uid: string };
            this.processRequest(doc?.uid);
          }
        })
        .catch((err: unknown) => {
          return this.genericMultiFeatureUtilitiesService.handleError(err);
        })
        .then((errorJson: unknown) => {
          this.genericMultiFeatureUtilitiesService.handleErrorJson(
            errorJson,
            FeatureActions.onFolderActionFailure,
            this.store
          );
        });
    } else {
      this.processRequest(userInput);
    }
  }

  processRequest(userInput: string): void {
    try {
      this.requestQuery =
        this.genericMultiFeatureUtilitiesService.buildRequestQuery(
          userInput,
          this.templateConfigData
        );
      this.fetchNoOfDocuments(this.requestQuery);
    } catch (error) {
      this.showActionErrorModal({
        type: ERROR_TYPES.INVALID_DOC_ID_OR_PATH,
        details: {
          message: ERROR_MESSAGES.INVALID_DOC_ID_OR_PATH_MESSAGE,
        },
      });
    }
  }

  fetchNoOfDocuments(query: string | null): void {
    this.nuxeo
      .repository()
      .query({ query, pageSize: 1 })
      .then((document: unknown) => {
        this.genericMultiFeatureUtilitiesService.spinnerStatus.next(false);
        if (
          typeof document === "object" &&
          document !== null &&
          "resultsCount" in document
        ) {
          const documentCount = document.resultsCount
            ? (document.resultsCount as number)
            : 0;
          if (documentCount === 0) {
            this.showActionErrorModal({
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
        this.genericMultiFeatureUtilitiesService.spinnerStatus.next(false);
        return this.genericMultiFeatureUtilitiesService.handleError(err);
      })
      .then((errorJson: unknown) => {
        this.genericMultiFeatureUtilitiesService.handleErrorJson(
          errorJson,
          FeatureActions.onFolderActionFailure,
          this.store
        );
      });
  }

  showConfirmationModal(documentCount: number): void {
    this.confirmDialogRef = this.dialogService.open(GenericModalComponent, {
      disableClose: true,
      hasBackdrop: true,
      height: MODAL_DIMENSIONS.HEIGHT,
      width: MODAL_DIMENSIONS.WIDTH,
      data: {
        type: GENERIC_LABELS.MODAL_TYPE.confirm,
        title: `${GENERIC_LABELS.ACTION_CONFIRMATION_MODAL_TITLE}`,
        message: `${GENERIC_LABELS.ACTION_WARNING}`,
        documentCount,
        timeTakenForAction: this.getHumanReadableTime(
          documentCount / GENERIC_LABELS.REFERENCE_POINT
        ),
      },
    });

    this.confirmDialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.onConfirmationModalClose(data);
      });

    this.confirmDialogRef
      .afterOpened()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const dialogElement = document.querySelector(
          ".cdk-dialog-container"
        ) as HTMLElement;
        if (dialogElement) {
          dialogElement.focus();
        }
      });
  }

  onConfirmationModalClose(modalData: unknown): void {
    this.isSubmitBtnDisabled = false;
    const data = modalData as GenericModalClosedInfo;
    if (data?.continue) {
      const featureKey = getFeatureKeyByValue(
        this.activeFeature
      ) as FeaturesKey;
      if (featureKey in FEATURES) {
        const { requestUrl, requestParams, requestHeaders } =
          this.genericMultiFeatureUtilitiesService.buildRequestParams(
            this.templateConfigData.data,
            this.requestQuery,
            this.inputForm
          );
        this.store.dispatch(
          FeatureActions.performFolderAction({
            requestUrl,
            requestParams,
            featureEndpoint: REST_END_POINTS[featureKey],
            requestHeaders,
          })
        );
      } else {
        console.error(`Invalid feature key: ${featureKey}`);
      }
    } else {
      document.getElementById("inputIdentifier")?.focus();
    }
  }

  getHumanReadableTime(seconds: number): string {
    return this.genericMultiFeatureUtilitiesService.secondsToHumanReadable(
      seconds
    );
  }

  isFeatureVideoRenditions(): boolean {
    return (
      this.activeFeature ===
      (FEATURES.VIDEO_RENDITIONS_GENERATION as FeaturesKey)
    );
  }

  isFeatureFullTextReindex(): boolean {
    return (
      this.activeFeature ===
      (FEATURES.FULLTEXT_REINDEX as FeaturesKey)
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(FeatureActions.resetFolderActionState());
    this.destroy$.next();
    this.destroy$.complete();
  }
}
