/*
      ___           ___           ___           ___           ___           ___
     /\__\         /\  \         |\__\         /\  \         /\  \         /\__\
    /:/  /        /::\  \        |:|  |       /::\  \       /::\  \       /::|  |
   /:/__/        /:/\:\  \       |:|  |      /:/\:\  \     /:/\:\  \     /:|:|  |
  /::\__\____   /::\~\:\  \      |:|__|__   /:/  \:\  \   /::\~\:\  \   /:/|:|  |__
 /:/\:::::\__\ /:/\:\ \:\__\     /::::\__\ /:/__/_\:\__\ /:/\:\ \:\__\ /:/ |:| /\__\
 \/_|:|~~|~    \:\~\:\ \/__/    /:/~~/~    \:\  /\ \/__/ \:\~\:\ \/__/ \/__|:|/:/  /
    |:|  |      \:\ \:\__\     /:/  /       \:\ \:\__\    \:\ \:\__\       |:/:/  /
    |:|  |       \:\ \/__/     \/__/         \:\/:/  /     \:\ \/__/       |::/  /
    |:|  |        \:\__\                      \::/  /       \:\__\         /:/  /
     \|__|         \/__/                       \/__/         \/__/         \/__/
 */

import path from "node:path";
import * as fs from "node:fs";
import {keyToPEM, PSSGenParams} from "@sp24/common/util/crypto.js";

const numKeys = parseInt(process.argv[2]) || 3;
const outDir = process.argv[3] || path.join(process.cwd(), "generated_keys");

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}

let neighbourhood: any[] = [];

for (let i = 0; i < numKeys; i++) {
    const keyPair = await globalThis.crypto.subtle.generateKey(PSSGenParams, true, ["sign", "verify"]);

    const publicPEM = await keyToPEM(keyPair.publicKey);
    const privatePEM = await keyToPEM(keyPair.privateKey);

    fs.writeFileSync(path.join(outDir, "key"+i+"public.spki.pem"), publicPEM);
    fs.writeFileSync(path.join(outDir, "key"+i+"private.pkcs8.pem"), privatePEM);

    neighbourhood.push({
        address: "server"+i,
        verifyKey: publicPEM,
        URL: "ws://localhost:" + (3300 + i)
    });
}

fs.writeFileSync(path.join(outDir, "neighbourhood.json"), JSON.stringify(neighbourhood));