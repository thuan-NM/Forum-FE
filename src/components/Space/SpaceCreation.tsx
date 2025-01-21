import { Button, useDisclosure, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Input } from '@heroui/react'
import { IoMdAdd } from "react-icons/io";
import { MdClear } from "react-icons/md";
import { Form } from 'react-router-dom';
import { FormEvent } from "react";

const SpaceCreation = () => {
    const { isOpen, onOpenChange, onOpen } = useDisclosure();
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        console.log(data);
    };
    return (
        <div className='px-3 '>
            <Button isIconOnly aria-label="Take a photo" size='sm' color="warning" variant="faded" className='mr-2 hover:bg-neutral-500' onPress={onOpen}>
                <IoMdAdd />
            </Button>
            <span className='text-sm'>Create Group</span>
            <Modal isOpen={isOpen} size={"2xl"} onOpenChange={onOpenChange} className='rounded-md' isDismissable={false} backdrop='blur' hideCloseButton isKeyboardDismissDisabled={false}
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
                                <p className='text-xl'>Create a Group</p>
                                <p className='text-base font-light'>Share your interests, curate content, host discussions, and more.</p>
                            </ModalHeader>
                            <ModalBody>
                                <Form className="w-full flex flex-col gap-y-8" onSubmit={onSubmit}>
                                    <Input
                                        isRequired
                                        label={
                                            <span className='text-base font-semibold'>
                                                Name
                                            </span>
                                        }
                                        labelPlacement="outside"
                                        name="name"
                                        placeholder="This can be changed in Space settings."
                                        type="text"
                                        maxLength={60}
                                        minLength={10}
                                        variant="bordered"
                                    />
                                    <Input
                                        label={
                                            <p className='text-base font-semibold'>
                                                Brief description
                                            </p>
                                        }
                                        labelPlacement="outside"
                                        name="description"
                                        placeholder="Include a few keywords to show people what to expect if they join."
                                        type="text"
                                        variant="bordered"
                                    />
                                </Form>

                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Create
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default SpaceCreation