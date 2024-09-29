import {decode, encode} from "base64-arraybuffer";

const webCrypto = globalThis.crypto.subtle;

export const OAEPGenParams: RsaHashedKeyGenParams = {
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1,0,1]),
    hash: "SHA-256"
}
export const OAEPImportParams: RsaHashedImportParams = {
    name: "RSA-OAEP",
    hash: "SHA-256"
}
export const OAEPParams: RsaOaepParams = {
    name: "RSA-OAEP",
}
export const PSSGenParams: RsaHashedKeyGenParams = {
    name: "RSA-PSS",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1,0,1]),
    hash: "SHA-256"
}
export const PSSImportParams: RsaHashedImportParams = {
    name: "RSA-PSS",
    hash: "SHA-256"
}
export const PSSParams: RsaPssParams = {
    name: "RSA-PSS",
    saltLength: 32
}

export const AESGenParams: AesKeyGenParams = {
    name: "AES-GCM",
    length: 128
}

export async function keyToPEM(key: CryptoKey) {
    const exported: ArrayBuffer = await webCrypto.exportKey(key.type == "public" ? "spki" : "pkcs8", key);
    return "-----BEGIN PUBLIC KEY-----\n" + encode(exported) + "\n-----END PUBLIC KEY-----";
}
export async function PEMToKey(pem: string, importParams: RsaHashedImportParams) {
    const pemHeader = "-----BEGIN PUBLIC KEY-----\n";
    const pemFooter = "\n-----END PUBLIC KEY-----";
    const pemContents = pem.substring(
        pemHeader.length,
        pem.length - pemFooter.length,
    );

    const spki = decode(pemContents);

    return await webCrypto.importKey("spki", spki, importParams, true, ["verify"]);
}
export async function calculateFingerprint(key: CryptoKey) {
    let exportedKeyBuffer = new TextEncoder().encode(await keyToPEM(key));
    let fingerprintBuffer = await crypto.subtle.digest("SHA-256", exportedKeyBuffer);
    return encode(fingerprintBuffer);
}

export async function duplicateKey(publicKey: CryptoKey): Promise<{verifyKey: CryptoKey, encryptKey: CryptoKey}> {
    const exportedPub = await webCrypto.exportKey("spki", publicKey);
    const verify = await webCrypto.importKey("spki", exportedPub, PSSImportParams, true, ["verify"]);
    const encrypt = await webCrypto.importKey("spki", exportedPub, OAEPImportParams, true, ["encrypt"]);

    return {verifyKey: verify, encryptKey: encrypt};
}