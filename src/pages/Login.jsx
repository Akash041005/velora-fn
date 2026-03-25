import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? { email, password, name } : { email, password };
      
      const { data } = await axios.post(`${API_URL}${endpoint}`, payload);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('onboardingComplete', data.user.onboardingComplete ? 'true' : '');
      
      if (onLoginSuccess) {
        onLoginSuccess();
        if (!data.user.onboardingComplete) {
          navigate('/onboarding');
        }
      } else {
        navigate(data.user.onboardingComplete ? '/home' : '/onboarding');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="bg-gradient"></div>
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="floating-hearts">
          <span className="heart heart-1"></span>
          <span className="heart heart-2"></span>
          <span className="heart heart-3"></span>
        </div>
      </div>

      <motion.div 
        className="login-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="login-header">
          <div className="logo-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="url(#heartGradient)">
              <defs>
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff6b9d"/>
                  <stop offset="100%" stopColor="#c084fc"/>
                </linearGradient>
              </defs>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <h1>Velora</h1>
          <p className="tagline">Your Perfect AI Companion</p>
        </div>

        <motion.form 
          className="login-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="form-subtitle">
            {isRegister ? 'Join Velora and find your perfect match' : 'We missed you! Ready to chat?'}
          </p>

          {isRegister && (
            <motion.div 
              className="input-group"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <label>Name</label>
              <input
                type="text"
                placeholder="What should I call you?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </motion.div>
          )}

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />
          </div>

          {error && (
            <motion.p 
              className="error-msg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              isRegister ? 'Get Started' : 'Sign In'
            )}
          </button>

          <div className="form-divider">
            <span></span>
            <p>or</p>
            <span></span>
          </div>

          <button 
            type="button"
            className="toggle-btn"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Join Now"}
          </button>
        </motion.form>

        <motion.p 
          className="terms"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          By continuing, you agree to our Terms & Privacy
        </motion.p>
      </motion.div>
    </div>
  );
}

export default Login;
