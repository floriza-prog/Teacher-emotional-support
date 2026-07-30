import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { WellnessEvent, EventStatus } from "@/lib/data";

const STORAGE_KEY = "aisi-wellness-events";

function loadEvents(): WellnessEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

function saveEvents(events: WellnessEvent[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // ignore
  }
}

interface WellnessContextValue {
  events: WellnessEvent[];
  addEvent: (event: WellnessEvent) => void;
  updateEvent: (id: string, updates: Partial<WellnessEvent>) => void;
  deleteEvent: (id: string) => void;
  setStatus: (id: string, status: EventStatus) => void;
  getEvent: (id: string) => WellnessEvent | undefined;
}

const WellnessContext = createContext<WellnessContextValue | null>(null);

export function WellnessProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<WellnessEvent[]>(loadEvents);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const addEvent = useCallback((event: WellnessEvent) => {
    setEvents((prev) => [event, ...prev]);
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<WellnessEvent>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const setStatus = useCallback((id: string, status: EventStatus) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
  }, []);

  const getEvent = useCallback((id: string) => {
    return events.find((e) => e.id === id);
  }, [events]);

  return (
    <WellnessContext.Provider value={{ events, addEvent, updateEvent, deleteEvent, setStatus, getEvent }}>
      {children}
    </WellnessContext.Provider>
  );
}

export function useWellness() {
  const ctx = useContext(WellnessContext);
  if (!ctx) {
    throw new Error("useWellness must be used within WellnessProvider");
  }
  return ctx;
}
