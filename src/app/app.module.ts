import { AdminWarningComponent } from './adminWarning/admin-warning.component';
import { AdminMenuComponent } from "./adminMenu/admin-menu.component";
import { AdminHeaderComponent } from "./adminHeader/admin-header.component";
import { HomeModule } from "./admin-home/home.module";
import { AdminHomeComponent } from "./admin-home/components/admin-home.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuthRoutingModule } from "./auth/auth-routing.module";
import { HylandSSOManagerComponent } from "./auth/components/SSO/hylandSSOManager.component";
import { BackendErrorMessages } from "./shared/components/backendErrorMessages/backendErrorMessages.component";
import { NgModule } from "@angular/core";
import { AdminAppComponent } from "./admin-app.component";
import { AuthInterceptorService } from "./auth/services/auth-interceptor.service";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { StoreModule } from "@ngrx/store";
import { StoreRouterConnectingModule, routerReducer } from "@ngrx/router-store";
import { authReducer } from "./auth/store/reducers";
import { EffectsModule } from "@ngrx/effects";
import * as authEffects from "./auth/store/effects";
import { ngrxDevtools } from "../devtools/ngrx-devtools";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    AdminAppComponent,
    AdminHeaderComponent,
    AdminMenuComponent,
    AdminWarningComponent,
    BackendErrorMessages,
    HylandSSOManagerComponent,
    AdminHomeComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    AppRoutingModule,
    AuthRoutingModule,
    StoreModule.forRoot({
      router: routerReducer,
      auth: authReducer,
    }),
    StoreRouterConnectingModule.forRoot(), // connects Angular Router to Store
    EffectsModule.forRoot(authEffects),
    HomeModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    ngrxDevtools,
  ],
  bootstrap: [AdminAppComponent],
})
export class AppModule {}
