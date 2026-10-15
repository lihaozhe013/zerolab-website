# Project Agent Instructions

## Formatting

- This project uses Prettier. Before committing, run `pnpm format` by default.
- This project does not use ESLint. Before committing, run `tsc` to check for TypeScript errors.

## Language

- Write all new documentation, comments, and logs in English.
- Existing Chinese documentation, comments, and logs do not need to be changed.

## Code Organization

- Keep the project as decoupled and modular as reasonably possible.
- Split large programs and modules when appropriate, and avoid files exceeding 1,000 lines or, especially, 2,000 lines.

## Git Tracking

- Track all files in `public/` with Git LFS using the rule in `.gitattributes`; do not store these files as regular Git blobs.
- Install Git LFS and run `git lfs install` before adding or pushing `public/` files.
- Keep `public/` next to the root `index.html` when running or building the site locally. Vite serves files from `public/` at the site root.
- The CI deployment artifact is `dist/`. It must contain `index.html` and the compiled assets at the same site root, and must not contain a nested `dist/public/` directory. Vite copies the contents of `public/` into `dist/`; it does not copy the `public/` directory itself.
- All CI and deployment builds must use the reusable CI workflow, which checks out Git LFS objects so artifacts contain the real `public/` assets.
- When deploying the CI artifact, serve `dist/` as the web root.

## Development Tools and Shell

- On this machine, use `rg` instead of `grep`, `fd` instead of `find`, and `uv` instead of `python`.
- On Windows, assume Git Bash is the default user shell.
- Do not add PowerShell scripts or PowerShell-specific commands to the project, including in Makefiles.
- Use Bash as the sole standard shell for project scripts and automation.
