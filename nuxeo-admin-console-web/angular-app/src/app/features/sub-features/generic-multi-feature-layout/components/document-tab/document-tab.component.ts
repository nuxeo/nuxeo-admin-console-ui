import { REST_END_POINTS } from "./../../../../../shared/constants/rest-end-ponts.constants";
import { GenericMultiFeatureUtilitiesService } from "./../../services/generic-multi-feature-utilities.service";
import { NuxeoJSClientService } from "./../../../../../shared/services/nuxeo-js-client.service";
import { ErrorModalComponent } from "../error-modal/error-modal.component";
import { ErrorModalClosedInfo } from "./../../../../../shared/types/common.interface";
import {
  ErrorDetails,
  FeatureData,
  GenericModalClosedInfo,
  labelsList,
} from "../../generic-multi-feature-layout.interface";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActionInfo } from "../../generic-multi-feature-layout.interface";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Nuxeo from "nuxeo";
import { GenericModalComponent } from "../generic-modal/generic-modal.component";
import {
  ERROR_MESSAGES,
  ERROR_MODAL_LABELS,
  ERROR_TYPES,
  GENERIC_LABELS,
  MODAL_DIMENSIONS,
} from "../../generic-multi-feature-layout.constants";
import { DocumentActionState } from "../../store/reducers";
import * as FeatureActions from "../../store/actions";
import {
  FEATURES,
  FeaturesKey,
  featureMap,
  getFeatureKeyByValue,
} from "../../generic-multi-feature-layout.mapping";
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
  confirmDialogClosedSubscription = new Subscription();
  launchedDialogClosedSubscription = new Subscription();
  errorDialogClosedSubscription = new Subscription();
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
  endpointData = {} as unknown;
  requestQuery = '';
  constructor(
    public dialogService: MatDialog,
    private fb: FormBuilder,
    private store: Store<{ documentAction: DocumentActionState }>,
    private nuxeoJSClientService: NuxeoJSClientService,
    private genericMultiFeatureUtilitiesService: GenericMultiFeatureUtilitiesService
  ) {
    this.inputForm = this.fb.group({
      inputIdentifier: ["", Validators.required],
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
      ) as unknown as FeatureData;
      this.templateLabels = this.templateConfigData?.labels;
      this.endpointData = this.templateConfigData?.data;
      this.genericMultiFeatureUtilitiesService.pageTitle.next(
        this.templateLabels.pageTitle
      );
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
            details: { status: error.status, message: error.message },
          });
        }
      }
    );
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
          details: {
            message: ERROR_MESSAGES.INVALID_DOC_ID_OR_PATH_MESSAGE,
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
           
            /*  const requestQuery =
              this.genericMultiFeatureUtilitiesService.getRequestQuery(
                this.templateConfigData.requestParams as string,
                decodedPath
              ); */
              this.requestQuery =
              this.genericMultiFeatureUtilitiesService.getRequestQuery(
                (this.templateConfigData?.data["queryParam"])
                  ? this.templateConfigData?.data["queryParam"]["query"] as string
                  : this.templateConfigData?.data["bodyParam"]["query"] as string,
                  decodedPath
              );
            const featureKey = getFeatureKeyByValue(
              this.activeFeature
            ) as FeaturesKey;
            if (featureKey in FEATURES) {
              let requestUrl = "";
              let requestParams = this.templateConfigData?.data["bodyParam"];
              // Prepare body params object with dynamic parameters & their values entered as input
              if (requestParams) {
                // Since, it is bodyParam, the query would be part of body params object & not the url
                requestParams["query"] = this.requestQuery;
                Object.keys(requestParams).forEach((key) => {
                  if (key in this) {
                    const paramValue = this[key as keyof DocumentTabComponent];
                    /* Only add the param to body params object list if user has enetered a value for it */
                    if (paramValue) {
                      requestParams[key] = paramValue;
                    }
                  }
                });
              } else {
                // since it is queryParam, the query would be appended to the url
                requestUrl = this.requestQuery;
              }
              this.store.dispatch(
                FeatureActions.performDocumentAction({
                  requestUrl,
                  requestParams,
                  featureEndpoint: REST_END_POINTS[featureKey],
                })
              );
            } else {
              console.error(`Invalid feature key: ${featureKey}`);
            }
          } catch (error) {
            this.showActionErrorModal({
              type: ERROR_TYPES.INVALID_DOC_ID_OR_PATH,
              details: {
                message: ERROR_MESSAGES.INVALID_DOC_ID_OR_PATH_MESSAGE,
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
            FeatureActions.onDocumentActionFailure({
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
    this.store.dispatch(FeatureActions.resetDocumentActionState());
    this.documentActionLaunchedSubscription?.unsubscribe();
    this.documentActionErrorSubscription?.unsubscribe();
    this.actionDialogClosedSubscription?.unsubscribe();
    this.launchedDialogClosedSubscription?.unsubscribe();
    this.errorDialogClosedSubscription?.unsubscribe();
  }
}
