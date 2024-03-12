import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { BackendErrorsInterface } from "../../shared/types/backendErrors.interface";
import { AdminUserInterface } from "../../shared/types/adminUser.interface";
import { HylandSSORequestInterface } from "../types/hylandSSORequest.interface";

export const authActions = createActionGroup({
  source: "auth",
  events: {
    SSO: props<{ request: HylandSSORequestInterface }>(),
    "SSO success": props<{ currentUser: AdminUserInterface }>(),
    "SSO failure": props<{ errors: BackendErrorsInterface }>(),

    "Get current user": emptyProps(),
    "Get current user success": props<{ currentUser: AdminUserInterface }>(),
    "Get current user failure": emptyProps(),
  },
});
