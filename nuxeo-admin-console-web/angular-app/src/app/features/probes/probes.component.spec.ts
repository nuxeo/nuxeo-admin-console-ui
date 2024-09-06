import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProbesComponent } from "./probes.component";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { HyContentListModule } from "@hyland/ui/content-list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { PROBES_LABELS } from "../home/home.constants";
import { ProbesDataComponent } from "../sub-features/probes-data/components/probe-data.component";

describe("ProbesComponent", () => {
  let component: ProbesComponent;
  let fixture: ComponentFixture<ProbesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProbesComponent, ProbesDataComponent],
      imports: [
        CommonModule,
        MatCardModule,
        HyContentListModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProbesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize PROBES_LABELS correctly", () => {
    expect(component.PROBES_LABELS).toEqual(PROBES_LABELS);
  });

  it("should render the title in the template", () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector("#page-title");
    expect(titleElement).toBeTruthy();
    expect(titleElement?.textContent).toContain(PROBES_LABELS.PROBE_TITLE);
  });


});
