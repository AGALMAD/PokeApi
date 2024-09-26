import { Component, OnInit } from '@angular/core';
import { PokeapiService } from '../../services/pokeapi.service';
import { Pokemon } from '../../models/pokemon';
import { Title } from '@angular/platform-browser';
import { TitleCasePipe } from '@angular/common';
import { DigitNumberPipe } from '../../pipes/digit-number.pipe';
import { PokemonTypeComponent } from '../../components/pokemon-type/pokemon-type.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [TitleCasePipe, DigitNumberPipe,PokemonTypeComponent, RouterModule, FormsModule],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.css'
})

export class PokemonListComponent implements OnInit{
  
  allPokemons: Pokemon[] = [];
  query: string = '';
  filteredPokemons: Pokemon[] = [];
  
  constructor(private pokeApi: PokeapiService) {}

  async ngOnInit(): Promise<void> {

    this.allPokemons = await this.pokeApi.getAllPokemon();
    this.search();  
  }



  search() {

    const clearedQuery = this.query?.trim(); //Si la query es nula guarda null, sino, llama al trim y almacena lo que devuelva

    // Si NO es nulo, vacío o solo tiene espacios en blanco
    if (this.query && clearedQuery) {//trim quita espacios en blaco

      this.filteredPokemons = this.allPokemons.filter(pokemon => //filter ---> devuelve todos los elementos del array que coincidan con la busqueda
      pokemon.name.includes(clearedQuery)); //devuelve todos los pokemons que en su nombre incluya la query

    } else {
      //Si no se hace la busqueda, devuelve todos los pokemons
      this.filteredPokemons = this.allPokemons; 
    }
  }
    

}
