const express = require('express');
const router = express.Router();

// Mock database
const users = [
  {
    id: '1',
    username: 'alice',
    email: 'alice@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    bio: 'Welcome to 2chat! 🚀',
    status: 'online'
  },
  {
    id: '2',
    username: 'bob',
    email: 'bob@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    bio: 'Love connecting with people',
    status: 'online'
  },
  {
    id: '3',
    username: 'charlie',
    email: 'charlie@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
    bio: 'Tech enthusiast',
    status: 'offline'
  }
];

// Get all users
router.get('/', (req, res) => {
  res.json(users);
});

// Get user by ID
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

// Search users
router.get('/search/:query', (req, res) => {
  const query = req.params.query.toLowerCase();
  const results = users.filter(u =>
    u.username.toLowerCase().includes(query) ||
    u.email.toLowerCase().includes(query)
  );
  res.json(results);
});

// Update user
router.put('/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { username, bio, status } = req.body;
  if (username) user.username = username;
  if (bio) user.bio = bio;
  if (status) user.status = status;

  res.json({ message: 'User updated', user });
});

module.exports = router;
