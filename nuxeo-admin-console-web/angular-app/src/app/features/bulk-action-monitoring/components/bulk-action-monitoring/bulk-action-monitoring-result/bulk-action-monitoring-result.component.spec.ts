import { BulkActionMonitoringInfo, BulkActionInfoSummary, BulkActionInfoDetails } from './../../../bulk-action-monitoring.interface';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { BulkActionMonitoringSummaryComponent } from "./bulk-action-monitoring-summary/bulk-action-monitoring-summary.component";
import { BulkActionMonitoringDetailsComponent } from "./bulk-action-monitoring-details/bulk-action-monitoring-details.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BulkActionMonitoringResultComponent } from "./bulk-action-monitoring-result.component";
import { provideMockStore } from "@ngrx/store/testing";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';

describe("BulkActionMonitoringResultComponent", () => {
  let component: BulkActionMonitoringResultComponent;
  let fixture: ComponentFixture<BulkActionMonitoringResultComponent>;
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
      declarations: [
        BulkActionMonitoringResultComponent,
        BulkActionMonitoringDetailsComponent,
        BulkActionMonitoringSummaryComponent,
      ],
      imports: [
        MatCardModule,
        MatSnackBarModule,
        MatIconModule,
        MatTooltipModule,
        MatTableModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore({ initialState }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BulkActionMonitoringResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should extract summary and details from resultData on ngOnChanges", () => {
    const mockResultData: BulkActionMonitoringInfo = {
      "entity-type": "bulkStatus",
      action: "Delete",
      username: "testuser",
      state: "COMPLETED",
      submitted: "2024-08-18T13:13:36.797Z",
      total: 100,
      commandId: "12345",
      skipCount: 10,
      error: false,
      scrollStart: "2024-08-18T13:13:36.802Z",
      scrollEnd: "2024-08-18T13:13:36.804Z",
      processed: 90,
      processingStart: "2024-08-18T13:13:36.830Z",
      processingEnd: "2024-08-18T13:13:36.931Z",
      completed: "2024-08-18T13:13:39.011Z",
      processingMillis: 1200,
      errorCount: 5,
    };

    component.resultData = mockResultData;
    component.ngOnChanges();

    const expectedSummary: BulkActionInfoSummary = {
      action: "Delete",
      username: "testuser",
      state: "COMPLETED",
      submitted: mockResultData.submitted,
      total: 100,
      commandId: "12345",
      processed: 90,
      errorCount: 5,
    };

    const expectedDetails: BulkActionInfoDetails = {
      skipCount: 10,
      processed: 90,
      error: false,
      errorCount: 5,
      scrollStart: mockResultData.scrollStart,
      scrollEnd: mockResultData.scrollEnd,
      processingStart: mockResultData.processingStart,
      processingEnd: mockResultData.processingEnd,
      completed: "2024-08-18T13:13:39.011Z",
      processingMillis: 1200,
    };

    expect(component.bulkActionSummary).toEqual(expectedSummary);
    expect(component.bulkActionDetails).toEqual(expectedDetails);
  });
});
