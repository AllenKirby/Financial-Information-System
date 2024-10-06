import { useLogout } from "../hooks/useLogout";
import Swal from "sweetalert2";
import PropTypes from 'prop-types'
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";
import { useState } from "react";

const Header = ({ currentPage }) => {
  const { logout } = useLogout();
  const [dropDown, setDropDown] = useState(false)

  const handleLogout = () => {
    Swal.fire({
      title: "Do you want to logout?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Logout",
      confirmButtonColor: "#ab0310"
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  return (
    <header className="w-full h-auto flex gap-2">
      <div className="w-4/6 p-5 bg-white flex items-center rounded-xl shadow-slate-200 shadow-customShadowStyle">
        <h1 className="text-xl font-semibold">{currentPage}</h1>
      </div>
      <div className="h-14 w-2/6 px-4 bg-white flex items-center justify-between rounded-xl shadow-slate-200 shadow-customShadowStyle">
        <IoMdNotificationsOutline size={35} className="p-2 rounded-xl bg-slate-100 cursor-pointer hover:scale-125 duration-100 transition-all"/>
        <div className="w-auto flex py-2 pr-3 pl-4 gap-1 rounded-full bg-slate-100 relative">
          <p>Allen Kirby</p>
          <button onClick={() => setDropDown(!dropDown)} className="hover:bg-white rounded-lg px-1 py-1">{!dropDown ? <FaAngleDown /> : <FaAngleUp />}</button>
          {dropDown && <>
              <div className="bg-white absolute top-8 right-[10px] w-7 h-7 rounded-md rotate-45"></div>
              <div className="absolute top-9 right-0 bg-white rounded-xl py-1 px-2">
                <button onClick={handleLogout} className="rounded-lg px-7 py-1 font-semibold hover:bg-slate-100 hover:scale-105 transition-all duration-100">Logout</button>
              </div>
            </>}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  currentPage: PropTypes.string.isRequired
};

export default Header;
