# Product Handbook Recreation Reference

## Source and page range

- Source SHA-256: `9e78622d888a17af4620d6f2bb84f62c0f1426d75eaf9e8d3fddc822aee088d4`
- Source page count: 31
- Source page size: 612.283 × 858.898 pt
- Recreated source pages: 2–27, in their original order
- Source pages 1 and 28–31 are intentionally omitted because they contain no product-page content.

The source document is used only to generate the web content and local assets. The build removes the source PDF from `dist/` by checking its SHA-256 fingerprint.

`renders/` contains rasterized source pages and comparison sheets used for visual quality checks. They are reference artifacts only and are not loaded by the website.

## Page map

| Source pages | Content                                     |
| ------------ | ------------------------------------------- |
| 2–5          | ZL9NSQ                                      |
| 6–7          | F1                                          |
| 8–9          | H1                                          |
| 10–11        | F2                                          |
| 12–13        | F2 Pro+                                     |
| 14–15        | H2                                          |
| 16–17        | H2 Pro                                      |
| 18–19        | H2 Pro+                                     |
| 20–21        | OpenArm-Z                                   |
| 22–23        | OpenArm-Zm                                  |
| 24–25        | OpenArm-Z+                                  |
| 26           | F2 Pro+ humanoid-robot motion-data platform |
| 27           | Partners                                    |

## Rendering and content

Both languages use the `product_brochure` keys in the global `src/locales/zh.json` and `src/locales/en.json` i18next resources. `productBrochureContent.json` records explicit semantic blocks, image references, and source-text ranges. Chinese rendering slices the global copy back into the exact original lines and font runs; English rendering uses complete paragraphs, explicit card grids, and semantic tables. The source extraction remains a reference rather than a separate translation dictionary.

English content uses a 960 px maximum width and the site's Inter font. Original column counts are retained from 1024 px, capped at two columns from 769–1023 px, and collapsed to one column below that range. Image compositions retain their source geometry independently of text wrapping. The intentional empty region before the OpenArm-Z+ scenarios remains on desktop. Theme colors and chapter IDs are shared between languages.

`src/content/productBrochureData.json` stores selectable text lines, source coordinates, page dimensions, image placements, and monochrome vector decorations. CJK compatibility radicals emitted by the PDF text extractor are normalized to their displayed ideographs. No page is rendered as a screenshot, and the web page does not load a PDF viewer.

`src/components/ProductBrochure.tsx` renders text as HTML, rules and table shapes as SVG, and product and scenario photography as image elements. Repeating running headers, footer rules, and printed page numbers are omitted; the central page content keeps its source coordinates and layout. Header artwork is excluded by its asset identity, so product images near the top edge remain visible. Desktop pages retain the source page ratio.

The extracted `baseline` comes from each text matrix, rather than the PDF font bounding box. Mixed-font lines also record separate runs, preserving each run's original size, weight, width, and baseline. `useBrochureTextMetrics.ts` aligns HTML baseline probes to those coordinates and fits each line or run to its recorded width after fonts load and when the viewport changes. This preserves table centers, column edges, and bilingual heading alignment despite differences between PDF and browser font metrics. Source dash patterns remain dotted, rectangle fills render behind rules, and table headers share the same row and column geometry as their borders.

At 768 px and below, `MobileBrochurePage.tsx` groups headings, descriptions, and images into complete content blocks in source reading order, with 16 px minimum text. Two-column parameter tables wrap within the viewport; the three-column comparison table scrolls locally. Image dimensions reserve layout space, and captions stay with their source images. The empty white image-edge fragment on source page 22 is omitted from both desktop and mobile layouts. Chapter navigation waits for fonts to settle before positioning its target.

The recreation uses the website's active theme background continuously, without individual sheet backgrounds or gaps. In dark mode it follows `#07090c` with light text; in light mode it follows `#f3f7f8` with dark text. Rules, table surfaces, and text use the active theme's matching colors. Product photography and brand marks retain their original colors. Black and dark partner/platform marks keep a light backing area so their source artwork remains legible in both themes.

## Asset provenance

`public/product-brochure/` is organized into:

- `originals/`: PDF-embedded source images and the two verified matching higher-resolution glove images. Filenames contain a SHA-256 prefix or descriptive English name.
- `products/`: page-matched product cutouts and product photography.
- `scenarios/`: page-matched application and robot-scene images.
- `logos/`: the handbook's brand, platform, and partner marks.
- `fonts/`: the PDF's embedded Arial regular and Arial Narrow bold subsets.

Every displayed page image in the generated data records its source PDF image path. The `source-<hash>` filename contains the first 16 hexadecimal characters of the embedded image's SHA-256 fingerprint. The derived image filename and PDF page position identify the corresponding web asset. Standalone product photos with a white perimeter use a feathered exterior-only alpha mask; the unmodified source remains in `originals/`. Narrow off-page image fragments on source pages 22 and 27 are excluded because they are not visible in the rendered handbook content.

Two source-folder images were verified as higher-resolution instances of the exact H2 glove photography embedded in the handbook. The H2 and H2 Pro pages reuse the same embedded image; H2 Pro+ has a separate matching image.

| Handbook page | Web asset                               | Selected source asset                 | SHA-256                                                            |
| ------------- | --------------------------------------- | ------------------------------------- | ------------------------------------------------------------------ |
| 14 and 16     | `products/h2-dexterous-data-gloves.png` | `source-h2-dexterous-data-gloves.png` | `13679985ffb52ac09dd3f91d620eb79dbf62cee51f2caae345681f3276ac47f1` |
| 18            | `products/h2-pro-plus-data-gloves.png`  | `source-h2-pro-plus-data-gloves.png`  | `a92eae78a8cc5a58dfb336d8f42e29b8d707602c980732496e38e085f0af2c01` |

The source images and derived web assets are tracked in `public/product-brochure/` alongside the site source. Vite copies them into the deployment artifact with the rest of `public/`.

## Regenerating the data

The extractor requires `pypdf`, `pdfplumber`, and Pillow in the selected Python environment. Pass the local source document as its first argument and the matching source-assets folder if available:

```bash
uv run --no-project --python "$PYTHON" python scripts/extract_product_brochure.py \
  "$HANDBOOK_PDF" \
  public/product-brochure \
  src/content/productBrochureData.json \
  --source-assets-dir "$SOURCE_ASSETS"
```

Keep `public/` beside `index.html` when running or building locally. `pnpm build` removes the source PDF from the deployment artifact while retaining the generated `product-brochure/` web assets.

Refresh baseline and dash metadata without rewriting approved copy or assets:

```bash
uv run --no-project --with pdfplumber --with pypdf --with pillow \
  python scripts/extract_product_brochure.py "$HANDBOOK_PDF" \
  public/product-brochure src/content/productBrochureData.json --refresh-layout
```

The refresh verifies the reference fingerprint and every extracted text line before writing metadata.

## Alignment checks

Run `pnpm brochure:check` to verify all 26 sections, matching locale keys, exact Chinese source lines and mixed-font runs, translation references, and image coverage. The browser audit selects its checks by the active renderer. English checks include copy coverage, untranslated content, image loading, grid alignment, table rows, and overflow; they run independently of Chinese font calibration.

In the local Vite browser's developer console, run:

```javascript
const { auditProductBrochure } =
  await import('/src/components/productBrochureAudit.ts');
auditProductBrochure();
```

This development-only module checks every desktop text baseline, line width, and left edge with a 0.5 px tolerance; mobile block overlap, minimum text size, shared table row edges, and two-column table overflow; image loading; desktop/mobile copy and image coverage; and whole-page horizontal overflow. The local development page also runs it after layout calibration and stores the current report in the product root's `data-alignment-audit` attribute. The development import is removed from the production build.

Run the check at 360, 390, 768, 1280, and 1440 px in both themes after fonts and images finish loading. Review all 26 desktop sections alongside the reference and inspect mobile headings, tables, scenario captions, and partner groups. Geometry checks identify measurable drift; screenshots are still required to assess optical alignment and intentional source offsets. Use viewport screenshots for narrow-screen comparisons because full-page captures can temporarily change scrollbar width and text wrapping.
