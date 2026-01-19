import { initializeTestBed } from "src/test-helpers"; //This import must be the first import in the file.
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type MockedObject,
  vi,
} from "vitest";
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Store, StoreModule } from "@ngrx/store";
import { BehaviorSubject, Subject } from "rxjs";
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
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from "@angular/platform-browser/animations";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { StreamRecordsStatusComponent } from "./stream-records-status/stream-records-status.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { STREAM_LABELS, MAIN_TAB_LABELS } from "../stream.constants";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
describe("StreamComponent", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

  let component: StreamComponent;
  let fixture: ComponentFixture<StreamComponent>;
  let store: Store<{
    streams: StreamsState;
  }>;
  let streamService: MockedObject<StreamService>;
  let cdRef: MockedObject<ChangeDetectorRef>;
  let snackBar: MockedObject<MatSnackBar>;
  let activatedRoute: MockedObject<ActivatedRoute>;
  let router: MockedObject<Router>;

  class streamServiceStub {
    isFetchingRecords: BehaviorSubject<boolean> = new BehaviorSubject(false);
    isClearRecordsDisabled: BehaviorSubject<boolean> = new BehaviorSubject(
      false
    );
    isStopFetchDisabled: BehaviorSubject<boolean> = new BehaviorSubject(false);
    isViewRecordsDisabled: BehaviorSubject<boolean> = new BehaviorSubject(
      false
    );
    clearRecordsDisplay: BehaviorSubject<boolean> = new BehaviorSubject(false);
  }

  beforeEach(async () => {
    snackBar = {
      openFromComponent: vi.fn().mockName("MatSnackBar.openFromComponent"),
    } as MockedObject<MatSnackBar>;
    activatedRoute = {
      snapshot: vi.fn().mockName("ActivatedRoute.snapshot"),
    } as unknown as MockedObject<ActivatedRoute>;
    router = {
      navigate: vi.fn().mockName("Router.navigate"),
    } as MockedObject<Router>;

    await TestBed.configureTestingModule({
      declarations: [
        StreamComponent,
        StreamFormComponent,
        StreamRecordsComponent,
        StreamRecordsStatusComponent,
      ],
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
        MatDialogModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: StreamService, useClass: streamServiceStub },
        { provide: ChangeDetectorRef, useValue: cdRef },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: ActivatedRoute, useValue: activatedRoute },
        {
          provide: Router,
          useValue: {
            url: "/consumer",
            events: new Subject<NavigationEnd>(),
            navigate: vi.fn(),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(Store);
    streamService = TestBed.inject(
      StreamService
    ) as MockedObject<StreamService>;
    cdRef = TestBed.inject(
      ChangeDetectorRef
    ) as MockedObject<ChangeDetectorRef>;
    fixture = TestBed.createComponent(StreamComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    const dialog = TestBed.inject(MatDialog);
    dialog.closeAll();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should update records when new data is fetched", () => {
    const mockRecords = [{ type: "record" }, { type: "record" }];
    store.dispatch(
      StreamActions.onFetchRecordsLaunch({ recordsData: mockRecords })
    );
    fixture.detectChanges();
    expect(component.records).toEqual(mockRecords);
    expect(component.recordCount).toBe(2);
  });

  it("should log error if fetch records fails", () => {
    const consoleSpy = vi.spyOn(console, "error");
    const error = { message: "Error" } as HttpErrorResponse;
    store.dispatch(StreamActions.onFetchRecordsFailure({ error }));
    fixture.detectChanges();
    expect(consoleSpy).toHaveBeenCalledWith(error);
  });

  it("should return correct record count", () => {
    component.records = [
      { type: "record" },
      { type: "record" },
      { type: "other" },
    ];
    const count = component.getRecordCount();
    expect(count).toBe(2);
  });

  it("should not display records if fetching is in progress", () => {
    streamService.isFetchingRecords.next(true);
    fixture.detectChanges();
    expect(component.isFetchingRecords).toBe(true);
  });

  it("should update the isFetchingRecords status from the service", () => {
    streamService.isFetchingRecords = new BehaviorSubject<boolean>(false);
    fixture.detectChanges();
    expect(component.isFetchingRecords).toBe(false);
  });

  it("should subscribe to records success and update records when data is fetched", () => {
    const mockRecords = [{ type: "record" }, { type: "record" }];
    store.dispatch(
      StreamActions.onFetchRecordsLaunch({ recordsData: mockRecords })
    );
    fixture.detectChanges();
    expect(component.records).toEqual(mockRecords);
    expect(component.recordCount).toBe(2);
  });

  it("should update isFetchingRecords from service", () => {
    streamService.isFetchingRecords.next(true);
    fixture.detectChanges();
    expect(component.isFetchingRecords).toBe(true);
  });

  it("should update clearRecordsDisplay based on service", () => {
    streamService.clearRecordsDisplay.next(true);
    fixture.detectChanges();
    expect(component.clearRecordsDisplay).toBe(true);
  });

  it("should correctly count only 'record' types", () => {
    component.records = [
      { type: "record" },
      { type: "record" },
      { type: "other" },
    ];
    expect(component.getRecordCount()).toBe(2);
  });

  describe("ngOnDestroy", () => {
    beforeEach(() => {
      vi.spyOn(store, "dispatch");
      vi.spyOn(streamService.isStopFetchDisabled, "next");
      vi.spyOn(streamService.isViewRecordsDisabled, "next");
      vi.spyOn(streamService.isClearRecordsDisabled, "next");
      vi.spyOn((component as any).destroy$, "next");
      vi.spyOn((component as any).destroy$, "complete");
    });

    it("should dispatch reset actions and update service flags", () => {
      component.ngOnDestroy();
      expect(store.dispatch).toHaveBeenCalledWith(
        StreamActions.resetStopFetchState()
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        StreamActions.resetFetchStreamsState()
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        StreamActions.resetFetchConsumersState()
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        StreamActions.resetFetchRecordsState()
      );
      expect(streamService.isStopFetchDisabled.next).toHaveBeenCalledWith(true);
      expect(streamService.isViewRecordsDisabled.next).toHaveBeenCalledWith(
        false
      );
      expect(streamService.isClearRecordsDisabled.next).toHaveBeenCalledWith(
        true
      );
      expect((component as any).destroy$.next).toHaveBeenCalled();
      expect((component as any).destroy$.complete).toHaveBeenCalled();
    });

    it("should complete destroy$ subject", () => {
      component.ngOnDestroy();
      expect((component as any).destroy$.isStopped).toBe(true);
    });

    it("should unsubscribe from all subscriptions", async () => {
      let unsubscribed = false;
      (component as any).destroy$.subscribe({
        complete: () => {
          unsubscribed = true;
        },
      });
      component.ngOnDestroy();
      expect(unsubscribed).toBe(true);
    });
  });

  describe("ngOnInit", () => {
    beforeEach(() => {
      component.records = [];
      component.recordCount = 0;
      component.isFetchingRecords = false;
      component.clearRecordsDisplay = false;
      component.recordsFetchedStatusText = "";
      component.isStopFetchSuccess = null;
      vi.spyOn(streamService.isClearRecordsDisabled, "next");
      vi.spyOn(streamService.isStopFetchDisabled, "next");
      vi.spyOn(streamService.isViewRecordsDisabled, "next");
      fixture.detectChanges();
    });

    it("should update active tab based on the current router URL", () => {
      vi.spyOn(component, "updateActiveTab");
      component.ngOnInit();
      expect(component.updateActiveTab).toHaveBeenCalledWith(
        (component as any).router.url
      );
    });

    it("should update active tab on navigation end", () => {
      vi.spyOn(component, "updateActiveTab");
      const mockEvent = new NavigationEnd(
        1,
        "stream-management/consumer",
        "/consumer"
      );
      component.ngOnInit();
      (component["router"].events as Subject<any>).next(mockEvent);
      expect(component.updateActiveTab).toHaveBeenCalledWith("/consumer");
    });

    it("should update isFetchingRecords and related flags when isFetchingRecords emits true", () => {
      const cdSpy = vi.spyOn(component["cdRef"], "detectChanges");
      streamService.isFetchingRecords.next(true);
      component.ngOnInit();
      streamService.isFetchingRecords.next(true);
      expect(component.isFetchingRecords).toBe(true);
      expect(streamService.isViewRecordsDisabled.value).toBe(true);
      expect(streamService.isStopFetchDisabled.value).toBe(false);
      expect(component.recordsFetchedStatusText).toBeDefined();
      expect(cdSpy).toHaveBeenCalled();
    });

    it("should set clearRecordsDisplay to true if records is empty when clearRecordsDisplay emits", () => {
      component.records = [];
      component.ngOnInit();
      expect(component.clearRecordsDisplay).toBe(true);
    });

    it("should set clearRecordsDisplay to the emitted value if records exist", () => {
      component.records = [{ type: "record" }];
      fixture.detectChanges();
      component.ngOnInit();
      streamService.clearRecordsDisplay.next(false);
      fixture.detectChanges();
      expect(component.clearRecordsDisplay).toBe(true);
      streamService.clearRecordsDisplay.next(true);
      fixture.detectChanges();
      expect(component.clearRecordsDisplay).toBe(true);
    });

    it("should update records and recordCount when fetchRecordsSuccess$ emits", () => {
      const cdSpy = vi.spyOn(component["cdRef"], "detectChanges");
      const mockRecords = [{ type: "record" }, { type: "other" }];
      component.ngOnInit();
      store.dispatch(
        StreamActions.onFetchRecordsLaunch({ recordsData: mockRecords })
      );
      fixture.detectChanges();
      expect(component.records).toEqual(mockRecords);
      expect(component.recordCount).toBe(1);
      expect(component.recordsFetchedStatusText).toContain("record");
      expect(cdSpy).toHaveBeenCalled();
    });

    it("should handle fetchRecordsError$ and update service flags", () => {
      const error = { message: "Error" } as HttpErrorResponse;
      const consoleSpy = vi.spyOn(console, "error");
      component.ngOnInit();
      store.dispatch(StreamActions.onFetchRecordsFailure({ error }));
      fixture.detectChanges();
      expect(consoleSpy).toHaveBeenCalledWith(error);
      expect(streamService.isViewRecordsDisabled.value).toBe(false);
      expect(streamService.isClearRecordsDisabled.value).toBe(false);
      expect(streamService.isStopFetchDisabled.value).toBe(true);
    });

    it("should handle stopFetchError$ and set isStopFetchSuccess to false and log error", () => {
      const error = false as unknown as HttpErrorResponse;
      const consoleSpy = vi.spyOn(console, "error");
      component.ngOnInit();
      store.dispatch(StreamActions.onStopFetchFailure({ error }));
      fixture.detectChanges();
      expect(component.isStopFetchSuccess).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(error);
    });

    it("should handle stopFetchSuccess$ and update flags, show snackbar, and dispatch reset", () => {
      const dispatchSpy = vi.spyOn(store, "dispatch");
      component.ngOnInit();
      store.dispatch(StreamActions.onStopFetchLaunch());
      fixture.detectChanges();
      expect(component.isStopFetchSuccess).toBe(false);
      expect(snackBar.openFromComponent).toHaveBeenCalled();
      expect(streamService.isStopFetchDisabled.value).toBe(true);
      expect(streamService.isViewRecordsDisabled.value).toBe(false);
      expect(dispatchSpy).toHaveBeenCalledWith(
        StreamActions.resetStopFetchState()
      );
    });

    it("should set isFetchingRecords, update status text, and call detectChanges when fetching starts", () => {
      streamService.isFetchingRecords.next(true);
      component.ngOnInit();
      expect(component.isFetchingRecords).toBe(true);
      expect(streamService.isViewRecordsDisabled.next).toHaveBeenCalledWith(
        true
      );
      expect(streamService.isStopFetchDisabled.next).toHaveBeenCalledWith(
        false
      );
      expect(component.recordsFetchedStatusText).toBe(
        STREAM_LABELS.FETCHING_RECORDS
      );
    });
  });

  describe("onTabChange", () => {
    it("should navigate to the stream route when active tab is stream", () => {
      component.onTabChange(MAIN_TAB_LABELS.STREAM.ID);
      expect(component["router"].navigate).toHaveBeenCalledWith(["./"], {
        relativeTo: component["route"],
      });
    });

    it("should navigate to the consumer route when active tab is consumer", () => {
      component.onTabChange(MAIN_TAB_LABELS.CONSUMER.ID);
      expect(component["router"].navigate).toHaveBeenCalledWith(
        [MAIN_TAB_LABELS.CONSUMER.LABEL],
        { relativeTo: component["route"] }
      );
    });

    it("should navigate to the consumer position route when active tab is change consumer position", () => {
      component.onTabChange(MAIN_TAB_LABELS.CONSUMER_POSITION.ID);
      expect(component["router"].navigate).toHaveBeenCalledWith(
        [MAIN_TAB_LABELS.CONSUMER_POSITION.LABEL],
        { relativeTo: component["route"] }
      );
    });

    it("should navigate to the get scaling analysis route when active tab is get scaling analysis", () => {
      component.onTabChange(MAIN_TAB_LABELS.GET_SCALING_ANALYSIS.ID);
      expect(component["router"].navigate).toHaveBeenCalledWith(
        [MAIN_TAB_LABELS.GET_SCALING_ANALYSIS.ROUTE_LABEL],
        { relativeTo: component["route"] }
      );
    });

    it("should navigate to the get nuxeo stream info route when active tab is get nuxeo stream info", () => {
      component.onTabChange(MAIN_TAB_LABELS.GET_STREAM_PROCESSOR_INFO.ID);
      expect(component["router"].navigate).toHaveBeenCalledWith(
        [MAIN_TAB_LABELS.GET_STREAM_PROCESSOR_INFO.ROUTE_LABEL],
        { relativeTo: component["route"] }
      );
    });

    it("should not navigate if the tab ID does not match any known IDs", () => {
      const unknownTabId = 5;
      component.onTabChange(unknownTabId);
      expect(component["router"].navigate).not.toHaveBeenCalled();
    });
  });

  describe("updateActiveTab", () => {
    it("should set selectedTabIndex to MAIN_TAB_LABELS.CONSUMER.ID when URL ends with consumer label", () => {
      const consumerUrl = "/stream-management/consumer";
      component.updateActiveTab(consumerUrl);
      expect(component.selectedTabIndex).toBe(MAIN_TAB_LABELS.CONSUMER.ID);
    });

    it("should set selectedTabIndex to MAIN_TAB_LABELS.CHANGE_CONSUMER.ID when URL ends with change-consumer-position", () => {
      const streamUrl = "/stream-management/change-consumer-position";
      component.updateActiveTab(streamUrl);
      expect(component.selectedTabIndex).toBe(
        MAIN_TAB_LABELS.CONSUMER_POSITION.ID
      );
    });

    it("should set selectedTabIndex to MAIN_TAB_LABELS.CHANGE_CONSUMER.ID when URL ends with change-consumer-position", () => {
      const streamUrl = "/stream-management/get-consumer-position";
      component.updateActiveTab(streamUrl);
      expect(component.selectedTabIndex).toBe(
        MAIN_TAB_LABELS.CONSUMER_POSITION.ID
      );
    });

    it("should set selectedTabIndex to MAIN_TAB_LABELS.STREAM.ID when URL does not end with consumer label", () => {
      const streamUrl = "/stream-management/stream";
      component.updateActiveTab(streamUrl);
      expect(component.selectedTabIndex).toBe(MAIN_TAB_LABELS.STREAM.ID);
    });

    it("should set selectedTabIndex to MAIN_TAB_LABELS.GET_SCALING_ANALYSIS.ID when URL ends with get-scaling-analysis", () => {
      const streamUrl = "/stream-management/get-scaling-analysis";
      component.updateActiveTab(streamUrl);
      expect(component.selectedTabIndex).toBe(
        MAIN_TAB_LABELS.GET_SCALING_ANALYSIS.ID
      );
    });

    it("should set selectedTabIndex to MAIN_TAB_LABELS.STREAM.ID for an empty URL", () => {
      const emptyUrl = "";
      component.updateActiveTab(emptyUrl);
      expect(component.selectedTabIndex).toBe(MAIN_TAB_LABELS.STREAM.ID);
    });

    it("should handle URLs with trailing slashes correctly", () => {
      const consumerUrlWithSlash = "stream-management/consumer";
      component.updateActiveTab(consumerUrlWithSlash);
      expect(component.selectedTabIndex).toBe(MAIN_TAB_LABELS.CONSUMER.ID);

      const streamUrlWithSlash = "/stream-management/stream/";
      component.updateActiveTab(streamUrlWithSlash);
      expect(component.selectedTabIndex).toBe(MAIN_TAB_LABELS.STREAM.ID);
    });

    it("should set selectedTabIndex to MAIN_TAB_LABELS.GET_STREAM_PROCESSOR_INFO.ID when URL ends with nuxeo-stream-processor-info", () => {
      const streamUrl = "/stream-management/nuxeo-stream-processor-info";
      component.updateActiveTab(streamUrl);
      expect(component.selectedTabIndex).toBe(
        MAIN_TAB_LABELS.GET_STREAM_PROCESSOR_INFO.ID
      );
    });
  });
});
