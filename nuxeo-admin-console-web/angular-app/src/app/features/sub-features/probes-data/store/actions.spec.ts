import * as ProbeActions from "./actions";
import { HttpErrorResponse } from "@angular/common/http";
import { ProbesInfo } from "./reducers";

describe("ProbeActions", () => {
  it("should create loadProbesData action", () => {
    const action = ProbeActions.loadProbesData();
    expect(action.type).toEqual("[Admin] Load Probes Data");
  });

  it("should create loadProbesDataSuccess action", () => {
    const payload: ProbesInfo[] = [
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
    const action = ProbeActions.loadProbesDataSuccess({
      probesData: payload,
    });
    expect(action.probesData).toEqual(payload);
    expect(action.type).toEqual("[Admin] Load Probes Data Success");
  });

  it("should create loadProbesDataFailure action", () => {
    const payload = new HttpErrorResponse({
      error: { message: "Error occurred" },
      status: 500,
      statusText: "Internal Server Error",
    });
    const action = ProbeActions.loadProbesDataFailure({ error: payload });
    expect(action.type).toEqual("[Admin] Load Probes Data Failure");
    expect(action.error).toEqual(payload);
  });

  it("should create launchProbe action", () => {
    const action = ProbeActions.launchProbe({ probeName: 'runtime'});
    expect(action.type).toEqual("[Admin] Launch Probe");
  });

  it("should create launchProbeSuccess action", () => {
    const payload: ProbesInfo = 
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
      };
    const action = ProbeActions.launchProbeSuccess({
      probeInfo: payload,
    });
    expect(action.probeInfo).toEqual(payload);
    expect(action.type).toEqual("[Admin] Launch Probe Success");
  });

  it("should create launchProbeFailure action", () => {
    const payload = new HttpErrorResponse({
      error: { message: "Error occurred" },
      status: 500,
      statusText: "Internal Server Error",
    });
    const action = ProbeActions.launchProbeFailure({ error: payload });
    expect(action.type).toEqual("[Admin] Launch Probe Failure");
    expect(action.error).toEqual(payload);
  });
});
