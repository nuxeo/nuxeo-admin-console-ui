import { versionInfo } from "./../../../../shared/types/version-info.interface";
import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import * as HomeActions from "../../store/actions";
import { HomeState } from "../../store/reducers";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "registration-version",
  templateUrl: "./registration-version.component.html",
  styleUrls: ["./registration-version.component.scss"],
})
export class RegistrationVersionComponent implements OnInit {
  versionInfo$: Observable<versionInfo>;
  error$: Observable<HttpErrorResponse | null>;
  versionInfoSubscription = new Subscription();
  versionInformation: versionInfo = {
    version: null,
    clusterEnabled: false,
  };

  constructor(private store: Store<{ home: HomeState }>) {
    this.versionInfo$ = this.store.pipe(
      select((state) => state.home?.versionInfo)
    );
    this.error$ = this.store.pipe(select((state) => state.home?.error));
  }

  ngOnInit(): void {
    this.versionInfoSubscription = this.versionInfo$.subscribe(
      (data: versionInfo) => {
        if (data && Object.keys(data).length > 0) {
          this.versionInformation = data;
        } else {
          this.store.dispatch(HomeActions.fetchversionInfo());
        }
      }
    );
  }
}