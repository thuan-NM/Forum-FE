import { Button, useDisclosure, Modal, ModalBody, ModalContent, ModalHeader, Input, Textarea } from '@heroui/react';
import { IoMdAdd } from "react-icons/io";
import { MdClear } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { CreateGroup } from '../../services/GroupServices';
import toast from 'react-hot-toast';
import GroupContributors from './GroupContributors';
import { useGroupContext } from '../../context/GroupContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type FormData = {
    name: string;
    description: string;
};

const GroupCreation = () => {
    const { isOpen, onOpenChange, onOpen } = useDisclosure();
    const { setFormData } = useGroupContext();
    const [active, setActive] = useState<'create' | 'contributors'>('create');

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
    const queryClient = useQueryClient(); // Truy cập vào Query Client

    // Use React Query's useMutation for creating the group
    const mutation = useMutation({
        mutationFn: CreateGroup,
        onSuccess: (data) => {
            toast.success(data.message);
            setActive('contributors');
            setFormData({ name: data.name, description: data.description }); // Example of storing data
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            reset();
        },
        onError: (error: any) => {
            toast.error(error.response.data.error);
        },
    });

    const onSubmit = (data: FormData) => {
        mutation.mutate(data);
    };

    return (
        <div className='px-3'>
            <Button
                isIconOnly
                aria-label="Take a photo"
                size='sm'
                color="warning"
                variant="faded"
                className='mr-2 hover:bg-neutral-500'
                onPress={onOpen}
            >
                <IoMdAdd />
            </Button>
            <span className='text-sm'>Create Group</span>

            <Modal
                isOpen={isOpen}
                size={"2xl"}
                onOpenChange={onOpenChange}
                className='rounded-md'
                isDismissable={false}
                backdrop='blur'
                hideCloseButton
                isKeyboardDismissDisabled={false}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <Button
                                isIconOnly
                                className='border-none cursor-pointer w-fit bg-transparent ml-3 mt-3 hover:bg-neutral-700 rounded-full'
                                onPress={onClose}
                            >
                                <MdClear className='w-7 h-7 !text-neutral-300' />
                            </Button>
                            {(active == 'create') &&
                                <>
                                    <ModalHeader className="flex flex-col gap-1 pt-1">
                                        <p className='text-xl'>Create a Group</p>
                                        <p className='text-base font-light'>
                                            Share your interests, curate content, host discussions, and more.
                                        </p>
                                    </ModalHeader>
                                    <ModalBody className='px-0 py-0'>
                                        <form className="w-full flex flex-col gap-y-8" onSubmit={handleSubmit(onSubmit)}>
                                            <Input
                                                className='px-6'
                                                isRequired
                                                label={<span className='text-base font-semibold'>Name</span>}
                                                labelPlacement="outside"
                                                placeholder="This can be changed in Space settings."
                                                type="text"
                                                maxLength={60}
                                                minLength={10}
                                                variant="bordered"
                                                {...register("name", {
                                                    required: "Name is required",
                                                    minLength: { value: 10, message: "Name must be at least 10 characters" },
                                                    maxLength: { value: 60, message: "Name must be at most 60 characters" }
                                                })}
                                            />
                                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}

                                            <Textarea
                                                className='px-6 mb-20'
                                                isClearable
                                                label={<p className='text-base font-semibold'>Description</p>}
                                                labelPlacement="outside"
                                                placeholder="Include a few keywords to show people what to expect if they join."
                                                type="text"
                                                variant="bordered"
                                                {...register("description", {
                                                    required: "Description is required",
                                                    maxLength: { value: 200, message: "Description must be at most 200 characters" }
                                                })}
                                            />
                                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                                            <div className='flex justify-end border-t border-content3 px-6 py-3'>
                                                <Button color="primary" type="submit"
                                                    isLoading={mutation.status === 'pending'} // Fix loading state

                                                    radius='full'
                                                >
                                                    Create
                                                </Button>
                                            </div>
                                        </form>
                                    </ModalBody>
                                </>
                            }
                            {(active == 'contributors') &&
                                <GroupContributors onClose={onClose} setActive={setActive} />
                            }
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default GroupCreation;
