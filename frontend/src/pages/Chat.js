import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import '../styles/Chat.css';

function Chat({ currentUser, selectedUser, onBack }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const API_URL = 'http://localhost:5000/api';
  const SOCKET_URL = 'http://localhost:5000';

  useEffect(() => {
    // Fetch message history
    fetchMessages();

    // Connect to socket
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('user_join', {
        id: currentUser.id,
        username: currentUser.username
      });
    });

    newSocket.on('receive_message', (data) => {
      if (
        (data.from === selectedUser.id && data.to === currentUser.id) ||
        (data.from === currentUser.id && data.to === selectedUser.id)
      ) {
        setMessages(prev => [...prev, data]);
      }
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [selectedUser.id, currentUser.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/messages/${currentUser.id}/${selectedUser.id}`
      );
      setMessages(response.data);
    } catch (err) {
      console.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const messageData = {
      from: currentUser.id,
      to: selectedUser.id,
      message: inputMessage,
      timestamp: new Date()
    };

    // Emit via socket
    if (socket) {
      socket.emit('send_message', messageData);
    }

    // Add to local state
    setMessages(prev => [...prev, messageData]);
    setInputMessage('');

    // Save to backend
    axios.post(`${API_URL}/messages`, messageData).catch(err => {
      console.error('Failed to save message');
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="chat-user-info">
          <img src={selectedUser.avatar} alt={selectedUser.username} />
          <div>
            <h2>{selectedUser.username}</h2>
            <p className="status">{selectedUser.status}</p>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {loading ? (
          <div className="loading">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="no-messages">
            No messages yet. Start the conversation! 👋
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.from === currentUser.id ? 'sent' : 'received'}`}
            >
              <div className="message-content">{msg.message}</div>
              <small className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </small>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="message-input"
        />
        <button type="submit" className="send-btn">
          Send →
        </button>
      </form>
    </div>
  );
}

export default Chat;
