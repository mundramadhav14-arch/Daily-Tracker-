export default function ScoreRing({ stats }) {
  const angle = Math.round((stats.percentage / 100) * 360);

  return (
    <div
      className="score-ring"
      style={{
        background: `conic-gradient(var(--accent-strong) ${angle}deg, rgba(255,255,255,0.08) ${angle}deg)`,
      }}
    >
      <div className="score-ring-inner">
        <strong>{stats.positive}</strong>
        <span>/ {stats.total}</span>
        <small>{stats.percentage}% score</small>
      </div>
    </div>
  );
}
