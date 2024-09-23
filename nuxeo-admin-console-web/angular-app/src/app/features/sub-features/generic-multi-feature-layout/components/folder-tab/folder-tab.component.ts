import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { MatDialogRef } from "@angular/material/dialog";
import { Component, OnDestroy } from "@angular/core";
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
  FEATURE_NAMES,
  GENERIC_LABELS,
  MODAL_DIMENSIONS,
  TAB_TYPES,
} from "../../generic-multi-feature-layout.constants";
import { GenericModalComponent } from "../generic-modal/generic-modal.component";
import {
  ActionInfo,
  ErrorDetails,
  FeatureData,
  GenericModalClosedInfo,
  actionsMap,
  labelsList,
} from "../../generic-multi-feature-layout.interface";
import { GenericMultiFeatureUtilitiesService } from "../../services/generic-multi-feature-utilities.service";
import { ErrorModalComponent } from "../../../../../shared/components/error-modal/error-modal.component";
import { ErrorModalClosedInfo } from "../../../../../shared/types/common.interface";
import { NuxeoJSClientService } from "../../../../../shared/services/nuxeo-js-client.service";
type ActionsImportFunction = () => Promise<unknown>;

@Component({
  selector: "folder-tab",
  templateUrl: "./folder-tab.component.html",
  styleUrls: ["./folder-tab.component.scss"],
})
export class FolderTabComponent implements OnDestroy {
  spinnerVisible = false;
  spinnerStatusSubscription: Subscription = new Subscription();
  userInput = "";
  decodedUserInput = "";
  inputForm: FormGroup;
  actionLaunched$!: Observable<ActionInfo>;
  actionError$!: Observable<HttpErrorResponse | null>;
  actionLaunchedSubscription = new Subscription();
  actionErrorSubscription = new Subscription();
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
  actionsImportFn: ActionsImportFunction | null = null;
  taskActions: any;
  requestQuery = "";

  constructor(
    public dialogService: MatDialog,
    private fb: FormBuilder,
    private store: Store<unknown>,
    private nuxeoJSClientService: NuxeoJSClientService,
    private genericMultiFeatureUtilitiesService: GenericMultiFeatureUtilitiesService,
    private route: ActivatedRoute
  ) {
    this.inputForm = this.fb.group({
      inputIdentifier: ["", Validators.required],
    });
    this.nuxeo = this.nuxeoJSClientService.getNuxeoInstance();
    this.route.data.subscribe((data) => {
      this.templateConfigData = data["data"];
      this.templateLabels = this.templateConfigData.labels;
      this.store = this.templateConfigData?.store;
      this.actionsImportFn =
        actionsMap[
          this.templateConfigData.featureName as keyof typeof actionsMap
        ] || null;
      if (this.actionsImportFn) {
        this.actionsImportFn().then((actionsModule) => {
          this.taskActions = actionsModule;
        });
      }
      if (this.store) {
        this.actionLaunched$ = this.store.pipe(
          select((state) =>
            this.genericMultiFeatureUtilitiesService.getActionLaunchedConfig(
              state,
              this.templateConfigData.featureName,
              TAB_TYPES.FOLDER
            ) 
         //   state[this.templateConfigData.stateSelector as string]
          )
        );
        this.actionError$ = this.store.pipe(
          select(
            (state) =>
              this.genericMultiFeatureUtilitiesService.getActionErrorConfig(
                state,
                this.templateConfigData.featureName,
                TAB_TYPES.FOLDER
              ) as HttpErrorResponse
          )
        );
        this.genericMultiFeatureUtilitiesService.pageTitle?.next(
          `${this.templateLabels.pageTitle}`
        );
        this.actionLaunchedSubscription = this.actionLaunched$?.subscribe(
          (data) => {
            if (data?.commandId) {
              this.showActionLaunchedModal(data?.commandId);
            }
          }
        );

        this.actionErrorSubscription = this.actionError$?.subscribe((error) => {
          if (error) {
            this.showActionErrorModal({
              type: ERROR_TYPES.SERVER_ERROR,
              details: { status: error.status, message: error.message },
            });
          }
        });
      }
    });

    this.spinnerStatusSubscription =
      this.genericMultiFeatureUtilitiesService.spinnerStatus.subscribe(
        (status) => {
          this.spinnerVisible = status;
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

  getErrorMessage(): string | null {
    if (this.inputForm?.get("inputIdentifier")?.hasError("required")) {
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
          for elasticsearch reindex endpoint, for paths containing single quote e.g. /default-domain/ws1/Harry's-file will be built like
          /default-domain/workspaces/ws1/Harry%5C%27s-file
          Other special characters are encoded by default by nuxeo js client, but not single quote */
      try {
        this.decodedUserInput =
          this.genericMultiFeatureUtilitiesService.decodeAndReplaceSingleQuotes(
            decodeURIComponent(this.userInput)
          );

        this.requestQuery =
          this.genericMultiFeatureUtilitiesService.getRequestQuery(
            this.templateConfigData.requestQuery as string,
            this.decodedUserInput
          );
        this.fetchNoOfDocuments(this.requestQuery as string);
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
            this.taskActions[this.templateConfigData.taskFailureAction]({
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
    if (data?.continue) {
      this.store.dispatch(
        this.taskActions[this.templateConfigData.primaryAction as string]({
          requestQuery: this.requestQuery,
        })
      );
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
    this.store.dispatch(
      this.taskActions[this.templateConfigData.resetStateAction]()
    );
    this.actionLaunchedSubscription?.unsubscribe();
    this.actionErrorSubscription?.unsubscribe();
    this.confirmDialogClosedSubscription?.unsubscribe();
    this.launchedDialogClosedSubscription?.unsubscribe();
    this.errorDialogClosedSubscription?.unsubscribe();
    this.spinnerStatusSubscription?.unsubscribe();
  }
}
