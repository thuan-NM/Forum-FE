import { Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, User } from '@heroui/react'
import { TbMessageQuestion } from "react-icons/tb";
import { BiMessageAltEdit } from "react-icons/bi";
import { GrEdit } from "react-icons/gr";
import { MdClear } from 'react-icons/md';
import { Form } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import PostModal from './Post/PostModal';

const PostManage = () => {
    const { isOpen, onOpenChange, onOpen } = useDisclosure();
    const [modalActive, setModalActive] = useState('');
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        console.log(data);
    };

    const handleModalOpen = (modal: string) => {
        setModalActive(modal);
        onOpen();
    }

    return (
        <div className='w-full h-fit py-2 bg-content2 flex border border-transparent flex-col rounded-lg px-4 hover:border hover:border-content3'>
            <div className='flex w-full'>
                <User
                    avatarProps={{
                        src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                    }}
                    description=""
                    name=""
                    className='mr-2'
                />
                <Input placeholder='What do you want to ask or share?' readOnly variant='bordered' disabled />
            </div>
            <div className="flex h-5 items-center space-x-2 text-small mt-3">
                <Button className='bg-content2 py-3 hover:bg-content3 w-full' size='sm' onPress={()=>handleModalOpen("Ask")}>
                    <TbMessageQuestion />
                    Ask
                </Button>
                <Divider orientation="vertical" />
                <Button className='bg-content2 py-3 hover:bg-content3 w-full' size='sm'>
                    <BiMessageAltEdit />
                    Answer
                </Button>
                <Divider orientation="vertical" />
                <Button className='bg-content2 py-3 hover:bg-content3 w-full' size='sm' onPress={()=>handleModalOpen("Post")}>
                    <GrEdit />
                    Post
                </Button>
                <Modal isOpen={isOpen} size={"3xl"} onOpenChange={onOpenChange} className='rounded-md' isDismissable={false} backdrop='blur' hideCloseButton isKeyboardDismissDisabled={false}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <Button isIconOnly
                                    className='border-none cursor-pointer w-fit bg-transparent ml-3 mt-3 hover:bg-neutral-700 rounded-full'
                                    onPress={onClose}
                                >
                                    <MdClear className='w-7 h-7 !text-neutral-300' />
                                </Button>
                                <ModalHeader className="flex flex-col gap-1 pt-1">
                                    <div className='flex justify-between border-b-2 border-content3'>
                                        <Button className={`bg-transparent w-1/2 rounded-none text-base font-semibold transition duration-300 ease-in-out ${modalActive=="Ask"?"border-b-2 border-blue-400 ":""}`} onPress={()=>setModalActive("Ask")}>Add Question</Button>
                                        <Button className={`bg-transparent w-1/2 rounded-none text-base font-semibold transition duration-300 ease-in-out ${modalActive=="Post"?"border-b-2 border-blue-400":""}`} onPress={()=>setModalActive("Post")}>Create Post</Button>
                                    </div>
                                </ModalHeader>
                                {modalActive=="Ask"?"":<PostModal onClose={onClose}/>}
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </div>
    )
}

export default PostManage