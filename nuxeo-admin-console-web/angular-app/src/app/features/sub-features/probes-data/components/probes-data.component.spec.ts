import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProbesDataComponent } from "./probes-data.component";
import { provideMockStore } from "@ngrx/store/testing";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import * as ProbeActions from "../store/actions";
import { ProbeDataService } from "../services/probes-data.service";
import { PROBES_LABELS } from "../probes-data.constants";
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonService } from "../../../../shared/services/common.service";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTooltipModule } from "@angular/material/tooltip";

describe("ProbesDataComponent", () => {
  let component: ProbesDataComponent;
  let fixture: ComponentFixture<ProbesDataComponent>;
  let store: Store;
  let probeServiceSpy: jasmine.SpyObj<ProbeDataService>;
  let mockCommonService: jasmine.SpyObj<CommonService>;

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
    probeServiceSpy = jasmine.createSpyObj("ProbeDataService", [
      "formatToTitleCase",
    ]);

    await TestBed.configureTestingModule({
      declarations: [ProbesDataComponent],
      imports: [MatSnackBarModule,MatPaginatorModule,MatTooltipModule],
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
    ) as jasmine.SpyObj<CommonService>;
  });

  it("should test if the component is created", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch probes info on init if probesInfo is empty", () => {
    spyOn(store, "dispatch").and.callThrough(); 
    spyOn(store, "pipe").and.returnValue(of([]));
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(ProbeActions.loadProbesData());
  });


  it("should return correct display name for probe", () => {
    const probeName = "repositoryStatus";
    const displayName = component.deriveProbeDisplayName(probeName);
    expect(displayName).toBe("Repository");

    const unknownProbeName = "unknownProbe";
    const unknownDisplayName = component.deriveProbeDisplayName(unknownProbeName);
    expect(unknownDisplayName).toBe(unknownProbeName);
  });

  it("should return the correct image source based on probe status", () => {
    expect(component.determineImageSource(true, false)).toBe(PROBES_LABELS.SUCCESS_STATUS_ICONS.UNKNOWN);
    expect(component.determineImageSource(false, true)).toBe(PROBES_LABELS.SUCCESS_STATUS_ICONS.TRUE);
    expect(component.determineImageSource(false, false)).toBe(PROBES_LABELS.SUCCESS_STATUS_ICONS.FALSE);
  });

  it("should format tooltip text correctly", () => {
    probeServiceSpy.formatToTitleCase.and.returnValue("Formatted Text");
    const result = component.formatTooltipText("some text");
    expect(result).toBe("Formatted Text");

    probeServiceSpy.formatToTitleCase.and.returnValue("True");
    const trueResult = component.formatTooltipText(true);
    expect(trueResult).toBe("True");

    probeServiceSpy.formatToTitleCase.and.returnValue("False");
    const falseResult = component.formatTooltipText(false);
    expect(falseResult).toBe("False");
  });

  it('should call redirectToProbesDetails on viewDetails()', () => {
    spyOn(mockCommonService, "redirectToProbesDetails");
    component.viewDetails();
    expect(mockCommonService.redirectToProbesDetails).toHaveBeenCalled();
  });

  it("should dispatch resetDocumentActionState and unsubscribe from subscriptions on ngOnDestroy", () => {
    spyOn((component as any).destroy$, "next");
    spyOn((component as any).destroy$, "complete");
    component.ngOnDestroy();
    expect((component as any).destroy$.next).toHaveBeenCalled();
    expect((component as any).destroy$.complete).toHaveBeenCalled();
  });

  it("should unsubscribe from all subscriptions", (done) => {
    let unsubscribed = false;
    (component as any).destroy$.subscribe({
      complete: () => {
        unsubscribed = true;
      },
    });
    component.ngOnDestroy();
      expect(unsubscribed).toBeTrue();
      done();
  });
  
  describe('launchProbe', () => {
    it('should set probeLaunched and dispatch launchProbe action with correct probe name', () => {
      const testProbe = { name: 'testProbe' } as any;
      spyOn(store, 'dispatch');
      component.launchProbe(testProbe);
      expect(component.probeLaunched).toBe(testProbe);
      expect(store.dispatch).toHaveBeenCalledWith(
        ProbeActions.launchProbe({ probeName: 'testProbe' })
      );
    });
  });

  describe('highlightRow', ()=>{
    it('should set selectedRowIndex to the index passed', () => {
      const index = 2;
      component.highlightRow(index);
      expect(component.selectedRowIndex).toBe(index);
    });
  });

  it('should call showActionLaunchedModal when fetchProbes$ emits with commandId', () => {
    const testData = [{ name: 'testProbe' }] as any;
    (component as any).fetchProbes$ = of(testData);
    component.ngOnInit();
    expect(component.probesData.data).toEqual(testData);
  });

  it('should call showActionLaunchedModal when probeLaunchedError$ emits with commandId', () => {
    const mockError = { status: 500, message: 'Internal Server Error' };
    (component as any).probeLaunchedError$ = of(mockError);
    spyOn((component as any)._snackBar, 'openFromComponent');
    component.ngOnInit();
    expect((component as any)._snackBar.openFromComponent).toHaveBeenCalled();
  });

  it('should call showActionLaunchedModal when probeLaunchedSuccess$ emits with commandId', () => {
    const testData = [{ name: 'testProbe' }] as any;
    const showLaunchAllSuccessSnackbar = false;
    (component as any).isLaunchAllProbeSuccess$ = of(showLaunchAllSuccessSnackbar);
    (component as any).probeLaunchedSuccess$ = of(testData);
    component.probeLaunched = testData[0];
    spyOn((component as any)._snackBar, 'openFromComponent');
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
    spyOn((component as any)._snackBar, "openFromComponent");
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
