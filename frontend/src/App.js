import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentPage('login');
    setSelectedUser(null);
  };

  const handleChatSelect = (selectedUser) => {
    setSelectedUser(selectedUser);
    setCurrentPage('chat');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
    setSelectedUser(null);
  };

  return (
    <div className="App">
      {currentPage === 'login' && (
        <Login onLogin={handleLogin} />
      )}
      {currentPage === 'dashboard' && user && (
        <Dashboard 
          user={user} 
          onLogout={handleLogout}
          onSelectUser={handleChatSelect}
        />
      )}
      {currentPage === 'chat' && user && selectedUser && (
        <Chat 
          currentUser={user}
          selectedUser={selectedUser}
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
}

export default App;
