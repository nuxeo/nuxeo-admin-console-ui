import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HeaderBarComponent } from './header-bar.component';
import { MatToolbarModule } from "@angular/material/toolbar";
import { HyMaterialIconModule } from "@hyland/ui";

@NgModule({
  declarations: [HeaderBarComponent],
  imports: [CommonModule, RouterModule,MatToolbarModule,HyMaterialIconModule],
  exports: [HeaderBarComponent]
})
export class HeaderBarModule { }