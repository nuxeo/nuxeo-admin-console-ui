import { AdminVideoRenderGenerationModule } from "./features/admin-video-render-generation/admin-video-render-generation.module";
import { AdminPictureRenderGenerationModule } from "./features/admin-picture-render-generation/admin-picture-render-generation.module";
import { AdminThumbnailGenerationModule } from "./features/admin-thumbnail-generation/admin-thumbnail-generation.module";
import { AdminFullTextReindexModule } from "./features/admin-full-text-reindex/admin-full-text-reindex.module";
import { AdminElasticSearchReindexModule } from "./features/admin-elastic-search-reindex/admin-elastic-search-reindex.module";
import { AdminBulkActionMonitoringModule } from "./features/admin-bulk-action-monitoring/admin-bulk-action-monitoring.module";
import { AdminHomeModule } from "./features/admin-home/admin-home.module";
import { CommonModule } from "@angular/common";
import { AdminWarningComponent } from "./shared/components/admin-warning/admin-warning.component";
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
import { StoreRouterConnectingModule, routerReducer } from "@ngrx/router-store";
import { StoreModule } from "@ngrx/store";
import { authReducer } from "./auth/store/reducers";
import { EffectsModule } from "@ngrx/effects";
import * as authEffects from "./auth/store/effects";
import { ngrxDevtools } from "../devtools/ngrx-devtools";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from '@angular/material/list';
import { AdminHeaderComponent } from "./layouts/admin-header/admin-header.component";
import { AdminMenuComponent } from "./layouts/admin-menu/admin-menu.component";
import { AdminSystemInformationModule } from "./features/admin-system-information/admin-system-information.module";

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
    MatListModule,
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
