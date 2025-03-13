import { MatTooltipModule } from "@angular/material/tooltip";
import { GenericMultiFeatureLayoutModule } from "./features/sub-features/generic-multi-feature-layout/generic-multi-feature-layout.module";
import { GenericModalComponent } from "./features/sub-features/generic-multi-feature-layout/components/generic-modal/generic-modal.component";
import { bulkActionMonitoringReducer } from "./features/bulk-action-monitoring/store/reducers";
import { BaseLayoutModule } from "./layouts/base-layout/base-layout.module";
import { BaseLayoutComponent } from "./layouts/base-layout/components/base-layout.component";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { StoreModule } from "@ngrx/store";
import { StoreRouterConnectingModule, routerReducer } from "@ngrx/router-store";
import { EffectsModule } from "@ngrx/effects";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { AppRoutingModule } from "./app-routing.module";
import { HomeModule } from "./features/home/home.module";
import { WarningComponent } from "./features/warning/warning.component";
import { BackendErrorMessagesComponent } from "./shared/components/backendErrorMessages/backendErrorMessages.component";
import { AppComponent } from "./app.component";
import { authReducer } from "./auth/store/reducers";
import * as authEffects from "./auth/store/effects";
import { ngrxDevtools } from "../devtools/ngrx-devtools";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { HeaderBarComponent } from "./layouts/header-bar/header-bar.component";
import { MenuBarComponent } from "./layouts/menu-bar/menu-bar.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatListModule } from "@angular/material/list";
import { homeReducer } from "./features/home/store/reducers";
import { ProbeDataReducer } from "./features/sub-features/probes-data/store/reducers";
import * as HomeEffects from "./features/home/store/effects";
import * as ProbesEffects from "./features/sub-features/probes-data/store/effects";
import * as ReindexEffects from "./features/sub-features/generic-multi-feature-layout/store/effects";
import * as BulkActionMonitoringEffects from "./features/bulk-action-monitoring/store/effects";
import * as StreamEffects from "./features/stream/store/effects";
import {
  folderActionReducer,
  documentActionReducer,
  nxqlActionReducer,
} from "./features/sub-features/generic-multi-feature-layout/store/reducers";
import { BulkActionMonitoringModule } from "./features/bulk-action-monitoring/bulk-action-monitoring.module";
import { ProbesDataModule } from "./features/sub-features/probes-data/probes-data.module";
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule,
} from "@angular/material/dialog";
import { CustomSnackBarComponent } from "./shared/components/custom-snack-bar/custom-snack-bar.component";
import { AuthInterceptorService } from "./auth/services/auth-interceptor.service";
import { StreamModule } from "./features/stream/stream.module";
import { streamsReducer } from "./features/stream/store/reducers";
import { ErrorModalComponent } from "./shared/components/error-modal/error-modal.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderBarComponent,
    MenuBarComponent,
    WarningComponent,
    BackendErrorMessagesComponent,
    BaseLayoutComponent,
    GenericModalComponent,
    ErrorModalComponent,
    CustomSnackBarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    CommonModule,
    AppRoutingModule,
    StoreModule.forRoot({
      router: routerReducer,
      auth: authReducer,
      home: homeReducer,
      documentAction: documentActionReducer,
      folderAction: folderActionReducer,
      nxqlAction: nxqlActionReducer,
      bulkActionMonitoring: bulkActionMonitoringReducer,
      probes: ProbeDataReducer,
      streams: streamsReducer
    }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot(
      authEffects,
      HomeEffects,
      ReindexEffects,
      BulkActionMonitoringEffects,
      ProbesEffects,
      StreamEffects
    ),
    MatIconModule,
    MatTooltipModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    HomeModule,
    StreamModule,
    MatListModule,
    BaseLayoutModule,
    MatSidenavModule,
    MatButtonModule,
    FormsModule,
    MatCheckboxModule,
    BulkActionMonitoringModule,
    ProbesDataModule,
    GenericMultiFeatureLayoutModule,
    MatDialogModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    ngrxDevtools,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
