import { Avatar, Badge, Button, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

import { BsMailbox } from "react-icons/bs";
import { GetAllGroup } from "../../services";
import { Group } from "../../store/interfaces/groupInterfaces";

const TopicList = () => {
  const {
    data: groups = [],
    isLoading,
    isError,
    error,
  } = useQuery<Group[]>({
    queryKey: ["groups"],
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
      <div className="mt-6">
        <div className="flex justify-center flex-col my-2 gap-y-1 mx-auto py-12 px-2">
          <BsMailbox className="w-10 h-10 opacity-60 mx-auto" />
          <div className="mx-auto font-bold text-sm opacity-60">
            No topics yet
          </div>
        </div>
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
          <Skeleton
            isLoaded={!isLoading}
            className="truncate flex !rounded-full"
          >
            <p className="ml-2 text-xs ">{group.name}</p>
          </Skeleton>
        </Button>
      ))}
    </div>
  );
};

export default TopicList;
