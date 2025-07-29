import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { Action } from "@ngrx/store";
import { StreamService } from "../services/stream.service";
import * as StreamActions from "../store/actions";
import { loadFetchStreamsEffect, loadFetchConsumersEffect, triggerRecordsSSEStream$, stopRecordsSSEStream$, startConsumerThreadPool$, stopConsumerThreadPool$ } from "./effects";
import { HttpErrorResponse } from "@angular/common/http";

describe("StreamEffects", () => {
  let actions$: Observable<Action>;
  let loadFetchStreams: typeof loadFetchStreamsEffect;
  let loadFetchConsumers: typeof loadFetchConsumersEffect;
  let triggerRecordsSSEStream: typeof triggerRecordsSSEStream$;
  let stopRecordsSSEStream: typeof stopRecordsSSEStream$;
  let streamService: jasmine.SpyObj<StreamService>;

  beforeEach(() => {
    class streamServiceStub {
        isFetchingRecords: BehaviorSubject<boolean> = new BehaviorSubject(false);
        getStreams() {
          return of(null)
        }
        getConsumers() {
          return of(null)
        }
        startSSEStream() {
          return of(null)
        }
        stopSSEStream() {
          return of(null)
        }
        startConsumerThreadPool(){
          return of(null)
        }
        stopConsumerThreadPool(){
          return of(null)
        }
      }

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: StreamService, useClass: streamServiceStub },
      ],
    });
    streamService = TestBed.inject(StreamService) as jasmine.SpyObj<StreamService>;
    loadFetchStreams = TestBed.runInInjectionContext(() => loadFetchStreamsEffect);
    loadFetchConsumers = TestBed.runInInjectionContext(() => loadFetchConsumersEffect);
    triggerRecordsSSEStream = TestBed.runInInjectionContext(() => triggerRecordsSSEStream$);
    stopRecordsSSEStream = TestBed.runInInjectionContext(() => stopRecordsSSEStream$);
  });

  describe("loadFetchStreamsEffect", () => {
    it("should return onFetchStreamsLaunch on success", (done) => {
      const streamsData = [{ name: "stream1" }, { name: "stream2" }];
      const action = StreamActions.fetchStreams();
      spyOn(streamService, "getStreams").and.returnValue(of(streamsData));
      const outcome = StreamActions.onFetchStreamsLaunch({ streamsData });
      actions$ = of(action);
      loadFetchStreams(actions$, streamService).subscribe((result: Action) => {
        expect(result).toEqual(outcome);
        done();
      });
    });
  });

  describe("loadFetchConsumersEffect", () => {
    it("should return onFetchConsumersLaunch on success", (done) => {
      const consumersData = [{ stream: "stream1", consumer: "consumer1" }];
      const action = StreamActions.fetchConsumers({ params: { stream: "stream1" } });
      spyOn(streamService, "getConsumers").and.returnValue(of(consumersData));
      const outcome = StreamActions.onFetchConsumersLaunch({ consumersData });
      actions$ = of(action);
      loadFetchConsumers(actions$, streamService).subscribe((result: Action) => {
        expect(result).toEqual(outcome);
        done();
      });
    });
  });

  describe("triggerRecordsSSEStream$", () => {
    it("should return onFetchRecordsLaunch on success", (done) => {
      const recordsData = [{ record: "record1" }];
      const params = { stream: 'bulk/none', rewind: '0', limit: '2', timeout: '1ms' };
      const action = StreamActions.triggerRecordsSSEStream({ params });
      spyOn(streamService, "startSSEStream").and.returnValue(of(JSON.stringify({ record: "record1" })));
      const outcome = StreamActions.onFetchRecordsLaunch({ recordsData });
      actions$ = of(action);
      triggerRecordsSSEStream(actions$, streamService).subscribe((result: Action) => {
        expect(result).toEqual(outcome);
        done();
      });
    });
  });

  describe("stopRecordsSSEStream$", () => {
    it("should return onStopFetchLaunch on success", (done) => {
      const action = StreamActions.onStopFetch();
      spyOn(streamService, "stopSSEStream").and.returnValue(of(undefined));
      const outcome = StreamActions.onStopFetchLaunch();
      actions$ = of(action);
      stopRecordsSSEStream(actions$, streamService).subscribe((result: Action) => {
        expect(result).toEqual(outcome);
        done();
      });
    });

    it("should dispatch onStopFetchFailure when an error occurs", (done) => {
      const error = new Error("Mock Error");
      const actions$ = of(StreamActions.onStopFetch());
      const mockStreamService = {
        stopSSEStream: () => {
          throw error;
        },
        isFetchingRecords: {
          next: jasmine.createSpy(),
        },
      };
      const effect$ = stopRecordsSSEStream$(actions$, mockStreamService as any);
      effect$.subscribe((result) => {
        expect(mockStreamService.isFetchingRecords.next).toHaveBeenCalledWith(
          false
        );
        expect(result).toEqual(StreamActions.onStopFetchFailure({ error }));
        done();
      });
    });
  });

  describe("startConsumerThreadPool$", () => {
    it("should dispatch onStartConsumerThreadPoolLaunchSuccess on success", (done) => {
      spyOn(streamService, "startConsumerThreadPool").and.returnValue(
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
        done();
      });
    });

    it("should dispatch onStartConsumerThreadPoolLaunchFailure on error", (done) => {
      const mockError = new HttpErrorResponse({
        error: "mock-error",
        status: 500,
      });
      spyOn(streamService, "startConsumerThreadPool").and.returnValue(
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
        done();
      });
    });
  });

  describe("stopConsumerThreadPool$", () => {
    it("should dispatch onStopConsumerThreadPoolLaunchSuccess on success", (done) => {
      spyOn(streamService, "stopConsumerThreadPool").and.returnValue(
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
        done();
      });
    });

    it("should dispatch onStopConsumerThreadPoolLaunchFailure on error", (done) => {
      const mockError = new HttpErrorResponse({
        error: "mock-error",
        status: 500,
      });
      spyOn(streamService, "stopConsumerThreadPool").and.returnValue(
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
        done();
      });
    });
  });
});
