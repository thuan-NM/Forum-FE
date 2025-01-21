import { LayoutProps } from '../store/interfaces/layoutInterfaces'
import React from 'react'

const HomeLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default HomeLayout