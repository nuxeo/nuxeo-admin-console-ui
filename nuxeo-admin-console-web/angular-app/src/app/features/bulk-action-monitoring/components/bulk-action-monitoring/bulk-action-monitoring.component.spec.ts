import { BulkActionMonitoringDetailsComponent } from "./bulk-action-monitoring-result/bulk-action-monitoring-details/bulk-action-monitoring-details.component";
import { BulkActionMonitoringFormComponent } from "./bulk-action-monitoring-form/bulk-action-monitoring-form.component";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule } from "@angular/material/dialog";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BulkActionMonitoringComponent } from "./bulk-action-monitoring.component";
import { BULK_ACTION_LABELS } from "../../bulk-action-monitoring.constants";
import { BulkActionMonitoringInfo } from "../../bulk-action-monitoring.interface";
import { StoreModule } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";

describe("BulkActionMonitoringComponent", () => {
  let component: BulkActionMonitoringComponent;
  let fixture: ComponentFixture<BulkActionMonitoringComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        BulkActionMonitoringComponent,
        BulkActionMonitoringFormComponent,
        BulkActionMonitoringDetailsComponent,
      ],
      imports: [
        NoopAnimationsModule,
        MatDialogModule,
        StoreModule.forRoot(provideMockStore),
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
      ],
      providers: [ {
        provide: ActivatedRoute,
        useValue: {
          paramMap: of({
            get: (key: string) => (key === 'bulkActionId' ? '123' : null)
          })
        }
      }]
    }).compileComponents();

    fixture = TestBed.createComponent(BulkActionMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should load the component correctly", () => {
    expect(component).toBeTruthy();
  });

  it("should have the correct initial page title", () => {
    expect(component.pageTitle).toBe(BULK_ACTION_LABELS.BULK_ACTION_TITLE);
  });

  it("should update bulkActionResponse when setBulkActionResponse is called", () => {
    const mockData: BulkActionMonitoringInfo = {
      "entity-type": "bulkStatus",
      commandId: "376910e1-196c-4e54-ba13-111c291bc14c",
      state: "COMPLETED",
      processed: 1,
      skipCount: 0,
      error: false,
      errorCount: 0,
      total: 1,
      action: "index",
      username: "system",
      submitted: "2024-08-20T03:08:08.711Z",
      scrollStart: "2024-08-20T03:08:08.714Z",
      scrollEnd: "2024-08-20T03:08:08.715Z",
      processingStart: "2024-08-20T03:08:08.784Z",
      processingEnd: "2024-08-20T03:08:08.865Z",
      completed: "2024-08-20T03:08:10.553Z",
      processingMillis: 2,
    };

    component.setBulkActionResponse(mockData);

    expect(component.bulkActionResponse).toEqual(mockData);
  });
});
