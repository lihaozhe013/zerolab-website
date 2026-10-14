import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const reference = JSON.parse(
  readFileSync(
    path.join(projectRoot, 'src/content/productBrochureData.json'),
    'utf8',
  ),
);
const outputDirectory = path.join(projectRoot, 'dist');

for (const entry of readdirSync(outputDirectory, { withFileTypes: true })) {
  if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== '.pdf')
    continue;

  const filePath = path.join(outputDirectory, entry.name);
  const fileHash = createHash('sha256')
    .update(readFileSync(filePath))
    .digest('hex');
  if (fileHash === reference.source.sha256) unlinkSync(filePath);
}
