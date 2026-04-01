import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send } from 'lucide-react';

const AIQuiz = () => {
  const [material, setMaterial] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const generateQuiz = async () => {
    if (!material.trim()) {
      alert('Please enter study material');
      return;
    }
    
    setLoading(true);
    try {
      const backendURL = 'http://localhost:5000/api/quiz';
      
      // CRITICAL FIX: Changed body key from 'material' to 'content' 
      // to match the backend variable exactly.
      const response = await fetch(backendURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: material }), 
      });
      
      let data = await response.json();
      
      if (!response.ok || !data || data.length === 0) {
        throw new Error('Failed to generate from AI');
      }
      
      setQuiz(data);
      setMaterial('');
    } catch (error) {
      console.error('❌ QUIZ GENERATION FAILED:', error.message);
      
      // Professional Fallback so your demo never shows a blank screen
      const fallback = [{
        question: 'What is the main goal of FocusSync?',
        options: ['To help students focus better', 'To waste time', 'To distract users', 'To test AI'],
        answer: 'To help students focus better',
        explanation: 'FocusSync is designed to enhance productivity through AI verification and real-time synchronization.'
      }];
      setQuiz(fallback);
      alert(`AI is busy, loaded demo content instead!`);
    }
    setLoading(false);
  };

  const handleOptionClick = (questionIndex, option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: option,
    });
  };

  return (
    <div style={{
      marginLeft: '280px',
      padding: '2rem',
      background: 'inherit', // Dynamic background based on Light/Dark mode
      minHeight: '100vh',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: 'var(--text-primary, #f1f5f9)',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <Sparkles size={28} color="#10b981" />
          AI Quiz Generator
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          Transform your study material into 10 interactive QUEST MCQs
        </p>
      </div>

      {/* Input Section */}
      <div className="glass-card" style={{
        padding: '2rem',
        maxWidth: '700px',
        margin: '0 auto 2rem',
        background: 'rgba(30, 41, 59, 0.5)',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <textarea
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          placeholder="Paste your notes here (e.g. 'Apples are high in fiber...')"
          style={{
            width: '100%',
            height: '150px',
            padding: '1rem',
            marginBottom: '1.5rem',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: '#e2e8f0',
            borderRadius: '10px',
            outline: 'none'
          }}
        />

        <button
          onClick={generateQuiz}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            border: 'none',
            color: 'white',
            borderRadius: '10px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '700',
          }}
        >
          {loading ? 'AI is analyzing content...' : 'Generate 10-Question Quiz'}
        </button>
      </div>

      {/* Quiz Content */}
      {quiz && !loading && (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {quiz.map((q, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                padding: '1.5rem',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <p style={{ color: '#f1f5f9', fontWeight: '600', marginBottom: '1rem' }}>
                {index + 1}. {q.question}
              </p>

              {q.options.map((option, i) => {
                const isSelected = selectedAnswers[index] === option;
                return (
                  <div key={i}>
                    <div
                      onClick={() => handleOptionClick(index, option)}
                      style={{
                        padding: '0.8rem',
                        marginBottom: '0.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        // CLIPPING EFFECT: Highlights the selection
                        background: isSelected ? '#10b981' : 'rgba(15, 23, 42, 0.6)',
                        color: isSelected ? 'white' : '#cbd5e1',
                        // HOVER GLOW: Emerald shadow on hover
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {option}
                    </div>

                    {/* REVEAL DETAILS: Shows only when option is selected */}
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          padding: '0.8rem',
                          background: 'rgba(16, 185, 129, 0.1)',
                          borderLeft: '4px solid #10b981',
                          marginBottom: '1rem',
                          fontSize: '13px',
                          color: '#e2e8f0'
                        }}
                      >
                        <strong style={{ color: '#10b981' }}>Pedagogical Detail:</strong> {q.explanation}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIQuiz;