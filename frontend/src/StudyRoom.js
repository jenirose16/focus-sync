import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, Clock, BookOpen, Award } from 'lucide-react';
import io from 'socket.io-client';

const StudyRoom = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Alice Morgan', status: 'Focused', seed: 'Alice' },
    { id: 2, name: 'Bob Wilson', status: 'Focused', seed: 'Bob' },
    { id: 3, name: 'Charlie Davis', status: 'Focused', seed: 'Charlie' },
    { id: 4, name: 'Diana Chen', status: 'Focused', seed: 'Diana' },
  ]);
  const [avatarSeed] = useState(localStorage.getItem('avatarSeed') || 'Jeni');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('student-joined', (data) => {
      console.log('🔔 Student joined:', data.lastJoined.name);
      setStudents(prev => {
        const filtered = prev.filter(s => s.name !== data.lastJoined.name);
        return [...filtered, { id: Math.random(), name: data.lastJoined.name, status: data.lastJoined.status, seed: data.lastJoined.avatar }];
      });
    });

    socket.on('status-changed', (data) => {
      console.log(`⚡ ${data.name} status changed to ${data.status}`);
      setStudents(prev => prev.map(s => s.name === data.name ? { ...s, status: data.status } : s));
    });

    socket.on('student-left', (data) => {
      console.log('👋 Student left:', data.name);
      setStudents(prev => prev.filter(s => s.name !== data.name));
    });

    return () => socket.disconnect();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Focused':
        return '#10b981';
      case 'Idle':
        return '#f59e0b';
      case 'Distracted':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusBadgeStyle = (status) => {
    const color = getStatusColor(status);
    return {
      padding: '0.375rem 0.75rem',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      background: `${color}20`,
      color: color,
      border: `1px solid ${color}40`,
      whiteSpace: 'nowrap',
    };
  };

  return (
    <div style={{
      marginLeft: '280px',
      padding: '2rem',
      background: '#020617',
      minHeight: '100vh',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#f1f5f9',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <Users size={28} color="#10b981" />
          Active Study Room
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          {students.length} students currently focused and ready to learn
        </p>
      </div>

      {/* Stats Bar */}
      <div className="glass-card" style={{
        padding: '1rem 1.5rem',
        marginBottom: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', margin: 0 }}>
            ACTIVE STUDENTS
          </p>
          <p style={{
            color: '#10b981',
            fontSize: '20px',
            fontWeight: '700',
            margin: '0.5rem 0 0 0',
          }}>
            {students.length}
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', margin: 0 }}>
            FOCUSED
          </p>
          <p style={{
            color: '#10b981',
            fontSize: '20px',
            fontWeight: '700',
            margin: '0.5rem 0 0 0',
          }}>
            {students.filter(s => s.status === 'Focused').length}
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', margin: 0 }}>
            SESSION TIME
          </p>
          <p style={{
            color: '#f59e0b',
            fontSize: '20px',
            fontWeight: '700',
            margin: '0.5rem 0 0 0',
          }}>
            2h 15m
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', margin: 0 }}>
            XP EARNED
          </p>
          <p style={{
            color: '#8b5cf6',
            fontSize: '20px',
            fontWeight: '700',
            margin: '0.5rem 0 0 0',
          }}>
            +250
          </p>
        </div>
      </div>

      {/* Professional Statistics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
      }}>
        {/* Total Focus Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="glass-card"
          style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            background: 'rgba(16, 185, 129, 0.15)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}>
            <Clock size={24} color="#10b981" />
          </div>
          <p style={{
            color: '#94a3b8',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            margin: 0,
            marginBottom: '0.5rem',
          }}>
            Total Focus
          </p>
          <p style={{
            color: '#f1f5f9',
            fontSize: '24px',
            fontWeight: '700',
            margin: 0,
          }}>
            4.5h
          </p>
          <p style={{
            color: '#64748b',
            fontSize: '12px',
            margin: '0.5rem 0 0 0',
          }}>
            This week
          </p>
        </motion.div>

        {/* Quizzes Completed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card"
          style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            background: 'rgba(139, 92, 246, 0.15)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}>
            <BookOpen size={24} color="#8b5cf6" />
          </div>
          <p style={{
            color: '#94a3b8',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            margin: 0,
            marginBottom: '0.5rem',
          }}>
            Quizzes
          </p>
          <p style={{
            color: '#f1f5f9',
            fontSize: '24px',
            fontWeight: '700',
            margin: 0,
          }}>
            12
          </p>
          <p style={{
            color: '#64748b',
            fontSize: '12px',
            margin: '0.5rem 0 0 0',
          }}>
            Completed
          </p>
        </motion.div>

        {/* Global Rank */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card"
          style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            background: 'rgba(245, 158, 11, 0.15)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}>
            <Award size={24} color="#f59e0b" />
          </div>
          <p style={{
            color: '#94a3b8',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            margin: 0,
            marginBottom: '0.5rem',
          }}>
            Rank
          </p>
          <p style={{
            color: '#f1f5f9',
            fontSize: '24px',
            fontWeight: '700',
            margin: 0,
          }}>
            #4
          </p>
          <p style={{
            color: '#64748b',
            fontSize: '12px',
            margin: '0.5rem 0 0 0',
          }}>
            Top 1%
          </p>
        </motion.div>
      </div>

      {/* Analytics Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        marginBottom: '2rem',
      }}>
        {/* Progress Chart */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{
            color: '#f1f5f9',
            fontSize: '16px',
            fontWeight: '700',
            marginBottom: '1.5rem',
            margin: 0,
            marginBottom: '1.5rem',
          }}>
            ⏱️ Focus Progress
          </h3>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
            }}>
              <p style={{
                color: '#cbd5e1',
                fontSize: '14px',
                fontWeight: '500',
                margin: 0,
              }}>
                Time Focused Today
              </p>
              <p style={{
                color: '#10b981',
                fontSize: '14px',
                fontWeight: '700',
                margin: 0,
              }}>
                4.5 hrs / 8 hrs
              </p>
            </div>
            <div style={{
              width: '100%',
              height: '12px',
              background: 'rgba(15, 23, 42, 0.8)',
              borderRadius: '6px',
              overflow: 'hidden',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            }}>
              <div style={{
                width: '56%',
                height: '100%',
                background: 'linear-gradient(90deg, #10b981, #059669)',
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
          <p style={{
            color: '#94a3b8',
            fontSize: '12px',
            margin: '1rem 0 0 0',
          }}>
            You're crushing it! Keep up the momentum. 🔥
          </p>
        </div>

        {/* Live Activity Feed */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{
            color: '#f1f5f9',
            fontSize: '16px',
            fontWeight: '700',
            marginBottom: '1.5rem',
            margin: 0,
            marginBottom: '1.5rem',
          }}>
            🔥 Live Activity
          </h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {[
              { user: 'Mithra K.', action: 'just completed a 25m Pomodoro', time: '2m ago', icon: '✓' },
              { user: 'Sarah M.', action: 'Started a study session', time: '5m ago', icon: '▶' },
              { user: 'James L.', action: 'Earned 150 XP', time: '12m ago', icon: '⭐' },
            ].map((activity, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.75rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.1)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(15, 23, 42, 0.9)';
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(15, 23, 42, 0.6)';
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.1)';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}>
                  <span style={{
                    fontSize: '18px',
                    minWidth: '24px',
                  }}>
                    {activity.icon}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      color: '#f1f5f9',
                      fontSize: '13px',
                      fontWeight: '600',
                      margin: '0 0 2px 0',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {activity.user}
                    </p>
                    <p style={{
                      color: '#94a3b8',
                      fontSize: '12px',
                      margin: 0,
                    }}>
                      {activity.action}
                    </p>
                  </div>
                  <p style={{
                    color: '#64748b',
                    fontSize: '11px',
                    margin: 0,
                    whiteSpace: 'nowrap',
                    fontWeight: '500',
                  }}>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem',
      }}>
        {students.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.background = 'rgba(30, 41, 59, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'rgba(30, 41, 59, 0.7)';
            }}
          >
            {/* Status Badge */}
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              ...getStatusBadgeStyle(student.status),
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}>
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: getStatusColor(student.status),
                }}
              />
              {student.status}
            </div>

            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{ marginBottom: '1rem' }}
            >
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.seed}`}
                alt={student.name}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  border: `3px solid ${getStatusColor(student.status)}`,
                  boxShadow: `0 0 20px ${getStatusColor(student.status)}40`,
                }}
              />
            </motion.div>

            {/* Name */}
            <h3 style={{
              color: '#f1f5f9',
              fontSize: '16px',
              fontWeight: '700',
              margin: '0 0 0.5rem 0',
              wordBreak: 'break-word',
            }}>
              {student.name}
            </h3>

            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              width: '100%',
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <div style={{
                padding: '0.75rem',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}>
                <p style={{
                  color: '#94a3b8',
                  fontSize: '11px',
                  fontWeight: '600',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Focus Time
                </p>
                <p style={{
                  color: '#10b981',
                  fontSize: '14px',
                  fontWeight: '700',
                  margin: '0.3rem 0 0 0',
                }}>
                  45 min
                </p>
              </div>
              <div style={{
                padding: '0.75rem',
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(139, 92, 246, 0.2)',
              }}>
                <p style={{
                  color: '#94a3b8',
                  fontSize: '11px',
                  fontWeight: '600',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Streak
                </p>
                <p style={{
                  color: '#8b5cf6',
                  fontSize: '14px',
                  fontWeight: '700',
                  margin: '0.3rem 0 0 0',
                }}>
                  {Math.floor(Math.random() * 7) + 1} days
                </p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setSelectedStudent(student)}
              style={{
                width: '100%',
                marginTop: '1rem',
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.375rem',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 15px rgba(16, 185, 129, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <Activity size={14} />
              View Profile
            </button>
          </motion.div>
        ))}
      </div>

      {/* No More Students Message */}
      {students.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: '#94a3b8',
        }}>
          <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <p style={{ fontSize: '16px', fontWeight: '500' }}>
            No active students right now
          </p>
          <p style={{ fontSize: '14px', marginTop: '0.5rem' }}>
            Come back later or invite friends to study together!
          </p>
        </div>
      )}

      {/* Profile Modal */}
      {selectedStudent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedStudent(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(4px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card"
            style={{
              padding: '2rem',
              maxWidth: '400px',
              width: '90%',
              position: 'relative',
              background: 'rgba(30, 41, 59, 0.95)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedStudent(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '0.25rem 0.5rem',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#f1f5f9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94a3b8';
              }}
            >
              ×
            </button>

            {/* Avatar */}
            <div style={{
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}>
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudent.seed}`}
                alt={selectedStudent.name}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  border: `3px solid ${getStatusColor(selectedStudent.status)}`,
                  boxShadow: `0 0 25px ${getStatusColor(selectedStudent.status)}60`,
                  margin: '0 auto',
                }}
              />
            </div>

            {/* Name */}
            <h2 style={{
              color: '#f1f5f9',
              fontSize: '20px',
              fontWeight: '700',
              margin: '0 0 0.5rem 0',
              textAlign: 'center',
            }}>
              {selectedStudent.name}
            </h2>

            {/* Status Badge */}
            <div style={{
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                ...getStatusBadgeStyle(selectedStudent.status),
              }}>
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: getStatusColor(selectedStudent.status),
                  }}
                />
                {selectedStudent.status}
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1.5rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
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
                  fontSize: '11px',
                  fontWeight: '600',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '0.5rem',
                }}>
                  Total XP
                </p>
                <p style={{
                  color: '#10b981',
                  fontSize: '20px',
                  fontWeight: '700',
                  margin: 0,
                }}>
                  1,200
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
                  fontSize: '11px',
                  fontWeight: '600',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '0.5rem',
                }}>
                  Rank
                </p>
                <p style={{
                  color: '#8b5cf6',
                  fontSize: '20px',
                  fontWeight: '700',
                  margin: 0,
                }}>
                  #2
                </p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setSelectedStudent(null)}
              style={{
                width: '100%',
                padding: '0.875rem',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Close Profile
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default StudyRoom;