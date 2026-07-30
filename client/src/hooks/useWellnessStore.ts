import { useState, useCallback, useEffect } from "react";
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

export function useWellnessStore() {
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

  return { events, addEvent, updateEvent, deleteEvent, setStatus };
}
