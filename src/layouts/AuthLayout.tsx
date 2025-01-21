import React from 'react';
import { LayoutProps } from '../store/interfaces/layoutInterfaces';

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {

    return (
        <div className='flex justify-center flex-col !mx-auto !h-screen bg-[url(./bg-login.webp)]'>
            <div className='bg-[#262626] !h-5/6 w-[45%] mx-auto rounded !h-auto' data-theme={"black"}>
                <h1 className="text-6xl mb-4 text-center text-red-600 mt-8">Katz Dev</h1>
                <p className='text-center text-white text-sm font-bold mb-4'> A place to share knowledge and better understand the world</p>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;