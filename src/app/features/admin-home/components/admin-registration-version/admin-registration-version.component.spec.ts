import { AdminRegistrationVersionComponent } from "./admin-registration-version.component";
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";

describe("AdminRegistrationVersionComponent", () => {
  let component: AdminRegistrationVersionComponent;
  let fixture: ComponentFixture<AdminRegistrationVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminRegistrationVersionComponent],
      imports: [CommonModule, MatCardModule],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    }).compileComponents();
    fixture = TestBed.createComponent(AdminRegistrationVersionComponent);
    component = fixture.componentInstance;
  });
  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });
});
