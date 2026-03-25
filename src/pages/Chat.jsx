import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import MessageBubble from '../components/MessageBubble';
import './Chat.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [token, setToken] = useState(null);
  const [currentLang, setCurrentLang] = useState('english');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      loadMessages(storedToken);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async (authToken) => {
    try {
      const { data } = await axios.get(`${API_URL}/chat/messages`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (data.messages?.length > 0) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.log('No previous messages');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping || !token) return;

    const userMessage = {
      id: Date.now(),
      content: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const { data } = await axios.post(`${API_URL}/chat/send`,
        { content: input.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (data.aiMessage) {
        setMessages(prev => [...prev, data.aiMessage]);
        if (data.aiContext?.language) {
          setCurrentLang(data.aiContext.language);
        }
      }
    } catch (err) {
      const fallbackMessage = {
        id: Date.now(),
        content: "Hmm, something's not working... Try sending that again?",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="chat-container">
      <div className="velora-header">
        <div className="velora-avatar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <div className="online-badge"></div>
        </div>
        <div className="velora-info">
          <h3>Velora</h3>
          <span className="velora-status">
            <span className="language-badge">{currentLang}</span>
            Online
          </span>
        </div>
      </div>

      <div className="chat-messages" ref={messagesEndRef}>
        {messages.length === 0 && (
          <div className="empty-chat">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="url(#heartGradientChat)">
                <defs>
                  <linearGradient id="heartGradientChat" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff6b9d"/>
                    <stop offset="100%" stopColor="#c084fc"/>
                  </linearGradient>
                </defs>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <p className="empty-title">Say hello to Velora</p>
            <p className="empty-subtitle">She is waiting to chat with you</p>
          </div>
        )}
        
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, type: 'spring', damping: 25 }}
              className={msg.sender === 'user' ? 'user-message-wrapper' : 'ai-message-wrapper'}
            >
              <MessageBubble message={msg} />
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            className="ai-message-wrapper"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="typing-bubble">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} style={{ height: 1 }} />
      </div>

      <form className="message-input-form" onSubmit={handleSend}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Say something sweet..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
          autoCorrect="on"
          autoCapitalize="sentences"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isTyping}
          className="send-btn"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
        </button>
      </form>
    </div>
  );
}

export default Chat;
