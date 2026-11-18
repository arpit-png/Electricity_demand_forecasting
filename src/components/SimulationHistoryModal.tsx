"use client";

import React, { useState, useEffect } from "react";
import {
  SimulationRecord,
  getSimulations,
  saveSimulation,
} from "@/lib/firebase";
import { ScenarioParams, GridSummary } from "@/lib/forecasting-engine";
import { formatMW } from "@/lib/utils";
import { Database, Save, RotateCcw, CheckCircle, Clock, X, Cloud, ShieldCheck } from "lucide-react";

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
        author: "Google Cloud Grid Controller",
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
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-[#3c4043] bg-[#202124] shadow-2xl flex flex-col font-sans text-xs">
        {/* Google 4-Color Strip */}
        <div className="h-[3px] w-full google-brand-bar" />

        {/* Header */}
        <div className="p-4 border-b border-[#3c4043] flex items-center justify-between bg-[#18191c]">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#fbbc04]" />
            <h3 className="text-sm font-semibold text-[#e8eaed] font-sans">Google Cloud Firestore Simulation Vault</h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium border ${
                source === "firestore"
                  ? "bg-[#0d2818] text-[#81c995] border-[#81c995]/40"
                  : "bg-[#1b2b44] text-[#8ab4f8] border-[#8ab4f8]/40"
              }`}
            >
              {source === "firestore" ? "⚡ Cloud Firestore Sync: Live" : "💾 Local Store + Firestore Fallback Active"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#9aa0a6] hover:text-white hover:bg-[#303134] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Save Current Simulation Form */}
          <form onSubmit={handleSave} className="p-4 rounded-xl bg-[#18191c] border border-[#3c4043] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-[#e8eaed] flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5 text-[#8ab4f8]" />
                Commit Current Grid Scenario to Cloud Database
              </span>
              {saveSuccess && (
                <span className="text-[#81c995] flex items-center gap-1 text-[11px] font-sans font-medium">
                  <CheckCircle className="w-3 h-3" /> Successfully committed!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Scenario Name (e.g., 2026 CAISO July Heatwave #4)"
                value={simName}
                onChange={(e) => setSimName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-[#202124] border border-[#3c4043] text-[#e8eaed] placeholder-[#9aa0a6] text-xs focus:outline-none focus:border-[#8ab4f8]"
              />
              <input
                type="text"
                placeholder="Optional Notes / Dispatch Strategy"
                value={simNotes}
                onChange={(e) => setSimNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#202124] border border-[#3c4043] text-[#e8eaed] placeholder-[#9aa0a6] text-xs focus:outline-none focus:border-[#8ab4f8]"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] text-[#9aa0a6]">
                Params: {paramsSummary(currentParams)}
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 rounded-full font-sans font-semibold text-xs bg-[#1a73e8] hover:bg-[#1557b0] text-white disabled:opacity-50 transition-colors shadow-sm"
              >
                {isSaving ? "Persisting..." : "Save Snapshot"}
              </button>
            </div>
          </form>

          {/* Stored Simulations List */}
          <div>
            <h4 className="text-xs font-sans uppercase text-[#9aa0a6] font-medium tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#8ab4f8]" />
              Historical Grid Runs ({simulations.length})
            </h4>

            {simulations.length === 0 ? (
              <div className="p-8 text-center text-[#9aa0a6] rounded-xl bg-[#18191c] border border-[#3c4043]">
                No historical simulations committed yet. Tune parameters and commit your first snapshot above!
              </div>
            ) : (
              <div className="space-y-2.5">
                {simulations.map((sim) => (
                  <div
                    key={sim.id}
                    className="p-3.5 rounded-xl bg-[#18191c] border border-[#3c4043] hover:border-[#8ab4f8]/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#e8eaed]">{sim.name}</span>
                        <span className="text-[10px] text-[#9aa0a6] font-mono">
                          {new Date(sim.timestamp).toLocaleDateString()} {new Date(sim.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {sim.notes && (
                        <p className="text-[11px] text-[#9aa0a6] mt-0.5">{sim.notes}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] font-mono text-[#9aa0a6]">
                        <span className="text-[#fdd663]">Solar: {(sim.scenarioParams.solarCapacityMW / 1000).toFixed(1)}GW</span>
                        <span>•</span>
                        <span className="text-[#81c995]">Wind: {(sim.scenarioParams.windCapacityMW / 1000).toFixed(1)}GW</span>
                        <span>•</span>
                        <span className="text-[#f28b82]">3h Ramp: {formatMW(sim.summary.threeHourRampMW)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onLoadScenario(sim.scenarioParams);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#202124] hover:bg-[#303134] text-[#8ab4f8] border border-[#3c4043] text-xs font-sans font-medium transition-colors self-end sm:self-center"
                    >
                      <RotateCcw className="w-3 h-3 text-[#8ab4f8]" />
                      <span>Restore</span>
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

function paramsSummary(p: ScenarioParams): string {
  return `${(p.solarCapacityMW / 1000).toFixed(1)}GW Solar, ${p.temperatureCelsius}°C, ${(p.batteryCapacityMWh / 1000).toFixed(1)}GWh BESS`;
}
