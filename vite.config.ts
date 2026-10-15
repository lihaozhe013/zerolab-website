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
  plugins: [publicAssetBasePlugin, react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 2000,
  },
});
