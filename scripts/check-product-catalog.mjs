import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const root = new URL('../', import.meta.url);
const read = (path) => JSON.parse(fs.readFileSync(new URL(path, root), 'utf8'));
const { products: systemProducts, partners } = read(
  'src/content/productCatalogData.json',
);
const { products: captureProducts } = read(
  'src/content/productCaptureData.json',
);
const products = [...systemProducts, ...captureProducts];
const source = read('src/content/productBrochureContent.json');
const locales = {
  en: read('src/locales/en.json'),
  zh: read('src/locales/zh.json'),
};
const lookup = (object, key) =>
  key.split('.').reduce((value, part) => value?.[part], object);
const keys = (object, prefix = '') =>
  Object.entries(object).flatMap(([key, value]) =>
    typeof value === 'object'
      ? keys(value, `${prefix}${key}.`)
      : `${prefix}${key}`,
  );
const validateKey = (key) => {
  for (const [language, locale] of Object.entries(locales))
    assert.equal(
      typeof lookup(locale, key),
      'string',
      `Missing ${language} translation: ${key}`,
    );
};
const validateFile = (path) => {
  const file = new URL(`public${path}`, root);
  assert(fs.existsSync(file), `Missing public asset: ${path}`);
  assert(
    !fs
      .readFileSync(file)
      .subarray(0, 50)
      .toString()
      .startsWith('version https://git-lfs.github.com'),
    `Unresolved LFS asset: ${path}`,
  );
};
for (const namespace of ['product_catalog', 'product_detail']) {
  assert.deepEqual(
    keys(locales.en[namespace]).sort(),
    keys(locales.zh[namespace]).sort(),
    `Locale shape differs: ${namespace}`,
  );
}
assert.equal(products.length, 12);
assert.equal(new Set(products.map((p) => p.slug)).size, 12);
assert.equal(partners.length, 7);
const legacyIds = products.flatMap((p) => p.legacyIds);
assert.equal(new Set(legacyIds).size, source.pages.length);
assert.deepEqual([...legacyIds].sort(), source.pages.map((p) => p.id).sort());
for (const product of products) {
  assert.match(product.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  validateKey(product.titleKey);
  validateKey(`product_catalog.models.${product.slug}`);
  validateKey(`product_catalog.families.${product.family}.name`);
  for (const key of [
    ...product.introduction,
    ...product.specificationKeys,
    ...product.features.flatMap((f) => [f.titleKey, ...f.keys]),
  ])
    validateKey(key);
  for (const feature of [...product.advantages, ...product.scenarios]) {
    [feature.titleKey, ...feature.descriptionKeys].forEach(validateKey);
  }
  const images = [
    product.hero,
    ...product.media,
    ...product.logos,
    ...product.scenarios.flatMap((s) => s.media),
  ];
  for (const image of images) {
    validateFile(image.src);
    validateKey(image.altKey);
    assert(
      image.width > 0 && image.height > 0,
      `Missing image dimensions: ${image.src}`,
    );
  }
  for (const table of product.tables) {
    validateKey(table.titleKey);
    table.rows.flat().filter(Boolean).forEach(validateKey);
    assert(
      table.rows.every((row) => row.length === table.rows[0].length),
      `Uneven table: ${product.slug}`,
    );
  }
  const sourceTables = source.pages
    .filter((p) => product.legacyIds.includes(p.id))
    .flatMap((p) =>
      p.blocks.flatMap((b) =>
        b.children.filter((c) => c.type === 'table').map((c) => c.rows),
      ),
    );
  assert.deepEqual(
    product.tables.map((t) => t.rows),
    sourceTables,
    `Source specifications changed: ${product.slug}`,
  );
  if (product.brochure) {
    validateFile(product.brochure.href);
    validateKey(product.brochure.label);
    assert.equal(
      fs
        .readFileSync(new URL(`public${product.brochure.href}`, root))
        .subarray(0, 4)
        .toString(),
      '%PDF',
    );
  }
  product.related.forEach((slug) =>
    assert(
      products.some((p) => p.slug === slug && p.slug !== product.slug),
      `Invalid related product: ${slug}`,
    ),
  );
}
for (const partner of partners) {
  validateKey(partner.nameKey);
  validateKey(partner.altKey);
  validateFile(partner.src);
}
execFileSync(
  process.execPath,
  ['scripts/generate-product-catalog.mjs', '--check'],
  { cwd: root, stdio: 'inherit' },
);
console.log(
  `Validated ${products.length} product routes, bilingual content, source tables, media, downloads, and legacy chapter coverage.`,
);
