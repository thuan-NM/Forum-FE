import { Avatar, Button, Input, Popover, PopoverContent, PopoverTrigger, Skeleton } from '@heroui/react';
import { FaChevronDown } from 'react-icons/fa6';
import { GrLanguage } from 'react-icons/gr';
import { IoIosSearch } from 'react-icons/io';
import { Group } from '../../../store/interfaces/groupInterfaces';
import { useQuery } from '@tanstack/react-query';
import { GetAllGroup } from '../../../services/GroupServices';
import React, { useState } from 'react';

interface RangeOfPost {
    setRangeOfPost: (value: Group) => void;
    rangeOfPost: Group;
}

const RangeOfPost: React.FC<RangeOfPost> = ({setRangeOfPost,rangeOfPost}) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
    

    const { data: groups = [], isLoading, isError, error } = useQuery<Group[]>({
        queryKey: ['groups'],
        queryFn: GetAllGroup,
    });

    if (isLoading) {
        return (
            <div className="my-3 text-center w-5/6">
                <Skeleton className="w-full h-5 !rounded-full" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="my-3 text-center">
                <p className="text-red-500">{error.message}</p>
            </div>
        );
    }

    const handleSelectRange = (range:Group) => {
        setRangeOfPost(range);
        setIsPopoverOpen(false);
    };
    return (
        <Popover showArrow offset={20} placement="right" isOpen={isPopoverOpen} onOpenChange={setIsPopoverOpen} className='mt-10'>
            <PopoverTrigger className='flex items-center mt-3'>
                <Button className='bg-content2 rounded-full' variant='flat' size='sm'>
                    <div className='flex !items-center gap-2 text-xs font-semibold'>
                        <GrLanguage className='text-lg' /> {rangeOfPost?.name} <FaChevronDown />
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='p-0 !bg-content2 rounded-md py-2'>
                <div className="flex flex-col !items-start rounded-full">
                    <Input
                        isClearable
                        labelPlacement="outside"
                        placeholder="Choose a Space"
                        startContent={
                            <IoIosSearch className='text-lg' />
                        }
                        variant='bordered'
                        type="text"
                        className='rounded-sm w-full px-2 pb-2 '
                        radius='none'
                        size='md'
                    />
                    <Button className='flex items-center text-md w-full bg-tranparent hover:bg-content3 justify-start border-y border-content3' 
                    size='md' radius='none' onPress={() => handleSelectRange({ id: "", name: "Everyone", description: "" })}>
                        <GrLanguage className='text-xl !text-blue-400' /> Everyone
                    </Button>
                    <div className='w-full'>
                        <p className='px-3 py-2 text-base font-semibold border-y border-content3 w-full'>
                            Suggested Spaces
                        </p>
                    </div>
                    <>
                        {groups.map((group: Group) => (
                            <Button key={group.id} className='truncate flex items-center text-sm !w-full bg-tranparent hover:bg-content3 justify-start border-b border-content3' 
                            size='md' radius='none' onPress={()=>(handleSelectRange(group))}>
                                <Avatar
                                    className="w-7 h-7 text-tiny rounded-md"
                                    radius="none"

                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQwIxPcRMQClL2F2Z4CjKk65eAl14HhAD37g&s"
                                />
                                {group.name}
                            </Button>
                        ))}
                    </>
                </div>
            </PopoverContent>
        </Popover>)
}

export default RangeOfPost