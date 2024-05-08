
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { StoreModule } from "@ngrx/store";
import { StoreRouterConnectingModule, routerReducer } from "@ngrx/router-store";
import { EffectsModule } from "@ngrx/effects";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { AdminSystemInformationModule } from "./admin-system-information/admin-system-information.module";
import { AdminBulkActionMonitoringModule } from "./admin-bulk-action-monitoring/admin-bulk-action-monitoring.module";
import { AdminElasticSearchReindexModule } from "./admin-elastic-search-reindex/admin-elastic-search-reindex.module";
import { AdminFullTextReindexModule } from "./admin-full-text-reindex/admin-full-text-reindex.module";
import { AdminThumbnailGenerationModule } from "./admin-thumbnail-generation/admin-thumbnail-generation.module";
import { AdminPictureRenderGenerationModule } from "./admin-picture-render-generation/admin-picture-render-generation.module";
import { AdminVideoRenderGenerationModule } from "./admin-video-render-generation/admin-video-render-generation.module";
import { AdminHomeModule } from "./admin-home/admin-home.module";
import { AdminWarningComponent } from "./adminWarning/admin-warning.component";
import { AdminMenuComponent } from "./adminMenu/admin-menu.component";
import { AdminHeaderComponent } from "./adminHeader/admin-header.component";
import { AdminBaseLayoutComponent } from './admin-base-layout/components/admin-base-layout.component';
import { AppRoutingModule } from "./app-routing.module";
import { AuthRoutingModule } from "./auth/auth-routing.module";
import { HylandSSOManagerComponent } from "./auth/components/SSO/hylandSSOManager.component";
import { BackendErrorMessages } from "./shared/components/backendErrorMessages/backendErrorMessages.component";
import { AdminAppComponent } from "./admin-app.component";
import { AuthInterceptorService } from "./auth/services/auth-interceptor.service";
import { authReducer } from "./auth/store/reducers";
import * as authEffects from "./auth/store/effects";
import { ngrxDevtools } from "../devtools/ngrx-devtools";
import { HyDialogBoxModule } from "@hyland/ui";
import { AdminBaseLayoutModule } from "./admin-base-layout/admin-base-layout.module";
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    AdminAppComponent,
    AdminHeaderComponent,
    AdminMenuComponent,
    AdminWarningComponent,
    BackendErrorMessages,
    HylandSSOManagerComponent,
    AdminBaseLayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
   // ReactiveFormsModule,
    CommonModule,
    AppRoutingModule,
    AuthRoutingModule,
    StoreModule.forRoot({
      router: routerReducer,
      auth: authReducer,
    }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot(authEffects),
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatListModule,
    HyDialogBoxModule,
    AdminHomeModule,
    AdminSystemInformationModule,
    AdminBulkActionMonitoringModule,
    AdminElasticSearchReindexModule,
    AdminFullTextReindexModule,
    AdminThumbnailGenerationModule,
    AdminPictureRenderGenerationModule,
    AdminVideoRenderGenerationModule,
    AdminBaseLayoutModule
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
