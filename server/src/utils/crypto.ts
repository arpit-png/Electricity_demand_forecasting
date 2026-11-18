import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH_BYTES = 12; // 96-bit IV recommended by NIST SP 800-38D
const AUTH_TAG_LENGTH_BYTES = 16; // 128-bit authentication tag

function getEncryptionKey(): Buffer {
  const secretHex = process.env.ENCRYPTION_KEY;
  if (!secretHex || secretHex.length !== 64) {
    throw new Error("ENCRYPTION_KEY must be a cryptographically secure 64-character (32-byte) hex string.");
  }
  return Buffer.from(secretHex, "hex");
}

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  authTag: string;
}

/**
 * Encrypts a plaintext string using authenticated AES-256-GCM.
 * Generates an ephemeral cryptographic nonce (IV) for every invocation.
 */
export function encryptDataAtRest(plaintext: string): EncryptedPayload {
  const iv = crypto.randomBytes(IV_LENGTH_BYTES);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv, {
    authTagLength: AUTH_TAG_LENGTH_BYTES
  });

  let ciphertext = cipher.update(plaintext, "utf8", "base64");
  ciphertext += cipher.final("base64");
  const authTag = cipher.getAuthTag().toString("base64");

  return {
    ciphertext,
    iv: iv.toString("base64"),
    authTag
  };
}

/**
 * Decrypts an authenticated AES-256-GCM ciphertext payload.
 * Verifies integrity using the 128-bit authentication tag before outputting plaintext.
 */
export function decryptDataAtRest(payload: EncryptedPayload): string {
  const iv = Buffer.from(payload.iv, "base64");
  const authTag = Buffer.from(payload.authTag, "base64");

  const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv, {
    authTagLength: AUTH_TAG_LENGTH_BYTES
  });

  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(payload.ciphertext, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
