import { motion } from "framer-motion";
import React from "react";
import { LayoutProps } from "../store/interfaces/layoutInterfaces";
const AnswerLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {children}
        </motion.div>)
}

export default AnswerLayout