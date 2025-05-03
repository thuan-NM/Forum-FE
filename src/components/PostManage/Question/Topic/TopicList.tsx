import { Button } from '@heroui/react'
import React from 'react'
import { BsMailbox } from 'react-icons/bs'

const TopicList = () => {
    return (
        <div className='mt-6'>
            <div className='flex justify-center flex-col my-2 gap-y-1 mx-auto py-12 px-2'>
                <BsMailbox className='w-10 h-10 opacity-60 mx-auto' />
                <div className='mx-auto font-bold text-sm opacity-60'>No topics yet</div>
            </div>
            <div className='border-t border-content4 py-4'></div>
        </div>
    )
}

export default TopicList