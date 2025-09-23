import React, { useMemo, useState } from 'react'

function computeStats(value) {
  const chars = value.length
  const words = (value.trim().match(/\S+/g) || []).length
  const lines = value ? value.split(/\r?\n/).length : 0
  const paras = value.trim() ? value.trim().split(/\n{2,}/).length : 0
  return { characters: chars, words, lines, paragraphs: paras }
}

export default function EssayInput({ onSubmit, isLoading }) {
  const [text, setText] = useState('')
  const stats = useMemo(() => computeStats(text), [text])
  const canSubmit = text.trim().length >= 50

  return (
    <div className="card">
      <textarea
        className="textarea input-area"
        placeholder="Enter your text here"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="stats-strip">
        <span>words: {stats.words}</span>
        <span>characters: {stats.characters}</span>
        <span>lines: {stats.lines}</span>
        <span>paragraphs: {stats.paragraphs}</span>
      </div>
      <div className="action-row">
        <button className="secondary-btn" type="button" onClick={() => setText('')} disabled={!text}>
          Clear
        </button>
        <button className="primary-btn" type="button" onClick={() => onSubmit(text, stats)} disabled={!canSubmit || isLoading}>
          {isLoading ? 'Grading…' : 'Grade Essay'}
        </button>
      </div>
    </div>
  )
}
