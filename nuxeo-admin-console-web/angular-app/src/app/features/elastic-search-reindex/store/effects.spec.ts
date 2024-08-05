import {
  loadPerformDocumentReindexEffect,
  loadPerformFolderReindexEffect,
  loadPerformNxqlReindexEffect,
} from "./effects";
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
    ["performDocumentReindex", "performFolderReindex", "performNXQLReindex"]
  );
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

  it("should return onDocumentReindexFailure on failure", (done) => {
    const effect = TestBed.runInInjectionContext(
      () => loadPerformDocumentReindexEffect
    );
    const requestQuery =
      "SELECT * FROM DOCUMENT WHERE ecm:path='805c8feb-308c-48df-b74f-d09b4758f778'";
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

  it("should return onFolderReindexFailure on failure", (done) => {
    const effect = TestBed.runInInjectionContext(
      () => loadPerformFolderReindexEffect
    );
    const requestQuery =
      "SELECT * FROM DOCUMENT WHERE ecm:uuid='805c8feb-308c-48df-b74f-d09b4758f778'";
    const error = {
      status: "404",
      message: "Page not found !",
    };
    elasticSearchReindexServiceSpy.performFolderReindex.and.returnValue(
      throwError(() => new HttpErrorResponse({ error }))
    );
    const outcome = ReindexActions.onFolderReindexFailure({
      error: new HttpErrorResponse({ error }),
    });
    const actionsMock$ = of(
      ReindexActions.performFolderReindex({ requestQuery })
    );
    effect(actionsMock$, elasticSearchReindexServiceSpy).subscribe(
      (result: unknown) => {
        expect(result).toEqual(outcome);
        done();
      }
    );
  });

  it("should return onFolderReindexFailure on failure", (done) => {
    const effect = TestBed.runInInjectionContext(
      () => loadPerformNxqlReindexEffect
    );
    const nxqlQuery =
      "SELECT * FROM DOCUMENT WHERE ecm:uuid='805c8feb-308c-48df-b74f-d09b4758f778'";
    const error = {
      status: "404",
      message: "Page not found !",
    };
    elasticSearchReindexServiceSpy.performNXQLReindex.and.returnValue(
      throwError(() => new HttpErrorResponse({ error }))
    );
    const outcome = ReindexActions.onNxqlReindexFailure({
      error: new HttpErrorResponse({ error }),
    });
    const actionsMock$ = of(ReindexActions.performNxqlReindex({ nxqlQuery }));
    effect(actionsMock$, elasticSearchReindexServiceSpy).subscribe(
      (result: unknown) => {
        expect(result).toEqual(outcome);
        done();
      }
    );
  });
});
