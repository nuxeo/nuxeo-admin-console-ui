import {
  reindexReducer,
  DocumentReindexState,
  initialDocumentState,
  folderReindexReducer,
  initialFolderReindexState,
  FolderReindexState,
  nxqlReindexReducer,
  initialNXQLReindexState,
  NXQLReindexState,
} from "./reducers";
import * as ReindexActions from "./actions";
import { HttpErrorResponse } from "@angular/common/http";
import { Action } from "@ngrx/store";

describe("Elastic Search Reindex Reducer", () => {
  const requestQuery =
    "SELECT * FROM DOCUMENT WHERE ecm:path='805c8feb-308c-48df-b74f-d09b4758f778'";
  it("should return the initial document state", () => {
    const action = {} as Action;
    const state = reindexReducer(undefined, action);

    expect(state).toBe(initialDocumentState);
  });

  it("should handle performDocumentReindex", () => {
    const action = ReindexActions.performDocumentReindex({ requestQuery });
    const expectedState: DocumentReindexState = {
      reindexInfo: { commandId: null },
      error: null,
    };
    const state = reindexReducer(initialDocumentState, action);
    expect(state).toEqual(expectedState);
  });

  it("should handle onDocumentReindexLaunch", () => {
    const reindexInfo = {
      commandId: "20956167-dc5c-4c93-874c-67b3f598e877",
    };
    const action = ReindexActions.onDocumentReindexLaunch({
      reindexInfo,
    });

    const expectedState: DocumentReindexState = {
      reindexInfo,
      error: null,
    };

    const state = reindexReducer(initialDocumentState, action);

    expect(state).toEqual(expectedState);
  });

  it("should handle onDocumentReindexFailure", () => {
    const error = new HttpErrorResponse({ error: "Error occurred" });
    const action = ReindexActions.onDocumentReindexFailure({ error });
    const expectedState: DocumentReindexState = {
      reindexInfo: {
        commandId: null,
      },
      error: error,
    };

    const state = reindexReducer(initialDocumentState, action);

    expect(state).toEqual(expectedState);
  });

  it("should reset the document state", () => {
    const action = ReindexActions.resetDocumentReindexState();
    const state = reindexReducer(initialDocumentState, action);
    expect(state).toEqual(initialDocumentState);
  });
});

describe("test folder reindex state", () => {
  const requestQuery =
    "SELECT * FROM DOCUMENT WHERE ecm:uuid='805c8feb-308c-48df-b74f-d09b4758f778' OR ecm:ancestorId='805c8feb-308c-48df-b74f-d09b4758f778'";
  it("should return the initial folder reindex state", () => {
    const action = {} as Action;
    const state = folderReindexReducer(undefined, action);

    expect(state).toBe(initialFolderReindexState);
  });

  it("should handle performFolderReindex", () => {
    const action = ReindexActions.performFolderReindex({ requestQuery });
    const expectedState: FolderReindexState = {
      folderReindexInfo: { commandId: null },
      error: null,
    };
    const state = folderReindexReducer(initialFolderReindexState, action);
    expect(state).toEqual(expectedState);
  });

  it("should handle onFolderReindexLaunch", () => {
    const folderReindexInfo = {
      commandId: "20956167-dc5c-4c93-874c-67b3f598e877",
    };
    const action = ReindexActions.onFolderReindexLaunch({
      folderReindexInfo,
    });

    const expectedState: FolderReindexState = {
      folderReindexInfo,
      error: null,
    };

    const state = folderReindexReducer(initialFolderReindexState, action);

    expect(state).toEqual(expectedState);
  });

  it("should handle onFolderReindexFailure", () => {
    const error = new HttpErrorResponse({ error: "Error occurred" });
    const action = ReindexActions.onFolderReindexFailure({ error });
    const expectedState: FolderReindexState = {
      folderReindexInfo: {
        commandId: null,
      },
      error: error,
    };

    const state = folderReindexReducer(initialFolderReindexState, action);

    expect(state).toEqual(expectedState);
  });

  it("should reset the folder reindex state", () => {
    const action = ReindexActions.resetFolderReindexState();
    const state = folderReindexReducer(initialFolderReindexState, action);
    expect(state).toEqual(initialFolderReindexState);
  });
});

describe("test nxql query reindex state", () => {
  const nxqlQuery =
    "SELECT * FROM Document WHERE ecm:path STARTSWITH '/default-domain'";
  it("should return the initial nxql query reindex state", () => {
    const action = {} as Action;
    const state = nxqlReindexReducer(undefined, action);

    expect(state).toBe(initialNXQLReindexState);
  });

  it("should handle performNxqlReindex", () => {
    const action = ReindexActions.performNxqlReindex({ nxqlQuery });
    const expectedState: NXQLReindexState = {
      nxqlReindexInfo: { commandId: null },
      error: null,
    };
    const state = nxqlReindexReducer(initialNXQLReindexState, action);
    expect(state).toEqual(expectedState);
  });

  it("should handle onNxqlReindexLaunch", () => {
    const nxqlReindexInfo = {
      commandId: "20956167-dc5c-4c93-874c-67b3f598e877",
    };
    const action = ReindexActions.onNxqlReindexLaunch({
      nxqlReindexInfo,
    });

    const expectedState: NXQLReindexState = {
      nxqlReindexInfo,
      error: null,
    };

    const state = nxqlReindexReducer(initialNXQLReindexState, action);

    expect(state).toEqual(expectedState);
  });

  it("should handle onNxqlReindexFailure", () => {
    const error = new HttpErrorResponse({ error: "Error occurred" });
    const action = ReindexActions.onNxqlReindexFailure({ error });
    const expectedState: NXQLReindexState = {
      nxqlReindexInfo: {
        commandId: null,
      },
      error: error,
    };

    const state = nxqlReindexReducer(initialNXQLReindexState, action);

    expect(state).toEqual(expectedState);
  });

  it("should reset the nxql query reindex state", () => {
    const action = ReindexActions.resetNxqlReindexState();
    const state = nxqlReindexReducer(initialNXQLReindexState, action);
    expect(state).toEqual(initialNXQLReindexState);
  });
});
