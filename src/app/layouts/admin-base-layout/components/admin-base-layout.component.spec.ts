import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AdminMenuComponent } from "./../../admin-menu/admin-menu.component";
import { AdminHeaderComponent } from "./../../admin-header/admin-header.component";
import { AdminBaseLayoutComponent } from "./admin-base-layout.component";
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from "@angular/core/testing";
import { CommonModule } from "@angular/common";

describe("AdminBaseLayoutComponent", () => {
  let component: AdminBaseLayoutComponent;
  let fixture: ComponentFixture<AdminBaseLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminBaseLayoutComponent,
        AdminHeaderComponent,
        AdminMenuComponent,
      ],
      imports: [CommonModule, RouterModule, MatToolbarModule, MatListModule, MatSidenavModule],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    }).compileComponents();
    fixture = TestBed.createComponent(AdminBaseLayoutComponent);
    component = fixture.componentInstance;
  });
  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });
});
