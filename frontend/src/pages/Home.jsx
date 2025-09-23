import React, { useState } from 'react'
import { assessEssay } from '../services/api.js'
import EssayInput from '../components/EssayInput.jsx'
import ScorePanel from '../components/ScorePanel.jsx'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  async function handleSubmit(text, stats) {
    setLoading(true)
    try {
      const inputJson = { text, stats }
      const output = await assessEssay(inputJson)
      setResult(output)
    } catch (_e) {
      setResult({ score: 0, feedback: ['Failed to grade essay.'], categories: {} })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container dashboard-grid">
      <div className="left-pane">
        <EssayInput onSubmit={handleSubmit} isLoading={loading} />
      </div>
      <div className="right-pane">
        <ScorePanel result={result} />
      </div>
    </main>
  )
}
