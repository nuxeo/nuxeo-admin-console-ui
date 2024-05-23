import { MatListModule } from "@angular/material/list";
import { AdminMenuComponent } from "./admin-menu.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from "@angular/core/testing";
import { CommonModule } from "@angular/common";

describe("AdminMenuComponent", () => {
  let component: AdminMenuComponent;
  let fixture: ComponentFixture<AdminMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminMenuComponent],
      imports: [CommonModule, MatToolbarModule, MatListModule],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    }).compileComponents();
    fixture = TestBed.createComponent(AdminMenuComponent);
    component = fixture.componentInstance;
  });

  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });

  it("should set the spcific menu item state as selected on click", () => {
    component.adminMenu = [
      { id: 0, name: "Home", path: "admin-home", isSelected: true },
      {
        id: 1,
        name: "System Information",
        path: "system-information",
        isSelected: false,
      },
    ];
    component.menuItemSelected(1);
    expect(component.adminMenu[1].isSelected).toBe(true);
  });
});
