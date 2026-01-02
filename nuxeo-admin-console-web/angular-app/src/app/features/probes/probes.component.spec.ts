import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProbesComponent } from "./probes.component";
import { StoreModule } from "@ngrx/store";
import {
  ProbeDataReducer,
  ProbeState,
} from "../sub-features/probes-data/store/reducers";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { By } from "@angular/platform-browser";
import { ProbesDataComponent } from "../sub-features/probes-data/components/probes-data.component";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { initialState } from "../home/store/reducers";
import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { SharedMethodsService } from "../../shared/services/shared-methods.service";
import { PROBES_LABELS } from "../sub-features/probes-data/probes-data.constants";
import { MatTooltipModule } from "@angular/material/tooltip";
import * as ProbeActions from "../sub-features/probes-data/store/actions";
describe("ProbesComponent", () => {
  let component: ProbesComponent;
  let fixture: ComponentFixture<ProbesComponent>;
  let store: MockStore<{ probes: ProbeState }>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let sharedMethodsService: jasmine.SpyObj<SharedMethodsService>;

  beforeEach(async () => {
    snackBar = jasmine.createSpyObj("MatSnackBar", ["openFromComponent"]);
    sharedMethodsService = jasmine.createSpyObj("SharedMethodsService", [
      "showSuccessSnackBar",
      "showErrorSnackBar",
    ]);
    await TestBed.configureTestingModule({
      declarations: [ProbesComponent, ProbesDataComponent],
      imports: [
        StoreModule.forRoot({ probes: ProbeDataReducer }),
        CommonModule,
        MatCardModule,
        MatSnackBarModule,
        MatTableModule,
        BrowserAnimationsModule,
        MatPaginatorModule,
        MatTooltipModule,
      ],
      providers: [
        { provide: MatSnackBar, useValue: snackBar },
        provideMockStore({ initialState: { probes: initialState } }),
        { provide: SharedMethodsService, useValue: sharedMethodsService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProbesComponent);
    store = TestBed.inject(MockStore);
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

  it("should dispatch '[Admin] Launch All Probes' when launchAllProbes is called", () => {
    const dispatchSpy = spyOn(component["store"], "dispatch");
    component.launchAllProbes();
    expect(dispatchSpy).toHaveBeenCalledWith(ProbeActions.launchAllProbes());
  });

  it("should have PROBES_LABELS defined", () => {
    expect(component.PROBES_LABELS).toBeDefined();
  });

  it("should have fetchProbesSubscription as Subscription", () => {
    expect(
      component.fetchProbesSubscription instanceof Subscription
    ).toBeTrue();
  });

  it("should show error snackBar when launchAllProbes fails", () => {
    const errorResponse = new HttpErrorResponse({
      error: "Error launching probes",
    });
    store.setState({
      probes: {
        probesInfo: [],
        showLaunchAllSuccessSnackbar: false,
        launchAllProbeError: errorResponse,
        error: null,
      },
    });
    fixture.detectChanges();
    expect(sharedMethodsService.showErrorSnackBar).toHaveBeenCalledWith(
      PROBES_LABELS.LAUNCH_ALL_PROBES.ERROR_MESSAGE
    );
  });

  it("should not call success snackBar when isLaunchPProbeSuccess is false", () => {
    store.setState({
      probes: {
        probesInfo: [],
        showLaunchAllSuccessSnackbar: false,
        launchAllProbeError: null,
        error: null,
      },
    });
    fixture.detectChanges();
    expect(sharedMethodsService.showErrorSnackBar).not.toHaveBeenCalled();
  });

  it("should update isCheckAllProbesBtnDisabled to true when loadProbesData$ emits an error", () => {
    const errorResponse = new HttpErrorResponse({
      error: "Mock Error",
    });
    store.setState({
      probes: {
        probesInfo: [],
        showLaunchAllSuccessSnackbar: false,
        launchAllProbeError: null,
        error: errorResponse,
      },
    });
    fixture.detectChanges();
    expect(component.isCheckAllProbesBtnDisabled).toBeTrue();
  });

  it("should update isCheckAllProbesBtnDisabled to false when loadProbesData$ emits a success", () => {
    store.setState({
      probes: {
        probesInfo: [
          {
            name: "probeA",
            status: {
              neverExecuted: false,
              success: true,
              infos: { info: "ok" },
            },
            history: {
              lastRun: "2024-01-01T12:00:00.000Z",
              lastSuccess: "2024-01-01T12:00:00.000Z",
              lastFail: "",
            },
            counts: { run: 1, success: 1, failure: 0 },
          },
          {
            name: "probeB",
            status: {
              neverExecuted: false,
              success: true,
              infos: { info: "ok" },
            },
            history: {
              lastRun: "2024-01-01T12:00:00.000Z",
              lastSuccess: "2024-01-01T12:00:00.000Z",
              lastFail: "",
            },
            counts: { run: 1, success: 1, failure: 0 },
          },
        ],
        showLaunchAllSuccessSnackbar: false,
        launchAllProbeError: null,
        error: null,
      },
    });
    fixture.detectChanges();
    expect(component.isCheckAllProbesBtnDisabled).toBeFalse();
  });

  it("should reset launchAllProbes state on destroy", () => {
    const dispatchSpy = spyOn(store, "dispatch");
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: "[Admin] Reset Launch All Probes State",
    });
  });
  
});
