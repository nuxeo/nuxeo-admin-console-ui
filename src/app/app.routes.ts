import {Route} from '@angular/router'

export const appRoutes: Route[] = [
  {
    path: 'sso',
    loadChildren: () =>
      import('src/app/auth/auth.routes').then((m) => m.ssoRoutes),
  },
]
