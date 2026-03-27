import React from 'react';
import clsx from 'clsx';

export default function Avatar({ src, name, size = 'md', className }) {
  const getInitials = (n) => {
    if (!n) return '?';
    const parts = n.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  const getBackgroundColor = (n) => {
    const colors = [
      'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 
      'bg-rose-500', 'bg-emerald-500', 'bg-amber-500'
    ];
    let hash = 0;
    for (let i = 0; i < (n || '').length; i++) {
      hash = n.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const sizeClass = sizes[size] || sizes.md;

  if (src) {
    return (
      <img 
        src={src} 
        alt={name} 
        className={clsx(`${sizeClass} rounded-full object-cover shadow-sm`, className)} 
      />
    );
  }

  return (
    <div className={clsx(`${sizeClass} rounded-full flex items-center justify-center text-white font-medium shadow-sm`, getBackgroundColor(name), className)}>
      {getInitials(name)}
    </div>
  );
}
