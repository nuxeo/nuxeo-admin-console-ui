import { CustomSnackBarComponent } from "./../../../../../../shared/components/custom-snack-bar/custom-snack-bar.component";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatIconModule } from "@angular/material/icon";
import { BULK_ACTION_LABELS } from "./../../../../bulk-action-monitoring.constants";
import { BulkActionInfoSummary } from "./../../../../bulk-action-monitoring.interface";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BulkActionMonitoringSummaryComponent } from "./bulk-action-monitoring-summary.component";
import { StoreModule } from "@ngrx/store";
import * as BulkActionMonitoringActions from "../../../../store/actions";
import * as fromReducer from "../../../../store/reducers";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

describe("BulkActionMonitoringSummaryComponent", () => {
  let component: BulkActionMonitoringSummaryComponent;
  let fixture: ComponentFixture<BulkActionMonitoringSummaryComponent>;
  let store: MockStore<fromReducer.BulkActionMonitoringState>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  const snackBarSpy = jasmine.createSpyObj("MatSnackBar", [
    "openFromComponent",
  ]);
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
    await TestBed.configureTestingModule({
      declarations: [BulkActionMonitoringSummaryComponent],
      providers: [
        provideMockStore({ initialState }),
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
      imports: [
        MatSnackBarModule,
        MatIconModule,
        MatTooltipModule,
        NoopAnimationsModule,
        StoreModule.forRoot(provideMockStore),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BulkActionMonitoringSummaryComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
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
    expect(snackBar.openFromComponent).toHaveBeenCalledWith(
      CustomSnackBarComponent,
      {
        data: {
          message: BULK_ACTION_LABELS.INFORMATION_UPDATED,
          panelClass: "success-snack",
        },
        duration: 5000,
        panelClass: ["success-snack"],
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
