import { MatDialogModule } from "@angular/material/dialog";
import { AppComponent } from "./app.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { PersistenceService } from "./shared/services/persistence.service";
import { WarningComponent } from "./features/warning/warning.component";
import { CommonService } from "./shared/services/common.service";
import { EventEmitter } from "@angular/core";
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AuthStateInterface } from './auth/types/authState.interface';
import { UserInterface } from './shared/types/user.interface';
import { APP_CONSTANTS } from './app.constants';
import { By } from '@angular/platform-browser';
import { authActions } from './auth/store/actions';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BaseLayoutModule } from "./layouts/base-layout/base-layout.module";
import { BaseLayoutComponent } from "./layouts/base-layout/components/base-layout.component"
import { HyMaterialIconModule } from "@hyland/ui";
import { HeaderBarComponent } from "./layouts/header-bar/header-bar.component";
import { MenuBarComponent } from "./layouts/menu-bar/menu-bar.component";
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: () => 'Administrator'
      }
    }
  };

  let store: MockStore<{ auth: AuthStateInterface }>;
  const initialAuthState: AuthStateInterface = {
    isSubmitting: false,
    currentUser: {
      id: 'Administrator',
      isAdministrator: true,
      properties: {
        firstName: "nco",
        lastName: "admin",
        email: "nco-admin@nuxeo.com",
        username: "Administrator"
      }
    } as UserInterface,
    isLoading: false,
    validationErrors: null
  };

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
      declarations: [AppComponent, BaseLayoutComponent, HeaderBarComponent, MenuBarComponent],
      imports: [CommonModule, MatDialogModule, BaseLayoutModule, HyMaterialIconModule, RouterModule, MatToolbarModule, MatListModule, MatSidenavModule],
      providers: [
        { provide: PersistenceService, useClass: persistenceServiceStub },
        { provide: CommonService, useClass: commonServiceStub },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideMockStore({ initialState: { auth: initialAuthState } }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", () => {
    it("should initiate JS client and subscribe to currentUser$", () => {
      spyOn(component['nuxeoJsClientService'], 'initiateJSClient');
      spyOn(component.currentUser$, 'subscribe').and.callThrough();
      component.ngOnInit();
      expect(component['nuxeoJsClientService'].initiateJSClient).toHaveBeenCalledWith(component.baseUrl);
      expect(component.currentUser$.subscribe).toHaveBeenCalled();
    });

    it("should open the warning dialog if warning preference is not set", () => {
      spyOn(component.dialogService, "open");
      spyOn(component.persistenceService, "get").and.returnValue(null);
      component.ngOnInit();
      expect(component.persistenceService.get).toHaveBeenCalled();
      expect(component.dialogService.open).toHaveBeenCalledWith(WarningComponent, { disableClose: true });
    });

    it("should not open the warning dialog if warning preference is set", () => {
      spyOn(component.dialogService, "open");
      spyOn(component.persistenceService, "get").and.returnValue("true");
      component.ngOnInit();
      expect(component.persistenceService.get).toHaveBeenCalled();
      expect(component.dialogService.open).not.toHaveBeenCalled();
      expect(component.loadApp).toBe(true);
    });
  });

  describe("loadAppSubscription", () => {
    it("should set loadApp based on the value received from the service subscription", () => {
      component.ngOnInit();
      component.commonService.loadApp.emit(true);
      expect(component.loadApp).toBe(true);
      component.commonService.loadApp.emit(false);
      expect(component.loadApp).toBe(false);
    });
  });

  describe("ngOnDestroy", () => {
    it("should unsubscribe from subscriptions", () => {
      spyOn(component.loadAppSubscription, "unsubscribe");
      spyOn(component.currentUserSubscription, "unsubscribe");
      component.ngOnDestroy();
      expect(component.loadAppSubscription.unsubscribe).toHaveBeenCalled();
      expect(component.currentUserSubscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe("onSignOut", () => {
    it("should dispatch signOut action", () => {
      spyOn(store, "dispatch");
      component.onSignOut();
      expect(store.dispatch).toHaveBeenCalledWith(authActions.signOut());
    });
  });
  

  describe("DOM", () => {
    it("should display unauthorized message if currentUser is not administrator", () => {
      store.setState({
        auth: {
          ...initialAuthState, currentUser: {
            id: 'Administrator', isAdministrator: false, properties: {
              firstName: "nco",
              lastName: "admin",
              email: "nco-admin@nuxeo.com",
              username: "Administrator"
            }
          }
        }
      });
      fixture.detectChanges();
      const unauthorizedMessage = fixture.debugElement.query(By.css('.unauthorized'));
      expect(unauthorizedMessage).toBeTruthy();
      expect(unauthorizedMessage.nativeElement.textContent).toContain(APP_CONSTANTS.UNAUTHORIZED_MESSAGE);
    });

    it("should display base-layout if loadApp is true and currentUser is administrator", () => {
      component.loadApp = true;
      fixture.detectChanges();
      const baseLayout = fixture.debugElement.query(By.css('base-layout'));
      expect(baseLayout).toBeTruthy();
    });
  });
});