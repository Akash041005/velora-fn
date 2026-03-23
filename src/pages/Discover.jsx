import { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import './Discover.css';

const mockProfiles = [
  {
    id: 1,
    name: 'Sarah',
    age: 24,
    bio: 'Coffee addict ☕ Dog lover 🐕 Living life one adventure at a time',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop',
  },
  {
    id: 2,
    name: 'Emma',
    age: 26,
    bio: 'Travel enthusiast ✈️ Foodie 🍕 Looking for someone to explore with',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop',
  },
  {
    id: 3,
    name: 'Olivia',
    age: 23,
    bio: 'Artist 🎨 Beach vibes 🏖️ Let\'s create some memories',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop',
  },
  {
    id: 4,
    name: 'Sophia',
    age: 25,
    bio: 'Bookworm 📚 Cat mom 🐱 Netflix and chill enthusiast',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop',
  },
];

function SwipeCard({ profile, onSwipe }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_, info) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipe('like');
    } else if (info.offset.x < -threshold) {
      onSwipe('pass');
    }
  };

  return (
    <motion.div
      className="swipe-card"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02 }}
    >
      <div className="card-image">
        <img src={profile.image} alt={profile.name} />
        <div className="card-overlay"></div>
        
        <motion.div className="stamp like-stamp" style={{ opacity: likeOpacity }}>
          <span>❤️ LIKE</span>
        </motion.div>
        
        <motion.div className="stamp nope-stamp" style={{ opacity: nopeOpacity }}>
          <span>❌ NOPE</span>
        </motion.div>
      </div>
      
      <div className="card-info">
        <h2>{profile.name}, <span>{profile.age}</span></h2>
        <p>{profile.bio}</p>
      </div>
    </motion.div>
  );
}

function Discover() {
  const [profiles, setProfiles] = useState(mockProfiles);
  const [lastDirection, setLastDirection] = useState(null);

  const handleSwipe = (direction) => {
    setLastDirection(direction);
    setTimeout(() => {
      setProfiles(prev => prev.slice(1));
      setLastDirection(null);
    }, 300);
  };

  const currentProfile = profiles[0];

  return (
    <div className="discover-screen">
      <div className="cards-container">
        <AnimatePresence>
          {currentProfile && (
            <SwipeCard 
              key={currentProfile.id} 
              profile={currentProfile} 
              onSwipe={handleSwipe}
            />
          )}
        </AnimatePresence>
        
        {!currentProfile && (
          <div className="no-more-cards">
            <span className="empty-heart">💔</span>
            <h3>No more profiles</h3>
            <p>Check back later for new matches</p>
          </div>
        )}
      </div>

      <div className="swipe-actions">
        <button 
          className="action-btn pass-btn"
          onClick={() => handleSwipe('pass')}
          disabled={!currentProfile}
        >
          <span>✕</span>
        </button>
        <button 
          className="action-btn super-like-btn"
          onClick={() => handleSwipe('super')}
          disabled={!currentProfile}
        >
          <span>⭐</span>
        </button>
        <button 
          className="action-btn like-btn"
          onClick={() => handleSwipe('like')}
          disabled={!currentProfile}
        >
          <span>♥</span>
        </button>
      </div>
    </div>
  );
}

export default Discover;
