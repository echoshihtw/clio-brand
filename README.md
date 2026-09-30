# clio-brand

Clio's brand colours, logo and app icons, shared by the landing page
([clio-web](https://github.com/echoshihtw/clio-web)) and the app
([clio-app](https://github.com/echoshihtw/clio-app)).

## The colours

| Name  | Value     | Role                                              |
| ----- | --------- | ------------------------------------------------- |
| paper | `#fffaf3` | Backgrounds and light text                        |
| pink  | `#efa5b5` | Brand moments and memory signals — used sparingly |
| ink   | `#211a1c` | Text, outlines, dark sections and buttons         |

Muted text, borders, shadows and soft fills are blends of these three, never
new colours. Values live only in [`tokens.js`](tokens.js); this table explains
them and is not a second copy to edit.

## The logo

[`logo/clio-single-ink-master.svg`](logo/clio-single-ink-master.svg) is the
approved upright master mark: a handmade monoline portrait with a connected
soft fringe and a separate smile.

- One ink, `ink` above, on a transparent background.
- A uniform 8-unit stroke with rounded caps and joins.
- The head and fringe meet at exact shared points; the smile is the only
  separate stroke.
- Never rotate, stretch or change individual stroke weights. Colour, texture
  and animation treatments are derived from this file without changing its
  geometry.

## App icons

`icons/` holds the icons apps install with, paper on ink, rendered from the
master logo and `tokens.js` by `npm run icons`:

| File | Size | Used for |
| --- | --- | --- |
| `favicon.ico` | 16, 32, 48 | Browser tabs |
| `apple-touch-icon.png` | 180 | iPhone and iPad home screen |
| `icon-192.png`, `icon-512.png` | 192, 512 | Android and desktop install |
| `icon-maskable-512.png` | 512 | Android's circle and squircle shapes |

The favicon is the one place the logo's stroke changes: it is drawn at 18
instead of 8, because the master line disappears at tab size. Everything else
keeps the master stroke. Never edit the PNGs by hand; change the logo or a
colour, then run `npm run icons`.

## Use

```bash
npm install @echoshihtw/clio-brand
```

**CSS variables.** Add the preset to `tailwind.config.js` to get
`--clio-paper`, `--clio-pink` and `--clio-ink` on `:root`:

```js
presets: [require("@echoshihtw/clio-brand/preset")],
```

Name your own roles on top of them, such as
`--color-text: var(--clio-ink)`. The preset adds no Tailwind colour names, so
it cannot clash with DaisyUI's.

**Literal values.** Where a tool needs the hex itself, such as a DaisyUI
theme, read it from the tokens:

```js
const brand = require("@echoshihtw/clio-brand")
brand.pink // "#efa5b5"
```

## Changing a colour

The same flow as the apps. Edit `tokens.js` on a branch and open a pull
request into `staging`. Squash it: the title becomes the commit that
[semantic-release](https://semantic-release.gitbook.io) reads, so it decides
the release:

| PR title                             | Release                           |
| ------------------------------------ | --------------------------------- |
| `feat: …`                            | minor, `v1.0.0` → `v1.1.0`        |
| `fix: …` or `perf: …`                | patch, `v1.0.0` → `v1.0.1`        |
| `BREAKING CHANGE:` in the body       | major, `v1.0.0` → `v2.0.0`        |
| `docs:`, `chore:`, `test:`, …        | none                              |

Each push to `staging` opens or updates one pull request from `staging` into
`main`, titled with the version it will release. To try the change first,
point an app at `github:echoshihtw/clio-brand#staging`. Then merge that pull
request with a **merge commit**, never a squash: that tags the version and
publishes a GitHub Release with the notes.

The `version` in `package.json` is a placeholder
(`0.0.0-semantically-released`). The real version is the latest git tag;
semantic-release commits nothing back.

### Publishing to npm, by hand for now

npm's registry rejects the identity GitHub Actions now presents for this
account ([npm/cli#9969](https://github.com/npm/cli/issues/9969)), so the release
job does not publish to npm. After a release PR is merged, publish its tag
yourself, with 2FA:

```bash
scripts/publish.sh vX.Y.Z
```

It builds from a fresh copy of exactly that tag, never from your checkout, and
stops if the tag does not exist yet, if the version is already on npm, or if a
path in `package.json`'s `files` is missing from the package. It lists what it
will publish and asks before publishing. `1.3.0` went out without its icons
because it was published before its tag existed, from an out-of-date checkout.

Every tag should have the same version on npm; check with
`npm view @echoshihtw/clio-brand versions`. Once npm fixes the bug, set
`"npmPublish"` back to `true` in `.releaserc.json`: trusted publishing is
already configured on npmjs.com.

Each app picks up the change when it upgrades, not before: a fix (`1.1.x`)
arrives on its next `npm install`, a new feature (`1.x.0`) on
`npm install @echoshihtw/clio-brand@latest`.
