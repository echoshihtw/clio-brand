# clio-brand

Clio's brand colours, shared by the landing page
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

## Use

```bash
npm install github:echoshihtw/clio-brand#v1.0.0
```

**CSS variables.** Add the preset to `tailwind.config.js` to get
`--clio-paper`, `--clio-pink` and `--clio-ink` on `:root`:

```js
presets: [require("clio-brand/preset")],
```

Name your own roles on top of them, such as
`--color-text: var(--clio-ink)`. The preset adds no Tailwind colour names, so
it cannot clash with DaisyUI's.

**Literal values.** Where a tool needs the hex itself, such as a DaisyUI
theme, read it from the tokens:

```js
const brand = require("clio-brand")
brand.pink // "#efa5b5"
```

## Changing a colour

Edit `tokens.js`, run `npm test`, tag a new version, then bump the tag in each
app. Each app picks up the change when it upgrades, not before.
