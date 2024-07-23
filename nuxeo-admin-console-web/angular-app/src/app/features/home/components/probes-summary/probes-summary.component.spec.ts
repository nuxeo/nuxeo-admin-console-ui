import { HyContentListModule } from "@hyland/ui/content-list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { ProbesSummaryComponent } from "./probes-summary.component";
import { provideMockStore } from "@ngrx/store/testing";
import { HomeState } from "../../store/reducers";
import { Store } from "@ngrx/store";
import { PROBES_LABELS } from "../../home.constants";
import * as HomeActions from "../../store/actions";
import { of } from "rxjs";
import { HomeService } from "../../services/home.service";

describe("ProbesSummaryComponent", () => {
  let component: ProbesSummaryComponent;
  let fixture: ComponentFixture<ProbesSummaryComponent>;
  let store: Store<{ home: HomeState }>;
  let homeServiceSpy: jasmine.SpyObj<HomeService>;
  
  const initialState: HomeState = {
    versionInfo: {
      version: null,
      clusterEnabled: false,
    },
    probesInfo: [],
    error: null,
  };

  beforeEach(async () => {
    homeServiceSpy = jasmine.createSpyObj("HomeService", [
      "getVersionInfo",
      "getProbesInfo",
      "convertoTitleCase",
    ]);
    await TestBed.configureTestingModule({
      declarations: [ProbesSummaryComponent],
      imports: [
        CommonModule,
        MatCardModule,
        HyContentListModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
      ],
      providers: [
        provideMockStore({ initialState: { home: initialState } }),
        { provide: HomeService, useValue: homeServiceSpy },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ProbesSummaryComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
  });

  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch probes info on init if probesInfo is empty", () => {
    spyOn(store, "dispatch");
    spyOn(store, "pipe").and.returnValue(of([]));
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(HomeActions.fetchProbesInfo());
  });

  it("should return correct display name for probe", () => {
    const probeName = "repositoryStatus";
    const displayName = component.getProbeDisplayName(probeName);
    expect(displayName).toBe("Repository");
    const unknownProbeName = "unknownProbe";
    const unknownDisplayName = component.getProbeDisplayName(unknownProbeName);
    expect(unknownDisplayName).toBe(unknownProbeName);
  });

  it("should return UNKNOWN icon when neverExecuted is true", () => {
    const neverExecuted = true;
    const successStatus = false;
    const result = component.getImageSrc(neverExecuted, successStatus);
    expect(result).toBe(PROBES_LABELS.SUCCESS_STATUS_ICONS.UNKNOWN);
  });

  it("should return TRUE icon when neverExecuted is false and successStatus is true", () => {
    const neverExecuted = false;
    const successStatus = true;
    const result = component.getImageSrc(neverExecuted, successStatus);
    expect(result).toBe(PROBES_LABELS.SUCCESS_STATUS_ICONS.TRUE);
  });

  it("should return FALSE icon when neverExecuted is false and successStatus is false", () => {
    const neverExecuted = false;
    const successStatus = false;
    const result = component.getImageSrc(neverExecuted, successStatus);
    expect(result).toBe(PROBES_LABELS.SUCCESS_STATUS_ICONS.FALSE);
  });

  it("should unsubscribe fetchProbesSubscription on destroy", () => {
    component.fetchProbesSubscription = jasmine.createSpyObj("Subscription", [
      "unsubscribe",
    ]);
    component.ngOnDestroy();
    expect(component.fetchProbesSubscription.unsubscribe).toHaveBeenCalled();
  });

  it("should convert string probeStatus to title case", () => {
    homeServiceSpy.convertoTitleCase.and.returnValue("Hello World");
    const result = component.getTooltipAltText("hello world");
    expect(result).toBe("Hello World");
  });

  it("should convert boolean probeStatus true to title case", () => {
    homeServiceSpy.convertoTitleCase.and.returnValue("True");
    const result = component.getTooltipAltText(true);
    expect(result).toBe("True");
  });

  it("should convert boolean probeStatus false to title case", () => {
    homeServiceSpy.convertoTitleCase.and.returnValue("False");
    const result = component.getTooltipAltText(false);
    expect(result).toBe("False");
  });
});
