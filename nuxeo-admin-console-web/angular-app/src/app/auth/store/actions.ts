import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { BackendErrorsInterface } from "../../shared/types/backendErrors.interface";
import { UserInterface } from "../../shared/types/user.interface";
import { HylandSSORequestInterface } from "../types/hylandSSORequest.interface";

export const authActions = createActionGroup({
  source: "auth",
  events: {
    sso: props<{ request: HylandSSORequestInterface }>(),
    "sso success": props<{ currentUser: UserInterface }>(),
    "sso failure": props<{ errors: BackendErrorsInterface }>(),

    "Get current user": emptyProps(),
    "Get current user success": props<{ currentUser: UserInterface }>(),
    "Get current user failure": emptyProps(),
     "Sign out": emptyProps(),
     "Sign out success": emptyProps(),
     "Sign out failure": props<{ errors: BackendErrorsInterface }>(),
  },
});
