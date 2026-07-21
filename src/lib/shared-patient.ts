// Shared patient context between Khám bệnh (B0) and Kê đơn (Hồ sơ).
// Persisted in localStorage + cross-tab via the "storage" event.
import { useEffect, useRef } from "react";

export type SharedPatient = {
  name: string;
  year: string;
  gender: string;
  address: string;
  date: string;
  chief: string;
};

export const SHARED_PATIENT_KEY = "tradmed:patient:current";
const EVT = "tradmed:patient:changed";

export function readSharedPatient(): Partial<SharedPatient> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SHARED_PATIENT_KEY);
    return raw ? (JSON.parse(raw) as Partial<SharedPatient>) : null;
  } catch {
    return null;
  }
}

export function writeSharedPatient(p: Partial<SharedPatient>) {
  if (typeof window === "undefined") return;
  try {
    const prev = readSharedPatient() ?? {};
    const next = { ...prev, ...p };
    localStorage.setItem(SHARED_PATIENT_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(EVT, { detail: next }));
  } catch {
    /* ignore */
  }
}

export function clearSharedPatient() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SHARED_PATIENT_KEY);
  window.dispatchEvent(new CustomEvent(EVT, { detail: null }));
}

/** Subscribe to patient changes from the other tab/page. */
export function useSharedPatient(onChange: (p: Partial<SharedPatient> | null) => void) {
  const cb = useRef(onChange);
  cb.current = onChange;
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== SHARED_PATIENT_KEY) return;
      try {
        cb.current(e.newValue ? JSON.parse(e.newValue) : null);
      } catch {
        /* ignore */
      }
    };
    const handleCustom = (e: Event) => {
      const detail = (e as CustomEvent).detail as Partial<SharedPatient> | null;
      cb.current(detail);
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener(EVT, handleCustom as EventListener);
    // initial hydrate
    cb.current(readSharedPatient());
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(EVT, handleCustom as EventListener);
    };
  }, []);
}
