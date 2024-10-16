import { HttpErrorResponse } from "@angular/common/http";
import { ActionInfo } from "../generic-multi-feature-layout.interface";
import * as DocumentActions from "./actions";

describe("DocumentActions", () => {
  const requestUrl =
    "SELECT * FROM DOCUMENT WHERE ecm:path='805c8feb-308c-48df-b74f-d09b4758f778'";
  const featureEndpoint = "/document";

  const requestParams = {};
  const requestHeaders = {};
  
  it("should create performDocumentAction action", () => {
    const action = DocumentActions.performDocumentAction({ requestUrl, requestParams, featureEndpoint, requestHeaders });
    expect(action.type).toEqual("[Admin] Perform Action");
    expect(action.requestUrl).toEqual(requestUrl);
    expect(action.requestParams).toEqual(requestParams);
    expect(action.featureEndpoint).toEqual(featureEndpoint);
  });

  it("should create onDocumentActionLaunch action", () => {
    const payload: ActionInfo = {
      commandId: "20956167-dc5c-4c93-874c-67b3f598e877",
    };
    const action = DocumentActions.onDocumentActionLaunch({
      documentActionInfo: payload,
    });
    expect(action.type).toEqual("[Admin] On Action Launch");
    expect(action.documentActionInfo).toEqual(payload);
  });

  it("should create onDocumentActionFailure action", () => {
    const payload = { error: new HttpErrorResponse({ error: "404" }) };
    const action = DocumentActions.onDocumentActionFailure(payload);
    expect(action.type).toEqual("[Admin] Perform Action Failure");
    expect(action.error).toEqual(payload.error);
  });

  it("should create resetDocumentActionState action", () => {
    const action = DocumentActions.resetDocumentActionState();
    expect(action.type).toEqual("[Admin] Reset Action State");
  });
});

describe("FolderActions", () => {
  const requestUrl =
    "SELECT * FROM FOLDER WHERE ecm:path='c8feb-308c-48df-b74f-d09b4758f778'";
  const featureEndpoint = "/folder";
  const requestParams = {};
  const requestHeaders = {};

  it("should create performFolderAction action", () => {
    const action = DocumentActions.performFolderAction({ requestUrl, requestParams, featureEndpoint, requestHeaders });
    expect(action.type).toEqual("[Admin] Perform Folder Action");
    expect(action.requestUrl).toEqual(requestUrl);
    expect(action.requestParams).toEqual(requestParams);
    expect(action.featureEndpoint).toEqual(featureEndpoint);
  });

  it("should create onFolderActionLaunch action", () => {
    const payload: ActionInfo = {
      commandId: "3b598e877-dc5c-4c93-874c-67b3f56d67b3",
    };
    const action = DocumentActions.onFolderActionLaunch({
      folderActionInfo: payload,
    });
    expect(action.type).toEqual("[Admin] On Folder Action Launch");
    expect(action.folderActionInfo).toEqual(payload);
  });

  it("should create onFolderActionFailure action", () => {
    const payload = { error: new HttpErrorResponse({ error: "500" }) };
    const action = DocumentActions.onFolderActionFailure(payload);
    expect(action.type).toEqual("[Admin] On Folder Action Failure");
    expect(action.error).toEqual(payload.error);
  });

  it("should create resetFolderActionState action", () => {
    const action = DocumentActions.resetFolderActionState();
    expect(action.type).toEqual("[Admin] Reset Folder Action State");
  });
});

describe("NxqlActions", () => {
  const requestUrl = "SELECT * FROM NXQL WHERE ecm:path='f77b67b3-308c-48df-b74f'";
  const featureEndpoint = "/nxql";
  const requestParams = {};
  const requestHeaders = {};

  it("should create performNxqlAction action", () => {
    const action = DocumentActions.performNxqlAction({ requestUrl, requestParams, featureEndpoint, requestHeaders });
    expect(action.type).toEqual("[Admin] Perform NXQL Action");
    expect(action.requestUrl).toEqual(requestUrl);
    expect(action.requestParams).toEqual(requestParams);
    expect(action.featureEndpoint).toEqual(featureEndpoint);
  });

  it("should create onNxqlActionLaunch action", () => {
    const payload: ActionInfo = {
      commandId: "874f-67b3f56d67b3-308c-48df-b74f",
    };
    const action = DocumentActions.onNxqlActionLaunch({
      nxqlActionInfo: payload,
    });
    expect(action.type).toEqual("[Admin] On NXQL Action Launch");
    expect(action.nxqlActionInfo).toEqual(payload);
  });

  it("should create onNxqlActionFailure action", () => {
    const payload = { error: new HttpErrorResponse({ error: "403" }) };
    const action = DocumentActions.onNxqlActionFailure(payload);
    expect(action.type).toEqual("[Admin] On NXQL Action Failure");
    expect(action.error).toEqual(payload.error);
  });

  it("should create resetNxqlActionState action", () => {
    const action = DocumentActions.resetNxqlActionState();
    expect(action.type).toEqual("[Admin] Reset NXQL Action State");
  });
});
