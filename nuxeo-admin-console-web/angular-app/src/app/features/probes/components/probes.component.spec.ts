import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HyContentListModule } from "@hyland/ui/content-list";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ProbesComponent } from "./probes.component";
import { Store, StoreModule } from "@ngrx/store";
import { ProbeReducer, ProbeState } from "../store/reducers";
import { ProbeService } from "../services/probes.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { of } from "rxjs";

describe("ProbesComponent", () => {
  let component: ProbesComponent;
  let fixture: ComponentFixture<ProbesComponent>;
  let store: Store<{ probes: ProbeState }>;
  let probeService: ProbeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProbesComponent],
      imports: [
        StoreModule.forRoot({ probes: ProbeReducer }),
        HttpClientTestingModule,
        CommonModule,
        MatCardModule,
        HyContentListModule,
        MatTooltipModule,
      ],
      providers: [ProbeService],
    }).compileComponents();

    store = TestBed.inject(Store);
    probeService = TestBed.inject(ProbeService);
    fixture = TestBed.createComponent(ProbesComponent);
    component = fixture.componentInstance;

    spyOn(store, "pipe").and.returnValue(of([]));
    spyOn(store, "dispatch").and.callThrough();
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  describe("probeDisplayName", () => {
    it("should return the probe name as is", () => {
      const probeName = "probe1";
      const displayName = component.deriveProbeDisplayName(probeName);
      expect(displayName).toBe(probeName);
    });
  });

  describe("imageSource", () => {
    it("should determine the image source based on status", () => {
      const imgSrc = component.determineImageSource(true, false);
      expect(imgSrc).toBe(component.PROBES_LABELS.SUCCESS_STATUS_ICONS.UNKNOWN);
    });
  });

  describe("tooltipText", () => {
    it("should format the tooltip text", () => {
      const tooltipText = component.formatTooltipText("success");
      expect(tooltipText).toBe("Success");
    });
  });
});
