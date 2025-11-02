import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, Zap, Upload, Type, Clock, Target, BookOpen, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import '../styles/EssayForm.css';

function EssayForm({ onSubmit, isLoading }) {
  const [essay, setEssay] = useState('');
  const [essayTitle, setEssayTitle] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [focusTime, setFocusTime] = useState(0);
  const [writingStreak, setWritingStreak] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const textareaRef = useRef(null);
  const startTimeRef = useRef(null);
  const streakIntervalRef = useRef(null);

  const writingTips = [
    "💡 Start with a strong thesis statement",
    "📝 Use topic sentences for each paragraph",
    "🔗 Connect ideas with transition words",
    "📚 Support arguments with evidence",
    "✨ Vary your sentence structure",
    "🎯 Stay focused on your main argument",
    "📖 Read your work aloud for flow",
    "⚡ End with a powerful conclusion"
  ];

  useEffect(() => {
    startTimeRef.current = Date.now();
    
    const focusInterval = setInterval(() => {
      if (essay.length > 0) {
        setFocusTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    }, 1000);

    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % writingTips.length);
    }, 5000);

    return () => {
      clearInterval(focusInterval);
      clearInterval(tipInterval);
    };
  }, [essay, writingTips.length]);

  useEffect(() => {
    if (essay.length > 0) {
      streakIntervalRef.current = setInterval(() => {
        setWritingStreak(prev => prev + 1);
      }, 10000); // Increase streak every 10 seconds of writing
    } else {
      clearInterval(streakIntervalRef.current);
    }

    return () => clearInterval(streakIntervalRef.current);
  }, [essay]);

  const handleEssayChange = (e) => {
    const text = e.target.value;
    setEssay(text);
    
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharCount(text.length);
    setEstimatedTime(Math.ceil(words.length / 200));
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 600) + 'px';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (essay.trim() && !isLoading) {
      onSubmit(essay.trim(), essayTitle || 'Untitled Essay');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEssay(event.target.result);
        handleEssayChange({ target: { value: event.target.result } });
      };
      reader.readAsText(file);
    }
  };

  const isSubmitDisabled = !essay.trim() || isLoading || wordCount < 50;

  const getWordCountStatus = () => {
    if (wordCount < 50) return 'insufficient';
    if (wordCount < 150) return 'minimal';
    if (wordCount < 300) return 'good';
    if (wordCount < 500) return 'excellent';
    if (wordCount < 800) return 'outstanding';
    return 'exceptional';
  };

  const getProgressPercentage = () => {
    return Math.min((wordCount / 500) * 100, 100);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWordCountMessage = () => {
    const status = getWordCountStatus();
    const messages = {
      insufficient: "Keep writing! Minimum 50 words needed",
      minimal: "Good start! Try to reach 150+ words",
      good: "Great progress! Aiming for 300+ is ideal",
      excellent: "Excellent length! Perfect for analysis",
      outstanding: "Outstanding! Comprehensive coverage",
      exceptional: "Exceptional! Very thorough analysis"
    };
    return messages[status];
  };

  return (
    <div className="essay-form-container">
      <div className="form-header">
        <div className="form-title">
          <div className="title-icon">
            <FileText size={36} className="form-icon" />
            <Sparkles size={20} className="sparkle-icon" />
            <div className="icon-glow"></div>
          </div>
          <div className="title-content">
            <h2>Submit Your Essay</h2>
            <p className="form-subtitle">Get comprehensive AI-powered analysis and personalized feedback</p>
          </div>
        </div>

        <div className="stats-bar">
          <div className="stat-item">
            <Type size={16} />
            <span>{wordCount} words</span>
          </div>
          <div className="stat-item">
            <Target size={16} />
            <span>{charCount} chars</span>
          </div>
          <div className="stat-item">
            <Clock size={16} />
            <span>{estimatedTime} min read</span>
          </div>
          {focusTime > 0 && (
            <div className="stat-item focus-time">
              <span>⏱️ {formatTime(focusTime)}</span>
            </div>
          )}
          {writingStreak > 0 && (
            <div className="stat-item streak">
              <span>🔥 {writingStreak}</span>
            </div>
          )}
        </div>
      </div>

      {/* Writing Tips */}
      <div className="tips-section">
        <div className="tip-card">
          <div className="tip-content">
            <span className="tip-text">{writingTips[tipIndex]}</span>
          </div>
          <div className="tip-progress">
            {writingTips.map((_, index) => (
              <div 
                key={index} 
                className={`progress-dot ${index === tipIndex ? 'active' : ''}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="essay-form">
        <div className="input-section">
          <div className="title-input-container">
            <input
              type="text"
              value={essayTitle}
              onChange={(e) => setEssayTitle(e.target.value)}
              placeholder="Enter a compelling essay title..."
              className="essay-title-input"
              disabled={isLoading}
            />
            <div className="input-decoration"></div>
          </div>

          <div className="textarea-container">
            <textarea
              ref={textareaRef}
              value={essay}
              onChange={handleEssayChange}
              placeholder="Begin writing your masterpiece here...

✨ Writing Tips:
• Structure your essay with clear introduction, body, and conclusion
• Use specific examples to support your arguments
• Vary your sentence lengths for better flow
• Proofread for grammar and clarity before submitting

Your ideas matter - let them shine! 🌟"
              className={`essay-textarea ${getWordCountStatus()}`}
              rows={20}
              disabled={isLoading}
            />
            
            <div className="textarea-overlay">
              <div className={`word-counter ${getWordCountStatus()}`}>
                <div className="counter-ring">
                  <svg className="progress-circle" width="80" height="80">
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      opacity="0.2"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 32}`}
                      strokeDashoffset={`${2 * Math.PI * 32 * (1 - getProgressPercentage() / 100)}`}
                      transform="rotate(-90 40 40)"
                      className="progress-path"
                    />
                  </svg>
                  <div className="counter-content">
                    <span className="word-count">{wordCount}</span>
                    <span className="word-label">words</span>
                  </div>
                </div>
              </div>

              <div className="word-status">
                <div className={`status-indicator ${wordCount >= 50 ? 'success' : 'warning'}`}>
                  {wordCount >= 50 ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                </div>
                <span className="status-message">{getWordCountMessage()}</span>
              </div>
            </div>
          </div>

          <div className="upload-section">
            <label htmlFor="file-upload" className="upload-button">
              <Upload size={20} />
              <span>Upload Text File</span>
              <input
                id="file-upload"
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                disabled={isLoading}
              />
            </label>
            <div className="upload-hint">
              <span>Supported: .txt files only</span>
            </div>
          </div>
        </div>

        <div className="submit-section">
          <button
            type="submit"
            className={`submit-button ${isSubmitDisabled ? 'disabled' : ''}`}
            disabled={isSubmitDisabled}
          >
            <div className="button-content">
              {isLoading ? (
                <>
                  <div className="loading-spinner">
                    <div className="spinner-ring"></div>
                  </div>
                  <span>Analyzing Your Essay...</span>
                </>
              ) : (
                <>
                  <Zap size={28} />
                  <span>Get My Grade</span>
                </>
              )}
            </div>
            <div className="button-waves">
              <div className="wave wave-1"></div>
              <div className="wave wave-2"></div>
              <div className="wave wave-3"></div>
            </div>
          </button>
          
          {isLoading && (
            <div className="loading-messages">
              <div className="loading-steps">
                <div className="step active">🧠 Analyzing content structure and depth...</div>
                <div className="step">📝 Evaluating writing quality and style...</div>
                <div className="step">🎯 Generating personalized feedback...</div>
                <div className="step">✨ Calculating your comprehensive grade...</div>
                <div className="step">🎉 Preparing detailed insights...</div>
              </div>
              <div className="loading-progress">
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
                <div className="progress-text">
                  <span>Processing your essay...</span>
                </div>
              </div>
            </div>
          )}

          {!isLoading && (
            <div className="form-footer">
              <div className="quality-badges">
                <div className="badge">
                  <BookOpen size={16} />
                  <span>Comprehensive Analysis</span>
                </div>
                <div className="badge">
                  <Target size={16} />
                  <span>Detailed Feedback</span>
                </div>
                <div className="badge">
                  <Sparkles size={16} />
                  <span>AI-Powered Insights</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default EssayForm;