import { AdminRegistrationVersionComponent } from "./admin-registration-version/admin-registration-version.component";
import { AdminProbesSummaryComponent } from "./admin-probes-summary/admin-probes-summary.component";
import { AdminHomeComponent } from "./admin-home.component";
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";

describe("AdminHomeComponent", () => {
  let component: AdminHomeComponent;
  let fixture: ComponentFixture<AdminHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminHomeComponent,
        AdminProbesSummaryComponent,
        AdminRegistrationVersionComponent,
      ],
      imports: [CommonModule, MatCardModule, MatButtonModule],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    }).compileComponents();
    fixture = TestBed.createComponent(AdminHomeComponent);
    component = fixture.componentInstance;
  });
  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });
});
