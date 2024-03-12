import { AdminHomeModule } from "./admin-home/admin-home.module";
import { AdminWarningComponent } from "./adminWarning/admin-warning.component";
import { AdminMenuComponent } from "./adminMenu/admin-menu.component";
import { AdminHeaderComponent } from "./adminHeader/admin-header.component";
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
import { AdminSystemInformationModule } from "./admin-system-information/admin-system-information.module";
import { AdminBulkActionMonitoringModule } from "./admin-bulk-action-monitoring/admin-bulk-action-monitoring.module";
import { AdminElasticSearchReindexModule } from "./admin-elastic-search-reindex/admin-elastic-search-reindex.module";
import { AdminFullTextReindexModule } from "./admin-full-text-reindex/admin-full-text-reindex.module";
import { AdminThumbnailGenerationModule } from "./admin-thumbnail-generation/admin-thumbnail-generation.module";
import { AdminPictureRenderGenerationModule } from "./admin-picture-render-generation/admin-picture-render-generation.module";
import { AdminVideoRenderGenerationModule } from "./admin-video-render-generation/admin-video-render-generation.module";

@NgModule({
  declarations: [
    AdminAppComponent,
    AdminHeaderComponent,
    AdminMenuComponent,
    AdminWarningComponent,
    BackendErrorMessages,
    HylandSSOManagerComponent,
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
    AdminHomeModule,
    MatSidenavModule,
    MatButtonModule,
    AdminSystemInformationModule,
    AdminBulkActionMonitoringModule,
    AdminElasticSearchReindexModule,
    AdminFullTextReindexModule,
    AdminThumbnailGenerationModule,
    AdminPictureRenderGenerationModule,
    AdminVideoRenderGenerationModule,
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
