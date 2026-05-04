import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getPokemonList(limit: number = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/pokemon?limit=${limit}`);
  }

  getPokemon(nameOrId: string | number): Observable<any> {
    return this.http.get(`${this.apiUrl}/pokemon/${nameOrId}`);
  }
}

export class PokemonApi {
  constructor(private pokemonService: PokemonService) {}

  getPokemonList(limit: number) {
    return this.pokemonService.getPokemonList(limit);
  }

  getPokemon(nameOrId: string | number) {
    return this.pokemonService.getPokemon(nameOrId);
  }
}