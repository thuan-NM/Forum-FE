import React, { useState } from "react";
import { useAppSelector } from "../../src/store/hooks";
import { RootState } from "../../src/store/store";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetAllPosts } from "../../src/services/PostServices";
import { Icon } from "@iconify/react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
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

const ProfilePage = () => {
  const user = useGetUserInfo();
  const [activeTab, setActiveTab] = useState<string>("bio");
  const navigate = useNavigate();
  const profileTabs = [
    { label: "Mô tả bản thân", value: "bio" },
    { label: "Câu trả lời", value: "answers" },
    { label: "Câu hỏi", value: "questions" },
    { label: "Bài viết", value: "posts" },
    { label: "Người theo dõi", value: "followers" },
    { label: "Đang theo dõi", value: "following" },
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
              <Card className="w-full !bg-content1 rounded-md">
                <CardBody className="flex flex-col md:flex-row gap-2">
                  <div className="w-full md:w-1/3 flex flex-col items-center">
                    <AvatarUpload user={user} />
                  </div>
                  <Divider
                    orientation="vertical"
                    className="hidden md:block "
                  />
                  <div className="w-full md:w-2/3 flex flex-col justify-center">
                    <div className="mt-4 mb-3">
                      <h2 className="text-2xl font-bold text-center md:text-left">
                        {user.fullName || ""}
                      </h2>
                      <p className="text-default-500 text-center md:text-left">
                        @{user.username || ""}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mb-4 mx-auto md:mx-0">
                      <div className="flex gap-4">
                        <div className="text-center">
                          <p className="text-lg font-bold">
                            {user.followersCount || 0}
                          </p>
                          <p className="text-sm text-default-500">
                            Người theo dõi
                          </p>
                        </div>
                        <Divider orientation="vertical" />
                        <div className="text-center">
                          <p className="text-lg font-bold">
                            {user.followingCount || 0}
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
              {activeTab === "bio" && <MyBio user={user} />}
              {activeTab === "posts" && <MyPostList user={user} />}
              {activeTab === "answers" && <MyAnswerList user={user} />}
              {activeTab === "questions" && <MyQuestionList user={user} />}
              {activeTab === "followers" && (
                <UserList
                  type="following"
                  title="Những người bạn đang theo dõi"
                  emptyTitle="Bạn chưa theo dõi ai cả"
                />
              )}
              {activeTab === "following" && (
                <UserList
                  type="followed"
                  title="Những người đang theo dõi bạn"
                  emptyTitle="Bạn không có ai theo dõi"
                />
              )}
            </div>

            <div className="basis-full lg:basis-2/6">
              <Card className="mb-5">
                <CardHeader className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    Credentials & Highlights
                  </h3>
                  <Button variant="light">More</Button>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:eye" className="text-default-500" />
                      <p className="text-sm">
                        <span className="font-semibold">466.3K</span> content
                        views
                        <span className="text-success-500 ml-2">
                          2.3K this month
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:users" className="text-default-500" />
                      <p className="text-sm">Active in 1 Space</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="lucide:calendar"
                        className="text-default-500"
                      />
                      <p className="text-sm">Joined January 2013</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
              <KnowAbout />
            </div>
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default ProfilePage;
