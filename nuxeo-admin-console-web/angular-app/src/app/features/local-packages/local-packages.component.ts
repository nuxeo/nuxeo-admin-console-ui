import { Component, OnDestroy, OnInit, ViewChild, inject } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/internal/operators/takeUntil";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import {
  LOCAL_PACKAGES_COLUMNS,
  LOCAL_PACKAGES_LABELS,
} from "./local-packages.constants";
import { LocalPackagesService } from "./services/local-packages.service";
import { SharedMethodsService } from "../../shared/services/shared-methods.service";
import { ERROR_TYPES } from "../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";
import { LocalPackage } from "../../shared/types/local-packages.interface";

@Component({
  selector: "app-local-packages",
  templateUrl: "./local-packages.component.html",
  styleUrls: ["./local-packages.component.scss"],
  standalone: false,
})
export class LocalPackagesComponent implements OnInit, OnDestroy {
  private localPackagesService = inject(LocalPackagesService);
  private sharedService = inject(SharedMethodsService);
  LOCAL_PACKAGES_LABELS = LOCAL_PACKAGES_LABELS;
  columnsToDisplay = LOCAL_PACKAGES_COLUMNS;
  packages: MatTableDataSource<LocalPackage> =
    new MatTableDataSource<LocalPackage>([]);
  isDataLoaded = false;
  isError = false;
  destroy$: Subject<void> = new Subject<void>();

  // The table is rendered conditionally, so bind the paginator through a setter
  // that fires once the table (and paginator) exist in the DOM.
  @ViewChild("paginator") set paginator(paginator: MatPaginator) {
    if (paginator) {
      this.packages.paginator = paginator;
    }
  }

  ngOnInit(): void {
    this.getLocalPackages();
  }

  getLocalPackages(): void {
    this.isDataLoaded = false;
    this.isError = false;
    this.localPackagesService
      .getLocalPackages()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.packages.data = data?.entries ?? [];
          this.isDataLoaded = true;
        },
        error: (error: HttpErrorResponse) => {
          this.isDataLoaded = true;
          this.isError = true;
          this.sharedService.showActionErrorModal({
            type: ERROR_TYPES.SERVER_ERROR,
            details: {
              status: error?.error?.status || error?.status,
              message: error?.error?.message || error?.message,
            },
          });
        },
      });
  }

  hasPackages(): boolean {
    return this.packages.data.length > 0;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
