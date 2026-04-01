import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Swal from 'sweetalert2';
import Login from './Login';
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
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [socket, setSocket] = useState(null);

  // --- 1. LIVE SYNC CONNECTION ---
  useEffect(() => {
    const newSocket = io('http://localhost:5000', { reconnection: true });
    newSocket.on('connect', () => console.log('✅ FocusSync Live Sync Connected:', newSocket.id));
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  // --- 2. THE GUARDIAN (TAB SWITCH ALERT & NOTIFICATIONS) ---
  useEffect(() => {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (Notification.permission === 'granted') {
          new Notification('🚨 FOCUS LOST!', {
            body: 'Focus is being interrupted! Return to FocusSync to keep earning XP.',
            tag: 'focus-alert'
          });
        }

        document.title = "⚠️ FOCUS LOST! ⚠️";

        Swal.fire({
          title: 'Distraction Detected!',
          text: 'You left the study environment. Focus session paused.',
          icon: 'error',
          confirmButtonColor: '#10b981',
          background: '#0f172a',
          color: '#f1f5f9'
        });

        if (socket && isLoggedIn) socket.emit('status-update', { status: 'Idle' });
      } else {
        document.title = "FocusSync";
        if (socket && isLoggedIn) socket.emit('status-update', { status: 'Focused' });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [socket, isLoggedIn]);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    if (socket) {
      socket.emit('join-study-room', { 
        name: userData.username || 'Focus User', 
        avatar: localStorage.getItem('avatarSeed') || 'Jeni', 
        email: userData.email || 'user@focussync.app' 
      });
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard user={user} />;
      case 'study-room': return <StudyRoom />;
      case 'ai-quiz': return <AIQuiz />;
      case 'analytics': return <Analytics />;
      case 'settings': return <Settings />;
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
      display: 'flex',          // 1. Aligns Sidebar and Main in a row
      minHeight: '100vh', 
      background: '#020617',
      width: '100vw',           // 2. Occupies full browser width
      overflowX: 'hidden',      // 3. Prevents horizontal jitter
      boxSizing: 'border-box'
    }}>
      {/* Sidebar is fixed at 280px */}
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        user={user} 
      />
      
      {/* Main content Area: The "Gap Killer" */}
      <main style={{ 
        marginLeft: '280px',    // 4. Matches the sidebar width exactly
        flexGrow: 1,            // 5. Forces the container to expand to the right edge
        minHeight: '100vh',
        background: '#020617',
        width: 'calc(100% - 280px)', // 6. Mathematical width lock
        display: 'flex',
        flexDirection: 'column',
        padding: '0',           // 7. Remove any default padding that creates a gap
        boxSizing: 'border-box'
      }}>
        {/* We wrap the rendered page to ensure it fills 100% of the main area */}
        <div style={{ width: '100%', flexGrow: 1 }}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
} 

export default App;