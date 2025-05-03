import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader, User } from '@heroui/react'
import TiptapEditor from '../../TextEditor/Tiptap';
import { AnimatePresence } from "motion/react"
import * as motion from "motion/react-client"
import { TiEdit } from "react-icons/ti";
import { SlClose } from "react-icons/sl";
import { useState } from 'react';
import MenuBar from '../../TextEditor/MenuBar';
import { MdClear } from 'react-icons/md';
import EditorModal from '../../TextEditor/EditorModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreatePost } from '../../../services/PostServices';
import toast from 'react-hot-toast';
import { PostFormData } from '../../../store/interfaces/postInterfaces';
import { GrLanguage } from 'react-icons/gr';

interface PostModalProps {
    setModalActive: (arg0: string) => void;
}

const PostModal: React.FC<PostModalProps> = ({ setModalActive }) => {
    const [isVisible, setIsVisible] = useState<boolean>(true)
    const [editor, setEditor] = useState<any>(null)
    const [openImage, setOpenImage] = useState<boolean>(false)
    const [openYoutube, setOpenYoutube] = useState<boolean>(false)
    const [content, setContent] = useState<string>("")
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: CreatePost,
        onSuccess: (data) => {
            toast.success(data.message);
            setModalActive("")
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
        onError: (error: any) => {
            toast.error(error.response.data.error);
        },
    });

    const onSubmit = (onClose: () => void) => {
        const data: PostFormData = {
            content: content,
            status: "",
        }
        mutation.mutate(data, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <div>
            <ModalContent className="flex flex-col h-[80vh] max-h-[80vh]">
                {(onClose) => (
                    <>
                        <div className="flex-0 sticky top-0 z-10">
                            <div className="flex justify-center relative pt-3">
                                <Button isIconOnly
                                    className='border-none cursor-pointer w-fit bg-transparent ml-3 mt-3 hover:bg-neutral-700 rounded-full absolute left-0 top-0 '
                                    onPress={onClose}
                                >
                                    <MdClear className='w-7 h-7' />
                                </Button>
                                {/* <RangeOfPost setRangeOfPost={setRangeOfPost} rangeOfPost={rangeOfPost} /> 
                                */}
                                <Button className='bg-content2 rounded-full' variant='flat' size='sm'>
                                    <div className='flex !items-center gap-2 text-xs font-semibold'>
                                        <GrLanguage className='text-lg' /> Everyone
                                    </div>
                                </Button>
                            </div>
                        </div>
                        <ModalHeader className="flex flex-col gap-1 pt-1 relative">
                            <div className='flex justify-between border-b-2 border-content3'>
                                <Button className="bg-transparent w-1/2 rounded-none text-base font-semibold transition duration-300 ease-in-out" onPress={() => setModalActive("Ask")}>
                                    Add Question
                                </Button>
                                <Button className="bg-transparent w-1/2 rounded-none text-base font-semibold transition duration-300 ease-in-out border-b-2 border-blue-400" onPress={() => setModalActive("Post")}>
                                    Create Post
                                </Button>
                            </div>
                        </ModalHeader>
                        <ModalBody className="flex-1 overflow-y-auto max-h-[calc(80vh-150px)]">
                            <div className='flex justify-start'>
                                <User
                                    avatarProps={{ src: "https://i.pravatar.cc/150?u=a04258114e29026702d" }}
                                    name={<p className='text-xs font-semibold mb-1'>Nguyen Minh Thuan</p>}
                                    description={<Button variant='bordered' size='sm' radius='full'>Knows Vietnamese</Button>}
                                />
                            </div>
                            <TiptapEditor
                                initialContent=""
                                onChange={(value) => { setContent(value) }}
                                isDisabled={false}
                                setEditor={setEditor}
                            />
                        </ModalBody>
                        <ModalFooter className='flex justify-between items-center'>
                            <div className="flex items-center">
                                <motion.div
                                    onClick={() => setIsVisible(!isVisible)}
                                    whileTap={{ y: 1 }}
                                    className="mr-3"
                                >
                                    {isVisible ?
                                        <Button className="text-2xl !p-1" size='sm' onPress={() => setIsVisible(!isVisible)} variant="flat" isIconOnly>
                                            <SlClose />
                                        </Button>
                                        :
                                        <Button className="text-2xl !px-1" size='sm' onPress={() => setIsVisible(!isVisible)} variant="bordered" isIconOnly>
                                            <TiEdit />
                                        </Button>
                                    }
                                </motion.div>
                                <AnimatePresence initial={false}>
                                    {isVisible && editor ? (
                                        <motion.div
                                            initial={{ opacity: 0, scaleY: 0 }}
                                            animate={{ opacity: 1, scaleY: 1 }}
                                            exit={{ opacity: 0, scaleY: 0 }}
                                        >
                                            <MenuBar editor={editor} onAddImage={() => setOpenImage(true)} onAddYoutube={() => setOpenYoutube(true)} setShowEmojiPicker={() => setShowEmojiPicker(!showEmojiPicker)} />
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>
                            </div>
                            <Button color="primary" onPress={() => onSubmit(onClose)}>
                                Post
                            </Button>
                        </ModalFooter>
                        <EditorModal editor={editor} setOpenImage={setOpenImage} setOpenYoutube={setOpenYoutube} openImage={openImage} openYoutube={openYoutube} showEmojiPicker={showEmojiPicker} setShowEmojiPicker={setShowEmojiPicker} />
                    </>
                )}
            </ModalContent>

        </div>
    )
}

export default PostModal