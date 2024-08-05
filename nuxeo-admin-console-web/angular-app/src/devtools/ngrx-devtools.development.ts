import { provideStoreDevtools } from "@ngrx/store-devtools";
import { isDevMode } from "@angular/core";

export const ngrxDevtools = provideStoreDevtools({
  maxAge: 25,
  logOnly: !isDevMode(),
  autoPause: true,
  trace: false,
  traceLimit: 75,
});
