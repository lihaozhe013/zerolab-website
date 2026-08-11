export const siteSections = [
  { key: 'product', path: '/product', id: 'product' },
  { key: 'application', path: '/application', id: 'application' },
  { key: 'solution', path: '/solution', id: 'solution' },
  { key: 'downloads', path: '/downloads', id: 'downloads' },
  { key: 'about', path: '/about', id: 'about' },
  { key: 'contact', path: '/contact', id: 'contact' },
] as const;

export const siteSectionPaths = new Set<string>(
  siteSections.map((section) => section.path),
);

export function getSiteSection(pathname: string) {
  return siteSections.find((section) => section.path === pathname);
}
