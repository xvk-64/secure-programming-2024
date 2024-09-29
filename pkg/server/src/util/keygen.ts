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
import {encode} from "base64-arraybuffer";
import {webcrypto} from "node:crypto";

async function keyToPEM(key: webcrypto.CryptoKey) {
    const exported: ArrayBuffer = await globalThis.crypto.subtle.exportKey(key.type == "public" ? "spki" : "pkcs8", key);
    return "-----BEGIN PUBLIC KEY-----\n" + encode(exported) + "\n-----END PUBLIC KEY-----";
}

const PSSGenParams = {
    name: "RSA-PSS",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1,0,1]),
    hash: "SHA-256"
}

const numKeys = parseInt(process.argv[2]) || 3;
const outDir = process.argv[3] || path.join(process.cwd(), "generated_keys");

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}

for (let i = 0; i < numKeys; i++) {
    const keyPair = await globalThis.crypto.subtle.generateKey(PSSGenParams, true, ["sign", "verify"]);

    const publicPEM = await keyToPEM(keyPair.publicKey);
    const privatePEM = await keyToPEM(keyPair.privateKey);

    fs.writeFileSync(path.join(outDir, "key"+i+"public.spki.pem"), publicPEM);
    fs.writeFileSync(path.join(outDir, "key"+i+"public.pkcs8.pem"), privatePEM);
}