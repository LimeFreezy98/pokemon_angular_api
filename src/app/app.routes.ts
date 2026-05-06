import { Routes } from '@angular/router';
import { Login } from './components/page/login/login';
import { Stats } from './components/page/stats/stats';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'stats', component: Stats}
];