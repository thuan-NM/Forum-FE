import { NavLink } from "react-router-dom";

const SettingsTab = () => {
  const navItems = {
    // account: { path: "/settings", name: "Account" },
    privacy: { path: "/settings", name: "Privacy" },
    notificaions: {
      path: "/settings/notifications",
      name: "Email & Notifications",
    },
    languages: { path: "/settings/languages", name: "Languages" },
  };
  return (
    <div className="w-1/2 mr-6 mt-4">
      <div className="font-semibold border-b border-content4 w-full pb-2 pl-3">
        Settings
      </div>
      <div className="flex flex-col w-full mt-2 gap-y-2">
        {navItems &&
          Object.values(navItems).map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center ${
                  isActive
                    ? "bg-red-500/15 text-red-600 px-4 py-1 text-sm font-medium rounded-sm"
                    : "px-4 py-1 text-sm "
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
      </div>
    </div>
  );
};

export default SettingsTab;
