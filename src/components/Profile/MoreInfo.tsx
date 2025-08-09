"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { UserResponse } from "../../store/interfaces/userInterfaces";
import { format, register } from "timeago.js";
import vi from "timeago.js/lib/lang/vi";
import { CiEdit } from "react-icons/ci";
import UpdateLocationModal from "./UpdateLocationModal"; // Đảm bảo đúng path

// Đăng ký tiếng Việt cho timeago.js
register("vi", vi);

interface Props {
  user: UserResponse;
  isMe?: boolean;
  refetch?: () => void;
}

const MoreInfo: React.FC<Props> = ({ user, isMe = true, refetch }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Xác định class cho trạng thái
  const getStatusClass = (status: string) => {
    switch (status) {
      case "active":
        return "text-success-500 font-semibold";
      case "inactive":
        return "text-default-500 opacity-60 font-semibold";
      case "banned":
      case "locked":
        return "text-danger-500 font-semibold";
      default:
        return "text-default-500 font-semibold";
    }
  };

  // Hiển thị nội dung trạng thái
  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "đang hoạt động";
      case "inactive":
        return "không hoạt động";
      case "banned":
      case "locked":
        return "đã bị khóa";
      default:
        return "không xác định";
    }
  };

  return (
    <>
      <Card className="mb-5 rounded-md py-3">
        <CardHeader className="flex justify-between items-center px-3 py-0">
          <h3 className="text-md font-semibold">
            Các chủ đề bạn đang theo dõi
          </h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-center gap-2 h-[20px]">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:users" className="text-default-500" />
                <p className="text-sm">
                  Sống tại {user.location || "chưa xác định"}
                </p>
              </div>
              {isMe && (
                <Button
                  color="default"
                  radius="full"
                  className="w-fit my-1 font-semibold"
                  size="sm"
                  isIconOnly
                  variant="light"
                  onPress={onOpen}
                >
                  <CiEdit className="size-4" />
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="lucide:eye" className="text-default-500" />
              <p className="text-sm">
                Trạng thái{" "}
                <span className={getStatusClass(user.status)}>
                  {getStatusText(user.status)}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="lucide:calendar" className="text-default-500" />
              <p className="text-sm">
                Tham gia vào {format(user.createdAt, "vi")}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      <UpdateLocationModal
        isOpen={isOpen}
        onClose={onClose}
        defaultLocation={user.location || ""}
        userId={user.id}
        refetch={refetch}
      />
    </>
  );
};

export default MoreInfo;
