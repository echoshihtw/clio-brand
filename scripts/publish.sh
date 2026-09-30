#!/usr/bin/env bash
#
# Publishes a released tag to npm, by hand, while the release job cannot
# (npm/cli#9969). Usage, from anywhere in this repo:
#
#   scripts/publish.sh v1.3.1
#
# It never publishes your checkout. It builds from a fresh copy of exactly the
# tag, and stops before publishing when:
#   - the tag does not exist yet (the release job has not finished),
#   - that version is already on npm,
#   - a path package.json promises in "files" is missing from the package.
# 1.3.0 went out without its icons because the tag did not exist yet and the
# old steps carried on from an out-of-date checkout.

set -euo pipefail

TAG="${1:-}"
if [[ ! "$TAG" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "usage: $0 vX.Y.Z" >&2
  exit 64
fi
VERSION="${TAG#v}"
NAME="@echoshihtw/clio-brand"
REPO="$(git rev-parse --show-toplevel)"

git -C "$REPO" fetch --quiet --tags origin
if ! git -C "$REPO" rev-parse --quiet --verify "refs/tags/$TAG^{commit}" >/dev/null; then
  echo "error: tag $TAG does not exist yet. Wait for the release job to finish, then run this again." >&2
  exit 65
fi
if npm view "$NAME@$VERSION" version >/dev/null 2>&1; then
  echo "error: $NAME@$VERSION is already on npm. A version number can never be published twice." >&2
  exit 65
fi

WORK="$(mktemp -d)"
cleanup() { git -C "$REPO" worktree remove --force "$WORK" >/dev/null 2>&1 || rm -rf "$WORK"; }
trap cleanup EXIT
git -C "$REPO" worktree add --quiet --detach "$WORK" "$TAG"
cd "$WORK"
npm pkg set version="$VERSION"

PACKED="$(npm pack --dry-run --json 2>/dev/null |
  node -e 'let s = ""; process.stdin.on("data", (d) => (s += d)).on("end", () => console.log(JSON.parse(s)[0].files.map((f) => f.path).sort().join("\n")))')"
for entry in $(node -p 'require("./package.json").files.join(" ")'); do
  if ! grep -q "^$entry\(/\|$\)" <<<"$PACKED"; then
    echo "error: \"$entry\" is listed in package.json but missing from the package." >&2
    exit 65
  fi
done

echo "$NAME@$VERSION from $TAG ($(git rev-parse --short HEAD)) will contain:"
sed 's/^/  /' <<<"$PACKED"
read -r -p "Publish it? [y/N] " answer
if [ "$answer" != "y" ]; then
  echo "Not published."
  exit 1
fi
npm publish
echo "Published. npm may take a minute to list it: npm view $NAME versions"
