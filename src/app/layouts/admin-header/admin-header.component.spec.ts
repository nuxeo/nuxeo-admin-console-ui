import { AdminHeaderComponent } from "./admin-header.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from "@angular/core/testing";
import { CommonModule } from "@angular/common";

describe("AdminHeaderComponent", () => {
  let component: AdminHeaderComponent;
  let fixture: ComponentFixture<AdminHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminHeaderComponent],
      imports: [CommonModule, MatToolbarModule],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    }).compileComponents();
    fixture = TestBed.createComponent(AdminHeaderComponent);
    component = fixture.componentInstance;
  });
  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });
});
