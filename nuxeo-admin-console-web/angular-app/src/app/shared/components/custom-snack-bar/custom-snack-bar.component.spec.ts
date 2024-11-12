import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CustomSnackBarComponent } from "./custom-snack-bar.component";
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from "@angular/material/snack-bar";
import { BULK_ACTION_LABELS } from "./../../../features/bulk-action-monitoring/bulk-action-monitoring.constants";
import { SnackBarData } from "../../types/common.interface";
import { MatIconModule } from "@angular/material/icon";

describe("CustomSnackBarComponent", () => {
  let component: CustomSnackBarComponent;
  let fixture: ComponentFixture<CustomSnackBarComponent>;
  let mockSnackBarRef: jasmine.SpyObj<MatSnackBarRef<CustomSnackBarComponent>>;
  const mockData: SnackBarData = { message: "Test message", panelClass: 'success-snack' }; 

  beforeEach(async () => {
    mockSnackBarRef = jasmine.createSpyObj("MatSnackBarRef", ["dismiss"]);

    await TestBed.configureTestingModule({
      declarations: [CustomSnackBarComponent],
      imports: [MatIconModule],
      providers: [
        { provide: MatSnackBarRef, useValue: mockSnackBarRef },
        { provide: MAT_SNACK_BAR_DATA, useValue: mockData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should have BULK_ACTION_LABELS defined", () => {
    expect(component.BULK_ACTION_LABELS).toBe(BULK_ACTION_LABELS);
  });

  it("should inject MAT_SNACK_BAR_DATA as data", () => {
    expect(component.data).toEqual(mockData);
  });

  it("should close the snackbar when close method is called", () => {
    component.close();
    expect(mockSnackBarRef.dismiss).toHaveBeenCalled();
  });
});
