import React from 'react';
import { Spinner } from '@heroui/react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  height?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  size = 'lg',
  height = 'h-[400px]'
}) => {
  return (
    <div className={`${height} flex flex-col items-center justify-center`}>
      <Spinner size={size} color="primary" />
      {message && (
        <p className="mt-4 text-default-500">{message}</p>
      )}
    </div>
  );
};

export default LoadingState;