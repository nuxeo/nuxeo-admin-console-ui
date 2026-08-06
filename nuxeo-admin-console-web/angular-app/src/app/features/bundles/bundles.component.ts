import { Component, OnDestroy, OnInit, ViewChild, inject } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Subject, takeUntil } from "rxjs";
import { BundlesService } from "./services/bundles.service";
import {
  BUNDLES_LABELS,
  BUNDLES_PAGE_SIZE,
  BUNDLES_PAGE_SIZE_OPTIONS,
  BUNDLES_TABLE_COLUMNS,
} from "./bundles.constants";
import {
  BundleInfo,
  DistributionMessage,
  DistributionResponse,
} from "../../shared/types/bundles.interface";
import { SharedMethodsService } from "../../shared/services/shared-methods.service";
import { ERROR_TYPES } from "../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";

@Component({
  selector: "app-bundles",
  templateUrl: "./bundles.component.html",
  styleUrls: ["./bundles.component.scss"],
  standalone: false,
})
export class BundlesComponent implements OnInit, OnDestroy {
  private readonly bundlesService = inject(BundlesService);
  private readonly sharedService = inject(SharedMethodsService);
  BUNDLES_LABELS = BUNDLES_LABELS;
  columnsToDisplay = BUNDLES_TABLE_COLUMNS;
  pageSize = BUNDLES_PAGE_SIZE;
  pageSizeOptions = BUNDLES_PAGE_SIZE_OPTIONS;
  bundlesData: MatTableDataSource<BundleInfo> =
    new MatTableDataSource<BundleInfo>([]);
  distributionSummary: { label: string; value: string }[] = [];
  warnings: DistributionMessage[] = [];
  errors: DistributionMessage[] = [];
  destroy$: Subject<void> = new Subject<void>();
  isDataLoaded = false;
  isError = false;

  /* The table is rendered conditionally, so the paginator is only available
  once the data has been fetched successfully. */
  @ViewChild(MatPaginator) set tablePaginator(paginator: MatPaginator) {
    if (paginator) {
      this.bundlesData.paginator = paginator;
    }
  }

  constructor() {
    this.bundlesData.filterPredicate = (bundle: BundleInfo, filter: string) =>
      [bundle?.name, bundle?.version, bundle?.revision]
        .filter((field): field is string => !!field)
        .some((field) => field.toLowerCase().includes(filter));
  }

  ngOnInit(): void {
    this.getBundles();
  }

  getBundles(): void {
    this.isDataLoaded = false;
    this.isError = false;
    this.bundlesService
      .getDistributionInfo()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: DistributionResponse) => {
          this.bundlesData.data = data?.bundles || [];
          this.bundlesData.filter = "";
          this.distributionSummary = this.buildDistributionSummary(data);
          this.warnings = data?.warnings || [];
          this.errors = data?.errors || [];
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

  buildDistributionSummary(
    data: DistributionResponse
  ): { label: string; value: string }[] {
    const fields = BUNDLES_LABELS.DISTRIBUTION_FIELDS;
    return [
      { label: fields.APPLICATION_NAME, value: data?.applicationName },
      { label: fields.APPLICATION_VERSION, value: data?.applicationVersion },
      { label: fields.DISTRIBUTION_NAME, value: data?.distributionName },
      { label: fields.DISTRIBUTION_VERSION, value: data?.distributionVersion },
    ].map((field) => ({
      label: field.label,
      value: field.value || BUNDLES_LABELS.NOT_AVAILABLE,
    }));
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.bundlesData.filter = filterValue.trim().toLowerCase();
    this.bundlesData.paginator?.firstPage();
  }

  buildLabelWithCount(label: string, count: number): string {
    return label.replaceAll("{count}", count.toString());
  }

  hasBundles(): boolean {
    return this.bundlesData.data.length > 0;
  }

  hasFilteredBundles(): boolean {
    return this.bundlesData.filteredData.length > 0;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
