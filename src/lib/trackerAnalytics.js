import { TRACKER_ITEMS } from "../data/trackerData";
import {
  formatDateLabel,
  formatMonthLabel,
  getWeekStartKey,
} from "./trackerDates";
import { createEmptyEntry } from "./trackerStorage";

export function scoreEntry(entry) {
  const states = entry ?? createEmptyEntry();
  const positive = TRACKER_ITEMS.reduce((sum, item) => sum + (states[item.id] === true ? 1 : 0), 0);
  const completed = TRACKER_ITEMS.reduce((sum, item) => sum + (states[item.id] !== null ? 1 : 0), 0);
  const total = TRACKER_ITEMS.length;

  return {
    positive,
    total,
    completed,
    missed: total - positive,
    percentage: Math.round((positive / total) * 100),
  };
}

export function groupEntries(entries, view) {
  const keys = Object.keys(entries).sort();

  if (view === "daily") {
    return keys.map((key) => ({
      id: key,
      label: formatDateLabel(key),
      shortLabel: key.slice(8, 10),
      stats: scoreEntry(entries[key]),
    }));
  }

  if (view === "weekly") {
    const weeklyMap = new Map();

    keys.forEach((key) => {
      const weekKey = getWeekStartKey(key);
      if (!weeklyMap.has(weekKey)) {
        weeklyMap.set(weekKey, []);
      }
      weeklyMap.get(weekKey).push(key);
    });

    return Array.from(weeklyMap.entries()).map(([weekKey, dateKeys]) => {
      const positive = dateKeys.reduce((sum, key) => sum + scoreEntry(entries[key]).positive, 0);
      const total = dateKeys.length * TRACKER_ITEMS.length;

      return {
        id: weekKey,
        label: `Week of ${formatDateLabel(weekKey)}`,
        shortLabel: `W${new Date(`${weekKey}T00:00:00`).getDate()}`,
        stats: buildAggregateStats(positive, total),
      };
    });
  }

  const monthlyMap = new Map();

  keys.forEach((key) => {
    const monthKey = key.slice(0, 7);
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, []);
    }
    monthlyMap.get(monthKey).push(key);
  });

  return Array.from(monthlyMap.entries()).map(([monthKey, dateKeys]) => {
    const positive = dateKeys.reduce((sum, key) => sum + scoreEntry(entries[key]).positive, 0);
    const total = dateKeys.length * TRACKER_ITEMS.length;

    return {
      id: monthKey,
      label: formatMonthLabel(`${monthKey}-01`),
      shortLabel: monthKey.slice(5, 7),
      stats: buildAggregateStats(positive, total),
    };
  });
}

export function calculateAveragePercentage(points) {
  if (!points.length) {
    return 0;
  }

  return Math.round(points.reduce((sum, point) => sum + point.stats.percentage, 0) / points.length);
}

export function findBestDay(entries) {
  const dailyPoints = groupEntries(entries, "daily");
  if (!dailyPoints.length) {
    return null;
  }

  return dailyPoints.reduce((best, point) => {
    if (!best || point.stats.percentage > best.stats.percentage) {
      return point;
    }
    return best;
  }, null);
}

export function calculateStreak(entries) {
  const orderedDates = Object.keys(entries).sort().reverse();
  let run = 0;

  for (const dateKey of orderedDates) {
    if (scoreEntry(entries[dateKey]).positive > 0) {
      run += 1;
    } else {
      break;
    }
  }

  return run;
}

function buildAggregateStats(positive, total) {
  return {
    positive,
    total,
    completed: total,
    missed: total - positive,
    percentage: total ? Math.round((positive / total) * 100) : 0,
  };
}
