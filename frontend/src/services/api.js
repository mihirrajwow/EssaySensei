const API_URL = import.meta.env.VITE_API_URL || '/api'

export async function assessEssay(input) {
  const payload = typeof input === 'string' ? { text: input } : input
  try {
    const res = await fetch(`${API_URL}/grade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      return await res.json()
    }
  } catch (_e) {
    // fall back to mock
  }
  const text = payload.text || ''
  const stats = payload.stats || {}
  const words = stats.words ?? (text.trim().match(/\S+/g) || []).length
  const paragraphs = stats.paragraphs ?? (text.trim() ? text.trim().split(/\n{2,}/).length : 0)
  const sentences = (text.split(/[.!?]+/).filter(Boolean)).length || 1
  const avgSentence = words / sentences

  let clarity = Math.max(40, Math.min(100, 100 - (avgSentence - 14) * 4))
  let structure = Math.max(40, Math.min(100, 60 + paragraphs * 8))
  let grammar = Math.max(40, Math.min(100, 70 - (text.match(/\b(?:teh|recieve|occured)\b/gi)?.length || 0) * 5))
  const overall = Math.round((clarity + structure + grammar) / 3)

  return {
    score: overall,
    feedback: [
      'Open with a concise thesis and ensure each paragraph supports it.',
      'Vary sentence lengths to improve readability and flow.',
      'Proofread for minor grammatical slips and subject–verb agreement.'
    ],
    categories: {
      Clarity: Math.round(clarity),
      Structure: Math.round(structure),
      Grammar: Math.round(grammar)
    }
  }
}
