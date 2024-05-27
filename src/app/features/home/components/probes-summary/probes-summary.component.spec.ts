import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { ProbesSummaryComponent } from "./probes-summary.component";

describe("ProbesSummaryComponent", () => {
  let component: ProbesSummaryComponent;
  let fixture: ComponentFixture<ProbesSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProbesSummaryComponent],
      imports: [CommonModule, MatCardModule],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    }).compileComponents();
    fixture = TestBed.createComponent(ProbesSummaryComponent);
    component = fixture.componentInstance;
  });
  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });
});
