import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StreamFormComponent } from './stream-form.component';
import { StoreModule, Store } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms';
import { StreamService } from '../../services/stream.service';
import { of } from 'rxjs';
import * as StreamActions from '../../store/actions';
import { StreamsState } from '../../store/reducers';
import { STREAM_LABELS } from '../../stream.constants';
import { GENERIC_LABELS } from '../../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

describe('StreamFormComponent', () => {
    let component: StreamFormComponent;
    let fixture: ComponentFixture<StreamFormComponent>;
    let store: Store<{ streams: StreamsState }>;
    let streamService: StreamService;

    beforeEach(async () => {
        const streamServiceMock = {
            getStreams: jasmine.createSpy('getStreams').and.returnValue(of([])),
            getConsumers: jasmine.createSpy('getConsumers').and.returnValue(of([])),
            getRecords: jasmine.createSpy('getRecords').and.returnValue(of([])),
            startSSEStream: jasmine.createSpy('startSSEStream').and.returnValue(of({})),
            isFetchingRecords: { next: jasmine.createSpy() }
        };

        await TestBed.configureTestingModule({
            declarations: [StreamFormComponent],
            imports: [
                ReactiveFormsModule,
                MatFormFieldModule,
                MatInputModule,
                MatButtonModule,
                MatSelectModule,
                MatRadioModule,
                StoreModule.forRoot({})
            ],
            providers: [
                { provide: StreamService, useValue: streamServiceMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(StreamFormComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(Store);
        streamService = TestBed.inject(StreamService);
        component.STREAM_LABELS = STREAM_LABELS;
        component.GENERIC_LABELS = GENERIC_LABELS;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form group with controls', () => {
        expect(component.streamForm.contains('stream')).toBeTruthy();
        expect(component.streamForm.contains('position')).toBeTruthy();
    });

    it('should dispatch fetchStreams action on ngOnInit if no streams are fetched', () => {
        spyOn(store, 'dispatch').and.callThrough();
        component.fetchStreamsSuccess$ = of([]);
        component.ngOnInit();
        expect(store.dispatch).toHaveBeenCalledWith(StreamActions.fetchStreams());
    });

    it('should dispatch fetchConsumers action when a stream is selected', () => {
        const stream = { name: 'stream1' };
        component.streams = [stream];
        component.streamForm.patchValue({ stream: 'stream1' });
        spyOn(store, 'dispatch').and.callThrough();

        component.onStreamChange('stream1');
        expect(store.dispatch).toHaveBeenCalledWith(
            StreamActions.fetchConsumers({ params: { stream: 'stream1' } })
        );
    });

    it('should update selectedConsumer on consumer option change', () => {
        const selectedValue = 'consumer1';
        component.onConsumerOptionChange(selectedValue);
        expect(component.selectedConsumer).toBe(selectedValue);
        expect(component.streamForm.get('position')?.value).toBe(selectedValue);
    });

    it('should call onStreamFormSubmit and dispatch triggerRecordsSSEStream', () => {
        const mockStream = { name: 'stream1' };
        const mockPosition = 'consumer1';
        component.streams = [mockStream];
        component.consumers = [{ stream: 'stream1', consumer: mockPosition }];
        component.streamForm.patchValue({ stream: 'stream1', position: mockPosition });

        spyOn(store, 'dispatch').and.callThrough();

        component.onStreamFormSubmit();

        expect(store.dispatch).toHaveBeenCalledWith(
            StreamActions.triggerRecordsSSEStream({
                params: {
                    stream: 'stream1',
                    fromGroup: mockPosition,
                    rewind: 0,
                    timeout: '1ms',
                    limit: 1
                }
            })
        );
        expect(streamService.isFetchingRecords.next).toHaveBeenCalledWith(true);
    });

    it('should handle fetchStreamsError correctly', () => {
        const error = { message: 'An error occurred' };
        component.fetchStreamsError$ = of(error);
        spyOn(console, 'log');

        component.ngOnInit();
        expect(console.log).toHaveBeenCalledWith(error);
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
});
