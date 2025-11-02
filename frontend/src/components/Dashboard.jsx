import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Calendar, BookOpen, Award, Target, Filter, Search, Trash2, Download, Star, Clock, Zap, ArrowUp, ArrowDown, Trophy, Medal, Flame } from 'lucide-react';
import '../styles/Dashboard.css';

function Dashboard({ history, userStats, onViewEssay, onClearData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterBy, setFilterBy] = useState('all');
  const [showInsights, setShowInsights] = useState(true);

  const getScoreColor = (score) => {
    if (score >= 95) return 'excellent';
    if (score >= 85) return 'good';
    if (score >= 75) return 'average';
    return 'needs-improvement';
  };

  const getGradeLevel = (score) => {
    if (score >= 97) return 'A+';
    if (score >= 93) return 'A';
    if (score >= 90) return 'A-';
    if (score >= 87) return 'B+';
    if (score >= 83) return 'B';
    if (score >= 80) return 'B-';
    if (score >= 77) return 'C+';
    if (score >= 73) return 'C';
    if (score >= 70) return 'C-';
    return 'D';
  };

  // Advanced analytics
  const analytics = useMemo(() => {
    if (history.length === 0) return null;

    const scores = history.map(essay => essay.score);
    const recentScores = history.slice(0, 5).map(essay => essay.score);
    const previousScores = history.slice(5, 10).map(essay => essay.score);
    
    const trend = recentScores.length > 0 && previousScores.length > 0 
      ? (recentScores.reduce((a, b) => a + b, 0) / recentScores.length) - 
        (previousScores.reduce((a, b) => a + b, 0) / previousScores.length)
      : 0;

    const bestScore = Math.max(...scores);
    const worstScore = Math.min(...scores);
    const consistency = 100 - (Math.sqrt(scores.reduce((sum, score) => sum + Math.pow(score - userStats.averageScore, 2), 0) / scores.length) / userStats.averageScore * 100);

    return {
      trend: Math.round(trend * 10) / 10,
      bestScore,
      worstScore,
      consistency: Math.max(0, Math.round(consistency))
    };
  }, [history, userStats.averageScore]);

  const filteredHistory = useMemo(() => {
    return history
      .filter(essay => {
        const matchesSearch = essay.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterBy === 'all' || getScoreColor(essay.score) === filterBy;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'score':
            return b.score - a.score;
          case 'title':
            return a.title.localeCompare(b.title);
          case 'words':
            return b.wordCount - a.wordCount;
          default:
            return b.id - a.id;
        }
      });
  }, [history, searchTerm, filterBy, sortBy]);

  const exportData = () => {
    const dataStr = JSON.stringify({
      userStats,
      essays: history,
      exportDate: new Date().toISOString()
    }, null, 2);
    
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EssaySensei_Data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (history.length === 0) {
    return (
      <div className="dashboard-container">
        <div className="empty-state">
          <div className="empty-icon">
            <BarChart3 size={80} />
          </div>
          <h2>Welcome to Your Dashboard!</h2>
          <p>Start grading essays to unlock powerful analytics and track your writing progress!</p>
          <div className="empty-features">
            <div className="feature-preview">
              <Award size={24} />
              <span>Performance Analytics</span>
            </div>
            <div className="feature-preview">
              <TrendingUp size={24} />
              <span>Progress Tracking</span>
            </div>
            <div className="feature-preview">
              <Target size={24} />
              <span>Improvement Insights</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h2 className="dashboard-title">
            <BarChart3 className="title-icon" />
            Writing Analytics Dashboard
          </h2>
          <p className="dashboard-subtitle">
            Track your progress, analyze your performance, and unlock your writing potential
          </p>
        </div>
        
        <div className="header-actions">
          <button onClick={exportData} className="action-btn export-btn">
            <Download size={18} />
            <span>Export Data</span>
          </button>
          <button onClick={onClearData} className="action-btn danger-btn">
            <Trash2 size={18} />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card primary">
          <div className="stat-icon">
            <Trophy size={36} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{userStats.averageScore}</span>
            <span className="stat-label">Average Score</span>
            <div className="stat-badge">
              {getGradeLevel(userStats.averageScore)}
            </div>
          </div>
          <div className="stat-trend">
            {analytics && analytics.trend !== 0 && (
              <>
                {analytics.trend > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <span className={analytics.trend > 0 ? 'positive' : 'negative'}>
                  {Math.abs(analytics.trend).toFixed(1)} pts
                </span>
              </>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <BookOpen size={36} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{userStats.totalEssays}</span>
            <span className="stat-label">Essays Completed</span>
          </div>
          <div className="stat-detail">
            <span>{userStats.totalWords.toLocaleString()} words total</span>
          </div>
        </div>

        <div className="stat-card streak">
          <div className="stat-icon">
            <Flame size={36} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{userStats.streak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
          <div className="stat-detail">
            <span>Keep it up! 🔥</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={36} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{userStats.totalReadingTime}</span>
            <span className="stat-label">Reading Time (min)</span>
          </div>
          <div className="stat-detail">
            <span>{Math.round(userStats.totalReadingTime / 60)}h total</span>
          </div>
        </div>

        {analytics && (
          <>
            <div className="stat-card best-score">
              <div className="stat-icon">
                <Medal size={36} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{analytics.bestScore}</span>
                <span className="stat-label">Best Score</span>
              </div>
              <div className="stat-badge">
                {getGradeLevel(analytics.bestScore)}
              </div>
            </div>

            <div className="stat-card consistency">
              <div className="stat-icon">
                <Target size={36} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{analytics.consistency}%</span>
                <span className="stat-label">Consistency</span>
              </div>
              <div className="stat-detail">
                <span>Performance stability</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Insights Panel */}
      {showInsights && analytics && (
        <div className="insights-panel">
          <div className="panel-header">
            <h3>
              <Zap size={24} />
              Performance Insights
            </h3>
            <button 
              onClick={() => setShowInsights(false)}
              className="close-btn"
            >
              ×
            </button>
          </div>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-icon">
                <TrendingUp size={24} />
              </div>
              <div className="insight-content">
                <h4>Writing Trend</h4>
                <p>
                  {analytics.trend > 0 
                    ? `You've improved by ${analytics.trend.toFixed(1)} points recently! 📈` 
                    : analytics.trend < 0 
                    ? `Focus area: recent dip of ${Math.abs(analytics.trend).toFixed(1)} points 📉`
                    : 'Maintaining consistent performance 📊'
                  }
                </p>
              </div>
            </div>
            
            <div className="insight-card">
              <div className="insight-icon">
                <Target size={24} />
              </div>
              <div className="insight-content">
                <h4>Consistency Score</h4>
                <p>
                  {analytics.consistency > 80 
                    ? 'Excellent consistency in your writing quality! 🎯'
                    : analytics.consistency > 60
                    ? 'Good stability with room for more consistency 📈'
                    : 'Work on maintaining consistent quality across essays 🎯'
                  }
                </p>
              </div>
            </div>
            
            <div className="insight-card">
              <div className="insight-icon">
                <Award size={24} />
              </div>
              <div className="insight-content">
                <h4>Achievement</h4>
                <p>
                  {userStats.streak >= 7 
                    ? 'Amazing! Week-long writing streak! 🔥'
                    : userStats.totalEssays >= 10
                    ? `Great milestone: ${userStats.totalEssays} essays completed! 🎉`
                    : 'Keep writing to unlock achievements! ⭐'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Dashboard Controls */}
      <div className="dashboard-controls">
        <div className="search-section">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search your essays..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-controls">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="control-select"
          >
            <option value="date">📅 Recent First</option>
            <option value="score">🏆 Highest Score</option>
            <option value="title">📝 Title A-Z</option>
            <option value="words">📊 Word Count</option>
          </select>

          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="control-select"
          >
            <option value="all">All Grades</option>
            <option value="excellent">🌟 Excellent (95+)</option>
            <option value="good">👏 Good (85-94)</option>
            <option value="average">📈 Average (75-84)</option>
            <option value="needs-improvement">📚 Needs Work (&lt;75)</option>
          </select>
        </div>
      </div>

      {/* Enhanced Essays Grid */}
      <div className="essays-grid">
        {filteredHistory.map((essay) => (
          <div
            key={essay.id}
            className={`essay-card ${getScoreColor(essay.score)}`}
            onClick={() => onViewEssay(essay)}
          >
            <div className="essay-header">
              <div className="essay-title-section">
                <h3 className="essay-title">{essay.title}</h3>
                <span className="essay-date">{new Date(essay.id).toLocaleDateString()}</span>
              </div>
              <div className={`score-badge ${getScoreColor(essay.score)}`}>
                <span className="score">{essay.score}</span>
                <span className="grade">{getGradeLevel(essay.score)}</span>
              </div>
            </div>

            <div className="essay-preview">
              <p>{essay.essay}</p>
            </div>

            <div className="essay-meta">
              <div className="meta-item">
                <BookOpen size={14} />
                <span>{essay.wordCount} words</span>
              </div>
              <div className="meta-item">
                <Clock size={14} />
                <span>{essay.readingTime} min read</span>
              </div>
              <div className="meta-item">
                <Star size={14} />
                <span>{essay.feedback.strengths.length} strengths</span>
              </div>
            </div>

            <div className="essay-breakdown">
              <div className="breakdown-mini">
                {Object.entries(essay.breakdown).map(([category, score]) => (
                  <div key={category} className="mini-bar" title={`${category}: ${score}/25`}>
                    <div
                      className="mini-fill"
                      style={{ height: `${(score / 25) * 100}%` }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-glow"></div>
          </div>
        ))}
      </div>

      {filteredHistory.length === 0 && (
        <div className="no-results">
          <Filter size={56} />
          <h3>No essays match your filters</h3>
          <p>Try adjusting your search terms or filter criteria to find your essays</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;