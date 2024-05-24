import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { AdminProbesSummaryComponent } from "./admin-probes-summary.component";

describe("AdminProbesSummaryComponent", () => {
  let component: AdminProbesSummaryComponent;
  let fixture: ComponentFixture<AdminProbesSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminProbesSummaryComponent],
      imports: [CommonModule, MatCardModule],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    }).compileComponents();
    fixture = TestBed.createComponent(AdminProbesSummaryComponent);
    component = fixture.componentInstance;
  });
  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });
});
