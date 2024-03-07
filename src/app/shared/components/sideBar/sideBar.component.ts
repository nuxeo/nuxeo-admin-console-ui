import {CommonModule} from '@angular/common'
import {Component} from '@angular/core'
import {RouterLink} from '@angular/router'
import {Store} from '@ngrx/store'
import {combineLatest} from 'rxjs'
import {selectCurrentUser} from 'src/app/auth/store/reducers'

@Component({
  selector: 'admin-sidebar',
  templateUrl: './sideBar.component.html',
  standalone: true,
  imports: [RouterLink, CommonModule],
})
export class SideBarComponent {
  data$ = combineLatest({
    currentUser: this.store.select(selectCurrentUser),
  })
  constructor(private store: Store) {}
}
