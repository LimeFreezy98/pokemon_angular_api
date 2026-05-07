import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-game-setup',
  imports: [FormsModule],
  templateUrl: './game-setup.html',
  standalone: true,
  styleUrl: './game-setup.css',

})
export class GameSetup {

private router = inject(Router);

// playersCount = 1;
// matches = 4;
// selectedSet = '';

// startGame() {
//   // basic validation
//   if (this.matches % this.playersCount !== 0) {
//     alert('Matches must divide evenly among players');
//     return;
//   }

//   // pass data to game page
//   this.router.navigate(['/game'], {
//     state: {
//       playersCount: this.playersCount,
//       matches: this.matches,
//       selectedSet: this.selectedSet
//     }
//   });
//  }

startSinglePlayer() {
  this.router.navigate(['/game']);
}

 goToStats() {
  this.router.navigate(['/stats']);
}
goToMultiplayer() {
  this.router.navigate(['/multiplayer']);
}
}