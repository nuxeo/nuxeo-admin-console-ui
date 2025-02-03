import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StreamRecordsComponent } from './stream-records.component';
import { StreamService } from '../../services/stream.service';
import { BehaviorSubject } from 'rxjs';
import { MatCardModule } from '@angular/material/card';

describe('StreamRecordsComponent', () => {
    let component: StreamRecordsComponent;
    let fixture: ComponentFixture<StreamRecordsComponent>;
    let streamService: StreamService;

    beforeEach(async () => {
        const streamServiceMock = {
            isFetchingRecords: new BehaviorSubject(false)
        };

        await TestBed.configureTestingModule({
            declarations: [StreamRecordsComponent],
            imports: [MatCardModule],
            providers: [
                { provide: StreamService, useValue: streamServiceMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(StreamRecordsComponent);
        component = fixture.componentInstance;
        streamService = TestBed.inject(StreamService);
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize isFetchingRecords as false', () => {
        component.ngOnInit();
        expect(component.isFetchingRecords).toBeFalse();
    });

    it('should subscribe to isFetchingRecords and update isFetchingRecords', () => {
        const mockStatus = true;
        streamService.isFetchingRecords.next(mockStatus);

        component.ngOnInit();
        expect(component.isFetchingRecords).toBeTrue();
    });

    it('should unsubscribe from isFetchingRecords on ngOnDestroy', () => {
        const unsubscribeSpy = spyOn(component.isFetchingRecordsSubscription, 'unsubscribe');
        component.ngOnDestroy();
        expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it('should replace {{ recordCount }} with the correct record count in insertCount', () => {
        const label = 'Fetched {{ recordCount }} records';
        const recordCount = 10;
        component.recordCount = recordCount;
        const result = component.insertCount(label);
        expect(result).toBe('Fetched 10 records');
    });
});
