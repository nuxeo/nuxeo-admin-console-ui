import { GenericMultiFeatureLayoutComponent } from './generic-multi-feature-layout.component';
import { MatTabsModule } from "@angular/material/tabs";
import { MatDialogModule } from "@angular/material/dialog";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { provideMockStore } from "@ngrx/store/testing";
import { StoreModule } from "@ngrx/store";
import { BehaviorSubject, ReplaySubject, of } from "rxjs";
import { NuxeoJSClientService } from "../../../shared/services/nuxeo-js-client.service";
import {
  ActivatedRoute,
  Router,
  RouterEvent,
  RouterModule,
} from "@angular/router";
import { ChangeDetectorRef } from "@angular/core";
import { GenericMultiFeatureUtilitiesService } from './services/generic-multi-feature-utilities.service';

describe("GenericMultiFeatureLayoutComponent", () => {
  let component: GenericMultiFeatureLayoutComponent;
  let fixture: ComponentFixture<GenericMultiFeatureLayoutComponent>;
  let mockCdRef: jasmine.SpyObj<ChangeDetectorRef>;
  let genericMultiFeatureUtilitiesService: jasmine.SpyObj<GenericMultiFeatureUtilitiesService>;
  class genericMultiFeatureUtilitiesServiceStub {
    pageTitle: BehaviorSubject<string> = new BehaviorSubject("");
    spinnerStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);
    getActiveFeature() {
        return "ELASTIC_SEARCH_REINDEX";
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

  const eventSubject = new ReplaySubject<RouterEvent>(1);
  const mockRouter = {
    navigate: jasmine.createSpy("navigate"),
    events: eventSubject.asObservable(),
    url: "test/url",
  };

  beforeEach(async () => {
    mockCdRef = jasmine.createSpyObj("ChangeDetectorRef", ["detectChanges"]);
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericMultiFeatureLayoutComponent);
    component = fixture.componentInstance;
    genericMultiFeatureUtilitiesService = TestBed.inject(
        GenericMultiFeatureUtilitiesService
      ) as jasmine.SpyObj<GenericMultiFeatureUtilitiesService>;
    spyOn(genericMultiFeatureUtilitiesService, 'getActiveFeature');
  });

  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });

  it("should complete any active subscriptions", () => {
    spyOn(component["activeSubscription"], "next");
    spyOn(component["activeSubscription"], "complete");
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
});