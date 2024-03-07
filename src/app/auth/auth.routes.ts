import {Route} from '@angular/router'
import {HylandSSOManagerComponent} from './components/SSO/hylandSSOManager.component'

export const ssoRoutes: Route[] = [
  {
    path: '',
    component: HylandSSOManagerComponent,
  },
]
