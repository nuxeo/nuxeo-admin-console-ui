import { HeaderBarComponent } from "./header-bar.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { HyMaterialIconModule } from "@hyland/ui";
import { NuxeoJSClientService } from "../../shared/services/nuxeo-js-client.service";
import { Router } from "@angular/router";
import { RouterTestingModule } from '@angular/router/testing';
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { UserInterface } from "../../shared/types/user.interface";
import { authActions } from "../../auth/store/actions";

describe("HeaderBarComponent", () => {
  let component: HeaderBarComponent;
  let fixture: ComponentFixture<HeaderBarComponent>;
  let store: MockStore;
  let router: Router;

  const initialAuthState = {
    auth: {
      isSubmitting: false,
      currentUser: {
        id: 'Administrator', isAdministrator: false, properties: {
          firstName: "nco",
          lastName: "admin",
          email: "nco-admin@nuxeo.com",
          username: "Administrator"
        }
      },
      isLoading: false,
      validationErrors: null
    }
  };

  beforeEach(async () => {
    const nuxeoJsClientServiceSpy = jasmine.createSpyObj('nuxeoJSClientService', ['getBaseUrl']);

    await TestBed.configureTestingModule({
      declarations: [HeaderBarComponent],
      imports: [
        CommonModule,
        HyMaterialIconModule,
        MatToolbarModule,
        RouterTestingModule,
      ],
      providers: [
        provideMockStore({ initialState: initialAuthState }),
        { provide: NuxeoJSClientService, useValue: nuxeoJsClientServiceSpy },
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(HeaderBarComponent);
    component = fixture.componentInstance;
  });

  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize displayName based on currentUser properties", () => {
    const currentUser: UserInterface = {
      id: 'Administrator',
      isAdministrator: false,
      properties: {
        firstName: "nco",
        lastName: "admin",
        email: "nco-admin@nuxeo.com",
        username: "nco-admin"
      }
    };
    store.setState({
      auth: {
        ...initialAuthState.auth,
        currentUser
      }
    });
    fixture.detectChanges();
    expect(component.displayName).toBe('nco admin');
  });

  it("should set displayName to username if firstName and lastName are not available", () => {
    const currentUser: UserInterface = {
      id: 'Administrator',
      isAdministrator: false,
      properties: {
        firstName: "",
        lastName: "",
        email: "nco-admin@nuxeo.com",
        username: "nco-admin"
      }
    };
    store.setState({
      auth: {
        ...initialAuthState.auth,
        currentUser
      }
    });
    fixture.detectChanges();
    expect(component.displayName).toBe('nco-admin');
  });

  it("should set displayName to firstName if lastName is not available", () => {
    const currentUser: UserInterface = {
      id: 'Administrator',
      isAdministrator: false,
      properties: {
        firstName: "nco",
        lastName: "",
        email: "nco-admin@nuxeo.com",
        username: "nco-admin"
      }
    };
    store.setState({
      auth: {
        ...initialAuthState.auth,
        currentUser
      }
    });
    fixture.detectChanges();
    expect(component.displayName).toBe('nco');
  });
  
  it("should navigate to home on navigateToHome call", () => {
    spyOn(router, 'navigate');
    component.navigateToHome();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  describe("onSignOut", () => {
    it("should dispatch signOut action", () => {
      spyOn(store, "dispatch");
      component.onSignOut();
      expect(store.dispatch).toHaveBeenCalledWith(authActions.signOut());
    });
  });
});