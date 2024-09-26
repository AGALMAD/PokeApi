import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pokemon } from '../models/pokemon';
import { Observable, forkJoin, lastValueFrom } from 'rxjs';
import { PokemonDetail } from '../models/pokemon-detail';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService{

  readonly BASE_URL = 'https://pokeapi.co/api/v2/' //URL desde donde se van a recoger los datos de los pokemoms


  constructor(private http: HttpClient) { } 


  //Funcion para recoger los pokemos desde la URL 
  async getAllPokemon(): Promise<Pokemon[]> { /*Recoge de forma asíncrona todos los pokemon desde la BASE_URL 
                                              y los recoge en un array de pokemon */

                    //objetos observables : vigilan si se envia o no un mensaje
    const requests: Observable<Object>[] = []; //Array vacio donde se van a almacenar los objetos pokemon

    //Recoge los 151 pokemon 
    for (let i = 1; i <= 151; i++) {

                    //Todas la variables globales y los métodos llevan this
      requests.push(this.http.get(`${this.BASE_URL}pokemon/${i}`)); /**Almacena en el array anterior los 151 pokemons
                                                                        que estan almacenados en la URL */

    }

    /**Espera a que se terminen de hacer todas la peticiones a la URL
      *Y almacena en el nuevo array todos los objetos de los pokemon ordenados */
    const allDataRaw: any[] = await lastValueFrom(forkJoin(requests));

    //Array donde se van a almacenar todos los objetos tipo Pokemon 
    const pokemons: Pokemon[] = [];

    //Recorre el array de los pokemon ordenados
    for (const data of allDataRaw) {
      //Almacena en esta variable el pokemon con todos sus datos
      const pokemon: Pokemon = {

        id: data.id,
        name: data.name,
        imageUrl: data.sprites.other['official-artwork'].front_default,
        types: (data.types as any[]).map(type => type.type.name)

      };
      //Lo inserta en el array de los pokemon
      pokemons.push(pokemon);

    }

    //Retorna el array
    return pokemons;  


  }

  //Obtener los detalles de cada pokemon
  async getPokemonDetail(id: number): Promise<PokemonDetail> {

    const request: Observable<Object> = this.http.get(`${this.BASE_URL}pokemon/${id}`); //Devuelve un objeto observable del pokemon que tenga la id que queramos desde la URL de la pokemon api

    const dataRaw: any = await lastValueFrom(request); //Pasa el observable a un objeto json para poder obtener los datos

    const pokemon: PokemonDetail = {
      id: dataRaw.id,
      name: dataRaw.name,
      imageUrl: dataRaw.sprites.other['official-artwork'].front_default,
      types: (dataRaw.types as any[]).map(type => type.type.name),
      height: dataRaw.height,
      weight: dataRaw.weight
    };


    return pokemon;
    
  }
}