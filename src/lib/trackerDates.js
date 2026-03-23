export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDateLabel(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

export function formatMonthLabel(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export function buildDateSeries(days) {
  const dates = [];
  const base = new Date();

  for (let index = days - 1; index >= 0; index -= 1) {
    const nextDate = new Date(base);
    nextDate.setDate(base.getDate() - index);
    dates.push(nextDate.toISOString().slice(0, 10));
  }

  return dates;
}

export function getWeekStartKey(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  const monday = new Date(date);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diff);
  return monday.toISOString().slice(0, 10);
}
