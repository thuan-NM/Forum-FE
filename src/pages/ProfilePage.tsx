import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  useDisclosure,
} from "@heroui/react";
import ProfileLayout from "../layouts/ProfileLayout";
import MyPostList from "../components/Profile/MyPostList";
import MyAnswerList from "../components/Profile/MyAnswerList";
import MyQuestionList from "../components/Profile/MyQuestionList";
import AvatarUpload from "../components/Profile/AvatarUpload";
import MyBio from "../components/Profile/MyBio";
import KnowAbout from "../components/Profile/KnowAbout";
import UserList from "../components/Profile/UserList";
import { useGetUserInfo } from "../utils/getUserInfo";
import { GetUserById } from "../services";
import { UserResponse } from "../store/interfaces/userInterfaces";
import { CiEdit } from "react-icons/ci";
import EditUserInfoModal from "../components/Common/Modal/EditUserInfoModal";
import MoreInfo from "../components/Profile/MoreInfo";

const ProfilePage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const user = useGetUserInfo();

  const { data: userData = {} as UserResponse, refetch } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => GetUserById(user?.id as string),
    enabled: !!user?.id, // chỉ fetch khi có user.id
  });
  const [activeTab, setActiveTab] = useState<string>("bio");
  const navigate = useNavigate();
  const profileTabs = [
    { label: `Mô tả bản thân`, value: "bio" },
    { label: `${userData.answerCount || 0} Câu trả lời`, value: "answers" },
    { label: `${userData.questionCount || 0} Câu hỏi`, value: "questions" },
    { label: `${userData.postCount || 0} Bài viết`, value: "posts" },
    {
      label: `${userData.followersCount || 0} Người theo dõi`,
      value: "followers",
    },
    {
      label: `${userData.followingCount || 0} Đang theo dõi`,
      value: "following",
    },
  ];

  React.useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <ProfileLayout>
      <div className="flex flex-col min-h-screen p-4">
        <div className="w-full max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="basis-full lg:basis-4/6 space-y-6">
              <Card className="w-full !bg-content1 rounded-md ">
                <CardBody className="flex flex-col md:flex-row gap-2 ">
                  <div className="w-full md:w-1/3 flex flex-col items-center my-auto">
                    <AvatarUpload user={userData} />
                  </div>
                  <Divider
                    orientation="vertical"
                    className="hidden md:block "
                  />
                  <div className="w-full md:w-2/3 flex flex-col justify-center">
                    <div className="mt-4 mb-3 flex flex-row justify-start items-start gap-x-4">
                      <div className="flex flex-col">
                        <h2 className="text-2xl font-bold text-center md:text-left">
                          {userData?.fullName || ""}
                        </h2>
                        <p className="text-default-500 text-center md:text-left">
                          @{userData?.username || ""}
                        </p>
                      </div>
                      <Button
                        color="default"
                        radius="full"
                        className="w-fit my-1 font-semibold "
                        size="sm"
                        isIconOnly
                        variant="light"
                        onPress={onOpen}
                      >
                        <CiEdit className="size-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-center mb-4 mx-auto md:mx-0">
                      <div className="flex gap-4">
                        <div className="text-center">
                          <p className="text-lg font-bold">
                            {userData?.followersCount || 0}
                          </p>
                          <p className="text-sm text-default-500">
                            Người theo dõi
                          </p>
                        </div>
                        <Divider orientation="vertical" />
                        <div className="text-center">
                          <p className="text-lg font-bold">
                            {userData?.followingCount || 0}
                          </p>
                          <p className="text-sm text-default-500">
                            Đang theo dõi
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
              <div className="flex w-full border-b border-default-200 relative">
                {profileTabs.map((tab) => (
                  <div
                    key={tab.value}
                    className={`relative px-4 py-2 truncate cursor-pointer text-xs font-semibold transition-colors duration-200 ${
                      activeTab === tab.value
                        ? "text-red-500"
                        : "text-default-500"
                    }`}
                    onClick={() => setActiveTab(tab.value)}
                  >
                    {tab.label}
                    {activeTab === tab.value && (
                      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-red-500 rounded-t" />
                    )}
                  </div>
                ))}
              </div>
              {activeTab === "bio" && <MyBio user={userData} />}
              {activeTab === "posts" && <MyPostList user={userData} />}
              {activeTab === "answers" && <MyAnswerList user={userData} />}
              {activeTab === "questions" && <MyQuestionList user={userData} />}
              {activeTab === "followers" && (
                <UserList
                  title="Những người đang theo dõi bạn"
                  emptyTitle="Bạn không có ai theo dõi"
                  type="followed"
                />
              )}
              {activeTab === "following" && (
                <UserList
                  title="Những người bạn đang theo dõi"
                  type="following"
                  emptyTitle="Bạn chưa theo dõi ai cả"
                />
              )}
            </div>

            <div className="basis-full lg:basis-2/6">
              <MoreInfo user={userData} refetch={refetch}/>
              <KnowAbout />
            </div>
          </div>
        </div>
      </div>
      <EditUserInfoModal
        isOpen={isOpen}
        onClose={onClose}
        user={userData}
        refetch={refetch}
      />
    </ProfileLayout>
  );
};

export default ProfilePage;
