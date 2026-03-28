import React from 'react';
import { useStore } from '../../store/useStore';

const colors = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
];

function getHashColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  return colors[hash % colors.length];
}

export default function Avatar({ user, size = 'md' }) {
  if (!user) return null;

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  }[size] || 'w-10 h-10 text-sm';

  if (user.avatar) {
    return (
      <img 
        src={user.avatar} 
        alt={user.name} 
        className={`${sizeClasses} rounded-full object-cover`} 
      />
    );
  }

  const parts = user.name ? user.name.split(' ') : ['U'];
  const first = parts[0][0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  const initials = (first + last).toUpperCase();
  const bgColor = getHashColor(user.name || 'User');

  return (
    <div className={`${sizeClasses} ${bgColor} rounded-full flex items-center justify-center text-white font-semibold shadow-sm`}>
      {initials}
    </div>
  );
}
