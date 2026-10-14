import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (file) =>
  JSON.parse(fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'));
const source = read('src/content/productBrochureData.json');
const content = read('src/content/productBrochureContent.json');
const zh = read('src/locales/zh.json');
const en = read('src/locales/en.json');
const lookup = (resource, key) =>
  key.split('.').reduce((value, part) => value?.[part], resource);
const flatten = (value, prefix = '') =>
  Object.entries(value).flatMap(([key, item]) =>
    typeof item === 'object'
      ? flatten(item, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );
assert.deepEqual(
  flatten(zh.product_brochure).sort(),
  flatten(en.product_brochure).sort(),
  'Brochure locale keys must match',
);
assert.equal(content.pages.length, 26);
let lineCount = 0;
for (const [index, page] of content.pages.entries()) {
  const original = source.pages[index];
  assert.equal(page.id, original.id);
  assert.equal(page.sourcePage, original.sourcePage);
  const covered = new Set();
  for (const binding of page.bindings) {
    assert(
      !covered.has(binding.line),
      `Repeated line ${page.sourcePage}:${binding.line}`,
    );
    covered.add(binding.line);
    const text = lookup(zh, binding.key);
    const translation = lookup(en, binding.key);
    assert.equal(typeof text, 'string', `Missing Chinese key ${binding.key}`);
    assert.equal(
      typeof translation,
      'string',
      `Missing English key ${binding.key}`,
    );
    assert(
      !/[\u3400-\u9fff]/u.test(translation),
      `Untranslated English key ${binding.key}`,
    );
    const line = original.lines[binding.line];
    assert.equal(
      text.slice(binding.start, binding.end),
      line.text,
      `Source text changed at ${page.sourcePage}:${binding.line}`,
    );
    assert.equal(binding.runs.length, line.runs.length);
    binding.runs.forEach(([start, end], run) =>
      assert.equal(
        text.slice(start, end),
        line.runs[run].text,
        `Source run changed at ${page.sourcePage}:${binding.line}:${run}`,
      ),
    );
    lineCount++;
  }
  const expected = original.lines
    .map((line, i) =>
      !(line.y < 55 || (line.y > 790 && /^\d{2}$/.test(line.text))) ? i : null,
    )
    .filter((i) => i !== null);
  assert.deepEqual(
    [...covered].sort((a, b) => a - b),
    expected,
    `Source coverage differs on page ${page.sourcePage}`,
  );
  const renderedKeys = [];
  const imageIndices = [];
  for (const section of page.blocks)
    for (const block of section.children) {
      if (block.type === 'text') renderedKeys.push(block.key);
      if (block.type === 'table')
        renderedKeys.push(...block.rows.flat().filter(Boolean));
      if (block.type === 'diagram') renderedKeys.push(...block.keys);
      if (block.type === 'features')
        renderedKeys.push(block.titleKey, ...block.keys);
      if (block.type === 'cards')
        for (const card of block.items) {
          renderedKeys.push(card.titleKey, ...card.descriptionKeys);
          for (const image of card.images) {
            imageIndices.push(image.index);
            assert(lookup(en, image.altKey));
            assert(lookup(zh, image.altKey));
          }
        }
      if ('images' in block)
        for (const image of block.images) {
          imageIndices.push(image.index);
          assert(lookup(en, image.altKey));
          assert(lookup(zh, image.altKey));
        }
      if ('captions' in block)
        renderedKeys.push(...block.captions.map((caption) => caption.key));
    }
  assert.deepEqual(
    [...new Set(renderedKeys)].sort(),
    [...new Set(page.bindings.map((binding) => binding.key))].sort(),
    `Block copy coverage differs on page ${page.sourcePage}`,
  );
  const expectedImages = original.images
    .map((image, i) =>
      !/\/brand-(symbol|wordmark)\.png$/.test(image.src) ? i : null,
    )
    .filter((i) => i !== null);
  assert.deepEqual(
    imageIndices.sort((a, b) => a - b),
    expectedImages,
    `Image coverage differs on page ${page.sourcePage}`,
  );
}
assert(
  lookup(
    en,
    'product_brochure.products.openarm_z_plus.introduction.description',
  ).includes('F2 Pro'),
);
assert(
  lookup(
    en,
    'product_brochure.products.motion_data_platform.introduction.description',
  ).includes('100%'),
);
console.log(
  `Validated 26 pages, ${lineCount} source lines, exact Chinese runs, locale keys, and image coverage.`,
);
