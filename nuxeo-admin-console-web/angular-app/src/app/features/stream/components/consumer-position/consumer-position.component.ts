import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { MAIN_TAB_LABELS } from "../../stream.constants";

@Component({
  selector: "consumer-position",
  templateUrl: "./consumer-position.component.html",
  styleUrls: ["./consumer-position.component.css"],
})
export class ConsumerPositionComponent implements OnInit, OnDestroy {
  selectedTabIndex = 0;
  readonly MAIN_TAB_LABELS = MAIN_TAB_LABELS;
  destroy$: Subject<void> = new Subject<void>();

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // If user lands on /consumer-position (no child) redirect to default
    if (!this.route.firstChild) {
      this.router.navigate(
        [
          MAIN_TAB_LABELS.CONSUMER_POSITION.SUB_TAB_LABELS
            .GET_CONSUMER_POSITION.ROUTE_LABEL,
        ],
        {
          relativeTo: this.route,
        }
      );
    } else {
      this.syncTabIndexFromRoute();
    }

    // Keep tab selection in sync on navigation (deep link / refresh)
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.syncTabIndexFromRoute();
      });
  }

  syncTabIndexFromRoute(): void {
    const child = this.route.firstChild;
    const firstSeg = child?.snapshot.url[0]?.path;
    if (
      firstSeg ===
      MAIN_TAB_LABELS.CONSUMER_POSITION.SUB_TAB_LABELS.GET_CONSUMER_POSITION
        .ROUTE_LABEL
    ) {
      this.selectedTabIndex =
        MAIN_TAB_LABELS.CONSUMER_POSITION.SUB_TAB_LABELS.GET_CONSUMER_POSITION.ID;
    } else {
      this.selectedTabIndex =
        MAIN_TAB_LABELS.CONSUMER_POSITION.SUB_TAB_LABELS.CHANGE_CONSUMER_POSITION.ID;
    }
  }

  onSubTabChange(index: number): void {
    if (
      index ===
      MAIN_TAB_LABELS.CONSUMER_POSITION.SUB_TAB_LABELS.CHANGE_CONSUMER_POSITION
        .ID
    ) {
      this.router.navigate(
        [
          MAIN_TAB_LABELS.CONSUMER_POSITION.SUB_TAB_LABELS
            .CHANGE_CONSUMER_POSITION.ROUTE_LABEL,
        ],
        {
          relativeTo: this.route,
        }
      );
    } else {
      this.router.navigate(
        [
         MAIN_TAB_LABELS.CONSUMER_POSITION.SUB_TAB_LABELS
            .GET_CONSUMER_POSITION.ROUTE_LABEL,
        ],
        {
          relativeTo: this.route
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
