import { Routes } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

export const routeTransitionAnimations = trigger('enter', [
  transition('* => *', [
    style({ opacity: 0 }),
    animate('1s', style({ opacity: 1 }))
  ])
]);

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'sell',
    loadComponent: () => import('./pages/sell/sell.page').then( m => m.SellPage)
  },
  {
    path: 'add-supplier-stock',
    loadComponent: () => import('./pages/add-supplier-stock/add-supplier-stock.page').then( m => m.AddSupplierStockPage)
  },
  {
    path: 'add-positive',
    loadComponent: () => import('./pages/add-positive/add-positive.page').then( m => m.AddPositivePage)
  },
  {
    path: 'add-negative',
    loadComponent: () => import('./pages/add-negative/add-negative.page').then( m => m.AddNegativePage)
  },
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports/reports.page').then( m => m.ReportsPage)
  },
  {
    path: 'suppliers',
    loadComponent: () => import('./pages/suppliers/suppliers.page').then( m => m.SuppliersPage)
  },
  {
    path: 'stock',
    loadComponent: () => import('./pages/stock/stock.page').then( m => m.StockPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
];
