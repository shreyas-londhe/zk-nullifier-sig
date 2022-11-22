// TODO: Consolidate secp256k1 libraries
import { publicKeyCreate } from "secp256k1";
import { Point } from "@noble/secp256k1";
import { hexToUint8Array, messageToUint8Array } from "./utils/encoding";
import hashToCurve from "./utils/hashToCurve";

export function computeHashMPk(message: Uint8Array, publicKey: Uint8Array) {
  // Concatenate message and publicKey
  const preimage = new Uint8Array(message.length + publicKey.length);
  preimage.set(message);
  preimage.set(publicKey, message.length);
  return hashToCurve(Array.from(preimage));
}

export function multiplyPoint(h, secretKey) {
  const hashPoint = new Point(
    BigInt("0x" + h.x.toString()),
    BigInt("0x" + h.y.toString())
  );
  return hashPoint.multiply(
    BigInt("0x" + Buffer.from(secretKey).toString("hex"))
  );
}

export function computeC(g, pk, h, nul, g_r, z) {
  // TODO
}

const testSecretKey = hexToUint8Array(
  "519b423d715f8b581f4fa8ee59f4771a5b44c8130b4e3eacca54a56dda72b464"
);

const testPublicKey = publicKeyCreate(testSecretKey);

const testR = hexToUint8Array(
  "93b9323b629f251b8f3fc2dd11f4672c5544e8230d493eceea98a90bda789808"
);

const testMessage = messageToUint8Array("An example app message string");

const hashMPk = computeHashMPk(testMessage, Buffer.from(testPublicKey));
console.log(`h.x: ${hashMPk.x.toString()}`);
console.log(`h.y: ${hashMPk.y.toString()}`);
const nullifier = multiplyPoint(hashMPk, Buffer.from(testSecretKey));
console.log(`nullifier.x: ${nullifier.x.toString(16)}`);
console.log(`nullifier.y: ${nullifier.y.toString(16)}`);
const hashMPkPowR = multiplyPoint(hashMPk, Buffer.from(testR));
console.log(`hashMPkPowR.x: ${hashMPkPowR.x.toString(16)}`);
console.log(`hashMPkPowR.y: ${hashMPkPowR.y.toString(16)}`);

// Expected
// h.x: bcac2d0e12679f23c218889395abcdc01f2affbc49c54d1136a2190db0800b65
// h.y: 3bcfb339c974c0e757d348081f90a123b0a91a53e32b3752145d87f0cd70966e
// nullifier.x: "57bc3ed28172ef8adde4b9e0c2cce745fcc5a66473a45c1e626f1d0c67e55830"
// nullifier.y: "6a2f41488d58f33ae46edd2188e111609f9f3ae67ea38fa891d6087fe59ecb73"
// hashMPkPowR.x: 6d017c6f63c59fa7a5b1e9a654e27d2869579f4d152131db270558fccd27b97c
// hashMPkPowR.y: 586c43fb5c99818c564a8f80a88a65f83e3f44d3c6caf5a1a4e290b777ac56ed
