import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@heroui/react";
import { FaLanguage } from "react-icons/fa6";
import { GoChevronRight, GoSignOut } from "react-icons/go";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { IoIosSettings } from "react-icons/io";
import { LuMessageSquareMore } from "react-icons/lu";
import Footer from "../Footer";
import React, { useEffect } from "react";
import { RootState } from "../../../store/store";
import { useAppSelector } from "../../../store/hooks";
import { Link, useNavigate } from "react-router-dom";

interface HeaderDropdownProp {
  handleLogouts: () => void;
}

const HeaderDropdown: React.FC<HeaderDropdownProp> = ({ handleLogouts }) => {
  const user = useAppSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user]);
  if (!user) {
    return null;
  }
  return (
    <Dropdown className="bg-content2 !p-0 !rounded-none w-64">
      <DropdownTrigger className="flex items-center">
        <User
          avatarProps={{
            src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
          }}
          description=""
          name=""
          className="ml-2"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions" className="!px-0 !rounded-none">
        <DropdownItem
          className="rounded-none !px-0"
          key="profile"
          textValue="Profile"
        >
          <Link to="/profile">
            <Button
              className="bg-tranparent px-4 py-14 !pt-16 flex flex-col items-start !w-full border-b !border-neutral-300 rounded-none"
              size="sm"
              radius="none"
            >
              <User
                avatarProps={{
                  src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                }}
                description=""
                name=""
              />
              <div className="text-lg flex !justify-between items-center !w-full">
                <div className="font-semibold">{user.fullName}</div>
                <div className="text-3xl !font-light !text-neutral-400">
                  <GoChevronRight />
                </div>
              </div>
            </Button>
          </Link>
        </DropdownItem>
        <DropdownItem
          className="rounded-none"
          key="message"
          textValue="Message"
        >
          <Button
            className="bg-tranparent text-md font-light"
            size="sm"
            radius="none"
          >
            <LuMessageSquareMore className="w-5 h-5" />
            Message
          </Button>
        </DropdownItem>
        <DropdownItem className="rounded-none" key="notice" textValue="Notice">
          <Button
            className="bg-tranparent text-md font-light"
            size="sm"
            radius="none"
          >
            <HiOutlineSpeakerphone className="w-5 h-5" />
            Notice
          </Button>
        </DropdownItem>
        <DropdownItem
          className="rounded-none"
          key="setting"
          textValue="Setting"
        >
          <Button
            className="bg-tranparent text-md font-light"
            size="sm"
            radius="none"
          >
            <IoIosSettings className="w-5 h-5" />
            Setting
          </Button>
        </DropdownItem>
        <DropdownItem
          className="rounded-none"
          key="language"
          textValue="Language"
        >
          <Button
            className="bg-tranparent text-md font-light"
            size="sm"
            radius="none"
          >
            <FaLanguage className="w-5 h-5" />
            Language
          </Button>
        </DropdownItem>
        <DropdownItem
          className="rounded-none"
          key="logout"
          textValue="Logout"
          onPress={handleLogouts}
        >
          <Button
            className="bg-tranparent text-md font-light"
            size="sm"
            radius="none"
            onPress={handleLogouts}
          >
            <GoSignOut className="w-5 h-5" />
            Logout
          </Button>
        </DropdownItem>
        <DropdownItem
          className="rounded-none border-t !border-neutral-300"
          key="footer"
          textValue="Footer"
        >
          <Footer position="left" />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default HeaderDropdown;
