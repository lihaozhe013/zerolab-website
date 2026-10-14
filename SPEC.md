# Project Specification

This document defines the accepted behavior and implementation requirements for
the ZeroLab website. It currently covers the Product page. Specifications for
other pages can be added as separate sections when their requirements are agreed.

Requirements describe the current accepted design. Historical handbook details
must not override later web-specific decisions recorded here. Repository workflow
instructions remain in `AGENTS.md`; extraction details and asset provenance remain
in [the handbook reference](docs/product-brochure-reference.md).

## Product Page

### Purpose and content baseline

The Product page presents ZeroLab products, their advantages and specifications,
application scenarios, the dedicated motion-data platform, and partners. It is a
native web page built with the existing React, TypeScript, CSS, and i18next stack.

- Use handbook source pages 2–27, in their original order, as the content baseline.
  These are 26 logical content sections, not 26 visible paper sheets.
- Omit source pages 1 and 28–31, which have no substantive Product page content.
- Preserve approved Chinese wording, model names, numbers, units, punctuation,
  parameter values, image identities, and content order. Layout work must not
  rewrite copy or add marketing claims.
- Translate every content item into English, preserving its meaning and technical
  details. For example, the OpenArm-Z+ description must retain the F2 Pro model,
  and the dedicated platform description must retain the source's 100% statement.
- Render text as selectable, searchable, copyable HTML. Render parameter data with
  semantic HTML tables. Use CSS or SVG for web-rendered rules and markers.
- Do not embed the handbook, load a PDF viewer, render entire source pages as
  screenshots, or introduce product videos or video-player dependencies.
- Do not restore the replaced Product title banner, old product listing, or
  handbook download button without a new requirement.

The reference handbook is identified by SHA-256:

```text
9e78622d888a17af4620d6f2bb84f62c0f1426d75eaf9e8d3fddc822aee088d4
```

Its original dimensions, 612.283 × 858.898 pt, are reference coordinates for
existing artwork and Chinese text alignment. They are not a web page-height
requirement.

### Routes and chapter identity

Use the existing `HashRouter` and shared site navigation and footer. The logical
route is `/product`, served at `/#/product`.

| Source pages | Content                        | Chapter ID                    |
| ------------ | ------------------------------ | ----------------------------- |
| 2–5          | ZL9NSQ                         | `zl9nsq-chip`                 |
| 6–7          | F1                             | `f1-full-body-suit`           |
| 8–9          | H1                             | `h1-data-gloves`              |
| 10–11        | F2                             | `f2-full-body-suit`           |
| 12–13        | F2 Pro+                        | `f2-pro-plus-full-body-suit`  |
| 14–15        | H2                             | `h2-dexterous-data-gloves`    |
| 16–17        | H2 Pro                         | `h2-pro-data-gloves`          |
| 18–19        | H2 Pro+                        | `h2-pro-plus-data-gloves`     |
| 20–21        | OpenArm-Z                      | `openarm-z`                   |
| 22–23        | OpenArm-Zm                     | `openarm-zm`                  |
| 24–25        | OpenArm-Z+                     | `openarm-z-plus`              |
| 26           | Dedicated motion-data platform | `custom-motion-data-platform` |
| 27           | Partners                       | `partners`                    |

- Preserve these IDs and existing intermediate `brochure-page-XX` IDs when
  adjusting layout. Footer product links must target their corresponding chapters.
- Redirect `/solution` to `/product` with history replacement.
- Redirect `/teleop` to `/product` with the `#openarm-z` chapter fragment and
  history replacement.
- Chapter navigation must position content below the fixed site navigation after
  fonts are ready. Deep links must work on direct entry and through footer links.
- Do not reintroduce Solution navigation or the retired teleoperation detail page.

### Layout, spacing, and theme

Preserve the handbook's central content structure: hierarchy, product image
compositions, advantage columns, parameter tables, scenario associations, and
partner groups. Adapt that structure to continuous website content.

**Content determines section height.** Do not reserve the source paper height,
empty page tails, or empty page heads. In particular, there must be no large blank
region after chip features, after chip specifications, or between the OpenArm-Z+
advantages and application scenarios. This requirement supersedes the earlier
decision to retain the handbook's intentional OpenArm-Z+ whitespace.

- Center desktop content with a maximum width of 960 px.
- Use the website's continuous theme background. Do not add individual sheet
  backgrounds, paper frames, running handbook headers, footer rules, or printed
  page numbers. Product chapter numbers remain part of the content hierarchy.
- For Chinese desktop rendering above 768 px, preserve the existing coordinate
  scale inside each content section. Derive the outer section height from visible
  text, font runs, images, and content decorations, with a 12 pt safety inset at
  each vertical edge. Remove empty leading and trailing reference regions without
  stretching or cropping the actual content.
- At 768 px and below, Chinese content uses normal document flow. Remove fixed
  section heights and source-positioned page whitespace.
- English uses normal text flow at every width. At 1024 px and above, preserve
  the original column counts. From 769–1023 px, use at most two columns; at 768 px
  and below, use one column.
- English paragraphs, table cells, and headings wrap naturally. Do not force
  Chinese source line breaks onto English or compress English text horizontally.
- Keep advantage cards aligned at the top of each row. Scenario titles, images,
  and descriptions must remain associated, with shared row alignment where they
  appear side by side.
- Preserve product image composition and source aspect ratios independently of
  text wrapping. Do not stack separately extracted image parts arbitrarily.
- Keep partner cards in three desktop columns, with the final partner centered.
  Adapt the grid to the English tablet and mobile column limits.
- Use subtle theme-aware rules with a short primary-color accent between product
  chapters and before the dedicated platform. Do not insert these separators
  between continuation sections of the same product. Current separator regions
  are 96 px on desktop and 56 px on mobile; they must not recreate paper-sized gaps.
- Keep the white edge fragment previously removed from the OpenArm-Zm section
  excluded. Do not reconstruct missing artwork or fill original image crops with
  unrelated material.
- Do not add scrolling animations or new calls to action as part of brochure
  rendering.

Use the shared light/dark theme tokens for backgrounds, text, rules, and table
surfaces. The current page backgrounds are `#07090c` in dark mode and `#f3f7f8` in
light mode. Product photography and brand marks retain their original colors;
dark marks may retain their light backing for legibility.

Chinese uses the existing Noto Sans SC and embedded brochure Arial font variants
where required by source alignment. English uses the site's Inter font with
appropriate fallbacks. English body text is at least 16 px with a 1.6 line height;
Chinese mobile body text is at least 16 px. Preserve clear title and heading levels.

Tables must retain every row and cell, aligned borders, consistent padding, and
theme-aware header and alternating-row surfaces. Two-column tables wrap within
their container. The three-column comparison table has a 640 px minimum width and
scrolls locally on narrow screens. The document itself must not overflow sideways.

### Localization and content model

All displayed brochure copy belongs to the existing global i18next resources:

- `src/locales/zh.json`
- `src/locales/en.json`

Use matching semantic keys under `product_brochure`, grouped by product and
content purpose. A representative key is
`product_brochure.products.f2.advantages.items.wearing.description`.

- Store complete paragraphs and complete table-cell values. Do not create a
  separate page-number/line-number English translation dictionary.
- Components resolve copy through `useTranslation()` and the existing i18next
  instance. Do not introduce an independent locale state or hardcoded language
  fallback strings in rendering code.
- Translate titles, descriptions, parameters, image alternatives, and section
  labels. The English content must not silently display Chinese fallback copy.
- Preserve source English companion labels in Chinese where they belong to the
  approved bilingual layout. Intentional empty English companion-label values
  suppress duplicate headings; do not use empty values to omit substantive copy.
- Mark the Product root with `lang="zh-CN"` or `lang="en"`. Navigation and footer
  continue to use the same global language selection.

Keep the following responsibilities separate:

| Layer                         | Responsibility                                                                                                                    |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `productBrochureData.json`    | Immutable extraction baseline: source identity, geometry, original lines and font runs, image placements, and vector decorations. |
| Global locale resources       | The runtime source of Chinese and English brochure copy and image alternatives.                                                   |
| `productBrochureContent.json` | Explicit content blocks, semantic copy keys, image references, reading order, column counts, and source bindings.                 |
| `productBrochureContent.ts`   | Content types and the adapter that reconstructs source-positioned Chinese text from global copy.                                  |
| Renderers and styles          | Language-appropriate presentation, responsive behavior, theme integration, and chapter spacing.                                   |

The content model supports text, card grids, tables, features, image compositions,
logo groups, and robot diagrams. Card grids distinguish advantages, scenarios, and
partners. Each source section retains its source page and stable chapter ID.

Chinese source bindings record a semantic translation key, source line index,
`start`/`end` offsets, and ranges for mixed-font runs. Offsets are JavaScript string
slice offsets (UTF-16 code units). Every displayed source line must be bound once,
and its localized slice and font-run slices must exactly match the extraction
baseline. These indices are traceability metadata, not English translation keys.

English rendering uses explicit blocks and complete localized strings rather than
guessing paragraph or image associations from PDF coordinates. Only image
compositions use source-relative positioning. Keep the existing Chinese desktop
and mobile presentation paths separate from the English responsive renderer.

### Assets and deployment

- Reuse the current assets under `public/product-brochure/`, organized as
  `originals/`, `products/`, `scenarios/`, `logos/`, and `fonts/`.
- Use English asset filenames and site-root URLs such as
  `/product-brochure/products/example.png`. The current product asset collection is
  tracked in Git.
- Prefer verified original material matching the source model, version, and pose.
  Record source fingerprints and derivation details in the handbook reference
  when replacing or adding assets.
- Preserve transparency, product details, white brand markings, and approved
  crops. Use localized alternatives that describe the actual image, even when
  legacy filenames are imperfect descriptions.
- Keep images dimensioned so their space can be reserved before loading. Brand
  artwork must remain legible in both themes.
- Use `pnpm assets:scan` to review unreferenced public media when assets change.
  Its default mode reports candidates; verify provenance and actual references
  before using its deletion mode.
- Vite copies the contents of `public/` into the root of `dist/`. Deploy `dist/` as
  the web root, with `product-brochure/` beside `index.html`, never under
  `dist/public/`.
- `pnpm build` excludes the reference handbook PDF from the deployment artifact
  by its fingerprint. Reference renders are maintenance artifacts and must not be
  loaded by the Product page.

### Validation and maintenance

Keep Chinese font calibration separate from browser audits. Calibration preserves
source baselines and widths; auditing must remain active for both rendering modes.
In development, audits rerun after language changes, theme changes, container
resizes, and font or image loading. The current report is available on the Product
root as `data-alignment-audit`.

Required checks for Product implementation changes:

```bash
pnpm format
pnpm exec tsc --noEmit -p tsconfig.app.json
pnpm brochure:check
pnpm build
pnpm exec prettier . --check
```

`pnpm brochure:check` must verify all 26 logical sections, stable IDs, matching
locale keys, exact Chinese lines and font runs, content-block coverage, translated
copy references, and image coverage. When updating source geometry or bindings,
update the related metadata together and rerun this check. Extraction procedures
are documented in the handbook reference.

For layout changes, inspect widths of 360, 390, 768, 769, 1023, 1280, and 1440 px
in both languages and both themes, after fonts and images settle. Acceptance
requires:

- Chinese desktop baseline, width, and left-edge errors no greater than 0.5 px.
- English grid and table alignment errors no greater than 1 px.
- No clipped content, overlapping blocks, missing images, or document-wide
  horizontal overflow; narrow comparison tables may scroll within their container.
- Complete English copy without duplicate fragments, untranslated text, or
  duplicate companion headings; Chinese copy remains exact.
- No large empty tails or heads after features, specifications, or OpenArm-Z+
  advantages. Product separators appear only at chapter boundaries.
- Working language/theme switches, footer chapter links, direct deep links, and
  both legacy redirects.
- No brochure video requests, PDF viewer, or full-page raster content.

Review screenshots in addition to audit results. Automated geometry checks do not
replace inspection of optical alignment, image composition, readable wrapping,
and transitions between products. Keep documentation, locale keys, content
bindings, and validation rules synchronized with accepted changes.
