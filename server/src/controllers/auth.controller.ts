import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";

const COOKIE_NAME = "auth_session";
const SALT_ROUNDS = 12; // Production work factor

function issueJwtToken(user: { id: string; email: string }): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }
  return jwt.sign({ userId: user.id, email: user.email }, secret, {
    expiresIn: "24h",
    algorithm: "HS256"
  });
}

function dispatchSessionCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
}

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: "Identity with this email already exists." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const inserted = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
      [email, passwordHash]
    );

    const user = inserted.rows[0];
    const token = issueJwtToken(user);
    dispatchSessionCookie(res, token);

    res.status(201).json({
      success: true,
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal registration failure." });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT id, email, password_hash FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      res.status(401).json({ error: "Invalid authentication credentials." });
      return;
    }

    const user = result.rows[0];
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      res.status(401).json({ error: "Invalid authentication credentials." });
      return;
    }

    const token = issueJwtToken(user);
    dispatchSessionCookie(res, token);

    res.status(200).json({
      success: true,
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal authentication failure." });
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/"
  });
  res.status(200).json({ success: true, message: "Session revoked." });
}

export async function getSession(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ authenticated: false });
    return;
  }
  res.status(200).json({ authenticated: true, user: req.user });
}
