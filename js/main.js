import { isFirstSearch, limit, useShowdownSprites, currentType } from "./state.js";
import { sanitizeInput, convertValueToPercent } from "./helpers.js";
import { getPokemonCardData, getPokemonTypes, loadPokemonByType } from "./api.js";
import { createPokemon } from "./ui.js";

const pokemonList = document.querySelector('.pokemon-list');
const searchBar = document.querySelector('.search-bar');
const searchIcon = document.querySelector('.search-icon');
const loadMoreBtn = document.querySelector('.load-more');
const clearAll = document.querySelector('.clear-all');

let offset = 0; 
let isFirst = true;
let currentFilterType = null;

async function initPokemonList(loadLimit = limit) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${loadLimit}&offset=${offset}`);
    const data = await response.json();

    for (const p of data.results) {
      const pokemon = await getPokemonCardData(p.name);
      if (pokemon) createPokemon(pokemon, pokemonList, useShowdownSprites, convertValueToPercent);
    }

    offset += loadLimit;
  } catch (err) {
    console.error('Erro ao carregar Pokémon inicial:', err);
  }
}

async function populateTypeNav() {
  const types = await getPokemonTypes();
  const menuList = document.querySelector('.menu-list');

  types.forEach(typeName => {
    const li = document.createElement('li');
    li.classList.add('menu-item');
    const btn = document.createElement('button');
    btn.innerText = typeName;

    btn.addEventListener('click', async () => {
      currentFilterType = typeName;
      offset = 0;
      await loadPokemonByType(typeName, 0, limit, pokemonList, clearPokemonList, offset, createPokemonWrapper);
    });

    li.appendChild(btn);
    menuList.appendChild(li);
  });
}

function createPokemonWrapper(pokemon) {
  createPokemon(pokemon, pokemonList, useShowdownSprites, convertValueToPercent);
}

function clearPokemonList() {
  pokemonList.innerHTML = '';
  offset = 0;
}

searchBar.addEventListener('keydown', (event) => {
  if(event.key === 'Enter') handleSearch(searchBar.value);
});

searchIcon.addEventListener('click', () => handleSearch(searchBar.value));

loadMoreBtn.addEventListener('click', async () => {
  if(currentFilterType) {
    offset = await loadPokemonByType(currentFilterType, offset, limit, pokemonList, clearPokemonList, offset, createPokemonWrapper);
  } else {
    await initPokemonList(limit);
  }
});

clearAll.addEventListener('click', () => {
  clearPokemonList();
  initPokemonList();
});

async function handleSearch(inputText) {
  const name = sanitizeInput(inputText);
  if(!name) return alert('Erro: Busca vazia');

  if(isFirst) {
    clearPokemonList();
    isFirst = false;
  }

  searchBar.value = '';
  const pokemon = await getPokemonCardData(name);
  if(!pokemon) return alert('Pokémon não encontrado');

  createPokemonWrapper(pokemon);
}

const artChangeBtn = document.querySelector('.art-change__btn');
artChangeBtn.addEventListener('click', () => {
  useShowdownSprites = !useShowdownSprites;

  document.querySelectorAll('.pokemon-image').forEach(img => {
    img.src = useShowdownSprites ? img.dataset.showdown : img.dataset.artwork;
    if(!useShowdownSprites) img.style.width = '200px';
    else img.style.width = '';
  });
});

window.addEventListener('DOMContentLoaded', async () => {
  await initPokemonList();
  await populateTypeNav();
});
