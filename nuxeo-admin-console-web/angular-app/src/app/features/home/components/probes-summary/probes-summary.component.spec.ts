import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProbesSummaryComponent } from "./probes-summary.component";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { HyContentListModule } from "@hyland/ui/content-list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ProbesDataComponent } from "../../../sub-features/probes-data/components/probe-data.component";

describe("ProbesSummaryComponent", () => {
  let component: ProbesSummaryComponent;
  let fixture: ComponentFixture<ProbesSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProbesSummaryComponent,ProbesDataComponent],
      imports: [
        CommonModule,
        MatCardModule,
        HyContentListModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProbesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  
  


});
