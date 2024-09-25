/* import { GenericMultiFeatureEndpointsService } from './services/generic-multi-feature-endpoints.service';
import { GenericMultiFeatureLayoutComponent } from './generic-multi-feature-layout.component';
import { MatTabsModule } from "@angular/material/tabs";
import { MatDialogModule } from "@angular/material/dialog";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { provideMockStore } from "@ngrx/store/testing";
import { StoreModule } from "@ngrx/store";
import { BehaviorSubject, Observable, ReplaySubject, of } from "rxjs";
import { NuxeoJSClientService } from "../../../shared/services/nuxeo-js-client.service";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
  RouterModule,
} from "@angular/router";
import { ChangeDetectorRef } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { takeUntil, filter } from "rxjs/operators";
import { GenericMultiFeatureUtilitiesService } from './services/generic-multi-feature-utilities.service';
import { ActionInfo } from './generic-multi-feature-layout.interface';

describe("GenericMultiFeatureLayoutComponent", () => {
  let component: GenericMultiFeatureLayoutComponent;
  let fixture: ComponentFixture<GenericMultiFeatureLayoutComponent>;
  let mockCdRef: jasmine.SpyObj<ChangeDetectorRef>;
  let mockUtilitiesService: jasmine.SpyObj<GenericMultiFeatureUtilitiesService>;
  let mockTitleService: jasmine.SpyObj<Title>;
  
  class GenericMultiFeatureEndpointsServiceStub {
    pageTitle: BehaviorSubject<string> = new BehaviorSubject("");
    spinnerStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);
    
    performDocumentAction() {
      return of({} as ActionInfo); // Return an observable with mock data
    }

    performFolderAction() {
      return of({} as ActionInfo); // Return an observable with mock data
    }

    performNXQLAction() {
      return of({} as ActionInfo); // Return an observable with mock data
    }
  }

  class NuxeoJsClientServiceStub {
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

  const eventSubject = new ReplaySubject<RouterEvent>(1);
  const mockRouter = {
    navigate: jasmine.createSpy("navigate"),
    events: eventSubject.asObservable(),
    url: "test/url",
    // routerState: {
    //   snapshot: {
    //     url: '/home'
    //   }
    // }
  };
  beforeEach(async () => {
    mockCdRef = jasmine.createSpyObj("ChangeDetectorRef", ["detectChanges"]);
    mockUtilitiesService = jasmine.createSpyObj(
      "GenericMultiFeatureUtilitiesService",
      ["setActiveFeature", "getActiveFeature", "pageTitle"]
    );
    mockTitleService = jasmine.createSpyObj("Title", ["setTitle"]);

    mockUtilitiesService.pageTitle = new BehaviorSubject<string>("Elastic Search Action");

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
          provide: GenericMultiFeatureEndpointsService,
          useClass: GenericMultiFeatureEndpointsServiceStub,
        },
        {
          provide: NuxeoJSClientService,
          useClass: NuxeoJsClientServiceStub,
        },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: ChangeDetectorRef, useValue: mockCdRef },
        { provide: Title, useValue: mockTitleService },
        { provide: GenericMultiFeatureUtilitiesService, useValue: mockUtilitiesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericMultiFeatureLayoutComponent);
    component = fixture.componentInstance;

    // Emit a NavigationEnd event to simulate navigation
    eventSubject.next(new NavigationEnd(0, "/elasticsearch-reindex/document", "/elasticsearch-reindex/folder"));
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should complete any active subscriptions", () => {
    spyOn(component["activeSubscription"], "next");
    spyOn(component["activeSubscription"], "complete");
    component.ngOnDestroy();
    expect(component["activeSubscription"].next).toHaveBeenCalled();
    expect(component["activeSubscription"].complete).toHaveBeenCalled();
  });

  it("should set the active feature on initialization", () => {
    component.ngOnInit();
    expect(mockUtilitiesService.setActiveFeature).toHaveBeenCalledWith("ELASTIC_SEARCH_REINDEX");
  });

  it("should update activetab to current route if currentroute exists", () => {
    const tab = {
      label: "Document",
      path: "document",
      isSelected: true,
    };
    component.updateActiveTab();
    expect(component.activeTab).toEqual(tab);
  });

  it("should set page title from the utility service", () => {
    component.ngOnInit();
    expect(component.pageTitle).toBe("Elastic Search Action");
    expect(mockCdRef.detectChanges).toHaveBeenCalled();
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
});
*/
