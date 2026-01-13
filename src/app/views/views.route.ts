import type { Route } from '@angular/router'
import { TransactionsComponent } from './apps/transactions/transactions.component'
import { WidgetsComponent } from './apps/widgets/widgets.component'

import { SettingsComponent } from './settings/component/settings/settings.component'
import { AnalyticsComponent } from './dashboards/analytics/analytics.component'
import { WalletListComponent } from './Wallet/wallet-list/wallet-list.component'
import { CyclesDetailsComponent } from './property/details/cycles-details/cycles-details.component'

import { adminGuard } from '../gaurds/auth.guard'


export const VIEWS_ROUTES: Route[] = [
  {
    path: 'dashboards',
    component: AnalyticsComponent,
    canActivate: [adminGuard],
    data: { title: 'Dashboard' },
  },
  {
    path: 'property',
    canActivate: [adminGuard], 
    loadChildren: () =>
      import('./property/property.route').then((mod) => mod.PROPERTY_ROUTES),
  },
  { path: ':propertyId/cycles', component: CyclesDetailsComponent }
  ,
  {
    path: 'agents',
    loadChildren: () =>
      import('./agents/agents.route').then((mod) => mod.AGENT_ROUTES),
  },
  {
    path: 'customers',
    canActivate: [adminGuard], 
    loadChildren: () =>
      import('./customers/customers.route').then((mod) => mod.CUSTOMER_ROUTES),
  },

  {
    path: 'investment',
    canActivate: [adminGuard], 
    loadChildren: () =>
      import('./investments/investment.route').then(
        (mod) => mod.INVESTMENT_ROUTES
      ),
  },

  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [adminGuard], 
    data: { title: 'Transactions' },
  },
  {
    path: 'wallet',
    canActivate: [adminGuard], 
    loadChildren: () =>
      import('./Wallet/wallet.route').then((mod) => mod.Wallet_ROUTES),
  },
  {
    path: 'distributions',
    canActivate: [adminGuard], 
    loadChildren: () =>
      import('./Distributions/Distributions.route').then((mod) => mod.Wallet_ROUTES),
  },
  {
    path: 'pages',
    loadChildren: () =>
      import('./pages/pages.route').then((mod) => mod.PAGES_ROUTES),
  },
  {
    path: 'widgets',
    component: WidgetsComponent,
    data: { title: 'Widgets' },
  },
  {
    path: 'extended',
    loadChildren: () =>
      import('./extended/extended.route').then((mod) => mod.EXTENDED_ROUTES),
  },
  {
    path: 'charts',
    loadChildren: () =>
      import('./charts/charts.route').then((mod) => mod.CHART_ROUTES),
  },
  {
    path: 'forms',
    loadChildren: () =>
      import('./forms/forms.route').then((mod) => mod.FORMS_ROUTES),
  },
  {
    path: 'tables',
    loadChildren: () =>
      import('./tables/table.route').then((mod) => mod.TABLE_ROUTES),
  },
  {
    path: 'icons',
    loadChildren: () =>
      import('./icons/icons.route').then((mod) => mod.ICONS_ROUTES),
  },
]
