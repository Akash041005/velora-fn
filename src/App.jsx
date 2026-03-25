import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    
    if (token && user) {
      setIsAuthenticated(true);
      if (!onboardingComplete) {
        setNeedsOnboarding(true);
      }
    }
    setIsLoading(false);
  };

  const handleLoginSuccess = () => {
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    if (!onboardingComplete) {
      setNeedsOnboarding(true);
    }
    setIsAuthenticated(true);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboardingComplete', 'true');
    setNeedsOnboarding(false);
  };

  if (isLoading) {
    return (
      <div style={{
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
        color: '#ff6b9d',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'pulse 1.5s infinite' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="#ff6b9d">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated && !needsOnboarding ? (
              <Navigate to="/home" replace />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          } 
        />
        <Route 
          path="/onboarding" 
          element={
            isAuthenticated ? (
              <Onboarding onComplete={handleOnboardingComplete} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/home" 
          element={
            isAuthenticated && !needsOnboarding ? (
              <Home onLogout={() => {
                setIsAuthenticated(false);
                setNeedsOnboarding(false);
              }} />
            ) : needsOnboarding ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
