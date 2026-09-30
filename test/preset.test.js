const assert = require("node:assert/strict")
const test = require("node:test")
const preset = require("../preset")
const tokens = require("../tokens")

test("the preset puts every brand colour on :root", () => {
  let base
  preset.plugins[0]({ addBase: (styles) => (base = styles) })

  assert.deepEqual(base, {
    ":root": {
      "--clio-paper": tokens.paper,
      "--clio-pink": tokens.pink,
      "--clio-ink": tokens.ink,
    },
  })
})
