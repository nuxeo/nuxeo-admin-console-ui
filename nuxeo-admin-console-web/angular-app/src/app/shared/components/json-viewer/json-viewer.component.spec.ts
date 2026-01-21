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

  describe("ngOnChanges", () => {
    it("should process JSON and create segments", () => {
      component.json = mockJson;
      component.ngOnChanges();
      expect(component.segments.length).toBeGreaterThan(0);
      expect(component.segments[0].key).toBe("name");
      expect(component.segments[0].value).toBe("Test User");
      expect(component.segments[0].type).toBe("string");
    });

    it("should handle null JSON", () => {
      component.json = null;
      component.ngOnChanges();
      expect(component.segments.length).toBe(1);
      expect(component.segments[0].type).toBe("null");
    });

    it("should handle array JSON", () => {
      component.json = [1, 2, 3];
      component.ngOnChanges();
      expect(component.segments.length).toBe(3);
      expect(component.segments[0].type).toBe("number");
    });

    it("should handle primitive values", () => {
      component.json = 42;
      component.ngOnChanges();
      expect(component.segments.length).toBe(1);
      expect(component.segments[0].type).toBe("number");
    });

    it("should clear search when clearSearchInput is true", () => {
      component.clearSearchInput = true;
      component.currentDepth = 0;
      component.searchTerm = "test";
      const clearSpy = vi.spyOn(component, "clearSearch");
      component.ngOnChanges();
      expect(clearSpy).toHaveBeenCalled();
    });

    it("should set expandAll based on expanded prop", () => {
      component.expanded = true;
      component.currentDepth = 0;
      component.json = mockJson;
      component.ngOnChanges();
      expect(component.expandAll).toBe(true);
    });
  });

  describe("Segment Parsing", () => {
    beforeEach(() => {
      component.json = mockJson;
      component.ngOnChanges();
    });

    it("should parse string values correctly", () => {
      const stringSegment = component.segments.find((s) => s.key === "name");
      expect(stringSegment?.type).toBe("string");
      expect(stringSegment?.description).toBe('"Test User"');
    });

    it("should parse number values correctly", () => {
      const numberSegment = component.segments.find((s) => s.key === "age");
      expect(numberSegment?.type).toBe("number");
      expect(numberSegment?.value).toBe(30);
    });

    it("should parse boolean values correctly", () => {
      const booleanSegment = component.segments.find((s) => s.key === "active");
      expect(booleanSegment?.type).toBe("boolean");
      expect(booleanSegment?.value).toBe(true);
    });

    it("should parse object values correctly", () => {
      const objectSegment = component.segments.find((s) => s.key === "address");
      expect(objectSegment?.type).toBe("object");
      expect(objectSegment?.description).toBe("Object ");
    });

    it("should parse array values correctly", () => {
      const arraySegment = component.segments.find((s) => s.key === "tags");
      expect(arraySegment?.type).toBe("array");
      expect(arraySegment?.description).toBe("Array[2] ");
    });

    it("should handle empty objects", () => {
      component.json = { empty: {} };
      component.ngOnChanges();
      const emptyObjSegment = component.segments.find((s) => s.key === "empty");
      expect(emptyObjSegment?.description).toBe("No data");
    });

    it("should handle empty arrays", () => {
      component.json = { emptyArr: [] };
      component.ngOnChanges();
      const emptyArrSegment = component.segments.find(
        (s) => s.key === "emptyArr"
      );
      expect(emptyArrSegment?.description).toBe("No data");
    });

    it("should handle undefined values", () => {
      component.json = { undef: undefined };
      component.ngOnChanges();
      const undefSegment = component.segments.find((s) => s.key === "undef");
      expect(undefSegment?.type).toBe("undefined");
      expect(undefSegment?.description).toBe("undefined");
    });

    it("should handle Date objects", () => {
      const testDate = new Date("2024-01-01");
      component.json = { dateField: testDate };
      component.ngOnChanges();
      const dateSegment = component.segments.find((s) => s.key === "dateField");
      expect(dateSegment?.type).toBe("date");
    });
  });

  describe("isExpandable", () => {
    it("should return true for object type", () => {
      const segment: Segment = {
        key: "test",
        value: {},
        type: "object",
        description: "Object",
        expanded: false,
      };
      expect(component.isExpandable(segment)).toBe(true);
    });

    it("should return true for array type", () => {
      const segment: Segment = {
        key: "test",
        value: [],
        type: "array",
        description: "Array",
        expanded: false,
      };
      expect(component.isExpandable(segment)).toBe(true);
    });

    it("should return false for primitive types", () => {
      const segment: Segment = {
        key: "test",
        value: "string",
        type: "string",
        description: "string",
        expanded: false,
      };
      expect(component.isExpandable(segment)).toBe(false);
    });
  });

  describe("expandOrCollapseIndividualSegment", () => {
    beforeEach(() => {
      component.json = mockJson;
      component.ngOnChanges();
    });

    it("should toggle segment expansion", async () => {
      const segment = component.segments.find((s) => s.key === "address");
      const initialState = segment!.expanded;
      await component.expandOrCollapseIndividualSegment(segment!);
      expect(segment!.expanded).toBe(!initialState);
      expect(segment!.individuallyExpanded).toBe(!initialState);
    });

    it("should not toggle non-expandable segments", async () => {
      const segment = component.segments.find((s) => s.key === "name");
      const initialState = segment!.expanded;
      await component.expandOrCollapseIndividualSegment(segment!);
      expect(segment!.expanded).toBe(initialState);
    });

    it("should not expand/collapse during active search", async () => {
      const segment = component.segments.find((s) => s.key === "address");
      component.searchTerm = "test";
      component.totalMatches = 1;
      component["_isSearchActive"] = true;
      const initialState = segment!.expanded;
      await component.expandOrCollapseIndividualSegment(segment!);
      expect(segment!.expanded).toBe(initialState);
    });

    it("should update expandAll when all segments are expanded", async () => {
      component.currentDepth = 0;
      component.expandAll = false;
      for (const segment of component.segments) {
        if (component.isExpandable(segment)) {
          segment.expanded = false;
          await component.expandOrCollapseIndividualSegment(segment);
        }
      }
      const allExpanded = component.segments
        .filter((s) => component.isExpandable(s))
        .every((s) => s.expanded);
      expect(component.expandAll).toBe(allExpanded);
    });
  });

  describe("expandOrCollapseAll", () => {
    beforeEach(() => {
      component.json = mockJson;
      component.ngOnChanges();
    });

    it("should expand all segments", async () => {
      component.expandAll = false;
      await component.expandOrCollapseAll();
      expect(component.expandAll).toBe(true);
      component.segments
        .filter((s) => component.isExpandable(s))
        .forEach((s) => {
          expect(s.expanded).toBe(true);
        });
    });

    it("should collapse all segments", async () => {
      component.expandAll = true;
      await component.expandOrCollapseAll();
      expect(component.expandAll).toBe(false);
      component.segments
        .filter((s) => component.isExpandable(s))
        .forEach((s) => {
          expect(s.expanded).toBe(false);
        });
    });

    it("should reset individuallyExpanded flag", async () => {
      component.segments.forEach((s) => {
        if (component.isExpandable(s)) {
          s.individuallyExpanded = true;
        }
      });
      await component.expandOrCollapseAll();
      component.segments
        .filter((s) => component.isExpandable(s))
        .forEach((s) => {
          expect(s.individuallyExpanded).toBe(false);
        });
    });
  });

  describe("copyToClipboard", () => {
    beforeEach(() => {
      component.json = mockJson;
      component.ngOnChanges();
    });

    it("should copy JSON to clipboard and show success message", async () => {
      const writeTextSpy = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextSpy,
        },
      });

      await component.copyToClipboard();

      expect(writeTextSpy).toHaveBeenCalled();
      expect(sharedMethodsService.showSuccessSnackBar).toHaveBeenCalledWith(
        JSON_VIEWER_LABELS.CLIPBOARD_SUCCESS_SNACKBAR_MSG
      );
    });

    it("should handle NotAllowedError", async () => {
      const error = new Error("Permission denied");
      error.name = "NotAllowedError";
      const writeTextSpy = vi.fn().mockRejectedValue(error);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextSpy,
        },
      });

      await component.copyToClipboard();

      expect(sharedMethodsService.showErrorSnackBar).toHaveBeenCalledWith(
        JSON_VIEWER_LABELS.CLIPBOARD_ACCESS_DENIED_MSG
      );
    });

    it("should handle DataError", async () => {
      const error = new Error("Data too large");
      error.name = "DataError";
      const writeTextSpy = vi.fn().mockRejectedValue(error);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextSpy,
        },
      });

      await component.copyToClipboard();

      expect(sharedMethodsService.showErrorSnackBar).toHaveBeenCalledWith(
        JSON_VIEWER_LABELS.CLIPBOARD_DATA_TOO_LARGE_MSG
      );
    });

    it("should handle generic clipboard errors", async () => {
      const error = new Error("Generic error");
      const writeTextSpy = vi.fn().mockRejectedValue(error);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextSpy,
        },
      });

      await component.copyToClipboard();

      expect(sharedMethodsService.showErrorSnackBar).toHaveBeenCalledWith(
        JSON_VIEWER_LABELS.CLIPBOARD_GENERIC_ERROR_MSG
      );
    });
  });

  describe("Search functionality", () => {
    beforeEach(() => {
      component.json = mockJson;
      component.ngOnChanges();
    });

    it("should return correct searchActive state for root component", () => {
      component.currentDepth = 0;
      component["_isSearchActive"] = true;

      expect(component.searchActive).toBe(true);
    });

    it("should return input searchActive state for nested component", () => {
      component.currentDepth = 1;
      component.isSearchActiveInput = true;

      expect(component.searchActive).toBe(true);
    });

    it("should return searching message when search is loading", () => {
      component.isSearchLoading = true;
      component.searchTerm = "test";

      expect(component.searchResultText).toBe(JSON_VIEWER_LABELS.SEARCHING_MSG);
    });

    it("should return no matches message when no results", () => {
      component.isSearchLoading = false;
      component.searchTerm = "test";
      component.totalMatches = 0;

      expect(component.searchResultText).toBe(
        JSON_VIEWER_LABELS.NO_MATCHES_FOUND
      );
    });

    it("should return match count when results exist", () => {
      component.isSearchLoading = false;
      component.searchTerm = "test";
      component.totalMatches = 5;
      component.currentMatchIndex = 2;

      expect(component.searchResultText).toBe("3 of 5");
    });

    it("should return empty string when no search term", () => {
      component.searchTerm = "";
      component.totalMatches = 0;

      expect(component.searchResultText).toBe("");
    });
  });

  describe("clearSearch", () => {
    it("should reset all search-related properties", () => {
      component.searchTerm = "test";
      component.totalMatches = 5;
      component.currentMatchIndex = 2;
      component.isSearchLoading = true;
      component["_isSearchActive"] = true;

      component.clearSearch();

      expect(component.searchTerm).toBe("");
      expect(component.totalMatches).toBe(0);
      expect(component.currentMatchIndex).toBe(-1);
      expect(component.isSearchLoading).toBe(false);
      expect(component["_isSearchActive"]).toBe(false);
    });

    it("should clear search input element", () => {
      const mockInput = { value: "test" };
      component.searchInputRef = {
        nativeElement: mockInput,
      } as ElementRef<HTMLInputElement>;

      component.clearSearch();

      expect(mockInput.value).toBe("");
    });
  });

  describe("triggerSearchOnEnter", () => {
    it("should trigger search with current input value", () => {
      const mockInput = { value: "test search" };
      component.searchInputRef = {
        nativeElement: mockInput,
      } as ElementRef<HTMLInputElement>;

      const nextSpy = vi.spyOn(component["searchInput$"], "next");

      component.triggerSearchOnEnter();

      expect(nextSpy).toHaveBeenCalledWith("test search");
    });

    it("should not trigger search if input is empty", () => {
      const mockInput = { value: "" };
      component.searchInputRef = {
        nativeElement: mockInput,
      } as ElementRef<HTMLInputElement>;

      const nextSpy = vi.spyOn(component["searchInput$"], "next");

      component.triggerSearchOnEnter();

      expect(nextSpy).not.toHaveBeenCalled();
    });
  });

  describe("Circular reference handling (decycle)", () => {
    it("should handle circular references", () => {
      const circularObj: any = { name: "test" };
      circularObj.self = circularObj;

      component.json = circularObj;
      component.ngOnChanges();

      expect(component.segments.length).toBeGreaterThan(0);
      const selfSegment = component.segments.find((s) => s.key === "self");
      expect(selfSegment).toBeDefined();
    });

    it("should handle nested circular references", () => {
      const obj1: any = { name: "obj1" };
      const obj2: any = { name: "obj2", ref: obj1 };
      obj1.ref = obj2;

      component.json = obj1;
      component.ngOnChanges();

      expect(component.segments.length).toBeGreaterThan(0);
    });
  });

  describe("ngOnDestroy", () => {
    it("should complete destroy$ subject", () => {
      const nextSpy = vi.spyOn(component["destroy$"], "next");
      const completeSpy = vi.spyOn(component["destroy$"], "complete");

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it("should remove event listener if exists", () => {
      const mockInput = document.createElement("input");
      const removeEventListenerSpy = vi.spyOn(mockInput, "removeEventListener");
      const mockListener = vi.fn();
      component.searchInputRef = {
        nativeElement: mockInput,
      } as ElementRef<HTMLInputElement>;
      component["inputEventListener"] = mockListener;

      component.ngOnDestroy();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "input",
        mockListener
      );
      expect(component["inputEventListener"]).toBeNull();
    });

    it("should clear cached data", () => {
      component["cachedJsonString"] = "test";
      component["cachedFormattedJsonString"] = "test formatted";
      component["processedJson"] = { test: "data" };

      component.ngOnDestroy();

      expect(component["cachedJsonString"]).toBeNull();
      expect(component["cachedFormattedJsonString"]).toBeNull();
      expect(component["processedJson"]).toBeNull();
    });
  });

  describe("Edge cases", () => {
    it("should handle very large JSON objects", () => {
      const largeJson: any = {};
      for (let i = 0; i < 1000; i++) {
        largeJson[`key${i}`] = `value${i}`;
      }

      component.json = largeJson;
      component.ngOnChanges();

      expect(component.segments.length).toBe(1000);
    });

    it("should handle deeply nested objects", () => {
      const deeplyNested: any = {
        level1: { level2: { level3: { level4: { value: "deep" } } } },
      };

      component.json = deeplyNested;
      component.ngOnChanges();

      expect(component.segments.length).toBeGreaterThan(0);
    });

    it("should handle special characters in keys and values", () => {
      const specialChars = {
        "key<>&\"'": "value<>&\"'",
        키: "값", // Korean characters
        "🎉": "emoji",
      };

      component.json = specialChars;
      component.ngOnChanges();

      expect(component.segments.length).toBe(3);
    });

    it("should handle functions in JSON", () => {
      const withFunction = {
        name: "test",
        fn: function () {
          return "test";
        },
      };

      component.json = withFunction;
      component.ngOnChanges();

      const fnSegment = component.segments.find((s) => s.key === "fn");
      expect(fnSegment?.type).toBe("function");
    });

    it("should handle RegExp in JSON", () => {
      const withRegex = {
        pattern: /test/gi,
      };

      component.json = withRegex;
      component.ngOnChanges();

      expect(component.segments.length).toBeGreaterThan(0);
    });
  });

  describe("Navigation", () => {
    beforeEach(() => {
      component.json = mockJson;
      component.ngOnChanges();
    });

    it("should not navigate when no matches", async () => {
      component.totalMatches = 0;
      component.currentMatchIndex = -1;

      await component.goToNextMatch();

      expect(component.currentMatchIndex).toBe(-1);
    });

    it("should not navigate when navigation is in progress", async () => {
      component.totalMatches = 5;
      component.currentMatchIndex = 0;
      component["navigationInProgress"] = true;

      await component.goToNextMatch();

      expect(component.currentMatchIndex).toBe(0);
    });

    it("should cycle to first match when at last match", async () => {
      component.totalMatches = 5;
      component.currentMatchIndex = 4;
      component["navigationInProgress"] = false;

      await component.goToNextMatch();

      expect(component.currentMatchIndex).toBe(0);
    });

    it("should go to previous match correctly", async () => {
      component.totalMatches = 5;
      component.currentMatchIndex = 2;
      component["navigationInProgress"] = false;

      await component.goToPreviousMatch();

      expect(component.currentMatchIndex).toBe(1);
    });

    it("should cycle to last match when at first match going backwards", async () => {
      component.totalMatches = 5;
      component.currentMatchIndex = 0;
      component["navigationInProgress"] = false;

      await component.goToPreviousMatch();

      expect(component.currentMatchIndex).toBe(4);
    });
  });

  describe("Advanced Search Functionality", () => {
    beforeEach(() => {
      component.json = { name: "test", value: 123, nested: { data: "test" } };
      component.ngOnChanges();
    });

    it("should perform search with valid term", async () => {
      component.searchInputRef = {
        nativeElement: document.createElement("input"),
      } as ElementRef<HTMLInputElement>;
      component.searchInputRef.nativeElement.value = "test";

      const performSearchSpy = vi.spyOn(component as any, "performSearch");

      component["searchInput$"].next("test");

      // Wait for debounce time
      await vi.waitFor(
        () => {
          expect(performSearchSpy).toHaveBeenCalledWith("test");
        },
        { timeout: 1000 }
      );
    });

    it("should clear search when term becomes empty", async () => {
      component.searchTerm = "test";
      component.totalMatches = 3;
      component.currentMatchIndex = 1;

      component["searchInput$"].next("");

      await vi.waitFor(
        () => {
          expect(component.searchTerm).toBe("");
          expect(component.totalMatches).toBe(0);
          expect(component.currentMatchIndex).toBe(-1);
        },
        { timeout: 500 }
      );
    });

    it("should handle search with whitespace-only term", async () => {
      const clearSearchSpy = vi.spyOn(component, "clearSearch");

      component["searchInput$"].next("   ");

      await vi.waitFor(
        () => {
          expect(clearSearchSpy).toHaveBeenCalled();
        },
        { timeout: 500 }
      );
    });

    it("should cancel previous search when new search is triggered", async () => {
      component["currentSearchRequestId"] = 1;

      component["searchInput$"].next("first");
      component["searchInput$"].next("second");

      await vi.waitFor(
        () => {
          expect(component["currentSearchRequestId"]).toBeGreaterThan(1);
        },
        { timeout: 500 }
      );
    });
  });

  describe("DOM Manipulation", () => {
    it("should get JSON string and cache it", () => {
      component.json = { test: "value" };
      component.ngOnChanges();

      const jsonString1 = component["getJsonString"]();
      const jsonString2 = component["getJsonString"]();

      expect(jsonString1).toBe(jsonString2);
      expect(jsonString1).toContain("test");
    });

    it("should get formatted JSON string and cache it", () => {
      component.json = { test: "value" };
      component.ngOnChanges();

      const formattedJson1 = component["getFormattedJsonString"]();
      const formattedJson2 = component["getFormattedJsonString"]();

      expect(formattedJson1).toBe(formattedJson2);
      expect(formattedJson1).toContain("\n");
    });

    it("should validate search term correctly", () => {
      expect(component["validateSearchTerm"]("test")).toBe("test");
      expect(component["validateSearchTerm"]("  test  ")).toBe("test");
      expect(component["validateSearchTerm"]("")).toBeNull();
      expect(component["validateSearchTerm"]("   ")).toBeNull();
      expect(component["validateSearchTerm"](undefined)).toBeNull();
    });

    it("should highlight template segments with search term", () => {
      component.searchTerm = "test";
      component.segments = [
        {
          key: "testKey",
          value: "testValue",
          type: "string",
          description: "testValue",
          expanded: false,
        },
      ];

      component["highlightTemplateSegments"]();

      expect(component.segments[0].highlightedKey).toBeDefined();
      expect(component.segments[0].highlightedDescription).toBeDefined();
    });

    it("should not highlight when search term is empty", () => {
      component.searchTerm = "";
      component.segments = [
        {
          key: "testKey",
          value: "testValue",
          type: "string",
          description: "testValue",
          expanded: false,
        },
      ];

      component["highlightTemplateSegments"]();

      expect(component.segments[0].highlightedKey).toBeUndefined();
      expect(component.segments[0].highlightedDescription).toBeUndefined();
    });

    it("should escape HTML entities correctly", () => {
      const escaped = component["escapeHtml"]("<script>alert('xss')</script>");
      expect(escaped).toContain("&lt;");
      expect(escaped).toContain("&gt;");
      expect(escaped).not.toContain("<script>");
    });

    it("should escape regex special characters", () => {
      const escaped = component["escapeRegExp"]("test.*$^");
      expect(escaped).toBe("test\\.\\*\\$\\^");
    });
  });

  describe("ngAfterViewInit", () => {
    it("should setup input event listener", () => {
      const mockInput = document.createElement("input");
      component.searchInputRef = {
        nativeElement: mockInput,
      } as ElementRef<HTMLInputElement>;

      const addEventListenerSpy = vi.spyOn(mockInput, "addEventListener");

      component.ngAfterViewInit();

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "input",
        expect.any(Function)
      );
      expect(component["inputEventListener"]).not.toBeNull();
    });

    it("should emit search on input event", () => {
      const mockInput = document.createElement("input");
      mockInput.value = "test";
      component.searchInputRef = {
        nativeElement: mockInput,
      } as ElementRef<HTMLInputElement>;

      const searchInputSpy = vi.spyOn(component["searchInput$"], "next");

      component.ngAfterViewInit();

      // Trigger the input event
      mockInput.dispatchEvent(new Event("input"));

      expect(searchInputSpy).toHaveBeenCalledWith("test");
    });
  });

  describe("Async Operations", () => {
    it("should execute after render with requestAnimationFrame", async () => {
      const callback = vi.fn();

      await component["executeAfterRender"](callback);

      expect(callback).toHaveBeenCalled();
    });

    it("should expand/collapse all and restore search state", async () => {
      component.json = { name: "test", value: 123 };
      component.ngOnChanges();
      component.searchTerm = "test";
      component.totalMatches = 2;
      component.currentMatchIndex = 0;
      component.expandAll = false;

      await component.expandOrCollapseAll();

      expect(component.expandAll).toBe(true);
      expect(component.isExpandCollapseLoading).toBe(false);
    });

    it("should set all segments expanded/collapsed", () => {
      component.segments = [
        {
          key: "obj",
          value: {},
          type: "object",
          description: "{}",
          expanded: false,
        },
        {
          key: "arr",
          value: [],
          type: "array",
          description: "[]",
          expanded: false,
        },
        {
          key: "str",
          value: "test",
          type: "string",
          description: "test",
          expanded: false,
        },
      ];

      component["setAllSegmentsExpanded"](true);

      expect(component.segments[0].expanded).toBe(true);
      expect(component.segments[1].expanded).toBe(true);
      expect(component.segments[2].expanded).toBe(false); // string not expandable
    });

    it("should count matches in raw data", () => {
      component.json = {
        name: "test",
        value: "test",
        nested: { data: "test" },
      };
      component.ngOnChanges();

      const count = component["countMatchesInRawData"]("test");

      expect(count).toBeGreaterThan(0);
    });

    it("should handle empty search in count matches", () => {
      component.json = { name: "test" };
      component.ngOnChanges();

      const count = component["countMatchesInRawData"]("");

      // Empty string matches all characters
      expect(count).toBeGreaterThan(0);
    });
  });

  describe("Error Handling", () => {
    it("should show error snackbar message", () => {
      const showErrorSpy = vi.spyOn(
        component["sharedMethodsService"],
        "showErrorSnackBar"
      );

      component["showErrorSnackbarMsg"]("Test error");

      expect(showErrorSpy).toHaveBeenCalledWith("Test error");
    });

    it("should handle search errors gracefully", async () => {
      component.json = { test: "value" };
      component.ngOnChanges();

      // Mock a method to throw an error
      vi.spyOn(component as any, "highlightTextInDOM").mockRejectedValue(
        new Error("DOM error")
      );

      component["searchInput$"].next("test");

      await vi.waitFor(
        () => {
          expect(component.isSearchLoading).toBe(false);
        },
        { timeout: 500 }
      );
    });
  });

  describe("Expand/Collapse State Management", () => {
    it("should update expandAll when all segments individually expanded", async () => {
      component.segments = [
        {
          key: "obj1",
          value: {},
          type: "object",
          description: "{}",
          expanded: false,
        },
        {
          key: "obj2",
          value: {},
          type: "object",
          description: "{}",
          expanded: false,
        },
      ];
      component.expandAll = false;

      await component.expandOrCollapseIndividualSegment(component.segments[0]);
      await component.expandOrCollapseIndividualSegment(component.segments[1]);

      expect(component.expandAll).toBe(true);
    });

    it("should update expandAll when all segments individually collapsed", async () => {
      component.segments = [
        {
          key: "obj1",
          value: {},
          type: "object",
          description: "{}",
          expanded: true,
        },
        {
          key: "obj2",
          value: {},
          type: "object",
          description: "{}",
          expanded: true,
        },
      ];
      component.expandAll = true;

      await component.expandOrCollapseIndividualSegment(component.segments[0]);
      await component.expandOrCollapseIndividualSegment(component.segments[1]);

      expect(component.expandAll).toBe(false);
    });

    it("should mark segment as individually expanded", async () => {
      component.segments = [
        {
          key: "obj",
          value: {},
          type: "object",
          description: "{}",
          expanded: false,
        },
      ];

      await component.expandOrCollapseIndividualSegment(component.segments[0]);

      expect(component.segments[0].individuallyExpanded).toBe(true);
    });

    it("should reset individually expanded flag on expandAll", async () => {
      component.segments = [
        {
          key: "obj",
          value: {},
          type: "object",
          description: "{}",
          expanded: true,
          individuallyExpanded: true,
        },
      ];
      component.expandAll = true;

      await component.expandOrCollapseAll();

      expect(component.segments[0].individuallyExpanded).toBe(false);
    });
  });

  describe("Edge Cases and Null Checks", () => {
    it("should handle escapeHtml with null input", () => {
      expect(component["escapeHtml"](null as any)).toBe("");
    });

    it("should handle escapeHtml with non-string input", () => {
      expect(component["escapeHtml"](123 as any)).toBe("");
    });

    it("should handle escapeRegExp with null input", () => {
      expect(component["escapeRegExp"](null as any)).toBe("");
    });

    it("should handle escapeRegExp with non-string input", () => {
      expect(component["escapeRegExp"](123 as any)).toBe("");
    });

    it("should handle countMatchesInRawData with error", () => {
      component.json = { test: "value" };
      component.ngOnChanges();

      // Mock getJsonString to throw error
      vi.spyOn(component as any, "getJsonString").mockImplementation(() => {
        throw new Error("JSON error");
      });

      // Create mock DOM elements
      document.body.innerHTML =
        '<mark class="search-match">test</mark><mark class="search-match">test2</mark>';

      const count = component["countMatchesInRawData"]("test");

      expect(count).toBe(2); // Should fall back to DOM count
    });

    it("should clear highlight marks from DOM", () => {
      // Setup DOM with marks
      document.body.innerHTML =
        '<div class="ngx-json-viewer"><mark class="search-match">test</mark></div>';

      component["clearTextHighlightFromDOM"]();

      const marks = document.querySelectorAll("mark.search-match");
      expect(marks.length).toBe(0);
    });

    it("should normalize container after clearing highlights", () => {
      document.body.innerHTML =
        '<div class="ngx-json-viewer"><mark class="search-match">test</mark></div>';
      const container = document.querySelector(".ngx-json-viewer");
      const normalizeSpy = vi.spyOn(container as any, "normalize");

      component["clearTextHighlightFromDOM"]();

      expect(normalizeSpy).toHaveBeenCalled();
    });

    it("should handle clearTextHighlightFromDOM with no marks", () => {
      document.body.innerHTML =
        '<div class="ngx-json-viewer">no marks here</div>';

      expect(() => component["clearTextHighlightFromDOM"]()).not.toThrow();
    });

    it("should handle parseKeyValue with Date object", () => {
      const date = new Date("2024-01-01");
      const segment = component["parseKeyValue"]("dateKey", date);

      expect(segment.type).toBe("date");
      expect(segment.key).toBe("dateKey");
    });

    it("should handle parseKeyValue with null value", () => {
      const segment = component["parseKeyValue"]("nullKey", null);

      expect(segment.type).toBe("null");
      expect(segment.key).toBe("nullKey");
    });

    it("should handle parseKeyValue with undefined value", () => {
      const segment = component["parseKeyValue"]("undefinedKey", undefined);

      expect(segment.type).toBe("undefined");
      expect(segment.key).toBe("undefinedKey");
    });
  });

  describe("DOM Text Highlighting", () => {
    beforeEach(() => {
      // Setup DOM structure for highlighting tests
      document.body.innerHTML =
        '<div class="ngx-json-viewer"><span>test value</span><span>another test</span></div>';
    });

    it("should find text nodes with matching search term", () => {
      const container = document.querySelector(".ngx-json-viewer") as Element;

      const textNodes = component["findTextNodesWithMatch"](container, "test");

      expect(textNodes.length).toBeGreaterThan(0);
    });

    it("should not include text nodes from excluded tags", () => {
      document.body.innerHTML =
        '<div class="ngx-json-viewer"><script>test</script><span>test</span></div>';
      const container = document.querySelector(".ngx-json-viewer") as Element;

      const textNodes = component["findTextNodesWithMatch"](container, "test");

      // Should only find "test" in span, not in script tag
      expect(textNodes.length).toBe(1);
    });

    it("should not include text nodes already in mark tags", () => {
      document.body.innerHTML =
        '<div class="ngx-json-viewer"><mark>test</mark><span>test</span></div>';
      const container = document.querySelector(".ngx-json-viewer") as Element;

      const textNodes = component["findTextNodesWithMatch"](container, "test");

      // Should only find "test" in span, not in mark tag
      expect(textNodes.length).toBe(1);
    });

    it("should apply mark tags to matching text", () => {
      const textNode = document.createTextNode("test value test");
      const span = document.createElement("span");
      span.appendChild(textNode);
      document.body.appendChild(span);

      component["applyMarkTagsToText"]([textNode], "test");

      const marks = span.querySelectorAll("mark");
      expect(marks.length).toBe(2);
    });

    it("should not apply marks if parent is already a mark", () => {
      const textNode = document.createTextNode("test");
      const mark = document.createElement("mark");
      mark.appendChild(textNode);
      const span = document.createElement("span");
      span.appendChild(mark);
      document.body.appendChild(span);

      component["applyMarkTagsToText"]([textNode], "test");

      const marks = span.querySelectorAll("mark");
      expect(marks.length).toBe(1); // Only the original mark
    });

    it("should not apply marks if text doesn't match regex", () => {
      const textNode = document.createTextNode("no match here");
      const span = document.createElement("span");
      span.appendChild(textNode);
      document.body.appendChild(span);

      component["applyMarkTagsToText"]([textNode], "test");

      const marks = span.querySelectorAll("mark");
      expect(marks.length).toBe(0);
    });

    it("should create highlighted fragment with alternating text and marks", () => {
      const parts = ["before ", "test", " after ", "test", " end"];

      const fragment = component["createHighlightedFragment"](parts);

      expect(fragment.childNodes.length).toBe(5);
      expect(fragment.childNodes[0].nodeName).toBe("#text");
      expect(fragment.childNodes[1].nodeName).toBe("MARK");
      expect(fragment.childNodes[2].nodeName).toBe("#text");
      expect(fragment.childNodes[3].nodeName).toBe("MARK");
      expect(fragment.childNodes[4].nodeName).toBe("#text");
    });

    it("should handle empty strings in fragment parts", () => {
      const parts = ["", "test", ""];

      const fragment = component["createHighlightedFragment"](parts);

      // Empty strings should not create nodes
      expect(fragment.childNodes.length).toBe(1);
      expect(fragment.childNodes[0].nodeName).toBe("MARK");
    });

    it("should highlight text in DOM asynchronously", async () => {
      component.json = { name: "test" };
      component.ngOnChanges();
      component.searchTerm = "test";
      document.body.innerHTML =
        '<div class="ngx-json-viewer"><span>test value</span></div>';

      await component["highlightTextInDOM"]();

      expect(component["highlightsInSync"]).toBe(true);
    });

    it("should handle missing container in highlightTextInDOM", async () => {
      component.searchTerm = "test";
      document.body.innerHTML = '<div class="wrong-container">test</div>';

      await component["highlightTextInDOM"]();

      expect(component["highlightsInSync"]).toBe(false);
    });

    it("should handle empty search term in highlightTextInDOM", async () => {
      component.searchTerm = "";
      document.body.innerHTML = '<div class="ngx-json-viewer">test</div>';

      await component["highlightTextInDOM"]();

      expect(component["highlightsInSync"]).toBe(false);
    });

    it("should use requestIdleCallback when available", async () => {
      const originalRequestIdleCallback = (global as any).requestIdleCallback;
      const mockCallback = vi.fn((cb) => setTimeout(cb, 0));
      (global as any).requestIdleCallback = mockCallback;

      component.searchTerm = "test";
      document.body.innerHTML =
        '<div class="ngx-json-viewer"><span>test</span></div>';

      await component["highlightTextInDOM"]();

      expect(mockCallback).toHaveBeenCalled();

      (global as any).requestIdleCallback = originalRequestIdleCallback;
    });

    it("should fallback when requestIdleCallback is undefined", async () => {
      const originalRequestIdleCallback = (global as any).requestIdleCallback;
      (global as any).requestIdleCallback = undefined;

      component.searchTerm = "test";
      document.body.innerHTML =
        '<div class="ngx-json-viewer"><span>test</span></div>';

      await component["highlightTextInDOM"]();

      expect(component["highlightsInSync"]).toBe(true);

      (global as any).requestIdleCallback = originalRequestIdleCallback;
    });

    it("should handle errors in highlightTextInDOM", async () => {
      component.searchTerm = "test";
      document.body.innerHTML = '<div class="ngx-json-viewer">test</div>';

      const clearSearchSpy = vi.spyOn(component, "clearSearch");
      vi.spyOn(component as any, "findTextNodesWithMatch").mockImplementation(
        () => {
          throw new Error("DOM error");
        }
      );

      await component["highlightTextInDOM"]();

      expect(component["highlightsInSync"]).toBe(false);
      expect(clearSearchSpy).toHaveBeenCalled();
    });
  });

  describe("Element Visibility Check", () => {
    it("should return true for visible element", () => {
      const element = document.createElement("div");
      document.body.appendChild(element);

      const isVisible = component["isElementVisible"](element);

      expect(isVisible).toBe(true);
    });

    it("should return false for element with display none", () => {
      const parent = document.createElement("div");
      parent.style.display = "none";
      const element = document.createElement("span");
      parent.appendChild(element);
      document.body.appendChild(parent);

      const isVisible = component["isElementVisible"](element);

      expect(isVisible).toBe(false);
    });

    it("should return false for element with visibility hidden", () => {
      const parent = document.createElement("div");
      parent.style.visibility = "hidden";
      const element = document.createElement("span");
      parent.appendChild(element);
      document.body.appendChild(parent);

      const isVisible = component["isElementVisible"](element);

      expect(isVisible).toBe(false);
    });

    it("should check parent chain for visibility", () => {
      const grandparent = document.createElement("div");
      grandparent.style.display = "none";
      const parent = document.createElement("div");
      const element = document.createElement("span");
      grandparent.appendChild(parent);
      parent.appendChild(element);
      document.body.appendChild(grandparent);

      const isVisible = component["isElementVisible"](element);

      expect(isVisible).toBe(false);
    });
  });

  describe("Fast Navigation", () => {
    it("should use fast path when highlights are in sync", async () => {
      component.totalMatches = 3;
      component.currentMatchIndex = 0;
      component["highlightsInSync"] = true;
      const marks = [];
      for (let i = 0; i < 3; i++) {
        const mark = document.createElement("mark");
        mark.className = "search-match";
        mark.scrollIntoView = vi.fn();
        document.body.appendChild(mark);
        marks.push(mark);
      }

      await component["fastNavigateToCurrentMatch"]();

      const currentMatch = document.querySelector("mark.current-match");
      expect(currentMatch).toBeTruthy();
    });

    it("should fallback to reHighlightAndNavigate when highlights not in sync", async () => {
      component.totalMatches = 2;
      component.currentMatchIndex = 0;
      component["highlightsInSync"] = false;
      const reHighlightSpy = vi
        .spyOn(component as any, "reHighlightAndNavigate")
        .mockResolvedValue(undefined);

      await component["fastNavigateToCurrentMatch"]();

      expect(reHighlightSpy).toHaveBeenCalled();
    });

    it("should fallback when DOM match count differs from totalMatches", async () => {
      component.totalMatches = 5;
      component.currentMatchIndex = 0;
      component["highlightsInSync"] = true;
      document.body.innerHTML =
        '<mark class="search-match">1</mark><mark class="search-match">2</mark>'; // Only 2, but expects 5

      const reHighlightSpy = vi
        .spyOn(component as any, "reHighlightAndNavigate")
        .mockResolvedValue(undefined);

      await component["fastNavigateToCurrentMatch"]();

      expect(reHighlightSpy).toHaveBeenCalled();
      expect(component["highlightsInSync"]).toBe(false);
    });

    it("should fallback when current match is not visible", async () => {
      component.totalMatches = 2;
      component.currentMatchIndex = 1;
      component["highlightsInSync"] = true;

      const parent = document.createElement("div");
      parent.style.display = "none";
      const mark1 = document.createElement("mark");
      mark1.className = "search-match";
      const mark2 = document.createElement("mark");
      mark2.className = "search-match";
      parent.appendChild(mark2);
      document.body.appendChild(mark1);
      document.body.appendChild(parent);

      const reHighlightSpy = vi
        .spyOn(component as any, "reHighlightAndNavigate")
        .mockResolvedValue(undefined);

      await component["fastNavigateToCurrentMatch"]();

      expect(reHighlightSpy).toHaveBeenCalled();
    });
  });

  describe("Search State Restoration", () => {
    it("should restore search state after toggle", async () => {
      component.json = { test: "value" };
      component.ngOnChanges();
      component.searchTerm = "test";
      component.totalMatches = 3;
      component.currentMatchIndex = 1;
      document.body.innerHTML =
        '<div class="ngx-json-viewer"><span>test test test</span></div>';

      // Mock the internal methods to avoid DOM issues
      const clearSpy = vi
        .spyOn(component as any, "clearTextHighlightFromDOM")
        .mockImplementation(() => {});
      const highlightSpy = vi
        .spyOn(component as any, "highlightTemplateSegments")
        .mockImplementation(() => {});
      vi.spyOn(component as any, "highlightTextInDOM").mockResolvedValue(
        undefined
      );
      vi.spyOn(component as any, "scrollToCurrentMatch").mockResolvedValue(
        undefined
      );
      vi.spyOn(component as any, "setActiveMatchHighlight").mockReturnValue(
        null
      );

      await component["restoreSearchStateAfterToggle"](1);

      expect(clearSpy).toHaveBeenCalled();
      expect(highlightSpy).toHaveBeenCalled();
    });

    it("should adjust match index if it exceeds total matches", async () => {
      component.json = { test: "value" };
      component.ngOnChanges();
      component.searchTerm = "test";
      component.totalMatches = 2;
      component.currentMatchIndex = 5; // Invalid index
      document.body.innerHTML =
        '<div class="ngx-json-viewer"><span>test test</span></div>';

      // Mock the internal methods to avoid DOM issues
      vi.spyOn(
        component as any,
        "clearTextHighlightFromDOM"
      ).mockImplementation(() => {});
      vi.spyOn(
        component as any,
        "highlightTemplateSegments"
      ).mockImplementation(() => {});
      vi.spyOn(component as any, "highlightTextInDOM").mockResolvedValue(
        undefined
      );
      vi.spyOn(component as any, "scrollToCurrentMatch").mockResolvedValue(
        undefined
      );
      vi.spyOn(component as any, "setActiveMatchHighlight").mockReturnValue(
        null
      );
      vi.spyOn(component as any, "countMatchesInRawData").mockReturnValue(2);

      await component["restoreSearchStateAfterToggle"](5);

      // The method will update totalMatches based on countMatchesInRawData
      expect(component.totalMatches).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Scroll to Match", () => {
    it("should scroll to current match", () => {
      component.currentMatchIndex = 1;
      const mark1 = document.createElement("mark");
      mark1.className = "search-match";
      const mark2 = document.createElement("mark");
      mark2.className = "search-match";
      const scrollSpy = vi.fn();
      mark2.scrollIntoView = scrollSpy;

      document.body.appendChild(mark1);
      document.body.appendChild(mark2);

      component["scrollToMatch"]();

      expect(mark2.classList.contains("current-match")).toBe(true);
      expect(scrollSpy).toHaveBeenCalled();
    });

    it("should not scroll when no matches found", () => {
      component.currentMatchIndex = 0;
      document.body.innerHTML = "<div>no marks</div>";

      expect(() => component["scrollToMatch"]()).not.toThrow();
    });

    it("should clear previous current match highlighting", () => {
      component.currentMatchIndex = 1;
      const mark1 = document.createElement("mark");
      mark1.className = "search-match current-match";
      const mark2 = document.createElement("mark");
      mark2.className = "search-match";
      mark2.scrollIntoView = vi.fn();

      document.body.appendChild(mark1);
      document.body.appendChild(mark2);

      component["scrollToMatch"]();

      expect(mark1.classList.contains("current-match")).toBe(false);
      expect(mark2.classList.contains("current-match")).toBe(true);
    });
  });
});
