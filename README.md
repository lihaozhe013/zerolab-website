# ZeroLab Website

The official website for ZeroLab Technologies. ZeroLab develops motion-capture hardware, embodied-AI teleoperation systems, and motion-data solutions for robotics, immersive production, sports, and rehabilitation.

This repository contains a bilingual React website with product pages, application scenarios, teleoperation demos, downloads, and contact information.

## Tech stack

- React 19 and TypeScript
- Vite 8
- React Router 7
- MUI 9 and Tailwind CSS 4
- Three.js, React Three Fiber, and GSAP
- i18next and react-i18next
- AMap JavaScript API

## Prerequisites

- Node.js
- pnpm
- uv (only required for the optional internationalization tools)

## Getting started

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Vite will print the local development URL in the terminal.

## Available commands

| Command            | Description                                           |
| ------------------ | ----------------------------------------------------- |
| `pnpm dev`         | Start the development server.                         |
| `pnpm build`       | Type-check the project and create a production build. |
| `pnpm preview`     | Preview the production build locally.                 |
| `pnpm format`      | Format the project with Prettier.                     |
| `pnpm exec tsc -b` | Check TypeScript for errors.                          |

Before committing, run:

```bash
pnpm format
pnpm exec tsc -b
```

This project does not use ESLint.

## Continuous integration and deployment layout

The GitHub Actions workflow in `.github/workflows/ci.yml` installs dependencies, checks formatting, checks TypeScript, builds the site, and uploads `dist/` as the deployment artifact.

Keep the externally managed `public/` directory alongside the root `index.html` when running or building locally:

```text
.
├── index.html
├── public/
└── src/
```

Vite serves `public/` from the site root and copies its contents into `dist/` during a production build. The final artifact therefore has `index.html` and the copied asset directories at the same level; it must not contain a nested `dist/public/` directory. Deploy `dist/` as the web root. Because `public/` is excluded from Git, any assets unavailable to CI must be provided separately at that same web root.

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
| `/product`     | Products                             |
| `/solution`    | Solutions and case studies           |
| `/application` | Applications                         |
| `/teleop`      | Robot teleoperation                  |
| `/downloads`   | Software and developer resources     |
| `/contact`     | Contact and headquarters information |

## Static assets

Large binary assets are intentionally excluded from Git. Populate `public/` with the externally managed assets before running or deploying the site:

- `public/images/` — logos, product images, banners, and other visual assets
- `public/videos/` — product and teleoperation videos
- `public/document/` — brochures and downloadable documents

Without these files, referenced images, videos, and documents will not load correctly.

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
