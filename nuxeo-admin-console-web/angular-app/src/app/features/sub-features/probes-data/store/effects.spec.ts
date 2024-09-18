import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Observable, of, throwError } from "rxjs";
import { ProbeDataService } from "../services/probes-data.service";
import { launchProbeEffect, loadProbesDataEffect } from "./effects";
import * as ProbeActions from "./actions";
import { Action } from "@ngrx/store";
import { HttpErrorResponse } from "@angular/common/http";

describe("ProbeEffects", () => {
  let actions$: Observable<Action>;
  let loadProbesData: typeof loadProbesDataEffect;
  let launchProbe: typeof launchProbeEffect;
  let probeService: jasmine.SpyObj<ProbeDataService>;

  beforeEach(() => {
    const probeServiceSpy = jasmine.createSpyObj("ProbeService", [
      "getProbesInfo",
      "launchProbe"
    ]);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: ProbeDataService, useValue: probeServiceSpy },
      ],
    });
    probeService = TestBed.inject(ProbeDataService) as jasmine.SpyObj<ProbeDataService>;
    loadProbesData = TestBed.runInInjectionContext(() => loadProbesDataEffect);
    launchProbe = TestBed.runInInjectionContext(() => launchProbeEffect);
  });

  describe("loadProbesDataEffect", () => {
    it("should return loadProbesDataSuccess on success", (done) => {
      const probesData = [
        {
          name: "ldapDirectories",
          status: {
            neverExecuted: true,
            success: false,
            infos: {
              info: "[unavailable]",
            },
          },
          history: {
            lastRun: null,
            lastSuccess: "1970-01-01T00:00:00.000Z",
            lastFail: "1970-01-01T00:00:00.000Z",
          },
          counts: {
            run: 0,
            success: 0,
            failure: 0,
          },
          time: 0,
        },
      ];
      probeService.getProbesInfo.and.returnValue(of({ entries: probesData }));
      const outcome = ProbeActions.loadProbesDataSuccess({
        probesData: probesData,
      });
      const actionsMock$ = of(ProbeActions.loadProbesData());
      loadProbesData(actionsMock$, probeService).subscribe((result: Action) => {
        expect(result).toEqual(outcome);
        done();
      });
    });

    it("should return loadProbesDataFailure on failure", (done) => {
      const error = new HttpErrorResponse({
        error: "404",
        status: 404,
        statusText: "Not Found",
      });
      probeService.getProbesInfo.and.returnValue(throwError(() => error));
      const outcome = ProbeActions.loadProbesDataFailure({ error });
      const actionsMock$ = of(ProbeActions.loadProbesData());
      loadProbesData(actionsMock$, probeService).subscribe((result: Action) => {
        expect(result).toEqual(outcome);
        done();
      });
    });
  });

  describe("launchProbeEffect", () => {
    it("should return launchProbeSuccess on success", (done) => {
      const probeInfo = {
        name: "ldapDirectories",
        status: {
          neverExecuted: true,
          success: false,
          infos: {
            info: "[unavailable]",
          },
        },
        history: {
          lastRun: null,
          lastSuccess: "1970-01-01T00:00:00.000Z",
          lastFail: "1970-01-01T00:00:00.000Z",
        },
        counts: {
          run: 0,
          success: 0,
          failure: 0,
        },
        time: 0,
      };
      probeService.launchProbe.and.returnValue(of(probeInfo));
      const outcome = ProbeActions.launchProbeSuccess({ probeInfo });
      actions$ = of(ProbeActions.launchProbe({ probeName: 'runtime' }));
      launchProbe(actions$, probeService).subscribe((result: Action) => {
        expect(result).toEqual(outcome);
        done();
      });
    });
  
    it("should return launchProbeFailure on failure", (done) => {
      const error = new HttpErrorResponse({
        error: "404",
        status: 404,
        statusText: "Not Found",
      });
      probeService.launchProbe.and.returnValue(throwError(() => error));
      const outcome = ProbeActions.launchProbeFailure({ error });
      actions$ = of(ProbeActions.launchProbe({ probeName: 'abc' }));
      launchProbe(actions$, probeService).subscribe((result: Action) => {
        expect(result).toEqual(outcome);
        done();
      });
    });
  });
});
