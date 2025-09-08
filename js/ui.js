// ui.js
import { createPokemonElements } from "./helpers.js";
import { typeColors, useShowdownSprites } from "./state.js";

export function createPokemonContainers(pokemonList) {
  const pokemonItemStructure = `
    <li class="pokemon-item">
      <div class="pokemon-item__image-bg"></div>
      <div class="pokemon-info__container">
        <ul class="pokemon-info__list"></ul>
      </div>
    </li>`;
  pokemonList.insertAdjacentHTML('beforeend', pokemonItemStructure);
}

export function createPokemonSprite(containerEl, showdownUrl, artworkUrl, useShowdownSprites) {
  const img = createPokemonElements('img', 'pokemon-image');
  img.dataset.showdown = showdownUrl;
  img.dataset.artwork = artworkUrl;
  img.src = useShowdownSprites ? showdownUrl : artworkUrl;
  img.loading = 'lazy'; 
  img.onerror = () => img.src = artworkUrl;
  containerEl.appendChild(img);
}


export function createNameAndTypePokemonContainer(infoContainerEl, name, type) {
  const nameContainer = createPokemonElements('div', 'pokemon-info__name-container');
  const nameEl = createPokemonElements('h2', 'pokemon-info__name');
  const typeEl = createPokemonElements('span', 'pokemon-info__type');

  nameEl.innerText = name;
  typeEl.innerText = type;

  infoContainerEl.insertBefore(nameContainer, infoContainerEl.firstChild);
  nameContainer.appendChild(nameEl);
  nameContainer.appendChild(typeEl);
}


export function createPokemonStats(cardContainer, statName, statValue, convertValueToPercent) {
  const pokemonCard = createPokemonElements('li', 'pokemon-info__item');
  const pokemonCardTitle = createPokemonElements('h3', 'pokemon-info__title');
  const pokemonCardBar = createPokemonElements('div', 'pokemon-info__bar');

  cardContainer.appendChild(pokemonCard);
  pokemonCard.appendChild(pokemonCardTitle);
  pokemonCard.appendChild(pokemonCardBar);

  pokemonCardTitle.innerText = statName;
  pokemonCardBar.style.setProperty("--fill", convertValueToPercent(statValue));
}

export function createPokemon(pokemon, pokemonList, useShowdownSprites, convertValueToPercent) {
  const fragment = document.createDocumentFragment();

  const li = createPokemonElements('li', 'pokemon-item');
  const imgContainer = createPokemonElements('div', 'pokemon-item__image-bg');
  const infoContainer = createPokemonElements('div', 'pokemon-info__container');
  const infoList = createPokemonElements('ul', 'pokemon-info__list');

  infoContainer.appendChild(infoList);
  li.appendChild(imgContainer);
  li.appendChild(infoContainer);
  fragment.appendChild(li);
  pokemonList.appendChild(fragment);

  const typeColor = typeColors[pokemon.type] || '#28272B';
  imgContainer.style.background = typeColor;

  createPokemonSprite(imgContainer, pokemon.spriteUrl, pokemon.artworkUrl, useShowdownSprites);
  createNameAndTypePokemonContainer(infoContainer, pokemon.name, pokemon.type);

  const statsToShow = ['hp', 'attack', 'defense', 'special-attack', 'speed'];
  Object.keys(pokemon.stats)
    .filter(statName => statsToShow.includes(statName))
    .forEach(statName => createPokemonStats(infoList, statName, pokemon.stats[statName], convertValueToPercent));
}

