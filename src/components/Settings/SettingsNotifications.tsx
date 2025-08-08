import React from "react";
import { useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@heroui/react";
import CardSettingsNotifications from "../Common/CardSettings/CardSettingsNotfications";

const SettingsNotifications = () => {
  const user = useAppSelector((state: RootState) => state.user.user);
  console.log("user:", user);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="flex flex-col h-auto w-full max-w-screen-xl mx-auto p-4">
      <Card className="bg-content1 rounded-md p-4 mb-2">
        <CardHeader>
          <h2 className="text-base font-bold">Content Channels</h2>
        </CardHeader>
        <CardBody>
          <Divider className="mb-4" />
          <CardSettingsNotifications
            title="General questions & answers"
            item={[
              {
                name: "New answers",
                description:
                  "Email me when there are new answers to questions I asked or follow.",
              },
              {
                name: "Requests",
                description:
                  "Email me when someone requests me to answer a question.",
              },
            ]}
          />
          <Divider className="my-4" />
          <CardSettingsNotifications
            title="Messages, comments & mentions"
            item={[
              {
                name: "Messages",
                description: "Email me when someone sends me a direct message.",
              },
              {
                name: "Comments and replies",
                description:
                  "Email me of comments on my content and replies to my comments.",
              },
              {
                name: "Mentions",
                description: "Email me when someone mentions me.",
              },
            ]}
          />
          <Divider className="my-4" />
          <CardSettingsNotifications
            title="Spaces"
            item={[
              {
                name: "Space invites",
                description:
                  "Email me when someone invites me or accepts my invitation to a Space.",
              },
              {
                name: "Space updates",
                description:
                  "Email me when there are feature updates to my Space.",
              },
              {
                name: "Spaces for you",
                description: "Email me about Spaces I might like.",
              },
            ]}
            isShowManage
            manageButtonTitle="Spaces you follow"
            manageButtonDescription="Email me with updates from spaces I follow at my preferred frequency."
          />
          <Divider className="my-4" />
          <CardSettingsNotifications
            title="Your network"
            item={[
              {
                name: "New followers",
                description: "Email me of new followers.",
              },
            ]}
            isShowManage
            manageButtonTitle="People you follow"
            manageButtonDescription="Manage notifications from people that I follow."
          />
        </CardBody>
      </Card>
      <Card className="bg-content1 rounded-md p-4 mb-2">
        <CardHeader>
          <h2 className="text-base font-bold">Activity on Your Content</h2>
        </CardHeader>
        <CardBody>
          <Divider className="mb-4" />
          <CardSettingsNotifications
            title="Upvotes"
            item={[
              {
                name: "Upvotes",
                description: "Email me when someone upvotes my content.",
              },
            ]}
          />
          <Divider className="my-4" />
          <CardSettingsNotifications
            title="Shares"
            item={[
              {
                name: "Shares of my content",
                description: "Email me when someone shares any of my content.",
              },
            ]}
          />
          <Divider className="my-4" />
          <CardSettingsNotifications
            title="Moderation"
            item={[
              {
                name: "My answers",
                description:
                  "Email me when moderation actions are taken on my answers.",
              },
            ]}
          />
        </CardBody>
      </Card>
      <Card className="bg-content1 rounded-md p-4 mb-2">
        <CardHeader>
          <h2 className="text-base font-bold">From Katz Dev</h2>
        </CardHeader>
        <CardBody>
          <Divider className="mb-4" />
          <CardSettingsNotifications
            title="Katz Dev Digest"
            item={[
              {
                name: "Katz Dev Digest",
                description: "Email me with the top stories on Katz Dev.",
              },
            ]}
          />
          <Divider className="my-4" />
          <CardSettingsNotifications
            title="Things you might like"
            item={[
              {
                name: "Popular answers",
                description:
                  "Email me with answers and shares upvoted by people I follow.",
              },
              {
                name: "Stories based on my activity",
                description:
                  "Email me with more stories related to things I read.",
              },
              {
                name: "Recommended questions",
                description: "Email me with questions for me to answer.",
              },
              {
                name: "Favorite authors",
                description: "Email me with stories from my favorite authors.",
              },
            ]}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default SettingsNotifications;
