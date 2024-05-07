import { AdminWarningComponent } from "./adminWarning/admin-warning.component";
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
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { HyDialogModule } from "@hyland/ui";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatListModule } from "@angular/material/list";
import { HyDialogBoxModule } from "@hyland/ui";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";

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
    BrowserAnimationsModule,
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
    MatSidenavModule,
    MatButtonModule,
    HyDialogModule,
    FormsModule,
    MatCheckboxModule,
    MatListModule,
    HyDialogBoxModule,
    MatFormFieldModule,
    MatIconModule,
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
