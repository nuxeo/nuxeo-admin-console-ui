import { MatTabsModule } from "@angular/material/tabs";
import { ElasticSearchReindexComponent } from "./elastic-search-reindex.component";
import { ElasticSearchReindexService } from "./../services/elastic-search-reindex.service";
import { MatDialogModule } from "@angular/material/dialog";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { provideMockStore } from "@ngrx/store/testing";
import { StoreModule } from "@ngrx/store";
import { BehaviorSubject, Observable, ReplaySubject, of } from "rxjs";
import { ReindexInfo } from "../elastic-search-reindex.interface";
import { NuxeoJSClientService } from "../../../shared/services/nuxeo-js-client.service";
import {
  ActivatedRoute,
  Router,
  RouterEvent,
  RouterModule,
} from "@angular/router";
import { ChangeDetectorRef } from "@angular/core";

describe("ElasticSearchReindexComponent", () => {
  let component: ElasticSearchReindexComponent;
  let fixture: ComponentFixture<ElasticSearchReindexComponent>;
  let mockCdRef: jasmine.SpyObj<ChangeDetectorRef>;
  class elasticSearchReindexServiceStub {
    pageTitle: BehaviorSubject<string> = new BehaviorSubject("");
    spinnerStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);
    performDocumentReindex() {
      return Observable<ReindexInfo>;
    }

    performFolderReindex() {
      return Observable<ReindexInfo>;
    }

    performNXQLReindex() {
      return Observable<ReindexInfo>;
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
      declarations: [ElasticSearchReindexComponent],
      imports: [
        CommonModule,
        MatDialogModule,
        MatTabsModule,
        RouterModule,
        StoreModule.forRoot(provideMockStore),
      ],
      providers: [
        {
          provide: ElasticSearchReindexService,
          useClass: elasticSearchReindexServiceStub,
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

    fixture = TestBed.createComponent(ElasticSearchReindexComponent);
    component = fixture.componentInstance;
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
