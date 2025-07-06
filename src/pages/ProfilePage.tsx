import React from "react";
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
import PostList from "../components/PostManage/Post/PostList";

const ProfilePage = () => {
  const user = useAppSelector((state: RootState) => state.user.user);
  console.log("user:", user);
  const navigate = useNavigate();

  const { data: allPostsData } = useQuery({
    queryKey: ["posts"],
    queryFn: () => GetAllPosts({}),
  });

  React.useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) return null;

  const posts = allPostsData?.posts || [];
  console.log("post:", posts);

  return (
    <div className="flex flex-col min-h-screen bg-background p-4">
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="basis-full lg:basis-4/6 space-y-6">
            <Card className="w-full">
              <CardBody className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 flex flex-col items-center">
                  <Avatar
                    src="https://img.heroui.chat/image/avatar?w=200&h=200&u=1"
                    className="w-32 h-32"
                    isBordered
                  />
                </div>
                <Divider orientation="vertical" className="hidden md:block" />
                <div className="w-full md:w-2/3">
                  <div className="mt-4 mb-3">
                    <h2 className="text-2xl font-bold">
                      {user.fullName || "Leon Rubin"}
                    </h2>
                    <p className="text-default-500">
                      @{user.username || "leonrubin"}
                    </p>
                    <p className="text-sm text-default-400 mt-2">
                      Professional Programmer
                    </p>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-lg font-bold">{75}</p>
                        <p className="text-sm text-default-500">Followers</p>
                      </div>
                      <Divider orientation="vertical" />
                      <div className="text-center">
                        <p className="text-lg font-bold">{21}</p>
                        <p className="text-sm text-default-500">Following</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
            {/* Tabs navigation bar */}
            <div className="border-b border-border py-2">
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
                {[
                  "Profile",
                  "123 Answers",
                  "2 Questions",
                  "0 Posts",
                  "75 Followers",
                  "Following",
                  "Edits",
                  "Activity",
                ].map((tab, i) => (
                  <button
                    key={i}
                    className={`pb-2 border-b-2 ${
                      i === 0
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter bar: Search + Sort */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4 mb-2">
              {/* Search content */}
              <div className="w-full md:w-2/3">
                <input
                  type="text"
                  placeholder="Search content"
                  className="w-full px-4 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Sort options */}
              <div className="w-full md:w-auto">
                <select className="px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none">
                  <option>Most recent</option>
                  <option>All-time views</option>
                </select>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Profile</h3>
            </div>
            <PostList />
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
                    <Icon icon="lucide:calendar" className="text-default-500" />
                    <p className="text-sm">Joined January 2013</p>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Knows about</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {[
                    "Computer Science",
                    "Computer Programming",
                    "Mathematics",
                    "Homes and Houses",
                  ].map((topic, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Avatar
                        src={`https://img.heroui.chat/image/avatar?w=40&h=40&u=${index + 2}`}
                        size="sm"
                      />
                      <div>
                        <p className="font-semibold">{topic}</p>
                        <p className="text-sm text-default-500">
                          {Math.floor(Math.random() * 30) + 10} answers
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
