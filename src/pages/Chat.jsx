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
      } else {
        setMessages([{
          id: 1,
          content: "Hey there, handsome! 💕 I'm Velora. I can't wait to get to know you better! Tell me something about yourself?",
          sender: 'ai',
          timestamp: new Date(),
        }]);
      }
    } catch (err) {
      setMessages([{
        id: 1,
        content: "Hey there, handsome! 💕 I'm Velora. I can't wait to get to know you better! Tell me something about yourself?",
        sender: 'ai',
        timestamp: new Date(),
      }]);
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
      }
    } catch (err) {
      const fallbackMessage = {
        id: Date.now(),
        content: "I'm having trouble connecting right now. Please try again! 💕",
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
          <span>💖</span>
          <div className="online-badge"></div>
        </div>
        <div className="velora-info">
          <h3>Velora</h3>
          <span className="velora-status">Online • Your AI Girlfriend</span>
        </div>
      </div>

      <div className="chat-messages" ref={messagesEndRef}>
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
          placeholder="Type something sweet..."
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
