import { initializeTestBed } from "src/test-helpers"; //This import must be the first import in the file.
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ConfigurationDetailsComponent } from "./configuration-details.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import {
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { of, throwError } from "rxjs";
import { ERROR_TYPES } from "../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";
import { CommonService } from "../../shared/services/common.service";
import { SharedMethodsService } from "../../shared/services/shared-methods.service";

describe("ConfigurationDetailsComponent", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

  let component: ConfigurationDetailsComponent;
  let fixture: ComponentFixture<ConfigurationDetailsComponent>;
  let commonService: CommonService;
  let sharedService: SharedMethodsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigurationDetailsComponent],
      imports: [MatSnackBarModule, MatDialogModule, MatProgressSpinnerModule],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigurationDetailsComponent);
    component = fixture.componentInstance;
    commonService = TestBed.inject(CommonService);
    sharedService = TestBed.inject(SharedMethodsService);
    // Mock the service to prevent ngOnInit from making real HTTP calls
    vi.spyOn(commonService, "getConfigurationDetails").mockReturnValue(of({}));
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize and load data on creation", async () => {
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(component.isDataLoaded).toBe(true);
    expect(component.isError).toBe(false);
    expect(component.configurationDetails).toEqual({});
  });

  it("should call getConfigurationDetails on ngOnInit", async () => {
    const mockData = { "entity-type": "config", key: "value" };
    vi.spyOn(commonService, "getConfigurationDetails").mockReturnValue(
      of(mockData)
    );
    component.ngOnInit();
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(component.isDataLoaded).toBe(true);
    expect(component.configurationDetails).toEqual({ key: "value" });
  });

  it("should validate data correctly with isValidData", () => {
    expect(component.isValidData(null)).toBe(false);
    expect(component.isValidData(undefined)).toBe(false);
    expect(component.isValidData({})).toBe(false);
    expect(component.isValidData({ key: "value" })).toBe(true);
  });

  it("should set isDataLoaded and configurationDetails on successful data fetch", async () => {
    const mockData = {
      "entity-type": "config",
      key1: "value1",
      key2: "value2",
    };
    vi.spyOn(commonService, "getConfigurationDetails").mockReturnValue(
      of(mockData)
    );
    component.getConfigurationDetails();
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(component.isDataLoaded).toBe(true);
    expect(component.isError).toBe(false);
    expect(component.configurationDetails).toEqual({
      key1: "value1",
      key2: "value2",
    });
  });

  it("should handle error and call showActionErrorModal on failed data fetch", async () => {
    const mockError = new HttpErrorResponse({
      error: { status: 500, message: "Server error" },
      status: 500,
      statusText: "Internal Server Error",
    });
    vi.spyOn(commonService, "getConfigurationDetails").mockReturnValue(
      throwError(() => mockError)
    );
    const showErrorSpy = vi
      .spyOn(sharedService, "showActionErrorModal")
      .mockReturnValue(of(undefined));
    component.getConfigurationDetails();
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(component.isDataLoaded).toBe(true);
    expect(component.isError).toBe(true);
    expect(showErrorSpy).toHaveBeenCalledWith({
      type: ERROR_TYPES.SERVER_ERROR,
      details: {
        status: 500,
        message: "Server error",
      },
    });
  });

  it("should complete destroy$ subject on ngOnDestroy", () => {
    const nextSpy = vi.spyOn(component.destroy$, "next");
    const completeSpy = vi.spyOn(component.destroy$, "complete");
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
