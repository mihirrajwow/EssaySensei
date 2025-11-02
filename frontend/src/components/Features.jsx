import React, { useState } from 'react';
import { Brain, Target, TrendingUp, Shield, Zap, Users, BookOpen, Award, Clock, Lightbulb, CheckCircle, Star, ArrowRight, Play, Sparkles } from 'lucide-react';
import '../styles/Features.css';


function Features() {
  const [activeDemo, setActiveDemo] = useState(null);

  // Data moved to constants for better organization
  const features = [
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Advanced algorithms analyze writing patterns and content depth',
      color: 'blue',
      demo: 'ai-analysis'
    },
    {
      icon: Target,
      title: 'Precision Scoring',
      description: 'Four-dimensional scoring: Content, Organization, Language, Mechanics',
      color: 'green',
      demo: 'scoring'
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Track trends, insights, and improvement recommendations',
      color: 'purple',
      demo: 'analytics'
    },
    {
      icon: Lightbulb,
      title: 'Smart Insights',
      description: 'Personalized feedback based on your writing style',
      color: 'orange',
      demo: 'insights'
    },
    {
      icon: Clock,
      title: 'Instant Results',
      description: 'Get detailed analysis in seconds, perfect for deadlines',
      color: 'red',
      demo: 'speed'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Local processing with no data sharing or storage',
      color: 'indigo',
      demo: 'privacy'
    }
  ];

  const benefits = [
    {
      icon: Award,
      title: 'Better Grades',
      description: '23% average improvement in essay scores',
      stat: '+23%'
    },
    {
      icon: BookOpen,
      title: 'Learn Faster',
      description: 'Focus study time on high-impact improvements',
      stat: '3x faster'
    },
    {
      icon: Users,
      title: 'Trusted Globally',
      description: 'Join 100k+ students worldwide',
      stat: '100k+ users'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Graduate Student',
      content: 'EssaySensei transformed my academic writing. The feedback helped me understand what professors wanted.',
      rating: 5,
      improvement: '+28'
    },
    {
      name: 'Dr. Rodriguez',
      role: 'Professor',
      content: 'I recommend EssaySensei to all students. The AI provides surprisingly nuanced feedback.',
      rating: 5,
      improvement: 'Educator'
    }
  ];

  // Render methods for cleaner JSX
  const renderFeatureCard = (feature, index) => (
    <div 
      key={index} 
      className={`feature-card ${feature.color}`}
      onMouseEnter={() => setActiveDemo(feature.demo)}
      onMouseLeave={() => setActiveDemo(null)}
    >
      <div className="feature-icon">
        <feature.icon size={24} />
      </div>
      <h3 className="feature-title">{feature.title}</h3>
      <p className="feature-description">{feature.description}</p>
      
      {activeDemo === feature.demo && (
        <div className="demo-content">
          <button className="demo-button">
            <Play size={14} />
            Try Demo
          </button>
        </div>
      )}
    </div>
  );

  const renderBenefitCard = (benefit, index) => (
    <div key={index} className="benefit-card">
      <div className="benefit-icon">
        <benefit.icon size={20} />
      </div>
      <div className="benefit-content">
        <h4 className="benefit-title">{benefit.title}</h4>
        <p className="benefit-description">{benefit.description}</p>
        <div className="benefit-stat">{benefit.stat}</div>
      </div>
    </div>
  );

  const renderTestimonialCard = (testimonial, index) => (
    <div key={index} className="testimonial-card">
      <div className="testimonial-rating">
        <div className="stars">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} size={14} fill="currentColor" />
          ))}
        </div>
        {testimonial.improvement !== 'Educator' && (
          <div className="improvement-badge">
            {testimonial.improvement}
          </div>
        )}
      </div>
      
      <p className="testimonial-text">"{testimonial.content}"</p>
      
      <div className="testimonial-author">
        <div className="author-avatar">
          {testimonial.name.charAt(0)}
        </div>
        <div className="author-info">
          <span className="author-name">{testimonial.name}</span>
          <span className="author-role">{testimonial.role}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="features-container">
      {/* Header Section */}
      <div className="features-header">
        <Sparkles size={24} className="header-icon" />
        <h2 className="features-title">Why Choose EssaySensei?</h2>
        <p className="features-subtitle">
          Powerful AI writing assistant for students and educators
        </p>
      </div>

      {/* Features Grid */}
      <div className="features-grid">
        {features.map(renderFeatureCard)}
      </div>

      {/* Benefits Section */}
      <div className="benefits-section">
        <h3 className="section-title">Proven Results</h3>
        <div className="benefits-grid">
          {benefits.map(renderBenefitCard)}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <h3 className="section-title">What Users Say</h3>
        <div className="testimonials-grid">
          {testimonials.map(renderTestimonialCard)}
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <div className="cta-badge">
            <Zap size={16} />
            Start Writing Better
          </div>
          
          <h3 className="cta-title">Ready to Improve Your Writing?</h3>
          <p className="cta-description">
            Join thousands of students improving their essays with AI-powered feedback
          </p>
          
          <div className="cta-features">
            <div className="cta-feature">
              <CheckCircle size={16} />
              Instant analysis
            </div>
            <div className="cta-feature">
              <CheckCircle size={16} />
              Detailed feedback
            </div>
            <div className="cta-feature">
              <CheckCircle size={16} />
              Progress tracking
            </div>
          </div>
          
          <div className="cta-stats">
            <div className="cta-stat">
              <span className="stat-number">100k+</span>
              <span className="stat-label">Students</span>
            </div>
            <div className="cta-stat">
              <span className="stat-number">23%</span>
              <span className="stat-label">Improvement</span>
            </div>
            <div className="cta-stat">
              <span className="stat-number">4.9★</span>
              <span className="stat-label">Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;