import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '..', 'status-posts');
fs.mkdirSync(outDir, { recursive: true });

// Remove previous .jpg versions so only the clean rounded-corner .png cards remain
for (const existing of fs.readdirSync(outDir)) {
  if (existing.endsWith('.jpg')) {
    fs.unlinkSync(path.join(outDir, existing));
  }
}

const POSTERS = [
  ['Poster01', '01_Tuftly_Status_Cloud_Name_Rug.png'],
  ['Poster02', '02_Tuftly_Status_ManUtd_Club_Crest.png'],
  ['Poster03', '03_Tuftly_Status_Pink_Wavy_Checker.png'],
  ['Poster04', '04_Tuftly_Status_Modern_Minimal_Wave.png'],
  ['Poster05', '05_Tuftly_Status_Olive_Scallop_Rug.png'],
  ['Poster06', '06_Tuftly_Status_Earth_Puzzle_Carpet.png'],
  ['Poster07', '07_Tuftly_Status_God_Loves_You_Rug.png'],
  ['Poster08', '08_Tuftly_Status_Pink_Heart_Home.png'],
  ['Poster09', '09_Tuftly_Status_Custom_Script_Name.png'],
  ['Poster10', '10_Tuftly_Status_Rockstar_Studio_Icon.png'],
];

console.log('Bundling Remotion poster suite once...');
const bundled = await bundle({
  entryPoint: path.resolve(__dirname, 'src', 'index.ts'),
  publicDir: path.resolve(__dirname, 'public'),
});

for (const [id, fileName] of POSTERS) {
  const composition = await selectComposition({
    serveUrl: bundled,
    id,
  });
  const output = path.join(outDir, fileName);
  await renderStill({
    composition,
    serveUrl: bundled,
    output,
    imageFormat: 'png',
    omitBackground: true,
  });
  console.log('Rendered:', fileName);
}
console.log('All 10 rounded Status PNG cards rendered!');
