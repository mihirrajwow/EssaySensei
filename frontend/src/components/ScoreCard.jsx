import React from 'react'

export default function ScoreCard({ score = 0, category = 'Overall' }) {
  return (
    <div className=\"card score-wrapper\">
      <div className=\"score-badge\">{score}</div>
      <div>
        <div className=\"section-title\">{category} Score</div>
        <div>{score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Fair' : 'Needs Improvement'}</div>
      </div>
    </div>
  )
}