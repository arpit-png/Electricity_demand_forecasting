import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Unlock, Plus, RefreshCw, Key, AlertCircle } from "lucide-react";
import { apiClient } from "../api/client";

interface VaultRecord {
  id: string;
  title: string;
  payload: string;
  createdAt: string;
}

export const VaultTerminal: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<{ userId: string; email: string } | null>(null);

  // Authentication inputs
  const [email, setEmail] = useState("principal@antigravity.io");
  const [password, setPassword] = useState("HyperSecure_2026!");

  // Vault form inputs
  const [title, setTitle] = useState("");
  const [secretPayload, setSecretPayload] = useState("");
  const [records, setRecords] = useState<VaultRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check existing session
  const verifySession = async () => {
    try {
      const response = await apiClient.get("/auth/me");
      if (response.data.authenticated) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        fetchVaultRecords();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const fetchVaultRecords = async () => {
    try {
      const response = await apiClient.get("/vault");
      setRecords(response.data.items || []);
    } catch (err: any) {
      console.error("Vault retrieval error", err);
    }
  };

  useEffect(() => {
    verifySession();

    const handleUnauthorized = () => {
      setIsAuthenticated(false);
      setUser(null);
      setRecords([]);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const handleAuth = async (isRegister: boolean) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const response = await apiClient.post(endpoint, { email, password });
      if (response.data.success) {
        await verifySession();
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || "Authentication request failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await apiClient.post("/auth/logout");
    setIsAuthenticated(false);
    setUser(null);
    setRecords([]);
  };

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !secretPayload) return;
    setLoading(true);
    try {
      await apiClient.post("/vault", { title, payload: secretPayload });
      setTitle("");
      setSecretPayload("");
      await fetchVaultRecords();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || "Failed to encrypt and store record.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="vault-terminal" className="max-w-4xl mx-auto px-4 py-20">
      <div className="relative p-8 rounded-3xl bg-zinc-900/60 border border-white/[0.1] backdrop-blur-2xl shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-white/[0.08] pb-6">
          <div>
            <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5 mb-1">
              <Shield className="w-3.5 h-3.5" /> INDUSTRIAL DEFENSE TERMINAL
            </span>
            <h2 className="text-2xl font-black text-white">Quantum Data Vault</h2>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-400">
                Principal: <strong className="text-white">{user?.email}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-lg text-xs font-mono bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
              >
                REVOKE SESSION
              </button>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 p-3.5 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <motion.div
              key="auth-gate"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="max-w-md mx-auto py-8"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-3 text-cyan-400">
                  <Key className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Zero-Trust Authentication</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Issues an HS256 JWT sealed within SameSite=Strict HttpOnly cookies.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    disabled={loading}
                    onClick={() => handleAuth(false)}
                    className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-medium text-xs font-mono transition-colors border border-white/[0.08]"
                  >
                    SIGN IN
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => handleAuth(true)}
                    className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold text-xs font-mono transition-colors"
                  >
                    REGISTER
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="vault-records"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-8"
            >
              {/* Record Entry Form */}
              <form onSubmit={handleCreateRecord} className="p-6 rounded-2xl bg-black/40 border border-white/[0.08] space-y-4">
                <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-emerald-400" /> SEAL NEW RECORD (AES-256-GCM)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Payload Identifier"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="sm:col-span-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.1] text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Sensitive Payload (Encrypted at rest)"
                    value={secretPayload}
                    onChange={(e) => setSecretPayload(e.target.value)}
                    required
                    className="sm:col-span-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.1] text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-400 text-zinc-950 font-bold text-xs font-mono hover:bg-emerald-300 transition-colors flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" /> SEAL RECORD AT REST
                </button>
              </form>

              {/* Records Listing */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    <Unlock className="w-4 h-4 text-cyan-400" /> DECRYPTED VAULT RECORDS
                  </h4>
                  <button
                    onClick={fetchVaultRecords}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {records.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-white/[0.1] text-zinc-500 text-xs font-mono">
                    Zero records stored. Encrypt your first payload above.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {records.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                      >
                        <div>
                          <span className="text-xs font-bold text-white block">{item.title}</span>
                          <span className="text-xs font-mono text-cyan-400 mt-1 block">
                            {item.payload}
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
