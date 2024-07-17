import * as HomeActions from "./actions";
import { versionInfo } from "../../../shared/types/version-info.interface";
import { HttpErrorResponse } from "@angular/common/http";
import { ProbesInfo } from "./reducers";

describe("HomeActions", () => {
  it("should create fetchversionInfo action", () => {
    const action = HomeActions.fetchversionInfo();
    expect(action.type).toEqual("[Admin] Fetch Version Info");
  });

  it("should create fetchversionInfoSuccess action", () => {
    const payload: versionInfo = { version: "1.0.0", clusterEnabled: true };
    const action = HomeActions.fetchversionInfoSuccess({
      versionInfo: payload,
    });
    expect(action.versionInfo).toEqual(payload);
    expect(action.type).toEqual("[Admin] Fetch Version Info Success");
  });

  it("should create fetchversionInfoFailure action", () => {
    const payload = new HttpErrorResponse({
      error: { message: "Error occurred" },
      status: 500,
      statusText: "Internal Server Error",
    });
    const action = HomeActions.fetchversionInfoFailure({ error: payload });
    expect(action.type).toEqual("[Admin] Fetch Version Info Failure");
    expect(action.error).toEqual(payload);
  });

  it("should create fetchProbesInfo action", () => {
    const action = HomeActions.fetchProbesInfo();
    expect(action.type).toEqual("[Admin] Fetch Probes Info");
  });

  it("should create fetchProbesInfoSuccess action", () => {
    const payload: ProbesInfo[] = [
      {
        name: "repositoryStatus",
        status: { success: true, neverExecuted: true, infos: { info: "" } },
        history: {
          lastRun: "",
          lastSuccess: "",
          lastFail: "",
        },
      },
    ];
    const action = HomeActions.fetchProbesInfoSuccess({
      probesInfo: payload,
    });
    expect(action.probesInfo).toEqual(payload);
    expect(action.type).toEqual("[Admin] Fetch Probes Info Success");
  });

  it("should create fetchProbesInfoFailure action", () => {
    const payload = new HttpErrorResponse({
      error: { message: "Error occurred" },
      status: 500,
      statusText: "Internal Server Error",
    });
    const action = HomeActions.fetchProbesInfoFailure({ error: payload });
    expect(action.type).toEqual("[Admin] Fetch Probes Info Failure");
    expect(action.error).toEqual(payload);
  });
});
