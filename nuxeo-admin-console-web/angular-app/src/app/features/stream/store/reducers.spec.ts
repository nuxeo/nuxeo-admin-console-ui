import {
  streamsReducer,
  initialStreamsState,
  consumerThreadPoolReducer,
  ConsumerThreadPoolState,
  initialConsumerThreadPoolState,
} from "./reducers";
import * as StreamActions from './actions';
import { HttpErrorResponse } from '@angular/common/http';
import { Stream } from '../stream.interface';

describe('streamsReducer', () => {
  describe('fetchStreams', () => {
    it('should return the initial state', () => {
      const result = streamsReducer(undefined, { type: "" });
      expect(result).toEqual(initialStreamsState);
    });

    it('should handle fetchStreams', () => {
      const action = StreamActions.fetchStreams();
      const result = streamsReducer(initialStreamsState, action);
      expect(result.streamsError).toBeNull();
    });

    it('should handle onFetchStreamsLaunch', () => {
      const streamsData: Stream[] = [{ name: 'Stream 1' }, { name: 'Stream 2' }];
      const action = StreamActions.onFetchStreamsLaunch({ streamsData });
      const result = streamsReducer(initialStreamsState, action);
      expect(result.streams).toEqual(streamsData);
    });

    it('should handle onFetchStreamsFailure', () => {
      const error = new HttpErrorResponse({ error: 'Failed to fetch streams' });
      const action = StreamActions.onFetchStreamsFailure({ error });
      const result = streamsReducer(initialStreamsState, action);
      expect(result.streamsError).toEqual(error);
    });

    it('should handle resetFetchStreamsState', () => {
      const state = {
        streams: [{ name: 'Stream 1' }],
        consumers: [],
        records: [],
        recordsError: null,
        consumersError: null,
        streamsError: new HttpErrorResponse({ error: 'Some error' }),
        isFetchStopped: false,
        isFetchStoppedError: null,
        streamDataLoaded: false,
      };
      const action = StreamActions.resetFetchStreamsState();
      const result = streamsReducer(state, action);
      expect(result.streams).toEqual(initialStreamsState.streams);
      expect(result.streamsError).toBeNull();
      expect(result.isFetchStopped).toBeFalse();   // Ensure the `isFetchStopped` is reset properly
      expect(result.isFetchStoppedError).toBeNull(); // Ensure `isFetchStoppedError` is reset properly
    });
  });

  describe('fetchConsumers', () => {
    it('should handle fetchConsumers with params', () => {
      const params = { key1: 'value1', key2: 'value2' };
      const action = StreamActions.fetchConsumers({ params });
      const result = streamsReducer(initialStreamsState, action);
      expect(result.consumersError).toBeNull();
    });

    it('should handle onFetchConsumersLaunch', () => {
      const consumersData = [{ stream: 'Stream 1', consumer: 'Consumer 1' }];
      const action = StreamActions.onFetchConsumersLaunch({ consumersData });
      const result = streamsReducer(initialStreamsState, action);
      expect(result.consumers).toEqual(consumersData);
    });

    it('should handle onFetchConsumersFailure', () => {
      const error = new HttpErrorResponse({ error: 'Failed to fetch consumers' });
      const action = StreamActions.onFetchConsumersFailure({ error });
      const result = streamsReducer(initialStreamsState, action);
      expect(result.consumersError).toEqual(error);
    });

    it('should handle resetFetchConsumersState', () => {
      const state = {
        streams: [],
        consumers: [{ stream: 'Stream 1', consumer: 'Consumer 1' }],
        records: [],
        recordsError: null,
        streamsError: null,
        consumersError: new HttpErrorResponse({ error: 'Some error' }),
        isFetchStopped: false,        // Added missing property
        isFetchStoppedError: null,
        streamDataLoaded: false,
      };
      const action = StreamActions.resetFetchConsumersState();
      const result = streamsReducer(state, action);
      expect(result.consumers).toEqual(initialStreamsState.consumers);
      expect(result.consumersError).toBeNull();
      expect(result.isFetchStopped).toBeFalse();   // Ensure the `isFetchStopped` is reset properly
      expect(result.isFetchStoppedError).toBeNull(); // Ensure `isFetchStoppedError` is reset properly
    });
  });

  describe('fetchRecords', () => {
    it('should handle triggerRecordsSSEStream with params', () => {
      const params = { stream: 'bulk/none', rewind: '0', limit: '2', timeout: '1ms' };
      const action = StreamActions.triggerRecordsSSEStream({ params });
      const result = streamsReducer(initialStreamsState, action);
      expect(result.recordsError).toBeNull();
    });

    it('should handle onFetchRecordsLaunch', () => {
      const recordsData = [{ type: 'type1' }, { type: 'type2' }];
      const action = StreamActions.onFetchRecordsLaunch({ recordsData });
      const result = streamsReducer(initialStreamsState, action);
      expect(result.records).toEqual(recordsData);
    });

    it('should handle onFetchRecordsFailure', () => {
      const error = new HttpErrorResponse({ error: 'Failed to fetch records' });
      const action = StreamActions.onFetchRecordsFailure({ error });
      const result = streamsReducer(initialStreamsState, action);
      expect(result.recordsError).toEqual(error);
    });

    it('should handle resetFetchRecordsState', () => {
      const state = {
        streams: [],
        consumers: [],
        records: [{ type: 'type1' }],
        recordsError: new HttpErrorResponse({ error: 'Some error' }),
        streamsError: null,
        consumersError: null,
        isFetchStopped: false,        // Added missing property
        isFetchStoppedError: null,
        streamDataLoaded: false,
      };
      const action = StreamActions.resetFetchRecordsState();
      const result = streamsReducer(state, action);
      expect(result.records).toEqual(initialStreamsState.records);
      expect(result.recordsError).toBeNull();
      expect(result.isFetchStopped).toBeFalse();
      expect(result.isFetchStoppedError).toBeNull();
    });
  });

   describe("ConsumerThreadPool Reducer", () => {
     it("should return the initial state", () => {
       const action = { type: "Unknown" } as any;
       const state = consumerThreadPoolReducer(undefined, action);
       expect(state).toEqual(initialConsumerThreadPoolState);
     });

     it("should handle onStartConsumerThreadPoolLaunch", () => {
       const action = StreamActions.onStartConsumerThreadPoolLaunch({
         params: { stream: "consumer" },
       });
       const expectedState: ConsumerThreadPoolState = {
         ...initialConsumerThreadPoolState,
         isStartStopConsumerPoolProcessRunning: true,
         isStartProcessCompleted: false,
         isStopProcessCompleted: false,
         isStartConsumerStoppedError: null,
       };
       const state = consumerThreadPoolReducer(
         initialConsumerThreadPoolState,
         action
       );
       expect(state).toEqual(expectedState);
     });

     it("should handle onStartConsumerThreadPoolLaunchFailure", () => {
       const error = new HttpErrorResponse({ error: "error", status: 500 });
       const action = StreamActions.onStartConsumerThreadPoolLaunchFailure({
         error,
       });
       const expectedState: ConsumerThreadPoolState = {
         ...initialConsumerThreadPoolState,
         isStartStopConsumerPoolProcessRunning: false,
         isStartProcessCompleted: false,
         isStopProcessCompleted: false,
         isStartConsumerStoppedError: error,
       };
       const state = consumerThreadPoolReducer(
         initialConsumerThreadPoolState,
         action
       );
       expect(state).toEqual(expectedState);
     });

     it("should handle onStartConsumerThreadPoolLaunchSuccess", () => {
       const action = StreamActions.onStartConsumerThreadPoolLaunchSuccess();
       const expectedState: ConsumerThreadPoolState = {
         ...initialConsumerThreadPoolState,
         isStartStopConsumerPoolProcessRunning: false,
         isStartProcessCompleted: true,
         isStopProcessCompleted: false,
         isStartConsumerStoppedError: null,
       };
       const state = consumerThreadPoolReducer(
         initialConsumerThreadPoolState,
         action
       );
       expect(state).toEqual(expectedState);
     });

     it("should handle onStopConsumerThreadPoolLaunch", () => {
       const action = StreamActions.onStopConsumerThreadPoolLaunch({
         params: { stream: "consumer" },
       });
       const expectedState: ConsumerThreadPoolState = {
         ...initialConsumerThreadPoolState,
         isStartStopConsumerPoolProcessRunning: true,
         isStartProcessCompleted: false,
         isStopProcessCompleted: false,
         isStopConsumerStoppedError: null,
       };
       const state = consumerThreadPoolReducer(
         initialConsumerThreadPoolState,
         action
       );
       expect(state).toEqual(expectedState);
     });

     it("should handle onStopConsumerThreadPoolLaunchFailure", () => {
       const error = new HttpErrorResponse({ error: "error", status: 500 });
       const action = StreamActions.onStopConsumerThreadPoolLaunchFailure({
         error,
       });
       const expectedState: ConsumerThreadPoolState = {
         ...initialConsumerThreadPoolState,
         isStartStopConsumerPoolProcessRunning: false,
         isStartProcessCompleted: false,
         isStopProcessCompleted: false,
         isStopConsumerStoppedError: error,
       };
       const state = consumerThreadPoolReducer(
         initialConsumerThreadPoolState,
         action
       );
       expect(state).toEqual(expectedState);
     });

     it("should handle onStopConsumerThreadPoolLaunchSuccess", () => {
       const action = StreamActions.onStopConsumerThreadPoolLaunchSuccess();
       const expectedState: ConsumerThreadPoolState = {
         ...initialConsumerThreadPoolState,
         isStartStopConsumerPoolProcessRunning: false,
         isStartProcessCompleted: false,
         isStopProcessCompleted: true,
         isStopConsumerStoppedError: null,
       };
       const state = consumerThreadPoolReducer(
         initialConsumerThreadPoolState,
         action
       );
       expect(state).toEqual(expectedState);
     });

     it("should handle resetConsumerThreadPoolState", () => {
       const action = StreamActions.resetConsumerThreadPoolState();
       const state = consumerThreadPoolReducer(undefined, action);
       expect(state).toEqual(initialConsumerThreadPoolState);
     });
   });

});

