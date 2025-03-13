import { VIDEO_RENDITIONS_LABELS } from "./../../../../video-renditions-generation/video-renditions-generation.constants";
import { FULLTEXT_REINDEX_LABELS } from "../../../../fulltext-reindex/fulltext-reindex.constants";
import { REST_END_POINTS } from "./../../../../../shared/constants/rest-end-ponts.constants";
import { GenericMultiFeatureUtilitiesService } from "./../../services/generic-multi-feature-utilities.service";
import { NuxeoJSClientService } from "./../../../../../shared/services/nuxeo-js-client.service";
import {
  FeatureData,
  GenericModalClosedInfo,
  labelsList,
} from "../../generic-multi-feature-layout.interface";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActionInfo } from "../../generic-multi-feature-layout.interface";
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Nuxeo from "nuxeo";
import { GenericModalComponent } from "../generic-modal/generic-modal.component";

import { DocumentActionState } from "../../store/reducers";
import * as FeatureActions from "../../store/actions";
import {
  FEATURES,
  FeaturesKey,
  featureMap,
  getFeatureKeyByValue,
} from "../../generic-multi-feature-layout.mapping";
import { ErrorModalComponent } from "../../../../../shared/components/error-modal/error-modal.component";
import { GENERIC_LABELS } from "../../generic-multi-feature-layout.constants";
import { ERROR_MESSAGES, ERROR_MODAL_LABELS, ERROR_TYPES } from "../../../../../shared/constants/error-modal.constants";
import { ErrorDetails, ErrorModalClosedInfo } from "../../../../../shared/types/errors.interface";
import { COMMON_LABELS, MODAL_DIMENSIONS } from "../../../../../shared/constants/common.constants";
type ActionsImportFunction = () => Promise<unknown>;

@Component({
  selector: "document-tab",
  templateUrl: "./document-tab.component.html",
  styleUrls: ["./document-tab.component.scss"],
})
export class DocumentTabComponent implements OnInit, OnDestroy {
  inputForm: FormGroup;
  documentActionLaunched$: Observable<ActionInfo>;
  documentActionError$: Observable<HttpErrorResponse | null>;
  documentActionLaunchedSubscription = new Subscription();
  documentActionErrorSubscription = new Subscription();
  actionDialogClosedSubscription = new Subscription();
  launchedDialogClosedSubscription = new Subscription();
  errorDialogClosedSubscription = new Subscription();
  launchedDialogOpenedSubscription = new Subscription();
  errorDialogOpenedSubscription = new Subscription();
  launchedDialogRef: MatDialogRef<
    GenericModalComponent,
    GenericModalClosedInfo
  > = {} as MatDialogRef<GenericModalComponent, GenericModalClosedInfo>;
  errorDialogRef: MatDialogRef<ErrorModalComponent, ErrorModalClosedInfo> =
    {} as MatDialogRef<ErrorModalComponent, ErrorModalClosedInfo>;
  GENERIC_LABELS = GENERIC_LABELS;
  nuxeo: Nuxeo;
  isSubmitBtnDisabled = false;
  templateConfigData: FeatureData = {} as FeatureData;
  templateLabels: labelsList = {} as labelsList;
  actionsImportFn: ActionsImportFunction | null = null;
  activeFeature: FeaturesKey = {} as FeaturesKey;
  requestQuery = "";
  VIDEO_RENDITIONS_LABELS = VIDEO_RENDITIONS_LABELS;
  FULLTEXT_REINDEX_LABELS = FULLTEXT_REINDEX_LABELS;
  FEATURES = FEATURES;
  COMMON_LABELS = COMMON_LABELS;
  
  constructor(
    public dialogService: MatDialog,
    private fb: FormBuilder,
    private store: Store<{ documentAction: DocumentActionState }>,
    private nuxeoJSClientService: NuxeoJSClientService,
    private genericMultiFeatureUtilitiesService: GenericMultiFeatureUtilitiesService
  ) {
    this.inputForm = this.fb.group({
      inputIdentifier: ["", Validators.required],
      force: [false],
    });
    this.nuxeo = this.nuxeoJSClientService.getNuxeoInstance();
    this.documentActionLaunched$ = this.store.pipe(
      select((state) => state.documentAction?.documentActionInfo)
    );
    this.documentActionError$ = this.store.pipe(
      select((state) => state.documentAction?.error)
    );
  }

  ngOnInit(): void {
    this.nuxeo = this.nuxeoJSClientService.getNuxeoInstance();
    const featureConfig = featureMap();
    this.activeFeature =
      this.genericMultiFeatureUtilitiesService.getActiveFeature();
    const featureKey = getFeatureKeyByValue(this.activeFeature) as FeaturesKey;
    if (this.activeFeature && this.activeFeature in featureConfig) {
      this.templateConfigData = featureConfig[FEATURES[featureKey]](
        GENERIC_LABELS.DOCUMENT
      ) as FeatureData;
      this.templateLabels = this.templateConfigData?.labels;
      this.genericMultiFeatureUtilitiesService.pageTitle.next(
        this.templateLabels.pageTitle
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
      if (this.isFeatureFullTextReindex()) {
        this.inputForm.addControl(
          FULLTEXT_REINDEX_LABELS.FORCE,
          new FormControl("false")
        );
      }
    }

    this.documentActionLaunchedSubscription =
      this.documentActionLaunched$.subscribe((data) => {
        if (data?.commandId) {
          this.showActionLaunchedModal(data?.commandId);
        }
      });

    this.documentActionErrorSubscription = this.documentActionError$.subscribe(
      (error) => {
        if (error) {
          this.showActionErrorModal({
            type: ERROR_TYPES.SERVER_ERROR,
            // details: { status: error.status, message: error.message },
            subheading: ERROR_MODAL_LABELS.ERROR_SUBHEADING,
            status: error.status,
            message: error.message

          });
        }
      }
    );
  }

  showActionErrorModal(error: ErrorDetails): void {
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
    if (this.isFeatureFullTextReindex()) {
      this.inputForm?.get("force")?.reset();
    }

    document.getElementById("inputIdentifier")?.focus();
  }

  getErrorMessage(): string | null {
    if (this.inputForm?.get("inputIdentifier")?.hasError("required")) {
      return GENERIC_LABELS.REQUIRED_DOCID_OR_PATH_ERROR;
    }
    return null;
  }

  onFormSubmit(): void {
    if (this.inputForm?.valid && !this.isSubmitBtnDisabled) {
      this.isSubmitBtnDisabled = true;
      const userInput = this.inputForm?.get("inputIdentifier")?.value?.trim();
      let decodedUserInput: string | null = null;
      try {
        decodedUserInput = decodeURIComponent(
          this.genericMultiFeatureUtilitiesService.removeLeadingCharacters(
            userInput
          )
        );
        this.triggerAction(decodedUserInput);
      } catch (error) {
        this.showActionErrorModal({
          type: ERROR_TYPES.INVALID_DOC_ID_OR_PATH,
          // details: {
          //   message: ERROR_MESSAGES.INVALID_DOC_ID_OR_PATH_MESSAGE,
          // },
          customText: ERROR_MESSAGES.INVALID_DOC_ID_OR_PATH_MESSAGE
        });
      }
    }
  }

  triggerAction(userInput: string | null): void {
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
          for the action endpoint, for paths containing single quote e.g. /default-domain/ws1/Harry's-file will be built like
          /default-domain/workspaces/ws1/Harry%5C%27s-file
          Other special characters are encoded by default by nuxeo js client, but not single quote */
          try {
            const decodedPath =
              doc.path.indexOf("'") > -1
                ? this.genericMultiFeatureUtilitiesService.decodeAndReplaceSingleQuotes(
                    decodeURIComponent(doc.path)
                  )
                : doc.path;
            this.requestQuery =
              this.genericMultiFeatureUtilitiesService.buildRequestQuery(
                decodedPath,
                this.templateConfigData
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
                FeatureActions.performDocumentAction({
                  requestUrl,
                  requestParams,
                  requestHeaders,
                  featureEndpoint: REST_END_POINTS[featureKey],
                })
              );
            } else {
              console.error(`Invalid feature key: ${featureKey}`);
            }
          } catch (error) {
            this.showActionErrorModal({
              type: ERROR_TYPES.INVALID_DOC_ID_OR_PATH,
              // details: {
              //   message: ERROR_MESSAGES.INVALID_DOC_ID_OR_PATH_MESSAGE,
              // },
              customText: ERROR_MESSAGES.INVALID_DOC_ID_OR_PATH_MESSAGE
            });
          }
        }
      })
      .catch((err: unknown) => {
        return this.genericMultiFeatureUtilitiesService.handleError(err);
      })
      .then((errorJson: unknown) => {
        this.genericMultiFeatureUtilitiesService.handleErrorJson(
          errorJson,
          FeatureActions.onDocumentActionFailure,
          this.store
        );
      });
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
    this.store.dispatch(FeatureActions.resetDocumentActionState());
    this.documentActionLaunchedSubscription?.unsubscribe();
    this.documentActionErrorSubscription?.unsubscribe();
    this.actionDialogClosedSubscription?.unsubscribe();
    this.launchedDialogClosedSubscription?.unsubscribe();
    this.errorDialogClosedSubscription?.unsubscribe();
    this.launchedDialogOpenedSubscription?.unsubscribe();
    this.errorDialogOpenedSubscription?.unsubscribe();
  }
}