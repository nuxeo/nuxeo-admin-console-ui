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

describe("ProbesSummaryComponent", () => {
  let component: ProbesSummaryComponent;
  let fixture: ComponentFixture<ProbesSummaryComponent>;
  let store: Store<{ home: HomeState }>;

  const initialState: HomeState = {
    versionInfo: {
      version: null,
      clusterEnabled: false,
    },
    probesInfo: [],
    error: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProbesSummaryComponent],
      imports: [
        CommonModule,
        MatCardModule,
        HyContentListModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
      ],
      providers: [provideMockStore({ initialState: { home: initialState } })],
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

  it("should return correct image src based on success status", () => {
    expect(component.getImageSrc("true")).toBe(
      PROBES_LABELS.SUCCESS_STATUS_ICONS.TRUE.PATH
    );
    expect(component.getImageSrc("unknown")).toBe(
      PROBES_LABELS.SUCCESS_STATUS_ICONS.UNKNOWN.PATH
    );
    expect(component.getImageSrc("false")).toBe(
      PROBES_LABELS.SUCCESS_STATUS_ICONS.FALSE.PATH
    );
    expect(component.getImageSrc("invalidStatus")).toBe(
      PROBES_LABELS.SUCCESS_STATUS_ICONS.UNKNOWN.PATH
    );
  });

  it("should unsubscribe fetchProbesSubscription on destroy", () => {
    component.fetchProbesSubscription = jasmine.createSpyObj("Subscription", [
      "unsubscribe",
    ]);
    component.ngOnDestroy();
    expect(component.fetchProbesSubscription.unsubscribe).toHaveBeenCalled();
  });
});
