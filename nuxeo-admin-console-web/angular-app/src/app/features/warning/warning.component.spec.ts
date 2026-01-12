import { initializeTestBed } from "src/test-helpers"; //This import must be the first import in the file.
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from "@angular/core";
import { provideMockStore } from "@ngrx/store/testing";
import { WarningComponent } from "./warning.component";
import { PersistenceService } from "../../shared/services/persistence.service";
import { CommonService } from "../../shared/services/common.service";
describe("WarningComponent", () => {
  let component: WarningComponent;
  let fixture: ComponentFixture<WarningComponent>;

  // Initialize TestBed for component testing
  initializeTestBed();

  const initialAuthState = {
    auth: {
      isSubmitting: false,
      currentUser: {
        id: "Administrator",
        isAdministrator: false,
        properties: {},
      },
      isLoading: false,
      validationErrors: null,
    },
  };

  class PersistenceServiceStub {
    get() {
      return null;
    }

    set() {
      return null;
    }
  }

  class CommonServiceStub {
    loadApp = new EventEmitter<boolean>();
  }

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      declarations: [WarningComponent],
      imports: [CommonModule, MatDialogModule, MatCheckboxModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: PersistenceService, useClass: PersistenceServiceStub },
        { provide: CommonService, useClass: CommonServiceStub },
        provideMockStore({ initialState: initialAuthState }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WarningComponent);
    component = fixture.componentInstance;
  });

  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the doNotWarn field based on preference saved", () => {
    const persistenceServiceGetSpy = vi.spyOn(
      component.persistenceService,
      "get"
    );

    persistenceServiceGetSpy.mockReturnValue(null);
    component.ngOnInit();
    expect(component.doNotWarn).toBe(false);

    persistenceServiceGetSpy.mockReturnValue("true");
    component.ngOnInit();
    expect(component.doNotWarn).toBe(true);
  });

  describe("should test confirm click actions", () => {
    beforeEach(() => {
      component.currentUser = {
        id: "Administrator",
        isAdministrator: false,
        properties: {
          firstName: "nco",
          lastName: "admin",
          email: "nco-admin@nuxeo.com",
          username: "Administrator",
        },
      };
    });

    it("should set preference as true & close dialog & emit loadApp=true, when doNotWarn field is checked", () => {
      component.doNotWarn = true;
      const persistenceServiceSetSpy = vi.spyOn(
        component.persistenceService,
        "set"
      );
      const commonServiceLoadAppEmitSpy = vi.spyOn(
        component.commonService.loadApp,
        "emit"
      );
      const closeAllSpy = vi.spyOn(component.dialogService, "closeAll");

      component.onConfirm();

      const preferenceKey = `doNotWarn-${component.currentUser?.id}`;
      expect(persistenceServiceSetSpy).toHaveBeenCalledWith(
        preferenceKey,
        "true"
      );
      expect(commonServiceLoadAppEmitSpy).toHaveBeenCalledWith(true);
      expect(closeAllSpy).toHaveBeenCalled();
    });

    it("should not set preference & close dialog & emit loadApp=true, when doNotWarn field is unchecked", () => {
      component.doNotWarn = false;
      const commonServiceLoadAppEmitSpy = vi.spyOn(
        component.commonService.loadApp,
        "emit"
      );
      const closeAllSpy = vi.spyOn(component.dialogService, "closeAll");

      component.onConfirm();

      expect(commonServiceLoadAppEmitSpy).toHaveBeenCalledWith(true);
      expect(closeAllSpy).toHaveBeenCalled();
    });
  });

  describe("ngOnDestroy", () => {
    it("should unsubscribe from observables on destroy", () => {
      const nextSpy = vi.spyOn((component as any).destroy$, "next");
      const completeSpy = vi.spyOn((component as any).destroy$, "complete");

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it("should unsubscribe from all subscriptions", () => {
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
});
