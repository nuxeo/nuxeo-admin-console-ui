import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { TAB_INFO } from "./generic-multi-feature-layout.constants";
import { TabInfo } from "./generic-multi-feature-layout.interface";
import { GenericMultiFeatureUtilitiesService } from "./services/generic-multi-feature-utilities.service";
import {
  FEATURES,
  FeaturesKey,
  featureMap,
  getFeatureKeyByValue,
} from "./generic-multi-feature-layout.mapping";
import { Title } from "@angular/platform-browser";

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
    private genericMultiFeatureUtilitiesService: GenericMultiFeatureUtilitiesService,
    private route: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    const featureRoute = this.router?.routerState?.snapshot?.url?.split("/")[1];
    if (featureRoute) {
      this.genericMultiFeatureUtilitiesService.setActiveFeature(
        featureRoute as FeaturesKey
      );
    }
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.activeSubscription)
      )
      .subscribe(() => {
        this.updateActiveTab();
      });

    this.genericMultiFeatureUtilitiesService.pageTitle
      .pipe(takeUntil(this.activeSubscription))
      .subscribe((title) => {
        this.pageTitle = title;
        this.cdRef.detectChanges();
      });

    this.updateActiveTab();
  }

  updateActiveTab(): void {
    const currentRoute = this.route?.snapshot?.firstChild?.routeConfig?.path;
    const tabType: string =
      this.router?.routerState?.snapshot?.url?.split("/")[2];
    if (currentRoute) {
      this.activeTab =
        this.searchTabs?.find((tab) => tab?.path === currentRoute) ||
        this.searchTabs[0];
    }
    const activeFeature =
      this.genericMultiFeatureUtilitiesService.getActiveFeature();
    const featureConfig = featureMap();
    const featureKey = getFeatureKeyByValue(activeFeature) as FeaturesKey;
    if (activeFeature && activeFeature in featureConfig) {
      const templateConfigData =
        featureConfig[FEATURES[featureKey]](tabType);
      const templateLabels = templateConfigData?.labels;
      this.titleService.setTitle(templateLabels.pageTitle);
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
