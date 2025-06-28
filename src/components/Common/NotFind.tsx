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
      <span>No {title} available.</span>
    </div>
  );
};
export default NotFind;
