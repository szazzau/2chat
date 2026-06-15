const express = require('express');
const router = express.Router();

// Mock message storage
const messages = [];

// Get messages between two users
router.get('/:userId1/:userId2', (req, res) => {
  const { userId1, userId2 } = req.params;
  const userMessages = messages.filter(m =>
    (m.from === userId1 && m.to === userId2) ||
    (m.from === userId2 && m.to === userId1)
  );
  res.json(userMessages);
});

// Send message
router.post('/', (req, res) => {
  try {
    const { from, to, message } = req.body;

    if (!from || !to || !message) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const newMessage = {
      id: Date.now().toString(),
      from,
      to,
      message,
      timestamp: new Date(),
      read: false
    };

    messages.push(newMessage);
    res.status(201).json({ message: 'Message sent', data: newMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark message as read
router.put('/:id/read', (req, res) => {
  const msg = messages.find(m => m.id === req.params.id);
  if (!msg) {
    return res.status(404).json({ message: 'Message not found' });
  }
  msg.read = true;
  res.json({ message: 'Message marked as read' });
});

// Get unread count
router.get('/unread/:userId', (req, res) => {
  const unreadCount = messages.filter(
    m => m.to === req.params.userId && !m.read
  ).length;
  res.json({ unreadCount });
});

module.exports = router;
