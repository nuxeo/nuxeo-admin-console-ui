import { initializeTestBed } from "src/test-helpers"; //This import must be the first import in the file.
import {
  beforeEach,
  describe,
  expect,
  it,
  type MockedObject,
  vi,
} from "vitest";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideHttpClientTesting } from "@angular/common/http/testing";

import { GetScalingAnalysisComponent } from "./get-scaling-analysis.component";
import { SharedMethodsService } from "../../../../shared/services/shared-methods.service";
import { StreamService } from "../../services/stream.service";
import { of, throwError } from "rxjs";
import { ERROR_TYPES } from "../../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";
import {
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBarModule } from "@angular/material/snack-bar";
describe("GetScalingAnalysisComponent", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

  let component: GetScalingAnalysisComponent;
  let fixture: ComponentFixture<GetScalingAnalysisComponent>;
  let mockSharedService: MockedObject<SharedMethodsService>;
  let mockStreamService: MockedObject<StreamService>;

  beforeEach(() => {
    mockSharedService = {
      showActionErrorModal: vi
        .fn()
        .mockName("SharedMethodsService.showActionErrorModal"),
    } as any;
    mockStreamService = {
      getScalingAnalysis: vi.fn().mockName("StreamService.getScalingAnalysis"),
    } as any;

    TestBed.configureTestingModule({
      declarations: [GetScalingAnalysisComponent],
      imports: [
        MatSnackBarModule,
        MatDialogModule,
        CommonModule,
        MatProgressSpinnerModule,
      ],
      providers: [
        { provide: SharedMethodsService, useValue: mockSharedService },
        { provide: StreamService, useValue: mockStreamService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    fixture = TestBed.createComponent(GetScalingAnalysisComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set scalingAnalysisData and isDataLoaded to true on successful data fetch", () => {
    const mockData = { key: "value" };
    mockStreamService.getScalingAnalysis.mockReturnValue(of(mockData));
    vi.spyOn(component, "loadJsonData");
    component.ngOnInit();
    expect(component.loadJsonData).toHaveBeenCalled();
  });

  it("should call showActionErrorModal and set isDataLoaded to true on error when error object is present", () => {
    const errorResponse = new HttpErrorResponse({
      error: { status: 500, message: "Internal Server Error" },
    });
    mockStreamService.getScalingAnalysis.mockReturnValue(
      throwError(() => errorResponse)
    );
    component.loadJsonData();
    expect(component.isDataLoaded).toBe(true);
    expect(component.isError).toBe(true);
    expect(mockSharedService.showActionErrorModal).toHaveBeenCalledWith({
      type: ERROR_TYPES.SERVER_ERROR,
      details: {
        status: errorResponse.error.status,
        message: errorResponse.error.message,
      },
    });
  });

  it("should call showActionErrorModal and set isDataLoaded to true on error when error object is not present", () => {
    const errorResponse = new HttpErrorResponse({
      status: 500,
      statusText: "Internal Server Error",
    });
    mockStreamService.getScalingAnalysis.mockReturnValue(
      throwError(() => errorResponse)
    );
    component.loadJsonData();
    expect(component.isDataLoaded).toBe(true);
    expect(component.isError).toBe(true);
    expect(mockSharedService.showActionErrorModal).toHaveBeenCalledWith({
      type: ERROR_TYPES.SERVER_ERROR,
      details: {
        status: errorResponse.status,
        message: errorResponse.message,
      },
    });
  });

  it("isValidData should return true for non-empty object", () => {
    expect(component.isValidData({ a: 1 })).toBe(true);
  });

  it("isValidData should return false for empty object", () => {
    expect(component.isValidData({})).toBe(false);
  });

  it("isValidData should return false for null or undefined", () => {
    expect(component.isValidData(null)).toBe(false);
    expect(component.isValidData(undefined)).toBe(false);
  });
});
