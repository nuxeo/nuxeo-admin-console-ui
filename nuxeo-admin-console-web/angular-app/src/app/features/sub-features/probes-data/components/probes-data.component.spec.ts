import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProbesDataComponent } from "./probes-data.component";
import { provideMockStore } from "@ngrx/store/testing";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import * as ProbeActions from "../store/actions";
import { ProbeDataService } from "../services/probes-data.service";
import { PROBES_LABELS } from "../probes-data.constants";
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonService } from "../../../../shared/services/common.service";
import { MatSnackBarModule } from "@angular/material/snack-bar";

describe("ProbesDataComponent", () => {
  let component: ProbesDataComponent;
  let fixture: ComponentFixture<ProbesDataComponent>;
  let store: Store;
  let probeServiceSpy: jasmine.SpyObj<ProbeDataService>;
  let mockCommonService: jasmine.SpyObj<CommonService>;

  const initialState = {
    probes: {
      probesInfo: [],
    },
  };

  class CommonServiceStub {
    redirectToProbesDetails() {
      return "";
    }
  }

  beforeEach(async () => {
    probeServiceSpy = jasmine.createSpyObj("ProbeDataService", [
      "formatToTitleCase",
    ]);

    await TestBed.configureTestingModule({
      declarations: [ProbesDataComponent],
      imports: [MatSnackBarModule],
      providers: [
        provideMockStore({ initialState }),
        { provide: CommonService, useClass: CommonServiceStub }, 
        { provide: ProbeDataService, useValue: probeServiceSpy }, 
      ],
      schemas: [NO_ERRORS_SCHEMA], 
    }).compileComponents();

    fixture = TestBed.createComponent(ProbesDataComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store); 
    mockCommonService = TestBed.inject(
      CommonService
    ) as jasmine.SpyObj<CommonService>;
  });

  it("should test if the component is created", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch probes info on init if probesInfo is empty", () => {
    spyOn(store, "dispatch").and.callThrough(); 
    spyOn(store, "pipe").and.returnValue(of([]));
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(ProbeActions.loadProbesData());
  });


  it("should return correct display name for probe", () => {
    const probeName = "repositoryStatus";
    const displayName = component.deriveProbeDisplayName(probeName);
    expect(displayName).toBe("Repository");

    const unknownProbeName = "unknownProbe";
    const unknownDisplayName = component.deriveProbeDisplayName(unknownProbeName);
    expect(unknownDisplayName).toBe(unknownProbeName);
  });

  it("should return the correct image source based on probe status", () => {
    expect(component.determineImageSource(true, false)).toBe(PROBES_LABELS.SUCCESS_STATUS_ICONS.UNKNOWN);
    expect(component.determineImageSource(false, true)).toBe(PROBES_LABELS.SUCCESS_STATUS_ICONS.TRUE);
    expect(component.determineImageSource(false, false)).toBe(PROBES_LABELS.SUCCESS_STATUS_ICONS.FALSE);
  });

  it("should format tooltip text correctly", () => {
    probeServiceSpy.formatToTitleCase.and.returnValue("Formatted Text");
    const result = component.formatTooltipText("some text");
    expect(result).toBe("Formatted Text");

    probeServiceSpy.formatToTitleCase.and.returnValue("True");
    const trueResult = component.formatTooltipText(true);
    expect(trueResult).toBe("True");

    probeServiceSpy.formatToTitleCase.and.returnValue("False");
    const falseResult = component.formatTooltipText(false);
    expect(falseResult).toBe("False");
  });

  it("should unsubscribe fetchProbesSubscription on destroy", () => {
    component.fetchProbesSubscription = jasmine.createSpyObj("Subscription", [
      "unsubscribe",
    ]);
    component.ngOnDestroy();
    expect(component.fetchProbesSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should call redirectToProbesDetails on viewDetails()', () => {
    spyOn(mockCommonService, "redirectToProbesDetails");
    component.viewDetails();
    expect(mockCommonService.redirectToProbesDetails).toHaveBeenCalled();
  });
});
