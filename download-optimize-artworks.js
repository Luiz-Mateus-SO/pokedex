import fetch from 'node-fetch';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const outputFolder = './img/optimized';
if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder);

// Larguras que vamos gerar
const sizes = [360, 720, 1080];

// Função para baixar imagem
async function downloadImage(url, filePath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro ao baixar: ${url}`);
  const buffer = await res.buffer();
  fs.writeFileSync(filePath, buffer);
}

// Lista de Pokémon (exemplo: primeiros 150)
const pokemonList = Array.from({length: 150}, (_, i) => i + 1);

async function main() {
  for (const id of pokemonList) {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await res.json();
      const name = data.name;
      const artworkUrl = data.sprites.other['official-artwork'].front_default;

      if (!artworkUrl) continue;

      const ext = path.extname(artworkUrl) || '.png';
      const baseName = name;

      // Baixa a imagem original temporária
      const tempPath = path.join(outputFolder, `${baseName}-temp${ext}`);
      await downloadImage(artworkUrl, tempPath);

      // Gera versões otimizadas
      for (const width of sizes) {
        await sharp(tempPath)
          .resize({ width })
          .toFile(path.join(outputFolder, `${baseName}-${width}w${ext}`));
        console.log(`Gerado: ${baseName}-${width}w${ext}`);
      }

      // Remove imagem temporária
      fs.unlinkSync(tempPath);

    } catch (err) {
      console.error(`Erro com Pokémon ID ${id}:`, err);
    }
  }

  console.log('Concluído!');
}

main();
