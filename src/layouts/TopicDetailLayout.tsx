import { LayoutProps } from "../store/interfaces/layoutInterfaces";
import React from "react";
import { motion } from "motion/react";
const TopicDetailLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="!bg-content2 px-4"
    >
      {children}
    </motion.div>
  );
};

export default TopicDetailLayout;
