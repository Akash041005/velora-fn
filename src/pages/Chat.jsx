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
          content: "Hey there! 💕 I'm Velora, your AI companion. I'm so happy you're here! Tell me about yourself - what's on your mind?",
          sender: 'ai',
          timestamp: new Date(),
        }]);
      }
    } catch (err) {
      setMessages([{
        id: 1,
        content: "Hey there! 💕 I'm Velora, your AI companion. I'm so happy you're here! Tell me about yourself - what's on your mind?",
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
    }
  };

  return (
    <div className="chat-screen">
      <div className="chat-partner-info">
        <div className="partner-avatar">
          <span>💖</span>
        </div>
        <div className="partner-details">
          <h3>Velora</h3>
          <span className="status online">
            <span className="status-dot"></span>
            Online
          </span>
        </div>
      </div>

      <div className="messages-area">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <MessageBubble message={msg} />
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            className="typing-indicator"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="typing-content">
              <span>Velora is typing</span>
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Message Velora..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={!input.trim() || isTyping}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default Chat;
