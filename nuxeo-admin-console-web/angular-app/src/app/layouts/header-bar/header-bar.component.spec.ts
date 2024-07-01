import { HeaderBarComponent } from "./header-bar.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { HyMaterialIconModule } from "@hyland/ui";
import { MatIconModule } from "@angular/material/icon";
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from "@angular/core/testing";
import { CommonModule } from "@angular/common";

describe("HeaderBarComponent", () => {
  let component: HeaderBarComponent;
  let fixture: ComponentFixture<HeaderBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderBarComponent],
      imports: [CommonModule,MatIconModule, MatToolbarModule,StoreModule.forRoot(provideMockStore)],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    }).compileComponents();
    fixture = TestBed.createComponent(HeaderBarComponent);
    component = fixture.componentInstance;
  });
  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });
});
