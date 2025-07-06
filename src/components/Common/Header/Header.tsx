import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import ChangeTheme from "../ChangeTheme";
import logo from "../../../assets/logo.png";
import { MdHome } from "react-icons/md";
import { BsFillPostcardHeartFill } from "react-icons/bs";
import {
  Input,
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Tooltip,
} from "@heroui/react";
import { HiUserGroup } from "react-icons/hi";
import { IoIosSearch } from "react-icons/io";
import HeaderModal from "./HeaderModal";
import HeaderDropdown from "./HeaderDropdown";
import NotificationDropdown from "../../Home/Notification";
import { BiEdit } from "react-icons/bi";

import { useLogoutMutation } from "../../../hooks/users/useLogoutMutation";

const navItems = {
  home: { path: "/", name: "Home", icon: <MdHome className="h-6 w-6" /> },
  topics: {
    path: "/topics",
    name: "Topics",
    icon: <BsFillPostcardHeartFill className="h-6 w-6" />,
  },
  answer: {
    path: "/answer",
    name: "Answer",
    icon: <BiEdit className="h-6 w-6" />,
  },
  group: {
    path: "/group",
    name: "Group",
    icon: <HiUserGroup className="h-6 w-6" />,
  },
};

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { logoutAccount } = useLogoutMutation();

  return (
    <Navbar
      className="bg-content1 flex-wrap"
      maxWidth="full"
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      height={52}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
        <NavbarItem>
          <div className="logo bg-transparent">
            <NavLink to="/">
              <img src={logo} alt="Logo" width={50} />
            </NavLink>
          </div>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="center" className="mx-auto hidden sm:flex">
        <NavbarItem className="mx-2">
          <div className="logo bg-transparent">
            <NavLink to="/">
              <img src={logo} alt="Logo" width={50} />
            </NavLink>
          </div>
        </NavbarItem>
        {Object.values(navItems).map((item) => (
          <Tooltip
            key={item.name}
            content={item.name}
            placement="bottom"
            offset={15}
          >
            <NavbarItem className="mx-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center ${isActive ? "border-b-3 mb-0 py-3 border-red-500 text-red-500" : "text-foreground"}`
                }
              >
                {item.icon}
              </NavLink>
            </NavbarItem>
          </Tooltip>
        ))}
        <Tooltip content="Notifications" placement="bottom" offset={15}>
          <NavbarItem>
            <NotificationDropdown />
          </NavbarItem>
        </Tooltip>
        <NavbarItem className="mx-2">
          <Input
            isClearable
            labelPlacement="outside"
            placeholder="Search something..."
            startContent={<IoIosSearch />}
            variant="bordered"
            type="text"
            className="rounded-xl w-80"
          />
        </NavbarItem>
        <NavbarItem>
          <HeaderModal />
        </NavbarItem>
        <NavbarItem>
          <HeaderDropdown handleLogouts={() => logoutAccount()} />
        </NavbarItem>
        <Tooltip content="Theme" placement="bottom" offset={15}>
          <NavbarItem className="mx-2">
            <ChangeTheme />
          </NavbarItem>
        </Tooltip>
      </NavbarContent>
      <NavbarMenu>
        {Object.values(navItems).map((item) => (
          <NavbarMenuItem key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `items-center ${isActive ? "border-b-3 mb-0 py-3 border-red-500 text-red-500" : "text-foreground"}`
              }
            >
              {item.name}
            </NavLink>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <button
            className="w-full text-left text-foreground"
            onClick={() => setIsMenuOpen(false)}
          >
            Theme Change
          </button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <button className="w-full text-left" onClick={() => logoutAccount()}>
            Log Out
          </button>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default React.memo(Header);
