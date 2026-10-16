import fs from 'node:fs';
import { isDeepStrictEqual } from 'node:util';

const read = (path) =>
  JSON.parse(fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));
const source = read('src/content/productBrochureData.json');
const content = read('src/content/productBrochureContent.json');
const locale = read('src/locales/en.json');
const definitions = [
  [
    'openarm-z',
    'openarm_z',
    'robotics',
    'OpenArm-Z',
    [20, 21],
    'openarm-z-robot.png',
  ],
  [
    'openarm-zm',
    'openarm_zm',
    'robotics',
    'OpenArm-Zm',
    [22, 23],
    'openarm-zm-scenario.webp',
  ],
  [
    'openarm-z-plus',
    'openarm_z_plus',
    'robotics',
    'OpenArm-Z+',
    [24, 25],
    '../scenarios/smart-retail.webp',
  ],
  ['f1', 'f1', 'body', 'F1', [6, 7], 'f1-full-body-suit.png'],
  ['f2', 'f2', 'body', 'F2', [10, 11], 'f2-tracker-case.png'],
  [
    'f2-pro-plus',
    'f2_pro_plus',
    'body',
    'F2 Pro+',
    [12, 13],
    'f2-pro-plus-tracker.png',
  ],
  ['h1', 'h1', 'hands', 'H1', [8, 9], 'h1-data-gloves.png'],
  ['h2', 'h2', 'hands', 'H2', [14, 15], 'h2-dexterous-data-gloves.png'],
  [
    'h2-pro',
    'h2_pro',
    'hands',
    'H2 Pro',
    [16, 17],
    'h2-dexterous-data-gloves.png',
  ],
  [
    'h2-pro-plus',
    'h2_pro_plus',
    'hands',
    'H2 Pro+',
    [18, 19],
    'h2-pro-plus-data-gloves.png',
  ],
  [
    'zl9nsq',
    'zl9nsq',
    'silicon',
    'ZL9NSQ',
    [2, 3, 4, 5],
    'zl9nsq-size-comparison.png',
  ],
  [
    'motion-data-platform',
    'motion_data_platform',
    'platform',
    'Motion-Data Platform',
    [26, 27],
    '../scenarios/humanoid-data-platform.webp',
  ],
];
const brochures = {
  zl9nsq: {
    href: '/document/Chip_brochure.pdf',
    label: 'product_detail.downloads.chip',
  },
  'f2-pro-plus': {
    href: '/document/F-2Brochure.pdf',
    label: 'product_detail.downloads.body',
  },
  'h2-pro': {
    href: '/document/DataGloves Brochure.pdf',
    label: 'product_detail.downloads.gloves',
  },
  'openarm-z': {
    href: '/document/OpenArm BroChure20251223.pdf',
    label: 'product_detail.downloads.openarm',
  },
};
const products = definitions.map(
  ([slug, key, family, name, pages, heroFile]) => {
    const base = `product_brochure.products.${key}`;
    const product = {
      slug,
      key,
      family,
      name,
      base,
      legacyIds: [],
      introduction: [],
      media: [],
      advantages: [],
      scenarios: [],
      logos: [],
      tables: [],
      specificationKeys: [],
      features: [],
    };
    const media = (page, image) => {
      const original = source.pages.find(
        (p) => p.sourcePage === page.sourcePage,
      ).images[image.index];
      return {
        src: original.src,
        altKey: image.altKey,
        width: Math.round(original.w * 100),
        height: Math.round(original.h * 100),
      };
    };
    for (const page of content.pages.filter((p) =>
      pages.includes(p.sourcePage),
    )) {
      product.legacyIds.push(page.id);
      for (const section of page.blocks) {
        const title = section.children.find(
          (b) => b.type === 'text' && b.role === 'section_title',
        );
        for (const block of section.children) {
          if (block.type === 'text' && block.role === 'paragraph')
            product.introduction.push(block.key);
          if (block.type === 'media' || block.type === 'diagram')
            product.media.push(...block.images.map((i) => media(page, i)));
          if (block.type === 'logos')
            product.logos.push(...block.images.map((i) => media(page, i)));
          if (block.type === 'diagram')
            product.specificationKeys.push(...block.keys);
          if (block.type === 'features')
            product.features.push({
              titleKey: block.titleKey,
              keys: block.keys,
            });
          if (block.type === 'table')
            product.tables.push({
              titleKey: title?.key ?? `${base}.specifications.title`,
              rows: block.rows,
            });
          if (block.type === 'cards') {
            const cards = block.items.map((item) => ({
              titleKey: item.titleKey,
              descriptionKeys: item.descriptionKeys,
              media: item.images.map((i) => media(page, i)),
            }));
            if (block.kind === 'advantages') product.advantages.push(...cards);
            if (block.kind === 'scenarios') product.scenarios.push(...cards);
          }
        }
      }
    }
    if (slug === 'f2-pro-plus') {
      const labels = {
        'f2-pro-plus-tracker-case.png': 'gloves',
        'f2-pro-plus-gloves.png': 'tracker',
        'f2-pro-plus-tracker.png': 'kit',
      };
      for (const image of product.media)
        image.altKey =
          'product_detail.images.' + labels[image.src.split('/').at(-1)];
    }
    if (brochures[slug]) product.brochure = brochures[slug];
    const heroSrc = `/product-brochure/${heroFile.startsWith('../') ? heroFile.slice(3) : `products/${heroFile}`}`;
    const available = [
      ...product.media,
      ...product.scenarios.flatMap((s) => s.media),
    ];
    product.hero = available.find((m) => m.src === heroSrc);
    if (!product.hero) throw new Error(`Missing hero for ${slug}`);
    product.sceneHero = [
      'openarm-zm',
      'openarm-z-plus',
      'motion-data-platform',
    ].includes(slug);
    product.titleKey = `${base}.introduction.title`;
    product.related = definitions
      .filter((d) => d[2] === family && d[0] !== slug)
      .map((d) => d[0])
      .slice(0, 3);
    if (product.related.length === 0)
      product.related = ['f2-pro-plus', 'h2-pro-plus', 'openarm-z'].filter(
        (s) => s !== slug,
      );
    return product;
  },
);
const partnerPage = content.pages.find((p) => p.id === 'partners');
const partnerSource = source.pages.find((p) => p.id === 'partners');
const partners = partnerPage.blocks
  .flatMap((b) => b.children)
  .find((b) => b.type === 'cards' && b.kind === 'partners')
  .items.map((item) => ({
    nameKey: item.titleKey,
    src: partnerSource.images[item.images[0].index].src,
    altKey: item.images[0].altKey,
  }));
for (const product of products) {
  for (const key of product.introduction) {
    if (!key.split('.').reduce((v, k) => v?.[k], locale))
      throw new Error(`Missing source copy: ${key}`);
  }
}
const captureProducts = products.filter((p) =>
  ['body', 'hands'].includes(p.family),
);
const systemProducts = products.filter(
  (p) => !['body', 'hands'].includes(p.family),
);
const outputs = [
  ['productCatalogData.json', { products: systemProducts, partners }],
  ['productCaptureData.json', { products: captureProducts }],
];
for (const [filename, data] of outputs) {
  const output = new URL('../src/content/' + filename, import.meta.url);
  if (process.argv.includes('--check')) {
    if (!isDeepStrictEqual(JSON.parse(fs.readFileSync(output, 'utf8')), data))
      throw new Error('Product catalog is stale. Run pnpm catalog:generate.');
  } else {
    fs.writeFileSync(output, JSON.stringify(data, null, 2) + '\n');
  }
}
console.log(
  process.argv.includes('--check')
    ? 'Product catalog matches the source handbook metadata.'
    : `Generated ${products.length} products and ${partners.length} partners.`,
);
