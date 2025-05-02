import { Button } from '@heroui/react'
import { BsMailbox } from 'react-icons/bs'

const AnswerRequestsNotThings = () => {
    return (
        <div className=''>
            <div className='flex justify-center flex-col my-10 gap-y-1 mt-20 w-11/12 mx-auto'>
                <BsMailbox className='w-24 h-24 text-content4 mx-auto' />
                <div className='mx-auto font-bold text-lg text-content4'>Answer Requests</div>
                <div className='mx-auto text-md text-light text-center opacity-50'>Ask for answers from other users by clicking Request Answer on a question. Requests you receive will show up here.</div>
                <Button color='primary' radius='full' className='w-fit mx-auto mt-4 font-semibold'>See Top Questions</Button>
            </div>
        </div>
    )
}

export default AnswerRequestsNotThings