import Header from "../components/Common/Header/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div>
            <Header />
            <div className="">
                <Outlet />
            </div>
        </div>
    )
}

export default MainLayout