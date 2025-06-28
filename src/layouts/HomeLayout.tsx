import { LayoutProps } from '../store/interfaces/layoutInterfaces'
import React from 'react'
import { motion } from "motion/react"
const HomeLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className='!bg-content2'>
      {children}
    </motion.div>
  )
}

export default HomeLayout