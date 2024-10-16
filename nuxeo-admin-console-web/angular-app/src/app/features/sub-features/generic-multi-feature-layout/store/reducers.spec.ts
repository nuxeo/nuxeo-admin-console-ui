import {
  documentActionReducer,
  folderActionReducer,
  initialDocumentState,
  initialFolderActionState,
  initialNXQLActionState,
  nxqlActionReducer,
} from "./reducers";
import { HttpErrorResponse } from "@angular/common/http";
import * as FeatureActions from "./actions";

describe("DocumentActionReducer", () => {
  it("should return initial state", () => {
    const state = documentActionReducer(undefined, { type: "" });
    expect(state).toEqual(initialDocumentState);
  });

  it("should handle performDocumentAction", () => {
    const action = FeatureActions.performDocumentAction({
      requestUrl: "query",
      requestParams: {},
      featureEndpoint: "/document",
      requestHeaders: {}
    });
    const state = documentActionReducer(initialDocumentState, action);
    expect(state.error).toBeNull();
  });

  it("should handle onDocumentActionLaunch", () => {
    const documentActionInfo = { commandId: "12345" };
    const action = FeatureActions.onDocumentActionLaunch({
      documentActionInfo,
    });
    const state = documentActionReducer(initialDocumentState, action);
    expect(state.documentActionInfo.commandId).toEqual("12345");
  });

  it("should handle onDocumentActionFailure", () => {
    const error = new HttpErrorResponse({ error: "500" });
    const action = FeatureActions.onDocumentActionFailure({ error });
    const state = documentActionReducer(initialDocumentState, action);
    expect(state.error).toEqual(error);
  });

  it("should handle resetDocumentActionState", () => {
    const action = FeatureActions.resetDocumentActionState();
    const state = documentActionReducer(
      {
        documentActionInfo: { commandId: "12345" },
        error: new HttpErrorResponse({ error: "500" }),
      },
      action
    );
    expect(state).toEqual(initialDocumentState);
  });
});

describe("FolderActionReducer", () => {
  it("should return initial state", () => {
    const state = folderActionReducer(undefined, { type: "" });
    expect(state).toEqual(initialFolderActionState);
  });

  it("should handle performFolderAction", () => {
    const action = FeatureActions.performFolderAction({
      requestUrl: "query",
      requestParams: {},
      featureEndpoint: "/folder",
      requestHeaders: {}
    });
    const state = folderActionReducer(initialFolderActionState, action);
    expect(state.error).toBeNull();
  });

  it("should handle onFolderActionLaunch", () => {
    const folderActionInfo = { commandId: "67890" };
    const action = FeatureActions.onFolderActionLaunch({ folderActionInfo });
    const state = folderActionReducer(initialFolderActionState, action);
    expect(state.folderActionInfo.commandId).toEqual("67890");
  });

  it("should handle onFolderActionFailure", () => {
    const error = new HttpErrorResponse({ error: "404" });
    const action = FeatureActions.onFolderActionFailure({ error });
    const state = folderActionReducer(initialFolderActionState, action);
    expect(state.error).toEqual(error);
  });

  it("should handle resetFolderActionState", () => {
    const action = FeatureActions.resetFolderActionState();
    const state = folderActionReducer(
      {
        folderActionInfo: { commandId: "67890" },
        error: new HttpErrorResponse({ error: "404" }),
      },
      action
    );
    expect(state).toEqual(initialFolderActionState);
  });
});

describe("NXQLActionReducer", () => {
  it("should return initial state", () => {
    const state = nxqlActionReducer(undefined, { type: "" });
    expect(state).toEqual(initialNXQLActionState);
  });

  it("should handle performNxqlAction", () => {
    const action = FeatureActions.performNxqlAction({
      requestUrl: "SELECT * FROM NXQL",
      requestParams: {},
      featureEndpoint: "/nxql",
      requestHeaders: {}
    });
    const state = nxqlActionReducer(initialNXQLActionState, action);
    expect(state.error).toBeNull();
  });

  it("should handle onNxqlActionLaunch", () => {
    const nxqlActionInfo = { commandId: "99999" };
    const action = FeatureActions.onNxqlActionLaunch({ nxqlActionInfo });
    const state = nxqlActionReducer(initialNXQLActionState, action);
    expect(state.nxqlActionInfo.commandId).toEqual("99999");
  });

  it("should handle onNxqlActionFailure", () => {
    const error = new HttpErrorResponse({ error: "403" });
    const action = FeatureActions.onNxqlActionFailure({ error });
    const state = nxqlActionReducer(initialNXQLActionState, action);
    expect(state.error).toEqual(error);
  });

  it("should handle resetNxqlActionState", () => {
    const action = FeatureActions.resetNxqlActionState();
    const state = nxqlActionReducer(
      {
        nxqlActionInfo: { commandId: "99999" },
        error: new HttpErrorResponse({ error: "403" }),
      },
      action
    );
    expect(state).toEqual(initialNXQLActionState);
  });
});
