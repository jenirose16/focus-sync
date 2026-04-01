import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Zap, BarChart3, Settings } from 'lucide-react';
// CRITICAL FIX: This line prevents the "Link is not defined" error
import { Link } from 'react-router-dom'; 


const Sidebar = ({ currentPage, setCurrentPage, user }) => {
  const [avatarSeed, setAvatarSeed] = useState('Jeni');

  useEffect(() => {
    const savedSeed = localStorage.getItem('avatarSeed') || 'Jeni';
    setAvatarSeed(savedSeed);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedSeed = localStorage.getItem('avatarSeed') || 'Jeni';
      setAvatarSeed(savedSeed);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const links = [
    { name: 'Dashboard', key: 'dashboard', icon: LayoutDashboard },
    { name: 'Study Room', key: 'study-room', icon: Users },
    { name: 'AI Quiz', key: 'ai-quiz', icon: Zap },
    { name: 'Analytics', key: 'analytics', icon: BarChart3 },
    { name: 'Settings', key: 'settings', icon: Settings },
  ];

  return (
    <div style={{
      width: '280px',
      height: '100vh',
      background: '#0F172A',
      position: 'fixed',
      left: 0,
      top: 0,
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      zIndex: 1000,
    }}>
      {/* Logo */}
      <div style={{
        marginBottom: '3rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: 'white',
          fontSize: '18px',
        }}>
          FS
        </div>
        <h2 style={{
          color: '#10b981',
          fontSize: '20px',
          fontWeight: '700',
          letterSpacing: '-0.5px',
          margin: 0,
        }}>
          FocusSync
        </h2>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1 }}>
        {links.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentPage === item.key;
          
          return (
            <button
              key={item.key}
              onClick={() => setCurrentPage(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '0.875rem 1rem',
                marginBottom: '0.5rem',
                background: isActive
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'transparent',
                border: isActive ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
                color: isActive ? '#10b981' : '#94a3b8',
                textAlign: 'left',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: isActive ? '600' : '500',
                fontSize: '14px',
              }}
            >
              <IconComponent size={18} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Profile Section - Now wrapped in a Link to Settings */}
      <Link 
        to="/settings" 
        onClick={() => setCurrentPage('settings')}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div style={{
          marginTop: 'auto',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.75rem',
            borderRadius: '10px',
            background: 'rgba(30, 41, 59, 0.5)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}>
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
              alt="Profile"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '2px solid #10b981',
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                margin: 0,
                fontSize: '13px',
                fontWeight: '600',
                color: '#e2e8f0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {user?.username || 'Jeni Rose'}
              </p>
              <p style={{
                margin: '2px 0 0 0',
                fontSize: '12px',
                color: '#64748b',
              }}>
                XP: {user?.totalXP || 1200}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Sidebar;