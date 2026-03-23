import { useEffect, useMemo, useState } from "react";
import ItemToggle from "./components/ItemToggle";
import ScoreRing from "./components/ScoreRing";
import TrendBars from "./components/TrendBars";
import { TRACKER_ITEMS, VIEW_OPTIONS } from "./data/trackerData";
import {
  calculateAveragePercentage,
  calculateStreak,
  findBestDay,
  groupEntries,
  scoreEntry,
} from "./lib/trackerAnalytics";
import { buildDateSeries, formatDateLabel, todayKey } from "./lib/trackerDates";
import { createEmptyEntry, readStoredEntries, writeStoredEntries } from "./lib/trackerStorage";

export default function DailyTrackerApp() {
  const [entries, setEntries] = useState(() => readStoredEntries());
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [trendView, setTrendView] = useState("daily");

  useEffect(() => {
    writeStoredEntries(entries);
  }, [entries]);

  const recentDates = useMemo(() => buildDateSeries(7), []);

  const selectedEntry = useMemo(() => {
    return entries[selectedDate] ?? createEmptyEntry();
  }, [entries, selectedDate]);

  const selectedStats = useMemo(() => scoreEntry(selectedEntry), [selectedEntry]);
  const trendPoints = useMemo(() => groupEntries(entries, trendView), [entries, trendView]);

  const averagePercentage = useMemo(() => calculateAveragePercentage(trendPoints), [trendPoints]);
  const bestDay = useMemo(() => findBestDay(entries), [entries]);
  const streak = useMemo(() => calculateStreak(entries), [entries]);

  function handleUpdate(itemId, value) {
    setEntries((currentEntries) => ({
      ...currentEntries,
      [selectedDate]: {
        ...(currentEntries[selectedDate] ?? createEmptyEntry()),
        [itemId]: value,
      },
    }));
  }

  return (
    <div className="tracker-shell">
      <div className="tracker-app">
        <section className="hero-panel">
          <div className="hero-topline">
            <div>
              <p>Daily Tracker</p>
              <span>Positive habits, clear score, visible momentum</span>
            </div>
          </div>

          <div className="hero-main">
            <div>
              <h1>Show up for the day, then watch the trend build.</h1>
              <p className="hero-copy">
                Mark each habit as yes or no. Every yes adds to your daily score, every no counts
                as zero. Your dashboard rolls that into daily, weekly, and monthly progress.
              </p>
            </div>
            <ScoreRing stats={selectedStats} />
          </div>

          <div className="metric-grid">
            <div className="metric-card">
              <span>Today</span>
              <strong>{selectedStats.positive}</strong>
              <small>positive habits</small>
            </div>
            <div className="metric-card">
              <span>Average</span>
              <strong>{averagePercentage}%</strong>
              <small>{trendView} trend average</small>
            </div>
            <div className="metric-card">
              <span>Best Day</span>
              <strong>{bestDay ? `${bestDay.stats.positive}/${TRACKER_ITEMS.length}` : "--"}</strong>
              <small>{bestDay ? bestDay.label : "waiting for data"}</small>
            </div>
            <div className="metric-card">
              <span>Streak</span>
              <strong>{streak}</strong>
              <small>active days in a row</small>
            </div>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Daily Input</p>
                <h2>Update today or any prior day</h2>
              </div>
              <input
                className="date-picker"
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            </div>

            <div className="date-strip">
              {recentDates.map((dateKey) => (
                <button
                  key={dateKey}
                  type="button"
                  className={`date-chip ${selectedDate === dateKey ? "active" : ""}`}
                  onClick={() => setSelectedDate(dateKey)}
                >
                  <span>
                    {new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-IN", {
                      weekday: "short",
                    })}
                  </span>
                  <strong>{dateKey.slice(8, 10)}</strong>
                </button>
              ))}
            </div>

            <div className="panel-summary">
              <div>
                <strong>
                  {selectedStats.positive} / {selectedStats.total}
                </strong>
                <span>Positive score for {formatDateLabel(selectedDate)}</span>
              </div>
              <div>
                <strong>{selectedStats.missed}</strong>
                <span>No or pending items</span>
              </div>
              <div>
                <strong>{selectedStats.completed}</strong>
                <span>Items answered</span>
              </div>
            </div>

            <div className="tracker-list">
              {TRACKER_ITEMS.map((item) => (
                <ItemToggle
                  key={item.id}
                  item={item}
                  value={selectedEntry[item.id]}
                  onChange={(value) => handleUpdate(item.id, value)}
                />
              ))}
            </div>
          </div>

          <div className="side-stack">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Scoring Dashboard</p>
                  <h2>Daily, weekly, monthly trends</h2>
                </div>
                <div className="segmented">
                  {VIEW_OPTIONS.map((view) => (
                    <button
                      key={view}
                      type="button"
                      className={trendView === view ? "active" : ""}
                      onClick={() => setTrendView(view)}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              </div>

              <TrendBars points={trendPoints} view={trendView} />

              <div className="trend-list">
                {trendPoints.slice(-4).reverse().map((point) => (
                  <div className="trend-row" key={point.id}>
                    <div>
                      <strong>{point.label}</strong>
                      <span>
                        {point.stats.positive} positive out of {point.stats.total}
                      </span>
                    </div>
                    <div className="trend-badge">{point.stats.percentage}%</div>
                  </div>
                ))}
                {!trendPoints.length && (
                  <div className="empty-state">
                    <p>Your trend cards will appear here.</p>
                    <span>Start marking habits for today to begin the dashboard.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="panel warm-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Score Logic</p>
                  <h2>Simple and honest</h2>
                </div>
              </div>
              <div className="logic-grid">
                <div className="logic-card">
                  <strong>Yes = 1 point</strong>
                  <span>Every positive habit adds to your score.</span>
                </div>
                <div className="logic-card">
                  <strong>No = 0 point</strong>
                  <span>Negative outcome stays at zero, so the score remains clean.</span>
                </div>
                <div className="logic-card">
                  <strong>16 total habits</strong>
                  <span>The dashboard always scores against the full daily total.</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
