import { initializeTestBed } from "src/test-helpers"; //This import must be the first import in the file.
import {
  beforeEach,
  describe,
  expect,
  it,
  type MockedObject,
  vi,
} from "vitest";
import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { Observable, of, throwError } from "rxjs";
import { GenericMultiFeatureEndpointsService } from "../services/generic-multi-feature-endpoints.service";
import {
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { Action } from "@ngrx/store";
import * as FeatureActions from "./actions";
import {
  loadPerformDocumentActionEffect,
  loadPerformFolderActionEffect,
  loadPerformNxqlActionEffect,
} from "./effects";
describe("GenericMultiFeatureEffects", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

  let actions$: Observable<Action>;
  let loadPerformDocumentAction: typeof loadPerformDocumentActionEffect;
  let loadPerformFolderAction: typeof loadPerformFolderActionEffect;
  let loadPerformNxqlAction: typeof loadPerformNxqlActionEffect;
  let genericMultiFeatureService: MockedObject<GenericMultiFeatureEndpointsService>;

  beforeEach(() => {
    const genericServiceSpy = {
      performDocumentAction: vi
        .fn()
        .mockName("GenericMultiFeatureEndpointsService.performDocumentAction"),
      performFolderAction: vi
        .fn()
        .mockName("GenericMultiFeatureEndpointsService.performFolderAction"),
      performNXQLAction: vi
        .fn()
        .mockName("GenericMultiFeatureEndpointsService.performNXQLAction"),
    };

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: GenericMultiFeatureEndpointsService,
          useValue: genericServiceSpy,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    genericMultiFeatureService = TestBed.inject(
      GenericMultiFeatureEndpointsService
    ) as MockedObject<GenericMultiFeatureEndpointsService>;

    loadPerformDocumentAction = TestBed.runInInjectionContext(
      () => loadPerformDocumentActionEffect
    );
    loadPerformFolderAction = TestBed.runInInjectionContext(
      () => loadPerformFolderActionEffect
    );
    loadPerformNxqlAction = TestBed.runInInjectionContext(
      () => loadPerformNxqlActionEffect
    );
  });

  describe("loadPerformDocumentActionEffect", () => {
    it("should return onDocumentActionLaunch on success", async () => {
      const documentActionInfo = { commandId: "12345" };
      const action = FeatureActions.performDocumentAction({
        requestUrl: "SELECT * FROM DOCUMENT WHERE ecm:path='doc-path'",
        requestParams: {},
        featureEndpoint: "/document-featureEndpoint",
        requestHeaders: {},
      });

      genericMultiFeatureService.performDocumentAction.mockReturnValue(
        of(documentActionInfo)
      );
      const outcome = FeatureActions.onDocumentActionLaunch({
        documentActionInfo,
      });
      actions$ = of(action);

      loadPerformDocumentAction(actions$, genericMultiFeatureService).subscribe(
        (result: Action) => {
          expect(result).toEqual(outcome);
        }
      );
    });

    it("should return onDocumentActionFailure on error", async () => {
      const error = new HttpErrorResponse({
        error: "500",
        status: 500,
        statusText: "Server Error",
      });
      const action = FeatureActions.performDocumentAction({
        requestUrl: "SELECT * FROM DOCUMENT WHERE ecm:path='doc-path'",
        requestParams: {},
        featureEndpoint: "/document-featureEndpoint",
        requestHeaders: {},
      });

      genericMultiFeatureService.performDocumentAction.mockReturnValue(
        throwError(() => error)
      );
      const outcome = FeatureActions.onDocumentActionFailure({
        error: error?.error ? error?.error : error,
      });
      actions$ = of(action);

      loadPerformDocumentAction(actions$, genericMultiFeatureService).subscribe(
        (result: Action) => {
          expect(result).toEqual(outcome);
        }
      );
    });
  });

  describe("loadPerformFolderActionEffect", () => {
    it("should return onFolderActionLaunch on success", async () => {
      const folderActionInfo = { commandId: "67890" };
      const action = FeatureActions.performFolderAction({
        requestUrl: "SELECT * FROM FOLDER WHERE ecm:path='folder-path'",
        requestParams: {},
        featureEndpoint: "/folder-featureEndpoint",
        requestHeaders: {},
      });

      genericMultiFeatureService.performFolderAction.mockReturnValue(
        of(folderActionInfo)
      );
      const outcome = FeatureActions.onFolderActionLaunch({ folderActionInfo });
      actions$ = of(action);

      loadPerformFolderAction(actions$, genericMultiFeatureService).subscribe(
        (result: Action) => {
          expect(result).toEqual(outcome);
        }
      );
    });

    it("should return onFolderActionFailure on error", async () => {
      const error = new HttpErrorResponse({
        error: "404",
        status: 404,
        statusText: "Not Found",
      });
      const action = FeatureActions.performFolderAction({
        requestUrl: "SELECT * FROM FOLDER WHERE ecm:path='folder-path'",
        requestParams: {},
        featureEndpoint: "/folder-featureEndpoint",
        requestHeaders: {},
      });

      genericMultiFeatureService.performFolderAction.mockReturnValue(
        throwError(() => error)
      );
      const outcome = FeatureActions.onFolderActionFailure({
        error: error?.error ? error?.error : error,
      });
      actions$ = of(action);

      loadPerformFolderAction(actions$, genericMultiFeatureService).subscribe(
        (result: Action) => {
          expect(result).toEqual(outcome);
        }
      );
    });
  });

  describe("loadPerformNxqlActionEffect", () => {
    it("should return onNxqlActionLaunch on success", async () => {
      const nxqlActionInfo = { commandId: "99999" };
      const action = FeatureActions.performNxqlAction({
        requestUrl: "SELECT * FROM NXQL WHERE ecm:path='nxql-path'",
        requestParams: {},
        featureEndpoint: "/nxql-featureEndpoint",
        requestHeaders: {},
      });

      genericMultiFeatureService.performNXQLAction.mockReturnValue(
        of(nxqlActionInfo)
      );
      const outcome = FeatureActions.onNxqlActionLaunch({ nxqlActionInfo });
      actions$ = of(action);

      loadPerformNxqlAction(actions$, genericMultiFeatureService).subscribe(
        (result: Action) => {
          expect(result).toEqual(outcome);
        }
      );
    });

    it("should return onNxqlActionFailure on error", async () => {
      const error = new HttpErrorResponse({
        error: "403",
        status: 403,
        statusText: "Forbidden",
      });
      const action = FeatureActions.performNxqlAction({
        requestUrl: "SELECT * FROM NXQL WHERE ecm:path='nxql-path'",
        requestParams: {},
        featureEndpoint: "/nxql-featureEndpoint",
        requestHeaders: {},
      });

      genericMultiFeatureService.performNXQLAction.mockReturnValue(
        throwError(() => error)
      );
      const outcome = FeatureActions.onNxqlActionFailure({
        error: error?.error ? error?.error : error,
      });
      actions$ = of(action);

      loadPerformNxqlAction(actions$, genericMultiFeatureService).subscribe(
        (result: Action) => {
          expect(result).toEqual(outcome);
        }
      );
    });
  });
});
