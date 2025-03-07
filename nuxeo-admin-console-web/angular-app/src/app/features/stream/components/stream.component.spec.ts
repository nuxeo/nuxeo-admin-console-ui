import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Store, StoreModule } from "@ngrx/store";
import { BehaviorSubject } from "rxjs";
import { StreamComponent } from "./stream.component";
import { StreamsState } from "../store/reducers";
import { StreamService } from "../services/stream.service";
import { streamsReducer } from "../store/reducers";
import { HttpErrorResponse } from "@angular/common/http";
import * as StreamActions from "../store/actions";
import { StreamFormComponent } from "./stream-form/stream-form.component";
import { StreamRecordsComponent } from "./stream-records/stream-records.component";
import { MatCardModule } from "@angular/material/card";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { StreamRecordsStatusComponent } from "./stream-records-status/stream-records-status.component";
import { MatSnackBar } from "@angular/material/snack-bar";

describe("StreamComponent", () => {
  let component: StreamComponent;
  let fixture: ComponentFixture<StreamComponent>;
  let store: Store<{ streams: StreamsState }>;
  let streamService: jasmine.SpyObj<StreamService>;
  let cdRef: jasmine.SpyObj<ChangeDetectorRef>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  class streamServiceStub {
    isFetchingRecords: BehaviorSubject<boolean> = new BehaviorSubject(false);
    isClearRecordsDisabled: BehaviorSubject<boolean> = new BehaviorSubject(false);
    isStopFetchDisabled: BehaviorSubject<boolean> = new BehaviorSubject(false);
    isViewRecordsDisabled: BehaviorSubject<boolean> = new BehaviorSubject(false);
    clearRecordsDisplay: BehaviorSubject<boolean> = new BehaviorSubject(false);
  }

  beforeEach(async () => {
    snackBar = jasmine.createSpyObj("MatSnackBar", ["openFromComponent"]);

    await TestBed.configureTestingModule({
      declarations: [StreamComponent, StreamFormComponent, StreamRecordsComponent, StreamRecordsStatusComponent],
      imports: [
        StoreModule.forRoot({ streams: streamsReducer }),
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatRadioModule,
        MatCardModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
      ],
      providers: [
        { provide: StreamService, useClass: streamServiceStub },
        { provide: ChangeDetectorRef, useValue: cdRef },
        { provide: MatSnackBar, useValue: snackBar },
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    streamService = TestBed.inject(StreamService) as jasmine.SpyObj<StreamService>;
    cdRef = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
    fixture = TestBed.createComponent(StreamComponent);
    component = fixture.componentInstance;
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should update records when new data is fetched", () => {
    const mockRecords = [{ type: "record" }, { type: "record" }];
    store.dispatch(StreamActions.onFetchRecordsLaunch({ recordsData: mockRecords }));
    fixture.detectChanges();
    expect(component.records).toEqual(mockRecords);
    expect(component.recordCount).toBe(2);
  });

  it("should log error if fetch records fails", () => {
    const consoleSpy = spyOn(console, "error");
    const error = { message: "Error" } as HttpErrorResponse;
    store.dispatch(StreamActions.onFetchRecordsFailure({ error }));
    fixture.detectChanges();
    expect(consoleSpy).toHaveBeenCalledWith(error);
  });

  it("should unsubscribe from all subscriptions on ngOnDestroy", () => {
    const unsubscribeSpy = jasmine.createSpy("unsubscribe");
    component.fetchRecordsSuccessSubscription.unsubscribe = unsubscribeSpy;
    component.fetchRecordsErrorSubscription.unsubscribe = unsubscribeSpy;
    component.isFetchingRecordsSubscription.unsubscribe = unsubscribeSpy;
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalledTimes(3);
  });

  it("should return correct record count", () => {
    component.records = [{ type: "record" }, { type: "record" }, { type: "other" }];
    const count = component.getRecordCount();
    expect(count).toBe(2);
  });

  it("should not display records if fetching is in progress", () => {
    streamService.isFetchingRecords.next(true);
    fixture.detectChanges();
    expect(component.isFetchingRecords).toBeTrue();
  });

  it("should update the isFetchingRecords status from the service", () => {
    streamService.isFetchingRecords = new BehaviorSubject<boolean>(false);
    fixture.detectChanges();
    expect(component.isFetchingRecords).toBeFalse();
  });

  it("should subscribe to records success and update records when data is fetched", () => {
    const mockRecords = [{ type: "record" }, { type: "record" }];
    store.dispatch(StreamActions.onFetchRecordsLaunch({ recordsData: mockRecords }));
    fixture.detectChanges();
    expect(component.records).toEqual(mockRecords);
    expect(component.recordCount).toBe(2);
  });

  it("should update isFetchingRecords from service", () => {
    streamService.isFetchingRecords.next(true);
    fixture.detectChanges();
    expect(component.isFetchingRecords).toBeTrue();
  });

  it("should update clearRecordsDisplay based on service", () => {
    streamService.clearRecordsDisplay.next(true);
    fixture.detectChanges();
    expect(component.clearRecordsDisplay).toBeTrue();
  });

  it("should correctly count only 'record' types", () => {
    component.records = [{ type: "record" }, { type: "record" }, { type: "other" }];
    expect(component.getRecordCount()).toBe(2);
  });

  it("should dispatch all actions and unsubscribe in ngOnDestroy", () => {
    const dispatchSpy = spyOn(store, "dispatch");
    const unsubscribeSpy = spyOn(component.isFetchingRecordsSubscription, "unsubscribe").and.callThrough();
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledTimes(4);
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
