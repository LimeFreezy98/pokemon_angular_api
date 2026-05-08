import { Routes } from '@angular/router';
import { GameComponent } from './components/page/game/game';
import { MultiplayerGameComponent } from './components/page/multiplayer-game/multiplayer-game';
import { Login } from './components/page/login/login';
import { Stats } from './components/page/stats/stats';
import { GameSetup } from './components/page/game-setup/game-setup';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'game', component: GameComponent },
  { path: 'multiplayer', component: MultiplayerGameComponent },
  { path: 'stats', component: Stats },
  { path: 'setup', component: GameSetup },
];