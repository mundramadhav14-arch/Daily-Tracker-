import { STORAGE_KEY, TRACKER_ITEMS } from "../data/trackerData";

export function createEmptyEntry() {
  return TRACKER_ITEMS.reduce((accumulator, item) => {
    accumulator[item.id] = null;
    return accumulator;
  }, {});
}

export function readStoredEntries() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function writeStoredEntries(entries) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
