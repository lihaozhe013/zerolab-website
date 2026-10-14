# Product Handbook Recreation Reference

## Source and page range

- Source SHA-256: `9e78622d888a17af4620d6f2bb84f62c0f1426d75eaf9e8d3fddc822aee088d4`
- Source page count: 31
- Source page size: 612.283 × 858.898 pt
- Recreated source pages: 2–27, in their original order
- Source pages 1 and 28–31 are intentionally omitted because they contain no product-page content.

The source document is used only to generate the web content and local assets. The build removes the source PDF from `dist/` by checking its SHA-256 fingerprint.

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

`src/content/productBrochureData.json` stores selectable text lines, source coordinates, page dimensions, image placements, and monochrome vector decorations. CJK compatibility radicals emitted by the PDF text extractor are normalized to their displayed ideographs. No page is rendered as a screenshot, and the web page does not load a PDF viewer.

`src/components/ProductBrochure.tsx` renders text as HTML, rules and table shapes as SVG, and product and scenario photography as image elements. Repeating running headers, footer rules, and printed page numbers are omitted; the central page content keeps its source coordinates and layout. Desktop pages retain the source page ratio. Under 768 px, the same content reflows in source-page and top-to-bottom reading order with 16 px minimum text.

The recreation uses the website's active theme background continuously, without individual sheet backgrounds or gaps. In dark mode it follows `#07090c` with light text; in light mode it follows `#f3f7f8` with dark text. Rules, table surfaces, and text use the active theme's matching colors. Product photography and brand marks retain their original colors. Black and dark partner/platform marks keep a light backing area so their source artwork remains legible in both themes.

## Asset provenance

`public/product-brochure/` is organized into:

- `originals/`: PDF-embedded source images and the two verified matching higher-resolution glove images. Filenames contain a SHA-256 prefix or descriptive English name.
- `products/`: page-matched product cutouts and product photography.
- `scenarios/`: page-matched application and robot-scene images.
- `logos/`: the handbook's brand, platform, and partner marks.
- `fonts/`: the PDF's embedded Arial regular and Arial Narrow bold subsets.

Every displayed page image in the generated data records its source PDF image path. The `source-<hash>` filename contains the first 16 hexadecimal characters of the embedded image's SHA-256 fingerprint. The derived image filename and PDF page position identify the corresponding web asset. Standalone product photos with a white perimeter use a feathered exterior-only alpha mask; the unmodified source remains in `originals/`. A narrow off-page image fragment on source page 27 is excluded because it is not visible in the rendered handbook page.

Two source-folder images were verified as higher-resolution instances of the exact H2 glove photography embedded in the handbook. The H2 and H2 Pro pages reuse the same embedded image; H2 Pro+ has a separate matching image.

| Handbook page | Web asset                               | Selected source asset                 | SHA-256                                                            |
| ------------- | --------------------------------------- | ------------------------------------- | ------------------------------------------------------------------ |
| 14 and 16     | `products/h2-dexterous-data-gloves.png` | `source-h2-dexterous-data-gloves.png` | `13679985ffb52ac09dd3f91d620eb79dbf62cee51f2caae345681f3276ac47f1` |
| 18            | `products/h2-pro-plus-data-gloves.png`  | `source-h2-pro-plus-data-gloves.png`  | `a92eae78a8cc5a58dfb336d8f42e29b8d707602c980732496e38e085f0af2c01` |

The source images and derived web assets are kept outside Git because the repository ignores `public/`. Provision `public/product-brochure/` at the deployed site root alongside `index.html` and the compiled assets.

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
