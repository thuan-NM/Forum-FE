// src/components/Common/ScrollWrapper.tsx
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

const ScrollWrapper: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return <Outlet />;
};

export default ScrollWrapper;
