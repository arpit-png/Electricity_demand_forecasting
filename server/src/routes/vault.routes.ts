import { Router } from "express";
import { z } from "zod";
import { createEncryptedRecord, getDecryptedRecords } from "../controllers/vault.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";

const router = Router();

const CreateVaultItemSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title required").max(100),
    payload: z.string().min(1, "Payload required").max(10000)
  })
});

router.use(requireAuth);

router.get("/", getDecryptedRecords);
router.post("/", validateRequest(CreateVaultItemSchema), createEncryptedRecord);

export default router;
