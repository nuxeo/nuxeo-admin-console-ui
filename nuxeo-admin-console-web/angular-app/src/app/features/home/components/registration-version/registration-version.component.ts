import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import * as HomeActions from "../../store/actions";
import { HomeState } from "../../store/reducers";
import { versionInfo } from "../../../../shared/types/version-info.interface";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "registration-version",
  templateUrl: "./registration-version.component.html",
  styleUrls: ["./registration-version.component.scss"],
})
export class RegistrationVersionComponent implements OnInit {
  versionInfo$: Observable<versionInfo>;
  error$: Observable<HttpErrorResponse | null>; 

  constructor(private store: Store<{ home: HomeState }>) {
    this.versionInfo$ = this.store.pipe(
      select((state) => state.home?.versionInfo)
    );
    this.error$ = this.store.pipe(select((state) => state.home?.error));
  }

  ngOnInit(): void {
    this.store.dispatch(HomeActions.fetchversionInfo());
  }
}