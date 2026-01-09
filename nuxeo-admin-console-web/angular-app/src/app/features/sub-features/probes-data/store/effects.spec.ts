import { initializeTestBed } from "src/test-helpers"; //This import must be the first import in the file.
import {
  beforeEach,
  describe,
  expect,
  it,
  type MockedObject,
  vi,
} from "vitest";
import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { Observable, of, throwError } from "rxjs";
import { ProbeDataService } from "../services/probes-data.service";
import {
  launchAllProbesEffect,
  launchProbeEffect,
  loadProbesDataEffect,
} from "./effects";
import * as ProbeActions from "./actions";
import { Action } from "@ngrx/store";
import {
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
describe("ProbeEffects", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

  let actions$: Observable<Action>;
  let loadProbesData: typeof loadProbesDataEffect;
  let launchProbe: typeof launchProbeEffect;
  let probeService: MockedObject<ProbeDataService>;
  let launchAllProbes: typeof launchAllProbesEffect;

  beforeEach(() => {
    const probeServiceSpy = {
      getProbesInfo: vi.fn().mockName("ProbeService.getProbesInfo"),
      launchProbe: vi.fn().mockName("ProbeService.launchProbe"),
      launchAllProbes: vi.fn().mockName("ProbeService.launchAllProbes"),
    };
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: ProbeDataService, useValue: probeServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    probeService = TestBed.inject(
      ProbeDataService
    ) as MockedObject<ProbeDataService>;
    loadProbesData = TestBed.runInInjectionContext(() => loadProbesDataEffect);
    launchProbe = TestBed.runInInjectionContext(() => launchProbeEffect);
    launchAllProbes = TestBed.runInInjectionContext(
      () => launchAllProbesEffect
    );
  });

  describe("loadProbesDataEffect", () => {
    it("should return loadProbesDataSuccess on success", async () => {
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
      probeService.getProbesInfo.mockReturnValue(of({ entries: probesData }));
      const outcome = ProbeActions.loadProbesDataSuccess({
        probesData: probesData,
      });
      const actionsMock$ = of(ProbeActions.loadProbesData());
      loadProbesData(actionsMock$, probeService).subscribe((result: Action) => {
        expect(result).toEqual(outcome);
      });
    });

    it("should return loadProbesDataFailure on failure", async () => {
      const error = new HttpErrorResponse({
        error: "404",
        status: 404,
        statusText: "Not Found",
      });
      probeService.getProbesInfo.mockReturnValue(throwError(() => error));
      const outcome = ProbeActions.loadProbesDataFailure({ error });
      const actionsMock$ = of(ProbeActions.loadProbesData());
      loadProbesData(actionsMock$, probeService).subscribe((result: Action) => {
        expect(result).toEqual(outcome);
      });
    });
  });

  describe("launchProbeEffect", () => {
    it("should return launchProbeSuccess on success", async () => {
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
      probeService.launchProbe.mockReturnValue(of(probeInfo));
      const outcome = ProbeActions.launchProbeSuccess({ probeInfo });
      actions$ = of(ProbeActions.launchProbe({ probeName: "runtime" }));
      launchProbe(actions$, probeService).subscribe((result: Action) => {
        expect(result).toEqual(outcome);
      });
    });

    it("should return launchProbeFailure on failure", async () => {
      const error = new HttpErrorResponse({
        error: "404",
        status: 404,
        statusText: "Not Found",
      });
      probeService.launchProbe.mockReturnValue(throwError(() => error));
      const outcome = ProbeActions.launchProbeFailure({ error });
      actions$ = of(ProbeActions.launchProbe({ probeName: "abc" }));
      launchProbe(actions$, probeService).subscribe((result: Action) => {
        expect(result).toEqual(outcome);
      });
    });
  });

  describe("loadProbesDataEffect", () => {
    it("should return loadProbesDataSuccess on success", async () => {
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
      probeService.launchAllProbes.mockReturnValue(of({ entries: probesData }));
      const outcome = ProbeActions.launchAllProbesSuccess({
        probesData: probesData,
      });
      const actionsMock$ = of(ProbeActions.launchAllProbes());
      launchAllProbes(actionsMock$, probeService).subscribe(
        (result: Action) => {
          expect(result).toEqual(outcome);
        }
      );
    });

    it("should return loadProbesDataFailure on failure", async () => {
      const error = new HttpErrorResponse({
        error: "404",
        status: 404,
        statusText: "Not Found",
      });
      probeService.launchAllProbes.mockReturnValue(throwError(() => error));
      const outcome = ProbeActions.launchAllProbesFailure({ error });
      const actionsMock$ = of(ProbeActions.launchAllProbes());
      launchAllProbes(actionsMock$, probeService).subscribe(
        (result: Action) => {
          expect(result).toEqual(outcome);
        }
      );
    });
  });
});
