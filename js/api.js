// api.js
import { createPokemon } from "./ui.js";

export async function getPokemonTypes() {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/type/');
    const data = await response.json();
    return data.results.map(type => type.name);
  } catch (err) {
    console.error('Erro ao buscar tipos de Pokémon:', err);
  }
}

export async function getPokemonCardData(name) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    const data = await response.json();

    const spriteUrl = `https://play.pokemonshowdown.com/sprites/ani/${name.toLowerCase()}.gif`;
    const artworkUrl = data.sprites.other['official-artwork'].front_default;

    const statsPercent = {};
    data.stats.forEach(stat => {
      statsPercent[stat.stat.name] = stat.base_stat;
    });

    return {
      name: data.name,
      type: data.types[0].type.name,
      spriteUrl,
      artworkUrl,
      stats: statsPercent
    };
  } catch (err) {
    console.error('Erro ao buscar Pokémon:', err);
  }
}

export async function loadPokemonByType(typeName, start = 0, loadLimit = 20, pokemonList, clearPokemonList, offset, createPokemon) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${typeName}/`);
    const data = await response.json();
    const pokemons = data.pokemon.map(p => p.pokemon.name);

    if(start === 0) clearPokemonList();

    const slice = pokemons.slice(start, start + loadLimit);

    for(const name of slice) {
      const pokemon = await getPokemonCardData(name);
      if(pokemon) createPokemon(pokemon);
    }

    return offset + loadLimit;
  } catch (err) {
    console.error('Erro ao carregar Pokémon por tipo:', err);
  }
}
