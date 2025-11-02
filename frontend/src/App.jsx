import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import EssayForm from './components/EssayForm.jsx';
import Results from './components/Results.jsx';
import Dashboard from './components/Dashboard.jsx';
import Features from './components/Features.jsx';
import './styles/App.css';

function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [essayHistory, setEssayHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const [userStats, setUserStats] = useState({
    totalEssays: 0,
    averageScore: 0,
    totalWords: 0,
    totalReadingTime: 0,
    improvementRate: 0,
    streak: 0,
    lastSubmission: null
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('essayHistory');
    const savedTheme = localStorage.getItem('darkMode');
    const savedStats = localStorage.getItem('userStats');
    
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setEssayHistory(parsedHistory);
      calculateUserStats(parsedHistory);
    }
    
    if (savedTheme !== null) {
      setDarkMode(JSON.parse(savedTheme));
    }
    
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
  }, []);

  // Apply theme and save to localStorage
  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Calculate user statistics
  const calculateUserStats = (history) => {
    if (history.length === 0) return;

    const totalEssays = history.length;
    const averageScore = Math.round(history.reduce((sum, essay) => sum + essay.score, 0) / totalEssays);
    const totalWords = history.reduce((sum, essay) => sum + essay.wordCount, 0);
    const totalReadingTime = history.reduce((sum, essay) => sum + essay.readingTime, 0);
    
    // Calculate improvement rate based on last 5 essays vs previous 5
    let improvementRate = 0;
    if (history.length >= 10) {
      const recent = history.slice(0, 5);
      const previous = history.slice(5, 10);
      const recentAvg = recent.reduce((sum, essay) => sum + essay.score, 0) / 5;
      const previousAvg = previous.reduce((sum, essay) => sum + essay.score, 0) / 5;
      improvementRate = Math.round(((recentAvg - previousAvg) / previousAvg) * 100);
    }

    // Calculate streak (consecutive days with essays)
    const streak = calculateStreak(history);

    const newStats = {
      totalEssays,
      averageScore,
      totalWords,
      totalReadingTime,
      improvementRate,
      streak,
      lastSubmission: history[0]?.gradedAt || null
    };

    setUserStats(newStats);
    localStorage.setItem('userStats', JSON.stringify(newStats));
  };

  const calculateStreak = (history) => {
    if (history.length === 0) return 0;
    
    let streak = 1;
    const today = new Date().toDateString();
    const lastEssayDate = new Date(history[0].id).toDateString();
    
    if (lastEssayDate !== today) return 0;
    
    for (let i = 1; i < history.length; i++) {
      const currentDate = new Date(history[i-1].id).toDateString();
      const previousDate = new Date(history[i].id).toDateString();
      
      const dayDiff = Math.floor((new Date(currentDate) - new Date(previousDate)) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const generateAdvancedFeedback = (essay) => {
    const words = essay.trim().split(/\s+/);
    const wordCount = words.length;
    const sentences = essay.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = essay.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    // Advanced analysis
    const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^\w]/g, '')));
    const vocabularyRichness = uniqueWords.size / wordCount;
    const avgWordsPerSentence = wordCount / sentences.length;
    
    // Complexity indicators
    const complexWords = words.filter(word => word.length > 6).length;
    const complexityRatio = complexWords / wordCount;
    
    // Transition words analysis
    const transitionWords = ['however', 'therefore', 'furthermore', 'moreover', 'consequently', 'additionally', 'nevertheless', 'meanwhile', 'subsequently', 'accordingly'];
    const transitionCount = transitionWords.filter(word => essay.toLowerCase().includes(word)).length;
    
    // Academic vocabulary
    const academicWords = ['analyze', 'evaluate', 'demonstrate', 'illustrate', 'examine', 'investigate', 'establish', 'determine', 'significant', 'substantial'];
    const academicCount = academicWords.filter(word => essay.toLowerCase().includes(word)).length;
    
    let strengths = [];
    let improvements = [];
    
    // Enhanced content analysis
    if (wordCount >= 1000) {
      strengths.push("Exceptional depth and comprehensive analysis with outstanding coverage");
    } else if (wordCount >= 800) {
      strengths.push("Comprehensive coverage with excellent depth of analysis");
    } else if (wordCount >= 600) {
      strengths.push("Good length with adequate development of key ideas");
    } else if (wordCount >= 400) {
      improvements.push("Consider expanding with more detailed examples and deeper analysis");
    } else if (wordCount >= 200) {
      improvements.push("Significantly expand your essay with more supporting evidence");
    } else {
      improvements.push("Essay needs substantial expansion to meet academic standards");
    }
    
    // Enhanced structure evaluation
    if (paragraphs.length >= 6) {
      strengths.push("Excellent essay structure with clear, well-organized paragraphs");
    } else if (paragraphs.length >= 5) {
      strengths.push("Strong paragraph structure with logical progression of ideas");
    } else if (paragraphs.length >= 4) {
      strengths.push("Good paragraph organization with clear structure");
    } else if (paragraphs.length >= 3) {
      improvements.push("Develop more paragraphs for better organization and flow");
    } else {
      improvements.push("Create clearer paragraph structure with distinct sections");
    }
    
    // Enhanced vocabulary assessment
    if (vocabularyRichness > 0.8) {
      strengths.push("Outstanding vocabulary variety demonstrates exceptional language mastery");
    } else if (vocabularyRichness > 0.7) {
      strengths.push("Excellent vocabulary usage with sophisticated word choice");
    } else if (vocabularyRichness > 0.6) {
      strengths.push("Good vocabulary variety shows strong language skills");
    } else if (vocabularyRichness > 0.5) {
      improvements.push("Enhance vocabulary variety to improve writing sophistication");
    } else {
      improvements.push("Focus on expanding vocabulary range and word choice variety");
    }
    
    // Enhanced complexity analysis
    if (complexityRatio > 0.35) {
      strengths.push("Masterful use of sophisticated vocabulary and complex concepts");
    } else if (complexityRatio > 0.25) {
      strengths.push("Effective use of advanced vocabulary and complex ideas");
    } else if (complexityRatio > 0.2) {
      strengths.push("Good balance of simple and complex language structures");
    } else if (complexityRatio > 0.15) {
      improvements.push("Incorporate more advanced vocabulary and complex sentence structures");
    } else {
      improvements.push("Develop more sophisticated language and complex ideas");
    }
    
    // Enhanced transitions analysis
    if (transitionCount >= 5) {
      strengths.push("Exceptional use of transitions creates seamless flow between ideas");
    } else if (transitionCount >= 3) {
      strengths.push("Excellent use of transition words enhances coherence");
    } else if (transitionCount >= 2) {
      strengths.push("Good use of connecting words to link ideas effectively");
    } else if (transitionCount >= 1) {
      improvements.push("Add more transition words to improve flow and coherence");
    } else {
      improvements.push("Use transition words to create better connections between ideas");
    }
    
    // Enhanced academic tone analysis
    if (academicCount >= 4) {
      strengths.push("Outstanding academic tone with sophisticated scholarly vocabulary");
    } else if (academicCount >= 2) {
      strengths.push("Strong academic approach with appropriate formal language");
    } else if (academicCount >= 1) {
      strengths.push("Good academic tone with formal writing style");
    } else {
      improvements.push("Develop more formal academic tone and scholarly vocabulary");
    }

    // Sentence structure analysis
    if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 25) {
      strengths.push("Excellent sentence variety with optimal length and complexity");
    } else if (avgWordsPerSentence < 12) {
      improvements.push("Vary sentence length by combining some shorter sentences");
    } else if (avgWordsPerSentence > 30) {
      improvements.push("Break down some longer sentences for better clarity");
    }
    
    return {
      strengths,
      improvements,
      summary: `Your essay demonstrates ${strengths.length > improvements.length ? 'strong' : 'developing'} writing skills with ${strengths.length} key strengths and ${improvements.length} areas for growth. ${
        vocabularyRichness > 0.7 ? 'Your vocabulary usage is particularly impressive.' : ''
      } ${
        transitionCount >= 3 ? 'The flow between ideas is well-crafted.' : ''
      }`
    };
  };

  const calculateAdvancedScore = (essay) => {
    const words = essay.trim().split(/\s+/);
    const wordCount = words.length;
    const sentences = essay.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = essay.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    let scores = {
      content: 0,
      organization: 0,
      language: 0,
      mechanics: 0
    };
    
    // Enhanced content scoring (0-25)
    if (wordCount >= 1000) scores.content = 25;
    else if (wordCount >= 800) scores.content = 24;
    else if (wordCount >= 600) scores.content = 22;
    else if (wordCount >= 400) scores.content = 19;
    else if (wordCount >= 250) scores.content = 16;
    else if (wordCount >= 150) scores.content = 12;
    else scores.content = 8;
    
    // Enhanced organization scoring (0-25)
    if (paragraphs.length >= 6) scores.organization = 25;
    else if (paragraphs.length >= 5) scores.organization = 23;
    else if (paragraphs.length >= 4) scores.organization = 21;
    else if (paragraphs.length >= 3) scores.organization = 18;
    else if (paragraphs.length >= 2) scores.organization = 14;
    else scores.organization = 9;
    
    // Enhanced language scoring (0-25)
    const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^\w]/g, '')));
    const vocabularyRatio = uniqueWords.size / wordCount;
    
    if (vocabularyRatio > 0.8) scores.language = 25;
    else if (vocabularyRatio > 0.7) scores.language = 23;
    else if (vocabularyRatio > 0.6) scores.language = 21;
    else if (vocabularyRatio > 0.5) scores.language = 18;
    else if (vocabularyRatio > 0.4) scores.language = 15;
    else if (vocabularyRatio > 0.3) scores.language = 12;
    else scores.language = 10;
    
    // Enhanced mechanics scoring (0-25)
    const avgWordsPerSentence = wordCount / sentences.length;
    const complexWords = words.filter(word => word.length > 6).length;
    const complexityRatio = complexWords / wordCount;
    
    let mechanicsScore = 15; // Base score
    
    if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 25) mechanicsScore += 5;
    else if (avgWordsPerSentence >= 12 && avgWordsPerSentence <= 30) mechanicsScore += 3;
    else mechanicsScore += 1;
    
    if (complexityRatio > 0.3) mechanicsScore += 5;
    else if (complexityRatio > 0.2) mechanicsScore += 3;
    else mechanicsScore += 1;
    
    scores.mechanics = Math.min(mechanicsScore, 25);
    
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    // Add realistic variation with quality bonus
    const qualityBonus = vocabularyRatio > 0.7 ? 3 : 0;
    const variation = (Math.random() - 0.5) * 4;
    const finalScore = Math.max(Math.min(Math.round(totalScore + variation + qualityBonus), 100), 50);
    
    return {
      total: finalScore,
      breakdown: {
        content: scores.content,
        organization: scores.organization,
        language: scores.language,
        mechanics: scores.mechanics
      }
    };
  };

  const getScoreCategory = (score) => {
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
    if (score >= 67) return 'D+';
    if (score >= 65) return 'D';
    return 'F';
  };

  const handleEssaySubmit = async (essay, essayTitle = 'Untitled Essay') => {
    setIsLoading(true);
    setResult(null);

    // Enhanced AI processing simulation
    await new Promise(resolve => setTimeout(resolve, 4000 + Math.random() * 2000));
    
    const scoreData = calculateAdvancedScore(essay);
    const feedback = generateAdvancedFeedback(essay);
    
    const newResult = {
      id: Date.now(),
      title: essayTitle,
      score: scoreData.total,
      breakdown: scoreData.breakdown,
      feedback: feedback,
      gradedAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      wordCount: essay.trim().split(/\s+/).length,
      readingTime: Math.ceil(essay.trim().split(/\s+/).length / 200),
      essay: essay.substring(0, 300) + (essay.length > 300 ? '...' : ''),
      category: getScoreCategory(scoreData.total),
      grade: getGradeLevel(scoreData.total)
    };
    
    setResult(newResult);
    
    // Update history and stats
    const updatedHistory = [newResult, ...essayHistory.slice(0, 19)]; // Keep last 20
    setEssayHistory(updatedHistory);
    localStorage.setItem('essayHistory', JSON.stringify(updatedHistory));
    
    // Recalculate stats
    calculateUserStats(updatedHistory);
    
    setIsLoading(false);
    setCurrentView('results');
  };

  const handleNewEssay = () => {
    setResult(null);
    setIsLoading(false);
    setCurrentView('home');
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view !== 'results') {
      setResult(null);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all essay data? This cannot be undone.')) {
      setEssayHistory([]);
      setUserStats({
        totalEssays: 0,
        averageScore: 0,
        totalWords: 0,
        totalReadingTime: 0,
        improvementRate: 0,
        streak: 0,
        lastSubmission: null
      });
      localStorage.removeItem('essayHistory');
      localStorage.removeItem('userStats');
      setCurrentView('home');
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            history={essayHistory} 
            userStats={userStats}
            onViewEssay={(essay) => {
              setResult(essay);
              setCurrentView('results');
            }}
            onClearData={clearAllData}
          />
        );
      case 'features':
        return <Features />;
      case 'results':
        return <Results result={result} onNewEssay={handleNewEssay} />;
      default:
        return <EssayForm onSubmit={handleEssaySubmit} isLoading={isLoading} />;
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <div className="app-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
          <div className="shape shape-6"></div>
        </div>
        <div className="gradient-mesh"></div>
      </div>
      
      <div className="container">
        <div className="main-content">
          <Header 
            currentView={currentView} 
            onViewChange={handleViewChange}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            userStats={userStats}
          />
          <main className="content-area">
            {renderCurrentView()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;