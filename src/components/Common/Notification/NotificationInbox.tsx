"use client";
import { Inbox } from "@novu/react";
import { useAppSelector } from "../../../store/hooks";
import { RootState } from "../../../store/store";
import { Icon } from "@iconify/react";
import { cn } from "../../../lib/utils";
import { dark } from "@novu/react/themes";
import { useEffect, useState } from "react";

const NotificationInbox = () => {
  const applicationIdentifier = (
    import.meta as ImportMeta & { env: Record<string, string> }
  ).env.VITE_NOVU_KEY;
  const user = useAppSelector((state: RootState) => state.user.user);

  const [theme, setTheme] = useState<"light" | "dark">(
    localStorage.getItem("theme") === "dark" ? "dark" : "light"
  );

  // Update when theme changes (localStorage or class)
  useEffect(() => {
    const updateTheme = () => {
      const current = localStorage.getItem("theme");
      if (current === "dark") setTheme("dark");
      else setTheme("light");
    };

    // Listen to localStorage changes from other tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "theme") updateTheme();
    };

    // Optional: observe class changes if you're using Tailwind dark mode via class
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("storage", handleStorage);
    updateTheme(); // Initial check

    return () => {
      window.removeEventListener("storage", handleStorage);
      observer.disconnect();
    };
  }, []);

  const tabs = [
    {
      label: "All Notifications",
      filter: { tags: [] },
    },
  ];

  return (
    user && (
      <>
        <Inbox
          subscriberId={String(user.id)}
          applicationIdentifier={applicationIdentifier}
          placement="bottom"
          tabs={tabs}
          appearance={{ baseTheme: theme === "dark" ? dark : undefined }}
          renderBell={(unreadCount) => (
            <div className="relative group cursor-pointer">
              <div
                className={cn(
                  "transition-transform duration-300 group-hover:scale-110",
                  unreadCount > 0 && "animate-shake"
                )}
              >
                <Icon
                  icon="lucide:bell"
                  className="w-6 h-6 text-black dark:text-white"
                />
              </div>

              {unreadCount > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md ring-2 ring-white dark:ring-gray-900">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-400 opacity-75 animate-ping"></span>
                </>
              )}
            </div>
          )}
        />
      </>
    )
  );
};

export default NotificationInbox;
