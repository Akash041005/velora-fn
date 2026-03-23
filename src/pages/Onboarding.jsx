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
  { id: 'lesbian', label: 'Lesbian', emoji: '💜' },
];

const interests = [
  { id: 'male', label: 'Male', emoji: '👨' },
  { id: 'female', label: 'Female', emoji: '👩' },
  { id: 'non-binary', label: 'Non-binary', emoji: '🧑' },
  { id: 'everyone', label: 'Everyone', emoji: '🌈' },
];

const styles = [
  { id: 'friendly', label: 'Friendly', emoji: '🤗', desc: 'Warm & approachable' },
  { id: 'romantic', label: 'Romantic', emoji: '💕', desc: 'Affectionate & caring' },
  { id: 'flirty', label: 'Flirty', emoji: '😘', desc: 'Playful & exciting' },
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
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        
        await axios.put(
          `${API_URL}/auth/preferences`,
          preferences,
          { headers: { Authorization: `Bearer ${token}` }}
        );
        
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
        navigate('/home');
      } catch (err) {
        console.error('Failed to save preferences:', err);
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
    { title: 'How do you identify?', subtitle: 'This helps us personalize your experience' },
    { title: "Who's your type?", subtitle: "Tell us who you're interested in" },
    { title: 'Your vibe', subtitle: 'How would you like your AI companion to act?' },
  ];

  const options = step === 0 ? genders : step === 1 ? interests : styles;
  const key = step === 0 ? 'gender' : step === 1 ? 'interestedIn' : 'style';

  return (
    <div className="onboarding-page">
      <div className="onboarding-bg">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
      </div>

      <div className="onboarding-container">
        <div className="progress-dots">
          {[0, 1, 2].map(i => (
            <div key={i} className={`dot ${i <= step ? 'active' : ''}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className="step-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
          <button
            className="continue-btn"
            onClick={handleNext}
            disabled={!canProceed() || loading}
          >
            {loading ? 'Saving...' : step === 2 ? 'Start Journey' : 'Continue'}
            <span className="btn-arrow">→</span>
          </button>
          
          {step > 0 && (
            <button className="skip-btn" onClick={() => setStep(step - 1)}>
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
