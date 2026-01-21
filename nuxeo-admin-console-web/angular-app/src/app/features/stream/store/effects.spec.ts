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
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { Action } from "@ngrx/store";
import { StreamService } from "../services/stream.service";
import * as StreamActions from "../store/actions";
import {
  loadFetchStreamsEffect,
  loadFetchConsumersEffect,
  triggerRecordsSSEStream$,
  stopRecordsSSEStream$,
  startConsumerThreadPool$,
  stopConsumerThreadPool$,
} from "./effects";
import {
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
describe("StreamEffects", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

  let actions$: Observable<Action>;
  let loadFetchStreams: typeof loadFetchStreamsEffect;
  let loadFetchConsumers: typeof loadFetchConsumersEffect;
  let triggerRecordsSSEStream: typeof triggerRecordsSSEStream$;
  let stopRecordsSSEStream: typeof stopRecordsSSEStream$;
  let streamService: MockedObject<StreamService>;

  beforeEach(() => {
    class streamServiceStub {
      isFetchingRecords: BehaviorSubject<boolean> = new BehaviorSubject(false);
      getStreams() {
        return of(null);
      }
      getConsumers() {
        return of(null);
      }
      startSSEStream() {
        return of(null);
      }
      stopSSEStream() {
        return of(null);
      }
      startConsumerThreadPool() {
        return of(null);
      }
      stopConsumerThreadPool() {
        return of(null);
      }
    }

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: StreamService, useClass: streamServiceStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    streamService = TestBed.inject(
      StreamService
    ) as MockedObject<StreamService>;
    loadFetchStreams = TestBed.runInInjectionContext(
      () => loadFetchStreamsEffect
    );
    loadFetchConsumers = TestBed.runInInjectionContext(
      () => loadFetchConsumersEffect
    );
    triggerRecordsSSEStream = TestBed.runInInjectionContext(
      () => triggerRecordsSSEStream$
    );
    stopRecordsSSEStream = TestBed.runInInjectionContext(
      () => stopRecordsSSEStream$
    );
  });

  describe("loadFetchStreamsEffect", () => {
    it("should return onFetchStreamsLaunch on success", async () => {
      const streamsData = [{ name: "stream1" }, { name: "stream2" }];
      const action = StreamActions.fetchStreams();
      vi.spyOn(streamService, "getStreams").mockReturnValue(of(streamsData));
      const outcome = StreamActions.onFetchStreamsLaunch({ streamsData });
      actions$ = of(action);
      loadFetchStreams(actions$, streamService).subscribe((result: Action) => {
        expect(result).toEqual(outcome);
      });
    });
  });

  describe("loadFetchConsumersEffect", () => {
    it("should return onFetchConsumersLaunch on success", async () => {
      const consumersData = [{ stream: "stream1", consumer: "consumer1" }];
      const action = StreamActions.fetchConsumers({
        params: { stream: "stream1" },
      });
      vi.spyOn(streamService, "getConsumers").mockReturnValue(
        of(consumersData)
      );
      const outcome = StreamActions.onFetchConsumersLaunch({ consumersData });
      actions$ = of(action);
      loadFetchConsumers(actions$, streamService).subscribe(
        (result: Action) => {
          expect(result).toEqual(outcome);
        }
      );
    });
  });

  describe("triggerRecordsSSEStream$", () => {
    it("should return onFetchRecordsLaunch on success", async () => {
      const recordsData = [{ record: "record1" }];
      const params = {
        stream: "bulk/none",
        rewind: "0",
        limit: "2",
        timeout: "1ms",
      };
      const action = StreamActions.triggerRecordsSSEStream({ params });
      vi.spyOn(streamService, "startSSEStream").mockReturnValue(
        of({ record: "record1" })
      );
      const outcome = StreamActions.onFetchRecordsLaunch({ recordsData });
      actions$ = of(action);

      const results: Action[] = [];
      triggerRecordsSSEStream(actions$, streamService).subscribe({
        next: (result: Action) => {
          results.push(result);
        },
        complete: () => {
          expect(results[results.length - 1]).toEqual(outcome);
        },
      });
    });
  });

  describe("stopRecordsSSEStream$", () => {
    it("should return onStopFetchLaunch on success", async () => {
      const action = StreamActions.onStopFetch();
      vi.spyOn(streamService, "stopSSEStream").mockReturnValue(of(undefined));
      const outcome = StreamActions.onStopFetchLaunch();
      actions$ = of(action);
      stopRecordsSSEStream(actions$, streamService).subscribe(
        (result: Action) => {
          expect(result).toEqual(outcome);
        }
      );
    });

    it("should dispatch onStopFetchFailure when an error occurs", async () => {
      const error = new Error("Mock Error");
      const actions$ = of(StreamActions.onStopFetch());
      const mockStreamService = {
        stopSSEStream: () => {
          throw error;
        },
        isFetchingRecords: {
          next: vi.fn(),
        },
      };
      const effect$ = stopRecordsSSEStream$(actions$, mockStreamService as any);
      effect$.subscribe((result) => {
        expect(mockStreamService.isFetchingRecords.next).toHaveBeenCalledWith(
          false
        );
        expect(result).toEqual(StreamActions.onStopFetchFailure({ error }));
      });
    });
  });

  describe("startConsumerThreadPool$", () => {
    it("should dispatch onStartConsumerThreadPoolLaunchSuccess on success", async () => {
      vi.spyOn(streamService, "startConsumerThreadPool").mockReturnValue(
        of(undefined)
      );
      actions$ = of(
        StreamActions.onStartConsumerThreadPoolLaunch({
          params: { mockKey: "mock-value" },
        })
      );
      startConsumerThreadPool$(actions$, streamService).subscribe((result) => {
        expect(result).toEqual(
          StreamActions.onStartConsumerThreadPoolLaunchSuccess()
        );
        expect(streamService.startConsumerThreadPool).toHaveBeenCalledWith({
          mockKey: "mock-value",
        });
      });
    });

    it("should dispatch onStartConsumerThreadPoolLaunchFailure on error", async () => {
      const mockError = new HttpErrorResponse({
        error: "mock-error",
        status: 500,
      });
      vi.spyOn(streamService, "startConsumerThreadPool").mockReturnValue(
        throwError(() => mockError)
      );
      actions$ = of(
        StreamActions.onStartConsumerThreadPoolLaunch({
          params: { mockKey: "mock-value" },
        })
      );
      startConsumerThreadPool$(actions$, streamService).subscribe((result) => {
        expect(result).toEqual(
          StreamActions.onStartConsumerThreadPoolLaunchFailure({
            error: mockError,
          })
        );
      });
    });
  });

  describe("stopConsumerThreadPool$", () => {
    it("should dispatch onStopConsumerThreadPoolLaunchSuccess on success", async () => {
      vi.spyOn(streamService, "stopConsumerThreadPool").mockReturnValue(
        of(undefined)
      );
      actions$ = of(
        StreamActions.onStopConsumerThreadPoolLaunch({
          params: { mockKey: "mock-value" },
        })
      );
      stopConsumerThreadPool$(actions$, streamService).subscribe((result) => {
        expect(result).toEqual(
          StreamActions.onStopConsumerThreadPoolLaunchSuccess()
        );
        expect(streamService.stopConsumerThreadPool).toHaveBeenCalledWith({
          mockKey: "mock-value",
        });
      });
    });

    it("should dispatch onStopConsumerThreadPoolLaunchFailure on error", async () => {
      const mockError = new HttpErrorResponse({
        error: "mock-error",
        status: 500,
      });
      vi.spyOn(streamService, "stopConsumerThreadPool").mockReturnValue(
        throwError(() => mockError)
      );
      actions$ = of(
        StreamActions.onStopConsumerThreadPoolLaunch({
          params: { mockKey: "mock-value" },
        })
      );
      stopConsumerThreadPool$(actions$, streamService).subscribe((result) => {
        expect(result).toEqual(
          StreamActions.onStopConsumerThreadPoolLaunchFailure({
            error: mockError,
          })
        );
      });
    });
  });
});
