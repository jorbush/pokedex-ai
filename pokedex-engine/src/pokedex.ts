import { readFileSync } from 'fs';

export interface PokemonData {
    Ab: Array<{ n: string; id: number; isH: boolean }>;
    BE: number;
    H: number;
    HI: string[];
    id: number;
    isD: boolean;
    N: string;
    Sp: { n: string; id: number };
    St: Array<{ n: string; EV: number; bs: number }>;
    T: Array<{ n: string; id: number }>;
    W: number;
}

export function getPokedexData(pokedexNumber: number): PokemonData {
    const pokedex = JSON.parse(
        readFileSync('./pokemon.json').toString()
    ).pokemon;
    return pokedex[pokedexNumber];
}
