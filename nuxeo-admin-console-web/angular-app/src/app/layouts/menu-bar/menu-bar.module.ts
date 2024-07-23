import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MenuBarComponent } from './menu-bar.component';
import { MatListModule } from "@angular/material/list";

@NgModule({
  declarations: [MenuBarComponent],
  imports: [CommonModule, RouterModule,MatListModule],
  exports: [MenuBarComponent]
})
export class MenuBarModule { }