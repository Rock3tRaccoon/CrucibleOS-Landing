// Copies sec-ui's self-hosted font files into web-folder/ so pcss/fonts.pcss can
// reference them with plain relative paths in the built CSS (postcss-import doesn't
// rebase url()s reached through node_modules).
import { cpSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, "node_modules/sec-ui/dist/fonts");
const dest = join(root, "web-folder/fonts");

mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });

// The forge-core wasm binary: Rollup's IIFE bundle inlines forge_core.js itself (its
// import.meta.url becomes a shim resolved against app-bundle.js's own <script src>), so the
// compiled .wasm binary must be served as a sibling of app-bundle.js, not under wasm/.
mkdirSync(join(root, "web-folder/js"), { recursive: true });
cpSync(
	join(root, "node_modules/sec-ui/dist/wasm/forge_core_bg.wasm"),
	join(root, "web-folder/js/forge_core_bg.wasm"),
);

// The real CrucibleOS logo mark. The source is a very detailed illustration (500+ paths, 10
// grayscale tones) — too much for the browser to rasterize crisply on the fly at the small sizes
// this actually gets displayed at, so it's pre-rasterized once (assets/logo-mark.png, 256px wide,
// 3x the ~40-48px display sizes in use) rather than served as live SVG.
mkdirSync(join(root, "web-folder/images"), { recursive: true });
cpSync(join(root, "assets/logo-mark.png"), join(root, "web-folder/images/logo-mark.png"));

// Favicons — same source illustration, pre-rasterized and padded to square canvases (the artwork
// itself isn't square) at each size browsers actually request, plus a legacy multi-resolution
// .ico. Served from the web root, which is where browsers look for /favicon.ico by convention.
for (const name of ["favicon.ico", "favicon-16.png", "favicon-32.png", "apple-touch-icon.png"]) {
	cpSync(join(root, "assets", name), join(root, "web-folder", name));
}

console.log("crucible-os-landing: copied sec-ui fonts, forge-core wasm binary, logo mark, and favicons to web-folder/");
