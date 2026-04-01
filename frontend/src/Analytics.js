import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, BookOpen, Target } from 'lucide-react';

const Analytics = () => {
  // Sample data for weekly activity
  const weeklyData = [
    { day: 'Mon', hours: 5.5, percentage: 69 },
    { day: 'Tue', hours: 4.2, percentage: 52 },
    { day: 'Wed', hours: 6.8, percentage: 85 },
    { day: 'Thu', hours: 3.9, percentage: 49 },
    { day: 'Fri', hours: 4.5, percentage: 56 },
  ];

  const stats = [
    { label: 'Total Focused Hours', value: '24.5', icon: Clock, color: '#10b981' },
    { label: 'Quizzes Completed', value: '42', icon: BookOpen, color: '#8b5cf6' },
    { label: 'Avg. Focus Score', value: '88%', icon: Target, color: '#f59e0b' },
  ];

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
          <BarChart3 size={28} color="#10b981" />
          Analytics Dashboard
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          Track your focus sessions and quiz performance
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
        maxWidth: '1280px',
      }}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card"
              style={{
                padding: '1.5rem',
                background: `rgba(${stat.color === '#10b981' ? '16, 185, 129' : stat.color === '#8b5cf6' ? '139, 92, 246' : '245, 158, 11'}, 0.08)`,
                borderLeft: `4px solid ${stat.color}`,
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}>
                <div>
                  <p style={{
                    color: '#94a3b8',
                    fontSize: '13px',
                    marginBottom: '0.75rem',
                    fontWeight: '500',
                  }}>
                    {stat.label}
                  </p>
                  <p style={{
                    color: '#f1f5f9',
                    fontSize: '32px',
                    fontWeight: '700',
                  }}>
                    {stat.value}
                  </p>
                </div>
                <Icon size={24} color={stat.color} opacity={0.7} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Weekly Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card"
        style={{
          padding: '2rem',
          maxWidth: '1280px',
        }}
      >
        <h2 style={{
          color: '#f1f5f9',
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <Clock size={18} color="#10b981" />
          Weekly Focus Activity
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          {weeklyData.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.3 + idx * 0.05 }}
              style={{
                textAlign: 'center',
              }}
            >
              <div style={{
                marginBottom: '1rem',
                position: 'relative',
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${item.percentage}%` }}
                  transition={{ delay: 0.4 + idx * 0.05, duration: 0.6 }}
                  style={{
                    background: `linear-gradient(180deg, #10b981 0%, #059669 100%)`,
                    borderRadius: '8px 8px 0 0',
                    position: 'relative',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: '#f1f5f9',
                    fontSize: '12px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                  }}>
                    {item.hours}h
                  </div>
                </motion.div>
              </div>
              <p style={{
                color: '#94a3b8',
                fontSize: '13px',
                fontWeight: '500',
              }}>
                {item.day}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Chart Footer Info */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
        }}>
          <div>
            <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '0.25rem' }}>
              Total This Week
            </p>
            <p style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: '700' }}>
              28.9h
            </p>
          </div>
          <div>
            <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '0.25rem' }}>
              Best Day
            </p>
            <p style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: '700' }}>
              Wed (6.8h)
            </p>
          </div>
          <div>
            <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '0.25rem' }}>
              Weekly Average
            </p>
            <p style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: '700' }}>
              5.8h/day
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;