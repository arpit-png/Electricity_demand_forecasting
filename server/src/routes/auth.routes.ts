import { Router } from "express";
import { z } from "zod";
import { register, login, logout, getSession } from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { authRateLimiter } from "../middleware/security.js";

const router = Router();

const AuthCredentialSchema = z.object({
  body: z.object({
    email: z.string().email("Valid institutional email required"),
    password: z.string().min(8, "Password must have at least 8 characters")
  })
});

router.post("/register", authRateLimiter, validateRequest(AuthCredentialSchema), register);
router.post("/login", authRateLimiter, validateRequest(AuthCredentialSchema), login);
router.post("/logout", logout);
router.get("/me", requireAuth, getSession);

export default router;
