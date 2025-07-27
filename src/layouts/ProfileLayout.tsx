import React from "react";
import { motion } from "framer-motion";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="!bg-content max-w-[1320px] mx-auto"
    >
      {children}
    </motion.div>
  );
};

export default ProfileLayout;
