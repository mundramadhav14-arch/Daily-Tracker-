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
      <div className="tracker-phone">
        <header className="app-header">
          <div>
            <p className="eyebrow">Daily Tracker</p>
            <h1>Today&apos;s score</h1>
          </div>
          <div className="header-pill">{formatDateLabel(selectedDate)}</div>
        </header>

        <section className="hero-panel">
          <div className="hero-main">
            <div className="hero-copy-block">
              <span className="hero-kicker">Build momentum one yes at a time</span>
              <p className="hero-copy">
                Tap each habit for today. Every yes adds one point. Every no stays at zero.
              </p>
            </div>
            <ScoreRing stats={selectedStats} />
          </div>

          <div className="metric-scroll">
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

        <section className="panel compact-panel">
          <div className="panel-header mobile-header">
            <div>
              <p className="eyebrow">Pick day</p>
              <h2>Daily check-in</h2>
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

          <div className="panel-summary stacked-summary">
            <div>
              <strong>
                {selectedStats.positive} / {selectedStats.total}
              </strong>
              <span>Positive score for {formatDateLabel(selectedDate)}</span>
            </div>
            <div>
              <strong>{selectedStats.completed}</strong>
              <span>Items answered</span>
            </div>
            <div>
              <strong>{selectedStats.missed}</strong>
              <span>No or still pending</span>
            </div>
          </div>
        </section>

        <section className="panel compact-panel">
          <div className="panel-header mobile-header">
            <div>
              <p className="eyebrow">Checklist</p>
              <h2>Mark your habits</h2>
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
        </section>

        <section className="panel compact-panel">
          <div className="panel-header mobile-header">
            <div>
              <p className="eyebrow">Trends</p>
              <h2>Progress over time</h2>
            </div>
          </div>

          <div className="segmented full-width">
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
        </section>

        <section className="panel warm-panel compact-panel">
          <div className="panel-header mobile-header">
            <div>
              <p className="eyebrow">Score Logic</p>
              <h2>Simple and honest</h2>
            </div>
          </div>

          <div className="logic-grid mobile-logic">
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
        </section>
      </div>
    </div>
  );
}
