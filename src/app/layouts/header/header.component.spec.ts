import { HeaderComponent } from "./header.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from "@angular/core/testing";
import { CommonModule } from "@angular/common";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [CommonModule, MatToolbarModule],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    }).compileComponents();
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });
  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });
});
