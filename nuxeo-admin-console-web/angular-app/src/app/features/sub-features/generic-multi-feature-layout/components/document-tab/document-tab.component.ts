import { GenericMultiFeatureUtilitiesService } from "./../../services/generic-multi-feature-utilities.service";
import { NuxeoJSClientService } from "./../../../../../shared/services/nuxeo-js-client.service";
import { ErrorModalComponent } from "./../../../../../shared/components/error-modal/error-modal.component";
import { ErrorModalClosedInfo } from "./../../../../../shared/types/common.interface";
import {
  ErrorDetails,
  GenericModalClosedInfo,
  TemplateConfigType,
  actionsMap,
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
  FEATURE_NAMES,
  GENERIC_LABELS,
  MODAL_DIMENSIONS,
  TAB_TYPES,
} from "../../generic-multi-feature-layout.constants";
import { ActivatedRoute } from "@angular/router";
type ActionsImportFunction = () => Promise<unknown>;

@Component({
  selector: "document-tab",
  templateUrl: "./document-tab.component.html",
  styleUrls: ["./document-tab.component.scss"],
})
export class DocumentTabComponent implements OnDestroy {
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
  GENERIC_LABELS = GENERIC_LABELS;
  nuxeo: Nuxeo;
  isSubmitBtnDisabled = false;
  templateConfigData: TemplateConfigType = {} as TemplateConfigType;
  templateLabels: labelsList = {} as labelsList;
  actionsImportFn: ActionsImportFunction | null = null;
  taskActions: any;

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
              TAB_TYPES.DOCUMENT
            )
          )
        );
        this.actionError$ = this.store.pipe(
          select(
            (state) =>
              this.genericMultiFeatureUtilitiesService.getActionErrorConfig(
                state,
                this.templateConfigData.featureName,
                TAB_TYPES.DOCUMENT
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
          for elasticsearch reindex endpoint, for paths containing single quote e.g. /default-domain/ws1/Harry's-file will be built like
          /default-domain/workspaces/ws1/Harry%5C%27s-file
          Other special characters are encoded by default by nuxeo js client, but not single quote */
          try {
            const decodedPath =
              doc.path.indexOf("'") > -1
                ? this.genericMultiFeatureUtilitiesService.decodeAndReplaceSingleQuotes(
                    decodeURIComponent(doc.path)
                  )
                : doc.path;
            // const requestQuery = `${GENERIC_LABELS.SELECT_BASE_QUERY} ecm:path='${decodedPath}'`;
            let requestQuery;
            switch (this.templateConfigData.featureName) {
              case FEATURE_NAMES.ELASTIC_SEARCH_REINDEX:
                requestQuery =
                  this.genericMultiFeatureUtilitiesService.getRequestQuery(
                    decodedPath,
                    FEATURE_NAMES.ELASTIC_SEARCH_REINDEX,
                    TAB_TYPES.DOCUMENT
                  );
                this.store.dispatch(
                  this.taskActions.performDocumentReindex({
                    requestQuery,
                  })
                );
                break;
              /* Add actions as per feature */
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
          switch (this.templateConfigData.featureName) {
            case FEATURE_NAMES.ELASTIC_SEARCH_REINDEX:
              this.store.dispatch(
                this.taskActions.onDocumentReindexFailure({
                  error: errorJson as HttpErrorResponse,
                })
              );
              break;
            /* Add actions as per feature */
          }
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
    switch (this.templateConfigData.featureName) {
      case FEATURE_NAMES.ELASTIC_SEARCH_REINDEX:
        this.store.dispatch(this.taskActions.resetDocumentReindexState());
        break;
      /* Add actions as per feature */
    }
    this.actionLaunchedSubscription?.unsubscribe();
    this.actionErrorSubscription?.unsubscribe();
    this.actionDialogClosedSubscription?.unsubscribe();
    this.launchedDialogClosedSubscription?.unsubscribe();
    this.errorDialogClosedSubscription?.unsubscribe();
  }
}
