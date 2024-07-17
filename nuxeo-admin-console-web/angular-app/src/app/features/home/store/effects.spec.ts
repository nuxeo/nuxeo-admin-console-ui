import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Observable, of, throwError } from "rxjs";
import { HomeService } from "../services/home.service";
import { loadVersionInfoEffect, loadProbesInfoEffect } from "./effects";
import * as HomeActions from "./actions";
import { Action } from "@ngrx/store";
import { HttpErrorResponse } from "@angular/common/http";
import { ProbesResponse } from "../../../shared/types/probes.interface";

describe("HomeEffects", () => {
  let actions$: Observable<Action>;
  let loadVersionInfo: typeof loadVersionInfoEffect;
  let loadProbesInfo: typeof loadProbesInfoEffect;
  let homeService: jasmine.SpyObj<HomeService>;

  beforeEach(() => {
    const homeServiceSpy = jasmine.createSpyObj("HomeService", [
      "getVersionInfo",
      "getProbesInfo",
    ]);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: HomeService, useValue: homeServiceSpy },
      ],
    });
    homeService = TestBed.inject(HomeService) as jasmine.SpyObj<HomeService>;
    loadVersionInfo = TestBed.runInInjectionContext(() => loadVersionInfoEffect);
    loadProbesInfo = TestBed.runInInjectionContext(() => loadProbesInfoEffect);
  });

  describe("loadVersionInfoEffect", () => {
    it("should return fetchversionInfoSuccess on success", (done) => {
      const versionInfoData = { server: { distributionVersion: "1.0.0" }, cluster: { enabled: true } };
      homeService.getVersionInfo.and.returnValue(of(versionInfoData));
      const outcome = HomeActions.fetchversionInfoSuccess({
        versionInfo: { version: "1.0.0", clusterEnabled: true },
      });
      const actionsMock$ = of(HomeActions.fetchversionInfo());
      loadVersionInfo(actionsMock$, homeService).subscribe((result: Action) => {
        expect(result).toEqual(outcome);
        done();
      });
    });

    it("should return fetchversionInfoFailure on failure", (done) => {
      const error = new HttpErrorResponse({
        error: "404",
        status: 404,
        statusText: "Not Found",
      });
      homeService.getVersionInfo.and.returnValue(throwError(() => error));
      const outcome = HomeActions.fetchversionInfoFailure({ error });
      const actionsMock$ = of(HomeActions.fetchversionInfo());
      loadVersionInfo(actionsMock$, homeService).subscribe((result: Action) => {
        expect(result).toEqual(outcome);
        done();
      });
    });
  });

  describe("loadProbesInfoEffect", () => {
    it("should return fetchProbesInfoSuccess on success", (done) => {
      const probesInfoData: ProbesResponse = {
        entries: [
          {
            name: "repositoryStatus",
            status: { success: true, neverExecuted: true, infos: { info: "" } },
            history: { lastRun: "", lastSuccess: "", lastFail: "" },
          },
        ],
      };
      homeService.getProbesInfo.and.returnValue(of(probesInfoData));
      const outcome = HomeActions.fetchProbesInfoSuccess({
        probesInfo: probesInfoData.entries,
      });
      const actionsMock$ = of(HomeActions.fetchProbesInfo());
      loadProbesInfo(actionsMock$, homeService).subscribe((result: Action) => {
        expect(result).toEqual(outcome);
        done();
      });
    });

    it("should return fetchProbesInfoFailure on failure", (done) => {
      const error = new HttpErrorResponse({
        error: "404",
        status: 404,
        statusText: "Not Found",
      });
      homeService.getProbesInfo.and.returnValue(throwError(() => error));
      const outcome = HomeActions.fetchProbesInfoFailure({ error });
      const actionsMock$ = of(HomeActions.fetchProbesInfo());
      loadProbesInfo(actionsMock$, homeService).subscribe((result: Action) => {
        expect(result).toEqual(outcome);
        done();
      });
    });
  });
});
