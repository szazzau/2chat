import React from 'react';
import '../styles/UserCard.css';

function UserCard({ user, onMessage }) {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.username} className="card-avatar" />
      <h3>{user.username}</h3>
      <p className="card-email">{user.email}</p>
      <p className="card-bio">{user.bio}</p>
      <div className="card-status">
        <span className={`status-indicator ${user.status}`}></span>
        {user.status}
      </div>
      <button className="message-btn" onClick={onMessage}>
        💬 Message
      </button>
    </div>
  );
}

export default UserCard;
