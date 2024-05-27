import { MatDialogModule } from "@angular/material/dialog";
import { BaseLayoutComponent } from "./layouts/base-layout/components/base-layout.component";
import { AppComponent } from "./app.component";
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { PersistenceService } from "./shared/services/persistence.service";
import { WarningComponent } from "./features/warning/warning.component";
import { CommonService } from "./shared/services/common.service";
import { EventEmitter } from "@angular/core";

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
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
      declarations: [AppComponent, BaseLayoutComponent],
      imports: [CommonModule, MatDialogModule],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: PersistenceService, useClass: persistenceServiceStub },
        { provide: CommonService, useClass: adminCommonServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });

  describe("test warning preference", () => {
    beforeEach(() => {
      spyOn(component.dialogService, "open");
    });
    it("should open the warning dialog if warning preference is not set", () => {
      spyOn(component.persistenceService, "get").and.returnValue(null);
      let loadAppSubscriptionSpy = spyOn(
        component.adminCommonService.loadApp,
        "subscribe"
      ).and.callThrough();
      component.ngOnInit();
      expect(component.persistenceService.get).toHaveBeenCalled();
      expect(component.dialogService.open).toHaveBeenCalledWith(
        WarningComponent,
        {
          disableClose: true,
        }
      );
      expect(loadAppSubscriptionSpy).toHaveBeenCalled();
    });

    it("should not open the warning dialog if warning preference is set", () => {
      spyOn(component.persistenceService, "get").and.returnValue("true");
      component.ngOnInit();
      expect(component.persistenceService.get).toHaveBeenCalled();
      expect(component.dialogService.open).not.toHaveBeenCalled();
      expect(component.loadApp).toEqual(true);
    });
  });

  it("should set loadApp to true or false based on the value received from the service subscription", () => {
    component.ngOnInit();
    component.adminCommonService.loadApp.emit(true);
    expect(component.loadApp).toBe(true);
    component.ngOnInit();
    component.adminCommonService.loadApp.emit(false);
    expect(component.loadApp).toBe(false);
  });

  it("should remove theloadAppSubscription when component is destroyed", () => {
    spyOn(component.loadAppSubscription, "unsubscribe");
    component.ngOnDestroy();
    expect(component.loadAppSubscription.unsubscribe).toHaveBeenCalled();
  });
});
