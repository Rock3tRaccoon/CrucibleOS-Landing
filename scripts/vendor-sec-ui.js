// Re-syncs vendor/sec-ui from the sibling sec-ui dev repo (../sec-ui). crucible-frontend depends
// on the vendored copy (not a file:../sec-ui link) so that a fresh clone — e.g. Vercel's build —
// has everything it needs without that sibling directory existing.
//
// Run this after making changes in ../sec-ui and rebuilding it (npm run build there), then
// commit the resulting vendor/sec-ui changes here.
import { cpSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const srcRoot = join(root, "../sec-ui");
const srcDist = join(srcRoot, "dist");
const destRoot = join(root, "vendor/sec-ui");

if (!existsSync(srcDist)) {
	console.error(`sec-ui dist not found at ${srcDist} — run "npm run build" in ../sec-ui first.`);
	process.exit(1);
}

rmSync(join(destRoot, "dist"), { recursive: true, force: true });
cpSync(srcDist, join(destRoot, "dist"), { recursive: true });

console.log(`vendor-sec-ui: synced ${srcDist} -> ${join(destRoot, "dist")}`);
console.log('Remember: `npm install` (to refresh the node_modules/sec-ui link) and commit vendor/sec-ui.');
