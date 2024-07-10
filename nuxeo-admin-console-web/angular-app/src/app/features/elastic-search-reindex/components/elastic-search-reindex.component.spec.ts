import { MatTabsModule } from "@angular/material/tabs";
import { ElasticSearchReindexComponent } from "./elastic-search-reindex.component";
import { ElasticSearchReindexService } from "./../services/elastic-search-reindex.service";
import { MatDialogModule } from "@angular/material/dialog";
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed
} from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { provideMockStore } from "@ngrx/store/testing";
import { StoreModule } from "@ngrx/store";
import { BehaviorSubject, Observable, Subject, of } from "rxjs";
import { ReindexInfo } from "../elastic-search-reindex.interface";
import { NuxeoJSClientService } from "../../../shared/services/nuxeo-js-client.service";
import {
  ActivatedRoute,
  Router,
  RouterModule,
} from "@angular/router";
import { ChangeDetectorRef } from "@angular/core";

describe("ElasticSearchReindexComponent", () => {
  let component: ElasticSearchReindexComponent;
  let fixture: ComponentFixture<ElasticSearchReindexComponent>;
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

  class mockRouter {
    navigate = jasmine.createSpy("navigate");
    events = new Subject();
  }

  class mockChangeDetectorRef {
    detectChanges = jasmine.createSpy("detectChanges");
  }

  beforeEach(async () => {
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
        { provide: ComponentFixtureAutoDetect, useValue: true },
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
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
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
