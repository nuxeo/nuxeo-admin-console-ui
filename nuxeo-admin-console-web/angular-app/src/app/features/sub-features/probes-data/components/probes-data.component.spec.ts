import { initializeTestBed } from "src/test-helpers"; //This import must be the first import in the file.
import {
  beforeEach,
  describe,
  expect,
  it,
  type MockedObject,
  vi,
} from "vitest";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProbesDataComponent } from "./probes-data.component";
import { provideMockStore } from "@ngrx/store/testing";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import * as ProbeActions from "../store/actions";
import { ProbeDataService } from "../services/probes-data.service";
import { PROBES_LABELS } from "../probes-data.constants";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonService } from "../../../../shared/services/common.service";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTooltipModule } from "@angular/material/tooltip";
describe("ProbesDataComponent", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

  let component: ProbesDataComponent;
  let fixture: ComponentFixture<ProbesDataComponent>;
  let store: Store;
  let probeServiceSpy: MockedObject<ProbeDataService>;
  let mockCommonService: MockedObject<CommonService>;

  const initialState = {
    probes: {
      probesInfo: [],
    },
  };

  class CommonServiceStub {
    redirectToProbesDetails() {
      return "";
    }
  }

  beforeEach(async () => {
    probeServiceSpy = {
      formatToTitleCase: vi.fn().mockName("ProbeDataService.formatToTitleCase"),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [ProbesDataComponent],
      imports: [MatSnackBarModule, MatPaginatorModule, MatTooltipModule],
      providers: [
        provideMockStore({ initialState }),
        { provide: CommonService, useClass: CommonServiceStub },
        { provide: ProbeDataService, useValue: probeServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProbesDataComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    mockCommonService = TestBed.inject(
      CommonService
    ) as MockedObject<CommonService>;
  });

  it("should test if the component is created", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch probes info on init if probesInfo is empty", () => {
    vi.spyOn(store, "dispatch");
    vi.spyOn(store, "pipe").mockReturnValue(of([]));
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(ProbeActions.loadProbesData());
  });

  it("should return correct display name for probe", () => {
    const probeName = "repositoryStatus";
    const displayName = component.deriveProbeDisplayName(probeName);
    expect(displayName).toBe("Repository");

    const unknownProbeName = "unknownProbe";
    const unknownDisplayName =
      component.deriveProbeDisplayName(unknownProbeName);
    expect(unknownDisplayName).toBe(unknownProbeName);
  });

  it("should return the correct image source based on probe status", () => {
    expect(component.determineImageSource(true, false)).toBe(
      PROBES_LABELS.SUCCESS_STATUS_ICONS.UNKNOWN
    );
    expect(component.determineImageSource(false, true)).toBe(
      PROBES_LABELS.SUCCESS_STATUS_ICONS.TRUE
    );
    expect(component.determineImageSource(false, false)).toBe(
      PROBES_LABELS.SUCCESS_STATUS_ICONS.FALSE
    );
  });

  it("should format tooltip text correctly", () => {
    probeServiceSpy.formatToTitleCase.mockReturnValue("Formatted Text");
    const result = component.formatTooltipText("some text");
    expect(result).toBe("Formatted Text");

    probeServiceSpy.formatToTitleCase.mockReturnValue("True");
    const trueResult = component.formatTooltipText(true);
    expect(trueResult).toBe("True");

    probeServiceSpy.formatToTitleCase.mockReturnValue("False");
    const falseResult = component.formatTooltipText(false);
    expect(falseResult).toBe("False");
  });

  it("should call redirectToProbesDetails on viewDetails()", () => {
    vi.spyOn(mockCommonService, "redirectToProbesDetails");
    component.viewDetails();
    expect(mockCommonService.redirectToProbesDetails).toHaveBeenCalled();
  });

  it("should dispatch resetDocumentActionState and unsubscribe from subscriptions on ngOnDestroy", () => {
    vi.spyOn((component as any).destroy$, "next");
    vi.spyOn((component as any).destroy$, "complete");
    component.ngOnDestroy();
    expect((component as any).destroy$.next).toHaveBeenCalled();
    expect((component as any).destroy$.complete).toHaveBeenCalled();
  });

  it("should unsubscribe from all subscriptions", async () => {
    let unsubscribed = false;
    (component as any).destroy$.subscribe({
      complete: () => {
        unsubscribed = true;
      },
    });
    component.ngOnDestroy();
    expect(unsubscribed).toBe(true);
  });

  describe("launchProbe", () => {
    it("should set probeLaunched and dispatch launchProbe action with correct probe name", () => {
      const testProbe = { name: "testProbe" } as any;
      vi.spyOn(store, "dispatch");
      component.launchProbe(testProbe);
      expect(component.probeLaunched).toBe(testProbe);
      expect(store.dispatch).toHaveBeenCalledWith(
        ProbeActions.launchProbe({ probeName: "testProbe" })
      );
    });
  });

  describe("highlightRow", () => {
    it("should set selectedRowIndex to the index passed", () => {
      const index = 2;
      component.highlightRow(index);
      expect(component.selectedRowIndex).toBe(index);
    });
  });

  it("should call showActionLaunchedModal when fetchProbes$ emits with commandId", () => {
    const testData = [{ name: "testProbe" }] as any;
    (component as any).fetchProbes$ = of(testData);
    component.ngOnInit();
    expect(component.probesData.data).toEqual(testData);
  });

  it("should call showActionLaunchedModal when probeLaunchedError$ emits with commandId", () => {
    const mockError = { status: 500, message: "Internal Server Error" };
    (component as any).probeLaunchedError$ = of(mockError);
    vi.spyOn((component as any)._snackBar, "openFromComponent");
    component.ngOnInit();
    expect((component as any)._snackBar.openFromComponent).toHaveBeenCalled();
  });

  it("should call showActionLaunchedModal when probeLaunchedSuccess$ emits with commandId", () => {
    const testData = [{ name: "testProbe" }] as any;
    const showLaunchAllSuccessSnackbar = false;
    (component as any).isLaunchAllProbeSuccess$ = of(
      showLaunchAllSuccessSnackbar
    );
    (component as any).probeLaunchedSuccess$ = of(testData);
    component.probeLaunched = testData[0];
    vi.spyOn((component as any)._snackBar, "openFromComponent");
    component.ngOnInit();
    expect((component as any)._snackBar.openFromComponent).toHaveBeenCalled();
  });

  it("should call showActionLaunchedModal when probeLaunchedSuccess$ emits with commandId", () => {
    const testData = [{ name: "testProbe" }] as any;
    const showLaunchAllSuccessSnackbar = true;
    (component as any).isLaunchAllProbeSuccess$ = of(
      showLaunchAllSuccessSnackbar
    );
    component.probeLaunched = testData[0];
    (component as any).probeLaunchedSuccess$ = of(testData);
    vi.spyOn((component as any)._snackBar, "openFromComponent");
    component.ngOnInit();
    expect(
      (component as any)._snackBar.openFromComponent
    ).not.toHaveBeenCalled();
  });

  describe("ngAfterViewInit", () => {
    it("should assign paginator to probesData", () => {
      component.ngAfterViewInit();
      expect(component.probesData.paginator).toBe(component.paginator);
    });
  });
});
