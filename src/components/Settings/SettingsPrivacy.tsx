import React from "react";
import { useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import {

  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@heroui/react";
import CardSettingsPrivacy from "../Common/CardSettings/CardSettingsPrivacy";

const SettingsPrivacy = () => {
  const user = useAppSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="flex flex-col h-auto w-full max-w-screen-xl mx-auto p-4">
      <Card className="bg-content1 rounded-md p-4">
        <CardHeader>
          <h2 className="text-base font-bold">Privacy Settings</h2>
        </CardHeader>
        <CardBody>
          <Divider className="mb-4" />

          <CardSettingsPrivacy
            title="Privacy Policy"
            item={[
              { name: "Allow search engines to index your name" },
              { name: "Allow adult content in recommendations" },
              {
                name: "Allow your profile to be discovered by email",
              },
            ]}
            isShowSwitch
            className="cursor-auto hover:no-underline"
          />

          <Divider className="my-4" />

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold mb-2">Inbox Preferences</h3>
            <div className="flex flex-col justify-between">
              <div>
                <label className="flex items-center gap-2 mb-1">
                  <input type="radio" name="inbox" defaultChecked /> Anyone on
                  Quora
                </label>
                <label className="flex items-center gap-2 mb-1">
                  <input type="radio" name="inbox" /> People I follow and admins
                  and moderators of Spaces I follow
                </label>
                <label className="flex items-center gap-2 mb-1">
                  <input type="radio" name="inbox" /> No one
                </label>
              </div>
            </div>
          </div>

          <Divider className="my-4" />

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold mb-2">Comment Preferences</h3>
            <div className="flex flex-col justify-between">
              <div>
                <label className="flex items-center gap-2 mb-1">
                  <input type="radio" name="comments" defaultChecked /> Allow
                  anyone to comment on your answers and posts
                </label>
                <label className="flex items-center gap-2 mb-1">
                  <input type="radio" name="comments" /> Only allow people you
                  follow to comment on your answers and posts
                </label>
                <label className="flex items-center gap-2 mb-1">
                  <input type="radio" name="comments" /> Do not allow comments
                  on your answers and posts
                </label>
              </div>
            </div>
          </div>

          <Divider className="my-4" />

          <CardSettingsPrivacy
            title="Content Preferences"
            item={[
              { name: "Allow GIFs to play automatically" },
              { name: "Allow advertisers on Quora to promote your answers" },
              {
                name: "Allow large language models to be trained on your content",
              },
              { name: "Notify your subscribers of your new questions" },
            ]}
            isShowSwitch
            className="cursor-auto hover:no-underline"
          />

          <Divider className="my-4" />

          <CardSettingsPrivacy
            title="Delete or Deactivate Your Account"
            item={[
              { name: "Delete my account" },
              { name: "Deactivate my account" },
            ]}
            className="text-red-500 transition-all hover:underline"
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default SettingsPrivacy;
