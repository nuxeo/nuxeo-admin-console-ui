import { MatCheckboxModule } from "@angular/material/checkbox";
import { HyDialogBoxModule } from "@hyland/ui";
import { MatDialogModule } from "@angular/material/dialog";
import { WarningComponent } from "./warning.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { PersistenceService } from "../../shared/services/persistence.service";
import { CommonService } from "../../shared/services/common.service";
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from "@angular/core";
import { provideMockStore } from '@ngrx/store/testing';

describe("WarningComponent", () => {
  let component: WarningComponent;
  let fixture: ComponentFixture<WarningComponent>;
  let persistenceServiceSetSpy: jasmine.Spy;
  let commonServiceLoadAppEmitSpy: jasmine.Spy;

  const initialAuthState = {
    auth: {
      isSubmitting: false,
      currentUser: { id: 'Administrator', isAdministrator: false, properties: {} },
      isLoading: false,
      validationErrors: null
    }
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
    await TestBed.configureTestingModule({
      declarations: [WarningComponent],
      imports: [
        CommonModule,
        MatDialogModule,
        HyDialogBoxModule,
        MatCheckboxModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: PersistenceService, useClass: PersistenceServiceStub },
        { provide: CommonService, useClass: CommonServiceStub },
        provideMockStore({ initialState: initialAuthState }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WarningComponent);
    component = fixture.componentInstance;
    persistenceServiceSetSpy = spyOn(component.persistenceService, "set");
    commonServiceLoadAppEmitSpy = spyOn(component.commonService.loadApp, "emit");
  });

  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the doNotWarn field based on preference saved", () => {
    const persistenceServiceGetSpy = spyOn(component.persistenceService, "get");
    persistenceServiceGetSpy.and.returnValue(null);
    component.ngOnInit();
    expect(component.doNotWarn).toBe(false);
    persistenceServiceGetSpy.and.returnValue("true");
    component.ngOnInit();
    expect(component.doNotWarn).toBe(true);
  });

  describe("should test confirm click actions", () => {
    beforeEach(() => {
      component.currentUser = {
        id: 'Administrator', isAdministrator: false, properties: {
          firstName: "nco",
          lastName: "admin",
          email: "nco-admin@nuxeo.com",
          username: "Administrator"
        }
      };
    });

    it("should set preference as true & close dialog & emit loadApp=true, when doNotWarn field is checked", () => {
      component.doNotWarn = true;
      spyOn(component.dialogService, "closeAll");
      component.onConfirm();
      const preferenceKey = `doNotWarn-${component.currentUser?.id}`;
      expect(persistenceServiceSetSpy).toHaveBeenCalledWith(preferenceKey, "true");
      expect(commonServiceLoadAppEmitSpy).toHaveBeenCalledWith(true);
      expect(component.dialogService.closeAll).toHaveBeenCalled();
    });

    it("should not set preference & close dialog & emit loadApp=true, when doNotWarn field is unchecked", () => {
      component.doNotWarn = false;
      spyOn(component.dialogService, "closeAll");
      component.onConfirm();
      expect(commonServiceLoadAppEmitSpy).toHaveBeenCalledWith(true);
      expect(component.dialogService.closeAll).toHaveBeenCalled();
    });
  });
});