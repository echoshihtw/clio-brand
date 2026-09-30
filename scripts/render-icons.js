// Renders the app icons in icons/ from the master logo and the brand tokens,
// so they cannot drift from either. Run after changing the logo or a colour:
//
//   npm run icons
//
// Uses the Chrome installed on this machine (playwright-core downloads no
// browser). Set CHROME_PATH if Chrome is not in its usual place.

const fs = require("node:fs")
const path = require("node:path")
const { chromium } = require("playwright-core")
const tokens = require("../tokens")

const root = path.join(__dirname, "..")
const out = path.join(root, "icons")
const master = fs.readFileSync(path.join(root, "logo/clio-single-ink-master.svg"), "utf8")
const paths = master.match(/<path [^>]*\/>/g).join("")

// [file, size, stroke, how much of the square the face fills]
// Home-screen and install icons keep the master's 8-unit stroke. The favicon
// is the one exception: at 16–48px the master line disappears, so it is drawn
// at 18. The maskable icon keeps the face inside Android's circular safe zone.
const ICONS = [
  ["apple-touch-icon.png", 180, 8, 72],
  ["icon-192.png", 192, 8, 72],
  ["icon-512.png", 512, 8, 72],
  ["icon-maskable-512.png", 512, 8, 58],
]
const FAVICON_SIZES = [16, 32, 48]
const FAVICON_STROKE = 18
const FAVICON_FILL = 82

function page(size, stroke, fill) {
  // viewBox leaves room for the heaviest stroke at the drawing's edges.
  return `<html><body style="margin:0;width:${size}px;height:${size}px;background:${tokens.ink};display:grid;place-items:center">
    <svg viewBox="16 6 252 306" style="height:${fill}%" fill="none" stroke="${tokens.paper}"
      stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${paths}</svg></body></html>`
}

// An .ico is a small header followed by PNG images, which every current
// browser reads.
function ico(pngs) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(pngs.length, 4)
  let offset = 6 + 16 * pngs.length
  const entries = pngs.map(({ size, png }) => {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size % 256, 0)
    entry.writeUInt8(size % 256, 1)
    entry.writeUInt16LE(1, 4)
    entry.writeUInt16LE(32, 6)
    entry.writeUInt32LE(png.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += png.length
    return entry
  })
  return Buffer.concat([header, ...entries, ...pngs.map(({ png }) => png)])
}

async function main() {
  fs.mkdirSync(out, { recursive: true })
  const browser = await chromium.launch(
    process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chrome" },
  )
  const render = async (size, stroke, fill) => {
    const tab = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 })
    await tab.setContent(page(size, stroke, fill))
    const png = await tab.screenshot({ clip: { x: 0, y: 0, width: size, height: size } })
    await tab.close()
    return png
  }
  for (const [file, size, stroke, fill] of ICONS) {
    fs.writeFileSync(path.join(out, file), await render(size, stroke, fill))
  }
  const favicons = []
  for (const size of FAVICON_SIZES) {
    favicons.push({ size, png: await render(size, FAVICON_STROKE, FAVICON_FILL) })
  }
  fs.writeFileSync(path.join(out, "favicon.ico"), ico(favicons))
  await browser.close()
  console.log(`icons/: ${ICONS.map(([f]) => f).join(", ")}, favicon.ico (${FAVICON_SIZES.join("/")})`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
