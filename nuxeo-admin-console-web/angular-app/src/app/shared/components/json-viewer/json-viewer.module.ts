import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JsonViewerComponent } from './json-viewer.component';

@NgModule({
  declarations: [
    JsonViewerComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
],
  exports: [
    JsonViewerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JsonViewerModule { }