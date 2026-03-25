import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Onboarding.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const genders = [
  { id: 'woman', label: 'Woman', emoji: '👩' },
  { id: 'man', label: 'Man', emoji: '👨' },
  { id: 'non-binary', label: 'Non-binary', emoji: '🧑' },
];

const interests = [
  { id: 'male', label: 'Male', emoji: '👨' },
  { id: 'female', label: 'Female', emoji: '👩' },
  { id: 'everyone', label: 'Everyone', emoji: '🌈' },
];

const styles = [
  { id: 'friendly', label: 'Friendly', emoji: '🤗', desc: 'Warm & caring' },
  { id: 'romantic', label: 'Romantic', emoji: '💕', desc: 'Sweet & loving' },
  { id: 'flirty', label: 'Flirty', emoji: '😘', desc: 'Fun & playful' },
];

function Onboarding() {
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
        navigate('/home');
      } catch (err) {
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
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
    { title: 'I am a...', subtitle: 'Help us find your perfect match' },
    { title: 'Looking for...', subtitle: "Who's your type?" },
    { title: 'My vibe', subtitle: 'How should Velora act with you?' },
  ];

  const options = step === 0 ? genders : step === 1 ? interests : styles;
  const key = step === 0 ? 'gender' : step === 1 ? 'interestedIn' : 'style';

  return (
    <div className="onboarding-page">
      <div className="onboarding-bg">
        <div className="bg-gradient"></div>
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
      </div>

      <div className="onboarding-container">
        <div className="onboarding-logo">
          <span className="logo-emoji">💕</span>
          <span className="logo-text">Velora</span>
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
                  <span className="option-emoji">{option.emoji}</span>
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
                {step === 2 ? 'Start Chatting' : 'Continue'}
                <span className="btn-icon">→</span>
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
