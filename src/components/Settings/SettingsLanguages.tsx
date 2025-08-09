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
import ItemLanguage from "../Common/CardSettings/ItemLanguage";

const SettingsLanguages = () => {
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
      <Card className="bg-content1 rounded-md p-4 mb-2">
        <CardHeader>
          <h2 className="text-base font-bold">Language Settings</h2>
        </CardHeader>
        <CardBody>
          <Divider className="mb-2" />
          <div className="flex flex-col gap-2">
            <ItemLanguage
              acronym="EN"
              name="English"
              className="text-blue-500"
              primary
            />
            <Divider />
            <ItemLanguage
              acronym="ES"
              name="Español"
              className="text-orange-500"
            />
            <Divider />
            <ItemLanguage
              acronym="FR"
              name="Français"
              className="text-yellow-500"
            />
            <Divider />
            <ItemLanguage
              acronym="DE"
              name="Deutsch"
              className="text-red-500"
            />
            <Divider />
            <ItemLanguage
              acronym="IT"
              name="Italiano"
              className="text-green-500"
            />
            <Divider />
            <ItemLanguage acronym="JA" name="日本語" className="text-red-500" />
            <Divider />
            <ItemLanguage
              acronym="ID"
              name="Indonesia"
              className="text-blue-500"
            />
            <Divider />
            <ItemLanguage
              acronym="PT"
              name="Português"
              className="text-orange-500"
            />
            <Divider />
            <ItemLanguage
              acronym="HI"
              name="हिन्दी"
              className="text-yellow-500"
            />
            <Divider />
            <ItemLanguage
              acronym="RU"
              name="Русский"
              className="text-red-500"
            />
            <Divider />
            <ItemLanguage acronym="CN" name="中文" className="text-red-500" />
            <Divider />
            <ItemLanguage
              acronym="AR"
              name="العربية"
              className="text-green-500"
            />
            <Divider />
            <ItemLanguage
              acronym="KO"
              name="한국어"
              className="text-blue-500"
            />
            <Divider />
            <ItemLanguage acronym="TH" name="ไทย" className="text-orange-500" />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SettingsLanguages;
