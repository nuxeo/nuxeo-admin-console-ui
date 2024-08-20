import { MatTooltipModule } from "@angular/material/tooltip";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BulkActionMonitoringSummaryComponent } from "./bulk-action-monitoring-summary.component";
import { StoreModule } from "@ngrx/store";
import { HyMaterialModule, HyToastService } from "@hyland/ui";
import { BULK_ACTION_LABELS } from "../../../bulk-action-monitoring.constants";
import * as BulkActionMonitoringActions from "../../../store/actions";
import * as fromReducer from "../../../store/reducers";
import { BulkActionInfoSummary } from "../../../bulk-action-monitoring.interface";
import { MockStore, provideMockStore } from "@ngrx/store/testing";

describe("BulkActionMonitoringSummaryComponent", () => {
  let component: BulkActionMonitoringSummaryComponent;
  let fixture: ComponentFixture<BulkActionMonitoringSummaryComponent>;
  let toastService: jasmine.SpyObj<HyToastService>;
  let store: MockStore<fromReducer.BulkActionMonitoringState>;
  const initialState = {
    bulkActionMonitoringInfo: {
      "entity-type": null,
      commandId: null,
      state: null,
      processed: -1,
      skipCount: -1,
      error: false,
      errorCount: -1,
      total: -1,
      action: null,
      username: null,
      submitted: null,
      scrollStart: null,
      scrollEnd: null,
      processingStart: null,
      processingEnd: null,
      completed: null,
      processingMillis: -1,
    },
    error: null,
  };

  beforeEach(async () => {
    const toastServiceSpy = jasmine.createSpyObj("HyToastService", ["success"]);
    await TestBed.configureTestingModule({
      declarations: [BulkActionMonitoringSummaryComponent],
      providers: [
        { provide: HyToastService, useValue: toastServiceSpy },
        provideMockStore({ initialState }),
      ],
      imports: [
        HyMaterialModule,
        StoreModule.forRoot(provideMockStore),
        MatTooltipModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BulkActionMonitoringSummaryComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(
      HyToastService
    ) as jasmine.SpyObj<HyToastService>;
    store = TestBed.inject(MockStore);

    fixture.detectChanges(); 
  });

  it("should load the component properly", () => {
    expect(component).toBeTruthy();
  });

  it("should replace placeholder values in statusText and nonRunningText on ngOnChanges", () => {
    component.bulkActionSummary = {
      commandId: "12345",
      username: "testUser",
      state: "SCHEDULED",
      errorCount: 2,
      processed: 10,
      total: 50,
    } as BulkActionInfoSummary;

    component.ngOnChanges();

    expect(component.statusText).toContain("12345");
    expect(component.statusText).toContain("testUser");
    expect(component.nonRunningText).toContain(
      BULK_ACTION_LABELS.STATUS_INFO_TEXT.SCHEDULED.label
    );
    expect(component.nonRunningText).toContain("2");
  });

  it('should add "s" to error label in nonRunningText if errorCount > 1', () => {
    component.bulkActionSummary = {
      state: "SCHEDULED",
      errorCount: 2,
    } as BulkActionInfoSummary;

    component.replacePlaceholderValues();

    expect(component.nonRunningText).toContain(BULK_ACTION_LABELS.ERROR + "s");
  });

  it("should correctly get running status text", () => {
    component.bulkActionSummary = {
      state: "RUNNING",
      processed: 5,
      total: 10,
      errorCount: 1,
    } as BulkActionInfoSummary;

    const result = component.getRunningStatusText();

    expect(result).toContain(BULK_ACTION_LABELS.STATUS_INFO_TEXT.RUNNING.label);
    expect(result).toContain("5");
    expect(result).toContain("10");
    expect(result).toContain("1 " + BULK_ACTION_LABELS.ERROR);
  });

  it("should pluralize error and document labels if count is greater than 1 in getRunningStatusText", () => {
    component.bulkActionSummary = {
      state: "RUNNING",
      processed: 10,
      total: 20,
      errorCount: 2,
    } as BulkActionInfoSummary;

    const result = component.getRunningStatusText();

    expect(result).toContain(BULK_ACTION_LABELS.ERROR + "s");
    expect(result).toContain(BULK_ACTION_LABELS.DOCUMENT + "s");
  });

  it("should dispatch the correct action on onRefresh", () => {
    component.bulkActionSummary = {
      commandId: "12345",
    } as BulkActionInfoSummary;
    spyOn(store, "dispatch");
    component.onRefresh();
    expect(toastService.success).toHaveBeenCalledWith(
      BULK_ACTION_LABELS.INFORMATION_UPDATED,
      {
        canBeDismissed: true,
      }
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      BulkActionMonitoringActions.performBulkActionMonitor({ id: "12345" })
    );
  });

  it("should return the correct tooltip text based on state", () => {
    component.bulkActionSummary = {
      state: "COMPLETED",
    } as BulkActionInfoSummary;
    const result = component.getTooltipText();
    expect(result).toBe(BULK_ACTION_LABELS.STATUS_INFO_TEXT.COMPLETED.tooltip);
  });
});
