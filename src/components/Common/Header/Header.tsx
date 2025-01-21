import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { Link } from 'react-router-dom';
import { logout } from "../../../store/slices/authSlice";
import { clearUser } from "../../../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import ChangeTheme from '../ChangeTheme';
import logo from "../../../assets/logo.png";
import { MdHome } from "react-icons/md";
import { BsFillPostcardHeartFill } from "react-icons/bs";
import { Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Navbar, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Tooltip, useDisclosure, User } from "@heroui/react";
import { HiUserGroup, HiOutlineSpeakerphone } from "react-icons/hi";
import { BsBell } from "react-icons/bs";
import { IoIosSearch, IoIosSettings } from "react-icons/io";
import { GoSignOut } from "react-icons/go";
import { LuMessageSquareMore } from "react-icons/lu";
import { FaLanguage } from "react-icons/fa6";
import { GoChevronRight } from "react-icons/go";
import Footer from '../Footer';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  console.log(user)
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUser());
    navigate("/auth"); // Chuyển hướng người dùng về trang đăng nhập
  };

  const menuItems = [
    "Home",
    "Follwing",
    "Group",
    "Theme Change",
    "Log Out",
  ];

  return (
    <Navbar
      className='bg-content2 flex-wrap' maxWidth="full"
      isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
        <NavbarItem className="">
          <div className="logo bg-transparent">
            <Link to={"/"}><img src={logo} alt="" width={50} /></Link>
          </div>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="center" className='mx-auto hidden sm:flex'>
        <NavbarItem className="mx-2">
          <div className="logo bg-transparent">
            <Link to={"/"}><img src={logo} alt="" width={50} /></Link>
          </div>
        </NavbarItem>
        <Tooltip content="Home" placement={"bottom"} offset={15}>
          <NavbarItem className="mx-2" isActive>
            <Link to={"/"} title="" className="tooltip tooltip-bottom" data-tip="Home">
              <MdHome className='h-6 w-6' />
            </Link>
          </NavbarItem>
        </Tooltip>
        <Tooltip content="Follwing" placement={"bottom"} offset={15}>
          <NavbarItem className="mx-2">
            <Link to={"/companies"}>
              <BsFillPostcardHeartFill className='h-6 w-6' />
            </Link>
          </NavbarItem>
        </Tooltip>
        <Tooltip content="Group" placement={"bottom"} offset={15}>
          <NavbarItem className="mx-2">
            <Link to={"/companies"}>
              <HiUserGroup className='h-6 w-6' />
            </Link>
          </NavbarItem>
        </Tooltip>
        <Tooltip content="Notice" placement={"bottom"} offset={15}>
          <NavbarItem className="mx-2">
            <Link to={"/companies"}>
              <BsBell className='h-6 w-6' />
            </Link>
          </NavbarItem>
        </Tooltip>
        <NavbarItem className="mx-2">
          <Input
            isClearable
            labelPlacement="outside"
            placeholder="Search something..."
            startContent={
              <IoIosSearch />
            }
            variant='bordered'
            type="text"
            className='rounded-xl w-80'
          />
        </NavbarItem>
        <Tooltip content="Add Question" placement={"bottom"} offset={15}>
          <Button className='bg-red-500 font-semibold text-xs text-white' size="sm" onPress={onOpen}>Add Question</Button>
        </Tooltip>
        <Dropdown
          className='bg-content2 p-0 !rounded-none w-64'
        >
          <DropdownTrigger>
            <User
              avatarProps={{
                src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
              }}
              description=""
              name=""
              className='mx-4'
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions" className='p-0 !rounded-none'>
            <DropdownItem className='p-0 !rounded-none ' key="new">
              <NavbarItem className=''>
                <Button className='bg-tranparent py-14 !pt-16 flex flex-col items-start !w-full border-b !border-neutral-300 rounded-none' size="sm" onPress={handleLogout}>
                  {/* <LuMessageSquareMore className='w-5 h-5'/>
                  Message */}
                  <User
                    avatarProps={{
                      src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                    }}
                    description=""
                    name=""
                  // className='mx-4'
                  />
                  <div className='text-lg flex !justify-between items-center !w-full'>
                    <div className='font-semibold'>Minh Thuan Nguyen</div>
                    <div className='text-3xl !font-light !text-neutral-400'>
                      <GoChevronRight />
                    </div>
                  </div>
                </Button>
              </NavbarItem>
            </DropdownItem>
            <DropdownItem className='p-0 !rounded-none' key="new">
              <NavbarItem>
                <Button className='bg-tranparent text-md font-light' size="md" onPress={handleLogout}>
                  <LuMessageSquareMore className='w-5 h-5' />
                  Message
                </Button>
              </NavbarItem>
            </DropdownItem>
            <DropdownItem className='p-0 !rounded-none' key="copy">
              <NavbarItem>
                <Button className='bg-tranparent text-md font-light' size="md" onPress={handleLogout}>
                  <HiOutlineSpeakerphone className='w-5 h-5' />
                  Notice
                </Button>
              </NavbarItem>
            </DropdownItem>
            <DropdownItem className='p-0 !rounded-none' key="edit">
              <NavbarItem>
                <Button className='bg-tranparent text-md font-light' size="md" onPress={handleLogout}>
                  <IoIosSettings className='w-5 h-5' />
                  Setting
                </Button>
              </NavbarItem>
            </DropdownItem>
            <DropdownItem className='p-0 !rounded-none' key="edit">
              <NavbarItem>
                <Button className='bg-tranparent text-md font-light' size="md" onPress={handleLogout}>
                  <FaLanguage className='w-5 h-5' />
                  Language
                </Button>
              </NavbarItem>
            </DropdownItem>
            <DropdownItem className='p-0 !rounded-none' key="logout" >
              <NavbarItem>
                <Button className='bg-tranparent text-md font-light' size="md" onPress={handleLogout}>
                  <GoSignOut className='w-5 h-5' />
                  Logout
                </Button>
              </NavbarItem>
            </DropdownItem>
            <DropdownItem className='p-0 !rounded-none border-t !border-neutral-300' key="logout" >
              <NavbarItem>
                <Footer position="left"/>
              </NavbarItem>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Modal isOpen={isOpen} size={"3xl"} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                <ModalBody>
                  <p>
                    Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit officia
                    eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et mollit incididunt nisi
                    consectetur esse laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
                    deserunt nostrud ad veniam. Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit. Nullam pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet
                    hendrerit risus, sed porttitor quam. Magna exercitation reprehenderit magna aute
                    tempor cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                    incididunt cillum quis. Velit duis sit officia eiusmod Lorem aliqua enim laboris
                    do dolor eiusmod. Et mollit incididunt nisi consectetur esse laborum eiusmod
                    pariatur proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Action
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Tooltip content="Theme" placement={"bottom"} offset={15}>
          <NavbarItem className="mx-2">
            <ChangeTheme />
          </NavbarItem>
        </Tooltip>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              to="#"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar >
  );
};

export default Header;


