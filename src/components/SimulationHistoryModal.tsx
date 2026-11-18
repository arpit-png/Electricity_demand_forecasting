"use client";

import React, { useState, useEffect } from "react";
import {
  SimulationRecord,
  getSimulations,
  saveSimulation,
  isFirebaseConnected,
} from "@/lib/firebase";
import { ScenarioParams, GridSummary } from "@/lib/forecasting-engine";
import { formatMW } from "@/lib/utils";
import { Database, Save, RotateCcw, Cloud, CheckCircle, Clock, Trash2, X, AlertCircle } from "lucide-react";
import { SkiperMagneticButton } from "./skiper-ui/skiper-magnetic-button";

interface SimulationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentParams: ScenarioParams;
  currentSummary: GridSummary;
  onLoadScenario: (params: ScenarioParams) => void;
}

export const SimulationHistoryModal: React.FC<SimulationHistoryModalProps> = ({
  isOpen,
  onClose,
  currentParams,
  currentSummary,
  onLoadScenario,
}) => {
  const [simulations, setSimulations] = useState<SimulationRecord[]>([]);
  const [source, setSource] = useState<"firestore" | "local-resilient">("local-resilient");
  const [simName, setSimName] = useState("");
  const [simNotes, setSimNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    const res = await getSimulations();
    setSimulations(res.records);
    setSource(res.source);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simName.trim()) return;
    setIsSaving(true);

    try {
      await saveSimulation({
        name: simName.trim(),
        timestamp: new Date().toISOString(),
        scenarioParams: currentParams,
        summary: currentSummary,
        notes: simNotes.trim() || undefined,
        author: "Grid Control System",
      });

      setSaveSuccess(true);
      setSimName("");
      setSimNotes("");
      await loadHistory();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-[#0b0e14] shadow-2xl flex flex-col font-mono text-xs">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Database Simulation Vault</h3>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                source === "firestore"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
              }`}
            >
              {source === "firestore" ? "⚡ Cloud Firestore Sync" : "💾 Resilient Local + Firestore Ready"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-5 space-y-6">
          {/* Save Current Run Form */}
          <form onSubmit={handleSave} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5 text-cyan-400" />
                Snapshot Current Grid Simulation
              </span>
              <span className="text-[10px] text-slate-500">
                Peak Net: {formatMW(currentSummary.peakNetDemand)} • 3h Ramp: {formatMW(currentSummary.threeHourRampMW)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Simulation label (e.g. Heatwave Stress Run 2)"
                value={simName}
                onChange={(e) => setSimName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                placeholder="Optional notes or observations..."
                value={simNotes}
                onChange={(e) => setSimNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              {saveSuccess ? (
                <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                  <CheckCircle className="w-3.5 h-3.5" /> Saved successfully to database!
                </span>
              ) : (
                <span className="text-slate-500 text-[10px]">Saved snapshots can be recalled at any time.</span>
              )}

              <SkiperMagneticButton
                type="submit"
                disabled={isSaving || !simName.trim()}
                variant="primary"
                size="sm"
                icon={<Save className="w-3.5 h-3.5" />}
              >
                {isSaving ? "Saving..." : "Commit Run to Database"}
              </SkiperMagneticButton>
            </div>
          </form>

          {/* Previous History List */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Historical Simulation Records ({simulations.length})
            </h4>

            {simulations.length === 0 ? (
              <div className="p-6 text-center text-slate-500 border border-dashed border-white/10 rounded-xl">
                No simulations saved yet. Run a scenario above and save it to the database!
              </div>
            ) : (
              <div className="space-y-2.5">
                {simulations.map((sim) => (
                  <div
                    key={sim.id}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{sim.name}</span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(sim.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                        <span>Solar: {(sim.scenarioParams.solarCapacityMW / 1000).toFixed(1)} GW</span>
                        <span>•</span>
                        <span>Wind: {(sim.scenarioParams.windCapacityMW / 1000).toFixed(1)} GW</span>
                        <span>•</span>
                        <span className={sim.summary.threeHourRampMW > 9000 ? "text-rose-400" : "text-amber-400"}>
                          Ramp: {formatMW(sim.summary.threeHourRampMW)}
                        </span>
                      </div>
                      {sim.notes && <p className="text-[10px] text-slate-400 italic mt-0.5">"{sim.notes}"</p>}
                    </div>

                    <button
                      onClick={() => {
                        onLoadScenario(sim.scenarioParams);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-colors flex items-center gap-1 self-start sm:self-center"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Restore Scenario
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
