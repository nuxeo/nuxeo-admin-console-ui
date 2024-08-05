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

  it("should select error from store", (done) => {
    component.error$.subscribe((error) => {
      expect(error).toBeNull();
      done();
    });
  });

  it("should unsubscribe fetchProbesSubscription on destroy", () => {
    component.versionInfoSubscription = jasmine.createSpyObj("Subscription", [
      "unsubscribe",
    ]);
    component.ngOnDestroy();
    expect(component.versionInfoSubscription.unsubscribe).toHaveBeenCalled();
  });
});
