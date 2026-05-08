import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface PokemonSet {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-game-setup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './game-setup.html',
  styleUrl: './game-setup.css'
})
export class GameSetup {
  playersCount: number = 1;
  matches: number = 8;
  selectedSet: string = 'base1';


  private router = inject(Router);

  startGame() {
    console.log('🎮 Starting single player game...');
    console.log('Players:', this.playersCount);
    console.log('Matches:', this.matches);
    console.log('Set:', this.selectedSet);

    this.router.navigate(['/game'], {
      queryParams: {
        players: this.playersCount,
        matches: this.matches,
        set: this.selectedSet
      }
    });
  }

  goToMultiplayer() {
    console.log('👥 Starting multiplayer game...');
    this.router.navigate(['/multiplayer'], {
      queryParams: {
        players: this.playersCount,
        matches: this.matches,
        set: this.selectedSet
      }
    });
  }

  goToStats() {
    console.log('📊 Navigating to stats...');
    this.router.navigate(['/stats']);
  }
}