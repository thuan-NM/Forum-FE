import SettingsLayout from "../layouts/SettingsLayout";
import SettingsTab from "../components/Settings/SettingsTab";
import { Outlet } from "react-router-dom";

const SettingsPage = () => {
  return (
    <SettingsLayout>
      <div className="flex flex-row mt-6">
        <div className="basis-1/4 flex justify-end">
          <SettingsTab />
        </div>
        <div className="basis-3/5">
          <Outlet />
        </div>
        {/* <div className="w-full !max-w-xs flex justify-start">
          <TopicTab />
        </div> */}
      </div>
    </SettingsLayout>
  );
};

export default SettingsPage;
