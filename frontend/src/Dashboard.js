import React from 'react';

const Dashboard = ({ user }) => {
  return (
    <div style={{
      marginLeft: '280px',
      padding: '2rem',
      background: '#020617',
      minHeight: '100vh',
    }}>
      {/* Container for responsive layout */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingLeft: '2rem',
        paddingRight: '2rem',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#f1f5f9',
            margin: 0,
          }}>
            Dashboard
          </h1>
          <div style={{ textAlign: 'right' }}>
            <p style={{
              color: '#cbd5e1',
              fontSize: '14px',
              margin: '0.25rem 0',
              fontWeight: '500',
            }}>
              XP: <span style={{ color: '#10b981', fontWeight: '700' }}>{user?.totalXP || 0}</span>
            </p>
            <p style={{
              color: '#cbd5e1',
              fontSize: '14px',
              margin: '0.25rem 0',
              fontWeight: '500',
            }}>
              Streak: <span style={{ color: '#f59e0b', fontWeight: '700' }}>5 days</span>
            </p>
          </div>
        </div>

        {/* Focus Ring & Objectives Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
        }}>
          {/* Focus Ring */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <div className="glass-card" style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
            }}>
              <h2 style={{
                color: '#10b981',
                fontSize: '16px',
                fontWeight: '700',
                margin: 0,
                textAlign: 'center',
              }}>
                Focus Ring
              </h2>
              <p style={{
                color: '#cbd5e1',
                fontSize: '12px',
                marginTop: '0.5rem',
                textAlign: 'center',
              }}>
                45 min today
              </p>
            </div>
          </div>

          {/* Daily Objectives */}
          <div className="glass-card" style={{
            padding: '1.5rem',
            gridColumn: 'span 1',
          }}>
            <h3 style={{
              color: '#f1f5f9',
              fontSize: '16px',
              fontWeight: '700',
              marginBottom: '1.5rem',
              margin: 0,
              marginBottom: '1.5rem',
            }}>
              📋 Daily Objectives
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'grid',
              gap: '1rem',
            }}>
              <li style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                color: '#cbd5e1',
                fontSize: '14px',
              }}>
                <input
                  type="checkbox"
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#10b981',
                  }}
                />
                Complete 2 hours of focused study
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem',
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                color: '#cbd5e1',
                fontSize: '14px',
              }}>
                <input
                  type="checkbox"
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#8b5cf6',
                  }}
                />
                Take an AI quiz on React
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem',
                background: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                color: '#cbd5e1',
                fontSize: '14px',
              }}>
                <input
                  type="checkbox"
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#f59e0b',
                  }}
                />
                Review notes from yesterday
              </li>
            </ul>
          </div>
        </div>

        {/* Weekly Stats */}
        <div className="glass-card" style={{
          padding: '1.5rem',
          marginTop: '2rem',
        }}>
          <h3 style={{
            color: '#f1f5f9',
            fontSize: '16px',
            fontWeight: '700',
            marginBottom: '1.5rem',
            margin: 0,
            marginBottom: '1.5rem',
          }}>
            📊 Weekly Stats
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
          }}>
            <div style={{
              padding: '1rem',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              textAlign: 'center',
            }}>
              <p style={{
                color: '#94a3b8',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                margin: 0,
              }}>
                Focus Time
              </p>
              <p style={{
                color: '#10b981',
                fontSize: '20px',
                fontWeight: '700',
                margin: '0.5rem 0 0 0',
              }}>
                14h 30m
              </p>
            </div>
            <div style={{
              padding: '1rem',
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              textAlign: 'center',
            }}>
              <p style={{
                color: '#94a3b8',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                margin: 0,
              }}>
                Quizzes Done
              </p>
              <p style={{
                color: '#8b5cf6',
                fontSize: '20px',
                fontWeight: '700',
                margin: '0.5rem 0 0 0',
              }}>
                8
              </p>
            </div>
            <div style={{
              padding: '1rem',
              background: 'rgba(245, 158, 11, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              textAlign: 'center',
            }}>
              <p style={{
                color: '#94a3b8',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                margin: 0,
              }}>
                XP Earned
              </p>
              <p style={{
                color: '#f59e0b',
                fontSize: '20px',
                fontWeight: '700',
                margin: '0.5rem 0 0 0',
              }}>
                +850
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;