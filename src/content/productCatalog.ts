import data from './productCatalogData.json';
import captureData from './productCaptureData.json';

export type ProductFamily =
  'robotics' | 'body' | 'hands' | 'silicon' | 'platform';
export type ProductMedia = {
  src: string;
  altKey: string;
  width: number;
  height: number;
};
export type ProductFeature = {
  titleKey: string;
  descriptionKeys: string[];
  media: ProductMedia[];
};
export type Product = {
  slug: string;
  key: string;
  family: ProductFamily;
  name: string;
  base: string;
  legacyIds: string[];
  introduction: string[];
  titleKey: string;
  hero: ProductMedia;
  sceneHero: boolean;
  media: ProductMedia[];
  advantages: ProductFeature[];
  scenarios: ProductFeature[];
  logos: ProductMedia[];
  tables: { titleKey: string; rows: (string | null)[][] }[];
  specificationKeys: string[];
  features: { titleKey: string; keys: string[] }[];
  related: string[];
  brochure?: { href: string; label: string };
};

const familyOrder: ProductFamily[] = [
  'robotics',
  'body',
  'hands',
  'silicon',
  'platform',
];
export const products = (
  [...data.products, ...captureData.products] as Product[]
).sort((a, b) => familyOrder.indexOf(a.family) - familyOrder.indexOf(b.family));
export const partners = data.partners;
export const productPath = (slug: string) => `/product/${slug}`;
export const findProduct = (slug: string) =>
  products.find((p) => p.slug === slug);
export const productFamilies = [
  { id: 'robotics', featured: 'openarm-z' },
  { id: 'body', featured: 'f2-pro-plus' },
  { id: 'hands', featured: 'h2-pro-plus' },
  { id: 'silicon', featured: 'zl9nsq' },
] as const;

export const legacyProductPath = (id: string) => {
  if (id === 'partners') return null;
  const product = products.find((p) => p.legacyIds.includes(id));
  return product ? productPath(product.slug) : null;
};
