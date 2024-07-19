import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { BaseLayoutComponent } from './components/base-layout.component';
import { HeaderBarModule } from "../header-bar/header-bar.module";
import { MenuBarModule } from "../menu-bar/menu-bar.module";


@NgModule({
  declarations: [BaseLayoutComponent],
  imports: [CommonModule, RouterModule,HeaderBarModule,MenuBarModule],
  exports: [BaseLayoutComponent]
})
export class BaseLayoutModule { }
