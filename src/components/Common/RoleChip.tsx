import React from 'react';
import { Chip } from '@heroui/react';

interface RoleChipProps {
  role: string;
  variant?: 'flat' | 'solid' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
}

const RoleChip: React.FC<RoleChipProps> = ({
  role,
  variant = 'flat',
  size = 'sm'
}) => {
  const getRoleColor = () => {
    switch (role.toLowerCase()) {
      case 'admin': return 'danger';
      case 'employee': return 'warning';
      case 'user': return 'primary';
      default: return 'secondary';
    }
  };

  return (
    <Chip
      color={getRoleColor()}
      variant={variant}
      size={size}
    >
      {role}
    </Chip>
  );
};

export default RoleChip;