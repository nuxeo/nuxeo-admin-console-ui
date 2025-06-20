import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { RegistrationVersionComponent } from "./registration-version.component";
import { MatCardModule } from "@angular/material/card";
import { HomeState } from "../../store/reducers";
import * as HomeActions from "../../store/actions";

describe("RegistrationVersionComponent", () => {
  let component: RegistrationVersionComponent;
  let fixture: ComponentFixture<RegistrationVersionComponent>;
  let store: MockStore<{ home: HomeState }>;

  const initialState: HomeState = {
    versionInfo: {
      version: null,
      clusterEnabled: false,
    },
    probesInfo: [],
    error: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrationVersionComponent],
      providers: [provideMockStore({ initialState: { home: initialState } })],
      imports: [MatCardModule],
    }).compileComponents();

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
    store.setState({ home: { ...initialState, versionInfo: mockVersionInfo } });
    fixture.detectChanges();

    component.ngOnInit();
    expect(store.dispatch).not.toHaveBeenCalledWith(
      HomeActions.fetchversionInfo()
    );
  });

  it("should dispatch fetchversionInfo when no data exists", () => {
    store.setState({ home: { versionInfo: null as any, probesInfo: [], error: null } });
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
