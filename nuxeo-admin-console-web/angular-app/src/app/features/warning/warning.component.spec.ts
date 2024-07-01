import { MatCheckboxModule } from "@angular/material/checkbox";
import { HyDialogBoxModule } from "@hyland/ui";
import { MatDialogModule } from "@angular/material/dialog";
import { WarningComponent } from "./warning.component";
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { PersistenceService } from "../../shared/services/persistence.service";
import { CommonService } from "../../shared/services/common.service";
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from "@angular/core";
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

describe("WarningComponent", () => {
  let component: WarningComponent;
  let fixture: ComponentFixture<WarningComponent>;
  class persistenceServiceStub {
    get() {
      return null;
    }

    set() {
      return;
    }
  }

  class commonServiceStub {
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
        StoreModule.forRoot(provideMockStore)
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: PersistenceService, useClass: persistenceServiceStub },
        { provide: CommonService, useClass: commonServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WarningComponent);
    component = fixture.componentInstance;
  });

  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });

  it("should initialise the doNotWarn field based on preference saved", () => {
    if (component?.currentUser) {
      const persistenceServiceGetSpy = spyOn(component.persistenceService, "get");
      persistenceServiceGetSpy.and.returnValue(null);
      component.ngOnInit();
      expect(component.doNotWarn).toBe(false);
      persistenceServiceGetSpy.and.returnValue("true");
      component.ngOnInit();
      expect(component.doNotWarn).toBe(true);
    }

  });

  describe("should test confirm click actions", () => {
    let persistenceServiceSetSpy: jasmine.Spy;
    let commonServiceLoadAppEmitSpy: jasmine.Spy;
    beforeEach(() => {
      persistenceServiceSetSpy = spyOn(component.persistenceService, "set");
      commonServiceLoadAppEmitSpy = spyOn(
        component.commonService.loadApp,
        "emit"
      );
    });

    it("should set preference as true & close dialog & emit loadApp=true, when doNotWarn field is checked", () => {
      if (component?.currentUser) {
        component.doNotWarn = true;
        spyOn(component.dialogService, "closeAll");
        component.onConfirm();
        const preferenceKey = `doNotWarn-${component?.currentUser?.id}`;
        expect(persistenceServiceSetSpy).toHaveBeenCalledWith(
          preferenceKey,
          "true"
        );
        expect(commonServiceLoadAppEmitSpy).toHaveBeenCalledWith(true);
        expect(component.dialogService.closeAll).toHaveBeenCalled();
      }

    });
    it("should not set preference & close dialog & emit loadApp=true, when doNotWarn field is unchecked", () => {
      if (component?.currentUser) {
        component.doNotWarn = false;
        spyOn(component.dialogService, "closeAll");
        component.onConfirm();
        expect(commonServiceLoadAppEmitSpy).toHaveBeenCalledWith(true);
        expect(component.dialogService.closeAll).toHaveBeenCalled();
      }
    });
  });
});
