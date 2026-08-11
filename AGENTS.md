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

- The `public/` directory is too large and must not be included in Git.

## Development Tools and Shell

- On this machine, use `rg` instead of `grep`, `fd` instead of `find`, and `uv` instead of `python`.
- On Windows, assume Git Bash is the default user shell.
- Do not add PowerShell scripts or PowerShell-specific commands to the project, including in Makefiles.
- Use Bash as the sole standard shell for project scripts and automation.
