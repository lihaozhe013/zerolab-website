import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

const pagesBase = process.env.GITHUB_PAGES_BASE ?? '/';

if (!/^\/(?:[^/]+\/)*$/.test(pagesBase)) {
  throw new Error(
    'GITHUB_PAGES_BASE must be a path that starts and ends with /.',
  );
}

const siteUrl = process.env.SITE_URL;
let absoluteSiteUrl: URL | undefined;
if (siteUrl) {
  absoluteSiteUrl = new URL(siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`);
  if (!['http:', 'https:'].includes(absoluteSiteUrl.protocol)) {
    throw new Error('SITE_URL must be an absolute HTTP(S) URL.');
  }
}

const socialMetadataPlugin: Plugin = {
  name: 'social-metadata',
  transformIndexHtml() {
    const imageUrl = absoluteSiteUrl
      ? new URL('images/share-card.png', absoluteSiteUrl).href
      : `${pagesBase}images/share-card.png`;
    return [
      { tag: 'meta', attrs: { property: 'og:image', content: imageUrl } },
      ...(absoluteSiteUrl
        ? [
            {
              tag: 'meta',
              attrs: { property: 'og:url', content: absoluteSiteUrl.href },
            },
          ]
        : []),
    ];
  },
};

const publicAssetBasePlugin: Plugin = {
  name: 'github-pages-public-asset-base',
  enforce: 'pre',
  transform(code, id) {
    if (pagesBase === '/' || id.includes('/node_modules/')) {
      return null;
    }

    if (!/\.(?:[cm]?[jt]sx?|json)(?:\?.*)?$/.test(id)) {
      return null;
    }

    return code.replace(
      /(["'`(])\/(images|fonts|document|models|product-brochure)\//g,
      (_match, prefix: string, directory: string) =>
        `${prefix}${pagesBase}${directory}/`,
    );
  },
};

export default defineConfig({
  base: pagesBase,
  plugins: [
    socialMetadataPlugin,
    publicAssetBasePlugin,
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 2000,
  },
});
