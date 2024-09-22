import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { TAB_INFO } from "./generic-multi-feature-layout.constants";
import { TabInfo } from "./generic-multi-feature-layout.interface";
import { GenericMultiFeatureUtilitiesService } from "./services/generic-multi-feature-utilities.service";

@Component({
  selector: "generic-multi-feature-layout",
  templateUrl: "./generic-multi-feature-layout.component.html",
  styleUrls: ["./generic-multi-feature-layout.component.scss"],
})
export class GenericMultiFeatureLayoutComponent implements OnInit, OnDestroy {
  searchTabs: TabInfo[] = TAB_INFO;
  activeTab: TabInfo = this.searchTabs[0];
  pageTitle = "";
  private activeSubscription = new Subject<void>();

  constructor(
    private genericEndUtilitiesService: GenericMultiFeatureUtilitiesService,
    private route: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.activeSubscription)
      )
      .subscribe(() => {
        this.updateActiveTab();
      });

    this.genericEndUtilitiesService.pageTitle
      .pipe(takeUntil(this.activeSubscription))
      .subscribe((title) => {
        this.pageTitle = title;
        this.cdRef.detectChanges();
      });

    this.updateActiveTab();
  }

  updateActiveTab(): void {
    const currentRoute = this.route?.snapshot?.firstChild?.routeConfig?.path;
    if (currentRoute) {
      this.activeTab =
        this.searchTabs.find((tab) => tab.path === currentRoute) ||
        this.searchTabs[0];
    }
  }

  activateTab(tab: TabInfo): void {
    this.activeTab = tab;
  }

  ngOnDestroy(): void {
    this.activeSubscription.next();
    this.activeSubscription.complete();
  }
}
