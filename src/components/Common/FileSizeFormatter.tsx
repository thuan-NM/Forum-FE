import React from 'react';

interface FileSizeFormatterProps {
  bytes: number;
  decimals?: number;
  className?: string;
}

const FileSizeFormatter: React.FC<FileSizeFormatterProps> = ({ 
  bytes, 
  decimals = 2,
  className = ''
}) => {
  const formatFileSize = () => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  };

  return (
    <span className={className}>
      {formatFileSize()}
    </span>
  );
};

export default FileSizeFormatter;