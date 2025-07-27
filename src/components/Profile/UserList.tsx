import { Avatar, Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";
import { GetFollowedUsers, GetFollowingUsers } from "../../services";
import { useQuery } from "@tanstack/react-query";
import { UserResponse } from "../../store/interfaces/userInterfaces";
import LoadingState from "../Common/LoadingState";
import { useNavigate } from "react-router-dom";
import NotFind from "../Common/NotFind";
import { FaUserAltSlash } from "react-icons/fa";

interface UserListProps {
  type: string;
  title: string;
  emptyTitle: string;
}

const UserList: React.FC<UserListProps> = ({ type, title, emptyTitle }) => {
  const navigate = useNavigate();
  const { data: users = [] as UserResponse[], isLoading } = useQuery({
    queryKey: ["follows"],
    queryFn: () =>
      type === "following" ? GetFollowingUsers() : GetFollowedUsers(),
  });

  if (isLoading) {
    return <LoadingState message="" />;
  }
  return (
    <Card className="rounded-md py-3">
      <CardHeader className="flex justify-between items-center px-3 py-0">
        <h3 className="text-md font-semibold">{title}</h3>
      </CardHeader>
      <CardBody className="px-0 py-0 mt-3">
        <div className="space-y-1">
          {users.length > 0 ? (
            users.map((user, index) => (
              <div
                key={index}
                onClick={() => navigate(`/users/${user.id}`)}
                className="flex items-center gap-4 cursor-pointer group hover:bg-content4/20 rounded-none px-4 py-1"
              >
                <Avatar
                  src={`https://img.heroui.chat/image/avatar?w=40&h=40&u=${index + 2}`}
                  size="sm"
                />
                <div>
                  <p className="text-sm font-semibold group-hover:underline">
                    {user.fullName}
                  </p>
                  <p className="text-sm text-default-500">
                    {user.followingCount} câu hỏi
                  </p>
                </div>
              </div>
            ))
          ) : (
            <NotFind
              title={emptyTitle}
              className="!text-foreground/20 flex flex-row items-center justify-center gap-x-2 py-6"
              icon={<FaUserAltSlash className="size-10 !text-foreground/20" />}
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default UserList;
