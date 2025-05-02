import { Avatar, Badge, Button, Skeleton } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { GetAllGroup } from '../../services/GroupServices';
import { Group } from '../../store/interfaces/groupInterfaces';
import toast from 'react-hot-toast';

const GroupItem = () => {
    const { data: groups = [], isLoading, isError, error } = useQuery<Group[]>({
        queryKey: ['groups'],
        queryFn: GetAllGroup,
    });

    if (isLoading) {
        return (
            <div className="my-3 text-center w-5/6">
                <Skeleton className="w-full h-5 !rounded-full" />
                <Skeleton className="w-full h-5 mt-2 !rounded-full" />
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

    if (groups.length === 0) {
        return (
            <div className="my-3 text-center">
                <p className="text-gray-500 text-sm">Hiện tại bạn chưa tham gia nhóm nào.</p>
                <Button className="mt-3" size="sm" onPress={() => toast('Hãy tham gia một nhóm mới!')}>
                    Tham gia nhóm
                </Button>
            </div>
        );
    }

    return (
        <div className="my-3">
            {groups.map((group) => (
                <Button
                    className="py-6 bg-transparent hover:bg-content2 rounded-md w-5/6 flex justify-start"
                    size="sm"
                    key={group.id}
                >
                    <Skeleton isLoaded={!isLoading} className="flex !rounded-full">
                        <Badge color="danger" content="5" placement="top-right">
                            <Avatar
                                size="sm"
                                isBordered
                                radius="md"
                                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                            />
                        </Badge>
                    </Skeleton>
                    <Skeleton isLoaded={!isLoading} className='truncate flex !rounded-full'>
                        <p className="ml-2 text-xs ">{group.name}</p>
                    </Skeleton>

                </Button>
            ))}
        </div>
    )
}

export default GroupItem
