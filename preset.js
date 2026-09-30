const tokens = require("./tokens")

// A Tailwind 3 preset that puts the brand colours on :root as --clio-paper,
// --clio-pink and --clio-ink. It adds no colour names: each app maps these to
// its own roles, so nothing here collides with DaisyUI's `accent` and friends.
module.exports = {
  plugins: [
    ({ addBase }) => {
      addBase({
        ":root": Object.fromEntries(
          Object.entries(tokens).map(([name, value]) => [`--clio-${name}`, value]),
        ),
      })
    },
  ],
}
