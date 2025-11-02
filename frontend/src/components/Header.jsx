import React from 'react';
import { GraduationCap, Sparkles, Home, BarChart3, Zap, Moon, Sun, Trophy, BookOpen, Target } from 'lucide-react';
import '../styles/Header.css';

function Header({ currentView, onViewChange, darkMode, onToggleDarkMode, userStats }) {
  const navItems = [
    { id: 'home', label: 'Grade Essay', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'features', label: 'Features', icon: Zap }
  ];

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-icon">
            <GraduationCap size={28} />
          </div>
          <div className="logo-text">
            <h1>EssaySensei</h1>
            <span>AI Writing Assistant</span>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="stats-section">
          <div className="stat-pill">
            <Trophy size={18} />
            <span>{userStats?.averageScore || 0}</span>
          </div>
          <div className="stat-pill">
            <BookOpen size={18} />
            <span>{userStats?.totalEssays || 0}</span>
          </div>
          <div className="stat-pill">
            <Target size={18} />
            <span>{userStats?.streak || 0}</span>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="controls-section">
          <nav className="nav-menu">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={`nav-item ${currentView === id ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <button 
            onClick={onToggleDarkMode}
            className="theme-toggle"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;