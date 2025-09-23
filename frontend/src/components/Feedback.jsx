import React from 'react'

export default function Feedback({ items = [] }) {
  if (!items.length) {
    return (
      <div className="card">
        <div className="section-title">Feedback</div>
        <p>No feedback available.</p>
      </div>
    )
  }
  return (
    <div className="card">
      <div className="section-title">Feedback</div>
      <ul className="feedback-list">
        {items.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  )
}
