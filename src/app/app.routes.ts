import { Routes } from '@angular/router';
import { Login } from './components/page/login/login';
import { Stats } from './components/page/stats/stats';
import { GameSetup } from './components/page/game-setup/game-setup';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'game-setup', component: GameSetup },
  { path: 'stats', component: Stats}
];