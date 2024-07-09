import { loadPerformDocumentReindexEffect } from "./effects";
import { TestBed } from "@angular/core/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of, throwError } from "rxjs";
import * as ReindexActions from "./actions";
import { ElasticSearchReindexService } from "../services/elastic-search-reindex.service";
import { HttpErrorResponse } from "@angular/common/http";

describe("ElasticSearch Reindex Effects", () => {
  const elasticSearchReindexServiceSpy = jasmine.createSpyObj(
    "ElasticSearchReindexService",
    ["performDocumentReindex"]
  );
  const requestQuery =
    "SELECT * FROM DOCUMENT WHERE ecm:path='805c8feb-308c-48df-b74f-d09b4758f778'";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideMockStore(),
        {
          provide: ElasticSearchReindexService,
          useValue: elasticSearchReindexServiceSpy,
        },
      ],
    });
  });

  it("it should return onDocumentReindexFailure on failure", (done) => {
    const effect = TestBed.runInInjectionContext(
      () => loadPerformDocumentReindexEffect
    );
    const error = {
      status: "404",
      message: "Page not found !",
    };
    elasticSearchReindexServiceSpy.performDocumentReindex.and.returnValue(
      throwError(() => new HttpErrorResponse({ error }))
    );
    const outcome = ReindexActions.onDocumentReindexFailure({
      error: new HttpErrorResponse({ error }),
    });
    const actionsMock$ = of(
      ReindexActions.performDocumentReindex({ requestQuery })
    );
    effect(actionsMock$, elasticSearchReindexServiceSpy).subscribe(
      (result: unknown) => {
        expect(result).toEqual(outcome);
        done();
      }
    );
  });
});
