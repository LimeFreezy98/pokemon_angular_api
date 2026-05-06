import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PokemonService } from '../../../pokemon-api';

interface Card {
  id: number;
  name: string;
  image: string;
  flipped: boolean;
  matched: boolean;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './game.html',
  styleUrls: ['./game.css'],
})
export class GameComponent implements OnInit {
  cards: Card[] = [];
  flippedCards: Card[] = [];
  moves: number = 0;
  matches: number = 0;
  gameStarted: boolean = true;

  constructor(
    private pokemonService: PokemonService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCards();
  }
  
  loadCards() {
    this.pokemonService.getPokemonList(150).subscribe((data: any) => {
      const randomPokemon = this.getRandomPokemon(data.results, 8);

      randomPokemon.forEach((pokemon: any, index: number) => {
        this.pokemonService.getPokemon(pokemon.name).subscribe((details: any) => {

        const card1: Card ={
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

flipCard(card: Card) {
  if (card.flipped || card.matched || this.flippedCards.length === 2) {
    return;
  }

  card.flipped = true;
  this.flippedCards.push(card);

  if (this.flippedCards.length === 2) {
    this.moves++;
    this.checkMatch();
}
}

checkMatch() {
  setTimeout(() => {
    const [card1, card2] = this.flippedCards;

    if (card1.name === card2.name) {
      card1.matched = true;
      card2.matched = true;
      this.matches++;

      if(this.matches === 8) {
        alert(`You won! Total moves: ${this.moves}`);
      }
    } else {
      card1.flipped = false;
      card2.flipped = false;
    }
    
    this.flippedCards = [];
    this.cdr.detectChanges();
  }, 1000);
}

resetGame() {
  this.cards = [];
  this.flippedCards = [];
  this.moves = 0;
  this.matches = 0;
  this.loadCards();
}

private getRandomPokemon(pokemonList: any[], count: number): any[] {
  const shuffled = [...pokemonList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

private shuffleArray(array: Card[]) {
  return [...array].sort(() => 0.5 - Math.random());
}
}