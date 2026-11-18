import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMW(val: number): string {
  if (Math.abs(val) >= 1000) {
    return `${(val / 1000).toFixed(2)} GW`;
  }
  return `${Math.round(val).toLocaleString()} MW`;
}

export function formatMWh(val: number): string {
  if (Math.abs(val) >= 1000) {
    return `${(val / 1000).toFixed(2)} GWh`;
  }
  return `${Math.round(val).toLocaleString()} MWh`;
}

export function formatPercent(val: number): string {
  return `${(val * 100).toFixed(1)}%`;
}

export function formatCurrency(val: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
}
