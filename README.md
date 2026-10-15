# ZeroLab Website

The official website for ZeroLab Technologies. ZeroLab develops motion-capture hardware, embodied-AI teleoperation systems, and motion-data solutions for robotics, immersive production, sports, and rehabilitation.

This repository contains a bilingual React website with product pages, application scenarios, downloads, and contact information.

## Tech stack

- React 19 and TypeScript
- Vite 8
- React Router 7
- MUI 9 and Tailwind CSS 4
- Three.js, React Three Fiber, and GSAP
- i18next and react-i18next
- AMap JavaScript API

## Prerequisites

- Node.js 26
- pnpm
- Git LFS
- uv (only required for the optional internationalization tools)

## Getting started

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Vite will print the local development URL in the terminal.

## Available commands

| Command              | Description                                                                 |
| -------------------- | --------------------------------------------------------------------------- |
| `pnpm dev`           | Start the development server.                                               |
| `pnpm build`         | Type-check the project and create a production build.                       |
| `pnpm preview`       | Preview the production build locally.                                       |
| `pnpm pages:publish` | Merge the current branch into `publish` and push it to deploy GitHub Pages. |
| `pnpm format`        | Format the project with Prettier.                                           |
| `pnpm exec tsc -b`   | Check TypeScript for errors.                                                |

Before committing, run:

```bash
pnpm format
pnpm exec tsc -b
```

This project does not use ESLint.

## Publishing to GitHub Pages

Configure the repository's Pages source to **GitHub Actions** once in **Settings → Pages**. Commit your changes, make sure the working tree is clean, then run:

```bash
pnpm pages:publish
```

The command merges the current branch into `publish` in a temporary Git worktree and pushes that branch to `origin`. A push to `publish` runs `.github/workflows/deploy-pages.yml`, which builds `dist/` and deploys it to GitHub Pages. Set `PUBLISH_REMOTE` to use a configured remote other than `origin`.

The build uses the repository-name URL prefix required by GitHub Pages project sites. Files in `public/` are tracked with Git LFS, and the deployment workflow downloads those objects during checkout.

## Continuous integration and deployment layout

The GitHub Actions workflow in `.github/workflows/ci.yml` installs dependencies, checks formatting, checks TypeScript, builds the site, and uploads `dist/` as the deployment artifact. Both workflows check out Git LFS objects before building.

Keep the `public/` directory alongside the root `index.html` when running or building locally:

```text
.
├── index.html
├── public/
└── src/
```

Vite serves `public/` from the site root and copies its contents into `dist/` during a production build. The final artifact therefore has `index.html` and the copied asset directories at the same level; it must not contain a nested `dist/public/` directory. Deploy `dist/` as the web root.

## Application motion viewer

The application page loads `public/models/motion-performance.glb`, imported from the supplied `10.glb`. This model is tracked with Git LFS. The retired `run.glb` and `hit.glb` files are no longer needed.

The viewer starts in **In place** mode, cancelling the Armature root's horizontal translation while retaining vertical movement and joint animation. **Root motion** preserves the authored trajectory. Camera framing uses sampled animated geometry for each mode and adapts to the viewport. Mode changes blend root displacement, camera position, and camera target over 1.2 seconds without restarting playback.

Drag to orbit and use the playback button to pause or resume. Reduced-motion preferences pause autoplay and disable camera transitions, while leaving manual playback available.

## Internationalization

The site supports Simplified Chinese and English. Translation resources are stored in:

- `src/locales/zh.json`
- `src/locales/en.json`

The application detects the user's language from local storage and the browser, and falls back to English. To maintain the translation files, install the optional CLI dependencies and use the Make targets:

```bash
make i18n-setup
make i18n-check
make i18n-sort
make i18n-stats
make i18n-diff
make i18n-fix
```

The internationalization tools live in `scripts/i18n_tools/` and use `uv` to manage their Python environment.

## Site routes

| Path           | Page                                 |
| -------------- | ------------------------------------ |
| `/`            | Home                                 |
| `/about`       | About ZeroLab                        |
| `/product`     | Product handbook                     |
| `/application` | Applications                         |
| `/downloads`   | Software and developer resources     |
| `/contact`     | Contact and headquarters information |

The legacy `/solution` route redirects to `/product`, and `/teleop` redirects to the OpenArm-Z section on that page.

## Static assets

Static runtime assets are stored in `public/` and tracked with Git LFS:

- `public/images/` — logos, product images, banners, and other visual assets
- `public/document/` — brochures and downloadable documents
- `public/fonts/` — local fonts
- `public/models/` — 3D models
- `public/product-brochure/` — source and web assets for the product-handbook recreation; page data is tracked in `src/content/productBrochureData.json`

Run `git lfs install` before adding or pushing changes to `public/`.

Run the media scanner to find files that no longer have literal references in application source:

```bash
pnpm assets:scan
node scripts/scan-public-assets.mjs --check
node scripts/scan-public-assets.mjs --delete
```

The default scan is read-only. `--delete` removes only unreferenced image and video files. Fonts, models, documents, and other file types are left untouched.

## Project structure

```text
src/
├── components/   Reusable UI components
├── pages/        Route-level page components
├── locales/      Chinese and English translation resources
├── App.tsx       Application routes
├── i18n.ts       Internationalization setup
└── theme.ts      MUI theme configuration
scripts/
└── i18n_tools/   Translation maintenance CLI
```
