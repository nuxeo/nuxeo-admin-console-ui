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
import { Observable, of, throwError, ReplaySubject } from "rxjs";
import { loadFetchStreamsEffect } from "./effects";
import * as ConsumerPositionActions from "./actions";
import { StreamService } from "../../../services/stream.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeConsumerPosition } from "./reducers";
import { fetchConsumerPositionDataEffect } from "./effects";
import { ConsumerPositionDetails } from "./reducers";
describe("loadFetchStreamsEffect", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

  let actions$: ReplaySubject<any>;
  let streamService: MockedObject<StreamService>;

  beforeEach(() => {
    streamService = {
      changeConsumerPosition: vi
        .fn()
        .mockName("StreamService.changeConsumerPosition"),
    } as MockedObject<StreamService>;
    actions$ = new ReplaySubject(1);
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        { provide: StreamService, useValue: streamService },
      ],
    });
  });

  it("should dispatch onChangeConsumerPositionSuccess on success", async () => {
    const consumerPosition = "mock-segment";
    const params = { key: "value" };
    const data: ChangeConsumerPosition[] = [
      {
        before: {
          consumer: "mock/recomputeThumbnails",
          stream: "mock",
          lag: 0,
          lags: [
            {
              partition: 0,
              pos: 0,
              end: 0,
              lag: 0,
            },
          ],
        },
        after: {
          stream: "mock",
          consumer: "mock/recomputeThumbnails",
          lag: 0,
          lags: [
            {
              partition: 0,
              pos: 0,
              end: 0,
              lag: 0,
            },
          ],
        },
      },
    ];
    streamService.changeConsumerPosition.mockReturnValue(of(data));
    const effect = loadFetchStreamsEffect(
      actions$ as Observable<any>,
      streamService
    );
    actions$.next(
      ConsumerPositionActions.onChangeConsumerPosition({
        consumerPosition,
        params,
      })
    );
    effect.subscribe((action) => {
      expect(action).toEqual(
        ConsumerPositionActions.onChangeConsumerPositionSuccess(data)
      );
    });
  });

  it("should dispatch onChangeConsumerPositionFailure on error", async () => {
    const consumerPosition = "mock-segment";
    const params = { key: "value" };
    const mockError = new HttpErrorResponse({
      error: "mock-error",
      status: 500,
    });
    streamService.changeConsumerPosition.mockReturnValue(
      throwError(() => mockError)
    );
    const effect = loadFetchStreamsEffect(
      actions$ as Observable<any>,
      streamService
    );
    actions$.next(
      ConsumerPositionActions.onChangeConsumerPosition({
        consumerPosition,
        params,
      })
    );
    effect.subscribe((action) => {
      expect(action).toEqual(
        ConsumerPositionActions.onChangeConsumerPositionFailure(mockError)
      );
    });
  });

  describe("fetchConsumerPositionDataEffect", () => {
    let actions$: ReplaySubject<any>;
    let streamService: MockedObject<StreamService>;

    beforeEach(() => {
      streamService = {
        fetchConsumerPosition: vi
          .fn()
          .mockName("StreamService.fetchConsumerPosition"),
      } as MockedObject<StreamService>;
      actions$ = new ReplaySubject(1);
      TestBed.configureTestingModule({
        providers: [
          provideMockActions(() => actions$),
          { provide: StreamService, useValue: streamService },
        ],
      });
    });

    it("should dispatch onFetchConsumerPositionSuccess on success", async () => {
      const params = { key: "value" };
      const data: ConsumerPositionDetails[] = [
        {
          stream: "mock",
          consumer: "mock/recomputeThumbnails",
          lag: 0,
          lags: [
            {
              partition: 0,
              pos: 0,
              end: 0,
              lag: 0,
            },
          ],
        },
      ];
      streamService.fetchConsumerPosition.mockReturnValue(of(data));
      const effect = fetchConsumerPositionDataEffect(
        actions$ as Observable<any>,
        streamService
      );
      actions$.next(
        ConsumerPositionActions.onFetchConsumerPosition({ params })
      );
      effect.subscribe((action) => {
        expect(action).toEqual(
          ConsumerPositionActions.onFetchConsumerPositionSuccess(data)
        );
      });
    });

    it("should dispatch onFetchConsumerPositionFailure on error", async () => {
      const params = { key: "value" };
      const mockError = new HttpErrorResponse({
        error: "mock-error",
        status: 500,
      });
      streamService.fetchConsumerPosition.mockReturnValue(
        throwError(() => mockError)
      );
      const effect = fetchConsumerPositionDataEffect(
        actions$ as Observable<any>,
        streamService
      );
      actions$.next(
        ConsumerPositionActions.onFetchConsumerPosition({ params })
      );
      effect.subscribe((action) => {
        expect(action).toEqual(
          ConsumerPositionActions.onFetchConsumerPositionFailure(mockError)
        );
      });
    });
  });
});
