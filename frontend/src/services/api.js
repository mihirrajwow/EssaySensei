const API_URL = import.meta.env.VITE_API_URL || '/api'

export async function assessEssay(text) {
  try {
    const res = await fetch(`${API_URL}/grade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
    if (res.ok) {
      return await res.json()
    }
  } catch (_e) {
    // fall back to mock
  }
  const wordCount = text.trim().split(/\s+/).length
  const score = Math.min(100, Math.round(40 + Math.sqrt(wordCount) * 6))
  return {
    score,
    feedback: [
      'Consider adding a clear thesis in the introduction.',
      'Use more varied sentence structures.',
      'Provide stronger evidence to support key points.'
    ],
    categories: {
      Clarity: Math.max(50, score - 10),
      Grammar: Math.max(50, score - 5),
      Structure: Math.max(50, score - 15)
    }
  }
}
