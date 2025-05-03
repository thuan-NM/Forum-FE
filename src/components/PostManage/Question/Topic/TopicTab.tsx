import { Button, useDisclosure } from '@heroui/react'
import { BsMailbox } from 'react-icons/bs';
import { GrEdit } from "react-icons/gr";
import TopicModal from './TopicModal';

const TopicTab = () => {
    const { onOpen,isOpen,onOpenChange } = useDisclosure();

    return (
        <div className='ml-6 w-full mt-4'>
            <div className='flex justify-between w-full font-semibold text-base border-b border-content4 pb-2 pl-3 !items-center'>
                <div>
                    Topics you know about
                </div>
                <div>
                    <Button isIconOnly size='sm' variant='bordered' radius='full' onPress={onOpen}><GrEdit /></Button>
                </div>
            </div>
            <div className='flex justify-center flex-col my-2 gap-y-1 mx-auto py-6 px-2'>
                <BsMailbox className='w-10 h-10 opacity-60 mx-auto' />
                <div className='mx-auto font-bold text-sm opacity-60'>No topics yet</div>
                <div className='mx-auto text-xs text-light text-center opacity-50'>You’ll get better questions if you add more specific topics.</div>
                <Button color='primary' radius='full' className='w-fit mx-auto mt-4 font-semibold' variant='bordered' onPress={onOpen}>Add topics</Button>
            </div>
            <TopicModal isOpen={isOpen} onOpenChange={onOpenChange}/>
        </div>
    )
}

export default TopicTab