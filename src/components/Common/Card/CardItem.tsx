import { Card, Image } from "@heroui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface CardItemProps {
  id: string;
  name: string;
  description: string;
  avatarUrl?: string;
  coverUrl?: string;
  children?: React.ReactNode;
  type?: string; // phần để truyền button như Follow
}

const CardItem: React.FC<CardItemProps> = ({
  id,
  name,
  description,
  avatarUrl,
  coverUrl,
  children,
  type = "topics",
}) => {
  const defaultAvatar = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(
    name
  )}`;
  const defaultCover = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(
    name + "cover"
  )}`;
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/${type}/${id}`);
  };
  return (
    <Card
      key={id}
      className="relative min-h-[260px] bg-content1 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col items-center text-center"
    >
      {/* Cover Image */}
      <div className="w-full h-20 relative">
        <img
          src={coverUrl || defaultCover}
          alt="cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Avatar - nhô 1 nửa lên cover */}
      <div className="relative -mt-6 z-10">
        <Image
          src={avatarUrl || defaultAvatar}
          alt={name}
          width={54}
          height={54}
          className="rounded-lg border-2 border-white shadow-md object-cover"
        />
      </div>

      {/* Content */}
      <div className=" px-3 pb-2 pt-2 flex flex-col justify-between content-between items-center gap-1 h-full">
        <div className="group cursor-pointer" onClick={handleClick}>
          <h3 className="group-hover:underline text-sm font-semibold">
            {name}
          </h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>

        {/* Custom children: ví dụ nút Follow */}
        {children && <div className="mb-3">{children}</div>}
      </div>
    </Card>
  );
};

export default CardItem;
