// state.js
export let isFirstSearch = true;
export let offset = 0;
export const limit = 20;
export let currentType = null;
export let useShowdownSprites = true;

export const typeColors = {
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
