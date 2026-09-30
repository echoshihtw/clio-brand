const assert = require("node:assert/strict")
const { readFileSync } = require("node:fs")
const path = require("node:path")
const test = require("node:test")
const tokens = require("../tokens")

test("the logo is drawn in the brand ink and nothing else", () => {
  const svg = readFileSync(path.join(__dirname, "../logo/clio-single-ink-master.svg"), "utf8")
  const colours = [...new Set(svg.match(/#[0-9a-fA-F]{6}/g).map((c) => c.toLowerCase()))]

  assert.deepEqual(colours, [tokens.ink])
})
