import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProbesComponent } from "./probes.component";
import { StoreModule } from "@ngrx/store";
import { ProbeDataReducer } from "../sub-features/probes-data/store/reducers";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { By } from "@angular/platform-browser";
import { ProbesDataComponent } from "../sub-features/probes-data/components/probes-data.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";

describe("ProbesComponent", () => {
  let component: ProbesComponent;
  let fixture: ComponentFixture<ProbesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProbesComponent, ProbesDataComponent],
      imports: [
        StoreModule.forRoot({ probes: ProbeDataReducer }),
        HttpClientTestingModule,
        CommonModule,
        MatCardModule,
        MatSnackBarModule,
        MatTableModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProbesComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it("should create the ProbesComponent", () => {
    expect(component).toBeTruthy();
  });

  it("should render the title in the template", () => {
    const PROBES_TITLE = "Probes";
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector("#page-title");
    expect(titleElement).toBeTruthy();
    expect(titleElement?.textContent).toContain(PROBES_TITLE);
  });

  it("should include the ProbesDataComponent", () => {
    const probesDataElement = fixture.debugElement.query(
      By.directive(ProbesDataComponent)
    );
    expect(probesDataElement).toBeTruthy();
    const probesDataComponent =
      probesDataElement.componentInstance as ProbesDataComponent;
    expect(probesDataComponent.summary).toBe(false);
  });
});
