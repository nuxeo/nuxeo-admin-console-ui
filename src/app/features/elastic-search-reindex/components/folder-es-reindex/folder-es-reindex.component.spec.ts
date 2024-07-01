import { FolderReindexState } from "./../../store/reducers";
import { MatDialogModule } from "@angular/material/dialog";
import { HyFormContainerModule } from "@hyland/ui";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FolderESReindexComponent } from "./folder-es-reindex.component";
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { ElasticSearchReindexService } from "../../services/elastic-search-reindex.service";
import { BehaviorSubject, Observable } from "rxjs";
import { provideMockStore } from "@ngrx/store/testing";

describe("FolderESReindexComponent", () => {
  let component: FolderESReindexComponent;
  let fixture: ComponentFixture<FolderESReindexComponent>;
  class elasticSearchReindexServiceStub {
    pageTitle = new BehaviorSubject("");
    performDocumentReindex() {
      return Observable<null>;
    }
    performFolderReindex() {
      return Observable<null>;
    }
    performNXQLReindex() {
      return Observable<null>;
    }
  }

  const initialState: FolderReindexState = {
    folderReindexInfo: {
      commandId: "201-990-3726-99",
    },
    error: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FolderESReindexComponent],
      imports: [
        CommonModule,
        HyFormContainerModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
      ],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        {
          provide: ElasticSearchReindexService,
          useClass: elasticSearchReindexServiceStub,
        },
        provideMockStore({ initialState: { folderReindex: initialState } }),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(FolderESReindexComponent);
    component = fixture.componentInstance;
  });
  it("should test if component is created", () => {
    expect(component).toBeTruthy();
    
  });
  it('some', () => {
    spyOn(component, "initiateJSClient")
    component.ngOnInit();
    expect(component.initiateJSClient).toHaveBeenCalled();
  })
});

