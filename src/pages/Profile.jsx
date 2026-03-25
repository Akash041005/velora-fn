import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import './Profile.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Profile() {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    age: '',
    location: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const prefsData = localStorage.getItem('userPreferences');
    
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData(prev => ({ ...prev, name: parsedUser.name || '' }));
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
      localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
      setUser({ ...user, ...formData });
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-bg">
        <div className="bg-gradient"></div>
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
      </div>

      <div className="profile-container">
        <motion.div 
          className="profile-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="avatar-section">
            <div className="avatar">
              <span>💖</span>
            </div>
            <div className="premium-badge">✨ Premium</div>
          </div>

          <div className="profile-fields">
            <div className="field-group">
              <label>Name</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
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
                  placeholder="Your age"
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
                  placeholder="Tell about yourself..."
                  rows={3}
                />
              ) : (
                <p>{formData.bio || 'No bio yet'}</p>
              )}
            </div>
          </div>

          <button 
            className={`edit-profile-btn ${editing ? 'saving' : ''}`}
            onClick={() => editing ? handleSave() : setEditing(true)}
            disabled={loading}
          >
            {loading ? 'Saving...' : editing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </motion.div>

        <motion.div 
          className="preferences-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2>My Preferences</h2>
          <div className="preference-items">
            <div className="pref-item">
              <span className="pref-label">I am</span>
              <span className="pref-value">{preferences?.gender || 'Not set'}</span>
            </div>
            <div className="pref-item">
              <span className="pref-label">Looking for</span>
              <span className="pref-value">{preferences?.interestedIn || 'Not set'}</span>
            </div>
            <div className="pref-item">
              <span className="pref-label">Vibe</span>
              <span className="pref-value">{preferences?.style || 'Not set'}</span>
            </div>
          </div>
        </motion.div>

        <div className="profile-stats">
          <div className="stat-card">
            <span className="stat-icon">💬</span>
            <span className="stat-value">∞</span>
            <span className="stat-label">Messages</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">💕</span>
            <span className="stat-value">1</span>
            <span className="stat-label">Match</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">✨</span>
            <span className="stat-value">∞</span>
            <span className="stat-label">Super Likes</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
