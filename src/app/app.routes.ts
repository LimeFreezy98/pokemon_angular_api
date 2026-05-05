import { Routes } from '@angular/router';
import { GameComponent } from './components/page/game/game';

export const routes: Routes = [
  { path: '', redirectTo: '/game', pathMatch: 'full' },
  { path: 'game', component: GameComponent },
];