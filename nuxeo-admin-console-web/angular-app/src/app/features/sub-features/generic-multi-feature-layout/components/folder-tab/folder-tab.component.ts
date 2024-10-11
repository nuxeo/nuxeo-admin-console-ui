import { REST_END_POINTS } from "./../../../../../shared/constants/rest-end-ponts.constants";
import { MatDialog } from "@angular/material/dialog";
import { MatDialogRef } from "@angular/material/dialog";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Nuxeo from "nuxeo";
import {
  ERROR_MESSAGES,
  ERROR_MODAL_LABELS,
  ERROR_TYPES,
  GENERIC_LABELS,
  MODAL_DIMENSIONS,
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
})
export class FolderTabComponent implements OnInit, OnDestroy {
  spinnerVisible = false;
  spinnerStatusSubscription: Subscription = new Subscription();
  userInput = "";
  decodedUserInput = "";
  inputForm: FormGroup;
  folderActionLaunched$: Observable<ActionInfo>;
  folderActionError$: Observable<HttpErrorResponse | null>;
  folderActionLaunchedSubscription = new Subscription();
  folderActionErrorSubscription = new Subscription();
  actionDialogClosedSubscription = new Subscription();
  confirmDialogClosedSubscription = new Subscription();
  launchedDialogClosedSubscription = new Subscription();
  errorDialogClosedSubscription = new Subscription();
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
  nuxeo: Nuxeo;
  isSubmitBtnDisabled = false;
  templateConfigData: FeatureData = {} as FeatureData;
  templateLabels: labelsList = {} as labelsList;
  requestQuery = "";
  activeFeature: FeaturesKey = {} as FeaturesKey;
  featuresRequiringOnlyId = ["elasticsearch-reindex"];

  constructor(
    public dialogService: MatDialog,
    private fb: FormBuilder,
    private store: Store<{ folderAction: FolderActionState }>,
    private nuxeoJSClientService: NuxeoJSClientService,
    private genericMultiFeatureUtilitiesService: GenericMultiFeatureUtilitiesService
  ) {
    this.inputForm = this.fb.group({
      inputIdentifier: ["", Validators.required],
    });
    this.nuxeo = this.nuxeoJSClientService.getNuxeoInstance();
    this.folderActionLaunched$ = this.store.pipe(
      select((state) => state.folderAction?.folderActionInfo)
    );
    this.folderActionError$ = this.store.pipe(
      select((state) => state.folderAction?.error)
    );
    this.spinnerStatusSubscription =
      this.genericMultiFeatureUtilitiesService.spinnerStatus.subscribe(
        (status) => {
          this.spinnerVisible = status;
        }
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
        GENERIC_LABELS.FOLDER
      ) as FeatureData;
      this.templateLabels = this.templateConfigData?.labels;
      this.genericMultiFeatureUtilitiesService.pageTitle.next(
        this.templateLabels.pageTitle
      );
    }

    this.folderActionLaunchedSubscription =
      this.folderActionLaunched$.subscribe((data) => {
        if (data?.commandId) {
          this.showActionLaunchedModal(data?.commandId);
        }
      });

    this.folderActionErrorSubscription = this.folderActionError$.subscribe(
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
      height: MODAL_DIMENSIONS.HEIGHT,
      width: MODAL_DIMENSIONS.WIDTH,
      data: {
        error,
        userInput: this.userInput,
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
    this.genericMultiFeatureUtilitiesService.spinnerStatus.next(false);
    document.getElementById("inputIdentifier")?.focus();
  }

  showActionLaunchedModal(commandId: string | null): void {
    this.launchedDialogRef = this.dialogService.open(GenericModalComponent, {
      disableClose: true,
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
  }

  onActionLaunchedModalClose(): void {
    this.isSubmitBtnDisabled = false;
    this.inputForm?.reset();
    document.getElementById("inputIdentifier")?.focus();
  }

  isIdAndPathRequired(activeFeature: string): boolean {
    return !this.featuresRequiringOnlyId.includes(activeFeature);
  }

  getErrorMessage(): string | null {
    const areIdAndPathRequired = this.isIdAndPathRequired(this.activeFeature as string);
    if (this.inputForm?.get("inputIdentifier")?.hasError("required") && !areIdAndPathRequired) {
      return GENERIC_LABELS.REQUIRED_DOCID_ERROR;
    }
    if (this.inputForm?.get("inputIdentifier")?.hasError("required") && areIdAndPathRequired) {
      return GENERIC_LABELS.REQUIRED_DOCID_OR_PATH_ERROR;
    }
    return null;
  }

  buildRequestQuery(input: string): string {
    return this.genericMultiFeatureUtilitiesService.getRequestQuery(
      (this.templateConfigData?.data["queryParam"]?.[
        GENERIC_LABELS.QUERY
      ] as string) ||
      (this.templateConfigData?.data["bodyParam"]?.[
        GENERIC_LABELS.QUERY
      ] as string) ||
      "",
      input
    );
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
      try {
        this.decodedUserInput =
          this.genericMultiFeatureUtilitiesService.decodeAndReplaceSingleQuotes(
            decodeURIComponent(this.userInput)
          );

        this.requestQuery = this.buildRequestQuery(this.decodedUserInput)
        console.log("active feature", this.activeFeature);
        const areIdAndPathRequired = this.isIdAndPathRequired(this.activeFeature as string);
        if (areIdAndPathRequired) {
          this.triggerAction(this.decodedUserInput);
        }
        this.fetchNoOfDocuments(this.requestQuery);
      } catch (error) {
        this.showActionErrorModal({
          type: ERROR_TYPES.INVALID_DOC_ID,
          details: {
            message: ERROR_MESSAGES.INVALID_DOC_ID_MESSAGE,
          },
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
          console.log("doc folder", doc);
          const decodedPath =
            doc.path.indexOf("'") > -1
              ? this.genericMultiFeatureUtilitiesService.decodeAndReplaceSingleQuotes(
                decodeURIComponent(doc.path)
              )
              : doc.path;
          console.log("folder decoded path", decodedPath);
          this.requestQuery = this.buildRequestQuery(decodedPath)
          console.log("folder request query", this.requestQuery);
        }
      })
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
            FeatureActions.onFolderActionFailure({
              error: errorJson as HttpErrorResponse,
            })
          );
        }
      });
  }

  showConfirmationModal(documentCount: number): void {
    this.confirmDialogRef = this.dialogService.open(GenericModalComponent, {
      disableClose: true,
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
        this.onConfirmationModalClose(data);
      });
  }

  onConfirmationModalClose(modalData: unknown): void {
    this.isSubmitBtnDisabled = false;
    const data = modalData as GenericModalClosedInfo;
    console.log("onConfirmationModalClose", modalData);
    if (data?.continue) {
      const featureKey = getFeatureKeyByValue(
        this.activeFeature
      ) as FeaturesKey;
      if (featureKey in FEATURES) {
        const { requestUrl, requestParams } =
          this.genericMultiFeatureUtilitiesService.buildRequestParams(
            this.templateConfigData.data,
            this.requestQuery,
            this.inputForm
          );
        console.log("requestParams Folder", this.requestQuery)
        this.store.dispatch(
          FeatureActions.performFolderAction({
            requestUrl,
            requestParams,
            featureEndpoint: REST_END_POINTS[featureKey],
          })
        );
      } else {
        console.error(`Invalid feature key: ${featureKey}`);
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
    this.store.dispatch(FeatureActions.resetFolderActionState());
    this.folderActionLaunchedSubscription?.unsubscribe();
    this.folderActionErrorSubscription?.unsubscribe();
    this.confirmDialogClosedSubscription?.unsubscribe();
    this.launchedDialogClosedSubscription?.unsubscribe();
    this.errorDialogClosedSubscription?.unsubscribe();
    this.spinnerStatusSubscription?.unsubscribe();
  }
}
