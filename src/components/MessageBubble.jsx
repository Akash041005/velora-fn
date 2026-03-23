import { motion } from 'framer-motion';
import './MessageBubble.css';

function MessageBubble({ message }) {
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div 
      className={`message-wrapper ${isUser ? 'user' : isAI ? 'ai' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="message-bubble">
        <p>{message.content}</p>
      </div>
      <span className="message-time">{formatTime(message.timestamp)}</span>
    </motion.div>
  );
}

export default MessageBubble;
