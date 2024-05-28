import { RegistrationVersionComponent } from "./registration-version.component";
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";

describe("RegistrationVersionComponent", () => {
  let component: RegistrationVersionComponent;
  let fixture: ComponentFixture<RegistrationVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrationVersionComponent],
      imports: [CommonModule, MatCardModule],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    }).compileComponents();
    fixture = TestBed.createComponent(RegistrationVersionComponent);
    component = fixture.componentInstance;
  });
  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });
});
