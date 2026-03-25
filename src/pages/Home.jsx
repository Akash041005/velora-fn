import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Chat from './Chat';
import Profile from './Profile';
import './Home.css';

function Home({ onLogout }) {
  const [currentView, setCurrentView] = useState('chat');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userPreferences');
    localStorage.removeItem('onboardingComplete');
    if (onLogout) {
      onLogout();
    }
  };

  const handleEditProfile = () => {
    setMenuOpen(false);
    setCurrentView('profile');
  };

  return (
    <div className="app-container">
      <div className="app-bg"></div>
      
      <header className="app-header">
        <button className="menu-btn" onClick={() => setMenuOpen(true)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="app-logo">
          <div className="logo-icon-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="url(#heartGradientHeader)">
              <defs>
                <linearGradient id="heartGradientHeader" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff6b9d"/>
                  <stop offset="100%" stopColor="#c084fc"/>
                </linearGradient>
              </defs>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <span className="logo-text">Velora</span>
        </div>
        <div className="header-spacer"></div>
      </header>

      <main className="app-main">
        <AnimatePresence mode="wait">
          {currentView === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="view-container"
            >
              <Chat />
            </motion.div>
          )}
          {currentView === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="view-container"
            >
              <Profile onBack={() => setCurrentView('chat')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <nav className="bottom-nav">
        <button 
          className={`nav-btn ${currentView === 'chat' ? 'active' : ''}`}
          onClick={() => setCurrentView('chat')}
        >
          <div className="nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
          <span className="nav-label">Chat</span>
        </button>
        <button 
          className={`nav-btn ${currentView === 'profile' ? 'active' : ''}`}
          onClick={() => setCurrentView('profile')}
        >
          <div className="nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <span className="nav-label">Profile</span>
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          >
            <motion.div 
              className="side-menu"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="menu-header">
                <button className="close-menu" onClick={() => setMenuOpen(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
                <div className="menu-avatar">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <div className="menu-user-info">
                  <h3>{JSON.parse(localStorage.getItem('user') || '{}').name || 'User'}</h3>
                  <p>Your AI Companion</p>
                </div>
              </div>
              
              <div className="menu-options">
                <button className="menu-option" onClick={handleEditProfile}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  Edit Profile
                </button>
                <button className="menu-option logout" onClick={handleLogout}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                  </svg>
                  Log Out
                </button>
              </div>

              <div className="menu-footer">
                <p className="app-version">Velora v1.0</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;
