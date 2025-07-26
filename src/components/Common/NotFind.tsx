import React from "react";

interface NotFindProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
}

const NotFind: React.FC<NotFindProps> = ({ className, icon, title }) => {
  return (
    <div className={className}>
      {icon}
      <span>{title}</span>
    </div>
  );
};
export default NotFind;
