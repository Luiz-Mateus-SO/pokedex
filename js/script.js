let isFirstSearch = true; 
let offset = 0; 
const limit = 20;
let currentType = null; 
let useShowdownSprites = true; 


const typeColors = {
  normal: 'linear-gradient(135deg, #A8A77A, #D3D3B3)',
  fire: 'linear-gradient(135deg, #EE8130, #FFB347)',
  water: 'linear-gradient(135deg, #6390F0, #7AC7FF)',
  electric: 'linear-gradient(135deg, #F7D02C, #FFF200)',
  grass: 'linear-gradient(135deg, #7AC74C, #B2FF59)',
  ice: 'linear-gradient(135deg, #96D9D6, #CFFAFF)',
  fighting: 'linear-gradient(135deg, #C22E28, #FF6A6A)',
  poison: 'linear-gradient(135deg, #A33EA1, #DA70D6)',
  ground: 'linear-gradient(135deg, #E2BF65, #FFD27F)',
  flying: 'linear-gradient(135deg, #A98FF3, #D9B3FF)',
  psychic: 'linear-gradient(135deg, #F95587, #FFAAC0)',
  bug: 'linear-gradient(135deg, #A6B91A, #D4FF4C)',
  rock: 'linear-gradient(135deg, #B6A136, #E0D27F)',
  ghost: 'linear-gradient(135deg, #735797, #A88FEF)',
  dragon: 'linear-gradient(135deg, #6F35FC, #A78CFF)',
  dark: 'linear-gradient(135deg, #705746, #A08780)',
  steel: 'linear-gradient(135deg, #B7B7CE, #E0E0F0)',
  fairy: 'linear-gradient(135deg, #D685AD, #FFC0CB)'
};


const menuList = document.querySelector('.menu-list');

function createTypeNavigationItens(typeName) {
  const createMenuItem = createPokemonElements('li', 'menu-item')
  const createBtn = document.createElement('button');

  createBtn.innerText = typeName

  createBtn.addEventListener('click', () => {
    currentType = typeName;
    offset = 0;
    loadPokemonByType(typeName);
  })

  menuList.appendChild(createMenuItem)
  createMenuItem.appendChild(createBtn)
}

async function getPokemonTypes() {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/type/');
    const data = await response.json();
  
    const types = data.results.map(type => type.name)
  
    return types
  } catch (error) {
    console.error('Erro ao buscar tipos de Pokémon:', error);
  }
}


async function populateTypeNav() {
  const types = await getPokemonTypes();

  types.forEach(typeName => {
    createTypeNavigationItens(typeName)
  })
}

async function loadPokemonByType(typeName, start = 0, loadLimit = 20) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${typeName}/`);
    const data = await response.json();
    
    const pokemons = data.pokemon.map(p => p.pokemon.name);

    if(start === 0) clearPokemonList();
    
    const slice = pokemons.slice(start, start + loadLimit);

    for(const name of slice) {
      const pokemon = await getPokemonCardData(name);
      if(pokemon) createPokemon(pokemon)
    }

    offset += loadLimit;
  } catch(error) {
    console.error('Erro ao carregar Pokémon por tipo:', error);
  }
}


function createPokemonContainers() {
   let pokemonItemStructure =
    `<li class="pokemon-item">
        <div class="pokemon-item__image-bg"></div>
        <div class="pokemon-info__container">
          <ul class="pokemon-info__list"></ul>
        </div>
      </li>`;

  pokemonList.insertAdjacentHTML('beforeend', pokemonItemStructure);
}

function createPokemonElements(tag, className) {
  const el = document.createElement(tag);
  if (className) el.classList.add(className);
  return el; // ⚡ retorna o elemento
}

const pokemonList = document.querySelector('.pokemon-list');
const pokemonCardList = document.querySelector('.pokemon-info__list');
const pokemonInfoContainer = document.querySelector('.pokemon-info__container');
const pokemonImgContainer = document.querySelector('.pokemon-item__image-bg');
const pokemonItem = document.querySelector('.pokemon-item');
const searchBar = document.querySelector('.search-bar');
const searchIcon = document.querySelector('.search-icon');
const loadMoreBtn = document.querySelector('.load-more');
const clearAll = document.querySelector('.clear-all');


async function handleSearch(inputText) {
  let name = sanitizeInput(inputText);
  if(!name) return alert('Erro: Busca Vazia');

  if(isFirstSearch) {
    clearPokemonList()
    isFirstSearch = false;
  }
  
  searchBar.value = ''
  try {
    const pokemon = await getPokemonCardData(name);
    if(!pokemon) return alert('Pokemon não encontrado')
    createPokemon(pokemon)
  } catch (err) {
    console.log('Erro na busca')
  } finally {
    console.log('busca concluida')
  }
}


function createNameAndTypePokemonContainer(infoContainerEl, name, type) {
  const nameContainer = createPokemonElements('div', 'pokemon-info__name-container');
  const nameEl = createPokemonElements('h2', 'pokemon-info__name');
  const typeEl = createPokemonElements('span', 'pokemon-info__type');

  nameEl.innerText = name;
  typeEl.innerText = type;

  infoContainerEl.insertBefore(nameContainer, infoContainerEl.firstChild);
  nameContainer.appendChild(nameEl);
  nameContainer.appendChild(typeEl);
}

import { createPokemonElements } from "./helpers.js";

// containerEl: elemento onde a imagem será inserida
// showdownUrl: URL do sprite animado
// artworkUrl: URL do artwork oficial
// useShowdownSprites: boolean indicando qual imagem usar
export function createPokemonSprite(containerEl, showdownUrl, artworkUrl, useShowdownSprites) {
  const img = createPokemonElements('img', 'pokemon-image');

  img.dataset.showdown = showdownUrl;
  img.dataset.artwork = artworkUrl;

  if (useShowdownSprites) {
    // Se estiver usando sprites animados
    img.src = showdownUrl;
  } else {
    // Usando artwork otimizado local
    // Exemplo: artworkUrl = "pikachu.png"
    const baseName = artworkUrl.split('/').pop().split('.')[0]; // "pikachu"
    const ext = artworkUrl.split('.').pop(); // "png" ou "jpg"

    img.src = `./img/optimized/${baseName}-360w.${ext}`;
    img.srcset = `
      ./img/optimized/${baseName}-360w.${ext} 360w,
      ./img/optimized/${baseName}-720w.${ext} 720w,
      ./img/optimized/${baseName}-1080w.${ext} 1080w
    `;
    img.sizes = `(max-width: 600px) 360px, (max-width: 1200px) 720px, 1080px`;
  }

  // Lazy loading para performance
  img.loading = 'lazy';

  // fallback caso a imagem não carregue
  img.onerror = () => {
    img.src = artworkUrl;
  };

  containerEl.appendChild(img);
}


function convertValueToPercent(value, max = 255) {
        const percent = Math.min((value / max) * 100, 100); // regra de 3
        return Math.round(percent) + '%'; // arredonda e adiciona '%'
  }


function createPokemonStats(cardContainer, statName, statValue) {
      let pokemonCard = createPokemonElements('li', 'pokemon-info__item');
      let pokemonCardTitle = createPokemonElements('h3', 'pokemon-info__title');
      let pokemonCardBar = createPokemonElements('div', 'pokemon-info__bar');
      const infoBar = document.querySelector('.pokemon-info__bar');

      cardContainer.appendChild(pokemonCard)
      pokemonCard.insertBefore(pokemonCardTitle, pokemonCard.firstChild)
      pokemonCard.appendChild(pokemonCardBar)

      pokemonCardTitle.innerText = statName;    

      let statPercent = convertValueToPercent(statValue);
      // ✅ aplica a variável CSS apenas no elemento da barra atual
      pokemonCardBar.style.setProperty("--fill", statPercent);
  }

  function createPokemon(pokemon) {
    createPokemonContainers(); // cria um novo li
    const pokemonItem = pokemonList.querySelector('.pokemon-item:last-child'); // pega o último li
    const pokemonImgContainer = pokemonItem.querySelector('.pokemon-item__image-bg');
    const pokemonInfoContainer = pokemonItem.querySelector('.pokemon-info__container');
    const pokemonCardList = pokemonItem.querySelector('.pokemon-info__list');

    const typeColor = typeColors[pokemon.type] || '#28272B';
    pokemonImgContainer.style.background = typeColor;
    const statsToShow = ['hp', 'attack', 'defense', 'special-attack', 'speed'];

    createPokemonSprite(pokemonImgContainer, pokemon.spriteUrl, pokemon.artworkUrl);
    createNameAndTypePokemonContainer(pokemonInfoContainer, pokemon.name, pokemon.type);

    Object.keys(pokemon.stats)
          .filter(statName => statsToShow.includes(statName))
          .forEach(statName => {
              const statValue = pokemon.stats[statName];
              createPokemonStats(pokemonCardList, statName, statValue);
          });
}

async function initPokemonList(loadLimit = limit) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${loadLimit}&offset=${offset}`);
;
    const data = await response.json();

    for (const p of data.results) {
            const pokemon = await getPokemonCardData(p.name);
            if (pokemon) createPokemon(pokemon);
        }

        offset += loadLimit
  } catch (err) {
    console.error('Erro ao carregar Pokémon inicial:', err)
  }
}

async function getPokemonCardData(name) {
  try {
    // 1️⃣ Busca os dados do Pokémon na PokéAPI
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    const data = await response.json();

    // 2️⃣ Pega o sprite animado do Showdown e artwork oficial
    const spriteUrl = `https://play.pokemonshowdown.com/sprites/ani/${name.toLowerCase()}.gif`;
    const artworkUrl = data.sprites.other['official-artwork'].front_default;
    // 3️⃣ Converte os stats diretamente em "porcentagem" simples
    const statsPercent = {};
    data.stats.forEach(stat => {
      statsPercent[stat.stat.name] = stat.base_stat; // valor bruto como porcentagem
    });
    console.log(data)

    // 4️⃣ Cria o objeto final pronto para usar no card
    return {
      name: data.name,
      type: data.types[0].type.name,
      spriteUrl,
      artworkUrl,
      stats: statsPercent // valores prontos para width
    };

  } catch (error) {
    console.error('Erro ao buscar Pokémon:', error);
  }
}

function toggleAllSprites() {
  useShowdownSprites = !useShowdownSprites; // inverte o estado

  const allPokemonImages = document.querySelectorAll('.pokemon-image');
  allPokemonImages.forEach(img => {
    const showdownUrl = img.dataset.showdown;
    const artworkUrl = img.dataset.artwork;

    if (useShowdownSprites) {
      img.src = showdownUrl;
      img.style.width = ''; // volta para o CSS padrão
    } else {
      img.src = artworkUrl;
      img.style.width = '200px'; // largura fixa para artworks
    }
  });
}



function sanitizeInput(value) {
  return value.trim().toLowerCase();
}


function clearPokemonList() {
  pokemonList.innerHTML = ''; // mais simples
  offset = 0
}


  searchBar.addEventListener('keydown', (event) => {
    if(event.key === 'Enter') {
      handleSearch(searchBar.value)
    };
  })

  searchIcon.addEventListener('click', handleSearch)

loadMoreBtn.addEventListener('click', async () => {
  if (currentType) {
    // Se um tipo está selecionado, carrega mais desse tipo
    await loadPokemonByType(currentType, offset, limit);
  } else {
    // Se nenhum tipo selecionado, continua carregando da Pokédex geral
    await initPokemonList(limit, offset);
  }
});

  const artChangeBtn = document.querySelector('.art-change__btn');
  artChangeBtn.addEventListener('click', toggleAllSprites);


  clearAll.addEventListener('click', () => {
    clearPokemonList()
    initPokemonList()
  })

  window.addEventListener('DOMContentLoaded', () => {
    initPokemonList(); 
    populateTypeNav();
});

