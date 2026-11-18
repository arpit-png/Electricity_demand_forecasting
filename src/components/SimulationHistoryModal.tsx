"use client";

import React, { useState, useEffect } from "react";
import {
  SimulationRecord,
  getSimulations,
  saveSimulation,
} from "@/lib/firebase";
import { ScenarioParams, GridSummary } from "@/lib/forecasting-engine";
import { formatMW } from "@/lib/utils";
import { Database, Save, RotateCcw, CheckCircle, Clock, X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border shadow-2xl flex flex-col text-xs bg-white border-slate-200 text-slate-900 dark:bg-[#111827] dark:border-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Simulation History &amp; Scenario Vault</h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                source === "firestore"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800"
                  : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800"
              }`}
            >
              {source === "firestore" ? "⚡ Cloud Database: Synchronized" : "💾 Resilient Local Storage: Active"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Save Current Simulation Form */}
          <form onSubmit={handleSave} className="p-4 rounded-xl border space-y-3 bg-slate-50 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5 text-blue-500" />
                Commit Current Grid Scenario to Database
              </span>
              {saveSuccess && (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px] font-medium">
                  <CheckCircle className="w-3 h-3" /> Successfully saved!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Scenario Name (e.g., July Peak Heatwave #2)"
                value={simName}
                onChange={(e) => setSimName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:border-blue-500 bg-white border-slate-200 text-slate-900 placeholder-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500"
              />
              <input
                type="text"
                placeholder="Optional Notes / Dispatch Strategy"
                value={simNotes}
                onChange={(e) => setSimNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:border-blue-500 bg-white border-slate-200 text-slate-900 placeholder-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Params: {paramsSummary(currentParams)}
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 rounded-full font-semibold text-xs bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-colors shadow-sm"
              >
                {isSaving ? "Saving..." : "Save Snapshot"}
              </button>
            </div>
          </form>

          {/* Stored Simulations List */}
          <div>
            <h4 className="text-xs uppercase text-slate-500 dark:text-slate-400 font-medium tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              Historical Grid Runs ({simulations.length})
            </h4>

            {simulations.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                No historical simulations committed yet. Tune parameters and commit your first snapshot above!
              </div>
            ) : (
              <div className="space-y-2.5">
                {simulations.map((sim) => (
                  <div
                    key={sim.id}
                    className="p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 border-slate-200 hover:border-blue-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">{sim.name}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                          {new Date(sim.timestamp).toLocaleDateString()} {new Date(sim.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {sim.notes && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{sim.notes}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        <span className="text-amber-600 dark:text-amber-400">Solar: {(sim.scenarioParams.solarCapacityMW / 1000).toFixed(1)}GW</span>
                        <span>•</span>
                        <span className="text-emerald-600 dark:text-emerald-400">Wind: {(sim.scenarioParams.windCapacityMW / 1000).toFixed(1)}GW</span>
                        <span>•</span>
                        <span className="text-rose-600 dark:text-rose-400">3h Ramp: {formatMW(sim.summary.threeHourRampMW)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onLoadScenario(sim.scenarioParams);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors bg-white hover:bg-slate-100 text-blue-600 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-blue-400 dark:border-slate-700 shadow-sm self-end sm:self-center"
                    >
                      <RotateCcw className="w-3 h-3" />
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
