import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { Observable, of, throwError, ReplaySubject } from "rxjs";
import { loadFetchStreamsEffect } from "./effects";
import * as ConsumerPositionActions from "./actions";
import { StreamService } from "../../../services/stream.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeConsumerPosition } from "./reducers";

describe("loadFetchStreamsEffect", () => {
  let actions$: ReplaySubject<any>;
  let streamService: jasmine.SpyObj<StreamService>;

  beforeEach(() => {
    streamService = jasmine.createSpyObj("StreamService", [
      "changeConsumerPosition",
    ]);
    actions$ = new ReplaySubject(1);
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        { provide: StreamService, useValue: streamService },
      ],
    });
  });

  it("should dispatch onChangeConsumerPositionSuccess on success", (done) => {
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
    streamService.changeConsumerPosition.and.returnValue(of(data));
    const effect = loadFetchStreamsEffect(
      actions$ as Observable<any>,
      streamService
    );
    actions$.next(
      ConsumerPositionActions.onChangeConsumerPosition({ consumerPosition, params })
    );
    effect.subscribe((action) => {
      expect(action).toEqual(
        ConsumerPositionActions.onChangeConsumerPositionSuccess(data)
      );
      done();
    });
  });

  it("should dispatch onChangeConsumerPositionFailure on error", (done) => {
    const consumerPosition = "mock-segment";
    const params = { key: "value" };
    const mockError = new HttpErrorResponse({
      error: "mock-error",
      status: 500,
    });
    streamService.changeConsumerPosition.and.returnValue(
      throwError(() => mockError)
    );
    const effect = loadFetchStreamsEffect(
      actions$ as Observable<any>,
      streamService
    );
    actions$.next(
      ConsumerPositionActions.onChangeConsumerPosition({ consumerPosition, params })
    );
    effect.subscribe((action) => {
      expect(action).toEqual(
        ConsumerPositionActions.onChangeConsumerPositionFailure(mockError)
      );
      done();
    });
  });
});
