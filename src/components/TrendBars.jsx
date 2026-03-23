export default function TrendBars({ points, view }) {
  if (!points.length) {
    return (
      <div className="empty-state compact">
        <p>No history yet.</p>
        <span>Update a few days to unlock your {view} trend.</span>
      </div>
    );
  }

  const visiblePoints = points.slice(-10);
  const maxPercentage = Math.max(...visiblePoints.map((point) => point.stats.percentage), 1);

  return (
    <div className="trend-bars">
      {visiblePoints.map((point) => (
        <div className="trend-bar-column" key={point.id}>
          <span className="trend-value">{point.stats.percentage}%</span>
          <div className="trend-bar-track">
            <div
              className="trend-bar-fill"
              style={{ height: `${(point.stats.percentage / maxPercentage) * 100}%` }}
            />
          </div>
          <span className="trend-label">{point.shortLabel}</span>
        </div>
      ))}
    </div>
  );
}
