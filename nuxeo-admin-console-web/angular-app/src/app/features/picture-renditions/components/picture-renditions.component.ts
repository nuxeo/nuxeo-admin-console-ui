import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { PictureSearchType } from "../picture-renditions.interface";
import { PICTURE_RENDITIONS_TYPES } from "../picture-renditions.constants";
import { PictureRendtionsService } from "../services/picture-renditons.service";

@Component({
  selector: "picture-renditions",
  templateUrl: "./picture-renditions.component.html",
  styleUrls: ["./picture-renditions.component.scss"],
})
export class PictureRenditionsComponent implements OnInit, OnDestroy {
  searchTabs: PictureSearchType[] = PICTURE_RENDITIONS_TYPES;
  activeTab: PictureSearchType = this.searchTabs[0];
  pageTitle = "";
  private activeSubscription = new Subject<void>();

  constructor(
    private pictureRendtionsService: PictureRendtionsService,
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

    this.pictureRendtionsService.pageTitle
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

  activateTab(tab: PictureSearchType): void {
    this.activeTab = tab;
  }

  ngOnDestroy(): void {
    this.activeSubscription.next();
    this.activeSubscription.complete();
  }
}
