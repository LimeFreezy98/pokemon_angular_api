import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PokemonService } from '../../../pokemon-api';

interface Card {
  id: number;
  name: string;
  image: string;
  flipped: boolean;
  matched: boolean;
  matchedBy?: number; 
}

interface Player {
  id: number;
  name: string;
  score: number;
  isActive: boolean;
}

@Component({
  selector: 'app-multiplayer-game',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './multiplayer-game.html',
  styleUrls: ['./multiplayer-game.css'],
})
export class MultiplayerGameComponent implements OnInit {
  cards: Card[] = [];
  flippedCards: Card[] = [];
  players: Player[] = [];
  currentPlayerIndex: number = 0;
  gameStarted: boolean = false;
  gameOver: boolean = false;
  playerCount: number = 2;
  playerNames: string[] = ['Player 1', 'Player 2'];
  trackByIndex(index: number) {
    return index;
  }

  private playerColors: string[] = ['#007bff', '#28a745', '#ffc107', '#dc3545'];

  constructor(
    private pokemonService: PokemonService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
  }

  setupGame() {
    this.players = [];
    for (let i = 0; i < this.playerCount; i++) {
      this.players.push({
        id: i,
        name: this.playerNames[i] || `Player ${i + 1}`,
        score: 0,
        isActive: i === 0
      });
    }
    
    this.currentPlayerIndex = 0;
    this.gameStarted = true;
    this.gameOver = false;
    this.loadCards();
  }

  loadCards() {
    this.cards = [];
    this.pokemonService.getPokemonList(150).subscribe((data: any) => {
      const randomPokemon = this.getRandomPokemon(data.results, 8);

      randomPokemon.forEach((pokemon: any, index: number) => {
        this.pokemonService.getPokemon(pokemon.name).subscribe((details: any) => {
          const card1: Card = {
            id: index * 2,
            name: details.name,
            image: details.sprites.front_default,
            flipped: false,
            matched: false
          };
          
          const card2: Card = {
            id: index * 2 + 1,
            name: details.name,
            image: details.sprites.front_default,
            flipped: false,
            matched: false
          };
          
          this.cards.push(card1, card2);

          if (this.cards.length === 16) {
            this.cards = this.shuffleArray(this.cards);
            this.cdr.detectChanges();
          }
        });
      });
    });
  }

  getPlayerColor(playerId: number): string {
    return this.playerColors[playerId] || '#333';
  }

  flipCard(card: Card) {
    if (card.flipped || card.matched || this.flippedCards.length === 2 || this.gameOver) {
      return;
    }

    card.flipped = true;
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.checkMatch();
    }
  }

  checkMatch() {
    setTimeout(() => {
      const [card1, card2] = this.flippedCards;
      const currentPlayer = this.players[this.currentPlayerIndex];

      if (card1.name === card2.name) {
        card1.matched = true;
        card2.matched = true;
        card1.matchedBy = currentPlayer.id;
        card2.matchedBy = currentPlayer.id;
        currentPlayer.score++;

        if (this.cards.every(c => c.matched)) {
          this.endGame();
        }
      } else {
        card1.flipped = false;
        card2.flipped = false;
        this.nextPlayer();
      }

      this.flippedCards = [];
      this.cdr.detectChanges();
    }, 1000);
  }

  nextPlayer() {
    this.players[this.currentPlayerIndex].isActive = false;
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    this.players[this.currentPlayerIndex].isActive = true;
  }

  endGame() {
    this.gameOver = true;
    const maxScore = Math.max(...this.players.map(p => p.score));
    const winners = this.players.filter(p => p.score === maxScore);
    
    if (winners.length === 1) {
      alert(`${winners[0].name} wins with ${maxScore} matches!`);
    } else {
      const winnerNames = winners.map(w => w.name).join(' and ');
      alert(`It's a tie! ${winnerNames} both scored ${maxScore} matches!`);
    }
  }

  resetGame() {
    this.gameStarted = false;
    this.gameOver = false;
    this.cards = [];
    this.flippedCards = [];
    this.players = [];
    this.currentPlayerIndex = 0;
  }

  addPlayer() {
    if (this.playerCount < 4) {
      this.playerCount++;
      this.playerNames.push(`Player ${this.playerCount}`);
    }
  }

  removePlayer() {
    if (this.playerCount > 2) {
      this.playerCount--;
      this.playerNames.pop();
    }
  }

  private getRandomPokemon(pokemonList: any[], count: number): any[] {
    const shuffled = [...pokemonList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private shuffleArray(array: Card[]): Card[] {
    return [...array].sort(() => 0.5 - Math.random());
  }
}