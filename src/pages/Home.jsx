import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Chat from './Chat';
import Profile from './Profile';
import './Home.css';

function Home() {
  const [currentView, setCurrentView] = useState('chat');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userPreferences');
    navigate('/');
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
          <span className="logo-emoji">💕</span>
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
              <Profile />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

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
                  ✕
                </button>
                <div className="menu-avatar">💖</div>
                <div className="menu-user-info">
                  <h3>{JSON.parse(localStorage.getItem('user') || '{}').name || 'User'}</h3>
                  <p>Your AI Companion</p>
                </div>
              </div>
              
              <div className="menu-options">
                <button className="menu-option" onClick={handleEditProfile}>
                  <span>👤</span> Edit Profile
                </button>
                <button className="menu-option" onClick={handleLogout}>
                  <span>🚪</span> Log Out
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
