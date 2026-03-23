import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Chat from './Chat';
import './Home.css';

function Home() {
  const [activeTab, setActiveTab] = useState('ai');
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-bg"></div>

      <header className="home-header">
        <div className="logo-area">
          <span className="logo-heart">💖</span>
          <h1>Velora</h1>
        </div>
      </header>

      <nav className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          <span className="tab-icon">✨</span>
          AI Partner
        </button>
        <motion.div
          className="tab-indicator"
          animate={{ x: activeTab === 'ai' ? 0 : '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </nav>

      <main className="home-content">
        {activeTab === 'ai' && <Chat />}
      </main>

      <nav className="bottom-nav">
        <button 
          className={`nav-btn ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          <span className="nav-icon">✨</span>
          <span className="nav-label">AI</span>
        </button>
        <button 
          className="nav-btn"
          onClick={() => navigate('/profile')}
        >
          <span className="nav-icon">👤</span>
          <span className="nav-label">Profile</span>
        </button>
      </nav>
    </div>
  );
}

export default Home;
