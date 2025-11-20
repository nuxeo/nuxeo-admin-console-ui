import { homeReducer, HomeState, initialState } from "./reducers";
import * as HomeActions from "./actions";
import { Action } from "@ngrx/store";
import { HttpErrorResponse } from "@angular/common/http";
import { versionInfo } from "../../../shared/types/version-info.interface";
import { instanceInfoReducer, InstanceState, initialInstanceState } from "./reducers";
import { InstanceInfo } from "../../../shared/types/instanceInfo.interface";

describe("Home Reducer", () => {
  it("should return the initial state", () => {
    const action = {} as Action;
    const state = homeReducer(undefined, action);

    expect(state).toBe(initialState);
  });

  it("should handle fetchversionInfo", () => {
    const action = HomeActions.fetchversionInfo();

    const expectedState: HomeState = {
      versionInfo: {} as versionInfo,
      probesInfo: [],
      error: null,
    };

    const state = homeReducer(initialState, action);

    expect(state).toEqual(expectedState);
  });

  it("should handle fetchversionInfoSuccess", () => {
    const versionInfoData: versionInfo = {
      version: "1.0.0",
      clusterEnabled: true,
    };
    const action = HomeActions.fetchversionInfoSuccess({
      versionInfo: versionInfoData,
    });

    const expectedState: HomeState = {
      versionInfo: versionInfoData,
      probesInfo: [],
      error: null,
    };

    const state = homeReducer(initialState, action);

    expect(state).toEqual(expectedState);
  });

  it("should handle fetchversionInfoFailure", () => {
    const error = new HttpErrorResponse({
      error: { message: "Error occurred" },
      status: 500,
      statusText: "Internal Server Error",
    });
    const action = HomeActions.fetchversionInfoFailure({ error });

    const expectedState: HomeState = {
      versionInfo: {} as versionInfo,
      probesInfo: [],
      error: error,
    };

    const state = homeReducer(initialState, action);

    expect(state).toEqual(expectedState);
  });

  describe("InstanceInfo Reducer", () => {
    it("should return the initial instance state", () => {
      const action = {} as any;
      const state = instanceInfoReducer(undefined, action);
      expect(state).toBe(initialInstanceState);
    });

    it("should handle fetchInstanceInfo", () => {
      const action = HomeActions.fetchInstanceInfo();
      const expectedState: InstanceState = {
        instanceInfo: {} as InstanceInfo,
        instanceInfoError: null,
      };
      const state = instanceInfoReducer(initialInstanceState, action);
      expect(state).toEqual(expectedState);
    });

    it("should handle fetchInstanceInfoSuccess", () => {
      const instanceInfoData: InstanceInfo = {
        registered: true,
        instanceType: "dev",
      } as InstanceInfo;
      const action = HomeActions.fetchInstanceInfoSuccess({
        instanceInfo: instanceInfoData,
      });
      const expectedState: InstanceState = {
        instanceInfo: instanceInfoData,
        instanceInfoError: null,
      };
      const state = instanceInfoReducer(initialInstanceState, action);
      expect(state).toEqual(expectedState);
    });

    it("should handle fetchInstanceInfoFailure", () => {
      const error = new HttpErrorResponse({
        error: { message: "Instance error" },
        status: 404,
        statusText: "Not Found",
      });
      const action = HomeActions.fetchInstanceInfoFailure({ error });
      const expectedState: InstanceState = {
        instanceInfo: {} as InstanceInfo,
        instanceInfoError: error,
      };
      const state = instanceInfoReducer(initialInstanceState, action);
      expect(state).toEqual(expectedState);
    });
  });
});
