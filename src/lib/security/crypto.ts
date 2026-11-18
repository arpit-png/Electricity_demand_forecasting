import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit NIST standard IV

function getMasterKey(): Buffer {
  const hexKey = process.env.APP_ENCRYPTION_KEY;
  if (!hexKey || hexKey.length !== 64) {
    throw new Error("APP_ENCRYPTION_KEY must be a 64-character (32-byte) hex string.");
  }
  return Buffer.from(hexKey, "hex");
}

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  authTag: string;
}

export function encryptAES256GCM(plaintext: string): EncryptedPayload {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getMasterKey(), iv);
  
  let ciphertext = cipher.update(plaintext, "utf8", "base64");
  ciphertext += cipher.final("base64");
  const authTag = cipher.getAuthTag().toString("base64");

  return {
    ciphertext,
    iv: iv.toString("base64"),
    authTag
  };
}

export function decryptAES256GCM(payload: EncryptedPayload): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getMasterKey(),
    Buffer.from(payload.iv, "base64")
  );
  
  decipher.setAuthTag(Buffer.from(payload.authTag, "base64"));
  let decrypted = decipher.update(payload.ciphertext, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
