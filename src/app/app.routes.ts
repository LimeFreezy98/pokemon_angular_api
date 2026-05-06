import { Routes } from '@angular/router';
import { Login } from './components/page/login/login';
import { Stats } from './components/page/stats/stats';
import { GameSetup } from './components/page/game-setup/game-setup';

import { GameComponent } from './components/page/game/game';
import { MultiplayerGameComponent } from './components/page/multiplayer-game/multiplayer-game';
import { Login } from './components/page/login/login';
import { Stats } from './components/page/stats/stats';
import { GameSetup } from './components/page/game-setup/game-setup';

export const routes: Routes = [
  { path: '', redirectTo: '/game', pathMatch: 'full' },
  { path: 'game', component: GameComponent },
  { path: 'multiplayer', component: MultiplayerGameComponent },
  { path: 'login', component: Login },
  { path: 'stats', component: Stats },
  { path: 'setup', component: GameSetup },
];