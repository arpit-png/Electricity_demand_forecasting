"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Unlock, Plus, RefreshCw, Key, AlertCircle } from "lucide-react";

interface VaultItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export const QuantumVaultDashboard = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);

  const [email, setEmail] = useState("operative@antigravity.io");
  const [password, setPassword] = useState("quantum_pass_2026");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [items, setItems] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchSessionAndVault = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setAuthenticated(data.authenticated);
      setUser(data.user);

      if (data.authenticated) {
        fetchVaultItems();
      }
    } catch {
      setAuthenticated(false);
    }
  };

  const fetchVaultItems = async () => {
    try {
      const res = await fetch("/api/vault");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSessionAndVault();
  }, []);

  const handleRegisterOrLogin = async (isRegister: boolean) => {
    setLoading(true);
    setMessage(null);
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Authentication failed");
      } else {
        await fetchSessionAndVault();
      }
    } catch {
      setMessage("Network error connecting to API");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthenticated(false);
    setUser(null);
    setItems([]);
  };

  const handleCreateVaultItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setLoading(true);
    try {
      const res = await fetch("/api/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, sensitiveContent: content })
      });
      if (res.ok) {
        setTitle("");
        setContent("");
        await fetchVaultItems();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="vault-demo" className="max-w-4xl mx-auto px-4 py-16">
      <div className="relative p-8 rounded-3xl bg-zinc-900/60 border border-white/[0.1] backdrop-blur-2xl shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-white/[0.08] pb-6">
          <div>
            <span className="text-xs font-mono text-accent-cyan flex items-center gap-1.5 mb-1">
              <Shield className="w-3.5 h-3.5" /> SECURE CLIENT-SERVER TERMINAL
            </span>
            <h2 className="text-2xl font-black text-white">Quantum Data Vault</h2>
          </div>

          {authenticated && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-400">
                Logged as: <strong className="text-white">{user?.email}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-mono bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
              >
                DISCONNECT
              </button>
            </div>
          )}
        </div>

        {message && (
          <div className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!authenticated ? (
            <motion.div
              key="auth-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto py-8"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center mx-auto mb-3 text-accent-cyan">
                  <Key className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Authentication Required</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Issues an HS256 JWT sealed inside an HttpOnly, SameSite=Strict cookie container.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-white text-sm focus:border-accent-cyan focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-white text-sm focus:border-accent-cyan focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    disabled={loading}
                    onClick={() => handleRegisterOrLogin(false)}
                    className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-medium text-xs font-mono transition-colors border border-white/[0.1]"
                  >
                    SIGN IN
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => handleRegisterOrLogin(true)}
                    className="w-full py-2.5 rounded-xl bg-accent-cyan hover:bg-accent-cyan/90 text-zinc-950 font-bold text-xs font-mono transition-colors"
                  >
                    REGISTER
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="vault-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <form onSubmit={handleCreateVaultItem} className="p-6 rounded-2xl bg-black/30 border border-white/[0.06] space-y-4">
                <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-accent-emerald" /> ENCRYPT NEW RECORD (AES-256-GCM)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Payload Title / Tag"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="sm:col-span-1 px-4 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-white text-xs focus:border-accent-cyan focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Secret payload (decrypted on the fly by authenticated server API)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="sm:col-span-2 px-4 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-white text-xs focus:border-accent-cyan focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-accent-emerald text-zinc-950 font-bold text-xs font-mono hover:bg-accent-emerald/90 transition-colors flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" /> SEAL & ENCRYPT RECORD
                </button>
              </form>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    <Unlock className="w-4 h-4 text-accent-cyan" /> DECRYPTED VAULT RECORDS
                  </h4>
                  <button
                    onClick={fetchVaultItems}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {items.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-white/[0.1] text-zinc-500 text-xs font-mono">
                    No encrypted records stored. Create your first record above.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-accent-cyan/30 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                      >
                        <div>
                          <span className="text-xs font-bold text-white block">{item.title}</span>
                          <span className="text-xs font-mono text-accent-cyan mt-1 block">
                            {item.content}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {new Date(item.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
