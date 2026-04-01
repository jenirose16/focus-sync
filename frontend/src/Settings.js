import React, { useState, useEffect } from 'react';
import { Bell, Key, Moon, User, LogOut, Save, Grid3x3 } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    displayName: 'Jeni Rose',
    email: 'jeni.rose@focussync.app',
    darkMode: true,
    emailNotifications: true,
    pushNotifications: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [xpCounter] = useState(2500);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState('Jeni');
  const [showAvatarGallery, setShowAvatarGallery] = useState(false);
  const avatarSeeds = ['Jeni', 'Rose', 'Sync', 'Elite', 'Scholar'];

  useEffect(() => {
    const saved = localStorage.getItem('avatarSeed') || 'Jeni';
    setAvatarSeed(saved);
  }, []);

  const handleAvatarSelect = (seed) => {
    setAvatarSeed(seed);
    localStorage.setItem('avatarSeed', seed);
    window.dispatchEvent(new Event('storage'));
    setShowAvatarGallery(false);
    handleSave();
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleToggle = (field) => {
    setSettings(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleChangePassword = () => {
    if (settings.newPassword !== settings.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password changed successfully!');
    setSettings(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
    handleSave();
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
          <span style={{ color: '#10b981' }}>⚙️</span>
          Settings
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          Manage your account and application preferences
        </p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div style={{
          padding: '1rem 1.5rem',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '10px',
          color: '#10b981',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '14px',
        }}>
          ✓ Settings saved successfully!
        </div>
      )}

      {/* Settings Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '1200px' }}>
        {/* Profile Section */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}>
            <User size={24} color="#10b981" />
            <h2 style={{
              color: '#f1f5f9',
              fontSize: '18px',
              fontWeight: '700',
              margin: 0,
            }}>
              Profile
            </h2>
          </div>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Avatar */}
            <div style={{ textAlign: 'center' }}>
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                alt="Profile Avatar"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  border: '3px solid #10b981',
                  marginBottom: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => setShowAvatarGallery(true)}
              />
              <button
                onClick={() => setShowAvatarGallery(true)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10b981',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  margin: '0 auto',
                }}
              >
                <Grid3x3 size={14} />
                Choose Avatar
              </button>

              {/* Avatar Gallery Modal */}
              {showAvatarGallery && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2000,
                  backdropFilter: 'blur(4px)',
                }}
                onClick={() => setShowAvatarGallery(false)}
                >
                  <div
                    className="glass-card"
                    style={{
                      padding: '2rem',
                      maxWidth: '500px',
                      width: '90%',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 style={{
                      color: '#f1f5f9',
                      fontSize: '18px',
                      fontWeight: '700',
                      marginBottom: '1.5rem',
                    }}>
                      Choose Your Avatar
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(5, 1fr)',
                      gap: '1rem',
                      marginBottom: '1.5rem',
                    }}>
                      {avatarSeeds.map(seed => (
                        <div
                          key={seed}
                          onClick={() => handleAvatarSelect(seed)}
                          style={{
                            cursor: 'pointer',
                            border: avatarSeed === seed ? '3px solid #10b981' : '2px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '12px',
                            padding: '0.5rem',
                            background: avatarSeed === seed ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#10b981';
                            e.currentTarget.style.background = 'rgba(16, 185, 129, 0.05)';
                          }}
                          onMouseLeave={(e) => {
                            if (avatarSeed !== seed) {
                              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.2)';
                              e.currentTarget.style.background = 'transparent';
                            }
                          }}
                        >
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                            alt={seed}
                            style={{
                              width: '100%',
                              height: 'auto',
                              borderRadius: '8px',
                            }}
                          />
                          <p style={{
                            color: '#cbd5e1',
                            fontSize: '12px',
                            fontWeight: '600',
                            marginTop: '0.5rem',
                            textAlign: 'center',
                          }}>
                            {seed}
                          </p>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowAvatarGallery(false)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'transparent',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#10b981',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Display Name */}
            <div>
              <label style={{
                display: 'block',
                color: '#cbd5e1',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '0.5rem',
              }}>
                Display Name
              </label>
              <input
                type="text"
                value={settings.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  color: '#e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                  e.target.style.background = 'rgba(15, 23, 42, 1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(16, 185, 129, 0.2)';
                  e.target.style.background = 'rgba(15, 23, 42, 0.8)';
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{
                display: 'block',
                color: '#cbd5e1',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '0.5rem',
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  color: '#e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                  e.target.style.background = 'rgba(15, 23, 42, 1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(16, 185, 129, 0.2)';
                  e.target.style.background = 'rgba(15, 23, 42, 0.8)';
                }}
              />
            </div>

            {/* XP Counter */}
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
                letterSpacing: '0.5px',
                margin: '0 0 0.5rem 0',
              }}>
                Total XP Earned
              </p>
              <p style={{
                color: '#10b981',
                fontSize: '24px',
                fontWeight: '700',
                margin: 0,
              }}>
                {xpCounter.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* App Settings Section */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}>
            <Moon size={24} color="#10b981" />
            <h2 style={{
              color: '#f1f5f9',
              fontSize: '18px',
              fontWeight: '700',
              margin: 0,
            }}>
              App Settings
            </h2>
          </div>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Dark Mode */}
            <div
              onClick={() => {
                handleToggle('darkMode');
                document.body.classList.toggle('light-mode');
                localStorage.setItem('darkMode', !settings.darkMode);
              }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: 'rgba(15, 23, 42, 0.5)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
              }}>
              <div>
                <p style={{
                  color: '#e2e8f0',
                  fontSize: '14px',
                  fontWeight: '600',
                  margin: 0,
                }}>
                  {settings.darkMode ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p style={{
                  color: '#94a3b8',
                  fontSize: '12px',
                  margin: '0.25rem 0 0 0',
                }}>
                  {settings.darkMode ? 'Click to enable light mode' : 'Click to enable dark mode'}
                </p>
              </div>
              <div style={{
                width: '44px',
                height: '24px',
                background: settings.darkMode ? '#10b981' : '#64748b',
                borderRadius: '12px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.3s ease',
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  background: 'white',
                  borderRadius: '50%',
                  position: 'absolute',
                  right: settings.darkMode ? '2px' : 'auto',
                  left: settings.darkMode ? 'auto' : '2px',
                  top: '2px',
                  transition: 'all 0.2s ease',
                }} />
              </div>
            </div>

            {/* Notifications */}
            <div>
              <h3 style={{
                color: '#e2e8f0',
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <Bell size={16} color="#10b981" />
                Notifications
              </h3>

              <div style={{
                display: 'grid',
                gap: '1rem',
              }}>
                {/* Email Notifications */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}>
                  <div>
                    <p style={{
                      color: '#cbd5e1',
                      fontSize: '13px',
                      fontWeight: '500',
                      margin: 0,
                    }}>
                      Email Notifications
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('emailNotifications')}
                    style={{
                      width: '44px',
                      height: '24px',
                      background: settings.emailNotifications ? '#10b981' : '#475569',
                      border: 'none',
                      borderRadius: '12px',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      background: 'white',
                      borderRadius: '50%',
                      position: 'absolute',
                      right: settings.emailNotifications ? '2px' : 'auto',
                      left: settings.emailNotifications ? 'auto' : '2px',
                      top: '2px',
                      transition: 'all 0.2s ease',
                    }} />
                  </button>
                </div>

                {/* Push Notifications */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}>
                  <div>
                    <p style={{
                      color: '#cbd5e1',
                      fontSize: '13px',
                      fontWeight: '500',
                      margin: 0,
                    }}>
                      Push Notifications
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('pushNotifications')}
                    style={{
                      width: '44px',
                      height: '24px',
                      background: settings.pushNotifications ? '#10b981' : '#475569',
                      border: 'none',
                      borderRadius: '12px',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      background: 'white',
                      borderRadius: '50%',
                      position: 'absolute',
                      right: settings.pushNotifications ? '2px' : 'auto',
                      left: settings.pushNotifications ? 'auto' : '2px',
                      top: '2px',
                      transition: 'all 0.2s ease',
                    }} />
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
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
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>

        {/* Account Security Section - Spans Two Columns */}
        <div className="glass-card" style={{
          padding: '2rem',
          gridColumn: '1 / -1',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}>
            <Key size={24} color="#10b981" />
            <h2 style={{
              color: '#f1f5f9',
              fontSize: '18px',
              fontWeight: '700',
              margin: 0,
            }}>
              Account Security
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '1.5rem',
          }}>
            {/* Current Password */}
            <div>
              <label style={{
                display: 'block',
                color: '#cbd5e1',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '0.5rem',
              }}>
                Current Password
              </label>
              <input
                type="password"
                value={settings.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  color: '#e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                  e.target.style.background = 'rgba(15, 23, 42, 1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(16, 185, 129, 0.2)';
                  e.target.style.background = 'rgba(15, 23, 42, 0.8)';
                }}
              />
            </div>

            {/* New Password */}
            <div>
              <label style={{
                display: 'block',
                color: '#cbd5e1',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '0.5rem',
              }}>
                New Password
              </label>
              <input
                type="password"
                value={settings.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  color: '#e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                  e.target.style.background = 'rgba(15, 23, 42, 1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(16, 185, 129, 0.2)';
                  e.target.style.background = 'rgba(15, 23, 42, 0.8)';
                }}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{
                display: 'block',
                color: '#cbd5e1',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '0.5rem',
              }}>
                Confirm New Password
              </label>
              <input
                type="password"
                value={settings.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  color: '#e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                  e.target.style.background = 'rgba(15, 23, 42, 1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(16, 185, 129, 0.2)';
                  e.target.style.background = 'rgba(15, 23, 42, 0.8)';
                }}
              />
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            style={{
              marginTop: '1.5rem',
              padding: '0.875rem 1.5rem',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
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
              e.target.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Update Password
          </button>
        </div>

        {/* Logout Section */}
        <div className="glass-card" style={{
          padding: '2rem',
          gridColumn: '1 / -1',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h3 style={{
              color: '#f1f5f9',
              fontSize: '16px',
              fontWeight: '700',
              margin: 0,
              marginBottom: '0.25rem',
            }}>
              Logout
            </h3>
            <p style={{
              color: '#94a3b8',
              fontSize: '13px',
              margin: 0,
            }}>
              Sign out from your current session
            </p>
          </div>
          <button
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;