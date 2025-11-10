import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
  NgZone,
} from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";
import { SharedMethodsService } from "../../services/shared-methods.service";
import { JSON_VIEWER_LABELS } from "./json.constant";

export interface Segment {
  key: string;
  value: unknown;
  type: string | undefined;
  description: string;
  expanded: boolean;
  individuallyExpanded?: boolean; // Track if this segment was expanded individually
  highlightedKey?: SafeHtml | string;
  highlightedDescription?: SafeHtml | string;
}

@Component({
  selector: "custom-nuxeo-json-viewer",
  templateUrl: "json-viewer.component.html",
  styleUrls: ["json-viewer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonViewerComponent
  implements OnChanges, OnDestroy, AfterViewInit
{
  @Input() json: unknown;
  @Input() expanded: boolean = true;
  @Input() depth: number = -1;
  @Input() currentDepth: number = 0;
  @Input() expandAll: boolean = false;
  @Input() isSearchActiveInput: boolean = false;
  @ViewChild("searchInput") searchInputRef!: ElementRef<HTMLInputElement>;
  segments: Segment[] = [];
  searchTerm: string = "";
  totalMatches: number = 0;
  currentMatchIndex: number = -1;
  private _isSearchActive: boolean = false;
  isExpandCollapseLoading: boolean = false;
  isSearchLoading: boolean = false;
  private static readonly SEARCH_DEBOUNCE_MS = 300;
  private processedJson: unknown = null;
  private cachedJsonString: string | null = null;
  private cachedFormattedJsonString: string | null = null;
  private destroy$ = new Subject<void>();
  private searchInput$ = new Subject<string>();
  private currentSearchRequestId: number = 0;
  private inputEventListener: ((event: Event) => void) | null = null;
  readonly JSON_VIEWER_LABELS = JSON_VIEWER_LABELS;

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly cdr: ChangeDetectorRef,
    private readonly ngZone: NgZone,
    private readonly sharedMethodsService: SharedMethodsService
  ) {
    this.searchInput$
      .pipe(
        debounceTime(JsonViewerComponent.SEARCH_DEBOUNCE_MS),
        takeUntil(this.destroy$)
      )
      .subscribe((searchTerm) => {
        this.ngZone.run(() => {
          const validatedTerm = this.validateSearchTerm(searchTerm);
          if (validatedTerm) {
            this.performSearch(validatedTerm);
          } else {
            this.clearSearch();
          }
        });
      });
  }

  get searchActive(): boolean {
    if (this.currentDepth > 0) {
      return this.isSearchActiveInput;
    }
    return this._isSearchActive;
  }

  get searchResultText(): string {
    if (this.isSearchLoading && this.searchTerm.trim())
      return JSON_VIEWER_LABELS.SEARCHING_MSG;
    if (
      !this.isSearchLoading &&
      this.searchTerm.trim() &&
      this.totalMatches === 0
    ) {
      return JSON_VIEWER_LABELS.NO_MATCHES_FOUND;
    }
    if (this.totalMatches > 0) {
      return `${this.currentMatchIndex + 1} of ${this.totalMatches}`;
    }
    return "";
  }

  ngAfterViewInit(): void {
    if (this.currentDepth === 0 && this.searchInputRef?.nativeElement) {
      this.inputEventListener = (event: Event) => {
        const value = (event.target as HTMLInputElement).value;
        this.searchTerm = value;

        // If input is cleared, immediately clear search state
        if (!value.trim()) {
          this.totalMatches = 0;
          this.currentMatchIndex = -1;
          this.isSearchLoading = false;
        }

        if (value.trim() && !this.isSearchLoading) {
          this.ngZone.run(() => {
            this.isSearchLoading = true;
            this.cdr.detectChanges();
          });
        }

        this.searchInput$.next(value);
      };

      //running change detection outside angular zone for better performance
      this.ngZone.runOutsideAngular(() => {
        this.searchInputRef.nativeElement.addEventListener(
          "input",
          this.inputEventListener!
        );
      });
    }
  }

  ngOnChanges() {
    this.segments = [];
    this.cachedJsonString = null;
    this.cachedFormattedJsonString = null;

    this.processedJson = this.decycle(this.json);

    if (typeof this.processedJson === "object" && this.processedJson !== null) {
      Object.keys(this.processedJson).forEach((key) => {
        this.segments.push(
          this.parseKeyValue(
            key,
            (this.processedJson as Record<string, unknown>)[key]
          )
        );
      });
    } else {
      this.segments.push(
        this.parseKeyValue(`(${typeof this.processedJson})`, this.processedJson)
      );
    }

    if (this.currentDepth === 0) {
      this.expandAll = this.expanded;
    }
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.inputEventListener && this.searchInputRef?.nativeElement) {
      this.searchInputRef.nativeElement.removeEventListener(
        "input",
        this.inputEventListener
      );
      this.inputEventListener = null;
    }

    // Clear cached data to help with garbage collection
    this.cachedJsonString = null;
    this.cachedFormattedJsonString = null;
    this.processedJson = null;
  }

  /**
   * Executes callback after DOM rendering completes using requestAnimationFrame.
   * More reliable than setTimeout for DOM-dependent operations.
   */
  private async executeAfterRender(callback: () => void): Promise<void> {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          callback();
          resolve();
        });
      });
    });
  }

  private getJsonString(): string {
    if (this.cachedJsonString === null) {
      this.cachedJsonString = JSON.stringify(this.processedJson);
    }
    return this.cachedJsonString;
  }

  private getFormattedJsonString(): string {
    if (this.cachedFormattedJsonString === null) {
      this.cachedFormattedJsonString = JSON.stringify(
        this.processedJson,
        null,
        2
      );
    }
    return this.cachedFormattedJsonString;
  }

  private showErrorSnackbarMsg(message: string): void {
    this.sharedMethodsService.showErrorSnackBar(message);
  }

  isExpandable(segment: Segment): boolean {
    return segment.type === "object" || segment.type === "array";
  }

  async expandOrCollapseIndividualSegment(segment: Segment): Promise<void> {
    // Disable individual segment operations during any active search
    if (this.searchActive) {
      return;
    }

    if (this.isExpandable(segment)) {
      segment.expanded = !segment.expanded;
      // Mark this segment as individually expanded/collapsed
      segment.individuallyExpanded = segment.expanded;

      // Only update expandAll state based on whether ALL segments are expanded/collapsed
      if (this.currentDepth === 0) {
        const expandableSegments = this.segments.filter((s) =>
          this.isExpandable(s)
        );
        const allExpanded = expandableSegments.every((s) => s.expanded);
        const allCollapsed = expandableSegments.every((s) => !s.expanded);

        if (allExpanded) {
          this.expandAll = true;
        } else if (allCollapsed) {
          this.expandAll = false;
        }
      }
      this.cdr.detectChanges();
    }
  }

  async expandOrCollapseAll(): Promise<void> {
    const expanded = !this.expandAll;
    const hasActiveSearch = this.searchTerm?.trim() && this.totalMatches > 0;
    const previousMatchIndex = hasActiveSearch ? this.currentMatchIndex : -1;

    this.isExpandCollapseLoading = true;
    this.cdr.markForCheck();

    // Use requestAnimationFrame instead of setTimeout for better performance
    await this.executeAfterRender(() => {
      this.expandAll = expanded;
      this.setAllSegmentsExpanded(expanded);
      this.isExpandCollapseLoading = false;
      this.cdr.detectChanges();
    });

    // If there's an active search, restore the current match after DOM updates
    if (hasActiveSearch && previousMatchIndex >= 0) {
      await this.restoreSearchStateAfterToggle(previousMatchIndex);
    }
  }

  private setAllSegmentsExpanded(expanded: boolean): void {
    this.segments.forEach((segment) => {
      if (this.isExpandable(segment)) {
        segment.expanded = expanded;
        segment.individuallyExpanded = false;
      }
    });
  }

  // Restores search highlights and navigation state after expand/collapse
  private async restoreSearchStateAfterToggle(
    previousMatchIndex: number
  ): Promise<void> {
    await this.executeAfterRender(async () => {
      this.clearTextHighlightFromDOM();
      this.highlightTemplateSegments();
      await this.highlightTextInDOM();

      this.totalMatches = this.countMatchesInRawData(this.searchTerm!.trim());
      if (this.totalMatches > 0) {
        this.currentMatchIndex = Math.min(
          previousMatchIndex,
          this.totalMatches - 1
        );

        await this.executeAfterRender(() => {
          this.setActiveMatchHighlight();
          this.cdr.markForCheck();
        });

        await this.scrollToCurrentMatch();
      }
    });
  }

  async copyToClipboard(): Promise<void> {
    try {
      const jsonString = this.getFormattedJsonString();
      await navigator.clipboard.writeText(jsonString);
      this.sharedMethodsService.showSuccessSnackBar(
        "JSON copied to clipboard successfully"
      );
    } catch (error) {
      // Handling both JSON serialization errors and clipboard API errors uniformly
      if (error instanceof Error && error.name === "NotAllowedError") {
        this.showErrorSnackbarMsg(
          "Clipboard access denied. Please check browser permissions."
        );
      } else if (error instanceof Error && error.name === "DataError") {
        this.showErrorSnackbarMsg(
          "Failed to copy - data too large for clipboard"
        );
      } else {
        this.showErrorSnackbarMsg("Failed to copy JSON to clipboard");
      }
    }
  }

  /**
   * Performs comprehensive search through JSON data with highlighting and navigation.
   * Handles DOM updates, match counting, and scrolling in coordinated async steps.
   *
   * @param term - Validated search term to find in JSON
   */
  private async performSearch(term: string): Promise<void> {
    const searchRequestId = ++this.currentSearchRequestId;
    if (!term?.trim()) {
      this.clearSearch();
      return;
    }

    this.isSearchLoading = true;
    this.totalMatches = 0;
    this.currentMatchIndex = -1;
    this.cdr.detectChanges();

    try {
      // Step 1: Clear previous highlights and prepare segments
      await this.executeAfterRender(() => {
        this.clearTextHighlightFromDOM();
        this.segments.forEach((segment) => {
          segment.highlightedKey = undefined;
          segment.highlightedDescription = undefined;
        });

        this.highlightTemplateSegments();
        this.cdr.detectChanges();
      });

      // Step 2: Apply DOM highlights and wait for completion
      await this.highlightTextInDOM();

      // Check if this search request has been cancelled before final operations
      if (searchRequestId !== this.currentSearchRequestId) {
        return;
      }

      // Step 3: Wait for DOM highlights to be applied before navigation
      await this.executeAfterRender(() => {
        this.totalMatches = this.countMatchesInRawData(term);

        if (this.totalMatches > 0) {
          // Only expand if we found matches
          this.expandAll = true;
          this.setAllSegmentsExpanded(true);
          this.currentMatchIndex = 0;
          this._isSearchActive = true;
          this.cdr.markForCheck();
        } else {
          this._isSearchActive = false;
        }

        this.isSearchLoading = false;
        this.cdr.detectChanges();
      });

      // Step 4: Wait for DOM expansion to complete, then reapply highlights and navigate
      if (this.totalMatches > 0) {
        await this.executeAfterRender(async () => {
          // Reapply highlights after DOM has stabilized from expansion
          await this.highlightTextInDOM();
          await this.scrollToCurrentMatch();
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      this.isSearchLoading = false;
      this.cdr.detectChanges();
    }
  }

  /**
   * Clears search state and removes all highlights from JSON viewer.
   * Resets search input, match counters, and cleans up DOM modifications.
   */
  clearSearch(): void {
    this.searchTerm = "";
    this.totalMatches = 0;
    this.currentMatchIndex = -1;
    this.isSearchLoading = false;
    this._isSearchActive = false;

    if (this.searchInputRef?.nativeElement) {
      this.searchInputRef.nativeElement.value = "";
    }

    this.cdr.markForCheck();

    if (!this.destroy$.closed) {
      requestAnimationFrame(() => {
        this.segments.forEach((segment) => {
          segment.highlightedKey = undefined;
          segment.highlightedDescription = undefined;
        });

        this.clearTextHighlightFromDOM();
        this.cdr.markForCheck();
      });
    }
  }

  /**
   * Triggers search using current input value when Enter key is pressed.
   * Reuses the existing search pipeline for consistent behavior.
   */
  triggerSearchOnEnter(): void {
    if (this.searchInputRef?.nativeElement?.value) {
      this.searchInput$.next(this.searchInputRef.nativeElement.value);
    }
  }

  /**
   * Navigates to the next search match with circular wraparound.
   * Expands JSON sections as needed and scrolls match into view.
   */
  async goToNextMatch(): Promise<void> {
    if (this.totalMatches === 0) return;
    this.currentMatchIndex = (this.currentMatchIndex + 1) % this.totalMatches;
    await this.ensureDataExpandedForNavigation();
    await this.scrollToCurrentMatch();
  }

  /**
   * Navigates to the previous search match with circular wraparound.
   * Expands JSON sections as needed and scrolls match into view.
   */
  async goToPreviousMatch(): Promise<void> {
    if (this.totalMatches === 0) return;
    this.currentMatchIndex =
      this.currentMatchIndex <= 0
        ? this.totalMatches - 1
        : this.currentMatchIndex - 1;
    await this.ensureDataExpandedForNavigation();
    await this.scrollToCurrentMatch();
  }

  // Ensures all JSON data is expanded when navigating between matches
  private async ensureDataExpandedForNavigation(): Promise<void> {
    this.expandAll = true;
    this.setAllSegmentsExpanded(true);
    this.cdr.markForCheck();

    // Wait for DOM updates before updating highlights
    await this.executeAfterRender(() => {
      this.highlightTemplateSegments();
    });
  }

  private async scrollToCurrentMatch(): Promise<void> {
    if (this.currentMatchIndex === -1 || this.totalMatches === 0) return;

    // Wait for DOM rendering to complete before scrolling
    await this.executeAfterRender(async () => {
      const currentMatch = this.setActiveMatchHighlight();

      if (currentMatch) {
        // Wait one more frame to ensure highlighting is applied before scrolling
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => {
            currentMatch.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });
            resolve();
          });
        });
      }

      this.cdr.markForCheck();
    });
  }

  /**
   * Highlights the currently selected search match in DOM.
   * Clears previous highlights and applies 'current-match' class.
   *
   * @returns The highlighted DOM element or null if no matches found
   */
  private setActiveMatchHighlight(): Element | null {
    const allMatches = document.querySelectorAll("mark.search-match");
    if (!allMatches?.length) return null;

    // Clear all current-match classes
    allMatches.forEach((match) => match.classList.remove("current-match"));

    const safeIndex = Math.min(this.currentMatchIndex, allMatches.length - 1);
    if (safeIndex >= 0 && safeIndex < allMatches.length) {
      const currentMatch = allMatches[safeIndex];
      currentMatch.classList.add("current-match");
      (currentMatch as HTMLElement).offsetHeight;

      return currentMatch;
    }

    return null;
  }

  /**
   * Validates and normalizes search input with 100-character limit.
   * Auto-truncates overly long terms while notifying the user.
   *
   * @param term - Raw search input from user
   * @returns Trimmed valid term or null if empty/invalid
   */
  private validateSearchTerm(term: string | undefined): string | null {
    const trimmed = term?.trim();
    if (!trimmed) {
      return null;
    }
    if (trimmed.length > 100) {
      // Restricting search term length to 100 characters
      const truncatedTerm = trimmed.substring(0, 100);
      this.showErrorSnackbarMsg(JSON_VIEWER_LABELS.SEARCH_INPUT_TOO_LONG);
      return truncatedTerm;
    }
    return trimmed;
  }

  /**
   * Updates segment highlighting with safe HTML injection.
   * Applies regex-based highlighting to keys and descriptions using sanitized HTML.
   */
  private highlightTemplateSegments(): void {
    const searchTerm = this.searchTerm?.trim();
    if (!searchTerm) return;

    const searchLower = searchTerm.toLowerCase();
    const safeRegexPattern = this.escapeRegExp(this.escapeHtml(searchTerm));

    if (!safeRegexPattern) return;

    try {
      const searchRegex = new RegExp(`(${safeRegexPattern})`, "gi");

      this.segments.forEach((segment) => {
        const key = String(segment.key || "");
        const desc = String(segment.description || "");

        segment.highlightedKey = key.toLowerCase().includes(searchLower)
          ? this.sanitizer.bypassSecurityTrustHtml(
              this.escapeHtml(key).replace(
                searchRegex,
                '<mark class="search-match">$1</mark>'
              )
            )
          : key;

        segment.highlightedDescription = desc
          .toLowerCase()
          .includes(searchLower)
          ? this.sanitizer.bypassSecurityTrustHtml(
              this.escapeHtml(desc).replace(
                searchRegex,
                '<mark class="search-match">$1</mark>'
              )
            )
          : desc;
      });
    } catch (error) {
      console.error("Error in search highlighting:", error);
      this.clearSearch();
    }
  }

  private async highlightTextInDOM(): Promise<void> {
    const searchTerm = this.searchTerm?.trim();
    if (!searchTerm) return;

    try {
      this.clearTextHighlightFromDOM();

      const ngxContainer = document.querySelector(".ngx-json-viewer");
      if (!ngxContainer) {
        console.warn("JSON viewer container not found for highlighting");
        return;
      }

      const textNodes = this.findTextNodesWithMatch(ngxContainer, searchTerm);
      // Return a promise to ensure highlighting completes before navigation
      return new Promise<void>((resolve) => {
        this.ngZone.runOutsideAngular(() => {
          if (typeof requestIdleCallback !== "undefined") {
            requestIdleCallback(() => {
              this.applyMarkTagsToText(textNodes, searchTerm);
              resolve();
            });
          } else {
            this.applyMarkTagsToText(textNodes, searchTerm);
            resolve();
          }
        });
      });
    } catch (error) {
      console.error("Error in DOM highlighting:", error);
      this.clearSearch();
    }
  }

  private findTextNodesWithMatch(
    container: Element,
    searchTerm: string
  ): Text[] {
    const textNodes: Text[] = [];
    const searchLower = searchTerm.toLowerCase();
    const EXCLUDED_TAGS = new Set(["script", "style", "noscript"]);

    const collectTextNodes = (element: Element): void => {
      for (const child of Array.from(element.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent || "";
          if (text.toLowerCase().includes(searchLower)) {
            textNodes.push(child as Text);
          }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const childElement = child as Element;
          if (
            !childElement.closest("mark") &&
            !EXCLUDED_TAGS.has(childElement.tagName.toLowerCase())
          ) {
            collectTextNodes(childElement);
          }
        }
      }
    };

    collectTextNodes(container);
    return textNodes;
  }

  private applyMarkTagsToText(textNodes: Text[], searchTerm: string): void {
    const escapedTerm = this.escapeRegExp(searchTerm);
    const regex = new RegExp(`(${escapedTerm})`, "gi");

    textNodes.forEach((textNode) => {
      const parent = textNode.parentElement;
      if (!parent || parent.closest("mark")) return;

      const text = textNode.textContent || "";
      if (!regex.test(text)) return;

      regex.lastIndex = 0;
      const parts = text.split(regex);

      if (parts.length > 1) {
        const fragment = this.createHighlightedFragment(parts);
        parent.replaceChild(fragment, textNode);
      }
    });
  }

  private createHighlightedFragment(parts: string[]): DocumentFragment {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        if (parts[i]) {
          fragment.appendChild(document.createTextNode(parts[i]));
        }
      } else {
        const mark = document.createElement("mark");
        mark.className = "search-match";
        mark.textContent = parts[i];
        fragment.appendChild(mark);
      }
    }

    return fragment;
  }

  private clearTextHighlightFromDOM(): void {
    const existingMarks = document.querySelectorAll("mark.search-match");

    Array.from(existingMarks).forEach((mark) => {
      const text = mark.textContent || "";
      const textNode = document.createTextNode(text);
      mark.parentNode?.replaceChild(textNode, mark);
    });

    const container = document.querySelector(".ngx-json-viewer");
    if (container) {
      container.normalize();
    }
  }

  /**
   * Counts total search matches in raw JSON data with DOM fallback.
   * Uses regex on JSON string for accuracy, falls back to DOM count on errors.
   *
   * @param searchTerm - Search term to count matches for
   * @returns Total number of matches found
   */
  private countMatchesInRawData(searchTerm: string): number {
    try {
      const jsonString = this.getJsonString();
      const regex = new RegExp(this.escapeRegExp(searchTerm), "gi");
      const matches = jsonString.match(regex);
      return matches ? matches.length : 0;
    } catch (error) {
      console.error("Error counting matches in raw data:", error);
      return document.querySelectorAll("mark.search-match").length;
    }
  }

  private escapeHtml(text: string): string {
    if (!text || typeof text !== "string") return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  private escapeRegExp(string: string): string {
    if (!string || typeof string !== "string") return "";
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  private parseKeyValue(key: string, value: unknown): Segment {
    const segment: Segment = {
      key,
      value,
      type: undefined,
      description: String(value),
      expanded: this.isExpanded(),
      individuallyExpanded: false,
    };

    switch (typeof segment.value) {
      case "number":
        segment.type = "number";
        break;
      case "boolean":
        segment.type = "boolean";
        break;
      case "function":
        segment.type = "function";
        break;
      case "string":
        segment.type = "string";
        segment.description = `"${segment.value}"`;
        break;
      case "undefined":
        segment.type = "undefined";
        segment.description = "undefined";
        break;
      case "object":
        if (segment.value === null) {
          segment.type = "null";
          segment.description = "null";
        } else if (Array.isArray(segment.value)) {
          segment.type = "array";
          segment.description =
            segment.value.length === 0
              ? "No data"
              : `Array[${segment.value.length}] `;
        } else if (segment.value instanceof Date) {
          segment.type = "date";
        } else {
          segment.type = "object";
          const objectKeys = Object.keys(
            segment.value as Record<string, unknown>
          );
          segment.description = objectKeys.length === 0 ? "No data" : "Object ";
        }
        break;
    }

    return segment;
  }

  private isExpanded(): boolean {
    if (this.expandAll) {
      return true;
    }

    return (
      this.expanded && !(this.depth > -1 && this.currentDepth >= this.depth)
    );
  }

  /**
   * Removes circular references from objects to prevent JSON.stringify errors.
   * Replaces circular references with {$ref: path} objects indicating the reference path.
   *
   * @param object - Object that may contain circular references
   * @returns Object with circular references replaced by reference markers
   */
  private decycle(object: unknown): unknown {
    const objects = new WeakMap<object, string>();

    const derez = (value: unknown, path: string): unknown => {
      if (
        typeof value === "object" &&
        value !== null &&
        !(value instanceof Boolean) &&
        !(value instanceof Date) &&
        !(value instanceof Number) &&
        !(value instanceof RegExp) &&
        !(value instanceof String)
      ) {
        const oldPath = objects.get(value);
        if (oldPath !== undefined) {
          return { $ref: oldPath };
        }
        objects.set(value, path);

        if (Array.isArray(value)) {
          const nu: unknown[] = [];
          value.forEach((element, i) => {
            nu[i] = derez(element, `${path}[${i}]`);
          });
          return nu;
        } else {
          const nu: Record<string, unknown> = {};
          Object.keys(value as Record<string, unknown>).forEach((name) => {
            nu[name] = derez(
              (value as Record<string, unknown>)[name],
              `${path}[${JSON.stringify(name)}]`
            );
          });
          return nu;
        }
      }
      return value;
    };

    return derez(object, "$");
  }
}
