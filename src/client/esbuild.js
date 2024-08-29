import {build} from "esbuild";
import fs from "fs";

fs.copyFileSync("./index.html", "./dist/index.html", null);

await build({
    entryPoints: ['index.tsx'],
    bundle: true,
    outdir: './dist',
    format: 'esm',
});