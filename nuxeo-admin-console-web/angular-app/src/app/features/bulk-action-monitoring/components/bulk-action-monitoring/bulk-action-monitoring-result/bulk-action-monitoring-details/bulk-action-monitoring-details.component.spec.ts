import { BulkActionInfoDetails } from './../../../../bulk-action-monitoring.interface';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from "@angular/material/card";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BulkActionMonitoringDetailsComponent } from "./bulk-action-monitoring-details.component";
import { MatTableModule } from '@angular/material/table';

describe("BulkActionMonitoringDetailsComponent", () => {
  let component: BulkActionMonitoringDetailsComponent;
  let fixture: ComponentFixture<BulkActionMonitoringDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BulkActionMonitoringDetailsComponent],
      imports: [MatCardModule, NoopAnimationsModule, MatTableModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BulkActionMonitoringDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set additionalInfoDataSrc on ngOnChanges", () => {
    const mockDetails: BulkActionInfoDetails = {
      processed: 10,
      errorCount: 5,
      skipCount: 2,
      error: false,
      scrollStart: "2024-08-18T13:13:36.802Z",
      scrollEnd: "2024-08-18T13:13:36.804Z",
      processingStart: "2024-08-18T13:13:36.830Z",
      processingEnd: "2024-08-18T13:13:36.931Z",
      completed: "2024-08-18T13:13:39.011Z",
      processingMillis: 3,
    };

    component.bulkActionDetails = mockDetails;
    component.ngOnChanges();

    expect(component.additionalInfoDataSrc).toEqual([mockDetails]);
  });

  it("should replace placeholders in docsProcessedText correctly", () => {
    const mockDetails: BulkActionInfoDetails = {
      processed: 10,
      errorCount: 0,
      skipCount: 0,
      error: false,
      scrollStart: "2024-08-18T13:13:36.802Z",
      scrollEnd: "2024-08-18T13:13:36.804Z",
      processingStart: "2024-08-18T13:13:36.830Z",
      processingEnd: "2024-08-18T13:13:36.931Z",
      completed: "2024-08-18T13:13:39.011Z",
      processingMillis: 3,
    };
    component.bulkActionDetails = mockDetails;
    component.replacePlaceholderValues();
    expect(component.docsProcessedText).toBe("10 documents processed");
  });

  it("should pluralize document label in docsProcessedText if processed > 1", () => {
    component.bulkActionDetails = { processed: 2 } as BulkActionInfoDetails;
    component.replacePlaceholderValues();
    expect(component.docsProcessedText).toContain("documents");
  });

  it("should replace placeholders in errorsFoundText correctly", () => {
    const mockDetails: BulkActionInfoDetails = {
      processed: 0,
      errorCount: 5,
      skipCount: 0,
      error: false,
      scrollStart: "2024-08-18T13:13:36.802Z",
      scrollEnd: "2024-08-18T13:13:36.804Z",
      processingStart: "2024-08-18T13:13:36.830Z",
      processingEnd: "2024-08-18T13:13:36.931Z",
      completed: "2024-08-18T13:13:39.011Z",
      processingMillis: 3,
    };
    component.bulkActionDetails = mockDetails;
    component.replacePlaceholderValues();
    expect(component.errorsFoundText).toBe("5 errors found");
  });

  it("should pluralize error label in errorsFoundText if errorCount > 1", () => {
    component.bulkActionDetails = { errorCount: 2 } as BulkActionInfoDetails;
    component.replacePlaceholderValues();
    expect(component.errorsFoundText).toContain("errors");
  });

  it("should replace placeholders in docsSkippedText correctly", () => {
    const mockDetails: BulkActionInfoDetails = {
      processed: 0,
      errorCount: 0,
      skipCount: 3,
      error: false,
      scrollStart: "2024-08-18T13:13:36.802Z",
      scrollEnd: "2024-08-18T13:13:36.804Z",
      processingStart: "2024-08-18T13:13:36.830Z",
      processingEnd: "2024-08-18T13:13:36.931Z",
      completed: "2024-08-18T13:13:39.011Z",
      processingMillis: 3,
    };
    component.bulkActionDetails = mockDetails;
    component.replacePlaceholderValues();
    expect(component.docsSkippedText).toBe("3 documents skipped");
  });

  it("should pluralize document label in docsSkippedText if skipCount > 1", () => {
    component.bulkActionDetails = { skipCount: 2 } as BulkActionInfoDetails;
    component.replacePlaceholderValues();
    expect(component.docsSkippedText).toContain("documents");
  });
});
