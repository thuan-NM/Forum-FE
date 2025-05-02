import { Button, Input, ModalBody, ModalHeader } from '@heroui/react';
import React from 'react';
import { IoIosSearch, IoIosLink } from 'react-icons/io';
import { BsMailbox } from "react-icons/bs";
import { useGroupContext } from '../../context/GroupContext';

const GroupContributors: React.FC<{ onClose: () => void; setActive: (data: 'create' | 'contributors') => void }> = ({ onClose, setActive }) => {
    const { formData } = useGroupContext(); // Lấy formData từ context

    const handleClose = () => {
        onClose();
        setActive('create');
    };

    return (
        <div>
            <ModalHeader className="flex flex-col gap-2 pt-1">
                <div className='text-xl'>Invite Contributors to {formData?.name}</div>
                <div className='text-base font-light'>
                    Contributors can add content to the Space. Inviting more contributors can encourage discussions and grow content.
                </div>
                <Input
                    isClearable
                    labelPlacement="outside"
                    placeholder="Search by name..."
                    startContent={
                        <IoIosSearch />
                    }
                    variant='bordered'
                    type="text"
                    className='rounded-xl w-full mt-2'
                />
            </ModalHeader>
            <ModalBody className='px-0 gap-0 py-0'>
                <div className='border-y border-content3 px-6 py-3'>
                    <div className='flex justify-between '>
                        <div className='flex text-base font-semibold gap-x-2 items-center '>
                            <IoIosLink />
                            <div>Get invite link</div>
                        </div>
                        <div>
                            <Button color='primary' variant='bordered' radius='full' size='sm' className='font-bold'>Copy</Button>
                        </div>
                    </div>
                </div>
                <div className='bg-content2 px-6 py-3 text-xs'>0 selected</div>
                <div className='flex justify-center flex-col my-10 gap-y-1'>
                    <BsMailbox className='text-5xl text-content4 mx-auto' />
                    <div className='mx-auto font-bold text-base text-content4'>No Suggestions</div>
                    <div className='mx-auto text-xs text-light'>You are out of follower suggestions. To invite someone you know, use the invite link.</div>
                </div>
                <div className='flex justify-end px-6 border-t border-content3 py-3'>
                    <Button className='border-none bg-tranparent hover:bg-content2 px-0  text-base font-semibold opacity-60' radius='full' size='md' onPress={handleClose}>Skip</Button>
                    <Button color='primary' radius='full' size='md' onPress={handleClose}>Preview invite</Button>
                </div>
            </ModalBody>
        </div>
    )
}

export default GroupContributors 