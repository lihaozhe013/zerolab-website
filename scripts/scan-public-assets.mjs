import { readdirSync, readFileSync, statSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const publicRoot = path.join(projectRoot, 'public');
const imageExtensions = new Set([
  '.avif',
  '.bmp',
  '.gif',
  '.ico',
  '.jpeg',
  '.jpg',
  '.jp2',
  '.png',
  '.svg',
  '.tif',
  '.tiff',
  '.webp',
]);
const videoExtensions = new Set([
  '.3gp',
  '.avi',
  '.m4v',
  '.mkv',
  '.mov',
  '.mp4',
  '.mpeg',
  '.mpg',
  '.ogv',
  '.webm',
  '.wmv',
]);
const sourceExtensions = new Set([
  '.cjs',
  '.css',
  '.html',
  '.js',
  '.jsx',
  '.json',
  '.mjs',
  '.ts',
  '.tsx',
]);
const excludedSourceDirectories = new Set([
  '.git',
  'dist',
  'node_modules',
  'public',
  'tmp',
]);
const deleteUnused = process.argv.includes('--delete');
const checkOnly = process.argv.includes('--check');

if (deleteUnused && checkOnly) {
  console.error('Choose either --delete or --check.');
  process.exit(2);
}

if (process.argv.includes('--help')) {
  console.log(`Usage: node scripts/scan-public-assets.mjs [--check | --delete]

Scans image and video assets in public/ against literal references in src/,
index.html, and vite.config.ts. The default mode only reports unreferenced files.
--check  Exit with status 1 when unreferenced media exists.
--delete Delete unreferenced image and video files.`);
  process.exit(0);
}

if (!statSync(publicRoot, { throwIfNoEntry: false })?.isDirectory()) {
  console.error(`Public asset directory not found: ${publicRoot}`);
  process.exit(2);
}

function listFiles(directory, shouldInclude) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(filePath, shouldInclude));
    } else if (entry.isFile() && shouldInclude(filePath)) {
      files.push(filePath);
    }
  }
  return files;
}

function collectSourceFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedSourceDirectories.has(entry.name))
      continue;
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(filePath));
    } else if (
      entry.isFile() &&
      sourceExtensions.has(path.extname(entry.name).toLowerCase())
    ) {
      files.push(filePath);
    }
  }
  return files;
}

function relativePublicPath(filePath) {
  return path.relative(publicRoot, filePath).split(path.sep).join('/');
}

function referenceNeedles(filePath) {
  const publicPath = `/${relativePublicPath(filePath)}`;
  return new Set([
    publicPath,
    encodeURI(publicPath),
    publicPath.slice(1),
    encodeURI(publicPath.slice(1)),
  ]);
}

const sourceFiles = [
  ...collectSourceFiles(path.join(projectRoot, 'src')),
  ...['index.html', 'vite.config.ts']
    .map((file) => path.join(projectRoot, file))
    .filter((file) => statSync(file, { throwIfNoEntry: false })),
].map((filePath) => ({
  path: filePath,
  content: readFileSync(filePath, 'utf8'),
}));

const assets = listFiles(publicRoot, (filePath) => {
  const extension = path.extname(filePath).toLowerCase();
  return imageExtensions.has(extension) || videoExtensions.has(extension);
});

const unreferenced = assets.filter((assetPath) => {
  const needles = referenceNeedles(assetPath);
  return !sourceFiles.some(({ content }) =>
    [...needles].some((needle) => content.includes(needle)),
  );
});

const bytes = unreferenced.reduce(
  (total, filePath) => total + statSync(filePath).size,
  0,
);
const formatBytes = (value) => `${(value / 1024 / 1024).toFixed(2)} MiB`;

console.log(`Scanned ${assets.length} image and video files.`);
console.log(
  `Found ${unreferenced.length} unreferenced files (${formatBytes(bytes)}).`,
);

for (const filePath of unreferenced) {
  const kind = videoExtensions.has(path.extname(filePath).toLowerCase())
    ? 'video'
    : 'image';
  console.log(
    `${deleteUnused ? 'DELETE' : 'unused'}\t${kind}\t${formatBytes(statSync(filePath).size)}\t${relativePublicPath(filePath)}`,
  );
}

if (deleteUnused) {
  for (const filePath of unreferenced) unlinkSync(filePath);
  console.log(`Deleted ${unreferenced.length} unreferenced media files.`);
} else if (checkOnly && unreferenced.length > 0) {
  process.exitCode = 1;
}
