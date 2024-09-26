import { Component, OnInit } from '@angular/core';
import { DigitNumberPipe } from '../../pipes/digit-number.pipe';
import { TitleCasePipe } from '@angular/common';
import { PokemonTypeComponent } from '../../components/pokemon-type/pokemon-type.component';
import { PokemonDetail } from '../../models/pokemon-detail';
import { PokeapiService } from '../../services/pokeapi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [DigitNumberPipe, TitleCasePipe, PokemonTypeComponent],
  templateUrl: './pokemon.component.html',
  styleUrl: './pokemon.component.css'
})


export class PokemonComponent implements OnInit {
  pokemon: PokemonDetail | null = null;
  routeParamMap$: Subscription | null = null;

  constructor(private pokeapi: PokeapiService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { } //para leer la URL

  ngOnInit(): void {

    // El evento ngOnInit solo se llama una vez en toda la vida del componente.
    // Por tanto, para poder captar los cambios en la url nos suscribimos al paramMap del activatedRoute.
    // Cada vez que se cambie la url se llamará al método onIni

    this.routeParamMap$ = this.activatedRoute.paramMap.subscribe(async paramMap => {
      const id = paramMap.get('id') as unknown as number;
      this.pokemon = await this.pokeapi.getPokemonDetail(id);
    });

  }


  ngOnDestroy(): void {
    // Cuando este componente se destruye hay que cancelar la suscripción.
    // Si no se cancela se seguirá llamando aunque el usuario no esté ya en esta página

    this.routeParamMap$?.unsubscribe();
  }


  goPrevious() {
    this.goOtherPokemon(-1); //Llama a la siguiente función para pasar al siguiente pokemon restandole -1 al offset
  }

  goNext() {
    this.goOtherPokemon(+1); //Llama a la siguiente función para pasar al siguiente pokemon sumandole +1 al offset
  }

  goOtherPokemon(offset: number) {
    let id = this.pokemon?.id as number + offset;
    if (id < 1) {
      id = 151;
    } else if (id > 151) {
      id = 1;
    }
    this.router.navigateByUrl(`pokemon/${id}`);
  }


}