import React from 'react';
import { Chip } from '@heroui/react';

interface ContentTypeChipProps {
  type: 'post' | 'comment' | 'user' | 'question' | 'answer' | 'topic' | 'tag';
  variant?: 'flat' | 'solid' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
}

const ContentTypeChip: React.FC<ContentTypeChipProps> = ({ 
  type, 
  variant = 'flat',
  size = 'sm'
}) => {
  const getTypeColor = () => {
    switch (type) {
      case 'post': return 'primary';
      case 'comment': return 'secondary';
      case 'user': return 'danger';
      case 'question': return 'success';
      case 'answer': return 'warning';
      case 'topic': return 'success';
      case 'tag': return 'primary';
      default: return 'default';
    }
  };

  return (
    <Chip
      color={getTypeColor()}
      variant={variant}
      size={size}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Chip>
  );
};

export default ContentTypeChip;