import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BehaviorSubject, Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import { StreamService } from "../services/stream.service";
import * as StreamActions from "../store/actions";
import { loadFetchStreamsEffect, loadFetchConsumersEffect, triggerRecordsSSEStream$, stopRecordsSSEStream$ } from "./effects";

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
  });
});
