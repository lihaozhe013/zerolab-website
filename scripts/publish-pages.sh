#!/usr/bin/env bash

set -euo pipefail

publish_branch="publish"
remote="${PUBLISH_REMOTE:-origin}"

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  printf 'Usage: pnpm pages:publish\n\n'
  printf 'Merge the current committed branch into %s and push it to %s.\n' "$publish_branch" "$remote"
  exit 0
fi

if [[ $# -gt 0 ]]; then
  printf 'This command does not accept arguments. Run it without arguments or use --help.\n' >&2
  exit 2
fi

repo_root="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  printf 'Run this command from inside the Git repository.\n' >&2
  exit 1
}
cd "$repo_root"

source_branch="$(git symbolic-ref --quiet --short HEAD)" || {
  printf 'Cannot publish from a detached HEAD. Check out a source branch first.\n' >&2
  exit 1
}

if [[ "$source_branch" == "$publish_branch" ]]; then
  printf 'Check out a source branch before publishing; the current branch is already %s.\n' "$publish_branch" >&2
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  printf 'Commit or stash all changes before publishing.\n' >&2
  exit 1
fi

if ! git lfs version >/dev/null 2>&1; then
  printf 'Git LFS is required. Install it before publishing.\n' >&2
  exit 1
fi

git lfs install --local >/dev/null

if ! git remote get-url "$remote" >/dev/null 2>&1; then
  printf 'Git remote "%s" does not exist. Set PUBLISH_REMOTE to a configured remote.\n' "$remote" >&2
  exit 1
fi

source_commit="$(git rev-parse HEAD)"
remote_publish_ref="$(git ls-remote --heads "$remote" "refs/heads/$publish_branch")" || {
  printf 'Could not read branch %s from remote %s. Check your network and Git credentials.\n' "$publish_branch" "$remote" >&2
  exit 1
}

if [[ -n "$remote_publish_ref" ]]; then
  git fetch --no-tags "$remote" "+refs/heads/$publish_branch:refs/remotes/$remote/$publish_branch"
  base_ref="refs/remotes/$remote/$publish_branch"
else
  base_ref="$source_commit"
fi

worktree_dir="$(mktemp -d "${TMPDIR:-/tmp}/zerolab-pages.XXXXXX")"

cleanup() {
  if [[ -n "${worktree_dir:-}" && -d "$worktree_dir" ]]; then
    git worktree remove --force "$worktree_dir" >/dev/null 2>&1 || rm -rf "$worktree_dir"
  fi
}
trap cleanup EXIT

git worktree add --detach "$worktree_dir" "$base_ref"

if [[ -n "$remote_publish_ref" ]]; then
  git -C "$worktree_dir" merge --no-ff \
    -m "chore(deploy): merge $source_branch into $publish_branch" \
    "$source_commit"
fi

printf 'Pushing %s into %s/%s...\n' "$source_branch" "$remote" "$publish_branch"
git -C "$worktree_dir" push "$remote" "HEAD:refs/heads/$publish_branch"
printf 'GitHub Actions will build and deploy the %s branch.\n' "$publish_branch"
