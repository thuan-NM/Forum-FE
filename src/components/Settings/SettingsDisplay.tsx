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

const SettingsDisplay = () => {
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
    <div>Display Settings component</div>
  );
};

export default SettingsDisplay;
