import {Component, OnInit} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {Store} from '@ngrx/store'
import {authActions} from './auth/store/actions'
import {SideBarComponent} from './shared/components/sideBar/sideBar.component'
import {TopBarComponent} from './shared/components/topBar/topBar.component'

@Component({
  selector: 'admin-app-root',
  templateUrl: './admin-app.component.html',
  standalone: true,
  imports: [RouterOutlet, SideBarComponent, TopBarComponent],
})
export class AdminAppComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(authActions.getCurrentUser())
  }
}
