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
  let dispatchSpy: jasmine.Spy;

  const initialState: HomeState = {
    versionInfo: {
      version: "Nuxeo Platform 2021.45.8",
      clusterEnabled: true,
    },
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
    dispatchSpy = spyOn(store, "dispatch");
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should select versionInfo from store", (done) => {
    component.versionInfo$.subscribe((versionInfo) => {
      expect(versionInfo.version).toBe("Nuxeo Platform 2021.45.8");
      expect(versionInfo.clusterEnabled).toBeTrue();
      done();
    });
  });

  it("should dispatch fetchversionInfo on init", () => {
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(HomeActions.fetchversionInfo());
  });

  it("should select error from store", (done) => {
    component.error$.subscribe((error) => {
      expect(error).toBeNull();
      done();
    });
  });
});
