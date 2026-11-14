// AI-assisted: see AI-ATTRIBUTION.md

// Builds the Lambda layer that holds tweeter-shared and the server's other
// runtime dependencies. Lambda mounts a layer at /opt, and Node looks in
// /opt/nodejs/node_modules, so the layer is laid out as:
//
//   layer/nodejs/package.json
//   layer/nodejs/node_modules/tweeter-shared/{package.json,dist/...}
//   layer/nodejs/node_modules/<date-fns, uuid, ...>
//
// tweeter-shared is copied in (not symlinked, which is how npm installs a
// file: dependency) so the zip contains real files. Run tweeter-shared's
// compile step first; `npm run build:layer` does that for you.

import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const serverDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const sharedDir = join(serverDir, "..", "tweeter-shared");
const layerDir = join(serverDir, "layer");
const nodejsDir = join(layerDir, "nodejs");
const sharedOut = join(nodejsDir, "node_modules", "tweeter-shared");

if (!existsSync(join(sharedDir, "dist", "index.js"))) {
    console.error("tweeter-shared/dist is missing. Run `npm run compile` in tweeter-shared first.");
    process.exit(1);
}

rmSync(layerDir, { recursive: true, force: true });
mkdirSync(nodejsDir, { recursive: true });

// The server's runtime dependencies, minus tweeter-shared itself (copied below).
// tweeter-shared imports date-fns and uuid at runtime; the server lists both,
// so they get installed here and tweeter-shared resolves them from the layer.
const serverPkg = JSON.parse(readFileSync(join(serverDir, "package.json"), "utf8"));
const { "tweeter-shared": _shared, ...dependencies } = serverPkg.dependencies ?? {};

writeFileSync(
    join(nodejsDir, "package.json"),
    JSON.stringify({ name: "tweeter-lambda-layer", private: true, dependencies }, null, 2) + "\n"
);

execSync("npm install --omit=dev --no-audit --no-fund", { cwd: nodejsDir, stdio: "inherit" });

// npm install prunes anything not in package.json, so copy tweeter-shared afterwards.
mkdirSync(sharedOut, { recursive: true });
cpSync(join(sharedDir, "package.json"), join(sharedOut, "package.json"));
cpSync(join(sharedDir, "dist"), join(sharedOut, "dist"), {
    recursive: true,
    filter: (src) => !src.endsWith(".map"),
});

console.log(`Layer built in ${layerDir}`);
