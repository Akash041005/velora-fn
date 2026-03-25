import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Onboarding.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const genders = [
  { id: 'woman', label: 'Woman', icon: 'W', emoji: '💁‍♀️' },
  { id: 'man', label: 'Man', icon: 'M', emoji: '💁' },
  { id: 'non-binary', label: 'Non-binary', icon: 'N', emoji: '🧑' },
];

const interests = [
  { id: 'male', label: 'Male', icon: 'M', emoji: '👨' },
  { id: 'female', label: 'Female', icon: 'F', emoji: '👩' },
  { id: 'everyone', label: 'Everyone', icon: 'E', emoji: '🌈' },
];

const styles = [
  { id: 'friendly', label: 'Friendly', icon: 'F', emoji: '🤗', desc: 'Warm & caring' },
  { id: 'romantic', label: 'Romantic', icon: 'R', emoji: '💕', desc: 'Sweet & loving' },
  { id: 'flirty', label: 'Flirty', icon: 'L', emoji: '😘', desc: 'Fun & playful' },
];

function Onboarding({ onComplete }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState({
    gender: '',
    interestedIn: '',
    style: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSelect = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        await axios.put(
          `${API_URL}/auth/preferences`,
          preferences,
          { headers: { Authorization: `Bearer ${token}` }}
        );
        
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
        localStorage.setItem('onboardingComplete', 'true');
        
        if (onComplete) {
          onComplete();
        }
        navigate('/home');
      } catch (err) {
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
        localStorage.setItem('onboardingComplete', 'true');
        if (onComplete) {
          onComplete();
        }
        navigate('/home');
      } finally {
        setLoading(false);
      }
    }
  };

  const canProceed = () => {
    if (step === 0) return !!preferences.gender;
    if (step === 1) return !!preferences.interestedIn;
    if (step === 2) return !!preferences.style;
    return false;
  };

  const steps = [
    { title: 'I am a...', subtitle: 'Help me get to know you' },
    { title: 'Looking for...', subtitle: "Who's your type?" },
    { title: 'My vibe', subtitle: 'How should I act with you?' },
  ];

  const options = step === 0 ? genders : step === 1 ? interests : styles;
  const key = step === 0 ? 'gender' : step === 1 ? 'interestedIn' : 'style';

  return (
    <div className="onboarding-page">
      <div className="onboarding-bg">
        <div className="bg-gradient"></div>
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="floating-hearts">
          <span className="heart heart-1"></span>
          <span className="heart heart-2"></span>
          <span className="heart heart-3"></span>
        </div>
      </div>

      <div className="onboarding-container">
        <div className="onboarding-header">
          <div className="logo-icon-small">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="url(#heartGradientSmall)">
              <defs>
                <linearGradient id="heartGradientSmall" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff6b9d"/>
                  <stop offset="100%" stopColor="#c084fc"/>
                </linearGradient>
              </defs>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <p className="onboarding-welcome">Welcome to Velora</p>
        </div>

        <div className="progress-dots">
          {[0, 1, 2].map(i => (
            <motion.div 
              key={i} 
              className={`dot ${i <= step ? 'active' : ''}`}
              animate={{ scale: i <= step ? 1 : 0.8 }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className="step-content"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <h1>{steps[step].title}</h1>
            <p className="step-subtitle">{steps[step].subtitle}</p>

            <div className="options-grid">
              {options.map((option, index) => (
                <motion.button
                  key={option.id}
                  className={`option-chip ${preferences[key] === option.id ? 'selected' : ''}`}
                  onClick={() => handleSelect(key, option.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="option-emoji">{option.emoji}</div>
                  <span className="option-label">{option.label}</span>
                  {option.desc && <span className="option-desc">{option.desc}</span>}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="onboarding-footer">
          <motion.button
            className="continue-btn"
            onClick={handleNext}
            disabled={!canProceed() || loading}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                {step === 2 ? 'Start Chatting 💕' : 'Continue'}
                <span className="btn-arrow">→</span>
              </>
            )}
          </motion.button>
          
          {step > 0 && (
            <button className="back-btn" onClick={() => setStep(step - 1)}>
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
