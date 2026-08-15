// build-www.js
// Copies the deployable game files (index.html, src/, styles/, images/,
// manifest.json) into a "www" folder, which Capacitor uses as its webDir
// when packaging the native Android app. This keeps the game's source at
// the repo root (used for GitHub Pages) while giving Capacitor a clean,
// isolated folder to copy from.

import { cpSync, rmSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const wwwDir = path.join(__dirname, 'www');

if (existsSync(wwwDir)) {
  rmSync(wwwDir, { recursive: true, force: true });
}
mkdirSync(wwwDir, { recursive: true });

const filesAndDirs = [
  'index.html',
  'manifest.json',
  'privacy.html',
  'src',
  'styles',
  'images'
];

for (const item of filesAndDirs) {
  const srcPath = path.join(__dirname, item);
  const destPath = path.join(wwwDir, item);
  if (existsSync(srcPath)) {
    cpSync(srcPath, destPath, { recursive: true });
    console.log(`Copied ${item} -> www/${item}`);
  } else {
    console.warn(`Skipped missing: ${item}`);
  }
}

console.log('www/ build complete.');
