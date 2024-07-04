import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MenuBarComponent } from "../../menu-bar/menu-bar.component";
import { HeaderBarComponent } from "../../header-bar/header-bar.component";
import { BaseLayoutComponent } from "./base-layout.component";
import { provideMockStore } from '@ngrx/store/testing';
import { StoreModule } from '@ngrx/store';
import { HyMaterialIconModule } from "@hyland/ui";

import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from "@angular/core/testing";
import { CommonModule } from "@angular/common";

describe("BaseLayoutComponent", () => {
  let component: BaseLayoutComponent;
  let fixture: ComponentFixture<BaseLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        BaseLayoutComponent,
        HeaderBarComponent,
        MenuBarComponent,
      ],
      imports: [CommonModule, HyMaterialIconModule,RouterModule, MatToolbarModule, MatListModule, MatSidenavModule,StoreModule.forRoot(provideMockStore)],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    }).compileComponents();
    fixture = TestBed.createComponent(BaseLayoutComponent);
    component = fixture.componentInstance;
  });
  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });
});
