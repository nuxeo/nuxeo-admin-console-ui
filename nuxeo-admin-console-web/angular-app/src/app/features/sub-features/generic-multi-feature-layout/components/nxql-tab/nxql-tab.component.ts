import { VIDEO_RENDITIONS_LABELS } from "./../../../../video-renditions-generation/video-renditions-generation.constants";
import { FULLTEXT_REINDEX_LABELS } from "src/app/features/fulltext-reindex/fulltext-reindex.constants";
import { REST_END_POINTS } from "./../../../../../shared/constants/rest-end-ponts.constants";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { HttpErrorResponse } from "@angular/common/http";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Nuxeo from "nuxeo";
import {
  ActionInfo,
  ErrorDetails,
  FeatureData,
  GenericModalClosedInfo,
  labelsList,
} from "../../generic-multi-feature-layout.interface";
import {
  ERROR_MESSAGES,
  ERROR_MODAL_LABELS,
  ERROR_TYPES,
  GENERIC_LABELS,
  MODAL_DIMENSIONS,
} from "../../generic-multi-feature-layout.constants";
import { GenericMultiFeatureUtilitiesService } from "../../services/generic-multi-feature-utilities.service";
import { GenericModalComponent } from "../generic-modal/generic-modal.component";
import { ErrorModalComponent } from "../error-modal/error-modal.component";
import { ErrorModalClosedInfo } from "../../../../../shared/types/common.interface";
import { NuxeoJSClientService } from "../../../../../shared/services/nuxeo-js-client.service";
import * as FeatureActions from "../../store/actions";
import { NXQLActionState } from "../../store/reducers";
import {
  FEATURES,
  FeaturesKey,
  featureMap,
  getFeatureKeyByValue,
} from "../../generic-multi-feature-layout.mapping";

@Component({
  selector: "nxql-tab",
  templateUrl: "./nxql-tab.component.html",
  styleUrls: ["./nxql-tab.component.scss"],
})
export class NXQLTabComponent implements OnInit, OnDestroy {
  inputForm: FormGroup;
  spinnerVisible = false;
  spinnerStatusSubscription: Subscription = new Subscription();
  userInput = "";
  decodedUserInput = "";
  nxqlActionLaunched$: Observable<ActionInfo>;
  nxqlActionError$: Observable<HttpErrorResponse | null>;
  nxqlActionLaunchedSubscription = new Subscription();
  nxqlActionErrorSubscription = new Subscription();
  actionDialogClosedSubscription = new Subscription();
  confirmDialogClosedSubscription = new Subscription();
  launchedDialogClosedSubscription = new Subscription();
  errorDialogClosedSubscription = new Subscription();
  confirmDialogOpenedSubscription = new Subscription();
  launchedDialogOpenedSubscription = new Subscription();
  errorDialogOpenedSubscription = new Subscription();
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
  FULLTEXT_REINDEX_LABELS = FULLTEXT_REINDEX_LABELS;
  nuxeo: Nuxeo;
  isSubmitBtnDisabled = false;
  templateConfigData: FeatureData = {} as FeatureData;
  templateLabels: labelsList = {} as labelsList;
  documentCount = -1;
  nxqlQueryHintSanitized: SafeHtml = "";
  activeFeature: FeaturesKey = {} as FeaturesKey;
  inputPlaceholder = "";
  requestQuery = "";

  constructor(
    public dialogService: MatDialog,
    private fb: FormBuilder,
    private store: Store<{ nxqlAction: NXQLActionState }>,
    private nuxeoJSClientService: NuxeoJSClientService,
    private genericMultiFeatureUtilitiesService: GenericMultiFeatureUtilitiesService,
    private sanitizer: DomSanitizer
  ) {
    this.inputForm = this.fb.group({
      inputIdentifier: ["", Validators.required],
      force: [false],
    });

    this.nxqlActionLaunched$ = this.store.pipe(
      select((state) => state.nxqlAction?.nxqlActionInfo)
    );

    this.nxqlActionError$ = this.store.pipe(
      select((state) => state.nxqlAction?.error)
    );
  }

  ngOnInit(): void {
    this.nuxeo = this.nuxeoJSClientService.getNuxeoInstance();
    this.nxqlQueryHintSanitized = this.sanitizer.bypassSecurityTrustHtml(
      GENERIC_LABELS.NXQL_INPUT_HINT
    );
    const featureConfig = featureMap();
    this.activeFeature =
      this.genericMultiFeatureUtilitiesService.getActiveFeature();
    const featureKey = getFeatureKeyByValue(this.activeFeature) as FeaturesKey;
    if (this.activeFeature && this.activeFeature in featureConfig) {
      this.templateConfigData = featureConfig[FEATURES[featureKey]](
        GENERIC_LABELS.NXQL
      ) as FeatureData;
      this.templateLabels = this.templateConfigData?.labels;
      this.inputPlaceholder = this.templateLabels
        .nxqlQueryPlaceholder as string;
      this.genericMultiFeatureUtilitiesService.pageTitle.next(
        this.templateLabels.pageTitle
      );
    }
    this.spinnerStatusSubscription =
      this.genericMultiFeatureUtilitiesService.spinnerStatus.subscribe(
        (status) => {
          this.spinnerVisible = status;
        }
      );
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
    if(this.isFeatureFullTextReindex()) {
      this.inputForm.addControl(
        FULLTEXT_REINDEX_LABELS.FORCE,
        new FormControl("false")
      );
    }
    this.nxqlActionLaunchedSubscription = this.nxqlActionLaunched$.subscribe(
      (data) => {
        if (data?.commandId) {
          this.showActionLaunchedModal(data?.commandId);
        }
      }
    );

    this.nxqlActionErrorSubscription = this.nxqlActionError$.subscribe(
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

  showActionErrorModal(error: ErrorDetails): void {
    this.genericMultiFeatureUtilitiesService.spinnerStatus.next(false);
    this.errorDialogRef = this.dialogService.open(ErrorModalComponent, {
      disableClose: true,
      hasBackdrop: true,
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

    this.errorDialogOpenedSubscription = this.errorDialogRef
      .afterOpened()
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

    this.launchedDialogClosedSubscription = this.launchedDialogRef
      .afterClosed()
      .subscribe(() => {
        this.onActionLaunchedModalClose();
      });

    this.launchedDialogOpenedSubscription = this.launchedDialogRef
      .afterOpened()
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

  getErrorMessage(): string | null {
    if (this.inputForm?.get("inputIdentifier")?.hasError("required")) {
      return GENERIC_LABELS.REQUIRED_NXQL_QUERY_ERROR;
    }
    return null;
  }

  onFormSubmit(): void {
    if (this.inputForm?.valid && !this.isSubmitBtnDisabled) {
      this.isSubmitBtnDisabled = true;
      this.genericMultiFeatureUtilitiesService.spinnerStatus.next(true);
      const userInput = this.inputForm?.get("inputIdentifier")?.value?.trim();
      /* decode user input to handle path names that contain spaces, 
      which would not be decoded by default by nuxeo js client & would result in invalid api parameter */
      try {
        this.requestQuery = decodeURIComponent(
          /* Remove leading single & double quotes in case of path, to avoid invalid nuxeo js client api parameter */
          this.genericMultiFeatureUtilitiesService.removeLeadingCharacters(
            userInput
          )
        );
        this.fetchNoOfDocuments(this.requestQuery);
      } catch (error) {
        this.genericMultiFeatureUtilitiesService.spinnerStatus.next(false);
        this.showActionErrorModal({
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
        this.genericMultiFeatureUtilitiesService.spinnerStatus.next(false);
        if (
          typeof document === "object" &&
          document !== null &&
          "resultsCount" in document
        ) {
          this.documentCount = document.resultsCount
            ? (document.resultsCount as number)
            : 0;
          if (this.documentCount === 0) {
            this.genericMultiFeatureUtilitiesService.spinnerStatus.next(false);
            this.showActionErrorModal({
              type: ERROR_TYPES.NO_MATCHING_QUERY,
              details: {
                message: ERROR_MESSAGES.NO_MATCHING_QUERY_MESSAGE,
              },
            });
          } else {
            this.showConfirmationModal(this.documentCount as number, query);
          }
        }
      })
      .catch((err: unknown) => {
        this.genericMultiFeatureUtilitiesService.spinnerStatus.next(false);
        this.documentCount = -1;
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
            FeatureActions.onNxqlActionFailure({
              error: errorJson as HttpErrorResponse,
            })
          );
        }
      });
  }

  showConfirmationModal(documentCount: number, query: string): void {
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

    this.confirmDialogClosedSubscription = this.confirmDialogRef
      .afterClosed()
      .subscribe((data) => {
        this.onConfirmationModalClose(data as GenericModalClosedInfo, query);
      });

    this.confirmDialogOpenedSubscription = this.confirmDialogRef
      .afterOpened()
      .subscribe(() => {
        const dialogElement = document.querySelector(
          ".cdk-dialog-container"
        ) as HTMLElement;
        if (dialogElement) {
          dialogElement.focus();
        }
      });
  }

  onConfirmationModalClose(data: GenericModalClosedInfo, query: string): void {
    this.isSubmitBtnDisabled = false;
    if (data?.continue) {
      /* The single quote is decoded and replaced with encoded backslash and single quotes, to form the request query correctly
          for the action endpoint, for paths containing single quote e.g. /default-domain/ws1/Harry's-file will be built like
          /default-domain/workspaces/ws1/Harry%5C%27s-file
          Other special characters are encoded by default by nuxeo js client, but not single quote */
      try {
        this.decodedUserInput = decodeURIComponent(query).replace(
          /\\'/g,
          "%5C%27"
        );
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
            FeatureActions.performNxqlAction({
              requestUrl,
              requestParams,
              featureEndpoint: REST_END_POINTS[featureKey as FeaturesKey],
              requestHeaders,
            })
          );
        } else {
          console.error(`Invalid feature key: ${featureKey}`);
        }
      } catch (error) {
        this.showActionErrorModal({
          type: ERROR_TYPES.INVALID_QUERY,
          details: {
            message: ERROR_MESSAGES.INVALID_QUERY_MESSAGE,
          },
        });
      }
    } else {
      document.getElementById("inputIdentifier")?.focus();
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
    return this.genericMultiFeatureUtilitiesService.secondsToHumanReadable(
      seconds
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(FeatureActions.resetNxqlActionState());
    this.nxqlActionLaunchedSubscription?.unsubscribe();
    this.nxqlActionErrorSubscription?.unsubscribe();
    this.actionDialogClosedSubscription?.unsubscribe();
    this.confirmDialogClosedSubscription?.unsubscribe();
    this.launchedDialogClosedSubscription?.unsubscribe();
    this.errorDialogClosedSubscription?.unsubscribe();
    this.confirmDialogOpenedSubscription?.unsubscribe();
    this.launchedDialogOpenedSubscription?.unsubscribe();
    this.errorDialogOpenedSubscription?.unsubscribe();
  }
}
