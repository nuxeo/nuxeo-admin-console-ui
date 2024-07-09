import { HttpErrorResponse } from "@angular/common/http";
import { ReindexInfo } from "../elastic-search-reindex.interface";
import * as ReindexActions from "./actions";

describe("ReindexActions", () => {
  const requestQuery =
    "SELECT * FROM DOCUMENT WHERE ecm:path='805c8feb-308c-48df-b74f-d09b4758f778'";
  it("should create performDocumentReindex action", () => {
    const action = ReindexActions.performDocumentReindex({ requestQuery });
    expect(action.type).toEqual("[Admin] Perform Reindex");
    expect(action.requestQuery).toEqual(requestQuery);
  });

  it("should create onDocumentReindexLaunch action", () => {
    const payload: ReindexInfo = {
      commandId: "20956167-dc5c-4c93-874c-67b3f598e877",
    };
    const action = ReindexActions.onDocumentReindexLaunch({
      reindexInfo: payload,
    });
    expect(action.reindexInfo).toEqual(payload);
  });

  it("should create onDocumentReindexFailure action", () => {
    const payload = { error: new HttpErrorResponse({ error: "404" }) };
    const action = ReindexActions.onDocumentReindexFailure(payload);
    expect(action.type).toEqual("[Admin] Perform Reindex Failure");
    expect(action.error).toEqual(payload.error);
  });
});
