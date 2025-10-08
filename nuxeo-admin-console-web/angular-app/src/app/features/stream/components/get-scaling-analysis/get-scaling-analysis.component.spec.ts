import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GetScalingAnalysisComponent } from "./get-scaling-analysis.component";
import { SharedMethodsService } from "../../../../shared/services/shared-methods.service";
import { StreamService } from "../../services/stream.service";
import { of, throwError, Subject } from "rxjs";
import { ERROR_TYPES } from "../../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";
import { HttpErrorResponse } from "@angular/common/http";

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
    component.ngOnInit();
    expect(component.scalingAnalysisData).toEqual(mockData);
    expect(component.isDataLoaded).toBeTrue();
  });

  it("should call showActionErrorModal and set isDataLoaded to true on error", () => {
    const errorResponse = new HttpErrorResponse({
      status: 500,
      statusText: "Server Error",
      error: "Error",
    });
    mockStreamService.getScalingAnalysis.and.returnValue(
      throwError(() => errorResponse)
    );
    component.ngOnInit();
    expect(component.isDataLoaded).toBeTrue();
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
