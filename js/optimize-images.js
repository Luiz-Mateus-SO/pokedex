import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputFolder = './img'; 
const outputFolder = './img/optimized'; 

if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder);

const images = fs.readdirSync(inputFolder).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

const sizes = [360, 720, 1080]; 

for (const imgName of images) {
  const inputPath = path.join(inputFolder, imgName);
  const ext = path.extname(imgName);
  const baseName = path.basename(imgName, ext);

  for (const width of sizes) {
    sharp(inputPath)
      .resize({ width })
      .toFile(path.join(outputFolder, `${baseName}-${width}w${ext}`))
      .then(() => console.log(`Gerado: ${baseName}-${width}w${ext}`))
      .catch(err => console.error(err));
  }
}
