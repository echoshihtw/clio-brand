# clio-brand

Clio's brand colours and logo, shared by the landing page
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
request with a **merge commit**, never a squash: that tags the version,
publishes it to npm as `@echoshihtw/clio-brand`, and publishes a GitHub Release
with the notes.

The `version` in `package.json` is a placeholder
(`0.0.0-semantically-released`). semantic-release writes the real one at publish
time and commits nothing back, so the version is the latest git tag, which is
always the same as npm's.

Each app picks up the change when it upgrades, not before: a fix (`1.1.x`)
arrives on its next `npm install`, a new feature (`1.x.0`) on
`npm install @echoshihtw/clio-brand@latest`.
