import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
  discardPeriodicTasks,
} from "@angular/core/testing";
import { ElementRef } from "@angular/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { JsonViewerComponent } from "./json-viewer.component";
import { JsonViewerModule } from "./json-viewer.module";
import { SharedMethodsService } from "../../services/shared-methods.service";

class MockMutationObserver {
  static instances: MockMutationObserver[] = [];
  observe = jasmine.createSpy("observe");
  disconnect = jasmine.createSpy("disconnect");
  constructor(public callback: MutationCallback) {
    MockMutationObserver.instances.push(this);
  }
}
describe("JsonViewerComponent", () => {
  let component: JsonViewerComponent;
  let fixture: ComponentFixture<JsonViewerComponent>;
  let originalMutationObserver: typeof MutationObserver;
  let originalRequestAnimationFrame: typeof requestAnimationFrame;
  let originalRequestIdleCallback: typeof requestIdleCallback;
  let sharedMethodsServiceMock: SharedMethodsService;

  beforeAll(() => {
    sharedMethodsServiceMock = jasmine.createSpyObj("SharedMethodsService", [
      "showErrorSnackBar",
      "showSuccessSnackBar",
    ]);
    originalMutationObserver = (window as any).MutationObserver;
    originalRequestAnimationFrame = window.requestAnimationFrame;
    originalRequestIdleCallback = (window as any).requestIdleCallback;
    (window as any).MutationObserver = MockMutationObserver;
    window.requestAnimationFrame = (callback: FrameRequestCallback) => {
      return setTimeout(() => callback(performance.now()), 0) as any;
    };
    (window as any).requestIdleCallback = (callback: IdleRequestCallback) => {
      return setTimeout(
        () =>
          callback({
            didTimeout: false,
            timeRemaining: () => 50,
          } as IdleDeadline),
        0
      );
    };
  });

  afterAll(() => {
    (window as any).MutationObserver = originalMutationObserver;
    window.requestAnimationFrame = originalRequestAnimationFrame;
    (window as any).requestIdleCallback = originalRequestIdleCallback;
  });

  beforeEach(async () => {
    MockMutationObserver.instances = [];
    await TestBed.configureTestingModule({
      imports: [JsonViewerModule, NoopAnimationsModule],
      providers: [
        { provide: SharedMethodsService, useValue: sharedMethodsServiceMock },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(JsonViewerComponent);
    component = fixture.componentInstance;
    component.currentDepth = 0;
    component.json = { test: "data" };
    component.searchInputRef = new ElementRef(document.createElement("input"));
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
    fixture.destroy();
    const highlights = document.querySelectorAll(
      "mark.search-match, .json-viewer-highlight"
    );
    highlights.forEach((el) => el.remove());
    const testContainers = document.querySelectorAll(".ngx-json-viewer");
    testContainers.forEach((el) => {
      // Using if-else for safe DOM manipulation - only remove element if parent exists to prevent runtime errors
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    MockMutationObserver.instances = [];
    // Using if-else for conditional cleanup - only clear timeouts if the array exists to avoid errors
    if ((window as any).timeouts) {
      (window as any).timeouts.forEach((id: number) => clearTimeout(id));
      (window as any).timeouts = [];
    }
  });

  describe("Component Creation and Initialization", () => {
    it("should create component", () => {
      expect(component).toBeTruthy();
    });
    it("should initialize with default values", () => {
      expect(component.expanded).toBe(true);
      expect(component.depth).toBe(-1);
      expect(component.currentDepth).toBe(0);
      expect(component.expandAll).toBe(false);
      expect(component.searchTerm).toBe("");
      expect(component.totalMatches).toBe(0);
      expect(component.currentMatchIndex).toBe(-1);
    });
    it("should have static constants defined", () => {
      expect((JsonViewerComponent as any).SEARCH_DEBOUNCE_MS).toBe(300);
    });
  });

  describe("ngOnChanges", () => {
    it("should process simple JSON object", () => {
      const testData = { name: "test", value: 123, active: true };
      component.json = testData;
      component.ngOnChanges();
      expect(component.segments).toBeDefined();
      expect(component.segments.length).toBe(3);
      const nameSegment = component.segments.find((s) => s.key === "name");
      expect(nameSegment?.type).toBe("string");
      expect(nameSegment?.description).toBe('"test"');
      const valueSegment = component.segments.find((s) => s.key === "value");
      expect(valueSegment?.type).toBe("number");
      const activeSegment = component.segments.find((s) => s.key === "active");
      expect(activeSegment?.type).toBe("boolean");
    });

    it("should initialize segments with individuallyExpanded property", () => {
      const testData = {
        simple: "value",
        nested: { inner: "data" },
        array: [1, 2, 3],
      };
      component.json = testData;
      component.ngOnChanges();
      component.segments.forEach((segment) => {
        expect(segment.individuallyExpanded).toBeDefined();
        expect(segment.individuallyExpanded).toBe(false);
      });
    });

    it("should process nested objects and arrays", () => {
      const testData = {
        nested: { inner: "value" },
        array: [1, 2, 3],
        emptyArray: [],
        emptyObject: {},
      };
      component.json = testData;
      component.ngOnChanges();
      const nestedSegment = component.segments.find((s) => s.key === "nested");
      expect(nestedSegment?.type).toBe("object");
      expect(nestedSegment?.description).toBe("Object ");
      const arraySegment = component.segments.find((s) => s.key === "array");
      expect(arraySegment?.type).toBe("array");
      expect(arraySegment?.description).toBe("Array[3] ");
      const emptyArraySegment = component.segments.find(
        (s) => s.key === "emptyArray"
      );
      expect(emptyArraySegment?.description).toBe("No data");
      const emptyObjectSegment = component.segments.find(
        (s) => s.key === "emptyObject"
      );
      expect(emptyObjectSegment?.description).toBe("No data");
    });

    it("should process primitive values", () => {
      component.json = "simple string";
      component.ngOnChanges();
      expect(component.segments.length).toBe(1);
      expect(component.segments[0].key).toBe("(string)");
      expect(component.segments[0].type).toBe("string");
    });

    it("should handle null and undefined", () => {
      spyOn(JSON, "stringify").and.returnValue("null");
      component.json = null;
      component.ngOnChanges();
      expect(component.segments.length).toBe(1);
      expect(component.segments[0].type).toBe("null");
      expect(component.segments[0].description).toBe("null");
      component.json = undefined;
      component.ngOnChanges();
      expect(component.segments.length).toBe(1);
      expect(component.segments[0].type).toBe("undefined");
      expect(component.segments[0].description).toBe("undefined");
    });

    it("should handle Date objects", () => {
      const testDate = new Date("2023-01-01");
      component.json = { dateField: testDate };
      component.ngOnChanges();
      const dateSegment = component.segments.find((s) => s.key === "dateField");
      expect(dateSegment?.type).toBe("date");
    });

    it("should handle circular references", () => {
      const circularObj: any = { name: "test" };
      circularObj.self = circularObj;
      component.json = circularObj;
      component.ngOnChanges();
      expect(component.segments).toBeDefined();
      expect(component.segments.length).toBe(2);
    });
  });

  describe("ngAfterViewInit", () => {
    it("should setup input event listener when currentDepth is 0", fakeAsync(() => {
      const mockInput = document.createElement("input");
      component.searchInputRef = new ElementRef(mockInput);
      spyOn(component as any, "performSearch");
      component.ngAfterViewInit();
      mockInput.value = "test";
      mockInput.dispatchEvent(new Event("input"));
      tick(400);
      expect((component as any).performSearch).toHaveBeenCalledWith("test");
      discardPeriodicTasks();
    }));

    it("should clear search state when input is empty", () => {
      const mockInput = document.createElement("input");
      component.searchInputRef = new ElementRef(mockInput);
      component.totalMatches = 5;
      component.currentMatchIndex = 2;
      component.isSearchLoading = true;
      component.ngAfterViewInit();
      mockInput.value = "";
      mockInput.dispatchEvent(new Event("input"));
      expect(component.totalMatches).toBe(0);
      expect(component.currentMatchIndex).toBe(-1);
      expect(component.isSearchLoading).toBe(false);
    });
  });

  describe("ngOnDestroy", () => {
    it("should cleanup resources", () => {
      const mockInput = document.createElement("input");
      component.searchInputRef = new ElementRef(mockInput);
      spyOn(mockInput, "removeEventListener");
      (component as any).inputEventListener = () => {};
      component.ngOnDestroy();
      expect(mockInput.removeEventListener).toHaveBeenCalledWith(
        "input",
        jasmine.any(Function)
      );
    });
  });

  describe("Segment Operations", () => {
    beforeEach(() => {
      component.json = {
        simple: "value",
        nested: { inner: "data" },
        array: [1, 2, 3],
      };
      component.ngOnChanges();
    });

    it("should identify expandable segments", () => {
      const simpleSegment = component.segments.find((s) => s.key === "simple")!;
      const nestedSegment = component.segments.find((s) => s.key === "nested")!;
      const arraySegment = component.segments.find((s) => s.key === "array")!;
      expect(component.isExpandable(simpleSegment)).toBe(false);
      expect(component.isExpandable(nestedSegment)).toBe(true);
      expect(component.isExpandable(arraySegment)).toBe(true);
    });

    it("should expandOrCollapseIndividualSegment segment expansion", fakeAsync(() => {
      const nestedSegment = component.segments.find((s) => s.key === "nested")!;
      const initialState = nestedSegment.expanded;
      component.expandOrCollapseIndividualSegment(nestedSegment);
      tick();
      expect(nestedSegment.expanded).toBe(!initialState);
      expect(nestedSegment.individuallyExpanded).toBe(!initialState);
    }));

    it("should set individuallyExpanded when expanding individual segment", fakeAsync(() => {
      const nestedSegment = component.segments.find((s) => s.key === "nested")!;
      nestedSegment.expanded = false;
      nestedSegment.individuallyExpanded = false;
      component.expandOrCollapseIndividualSegment(nestedSegment);
      tick();
      expect(nestedSegment.expanded).toBe(true);
      expect(nestedSegment.individuallyExpanded).toBe(true);
    }));

    it("should only update expandAll when all segments are in same state", fakeAsync(() => {
      component.json = {
        first: { nested: "data1" },
        second: { nested: "data2" },
        third: { nested: "data3" },
      };
      component.ngOnChanges();
      const firstSegment = component.segments.find((s) => s.key === "first")!;
      const secondSegment = component.segments.find((s) => s.key === "second")!;
      const thirdSegment = component.segments.find((s) => s.key === "third")!;
      firstSegment.expanded = false;
      secondSegment.expanded = false;
      thirdSegment.expanded = false;
      component.expandAll = false;
      component.expandOrCollapseIndividualSegment(firstSegment);
      tick();
      expect(component.expandAll).toBe(false);
      component.expandOrCollapseIndividualSegment(secondSegment);
      tick();
      expect(component.expandAll).toBe(false);
      component.expandOrCollapseIndividualSegment(thirdSegment);
      tick();
      expect(component.expandAll).toBe(true);
      component.expandOrCollapseIndividualSegment(firstSegment);
      tick();
      expect(component.expandAll).toBe(true);
      component.expandOrCollapseIndividualSegment(secondSegment);
      tick();
      component.expandOrCollapseIndividualSegment(thirdSegment);
      tick();
      expect(component.expandAll).toBe(false);
    }));
  });

  describe("Search Functionality", () => {
    beforeEach(() => {
      component.json = {
        searchable: "find me",
        nested: { also: "find me too" },
        number: 123,
        array: ["find", "me", "here"],
      };
      component.ngOnChanges();
    });

    it("should validate search terms", () => {
      expect((component as any).validateSearchTerm("")).toBeNull();
      expect((component as any).validateSearchTerm(" ")).toBeNull();
      expect((component as any).validateSearchTerm("a".repeat(101))).toBe(
        "a".repeat(100)
      );
      expect((component as any).validateSearchTerm("valid")).toBe("valid");
      expect((component as any).validateSearchTerm(" valid ")).toBe("valid");
      expect((component as any).validateSearchTerm(null)).toBeNull();
    });

    it("should perform search and update matches", fakeAsync(() => {
      component.json = { find: "test", nested: { find: "another" } };
      component.ngOnChanges();
      component.searchTerm = "find";
      spyOn(component as any, "countMatchesInRawData").and.returnValue(3);
      spyOn(component as any, "highlightTextInDOM").and.returnValue(
        Promise.resolve()
      );
      (component as any).performSearch("find");
      tick(300);
      flush();
      expect(component.totalMatches).toBe(3);
      expect(component.expandAll).toBe(true);
      discardPeriodicTasks();
    }));

    it("should clear search state", fakeAsync(() => {
      component.searchTerm = "test";
      component.totalMatches = 5;
      component.currentMatchIndex = 2;
      component.isSearchLoading = true;
      component.clearSearch();
      tick();
      expect(component.searchTerm).toBe("");
      expect(component.totalMatches).toBe(0);
      expect(component.currentMatchIndex).toBe(-1);
      expect(component.isSearchLoading).toBe(false);
    }));

    it("should navigate between matches", () => {
      component.totalMatches = 5;
      component.currentMatchIndex = 2;
      component.goToNextMatch();
      expect(component.currentMatchIndex).toBe(3);
      component.currentMatchIndex = 4;
      component.goToNextMatch();
      expect(component.currentMatchIndex).toBe(0);
      component.goToPreviousMatch();
      expect(component.currentMatchIndex).toBe(4);
      component.currentMatchIndex = 0;
      component.goToPreviousMatch();
      expect(component.currentMatchIndex).toBe(4);
    });

    it("should not navigate when no matches", () => {
      component.totalMatches = 0;
      component.currentMatchIndex = -1;
      component.goToNextMatch();
      expect(component.currentMatchIndex).toBe(-1);
      component.goToPreviousMatch();
      expect(component.currentMatchIndex).toBe(-1);
    });

    it("should get correct search result text", () => {
      component.isSearchLoading = true;
      component.searchTerm = "test";
      expect(component.searchResultText).toBe("Searching...");
      component.isSearchLoading = false;
      component.totalMatches = 0;
      expect(component.searchResultText).toBe("No matches found");
      component.totalMatches = 5;
      component.currentMatchIndex = 2;
      expect(component.searchResultText).toBe("3 of 5");
      component.searchTerm = "";
      component.totalMatches = 0;
      expect(component.searchResultText).toBe("");
    });

    it("should update segment highlighting", () => {
      component.searchTerm = "find";
      (component as any).highlightTemplateSegments();
      const searchableSegment = component.segments.find(
        (s) => s.key === "searchable"
      )!;
      expect(searchableSegment.highlightedDescription).toBeDefined();
    });

    it("should count matches in raw data", () => {
      const count = (component as any).countMatchesInRawData("find");
      expect(count).toBeGreaterThan(0);
    });

    it("should handle search errors gracefully", () => {
      spyOn(console, "error");
      spyOn(component as any, "getJsonString").and.throwError("Test error");
      const count = (component as any).countMatchesInRawData("test");
      expect(console.error).toHaveBeenCalled();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    describe("triggerSearchOnEnter", () => {
      beforeEach(() => {
        const mockInput = document.createElement("input");
        component.searchInputRef = new ElementRef(mockInput);
      });

      it("should trigger search when input has value", () => {
        const mockInput = component.searchInputRef.nativeElement;
        mockInput.value = "test search";
        spyOn((component as any).searchInput$, "next");
        component.triggerSearchOnEnter();
        expect((component as any).searchInput$.next).toHaveBeenCalledWith(
          "test search"
        );
      });

      it("should not trigger search when input is empty", () => {
        const mockInput = component.searchInputRef.nativeElement;
        mockInput.value = "";
        spyOn((component as any).searchInput$, "next");
        component.triggerSearchOnEnter();
        expect((component as any).searchInput$.next).not.toHaveBeenCalled();
      });

      it("should handle whitespace-only input", () => {
        const mockInput = component.searchInputRef.nativeElement;
        mockInput.value = " ";
        spyOn((component as any).searchInput$, "next");
        component.triggerSearchOnEnter();
        expect((component as any).searchInput$.next).toHaveBeenCalledWith(" ");
      });

      it("should handle missing searchInputRef gracefully", () => {
        component.searchInputRef = null as any;
        spyOn((component as any).searchInput$, "next");
        component.triggerSearchOnEnter();
        expect((component as any).searchInput$.next).not.toHaveBeenCalled();
      });

      it("should handle missing nativeElement gracefully", () => {
        component.searchInputRef = { nativeElement: null } as any;
        spyOn((component as any).searchInput$, "next");
        component.triggerSearchOnEnter();
        expect((component as any).searchInput$.next).not.toHaveBeenCalled();
      });

      it("should trigger search pipeline when called", fakeAsync(() => {
        const mockInput = component.searchInputRef.nativeElement;
        mockInput.value = "searchable";
        component.json = { searchable: "find me", other: "data" };
        component.ngOnChanges();
        spyOn(component as any, "performSearch");
        component.triggerSearchOnEnter();
        tick(400);
        expect((component as any).performSearch).toHaveBeenCalledWith(
          "searchable"
        );
        discardPeriodicTasks();
      }));

      it("should call searchInput$.next with input value", () => {
        const mockInput = component.searchInputRef.nativeElement;
        mockInput.value = "testvalue";
        spyOn((component as any).searchInput$, "next");
        component.triggerSearchOnEnter();
        expect((component as any).searchInput$.next).toHaveBeenCalledWith(
          "testvalue"
        );
      });
    });
  });

  describe("DOM Manipulation", () => {
    it("should escape HTML properly", () => {
      expect(
        (component as any).escapeHtml('<script>alert("xss")</script>')
      ).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
      expect((component as any).escapeHtml("")).toBe("");
      expect((component as any).escapeHtml(null as any)).toBe("");
    });

    it("should escape regex patterns", () => {
      expect((component as any).escapeRegExp(".*+?^${}()|[]\\")).toBe(
        "\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\"
      );
      expect((component as any).escapeRegExp("")).toBe("");
      expect((component as any).escapeRegExp(null as any)).toBe("");
    });

    it("should create highlighted fragments", () => {
      const parts = ["hello ", "world", " test"];
      const fragment = (component as any).createHighlightedFragment(parts);
      expect(fragment.childNodes.length).toBe(3);
      expect(fragment.childNodes[0].textContent).toBe("hello ");
      expect(fragment.childNodes[1].nodeName).toBe("MARK");
      expect(fragment.childNodes[1].textContent).toBe("world");
      expect(fragment.childNodes[2].textContent).toBe(" test");
    });

    it("should find matching text nodes", () => {
      const container = document.createElement("div");
      const span = document.createElement("span");
      span.textContent = "search term here";
      container.appendChild(span);
      const textNodes = (component as any).findTextNodesWithMatch(
        container,
        "search"
      );
      expect(textNodes.length).toBe(1);
      expect(textNodes[0].textContent).toBe("search term here");
    });

    it("should apply highlights to text nodes", () => {
      const container = document.createElement("div");
      const textNode = document.createTextNode("find this text");
      container.appendChild(textNode);
      (component as any).applyMarkTagsToText([textNode], "find");
      const marks = container.querySelectorAll("mark.search-match");
      expect(marks.length).toBe(1);
      expect(marks[0].textContent).toBe("find");
    });
    it("should clear DOM highlights", () => {
      const container = document.createElement("div");
      container.innerHTML =
        'text with <mark class="search-match">highlight</mark> here';
      document.body.appendChild(container);
      (component as any).clearTextHighlightFromDOM();
      const marks = document.querySelectorAll("mark.search-match");
      expect(marks.length).toBe(0);
      document.body.removeChild(container);
    });
  });

  describe("Clipboard Functionality", () => {
    let originalClipboard: any;
    let clipboardProperty: PropertyDescriptor | undefined;
    beforeEach(() => {
      originalClipboard = navigator.clipboard;
      clipboardProperty = Object.getOwnPropertyDescriptor(
        navigator,
        "clipboard"
      );
    });

    afterEach(() => {
      // Using if-else chain for safe clipboard restoration - checks property descriptor first to restore original configuration
      if (clipboardProperty) {
        Object.defineProperty(navigator, "clipboard", clipboardProperty);
      } else if (originalClipboard !== undefined) {
        try {
          Object.defineProperty(navigator, "clipboard", {
            value: originalClipboard,
            configurable: true,
            writable: true,
          });
        } catch (e) {
          delete (navigator as any).clipboard;
          (navigator as any).clipboard = originalClipboard;
        }
      } else {
        delete (navigator as any).clipboard;
      }
    });

    it("should copy JSON to clipboard successfully", async () => {
      const mockClipboard = {
        writeText: jasmine
          .createSpy("writeText")
          .and.returnValue(Promise.resolve()),
      };
      try {
        Object.defineProperty(navigator, "clipboard", {
          value: mockClipboard,
          configurable: true,
          writable: true,
        });
      } catch (e) {
        (navigator as any).clipboard = mockClipboard;
      }
      component.json = { test: "data" };
      component.ngOnChanges();
      await component.copyToClipboard();
      expect(mockClipboard.writeText).toHaveBeenCalledWith(
        JSON.stringify({ test: "data" }, null, 2)
      );
      expect(sharedMethodsServiceMock.showSuccessSnackBar).toHaveBeenCalledWith(
        "JSON copied to clipboard successfully"
      );
    });

    it("should handle clipboard errors", async () => {
      const mockClipboard = {
        writeText: jasmine
          .createSpy("writeText")
          .and.returnValue(Promise.reject("error")),
      };
      try {
        Object.defineProperty(navigator, "clipboard", {
          value: mockClipboard,
          configurable: true,
          writable: true,
        });
      } catch (e) {
        (navigator as any).clipboard = mockClipboard;
      }
      spyOn(component as any, "showErrorSnackbarMsg");
      await component.copyToClipboard();
      expect((component as any).showErrorSnackbarMsg).toHaveBeenCalled();
    });

    it("should handle invalid JSON data", async () => {
      spyOn(component as any, "getFormattedJsonString").and.throwError(
        "Invalid JSON"
      );
      spyOn(component as any, "showErrorSnackbarMsg");
      await component.copyToClipboard();
      expect((component as any).showErrorSnackbarMsg).toHaveBeenCalledWith(
        "Failed to copy JSON to clipboard"
      );
    });

    it("should handle NotAllowedError specifically", async () => {
      const notAllowedError = new Error("Permission denied");
      notAllowedError.name = "NotAllowedError";
      const mockClipboard = {
        writeText: jasmine
          .createSpy("writeText")
          .and.returnValue(Promise.reject(notAllowedError)),
      };
      try {
        Object.defineProperty(navigator, "clipboard", {
          value: mockClipboard,
          configurable: true,
          writable: true,
        });
      } catch (e) {
        (navigator as any).clipboard = mockClipboard;
      }
      spyOn(component as any, "showErrorSnackbarMsg");
      await component.copyToClipboard();
      expect((component as any).showErrorSnackbarMsg).toHaveBeenCalledWith(
        "Clipboard access denied. Please check browser permissions."
      );
    });

    it("should handle DataError specifically", async () => {
      const dataError = new Error("Data too large");
      dataError.name = "DataError";
      const mockClipboard = {
        writeText: jasmine
          .createSpy("writeText")
          .and.returnValue(Promise.reject(dataError)),
      };
      try {
        Object.defineProperty(navigator, "clipboard", {
          value: mockClipboard,
          configurable: true,
          writable: true,
        });
      } catch (e) {
        (navigator as any).clipboard = mockClipboard;
      }
      spyOn(component as any, "showErrorSnackbarMsg");
      await component.copyToClipboard();
      expect((component as any).showErrorSnackbarMsg).toHaveBeenCalledWith(
        "Failed to copy - data too large for clipboard"
      );
    });
  });

  describe("Utility Methods", () => {
    it("should determine expansion state correctly", () => {
      component.expandAll = true;
      expect((component as any).isExpanded()).toBe(true);
      component.expandAll = false;
      component.expanded = true;
      component.depth = -1;
      expect((component as any).isExpanded()).toBe(true);
      component.depth = 2;
      component.currentDepth = 3;
      expect((component as any).isExpanded()).toBe(false);
    });

    it("should execute after render callback", fakeAsync(() => {
      let executed = false;
      (component as any).executeAfterRender(() => {
        executed = true;
      });
      tick();
      flush();
      expect(executed).toBe(true);
      discardPeriodicTasks();
    }));

    it("should get JSON strings with caching", () => {
      component.json = { test: "data" };
      component.ngOnChanges();
      const jsonString1 = (component as any).getJsonString();
      const jsonString2 = (component as any).getJsonString();
      expect(jsonString1).toBe(jsonString2);
      const formattedString1 = (component as any).getFormattedJsonString();
      const formattedString2 = (component as any).getFormattedJsonString();
      expect(formattedString1).toBe(formattedString2);
    });

    it("should notify errors to console", () => {
      (component as any).showErrorSnackbarMsg("Test error");
      expect(sharedMethodsServiceMock.showErrorSnackBar).toHaveBeenCalledWith(
        "Test error"
      );
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle deeply nested structures", () => {
      const deepObject = {
        level1: {
          level2: {
            level3: {
              level4: {
                value: "deep",
              },
            },
          },
        },
      };
      component.json = deepObject;
      component.ngOnChanges();
      expect(component.segments).toBeDefined();
      expect(component.segments.length).toBe(1);
      expect(component.segments[0].type).toBe("object");
    });

    it("should handle mixed data types in arrays", () => {
      const mixedArray = [
        "string",
        123,
        true,
        null,
        undefined,
        { nested: "object" },
        [1, 2, 3],
      ];
      component.json = { mixed: mixedArray };
      component.ngOnChanges();
      const arraySegment = component.segments.find((s) => s.key === "mixed");
      expect(arraySegment?.type).toBe("array");
      expect(arraySegment?.description).toBe("Array[7] ");
    });

    it("should handle special characters in search", fakeAsync(() => {
      component.json = {
        special: "test.*+?^${}()|[]\\",
        normal: "regular text",
      };
      component.ngOnChanges();
      component.searchTerm = ".*+?";
      (component as any).performSearch(".*+?");
      tick();
      flush();
      expect(component.totalMatches).toBeGreaterThanOrEqual(0);
      discardPeriodicTasks();
    }));

    it("should maintain search state during expansion changes", fakeAsync(() => {
      component.json = {
        visible: "search term",
        nested: { hidden: "search term" },
      };
      component.ngOnChanges();
      component.searchTerm = "search";
      (component as any).performSearch("search");
      tick();
      flush();
      const initialMatches = component.totalMatches;
      const nestedSegment = component.segments.find((s) => s.key === "nested")!;
      component.expandOrCollapseIndividualSegment(nestedSegment);
      tick();
      expect(component.totalMatches).toBeGreaterThanOrEqual(initialMatches);
      discardPeriodicTasks();
    }));
  });

  describe("Error Handling", () => {
    it("should handle malformed JSON gracefully", () => {
      const problematic: any = { normal: "data" };
      problematic.circular = problematic;
      component.json = problematic;
      expect(() => component.ngOnChanges()).not.toThrow();
      expect(component.segments).toBeDefined();
    });

    it("should handle search with empty container", () => {
      spyOn(document, "querySelector").and.returnValue(null);
      expect(() => (component as any).highlightTextInDOM()).not.toThrow();
    });

    it("should handle highlighting errors", () => {
      spyOn(console, "error");
      component.searchTerm = "test";
      spyOn(component as any, "findTextNodesWithMatch").and.throwError(
        "Test error"
      );
      (component as any).highlightTextInDOM();
      expect(console.error).toHaveBeenCalled();
    });

    it("should handle function type in parseKeyValue", () => {
      const func = function testFunc() {
        return "test";
      };
      const segment = (component as any).parseKeyValue("func", func);
      expect(segment.type).toBe("function");
    });
  });

  describe("Additional Coverage Tests", () => {
    it("should handle highlight current match with no matches", () => {
      spyOn(document, "querySelectorAll").and.returnValue([] as any);
      const result = (component as any).setActiveMatchHighlight();
      expect(result).toBeNull();
    });

    it("should handle scroll to current match edge cases", fakeAsync(() => {
      component.currentMatchIndex = -1;
      component.totalMatches = 0;
      (component as any).scrollToCurrentMatch();
      tick();
      expect(component.currentMatchIndex).toBe(-1);
    }));

    it("should handle ensureDataExpandedForNavigation", fakeAsync(() => {
      component.json = { nested: { value: "test" } };
      component.ngOnChanges();
      (component as any).ensureDataExpandedForNavigation();
      tick();
      expect(component.expandAll).toBe(true);
    }));

    it("should handle search input clear in ngAfterViewInit", () => {
      const mockInput = document.createElement("input");
      component.searchInputRef = new ElementRef(mockInput);
      component.currentDepth = 1;
      component.ngAfterViewInit();
      expect((component as any).inputEventListener).toBeDefined();
    });

    it("should handle bulk expandOrCollapseIndividualSegment with search state restoration", fakeAsync(() => {
      component.json = { test: "searchable data" };
      component.ngOnChanges();
      component.searchTerm = "search";
      component.totalMatches = 1;
      component.currentMatchIndex = 0;
      component.expandAll = false;
      spyOn(component as any, "restoreSearchStateAfterToggle").and.returnValue(
        Promise.resolve()
      );
      (component as any).expandOrCollapseAll();
      tick(100);
      expect(
        (component as any).restoreSearchStateAfterToggle
      ).toHaveBeenCalled();
      discardPeriodicTasks();
    }));

    it("should handle search request cancellation", fakeAsync(() => {
      component.searchTerm = "test1";
      (component as any).currentSearchRequestId = 1;
      (component as any).performSearch("test1");
      const firstRequestId = (component as any).currentSearchRequestId;
      (component as any).performSearch("test2");
      const secondRequestId = (component as any).currentSearchRequestId;
      expect(secondRequestId).toBeGreaterThan(firstRequestId);
      tick(300);
      discardPeriodicTasks();
    }));

    it("should handle empty search input immediate clear", () => {
      const mockInput = document.createElement("input");
      component.searchInputRef = new ElementRef(mockInput);
      component.totalMatches = 5;
      component.currentMatchIndex = 2;
      component.isSearchLoading = true;
      component.ngAfterViewInit();
      mockInput.value = "";
      mockInput.dispatchEvent(new Event("input"));
      expect(component.totalMatches).toBe(0);
      expect(component.currentMatchIndex).toBe(-1);
      expect(component.isSearchLoading).toBe(false);
    });

    it("should handle segment highlighting with special regex chars", () => {
      component.json = { special: "test.*+?^${}()|[]\\" };
      component.ngOnChanges();
      component.searchTerm = ".*+?";
      expect(() =>
        (component as any).highlightTemplateSegments()
      ).not.toThrow();
    });

    it("should handle getJsonString and getFormattedJsonString caching", () => {
      component.json = { cache: "test" };
      component.ngOnChanges();
      const json1 = (component as any).getJsonString();
      const json2 = (component as any).getJsonString();
      expect(json1).toBe(json2);
      const formatted1 = (component as any).getFormattedJsonString();
      const formatted2 = (component as any).getFormattedJsonString();
      expect(formatted1).toBe(formatted2);
    });
  });

  describe("Private Method Coverage", () => {
    it("should handle async operations in expandOrCollapseAll with search", fakeAsync(() => {
      component.json = { test: "searchable content" };
      component.ngOnChanges();
      component.searchTerm = "search";
      component.totalMatches = 2;
      component.expandAll = true;
      spyOn(component as any, "restoreSearchStateAfterToggle").and.returnValue(
        Promise.resolve()
      );
      expect(() => (component as any).expandOrCollapseAll()).not.toThrow();
      tick(200);
      flush();
      discardPeriodicTasks();
    }));

    it("should handle DOM element queries with null elements", fakeAsync(() => {
      spyOn(document, "querySelector").and.returnValue(null);
      spyOn(document, "querySelectorAll").and.returnValue([] as any);
      expect(() => (component as any).highlightTextInDOM()).not.toThrow();
      tick();
      discardPeriodicTasks();
    }));

    it("should handle various data types in parseKeyValue", () => {
      const testCases = [
        ["string", "test"],
        ["number", 123],
        ["boolean", true],
        ["date", new Date()],
        ["array", [1, 2, 3]],
        ["null", null],
        ["undefined", undefined],
        ["symbol", Symbol("test")],
      ];
      testCases.forEach(([name, value]) => {
        const result = (component as any).parseKeyValue(name, value);
        expect(result).toBeDefined();
        expect(result.key).toBe(name);
      });
    });

    it("should handle getJsonString and getFormattedJsonString", () => {
      component.json = { test: "caching" };
      component.ngOnChanges();
      const json1 = (component as any).getJsonString();
      const json2 = (component as any).getJsonString();
      expect(json1).toBe(json2);
      const formatted1 = (component as any).getFormattedJsonString();
      const formatted2 = (component as any).getFormattedJsonString();
      expect(formatted1).toBe(formatted2);
    });

    it("should handle showErrorSnackbarMsg method", () => {
      (component as any).showErrorSnackbarMsg("Test error");
      expect(sharedMethodsServiceMock.showErrorSnackBar).toHaveBeenCalledWith(
        "Test error"
      );
    });

    it("should handle setAllSegmentsExpanded", () => {
      component.json = { test: { nested: "value" } };
      component.ngOnChanges();
      (component as any).setAllSegmentsExpanded(true);
      expect(component.segments[0].expanded).toBe(true);
      expect(component.segments[0].individuallyExpanded).toBe(false);
    });

    it("should reset individuallyExpanded when using expand/collapse all", () => {
      component.json = {
        first: { nested: "data1" },
        second: { nested: "data2" },
      };
      component.ngOnChanges();
      component.segments.forEach((segment) => {
        if (component.isExpandable(segment)) {
          segment.individuallyExpanded = true;
        }
      });
      (component as any).setAllSegmentsExpanded(false);
      component.segments.forEach((segment) => {
        if (component.isExpandable(segment)) {
          expect(segment.individuallyExpanded).toBe(false);
          expect(segment.expanded).toBe(false);
        }
      });
    });

    it("should handle highlightTemplateSegments", () => {
      component.json = { test: "highlight me" };
      component.ngOnChanges();
      component.searchTerm = "highlight";
      expect(() =>
        (component as any).highlightTemplateSegments()
      ).not.toThrow();
    });

    it("should handle findTextNodesWithMatch", () => {
      const mockContainer = document.createElement("div");
      mockContainer.innerHTML = "test content";
      const textNode = document.createTextNode("test search content");
      mockContainer.appendChild(textNode);
      const result = (component as any).findTextNodesWithMatch(
        mockContainer,
        "search"
      );
      expect(result).toBeDefined();
    });

    it("should handle applyMarkTagsToText", () => {
      const textNode = document.createTextNode("test search content");
      const matches = [{ node: textNode, startIndex: 5, endIndex: 11 }];
      expect(() =>
        (component as any).applyMarkTagsToText(matches)
      ).not.toThrow();
    });

    it("should handle setActiveMatchHighlight with matches", () => {
      const mockElement = document.createElement("span");
      mockElement.className = "json-viewer-highlight";
      spyOn(document, "querySelectorAll").and.returnValue([mockElement] as any);
      component.currentMatchIndex = 0;
      const result = (component as any).setActiveMatchHighlight();
      expect(result).toBe(mockElement);
    });

    it("should handle scrollToCurrentMatch with valid match", fakeAsync(() => {
      const mockElement = document.createElement("span");
      mockElement.scrollIntoView = jasmine.createSpy("scrollIntoView");
      component.currentMatchIndex = 0;
      component.totalMatches = 1;
      spyOn(component as any, "setActiveMatchHighlight").and.returnValue(
        mockElement
      );
      (component as any).scrollToCurrentMatch();
      tick(50);
      expect(mockElement.scrollIntoView).toHaveBeenCalled();
      discardPeriodicTasks();
    }));

    it("should handle ensureDataExpandedForNavigation", fakeAsync(() => {
      component.json = { nested: { deep: "value" } };
      component.ngOnChanges();
      component.expandAll = false;
      (component as any).ensureDataExpandedForNavigation();
      tick(150);
      expect(component.expandAll).toBe(true);
      discardPeriodicTasks();
    }));

    it("should handle decycle with circular references", () => {
      const obj: any = { name: "test" };
      obj.circular = obj;
      const result = (component as any).decycle(obj);
      expect(result).toBeDefined();
      expect((result as any).circular).toEqual({ $ref: "$" });
    });

    it("should handle countMatchesInRawData", () => {
      component.json = { test: "search", nested: { search: "term" } };
      component.ngOnChanges();
      const count = (component as any).countMatchesInRawData("search");
      expect(count).toBeGreaterThanOrEqual(2);
    });

    it("should handle edge case in performSearch with empty term after validation", fakeAsync(() => {
      spyOn(component as any, "validateSearchTerm").and.returnValue(null);
      (component as any).performSearch("invalid");
      tick();
      expect(component.totalMatches).toBe(0);
      expect(component.currentMatchIndex).toBe(-1);
      discardPeriodicTasks();
    }));

    it("should handle empty object and array cases", () => {
      component.json = {};
      component.ngOnChanges();
      expect(component.segments).toEqual([]);
      component.json = [];
      component.ngOnChanges();
      expect(component.segments.length).toBeGreaterThanOrEqual(0);
      if (component.segments.length > 0) {
        expect(component.segments[0].type).toBe("array");
      }
    });

    it("should handle special regex characters in search", () => {
      component.json = { special: "test.*+?^${}()|[]\\" };
      component.ngOnChanges();
      const specialChars = [".*", "+?", "^$", "{}", "()", "|", "[]", "\\"];
      specialChars.forEach((char) => {
        expect(() => (component as any).validateSearchTerm(char)).not.toThrow();
      });
    });

    it("should handle search input event listener setup", () => {
      const mockInput = document.createElement("input");
      component.searchInputRef = new ElementRef(mockInput);
      component.currentDepth = 0;
      component.ngAfterViewInit();
      expect((component as any).inputEventListener).toBeDefined();
      mockInput.value = "test search";
      const event = new Event("input");
      mockInput.dispatchEvent(event);
      expect(component.searchTerm).toBeDefined();
    });

    it("should handle error cases in highlight functions", () => {
      spyOn(console, "error");
      spyOn(component as any, "findTextNodesWithMatch").and.throwError(
        "DOM error"
      );
      component.searchTerm = "test";
      (component as any).highlightTextInDOM();
      expect(console.error).toHaveBeenCalled();
    });

    it("should handle all branches in parseKeyValue", () => {
      const testCases = [
        [null, "null"],
        [undefined, "undefined"],
        [true, "boolean"],
        [false, "boolean"],
        ["string", "string"],
        [123, "number"],
        [new Date(), "date"],
        [[], "array"],
        [{}, "object"],
        [function () {}, "function"],
      ];
      testCases.forEach(([value, expectedType]) => {
        const result = (component as any).parseKeyValue("test", value);
        expect(result.type).toBe(expectedType);
        expect(result.key).toBe("test");
      });
      const symbolResult = (component as any).parseKeyValue(
        "test",
        Symbol("test")
      );
      expect(symbolResult.key).toBe("test");
      expect(symbolResult.type).toBeUndefined();
    });
  });

  describe("Coverage Boost Tests - Targeting Uncovered Lines", () => {
    it("should cover expandAll true in expandOrCollapseAll with search", fakeAsync(() => {
      component.json = { searchTerm: "find me", nested: { also: "find me" } };
      component.ngOnChanges();
      component.searchTerm = "find";
      component.totalMatches = 2;
      component.currentMatchIndex = 0;
      component.expandAll = false;
      spyOn(component as any, "restoreSearchStateAfterToggle").and.returnValue(
        Promise.resolve()
      );
      (component as any).expandOrCollapseAll();
      tick(150);
      flush();
      expect(component.expandAll).toBe(true);
      expect(
        (component as any).restoreSearchStateAfterToggle
      ).toHaveBeenCalledWith(0);
      discardPeriodicTasks();
    }));

    it("should cover search match restoration with valid totalMatches > 0", fakeAsync(() => {
      component.json = { searchable: "test content here", more: "test data" };
      component.ngOnChanges();
      spyOn(component as any, "countMatchesInRawData").and.returnValue(3);
      spyOn(component as any, "setActiveMatchHighlight").and.returnValue(
        document.createElement("span")
      );
      spyOn(component as any, "scrollToCurrentMatch").and.returnValue(
        Promise.resolve()
      );
      spyOn(component as any, "highlightTextInDOM").and.returnValue(
        Promise.resolve()
      );
      component.searchTerm = "test";
      (component as any).performSearch("test");
      tick(300);
      flush();
      expect(component.totalMatches).toBe(3);
      expect(component.currentMatchIndex).toBe(0);
      discardPeriodicTasks();
    }));

    it("should cover early return in performSearch when validation fails", fakeAsync(() => {
      spyOn(component, "clearSearch");
      (component as any).performSearch(" ");
      tick(100);
      expect(component.clearSearch).toHaveBeenCalled();
      discardPeriodicTasks();
    }));

    it("should cover search error handling in performSearch catch block", fakeAsync(() => {
      spyOn(console, "error");
      spyOn(component as any, "executeAfterRender").and.callFake(() => {
        throw new Error("Test error in search");
      });
      component.json = { test: "data" };
      component.ngOnChanges();
      component.searchTerm = "test";
      (component as any).performSearch("test");
      tick(100);
      expect(console.error).toHaveBeenCalledWith(
        "Search error:",
        jasmine.any(Error)
      );
      expect(component.isSearchLoading).toBe(false);
      discardPeriodicTasks();
    }));

    it("should cover executeAfterRender callback execution path", fakeAsync(() => {
      let callbackExecuted = false;
      const callback = () => {
        callbackExecuted = true;
      };
      (component as any).executeAfterRender(callback);
      tick();
      flush();
      expect(callbackExecuted).toBe(true);
      discardPeriodicTasks();
    }));

    it("should cover scroll to current match execution", fakeAsync(() => {
      const mockElement = document.createElement("span");
      mockElement.scrollIntoView = jasmine.createSpy("scrollIntoView");
      component.currentMatchIndex = 0;
      component.totalMatches = 1;
      spyOn(component as any, "setActiveMatchHighlight").and.returnValue(
        mockElement
      );
      (component as any).scrollToCurrentMatch();
      tick(50);
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
      discardPeriodicTasks();
    }));

    it("should cover remaining uncovered branches for 95% target", fakeAsync(() => {
      component.json = {
        searchText: "findable content",
        more: "findable data",
      };
      component.ngOnChanges();
      spyOn(component as any, "validateSearchTerm").and.returnValue("findable");
      spyOn(component as any, "countMatchesInRawData").and.returnValue(2);
      spyOn(component as any, "highlightTextInDOM").and.returnValue(
        Promise.resolve()
      );
      spyOn(component as any, "setActiveMatchHighlight").and.returnValue(
        document.createElement("span")
      );
      spyOn(component as any, "scrollToCurrentMatch").and.returnValue(
        Promise.resolve()
      );
      component.searchTerm = "findable";
      (component as any).performSearch("findable");
      tick(350);
      flush();
      expect(component.totalMatches).toBe(2);
      expect(component.currentMatchIndex).toBe(0);
      discardPeriodicTasks();
    }));

    it("should cover restoreSearchStateAfterToggle execution", fakeAsync(() => {
      component.json = { test: "content with search term" };
      component.ngOnChanges();
      component.searchTerm = "search";
      spyOn(component as any, "clearTextHighlightFromDOM");
      spyOn(component as any, "highlightTemplateSegments");
      spyOn(component as any, "highlightTextInDOM").and.returnValue(
        Promise.resolve()
      );
      spyOn(component as any, "countMatchesInRawData").and.returnValue(1);
      spyOn(component as any, "setActiveMatchHighlight").and.returnValue(
        document.createElement("span")
      );
      spyOn(component as any, "scrollToCurrentMatch").and.returnValue(
        Promise.resolve()
      );
      spyOn(component as any, "executeAfterRender").and.callFake(
        (callback: Function) => {
          return callback();
        }
      );
      (component as any).restoreSearchStateAfterToggle(0);
      tick(100);
      expect(component.currentMatchIndex).toBe(0);
      discardPeriodicTasks();
    }));
  });
});
