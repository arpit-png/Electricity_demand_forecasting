import { Request, Response } from "express";
import { pool } from "../config/database.js";
import { encryptDataAtRest, decryptDataAtRest } from "../utils/crypto.js";

export async function createEncryptedRecord(req: Request, res: Response): Promise<void> {
  const userId = req.user?.userId;
  const { title, payload } = req.body;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    // Encrypt at rest with AES-256-GCM
    const { ciphertext, iv, authTag } = encryptDataAtRest(payload);

    const result = await pool.query(
      `INSERT INTO vault_items (user_id, title, encrypted_data, iv, auth_tag)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, created_at`,
      [userId, title, ciphertext, iv, authTag]
    );

    res.status(201).json({
      success: true,
      item: result.rows[0]
    });
  } catch (err) {
    console.error("Vault store error:", err);
    res.status(500).json({ error: "Failed to securely seal payload." });
  }
}

export async function getDecryptedRecords(req: Request, res: Response): Promise<void> {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const result = await pool.query(
      "SELECT id, title, encrypted_data, iv, auth_tag, created_at FROM vault_items WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    const decryptedItems = result.rows.map((row) => {
      try {
        const cleartext = decryptDataAtRest({
          ciphertext: row.encrypted_data,
          iv: row.iv,
          authTag: row.auth_tag
        });
        return {
          id: row.id,
          title: row.title,
          payload: cleartext,
          createdAt: row.created_at
        };
      } catch (cryptoErr) {
        return {
          id: row.id,
          title: row.title,
          payload: "[CIPHERTEXT_VERIFICATION_FAILED_CORRUPT]",
          createdAt: row.created_at
        };
      }
    });

    res.status(200).json({ items: decryptedItems });
  } catch (err) {
    console.error("Vault read error:", err);
    res.status(500).json({ error: "Failed to retrieve decrypted vault items." });
  }
}
