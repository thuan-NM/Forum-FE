import React from 'react';

interface DateFormatterProps {
  date: Date | string;
  format?: 'short' | 'medium' | 'long' | 'relative';
  className?: string;
}

const DateFormatter: React.FC<DateFormatterProps> = ({ 
  date, 
  format = 'medium',
  className = ''
}) => {
  const formatDate = () => {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (format === 'short') {
      return dateObj.toLocaleDateString('vi-VN', {
        month: 'short',
        day: 'numeric'
      });
    }
    
    if (format === 'medium') {
      return dateObj.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    if (format === 'long') {
      return dateObj.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    if (format === 'relative') {
      const now = new Date();
      const diffMs = now.getTime() - dateObj.getTime();
      const diffSecs = Math.round(diffMs / 1000);
      const diffMins = Math.round(diffSecs / 60);
      const diffHours = Math.round(diffMins / 60);
      const diffDays = Math.round(diffHours / 24);
      
      if (diffSecs < 60) {
        return 'just now';
      } else if (diffMins < 60) {
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      } else if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
      } else {
        return dateObj.toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    }
    
    return dateObj.toLocaleDateString();
  };

  return (
    <span className={className}>
      {formatDate()}
    </span>
  );
};

export default DateFormatter;