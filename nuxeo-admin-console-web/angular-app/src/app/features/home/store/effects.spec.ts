import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Observable, of, throwError } from "rxjs";
import { HomeService } from "../services/home.service";
import { loadVersionInfoEffect } from "./effects";
import * as HomeActions from "./actions";

describe("HomeEffects", () => {
  let actions$: Observable<any>;
  let effect: any;
  let homeService: jasmine.SpyObj<HomeService>;
  let homeServiceSpy: any;

  beforeEach(() => {
    homeServiceSpy = jasmine.createSpyObj("HomeService", ["getVersionInfo"]);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: HomeService, useValue: homeServiceSpy },
      ],
    });
    homeService = TestBed.inject(HomeService) as jasmine.SpyObj<HomeService>;
    effect = TestBed.runInInjectionContext(() => loadVersionInfoEffect);
  });

  it("it should return fetchversionInfoSuccess on success", (done) => {
    const versionInfoData = { version: "1.0.0", clusterEnabled: true };
    homeServiceSpy.getVersionInfo.and.returnValue(of(versionInfoData));
    const outcome = HomeActions.fetchversionInfoSuccess({
      versionInfo: versionInfoData,
    });
    const actionsMock$ = of(HomeActions.fetchversionInfo());
    effect(actionsMock$, homeServiceSpy).subscribe((result: any) => {
      expect(result).toEqual(outcome);
      done();
    });
  });

  it("it should return fetchversionInfoFailure on failure", (done) => {
    const error = {
      name: "error404",
      message: "Page not found !",
      error: "404",
    };
    homeServiceSpy.getVersionInfo.and.returnValue(throwError(() => error));
    const outcome = HomeActions.fetchversionInfoFailure({
      error,
    });
    const actionsMock$ = of(HomeActions.fetchversionInfo());
    effect(actionsMock$, homeServiceSpy).subscribe((result: any) => {
      expect(result).toEqual(outcome);
      done();
    });
  });
});