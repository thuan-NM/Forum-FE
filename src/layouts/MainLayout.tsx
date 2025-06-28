import Header from "../components/Common/Header/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div className="bg-content2">
            <Header />
            <div className="">
                <Outlet />
            </div>
        </div>
    )
}

export default MainLayout