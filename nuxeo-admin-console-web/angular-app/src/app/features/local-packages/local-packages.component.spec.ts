import { initializeTestBed } from "src/test-helpers"; //This import must be the first import in the file.
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { MatCardModule } from "@angular/material/card";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import {
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { of, throwError } from "rxjs";
import { LocalPackagesComponent } from "./local-packages.component";
import { LocalPackagesService } from "./services/local-packages.service";
import { SharedMethodsService } from "../../shared/services/shared-methods.service";
import { ERROR_TYPES } from "../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";
import { LocalPackagesResponse } from "../../shared/types/local-packages.interface";

const mockResponse: LocalPackagesResponse = {
  "entity-type": "packages",
  entries: [
    {
      "entity-type": "package",
      id: "nuxeo-web-ui-2025.12.0",
      name: "nuxeo-web-ui",
      title: "Nuxeo Web UI",
      description: "Web UI package",
      version: "2025.12.0",
      type: "ADDON",
      state: "STARTED",
      targetPlatforms: [],
      vendor: "Nuxeo",
    },
  ],
};

describe("LocalPackagesComponent", () => {
  initializeTestBed();

  let component: LocalPackagesComponent;
  let fixture: ComponentFixture<LocalPackagesComponent>;
  let localPackagesService: LocalPackagesService;
  let sharedService: SharedMethodsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocalPackagesComponent],
      imports: [
        NoopAnimationsModule,
        MatSnackBarModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatTableModule,
        MatCardModule,
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LocalPackagesComponent);
    component = fixture.componentInstance;
    localPackagesService = TestBed.inject(LocalPackagesService);
    sharedService = TestBed.inject(SharedMethodsService);
    vi.spyOn(localPackagesService, "getLocalPackages").mockReturnValue(
      of({ "entity-type": "packages", entries: [] })
    );
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load packages on init and set them on the data source", async () => {
    vi.spyOn(localPackagesService, "getLocalPackages").mockReturnValue(
      of(mockResponse)
    );
    component.getLocalPackages();
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(component.isDataLoaded).toBe(true);
    expect(component.isError).toBe(false);
    expect(component.packages.data).toEqual(mockResponse.entries);
    expect(component.hasPackages()).toBe(true);
  });

  it("should handle an empty entries list", async () => {
    vi.spyOn(localPackagesService, "getLocalPackages").mockReturnValue(
      of({ "entity-type": "packages", entries: [] })
    );
    component.getLocalPackages();
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(component.isDataLoaded).toBe(true);
    expect(component.hasPackages()).toBe(false);
  });

  it("should handle error and call showActionErrorModal on failed fetch", async () => {
    const mockError = new HttpErrorResponse({
      error: { status: 500, message: "Server error" },
      status: 500,
      statusText: "Internal Server Error",
    });
    vi.spyOn(localPackagesService, "getLocalPackages").mockReturnValue(
      throwError(() => mockError)
    );
    const showErrorSpy = vi
      .spyOn(sharedService, "showActionErrorModal")
      .mockReturnValue(of(undefined));
    component.getLocalPackages();
    await new Promise((resolve) => setTimeout(resolve, 10));
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

  it("should complete destroy$ subject on ngOnDestroy", () => {
    const nextSpy = vi.spyOn(component.destroy$, "next");
    const completeSpy = vi.spyOn(component.destroy$, "complete");
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
