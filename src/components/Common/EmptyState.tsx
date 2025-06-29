import React from 'react';
import { Button, Card } from '@heroui/react';
import { Icon } from '@iconify/react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon = 'lucide:inbox', 
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="p-4 rounded-full mb-4">
        <Icon icon={icon} className="w-8 h-8 text-default-500" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-default-500 mb-6 max-w-md">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button color="primary" onPress={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;