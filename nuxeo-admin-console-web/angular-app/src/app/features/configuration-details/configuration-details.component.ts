import { Component, OnDestroy, OnInit } from "@angular/core";
import { CONFIGURATION_DETAILS_CONSTANTS } from "./configuration-details.constants";
import { CommonService } from "./../../.././app/shared/services/common.service";
import { SharedMethodsService } from "../../shared/services/shared-methods.service";
import { takeUntil } from "rxjs/internal/operators/takeUntil";
import { HttpErrorResponse } from "@angular/common/http";
import { delay, Subject } from "rxjs";
import { ERROR_TYPES } from "../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";

@Component({
  selector: "app-configuration-details",
  templateUrl: "./configuration-details.component.html",
  styleUrls: ["./configuration-details.component.scss"],
  standalone: false
})
export class ConfigurationDetailsComponent implements OnInit, OnDestroy {
  CONFIGURATION_DETAILS_CONSTANTS = CONFIGURATION_DETAILS_CONSTANTS;
  configurationDetails: unknown;
  destroy$: Subject<void> = new Subject<void>();
  isDataLoaded = false;
  isError = false;
  constructor(
    private commonService: CommonService,
    private sharedService: SharedMethodsService
  ) {}

  ngOnInit(): void {
    this.getConfigurationDetails();
  }

  getConfigurationDetails(): void {
    this.isDataLoaded = false;
    this.isError = false;
    this.commonService
      .getConfigurationDetails()
      .pipe(takeUntil(this.destroy$), delay(500))
      .subscribe({
        next: (data) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { "entity-type": _, ...updatedData } = data; // Remove 'entity-type' key
          this.configurationDetails = updatedData;
          this.isDataLoaded = true;
        },
        error: (error: HttpErrorResponse) => {
          this.isDataLoaded = true;
          this.isError = true;
          this.sharedService.showActionErrorModal({
            type: ERROR_TYPES.SERVER_ERROR,
            details: {
              status: error?.error?.status || error?.status,
              message: error?.error?.message || error?.message,
            },
          });
        },
      });
  }

  isValidData(data: unknown): boolean {
    if (!data) return false;
    if (Object.keys(data).length === 0) return false;
    return true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
