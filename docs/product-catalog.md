# Product Catalog

The product area uses a semantic catalog and independent detail routes. Its content and verified specifications come from the existing product handbook; the coordinate-based brochure renderer is retained as a historical reference and is not imported by the active product pages.

## Routes and navigation

The catalog is `/product`. Product routes use `/product/:slug` within the existing HashRouter, so a direct URL is `/#/product/f2-pro-plus`. The catalog contains four family exhibits, a motion-data platform section, and a partner ecosystem. The platform has its own detail route; partners do not have product pages.

| Family                 | Slugs                                       |
| ---------------------- | ------------------------------------------- |
| Robot teleoperation    | `openarm-z`, `openarm-zm`, `openarm-z-plus` |
| Full-body capture      | `f1`, `f2`, `f2-pro-plus`                   |
| Data gloves            | `h1`, `h2`, `h2-pro`, `h2-pro-plus`         |
| Motion-sensing silicon | `zl9nsq`                                    |
| Motion-data platform   | `motion-data-platform`                      |

Old handbook chapter anchors resolve to their corresponding product routes. The former partner anchor resolves to the catalog ecosystem section. `/teleop` resolves to OpenArm-Z, and `/solution` resolves to the catalog. Unknown product slugs show a recovery link. Navigation into a product records the catalog position, and the return link restores it. Browser history also keeps scroll positions during the session.

## Content and assets

`src/content/productCatalogData.json` and `src/content/productCaptureData.json` are generated from the handbook's semantic content blocks and source image references. Together they contain route identity, family, localized content keys, media, tables, related products, and verified brochure links. Both the catalog and detail pages use the typed registry in `src/content/productCatalog.ts`. Detail pages load through a lazy route.

The generator preserves full source table rows, descriptions, advantages, scenarios, and conditions. New editorial text uses the `product_catalog` and `product_detail` locale namespaces, while existing facts continue to reference `product_brochure`. Chinese UI translations are confined to `src/locales/zh.json`; new code, comments, and documentation use English.

Public images and PDFs retain their existing Git LFS paths. OpenArm-Z+ uses a labeled application image because there is no standalone product photo in the source. H2 and H2 Pro share the source-confirmed glove photo. Three F2 Pro+ asset filenames describe the wrong subject; the new catalog maps their accessible descriptions to the inspected photo contents without modifying the historical source data. Product PDFs are linked only to the matching inspected model and labeled as English brochures.

## Regeneration and checks

```bash
pnpm catalog:generate
pnpm catalog:check
pnpm brochure:check
pnpm exec tsc -b
pnpm build
```

After changing source metadata, regenerate the catalog. The check rejects stale output, missing or unresolved LFS media, invalid related links, incomplete legacy mappings, changed source tables, missing downloads, and mismatched locale keys. It also runs in the reusable CI workflow. Formatting follows `pnpm format`.

## Visual and interaction verification

Review the catalog and every detail route at 360, 390, 768, 1280, and 1440 px with both languages and themes. Confirm no page-level horizontal overflow, complete images, readable tables, visible keyboard focus, reduced-motion support, and correct sticky navigation clearance. Check category anchors, direct detail URLs and refresh, unknown products, legacy URLs, return links, browser history, and brochure links. Three-column comparison tables intentionally scroll within their own labeled region on narrow screens.
