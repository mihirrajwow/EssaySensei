import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="header-bar">
      <h1 className="brand-title">Essay Sensei</h1>
      <nav className="nav-links">
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/results">Results</Link>
        <span className="menu-icon" aria-hidden>≡</span>
      </nav>
    </header>
  )
}
