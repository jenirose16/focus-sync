import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Swal from 'sweetalert2';
import Login from './components/Login';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import StudyRoom from './StudyRoom';
import AIQuiz from './AIQuiz';
import Analytics from './Analytics';
import Settings from './Settings';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState('');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [socket, setSocket] = useState(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('focussyncTheme');
    const savedToken = localStorage.getItem('focussyncToken');
    const savedUser = localStorage.getItem('focussyncUser');

    if (savedTheme) setTheme(savedTheme);
    if (savedToken && savedUser) {
      setAuthToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const isLight = theme === 'light';

    root.style.setProperty('--background', isLight ? '#f8fafc' : '#020617');
    root.style.setProperty('--sidebar-background', isLight ? '#ffffff' : '#0f172a');
    root.style.setProperty('--card-background', isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.9)');
    root.style.setProperty('--text-primary', isLight ? '#0f172a' : '#f8fafc');
    root.style.setProperty('--text-secondary', isLight ? '#475569' : '#94a3b8');
    root.style.setProperty('--border-color', isLight ? 'rgba(15,23,42,0.1)' : 'rgba(255,255,255,0.08)');
  }, [theme]);

  useEffect(() => {
    if (!authToken) {
      if (socket) socket.disconnect();
      return;
    }

    const newSocket = io('http://localhost:5000', {
      auth: { token: authToken },
      reconnection: true
    });
    newSocket.on('connect', () => console.log('✅ FocusSync Live Sync Connected:', newSocket.id));
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [authToken]);

  // --- 2. THE GUARDIAN (TAB SWITCH ALERT & NOTIFICATIONS) ---
  useEffect(() => {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    const handleVisibilityChange = () => {
      const hidden = document.hidden;
      const payload = {
        hidden,
        timestamp: new Date().toISOString(),
        studentId: user?._id
      };

      if (socket && isLoggedIn) {
        socket.emit('visibilitychange', payload);
      }

      if (hidden) {
        if (Notification.permission === 'granted') {
          new Notification('🚨 FOCUS LOST!', {
            body: 'Your study window is no longer active. Return to FocusSync to keep focus streaks alive.',
            tag: 'focus-alert'
          });
        }

        document.title = '⚠️ FOCUS LOST! ⚠️';

        Swal.fire({
          title: 'Distraction Detected!',
          text: 'You left the study environment. Focus session paused.',
          icon: 'error',
          confirmButtonColor: '#10b981',
          background: theme === 'light' ? '#ffffff' : '#0f172a',
          color: theme === 'light' ? '#0f172a' : '#f1f5f9'
        });

        if (socket) socket.emit('status-update', { status: 'Idle' });
      } else {
        document.title = 'FocusSync';
        if (socket) socket.emit('status-update', { status: 'Focused' });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [socket, isLoggedIn]);

  const handleLogin = (userData, token) => {
    setUser(userData);
    setAuthToken(token);
    setIsLoggedIn(true);
    localStorage.setItem('focussyncToken', token);
    localStorage.setItem('focussyncUser', JSON.stringify(userData));

    if (socket) {
      socket.emit('join-study-room', {
        userId: userData._id,
        name: userData.username || 'Focus User',
        avatar: userData.avatar || localStorage.getItem('avatarSeed') || 'Jeni',
        email: userData.email || 'user@focussync.app'
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setAuthToken('');
    localStorage.removeItem('focussyncToken');
    localStorage.removeItem('focussyncUser');
    if (socket) socket.emit('status-update', { status: 'Offline' });
  };

  useEffect(() => {
    if (socket && user) {
      socket.emit('join-study-room', {
        userId: user._id,
        name: user.username || 'Focus User',
        avatar: user.avatar || localStorage.getItem('avatarSeed') || 'Jeni',
        email: user.email || 'user@focussync.app'
      });
    }
  }, [socket, user]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard user={user} />;
      case 'study-room': return <StudyRoom user={user} onUpdateUser={setUser} />;
      case 'ai-quiz': return <AIQuiz />;
      case 'analytics': return <Analytics user={user} />;
      case 'settings': return <Settings user={user} />;
      default: return <Dashboard user={user} />;
    }
  };

  // --- AUTH CHECK ---
  // --- AUTH CHECK ---
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // --- THE LAYOUT ENGINE ---
  return (
    <div className="App" style={{ 
      display: 'flex',
      minHeight: '100vh', 
      background: 'var(--background)',
      width: '100vw',
      overflowX: 'hidden',
      boxSizing: 'border-box',
      alignItems: 'flex-start',
      color: 'var(--text-primary)'
    }}>
      {/* Sidebar is fixed at 280px */}
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        user={user} 
      />
      
      {/* Main content Area: Flush with sidebar */}
      <main style={{ 
        width: 'calc(100% - 280px)', // Use calc to ensure perfect flush alignment
        flexGrow: 1,
        minHeight: '100vh',
        background: 'var(--background)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        boxSizing: 'border-box'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 2rem 0.75rem 2rem',
          background: 'transparent'
        }}>
          <div />
          <button
            onClick={() => {
              const nextTheme = theme === 'dark' ? 'light' : 'dark';
              setTheme(nextTheme);
              localStorage.setItem('focussyncTheme', nextTheme);
            }}
            style={{
              padding: '0.8rem 1rem',
              borderRadius: '999px',
              border: '1px solid var(--border-color)',
              background: theme === 'light' ? '#ffffff' : '#111827',
              color: theme === 'light' ? '#0f172a' : '#f8fafc',
              cursor: 'pointer',
              fontWeight: '700'
            }}
          >
            {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>

        {/* We wrap the rendered page to ensure it fills 100% of the main area */}
        <div style={{ width: '100%', flexGrow: 1 }}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
} 

export default App;