import { ProbesResponse } from "./../../../../shared/types/probes.interface";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { HomeService } from "../../services/home.service";
import { Observable, Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import { HomeState, ProbesInfo } from "../../store/reducers";
import * as HomeActions from "../../store/actions";

@Component({
  selector: "probes-summary",
  templateUrl: "./probes-summary.component.html",
  styleUrls: ["./probes-summary.component.scss"],
})
export class ProbesSummaryComponent implements OnInit, OnDestroy {
  probesData = "ss";
  fetchProbesSubscription = new Subscription();
  fetchProbes$: Observable<ProbesInfo[]>;
  constructor(private store: Store<{ home: HomeState }>) {
    this.fetchProbes$ = this.store.pipe(
      select((state) => state.home?.probesInfo)
    );
  }

  ngOnInit(): void {
    this.store.dispatch(HomeActions.fetchProbesInfo());

    this.fetchProbesSubscription = this.fetchProbes$.subscribe((data: any) => {
      if (data) {
        this.probesData = data;
      }
    });
  }

  ngOnDestroy(): void {
    this.fetchProbesSubscription?.unsubscribe();
  }
}
