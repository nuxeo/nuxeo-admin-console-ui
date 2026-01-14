import { initializeTestBed } from "src/test-helpers"; //This import must be the first import in the file.
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedObject,
} from "vitest";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { JsonViewerComponent, type Segment } from "./json-viewer.component";
import { SharedMethodsService } from "../../services/shared-methods.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ChangeDetectorRef, ElementRef } from "@angular/core";
import { JSON_VIEWER_LABELS } from "./json.constant";

describe("JsonViewerComponent", () => {
  initializeTestBed();

  let component: JsonViewerComponent;
  let fixture: ComponentFixture<JsonViewerComponent>;
  let sharedMethodsService: MockedObject<SharedMethodsService>;
  let sanitizer: MockedObject<DomSanitizer>;
  let cdr: MockedObject<ChangeDetectorRef>;

  const mockJson = {
    name: "Test User",
    age: 30,
    active: true,
    address: {
      street: "123 Main St",
      city: "Test City",
    },
    tags: ["test", "demo"],
  };

  beforeEach(async () => {
    sharedMethodsService = {
      showSuccessSnackBar: vi.fn(),
      showErrorSnackBar: vi.fn(),
    } as MockedObject<SharedMethodsService>;

    sanitizer = {
      bypassSecurityTrustHtml: vi.fn((html) => html),
    } as unknown as MockedObject<DomSanitizer>;

    // Mock scrollIntoView globally for all elements
    Element.prototype.scrollIntoView = vi.fn();

    await TestBed.configureTestingModule({
      declarations: [JsonViewerComponent],
      providers: [
        { provide: SharedMethodsService, useValue: sharedMethodsService },
        { provide: DomSanitizer, useValue: sanitizer },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JsonViewerComponent);
    component = fixture.componentInstance;
    cdr = fixture.debugElement.injector.get(
      ChangeDetectorRef
    ) as MockedObject<ChangeDetectorRef>;
    vi.spyOn(cdr, "detectChanges");
    vi.spyOn(cdr, "markForCheck");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
  
   describe("Component Initialization", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should initialize with default values", () => {
      expect(component.expanded).toBe(true);
      expect(component.depth).toBe(-1);
      expect(component.currentDepth).toBe(0);
      expect(component.expandAll).toBe(false);
      expect(component.segments).toEqual([]);
      expect(component.searchTerm).toBe("");
      expect(component.totalMatches).toBe(0);
      expect(component.currentMatchIndex).toBe(-1);
    });

    it("should have JSON_VIEWER_LABELS constant", () => {
      expect(component.JSON_VIEWER_LABELS).toBe(JSON_VIEWER_LABELS);
    });
  });
});
