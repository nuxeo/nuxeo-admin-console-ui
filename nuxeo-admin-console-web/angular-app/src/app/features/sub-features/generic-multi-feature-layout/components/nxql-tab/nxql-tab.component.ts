import { ActivatedRoute } from "@angular/router";
import { NXQLReindexState } from "./../../../../elastic-search-reindex/store/reducers";

import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
// import * as ReindexActions from "../../store/actions";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { HttpErrorResponse } from "@angular/common/http";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Nuxeo from "nuxeo";
import {
  ActionInfo,
  ErrorDetails,
  GenericModalClosedInfo,
  TemplateConfigType,
  actionsMap,
  labelsList,
} from "../../generic-multi-feature-layout.interface";
import {
  ERROR_MESSAGES,
  ERROR_MODAL_LABELS,
  ERROR_TYPES,
  FEATURE_NAMES,
  GENERIC_LABELS,
  MODAL_DIMENSIONS,
  TAB_TYPES,
} from "../../generic-multi-feature-layout.constants";
import { GenericMultiFeatureUtilitiesService } from "../../services/generic-multi-feature-utilities.service";
import { GenericModalComponent } from "../generic-modal/generic-modal.component";
import { ErrorModalComponent } from "../../../../../shared/components/error-modal/error-modal.component";
import { ErrorModalClosedInfo } from "../../../../../shared/types/common.interface";
import { NuxeoJSClientService } from "../../../../../shared/services/nuxeo-js-client.service";
import { ELASTIC_SEARCH_LABELS } from "../../../../elastic-search-reindex/elastic-search-reindex.constants";
type ActionsImportFunction = () => Promise<unknown>;

@Component({
  selector: "nxql-tab",
  templateUrl: "./nxql-tab.component.html",
  styleUrls: ["./nxql-tab.component.scss"],
})
export class NXQLTabComponent implements OnDestroy {
  inputForm: FormGroup;
  spinnerVisible = false;
  spinnerStatusSubscription: Subscription = new Subscription();
  userInput = "";
  decodedUserInput = "";
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
  templateConfigData: TemplateConfigType = {} as TemplateConfigType;
  templateLabels: labelsList = {} as labelsList;
  actionsImportFn: ActionsImportFunction | null = null;
  taskActions: any;
  documentCount = -1;
  nxqlQueryHintSanitized: SafeHtml = "";

  constructor(
    public dialogService: MatDialog,
    private fb: FormBuilder,
    private store: Store<unknown>,
    private nuxeoJSClientService: NuxeoJSClientService,
    private genericMultiFeatureUtilitiesService: GenericMultiFeatureUtilitiesService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    this.inputForm = this.fb.group({
      inputIdentifier: ["", Validators.required],
    });
    this.nuxeo = this.nuxeoJSClientService.getNuxeoInstance();
    this.route.data.subscribe((data) => {
      this.templateConfigData = data["data"];
      this.templateLabels = this.templateConfigData.labels;
      this.store = this.templateConfigData?.store;
      this.nxqlQueryHintSanitized = this.sanitizer.bypassSecurityTrustHtml(
        GENERIC_LABELS.NXQL_INPUT_HINT
      );
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
              TAB_TYPES.NXQL
            )
          )
        );
        this.actionError$ = this.store.pipe(
          select(
            (state) =>
              this.genericMultiFeatureUtilitiesService.getActionErrorConfig(
                state,
                this.templateConfigData.featureName,
                TAB_TYPES.NXQL
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
        const decodedUserInput = decodeURIComponent(
          /* Remove leading single & double quotes in case of path, to avoid invalid nuxeo js client api parameter */
          this.genericMultiFeatureUtilitiesService.removeLeadingCharacters(
            userInput
          )
        );
        this.fetchNoOfDocuments(decodedUserInput);
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
          switch (this.templateConfigData.featureName) {
            case FEATURE_NAMES.ELASTIC_SEARCH_REINDEX:
              this.store.dispatch(
                this.taskActions.onNxqlReindexFailure({
                  error: errorJson as HttpErrorResponse,
                })
              );
              break;
          }
        }
      });
  }

  showConfirmationModal(documentCount: number, query: string): void {
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
        this.onConfirmationModalClose(data as GenericModalClosedInfo, query);
      });
  }

  onConfirmationModalClose(data: GenericModalClosedInfo, query: string): void {
    this.isSubmitBtnDisabled = false;
    if (data?.continue) {
      /* The single quote is decoded and replaced with encoded backslash and single quotes, to form the request query correctly
          for elasticsearch reindex endpoint, for paths containing single quote e.g. /default-domain/ws1/Harry's-file will be built like
          /default-domain/workspaces/ws1/Harry%5C%27s-file
          Other special characters are encoded by default by nuxeo js client, but not single quote */
      try {
        this.decodedUserInput = decodeURIComponent(query).replace(
          /\\'/g,
          "%5C%27"
        );
        switch (this.templateConfigData.featureName) {
          case FEATURE_NAMES.ELASTIC_SEARCH_REINDEX:
            this.store.dispatch(
              this.taskActions.performNxqlReindex({
                nxqlQuery: this.decodedUserInput,
              })
            );
            break;
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
    switch (this.templateConfigData.featureName) {
      case FEATURE_NAMES.ELASTIC_SEARCH_REINDEX:
        this.store.dispatch(this.taskActions.resetNxqlReindexState());
        break;
      /* Add actions as per feature */
    }
    this.actionLaunchedSubscription?.unsubscribe();
    this.actionErrorSubscription?.unsubscribe();
    this.actionDialogClosedSubscription?.unsubscribe();
    this.confirmDialogClosedSubscription?.unsubscribe();
    this.launchedDialogClosedSubscription?.unsubscribe();
    this.errorDialogClosedSubscription?.unsubscribe();
  }
}
