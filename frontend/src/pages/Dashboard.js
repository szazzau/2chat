import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';
import UserCard from '../components/UserCard';

function Dashboard({ user, onLogout, onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/users`);
      // Filter out current user
      const filteredUsers = response.data.filter(u => u.id !== user.id);
      setUsers(filteredUsers);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      fetchUsers();
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/users/search/${query}`);
      const filteredUsers = response.data.filter(u => u.id !== user.id);
      setUsers(filteredUsers);
    } catch (err) {
      setError('Search failed');
    }
  };

  const filteredUsers = searchQuery 
    ? users 
    : users.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>💬 2chat</h1>
          <div className="user-info">
            <img src={user.avatar} alt={user.username} className="user-avatar" />
            <div>
              <p className="username">{user.username}</p>
              <p className="email">{user.email}</p>
            </div>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="search-section">
          <input
            type="text"
            placeholder="🔍 Search users..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading users...</div>
        ) : filteredUsers.length > 0 ? (
          <div className="users-grid">
            {filteredUsers.map(u => (
              <UserCard 
                key={u.id}
                user={u}
                onMessage={() => onSelectUser(u)}
              />
            ))}
          </div>
        ) : (
          <div className="no-users">No users found</div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
