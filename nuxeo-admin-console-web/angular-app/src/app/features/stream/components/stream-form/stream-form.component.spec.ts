import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StreamFormComponent } from './stream-form.component';
import { StoreModule, Store } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms';
import { StreamService } from '../../services/stream.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import * as StreamActions from '../../store/actions';
import { StreamsState } from '../../store/reducers';
import { STREAM_ERROR_MESSAGES, STREAM_LABELS } from '../../stream.constants';
import { ERROR_TYPES, GENERIC_LABELS, MODAL_DIMENSIONS } from '../../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { RecordsPayload } from '../../stream.interface';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorModalComponent } from 'src/app/features/sub-features/generic-multi-feature-layout/components/error-modal/error-modal.component';
import { ErrorDetails } from 'src/app/shared/types/common.interface';

interface StreamServiceMock {
    getStreams: jasmine.Spy;
    getConsumers: jasmine.Spy;
    getRecords: jasmine.Spy;
    startSSEStream: jasmine.Spy;
    isFetchingRecords: { next: jasmine.Spy };
    isClearRecordsDisabled: BehaviorSubject<boolean>;
    isStopFetchDisabled: BehaviorSubject<boolean>;
    isViewRecordsDisabled: BehaviorSubject<boolean>;
    clearRecordsDisplay: { next: jasmine.Spy };
    streamDisconnected$: Observable<boolean>;
}

describe('StreamFormComponent', () => {
    let component: StreamFormComponent;
    let fixture: ComponentFixture<StreamFormComponent>;
    let store: Store<{ streams: StreamsState }>;
    let streamServiceMock: StreamServiceMock;
    let storeSpy: jasmine.SpyObj<Store<{ streams: StreamsState }>>;
    const mockError = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
    });
    let streamDisconnectedSubject: BehaviorSubject<boolean>; 

    beforeEach(async () => {
        streamDisconnectedSubject = new BehaviorSubject<boolean>(false);
        streamServiceMock = {
            getStreams: jasmine.createSpy('getStreams').and.returnValue(of([])),
            getConsumers: jasmine.createSpy('getConsumers').and.returnValue(of([])),
            getRecords: jasmine.createSpy('getRecords').and.returnValue(of([])),
            startSSEStream: jasmine.createSpy('startSSEStream').and.returnValue(of({})),
            isFetchingRecords: { next: jasmine.createSpy() },
            isClearRecordsDisabled: new BehaviorSubject(false),
            isStopFetchDisabled: new BehaviorSubject(false),
            isViewRecordsDisabled: new BehaviorSubject(false),
            clearRecordsDisplay: { next: jasmine.createSpy() },
            streamDisconnected$: streamDisconnectedSubject.asObservable(),
        };
        storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'pipe']);

        storeSpy.pipe.and.returnValue(of([]));
        storeSpy.pipe.and.returnValues(
            of([]),
            of(null),
            of([]),
            of(null)
        );

        await TestBed.configureTestingModule({
            declarations: [StreamFormComponent],
            imports: [
                ReactiveFormsModule,
                MatFormFieldModule,
                MatInputModule,
                MatButtonModule,
                MatSelectModule,
                MatRadioModule,
                MatDialogModule,
                CommonModule,
                BrowserAnimationsModule,
                StoreModule.forRoot({})
            ],
            providers: [
                { provide: StreamService, useValue: streamServiceMock },
                { provide: Store, useValue: storeSpy },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(StreamFormComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(Store);
        component.STREAM_LABELS = STREAM_LABELS;
        component.GENERIC_LABELS = GENERIC_LABELS;
        component.fetchRecordsError$ = of(mockError);
        streamDisconnectedSubject.next(true); 
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form group with controls', () => {
        expect(component.streamForm.contains('stream')).toBeTruthy();
        expect(component.streamForm.contains('position')).toBeTruthy();
    });

    it('should dispatch fetchStreams action on ngOnInit if no streams are fetched', () => {
        component.fetchStreamsSuccess$ = of([]);
        component.fetchRecordsError$ = of(mockError);
        component.ngOnInit();
        expect(store.dispatch).toHaveBeenCalledWith(StreamActions.fetchStreams());
    });

    it('should dispatch fetchConsumers action when a stream is selected', () => {
        const stream = { name: 'stream1' };
        component.streams = [stream];
        component.streamForm.patchValue({ stream: 'stream1' });
        component.onStreamChange('stream1');
        expect(store.dispatch).toHaveBeenCalledWith(
            StreamActions.fetchConsumers({ params: { stream: 'stream1' } })
        );
        expect(component.isSubmitBtnDisabled).toBeFalse();
    });

    it('should update selectedConsumer on consumer option change', () => {
        const selectedValue = 'consumer1';
        component.onConsumerOptionChange(selectedValue);
        expect(component.selectedConsumer).toBe(selectedValue);
    });

    it('should call onStreamFormSubmit and dispatch triggerRecordsSSEStream', () => {
        component.isSubmitBtnDisabled = false;
        component.streamForm.patchValue({
            [STREAM_LABELS.STREAM_ID]: 'stream1',
            [STREAM_LABELS.REWIND_ID]: '0',
            [STREAM_LABELS.LIMIT_ID]: '1',
            [STREAM_LABELS.TIMEOUT_ID]: '1'
        });

        spyOn(component, 'convertTimeout').and.returnValue('1ms');
        spyOn(component, 'getPositionValue');

        component.onStreamFormSubmit();

        expect(component.isSubmitBtnDisabled).toBeTrue();
        expect(component.getPositionValue).toHaveBeenCalledWith({
            stream: 'stream1',
            rewind: '0',
            limit: '1',
            timeout: '1ms'
        });

        expect(store.dispatch).toHaveBeenCalledWith(
            StreamActions.triggerRecordsSSEStream({
                params: {
                    stream: 'stream1',
                    rewind: '0',
                    limit: '1',
                    timeout: '1ms'
                }
            })
        );
    });

    it('should unsubscribe from all subscriptions on ngOnDestroy', () => {
        const unsubscribeSpy = jasmine.createSpy('unsubscribe');
        component.fetchStreamsSuccessSubscription.unsubscribe = unsubscribeSpy;
        component.fetchStreamsErrorSubscription.unsubscribe = unsubscribeSpy;
        component.fetchConsumersSuccessSubscription.unsubscribe = unsubscribeSpy;
        component.fetchConsumersErrorSubscription.unsubscribe = unsubscribeSpy;
        component.ngOnDestroy();
        expect(unsubscribeSpy).toHaveBeenCalledTimes(4);
    });

    it('should dispatch onStopFetch action when onStopFetch is called', () => {
        component.onStopFetch();
        expect(store.dispatch).toHaveBeenCalledWith(StreamActions.onStopFetch());
    });

    it('should dispatch resetFetchRecordsState and clear records on onClearRecords', () => {
        component.onClearRecords();
        expect(store.dispatch).toHaveBeenCalledWith(StreamActions.resetFetchRecordsState());
    });

    it('should dispatch reset actions and unsubscribe from all subscriptions on ngOnDestroy', () => {
        const unsubscribeSpy = jasmine.createSpy('unsubscribe');

        component.fetchStreamsSuccessSubscription.unsubscribe = unsubscribeSpy;
        component.fetchStreamsErrorSubscription.unsubscribe = unsubscribeSpy;
        component.fetchConsumersSuccessSubscription.unsubscribe = unsubscribeSpy;
        component.fetchConsumersErrorSubscription.unsubscribe = unsubscribeSpy;
        component.isClearBtnDisabledSubscription.unsubscribe = unsubscribeSpy;
        component.isStopFetchBtnDisabledSubscription.unsubscribe = unsubscribeSpy;
        component.isViewRecordsDisabledSubscription.unsubscribe = unsubscribeSpy;
        component.ngOnDestroy();
        expect(unsubscribeSpy).toHaveBeenCalledTimes(7);
    });

    it('should subscribe to button state observables in ngOnInit', () => {
        fixture.detectChanges()
        expect(component.isClearBtnDisabled).toBeFalse();
        expect(component.isStopFetchBtnDisabled).toBeFalse();
        expect(component.isSubmitBtnDisabled).toBeFalse();
    });

    it("should initialize form with default values", () => {
        expect(component.streamForm.getRawValue()).toEqual({
          stream: "",
          position: component.STREAM_LABELS.POSITION_OPTIONS.BEGINNING.VALUE,
          rewind: '0',
          limit: '1',
          timeout: '0s',
          offset: 0, 
          partition: 0,
          selectedConsumer: "" 
        });
        expect(component.streamForm.get("offset")?.disabled).toBeTrue();
        expect(component.streamForm.get("partition")?.disabled).toBeTrue();
        expect(component.streamForm.get("selectedConsumer")?.disabled).toBeTrue();
      });
      
    it("should update selected consumer on change", () => {
        component.onConsumerOptionChange("consumer1");
        expect(component.selectedConsumer).toBe("consumer1");
    });

    it("should update stream on change and dispatch fetchConsumers", () => {
        component.onStreamChange("newStream");
        expect(component.streamForm.value.stream).toBe("newStream");
        expect(storeSpy.dispatch).toHaveBeenCalledWith(StreamActions.fetchConsumers({ params: { stream: "newStream" } }));
    });

    it("should update rewind value and form field", () => {
        component.onRewindValSelect("5");
        expect(component.selectedRewindValue).toBe("5");
        expect(component.streamForm.value.rewind).toBe("5");
    });

    it("should update limit value and form field", () => {
        component.onLimitValSelect("10");
        expect(component.selectedLimitValue).toBe("10");
        expect(component.streamForm.value.limit).toBe("10");
    });

    it("should update timeout value and form field", () => {
        component.onTimeoutValSelect("30s");
        expect(component.selectedTimeoutValue).toBe("30s");
        expect(component.streamForm.value.timeout).toBe("30s");
    });

    it("should call convertTimeout and return correct values", () => {
        expect(component.convertTimeout("1min")).toBe("60s");
        expect(component.convertTimeout("30s")).toBe("30s");
    });

    it("should determine position value correctly", () => {
        const params = {} as RecordsPayload;
        component.streamForm.patchValue({ position: component.STREAM_LABELS.POSITION_OPTIONS.TAIL.VALUE });
        component.getPositionValue(params);
        expect(params.fromTail).toBeTrue();
    });

    it("should dispatch stop fetch action", () => {
        component.onStopFetch();
        expect(storeSpy.dispatch).toHaveBeenCalledWith(StreamActions.onStopFetch());
    });

    it("should dispatch reset fetch records state and update UI on clear records", () => {
        component.onClearRecords();
        expect(storeSpy.dispatch).toHaveBeenCalledWith(StreamActions.resetFetchRecordsState());
        expect(component.isSubmitBtnDisabled).toBeFalse();
        expect(component.isClearBtnDisabled).toBeTrue();
    });

    it("should unsubscribe from subscriptions on destroy", () => {
        const unsubscribeSpy = spyOn(component.fetchStreamsSuccessSubscription, "unsubscribe");
        component.ngOnDestroy();
        expect(unsubscribeSpy).toHaveBeenCalled();
    });
   
    it("should properly initialize component values in ngOnInit", () => {
      component.ngOnInit();
      expect(component.rewindValues).toEqual(STREAM_LABELS.REWIND_VALUES);
      expect(component.selectedRewindValue).toBe(
        STREAM_LABELS.REWIND_VALUES[0]
      );
      expect(component.limitValues).toEqual(STREAM_LABELS.LIMIT_VALUES);
      expect(component.selectedLimitValue).toBe(STREAM_LABELS.LIMIT_VALUES[0]);
      expect(component.timeoutValues).toEqual(STREAM_LABELS.TIMEOUT_VALUES);
      expect(component.selectedTimeoutValue).toBe(
        STREAM_LABELS.TIMEOUT_VALUES[0]
      );
    });

    it("should enable/disable form controls based on position value changes", () => {
      component.ngOnInit();

      component.streamForm
        .get("position")
        ?.setValue(STREAM_LABELS.POSITION_OPTIONS.OFFSET.VALUE);
      expect(component.streamForm.get("offset")?.enabled).toBeTrue();
      expect(component.streamForm.get("partition")?.enabled).toBeTrue();
      expect(component.streamForm.get("selectedConsumer")?.disabled).toBeTrue();

      component.streamForm.get("position")?.setValue("consumer");
      expect(component.streamForm.get("offset")?.disabled).toBeTrue();
      expect(component.streamForm.get("partition")?.disabled).toBeTrue();
      expect(component.streamForm.get("selectedConsumer")?.enabled).toBeTrue();

      component.streamForm
        .get("position")
        ?.setValue(STREAM_LABELS.POSITION_OPTIONS.BEGINNING.VALUE);
      expect(component.streamForm.get("offset")?.disabled).toBeTrue();
      expect(component.streamForm.get("partition")?.disabled).toBeTrue();
      expect(component.streamForm.get("selectedConsumer")?.disabled).toBeTrue();
    });

    it("should handle streams data when fetchStreamsSuccess$ emits", () => {
      const mockStreams = [{ name: "stream1" }];
      storeSpy.pipe.and.returnValue(of(mockStreams));
      component.fetchStreamsSuccess$ = of(mockStreams);
      component.ngOnInit();
      expect(component.streams).toEqual(mockStreams);
      expect(component.streamForm.get("stream")?.value).toBe("stream1");
      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        StreamActions.fetchConsumers({ params: { stream: "stream1" } })
      );
    });

    it("should handle empty streams data and dispatch fetchStreams", () => {
      storeSpy.pipe.and.returnValue(of([]));
      component.fetchStreamsSuccess$ = of([]);
      component.ngOnInit();
      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        StreamActions.fetchStreams()
      );
    });

    it("should handle consumers data when fetchConsumersSuccess$ emits", () => {
      const mockConsumers = [{ stream: "stream1", consumer: "consumer1" }];
      component.fetchConsumersSuccess$ = of(mockConsumers);
      component.ngOnInit();
      expect(component.consumers).toEqual(mockConsumers);
      expect(component.selectedConsumer).toBe("consumer1");
      expect(component.streamForm.get("selectedConsumer")?.value).toBe(
        "consumer1"
      );
    });

    it("should handle stream error and show error modal", () => {
      spyOn(component, "showActionErrorModal");
      component.fetchStreamsError$ = of(mockError);
      component.ngOnInit();
      expect(component.showActionErrorModal).toHaveBeenCalledWith({
        type: ERROR_TYPES.SERVER_ERROR,
        msg: STREAM_ERROR_MESSAGES.STREAMS_ERROR_MODAL_TITLE,
        value: true,
        details: {
          status: mockError.status,
          message: mockError.message,
        },
      });
    });

    it("should open error modal dialog with correct configuration", () => {
      const mockError: ErrorDetails = {
        type: ERROR_TYPES.SERVER_ERROR,
        msg: "Test Error Message",
        value: true,

        details: {
          status: 500,
          message: "Internal Server Error",
        },
      };

      const dialogOpenSpy = spyOn(
        component.dialogService,
        "open"
      ).and.returnValue({} as any);
      component.showActionErrorModal(mockError);

      expect(dialogOpenSpy).toHaveBeenCalledWith(ErrorModalComponent, {
        disableClose: true,
        hasBackdrop: true,
        autoFocus: false,
        height: MODAL_DIMENSIONS.HEIGHT,
        width: MODAL_DIMENSIONS.WIDTH,
        data: {
          error: mockError,
        },
      });
    });

    it("should handle different position values correctly in getPositionValue", () => {
      const tailParams: RecordsPayload = {
        stream: "",
        rewind: "",
        limit: "",
        timeout: "",
      };
      component.streamForm.patchValue({
        position: STREAM_LABELS.POSITION_OPTIONS.TAIL.VALUE,
      });

      component.getPositionValue(tailParams);
      expect(tailParams.fromTail).toBeTrue();
      expect(tailParams.fromGroup).toBeUndefined();
      expect(tailParams.fromOffset).toBeUndefined();
      expect(tailParams.partition).toBeUndefined();

      const consumerParams: RecordsPayload = {
        stream: "",
        rewind: "",
        limit: "",
        timeout: "",
      };
      component.streamForm.patchValue({
        position: STREAM_LABELS.POSITION_OPTIONS.CONSUMER.VALUE,
      });
      component.selectedConsumer = "testConsumer";

      component.getPositionValue(consumerParams);
      expect(consumerParams.fromTail).toBeUndefined();
      expect(consumerParams.fromGroup).toBe("testConsumer");
      expect(consumerParams.fromOffset).toBeUndefined();
      expect(consumerParams.partition).toBeUndefined();

      const offsetParams: RecordsPayload = {
        stream: "",
        rewind: "",
        limit: "",
        timeout: "",
      };

      component.streamForm.patchValue({
        position: STREAM_LABELS.POSITION_OPTIONS.OFFSET.VALUE,
        [STREAM_LABELS.POSITION_OPTIONS.OFFSET.VALUE]: 100,
        [STREAM_LABELS.POSITION_OPTIONS.PARTITITON.VALUE]: 1,
      });

      component.getPositionValue(offsetParams);
      expect(offsetParams.fromTail).toBeUndefined();
      expect(offsetParams.fromGroup).toBeUndefined();
      expect(offsetParams.fromOffset).toBe("100");
      expect(offsetParams.partition).toBe("1");

      const defaultParams: RecordsPayload = {
        stream: "",
        rewind: "",
        limit: "",
        timeout: "",
      };
      component.streamForm.patchValue({
        position: STREAM_LABELS.POSITION_OPTIONS.BEGINNING.VALUE,
      });

      component.getPositionValue(defaultParams);
      expect(defaultParams.fromTail).toBeUndefined();
      expect(defaultParams.fromGroup).toBeUndefined();
      expect(defaultParams.fromOffset).toBeUndefined();
      expect(defaultParams.partition).toBeUndefined();
    });

    it("should NOT show error modal if event stream is disconnected", () => {
      spyOn(component, "showActionErrorModal");
      component.isEventStreamDisconnected = true;
      fixture.detectChanges();
      expect(component.showActionErrorModal).not.toHaveBeenCalled();
    });

    it("should NOT show error modal if there is no error", () => {
      spyOn(component, "showActionErrorModal");
      component.isEventStreamDisconnected = false;
      component.fetchRecordsError$ = of(null);
      fixture.detectChanges();
      expect(component.showActionErrorModal).not.toHaveBeenCalled();
    });
});

