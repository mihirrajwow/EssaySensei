import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import ScoreCard from '../components/ScoreCard.jsx'
import Feedback from '../components/Feedback.jsx'

export default function Results() {
  const { state } = useLocation()
  const result = state?.result
  if (!result) {
    return (
      <main className="container">
        <div className="card">
          <div className="section-title">No results</div>
          <p>Go back and submit an essay.</p>
          <Link className="primary-btn" to="/">Go Home</Link>
        </div>
      </main>
    )
  }
  const categories = result.categories || {}
  return (
    <main className="container">
      <div className="grid">
        <ScoreCard score={Math.round(result.score)} category="Overall" />
        <Feedback items={result.feedback || []} />
      </div>
      {!!Object.keys(categories).length && (
        <div className="grid mt-16">
          {Object.entries(categories).map(([name, score]) => (
            <ScoreCard key={name} score={Math.round(score)} category={name} />
          ))}
        </div>
      )}
    </main>
  )
}
