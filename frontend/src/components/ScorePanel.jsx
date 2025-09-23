import React from 'react'

function ScoreItem({ label, value }) {
  const v = Number.isFinite(value) ? Math.round(value) : 0
  const pct = Math.max(0, Math.min(100, v))
  return (
    <div className="score-item">
      <div className="score-bubble-wrap" style={{ ['--pct']: `${pct}%` }}>
        <div className="score-ring">
          <div className="score-center">{v}</div>
        </div>
      </div>
      <div className="score-label">{label}</div>
    </div>
  )
}

export default function ScorePanel({ result }) {
  const overall = result?.score
  const clarity = result?.categories?.Clarity
  const structure = result?.categories?.Structure
  const grammar = result?.categories?.Grammar
  const feedback = result?.feedback || []

  return (
    <section className="panel">
      <h2 className="panel-title">SCORE and FEEDBACK</h2>
      <div className="score-grid">
        <ScoreItem label="Overall Score" value={overall} />
        <ScoreItem label="Structure Score" value={structure} />
        <ScoreItem label="Clarity Score" value={clarity} />
        <ScoreItem label="Grammar Score" value={grammar} />
      </div>
      <div className="feedback-title">FEEDBACK</div>
      <div className="feedback-box">
        {feedback.length ? (
          <ul className="feedback-list">
            {feedback.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        ) : (
          <div className="feedback-placeholder">No feedback yet.</div>
        )}
      </div>
    </section>
  )
}
