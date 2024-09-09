import { describe, expect, it } from 'bun:test';
import { getPokedexData } from '../src/pokedex';

describe('Pokedex Data', () => {
    it('should return correct data for a valid Pokemon ID', () => {
        const pokemonData = getPokedexData(4); // Charmander
        expect(pokemonData.N).toBe('charmander');
    });
});
