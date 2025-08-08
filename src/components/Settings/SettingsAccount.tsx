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
  Input,
} from "@heroui/react";

const SettingsAccount = () => {
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
      <Card className="bg-content1 rounded-md p-4 mb-5">
        <CardHeader>
          <h2 className="text-base font-semibold">Account Information</h2>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Avatar
                src={user.avatar || "https://via.placeholder.com/150"}
                size="lg"
                className="w-16 h-16"
              />
              <div>
                <h3 className="text-sm font-semibold">{user.fullName}</h3>
                <p className="text-xs text-gray-400">@{user.username}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="bordered"
              className="w-fit text-xs font-semibold"
            >
              Change Avatar
            </Button>
          </div>

          <Divider className="my-4" />

          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  defaultValue={user.fullName}
                  className="text-sm"
                />
                <Input
                  label="Username"
                  defaultValue={user.username}
                  className="text-sm"
                />
                <Input
                  label="Email"
                  defaultValue={user.email}
                  isDisabled={user.emailVerified}
                  className="text-sm"
                />
                <Input
                  label="Country"
                  defaultValue="Not specified"
                  className="text-sm"
                />
              </div>
            </div>

            <Divider className="my-4" />

            <div>
              <h3 className="text-sm font-semibold mb-2">Connected Accounts</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-2 bg-content1 rounded-md hover:bg-content3 transition-colors duration-200">
                  <div className="flex items-center gap-2">
                    <Icon icon="logos:google" className="w-5 h-5" />
                    <span className="text-sm">Google</span>
                  </div>
                  <Button
                    size="sm"
                    variant="flat"
                    className="text-xs font-semibold"
                  >
                    Connect
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 bg-content1 rounded-md hover:bg-content3 transition-colors duration-200">
                  <div className="flex items-center gap-2">
                    <Icon icon="logos:facebook" className="w-5 h-5" />
                    <span className="text-sm">Facebook</span>
                  </div>
                  <Button
                    size="sm"
                    variant="flat"
                    className="text-xs font-semibold"
                  >
                    Connect
                  </Button>
                </div>
              </div>
            </div>

            <Divider className="my-4" />

            <div>
              <h3 className="text-sm font-semibold mb-2">Security</h3>
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  variant="bordered"
                  className="w-fit text-xs font-semibold"
                >
                  Change Password
                </Button>
                <Button
                  size="sm"
                  variant="bordered"
                  className="w-fit text-xs font-semibold text-red-600"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SettingsAccount;