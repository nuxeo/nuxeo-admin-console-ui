import { loadPerformDocumentReindexEffect } from "./effects";
import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Observable, of, throwError } from "rxjs";
import * as ReindexActions from "./actions";
import { ElasticSearchReindexService } from "../services/elastic-search-reindex.service";
import { HttpErrorResponse } from "@angular/common/http";

describe("ElasticSearch Reindex Effects", () => {
  let actions$: Observable<any>;
  let effect: any;
  let elasticSearchReindexService: jasmine.SpyObj<ElasticSearchReindexService>;
  let elasticSearchReindexServiceSpy: any;
  const requestQuery =
    "SELECT * FROM DOCUMENT WHERE ecm:path='805c8feb-308c-48df-b74f-d09b4758f778'";

  beforeEach(() => {
    elasticSearchReindexServiceSpy = jasmine.createSpyObj(
      "ElasticSearchReindexService",
      ["performDocumentReindex"]
    );
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: ElasticSearchReindexService,
          useValue: elasticSearchReindexServiceSpy,
        },
      ],
    });
    elasticSearchReindexService = TestBed.inject(
      ElasticSearchReindexService
    ) as jasmine.SpyObj<ElasticSearchReindexService>;
    effect = TestBed.runInInjectionContext(
      () => loadPerformDocumentReindexEffect
    );
  });

  it("it should return onDocumentReindexFailure on failure", (done) => {
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
      (result: any) => {
        expect(result).toEqual(outcome);
        done();
      }
    );
  });
});
