import { MatCheckboxModule } from "@angular/material/checkbox";
import { HyDialogBoxModule } from "@hyland/ui";
import { MatDialogModule } from "@angular/material/dialog";
import { AdminWarningComponent } from "./admin-warning.component";
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { EventEmitter } from "@angular/core";
import { PersistenceService } from "../../shared/services/persistence.service";
import { AdminCommonService } from "../../shared/services/admin-common.service";

describe("AdminWarningComponent", () => {
  let component: AdminWarningComponent;
  let fixture: ComponentFixture<AdminWarningComponent>;
  class persistenceServiceStub {
    get() {
      return null;
    }
    set() {}
  }

  class adminCommonServiceStub {
    loadApp = new EventEmitter<Boolean>();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminWarningComponent],
      imports: [
        CommonModule,
        MatDialogModule,
        HyDialogBoxModule,
        MatCheckboxModule,
      ],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: PersistenceService, useClass: persistenceServiceStub },
        { provide: AdminCommonService, useClass: adminCommonServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminWarningComponent);
    component = fixture.componentInstance;
  });

  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });

  it("should initialise the doNotWarn field based on preference saved", () => {
    const persistenceServiceGetSpy = spyOn(component.persistenceService, "get");
    persistenceServiceGetSpy.and.returnValue(null);
    component.ngOnInit();
    expect(component.doNotWarn).toBe(false);
    persistenceServiceGetSpy.and.returnValue("true");
    component.ngOnInit();
    expect(component.doNotWarn).toBe(true);
  });

  describe("should test confirm click actions", () => {
    let persistenceServiceSetSpy: jasmine.Spy;
    let adminCommonServiceLoadAppEmitSpy: jasmine.Spy;
    beforeEach(() => {
      persistenceServiceSetSpy = spyOn(component.persistenceService, "set");
      adminCommonServiceLoadAppEmitSpy = spyOn(
        component.adminCommonService.loadApp,
        "emit"
      );
    });

    it("should set preference as true & close dialog & emit loadApp=true, when doNotWarn field is checked", () => {
      component.doNotWarn = true;
      spyOn(component.dialogService, "closeAll");
      component.onConfirm();
      expect(persistenceServiceSetSpy).toHaveBeenCalledWith(
        "doNotWarn",
        "true"
      );
      expect(adminCommonServiceLoadAppEmitSpy).toHaveBeenCalledWith(true);
      expect(component.dialogService.closeAll).toHaveBeenCalled();
    });
    it("should not set preference & close dialog & emit loadApp=true, when doNotWarn field is unchecked", () => {
      component.doNotWarn = false;
      spyOn(component.dialogService, "closeAll");
      component.onConfirm();
      expect(adminCommonServiceLoadAppEmitSpy).toHaveBeenCalledWith(true);
      expect(component.dialogService.closeAll).toHaveBeenCalled();
    });
  });
});
