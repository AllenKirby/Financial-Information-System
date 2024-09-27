import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

import { FaRegUser } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";

const AdminPage = () => {

    const navItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: <RxDashboard size={18} /> },
        { label: 'User Management', path: '/admin/usermanagement', icon: <FaRegUser size={15}/> },
    ];

    return(
        <main className="h-screen w-full flex px-6 pt-6">
            <aside className="h-full w-1/6 mr-3">
                <Navbar items={navItems}/>
            </aside>
            <section className="h-full w-5/6 ml-3">
                <section className="h-1/6 w-full">
                    <Header />
                </section>
                <section className="h-5/6 w-full">
                    <Outlet/>
                </section>
            </section>
        </main>
    )
}

export default AdminPage;