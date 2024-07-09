import {
  reindexReducer,
  DocumentReindexState,
  initialDocumentState,
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
