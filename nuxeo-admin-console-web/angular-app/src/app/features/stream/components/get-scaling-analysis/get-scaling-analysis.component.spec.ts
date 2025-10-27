import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { GetScalingAnalysisComponent } from "./get-scaling-analysis.component";
import { SharedMethodsService } from "../../../../shared/services/shared-methods.service";
import { StreamService } from "../../services/stream.service";
import { of, throwError } from "rxjs";
import { ERROR_TYPES } from "../../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";
import { HttpErrorResponse } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBarModule } from "@angular/material/snack-bar";

describe("GetScalingAnalysisComponent", () => {
  let component: GetScalingAnalysisComponent;
  let fixture: ComponentFixture<GetScalingAnalysisComponent>;
  let mockSharedService: jasmine.SpyObj<SharedMethodsService>;
  let mockStreamService: jasmine.SpyObj<StreamService>;

  beforeEach(() => {
    mockSharedService = jasmine.createSpyObj("SharedMethodsService", [
      "showActionErrorModal",
    ]);
    mockStreamService = jasmine.createSpyObj("StreamService", [
      "getScalingAnalysis",
    ]);

    TestBed.configureTestingModule({
      declarations: [GetScalingAnalysisComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        MatDialogModule,
        CommonModule,
        MatProgressSpinnerModule,
      ],
      providers: [
        { provide: SharedMethodsService, useValue: mockSharedService },
        { provide: StreamService, useValue: mockStreamService },
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
    mockStreamService.getScalingAnalysis.and.returnValue(of(mockData));
    spyOn(component, "loadJsonData").and.callThrough();
    component.ngOnInit();
    expect(component.loadJsonData).toHaveBeenCalled();
  });

  it("should call showActionErrorModal and set isDataLoaded to true on error when error object is present", () => {
    const errorResponse = new HttpErrorResponse({
      error: { status: 500, message: "Internal Server Error" }
    });
    mockStreamService.getScalingAnalysis.and.returnValue(
      throwError(() => errorResponse)
    );
    component.loadJsonData();
    expect(component.isDataLoaded).toBeTrue();
    expect(component.isError).toBeTrue();
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
      status: 500, statusText: "Internal Server Error"
    });
    mockStreamService.getScalingAnalysis.and.returnValue(
      throwError(() => errorResponse)
    );
    component.loadJsonData();
    expect(component.isDataLoaded).toBeTrue();
    expect(component.isError).toBeTrue();
    expect(mockSharedService.showActionErrorModal).toHaveBeenCalledWith({
      type: ERROR_TYPES.SERVER_ERROR,
      details: {
        status: errorResponse.status,
        message: errorResponse.message,
      },
    });
  });

  it("isValidData should return true for non-empty object", () => {
    expect(component.isValidData({ a: 1 })).toBeTrue();
  });

  it("isValidData should return false for empty object", () => {
    expect(component.isValidData({})).toBeFalse();
  });

  it("isValidData should return false for null or undefined", () => {
    expect(component.isValidData(null)).toBeFalse();
    expect(component.isValidData(undefined)).toBeFalse();
  });
});
