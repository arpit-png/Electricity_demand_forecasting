import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  Timestamp,
  type Firestore 
} from "firebase/firestore";
import type { ScenarioParams, GridSummary } from "./forecasting-engine";

export interface SimulationRecord {
  id?: string;
  name: string;
  timestamp: string;
  scenarioParams: ScenarioParams;
  summary: GridSummary;
  notes?: string;
  author: string;
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let isFirebaseConfigured = false;

// Verify that active production credentials are provided
if (
  typeof window !== "undefined" &&
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes("your_api_key")
) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    isFirebaseConfigured = true;
  } catch (err) {
    console.warn("Firebase initialization skipped, running in resilient client mode", err);
    isFirebaseConfigured = false;
  }
}

const LOCAL_STORAGE_KEY = "grid_duck_curve_simulations_v1";

/**
 * Fallback local store when Firebase is not yet bound to a live project
 */
function getLocalSimulations(): SimulationRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      // Seed initial sample historical runs
      const initial: SimulationRecord[] = [
        {
          id: "sim-seed-1",
          name: "CAISO Summer Solstice Stress Test",
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          scenarioParams: {
            solarCapacityMW: 16500,
            windCapacityMW: 4500,
            cloudCoverPercent: 8,
            temperatureCelsius: 38,
            evAdoptionFactor: 1.25,
            batteryCapacityMWh: 15000,
            batteryMaxPowerMW: 4000,
            scenarioType: "heatwave",
          },
          summary: {
            peakGrossDemand: 34200,
            peakGrossHour: "18:00",
            minNetDemand: 11400,
            minNetHour: "12:00",
            peakNetDemand: 29800,
            peakNetHour: "19:00",
            maxRampRateMW: 3850,
            threeHourRampMW: 13400,
            backupPowerNeededMW: 4200,
            curtailmentMW: 0,
            batteryEnergyAbsorbedMWh: 14200,
            batteryEnergyDischargedMWh: 14200,
            overallStatus: "CRITICAL_DISPATCH_REQUIRED",
          },
          notes: "Deep duck curve observed with 13.4 GW 3-hour evening ramp. Battery storage absorbed 14.2 GWh of midday solar and discharged during the 19:00 peak, mitigating major blackout risks.",
          author: "Autonomous Dispatch Engine",
        },
        {
          id: "sim-seed-2",
          name: "Monsoon Afternoon Cloud Surge",
          timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
          scenarioParams: {
            solarCapacityMW: 14500,
            windCapacityMW: 7200,
            cloudCoverPercent: 75,
            temperatureCelsius: 26,
            evAdoptionFactor: 1.0,
            batteryCapacityMWh: 12000,
            batteryMaxPowerMW: 3500,
            scenarioType: "cloud-storm",
          },
          summary: {
            peakGrossDemand: 28400,
            peakGrossHour: "18:00",
            minNetDemand: 18900,
            minNetHour: "13:00",
            peakNetDemand: 23600,
            peakNetHour: "20:00",
            maxRampRateMW: 1420,
            threeHourRampMW: 3800,
            backupPowerNeededMW: 850,
            curtailmentMW: 0,
            batteryEnergyAbsorbedMWh: 0,
            batteryEnergyDischargedMWh: 3200,
            overallStatus: "STABLE",
          },
          notes: "Heavy cloud attenuation flattened the midday solar belly; wind gusting in evening lessened the net ramp slope.",
          author: "Grid Reliability Telemetry",
        },
      ];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading local simulations", err);
    return [];
  }
}

/**
 * Saves a simulation run to Firestore or Local Storage
 */
export async function saveSimulation(record: Omit<SimulationRecord, "id">): Promise<SimulationRecord> {
  const newRecord: SimulationRecord = {
    ...record,
    id: `sim-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, "simulations"), {
        ...record,
        createdAt: Timestamp.now(),
      });
      newRecord.id = docRef.id;
    } catch (err) {
      console.warn("Firestore save failed, falling back to local storage", err);
    }
  }

  // Always keep local store in sync
  if (typeof window !== "undefined") {
    try {
      const list = getLocalSimulations();
      list.unshift(newRecord);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list.slice(0, 30)));
    } catch (err) {
      console.error("Local storage save error", err);
    }
  }

  return newRecord;
}

/**
 * Retrieves simulations from Firestore or fallback store
 */
export async function getSimulations(): Promise<{
  records: SimulationRecord[];
  source: "firestore" | "local-resilient";
}> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "simulations"), orderBy("createdAt", "desc"), limit(20));
      const querySnapshot = await getDocs(q);
      const records: SimulationRecord[] = [];
      querySnapshot.forEach((doc) => {
        records.push({ id: doc.id, ...(doc.data() as Omit<SimulationRecord, "id">) });
      });
      if (records.length > 0) {
        return { records, source: "firestore" };
      }
    } catch (err) {
      console.warn("Firestore query failed, using local store", err);
    }
  }

  return {
    records: getLocalSimulations(),
    source: "local-resilient",
  };
}

export function isFirebaseConnected(): boolean {
  return isFirebaseConfigured;
}
