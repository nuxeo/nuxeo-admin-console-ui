import { initializeTestBed } from "src/test-helpers"; //This import must be the first import in the file.
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import {
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { Subject, of, throwError } from "rxjs";
import { BundlesComponent } from "./bundles.component";
import { BundlesService } from "./services/bundles.service";
import { BUNDLES_LABELS } from "./bundles.constants";
import {
  BundleInfo,
  DistributionResponse,
} from "../../shared/types/bundles.interface";
import { SharedMethodsService } from "../../shared/services/shared-methods.service";
import { ERROR_TYPES } from "../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";

const mockDistribution: DistributionResponse = {
  "entity-type": "serverInfo",
  applicationName: "Nuxeo Platform",
  applicationVersion: "2025.1.0",
  distributionName: "server",
  distributionVersion: "2025.1.0",
  bundles: [
    { name: "org.nuxeo.ecm.core", version: "2025.1.0", revision: "abc1234" },
    { name: "org.nuxeo.ecm.platform.picture.core", version: "2025.1.0" },
  ],
  warnings: [{ message: "A component was overridden" }],
  errors: [{ message: "A contribution failed to load" }],
};

/* MatTableDataSource subscribes to the paginator streams as soon as it is
assigned, so the stub has to expose them. */
const createPaginatorStub = () =>
  ({
    page: new Subject<PageEvent>(),
    initialized: new Subject<void>(),
    firstPage: vi.fn().mockName("MatPaginator.firstPage"),
    pageIndex: 0,
    pageSize: 25,
    length: 0,
  }) as unknown as MatPaginator;

describe("BundlesComponent", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

  let component: BundlesComponent;
  let fixture: ComponentFixture<BundlesComponent>;
  let bundlesService: BundlesService;
  let sharedService: SharedMethodsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BundlesComponent],
      imports: [
        NoopAnimationsModule,
        MatCardModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatTableModule,
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BundlesComponent);
    component = fixture.componentInstance;
    bundlesService = TestBed.inject(BundlesService);
    sharedService = TestBed.inject(SharedMethodsService);
    // Mock the service to prevent ngOnInit from making real HTTP calls
    vi.spyOn(bundlesService, "getDistributionInfo").mockReturnValue(
      of(mockDistribution)
    );
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should load bundles and distribution details on init", () => {
    fixture.detectChanges();
    expect(component.isDataLoaded).toBe(true);
    expect(component.isError).toBe(false);
    expect(component.bundlesData.data).toEqual(mockDistribution.bundles);
    expect(component.warnings).toEqual(mockDistribution.warnings);
    expect(component.errors).toEqual(mockDistribution.errors);
  });

  it("should build the distribution summary from the response", () => {
    const fields = BUNDLES_LABELS.DISTRIBUTION_FIELDS;
    expect(component.buildDistributionSummary(mockDistribution)).toEqual([
      { label: fields.APPLICATION_NAME, value: "Nuxeo Platform" },
      { label: fields.APPLICATION_VERSION, value: "2025.1.0" },
      { label: fields.DISTRIBUTION_NAME, value: "server" },
      { label: fields.DISTRIBUTION_VERSION, value: "2025.1.0" },
    ]);
  });

  it("should fall back to a placeholder for missing distribution details", () => {
    const summary = component.buildDistributionSummary({});
    summary.forEach((field) => {
      expect(field.value).toBe(BUNDLES_LABELS.NOT_AVAILABLE);
    });
  });

  it("should treat a response without bundles as no data", () => {
    vi.spyOn(bundlesService, "getDistributionInfo").mockReturnValue(of({}));
    component.getBundles();
    expect(component.isDataLoaded).toBe(true);
    expect(component.bundlesData.data).toEqual([]);
    expect(component.warnings).toEqual([]);
    expect(component.errors).toEqual([]);
    expect(component.hasBundles()).toBe(false);
  });

  it("should render the loading state until a response arrives", () => {
    const response$ = new Subject<DistributionResponse>();
    vi.spyOn(bundlesService, "getDistributionInfo").mockReturnValue(
      response$.asObservable()
    );
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector(".loading-container")
    ).toBeTruthy();
    expect(fixture.nativeElement.querySelector(".bundles__summary")).toBeNull();
    expect(fixture.nativeElement.querySelector(".error-container")).toBeNull();
    response$.complete();
  });

  it("should render the error state and re-fetch when Retry is clicked", () => {
    const getSpy = vi
      .spyOn(bundlesService, "getDistributionInfo")
      .mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 500 }))
      );
    vi.spyOn(sharedService, "showActionErrorModal").mockReturnValue(
      of(undefined)
    );
    fixture.detectChanges();
    const errorContainer =
      fixture.nativeElement.querySelector(".error-container");
    expect(errorContainer).toBeTruthy();
    expect(component.isError).toBe(true);

    getSpy.mockReturnValue(of(mockDistribution));
    const retryButton: HTMLButtonElement =
      errorContainer.querySelector("button");
    retryButton.click();
    fixture.detectChanges();
    expect(getSpy).toHaveBeenCalledTimes(2);
    expect(component.isError).toBe(false);
    expect(fixture.nativeElement.querySelector(".error-container")).toBeNull();
    expect(
      fixture.nativeElement.querySelector(".bundles__summary")
    ).toBeTruthy();
  });

  it("should show the no-data message inside the card when the response has no bundles", () => {
    vi.spyOn(bundlesService, "getDistributionInfo").mockReturnValue(
      of({
        applicationName: "Nuxeo Platform",
        applicationVersion: "2025.1.0",
        distributionName: "server",
        distributionVersion: "2025.1.0",
        bundles: [],
        warnings: [{ message: "A component was overridden" }],
        errors: [{ message: "A contribution failed to load" }],
      })
    );
    fixture.detectChanges();
    const host = fixture.nativeElement;
    expect(host.querySelector(".no-data-container")).toBeTruthy();
    expect(host.querySelector("table")).toBeNull();
    // The distribution, warnings and errors still render alongside "no bundles".
    expect(host.querySelector(".bundles__summary")).toBeTruthy();
    expect(host.querySelector(".bundles__messages--warning")).toBeTruthy();
    expect(host.querySelector(".bundles__messages--error")).toBeTruthy();
  });

  it("should show the error modal when fetching the distribution fails", () => {
    const mockError = new HttpErrorResponse({
      error: { status: 500, message: "Server error" },
      status: 500,
      statusText: "Internal Server Error",
    });
    vi.spyOn(bundlesService, "getDistributionInfo").mockReturnValue(
      throwError(() => mockError)
    );
    const showErrorSpy = vi
      .spyOn(sharedService, "showActionErrorModal")
      .mockReturnValue(of(undefined));
    component.getBundles();
    expect(component.isDataLoaded).toBe(true);
    expect(component.isError).toBe(true);
    expect(showErrorSpy).toHaveBeenCalledWith({
      type: ERROR_TYPES.SERVER_ERROR,
      details: {
        status: 500,
        message: "Server error",
      },
    });
  });

  it("should fall back to the outer status and message when the error body is empty", () => {
    const mockError = {
      error: null,
      status: 503,
      message: "Service Unavailable",
    };
    vi.spyOn(bundlesService, "getDistributionInfo").mockReturnValue(
      throwError(() => mockError)
    );
    const showErrorSpy = vi
      .spyOn(sharedService, "showActionErrorModal")
      .mockReturnValue(of(undefined));
    component.getBundles();
    expect(showErrorSpy).toHaveBeenCalledWith({
      type: ERROR_TYPES.SERVER_ERROR,
      details: {
        status: 503,
        message: "Service Unavailable",
      },
    });
  });

  it("should filter bundles by name, version and revision", () => {
    component.getBundles();

    component.applyFilter({
      target: { value: "  PICTURE  " },
    } as unknown as Event);
    expect(component.bundlesData.filteredData).toEqual([
      mockDistribution.bundles[1],
    ]);

    component.applyFilter({ target: { value: "abc1234" } } as unknown as Event);
    expect(component.bundlesData.filteredData).toEqual([
      mockDistribution.bundles[0],
    ]);

    component.applyFilter({ target: { value: "2025.1.0" } } as unknown as Event);
    expect(component.bundlesData.filteredData).toEqual(
      mockDistribution.bundles
    );
  });

  it("should filter the table when the user edits the filter input", () => {
    fixture.detectChanges();
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector("#bundles-filter");
    input.value = "picture";
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(component.bundlesData.filteredData).toEqual([
      mockDistribution.bundles[1],
    ]);
  });

  it("should only match the columns shown in the table, not other server fields", () => {
    /* A bundle carrying a server-sent field the table does not display: the
    default MatTableDataSource predicate would concatenate it and match, so this
    proves the custom predicate is in effect. */
    component.bundlesData.data = [
      {
        name: "org.nuxeo.ecm.core",
        version: "2025.1.0",
        description: "hidden-searchable-term",
      } as unknown as BundleInfo,
    ];
    component.applyFilter({
      target: { value: "hidden-searchable-term" },
    } as unknown as Event);
    expect(component.bundlesData.filteredData).toEqual([]);
  });

  it("should report when no bundle matches the applied filter", () => {
    component.getBundles();
    component.applyFilter({ target: { value: "unknown" } } as unknown as Event);
    expect(component.hasFilteredBundles()).toBe(false);
  });

  it("should reset the paginator to the first page when the filter changes", () => {
    component.getBundles();
    const paginator = createPaginatorStub();
    component.bundlesData.paginator = paginator;
    component.applyFilter({ target: { value: "core" } } as unknown as Event);
    expect(paginator.firstPage).toHaveBeenCalled();
  });

  it("should attach the paginator to the data source once it is rendered", () => {
    const paginator = createPaginatorStub();
    component.tablePaginator = paginator;
    expect(component.bundlesData.paginator).toBe(paginator);
  });

  it("should interpolate counts into labels", () => {
    expect(
      component.buildLabelWithCount(BUNDLES_LABELS.BUNDLES_COUNT, 12)
    ).toBe("Bundles (12)");
  });

  it("should complete destroy$ subject on ngOnDestroy", () => {
    const nextSpy = vi.spyOn(component.destroy$, "next");
    const completeSpy = vi.spyOn(component.destroy$, "complete");
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it("should stop applying distribution responses after ngOnDestroy", () => {
    /* Emitting through the mocked service after teardown proves the takeUntil
    is wired: without it, this late emission would populate the table. */
    const response$ = new Subject<DistributionResponse>();
    vi.spyOn(bundlesService, "getDistributionInfo").mockReturnValue(
      response$.asObservable()
    );
    component.getBundles();
    component.ngOnDestroy();
    response$.next(mockDistribution);
    expect(component.bundlesData.data).toEqual([]);
    expect(component.isDataLoaded).toBe(false);
  });
});
