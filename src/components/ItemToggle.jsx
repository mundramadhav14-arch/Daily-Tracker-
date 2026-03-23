export default function ItemToggle({ item, value, onChange }) {
  return (
    <article className="tracker-item">
      <div className="tracker-copy">
        <p className="tracker-category">{item.category}</p>
        <h3>{item.label}</h3>
        <span>{item.detail}</span>
      </div>
      <div className="tracker-actions" role="group" aria-label={item.label}>
        <button
          type="button"
          className={`answer-button yes ${value === true ? "active" : ""}`}
          onClick={() => onChange(true)}
        >
          Yes
        </button>
        <button
          type="button"
          className={`answer-button no ${value === false ? "active" : ""}`}
          onClick={() => onChange(false)}
        >
          No
        </button>
      </div>
    </article>
  );
}
