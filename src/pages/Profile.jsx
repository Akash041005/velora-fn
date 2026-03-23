import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    age: '',
    location: '',
    interests: [],
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const prefsData = localStorage.getItem('userPreferences');
    
    if (userData) {
      setUser(JSON.parse(userData));
      setFormData(prev => ({ ...prev, name: JSON.parse(userData).name || '' }));
    }
    
    if (prefsData) {
      setPreferences(JSON.parse(prefsData));
    }
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/auth/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditing(false);
    } catch (err) {
      console.error('Failed to save profile:', err);
      localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
      setUser({ ...user, ...formData });
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userPreferences');
    navigate('/');
  };

  return (
    <div className="profile-page">
      <div className="profile-bg">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
      </div>

      <div className="profile-container">
        <header className="profile-header">
          <button className="back-btn" onClick={() => navigate('/home')}>
            ← Back
          </button>
          <h1>Profile</h1>
          <button 
            className="edit-btn" 
            onClick={() => editing ? handleSave() : setEditing(true)}
          >
            {editing ? 'Save' : 'Edit'}
          </button>
        </header>

        <motion.div 
          className="profile-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="avatar-section">
            <div className="avatar">
              <span>💖</span>
            </div>
            {editing && (
              <button className="change-photo-btn">Change Photo</button>
            )}
          </div>

          <div className="profile-fields">
            <div className="field-group">
              <label>Name</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              ) : (
                <p>{user?.name || 'Not set'}</p>
              )}
            </div>

            <div className="field-group">
              <label>Age</label>
              {editing ? (
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Enter your age"
                />
              ) : (
                <p>{formData.age || 'Not set'}</p>
              )}
            </div>

            <div className="field-group">
              <label>Location</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, Country"
                />
              ) : (
                <p>{formData.location || 'Not set'}</p>
              )}
            </div>

            <div className="field-group">
              <label>Bio</label>
              {editing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              ) : (
                <p>{formData.bio || 'No bio yet'}</p>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="preferences-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2>Preferences</h2>
          <div className="preference-items">
            <div className="pref-item">
              <span className="pref-label">I am a</span>
              <span className="pref-value">{preferences?.gender || 'Not set'}</span>
            </div>
            <div className="pref-item">
              <span className="pref-label">Interested in</span>
              <span className="pref-value">{preferences?.interestedIn || 'Not set'}</span>
            </div>
            <div className="pref-item">
              <span className="pref-label">AI Vibe</span>
              <span className="pref-value">{preferences?.style || 'Not set'}</span>
            </div>
          </div>
        </motion.div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
