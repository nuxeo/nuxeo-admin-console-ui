import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { combineLatest } from "rxjs";
import { selectCurrentUser } from "../auth/store/reducers";
import { NAV_ITEMS, NavItem } from "./amin-menu.constants";
@Component({
  selector: "admin-menu",
  templateUrl: "./admin-menu.component.html",
  styleUrls: ['./admin-menu.component.css']
})
export class AdminMenuComponent {
  constructor(private store: Store) {}
  data$ = combineLatest({
    currentUser: this.store.select(selectCurrentUser),
  });
  navItems: NavItem[] = NAV_ITEMS;

  onClickSelectItem(id: number): void {
    this.navItems = this.navItems.map(item => ({
      ...item,
      isSelected: item.id === id
    }));
    const selectedItem = this.navItems.find(item => item.id === id);
    console.log('Clicked item details:', this.navItems);
  }
  
}