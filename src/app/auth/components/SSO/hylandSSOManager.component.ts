import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Store } from "@ngrx/store";
import { combineLatest } from "rxjs";
import { authActions } from "../../store/actions";
import {
  selectIsSubmitting,
  selectValidationErrors,
} from "../../store/reducers";
import { HylandSSORequestInterface } from "../../types/hylandSSORequest.interface";

@Component({
  selector: "ssomanager",
  templateUrl: "./hylandSSOManager.component.html",
})
export class HylandSSOManagerComponent implements OnInit {
  data$ = combineLatest({
    isSubmitting: this.store.select(selectIsSubmitting),
    backendErrors: this.store.select(selectValidationErrors),
  });

  constructor(private fb: FormBuilder, private store: Store) {}

  initSSO() {
    const request: HylandSSORequestInterface = {
      app: { appID: "AdminPanel" },
    };
    this.store.dispatch(authActions.sso({ request }));
  }

  ngOnInit() {
    this.initSSO();
  }
}
