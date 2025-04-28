import { Outlet } from "react-router-dom";
import Sidebar from "../container/Sidebar.js";
import MainHeader from "../container/mainHeader.js";

function Layout() {
    return (
        <>
            <div className="d-flex justify-content-between">
                <div className="">
                    <Sidebar />
                </div>
                <div className="flex-fill sp_main_sec">
                    <MainHeader />
                    <Outlet />
                </div>
            </div>
        </>
    )
}
export default Layout;