import { useTheme } from "next-themes";
import { Switch } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";

const ChangeTheme = () => {
    const { theme, setTheme } = useTheme();

    const handleToggle = (isDark: boolean) => {
        setTheme(isDark ? "dark" : "light");
    };

    return (
        <div>
            <Switch
                defaultSelected={theme === "dark"} 
                color="default"
                endContent={<Icon icon='lucide:sun-medium' className="w-10 h-10"/>}
                size="sm"
                startContent={<Icon icon='lucide:moon' className="w-10 h-10"/>}
                onChange={(e) => handleToggle(e.target.checked)} 
            >
            </Switch>
        </div>
    );
};

export default ChangeTheme;
