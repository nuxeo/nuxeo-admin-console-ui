import * as HomeActions from "./actions";
import { versionInfo } from "../../../shared/types/version-info.interface";

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
  });

  it("should create fetchversionInfoFailure action", () => {
    const payload = { error: "Error occurred" };
    const action = HomeActions.fetchversionInfoFailure(payload);
    expect(action.type).toEqual("[Admin] Fetch Version Info Failure");
    expect(action.error).toEqual(payload.error);
  });
});
