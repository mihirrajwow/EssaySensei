import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assessEssay } from '../services/api.js'
import EssayInput from '../components/EssayInput.jsx'

export default function Home() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(text) {
    setLoading(true)
    try {
      const result = await assessEssay(text)
      navigate('/results', { state: { input: text, result } })
    } catch (e) {
      navigate('/results', { state: { input: text, result: { score: 0, feedback: ['Failed to grade essay.'], categories: {} } } })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <EssayInput onSubmit={handleSubmit} isLoading={loading} />
    </main>
  )
}
