import { Button, ButtonGroup } from "@nextui-org/button";
import { navigationConfig } from "../config/navigation";
import { useLocation, useNavigate } from "react-router-dom";

const NavigationDrawer = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const location = useLocation();
  return (
    <div className="absolute bottom-8 z-30 left-1/2 -translate-x-1/2">
      <ButtonGroup className="border rounded-2xl">
        {navigationConfig.map((config) => {
          const isActive = location.pathname === config.path;
          return (
            <Button
              onClick={() => navigate(config.path)}
              key={config.path}
              size="lg"
              isIconOnly
              className={`${
                isActive
                  ? "bg-white/5 backdrop-blur-sm"
                  : "bg-gradient-to-tr from-red-500 to-purple-500 shadow-lg"
              }`}
            >
              <span className={`${isActive ? "text-red-500" : "text-white"}`}>
                {config.icon}
              </span>
            </Button>
          );
        })}
      </ButtonGroup>
    </div>
  );
};

export default NavigationDrawer;
