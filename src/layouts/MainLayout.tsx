import Header from "../components/Common/Header/Header";
import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../components/Common/ScrollToTop";


const MainLayout = () => {

  return (
    <div className="bg-content2">
      <ScrollToTop />
      <Header />
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
