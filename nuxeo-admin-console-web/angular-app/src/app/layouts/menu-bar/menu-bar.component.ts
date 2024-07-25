import { Component } from "@angular/core";
import { ADMIN_MENU, Menu } from "./menu-bar.constants";
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { toggleMenu } from "./store/action";
@Component({
  selector: "menu-bar",
  templateUrl: "./menu-bar.component.html",
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent {
  menu: Menu[] = ADMIN_MENU;
  isMenuOpen$!: Observable<boolean>;
  constructor(private store: Store<{ menu: { isOpen: boolean } }>) {
    this.isMenuOpen$ = this.store.select(state => {
      console.log('State:', state); 
      return state.menu.isOpen;
    });
  }
  toggleMenuButton() {
    this.store.dispatch(toggleMenu());
  }
  menuItemSelected(id: number): void {
    this.menu = this.menu.map(item => ({
      ...item,
      isSelected: item.id === id
    }));
  }
}