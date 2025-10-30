import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { RegistrationVersionComponent } from "./registration-version.component";
import { MatCardModule } from "@angular/material/card";
import { HomeState, InstanceState } from "../../store/reducers";
import * as HomeActions from "../../store/actions";
import { HttpErrorResponse, provideHttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { SharedMethodsService } from "../../../../shared/services/shared-methods.service";
import { InstanceInfo } from "../../../../shared/types/instanceInfo.interface";
import { ERROR_TYPES } from "../../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";
import { ErrorModalClosedInfo } from "../../../../shared/types/common.interface";
import { of } from "rxjs";

describe("RegistrationVersionComponent", () => {
  let component: RegistrationVersionComponent;
  let fixture: ComponentFixture<RegistrationVersionComponent>;
  let store: MockStore<{ home: HomeState, instanceInfo: InstanceState }>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let sharedMethodsService: jasmine.SpyObj<SharedMethodsService>;
  const initialState: HomeState = {
    versionInfo: {
      version: null,
      clusterEnabled: false,
    },
    probesInfo: [],
    error: null,
  };

  beforeEach(async () => {
     sharedMethodsService = jasmine.createSpyObj("SharedMethodsService", [
      "showActionErrorModal",
    ]);
    await TestBed.configureTestingModule({
      declarations: [RegistrationVersionComponent],
      providers: [
        provideMockStore({
          initialState: { home: initialState, instanceInfo: initialState },
        }),
        provideHttpClient(),
        { provide: MatDialog, useValue: mockDialog },
        { provide: SharedMethodsService, useValue: sharedMethodsService },
      ],
      imports: [MatCardModule, MatDividerModule],
    }).compileComponents();
    mockDialog = jasmine.createSpyObj("MatDialog", ["open"]);
   
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(RegistrationVersionComponent);
    component = fixture.componentInstance;
    spyOn(store, "dispatch");
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should select versionInfo from store", (done) => {
    component.versionInfo$.subscribe((versionInfo) => {
      expect(versionInfo).toEqual(initialState.versionInfo);
      done();
    });
  });

  it("should not dispatch fetchversionInfo on init if versionInfo is not empty", () => {
    const mockVersionInfo = {
      version: "1.0.0",
      clusterEnabled: true,
    };
    store.setState({
      home: { ...initialState, versionInfo: mockVersionInfo },
    } as any);
    fixture.detectChanges();
    component.ngOnInit();
    expect(store.dispatch).not.toHaveBeenCalledWith(
      HomeActions.fetchversionInfo()
    );
  });

  it("should dispatch fetchversionInfo when no data exists", () => {
    store.setState({
      home: { versionInfo: null as any, probesInfo: [], error: null },
    } as any);
    fixture.detectChanges();
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(
      HomeActions.fetchversionInfo()
    );
  });

  it("should select error from store", (done) => {
    component.error$.subscribe((error) => {
      expect(error).toBeNull();
      done();
    });
  });
  
  it("should handle version info failure when error object is available and show action error modal", () => {
    const mockError = {
      error: { status: 500, message: "Server Error" },
    } as HttpErrorResponse;
     const mockModalResponse: ErrorModalClosedInfo = {
       isClosed: true,
       event: {},
     };
    sharedMethodsService.showActionErrorModal.and.returnValue(of(mockModalResponse));
    store.setState({ home: { ...initialState, error: mockError } } as any);
    fixture.detectChanges();
    component.error$.subscribe((error) => {
      expect(error).toEqual(mockError);
      expect(
       sharedMethodsService.showActionErrorModal
      ).toHaveBeenCalledWith({
        type: ERROR_TYPES.SERVER_ERROR,
        details: {
          status: mockError.error.status,
          message: mockError.error.message,
        },
      });
    });
  });

   it("should handle version info failure when error object is not available and show action error modal", () => {
    const mockError = {
      status: 500, message: "Server Error",
    } as HttpErrorResponse;
     const mockModalResponse: ErrorModalClosedInfo = {
       isClosed: true,
       event: {},
     };
    sharedMethodsService.showActionErrorModal.and.returnValue(of(mockModalResponse));
    store.setState({ home: { ...initialState, error: mockError } } as any);
    fixture.detectChanges();
    component.error$.subscribe((error) => {
      expect(error).toEqual(mockError);
      expect(
       sharedMethodsService.showActionErrorModal
      ).toHaveBeenCalledWith({
        type: ERROR_TYPES.SERVER_ERROR,
        details: {
          status: mockError.status,
          message: mockError.message,
        },
      });
    });
  });

  it("should select instanceInfo from store", (done) => {
    const mockInstanceState = {
      instanceInfo: { registered: true, instanceType: "dev" } as InstanceInfo,
      instanceInfoError: null,
    };
    store.setState({ instanceInfo: mockInstanceState } as any);
    fixture.detectChanges();
    component.instanceInfo$.subscribe((instanceInfo) => {
      expect(instanceInfo).toEqual(mockInstanceState.instanceInfo);
      expect(component.instanceInformation).toEqual(
        mockInstanceState.instanceInfo
      );
      done();
    });
  });

  it("should select instanceInfo from store", (done) => {
    const mockInstanceState = {
      instanceInfo: {} as InstanceInfo,
      instanceInfoError: null,
    };
    store.setState({ instanceInfo: mockInstanceState } as any);
    fixture.detectChanges();
    component.instanceInfo$.subscribe((instanceInfo) => {
      expect(instanceInfo).toEqual(mockInstanceState.instanceInfo);
      expect(component.instanceInformation).toEqual(null);
      expect(store.dispatch).toHaveBeenCalledWith(
        HomeActions.fetchInstanceInfo()
      );
      done();
    });
  });

  it("should handle instance info failure when error object is available and show action error modal", () => {
    const mockError = {
      error: { status: 500, message: "Server Error" },
    } as HttpErrorResponse;
    store.setState({
      instanceInfo: { instanceInfo: null, instanceInfoError: mockError },
    } as any);
    fixture.detectChanges();
    component.instanceInfoFailure$.subscribe((error) => {
      expect(error).toEqual(mockError);
      expect(
        (component as any).sharedMethodsService.showActionErrorModal
      ).toHaveBeenCalledWith({
        type: ERROR_TYPES.SERVER_ERROR,
        details: {
          status: mockError.error.status,
          message: mockError.error.message,
        },
      });
    });
  });

  it("should handle instance info failure when error object is not available and show action error modal", () => {
    const mockError = {
      status: 500, message: "Server Error",
    } as HttpErrorResponse;
    store.setState({
      instanceInfo: { instanceInfo: null, instanceInfoError: mockError },
    } as any);
    fixture.detectChanges();
    component.instanceInfoFailure$.subscribe((error) => {
      expect(error).toEqual(mockError);
      expect(
        (component as any).sharedMethodsService.showActionErrorModal
      ).toHaveBeenCalledWith({
        type: ERROR_TYPES.SERVER_ERROR,
        details: {
          status: mockError.status,
          message: mockError.message,
        },
      });
    });
  });

  describe("ngOnDestroy", () => {
    it("should complete the destroy$ subject", () => {
      const completeSpy = spyOn(
        (component as any).destroy$,
        "complete"
      ).and.callThrough();
      const nextSpy = spyOn(
        (component as any).destroy$,
        "next"
      ).and.callThrough();
      component.ngOnDestroy();
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it("should allow subscriptions using takeUntil(destroy$) to be unsubscribed", (done) => {
      let unsubscribed = false;
      component["destroy$"].subscribe({
        complete: () => {
          unsubscribed = true;
        },
      });
      component.ngOnDestroy();
      expect(unsubscribed).toBeTrue();
      done();
    });
  });
});
