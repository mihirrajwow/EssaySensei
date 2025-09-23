import React, { useState } from 'react'

export default function EssayInput({ onSubmit, isLoading }) {
  const [text, setText] = useState('')
  const canSubmit = text.trim().length >= 50

  return (
    <div className=\"card\">
      <textarea
        className=\"textarea\"
        placeholder=\"Paste or write your essay here...\"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className=\"action-row\">
        <button className=\"secondary-btn\" type=\"button\" onClick={() => setText('')} disabled={!text}>
          Clear
        </button>
        <button className=\"primary-btn\" type=\"button\" onClick={() => onSubmit(text)} disabled={!canSubmit || isLoading}>
          {isLoading ? 'Grading…' : 'Grade Essay'}
        </button>
      </div>
    </div>
  )
}