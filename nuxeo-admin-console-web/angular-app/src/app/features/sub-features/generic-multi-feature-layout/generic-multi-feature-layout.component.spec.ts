import { initializeTestBed } from "src/test-helpers"; //This import must be the first import in the file.
import {
  beforeEach,
  describe,
  expect,
  it,
  type MockedObject,
  vi,
} from "vitest";
import { GenericMultiFeatureLayoutComponent } from "./generic-multi-feature-layout.component";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDialogModule } from "@angular/material/dialog";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { provideMockStore } from "@ngrx/store/testing";
import { StoreModule } from "@ngrx/store";
import { BehaviorSubject, Subject, of } from "rxjs";
import { NuxeoJSClientService } from "../../../shared/services/nuxeo-js-client.service";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from "@angular/router";
import { ChangeDetectorRef } from "@angular/core";
import { GenericMultiFeatureUtilitiesService } from "./services/generic-multi-feature-utilities.service";
describe("GenericMultiFeatureLayoutComponent", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

  let component: GenericMultiFeatureLayoutComponent;
  let fixture: ComponentFixture<GenericMultiFeatureLayoutComponent>;
  let mockCdRef: MockedObject<ChangeDetectorRef>;
  let genericMultiFeatureUtilitiesService: MockedObject<GenericMultiFeatureUtilitiesService>;
  class genericMultiFeatureUtilitiesServiceStub {
    pageTitle: BehaviorSubject<string> = new BehaviorSubject("");
    spinnerStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);
    getActiveFeature() {
      return "ELASTIC_SEARCH_REINDEX";
    }

    setActiveFeature() {
      return "";
    }
  }

  class nuxeoJsClientServiceStub {
    nuxeoInstance = {};

    getBaseUrl() {
      return "";
    }

    getApiUrl() {
      return "";
    }

    getNuxeoInstance() {
      return {};
    }
  }

  class mockActivatedRoute {
    params = of({ id: "123" });
  }

  const mockRoute = {
    snapshot: {
      firstChild: {
        routeConfig: { path: "tab1" },
      },
    },
  };
  const mockRouter = {
    routerState: {
      snapshot: {
        url: "/feature/tab1",
      },
    },
    events: new Subject(),
    createUrlTree: vi.fn().mockReturnValue({}),
    Serializer: vi.fn().mockReturnValue({}),
    serializeUrl: vi.fn().mockReturnValue("mockSerializedUrl"),
  };

  beforeEach(async () => {
    mockCdRef = {
      detectChanges: vi.fn().mockName("ChangeDetectorRef.detectChanges"),
    } as any;
    await TestBed.configureTestingModule({
      declarations: [GenericMultiFeatureLayoutComponent],
      imports: [
        CommonModule,
        MatDialogModule,
        MatTabsModule,
        RouterModule,
        StoreModule.forRoot(provideMockStore),
      ],
      providers: [
        {
          provide: GenericMultiFeatureUtilitiesService,
          useClass: genericMultiFeatureUtilitiesServiceStub,
        },
        {
          provide: NuxeoJSClientService,
          useClass: nuxeoJsClientServiceStub,
        },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: ChangeDetectorRef, useValue: mockCdRef },
        { provide: ActivatedRoute, useValue: mockRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericMultiFeatureLayoutComponent);
    component = fixture.componentInstance;
    genericMultiFeatureUtilitiesService = TestBed.inject(
      GenericMultiFeatureUtilitiesService
    ) as MockedObject<GenericMultiFeatureUtilitiesService>;
    vi.spyOn(genericMultiFeatureUtilitiesService, "getActiveFeature");
  });

  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });

  it("should complete any active subscriptions", () => {
    vi.spyOn(component["activeSubscription"], "next");
    vi.spyOn(component["activeSubscription"], "complete");
    component.ngOnDestroy();
    expect(component["activeSubscription"].next).toHaveBeenCalled();
    expect(component["activeSubscription"].complete).toHaveBeenCalled();
  });

  it("should assign current activated tab to activeTab", () => {
    const tab = {
      label: "document",
      path: "/document",
      isSelected: true,
    };
    component.activateTab(tab);
    expect(component.activeTab).toEqual(tab);
  });

  describe("test updateActiveTab", () => {
    it("should update activetab to current route if currentroute exists", () => {
      const tab = {
        label: "Document",
        path: "document",
        isSelected: true,
      };
      component.updateActiveTab();
      expect(component.activeTab).toEqual(tab);
    });
  });

  it("should set active feature on ngOnInit if featureRoute exists", () => {
    vi.spyOn(genericMultiFeatureUtilitiesService, "setActiveFeature");
    component.ngOnInit();
    expect(
      genericMultiFeatureUtilitiesService.setActiveFeature
    ).toHaveBeenCalledWith("feature" as any);
  });

  it("should subscribe to router events and call updateActiveTab on NavigationEnd", () => {
    vi.spyOn(component, "updateActiveTab");
    component.ngOnInit();
    (mockRouter.events as Subject<any>).next(
      new NavigationEnd(1, "/feature/tab2", "/feature/tab2")
    );
    expect(component.updateActiveTab).toHaveBeenCalled();
  });
});
