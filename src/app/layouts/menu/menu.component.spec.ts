import { MatListModule } from "@angular/material/list";
import { MenuComponent } from "./menu.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from "@angular/core/testing";
import { CommonModule } from "@angular/common";

describe("MenuComponent", () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuComponent],
      imports: [CommonModule, MatToolbarModule, MatListModule],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    }).compileComponents();
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
  });

  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });

  it("should set the spcific menu item state as selected on click", () => {
    component.menu = [
      { id: 0, name: "Home", path: "home", isSelected: true },
      {
        id: 1,
        name: "System Information",
        path: "system-information",
        isSelected: false,
      },
    ];
    component.menuItemSelected(1);
    expect(component.menu[1].isSelected).toBe(true);
  });
});
