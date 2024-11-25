import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from "react";

import bgImage from '../assets/images/NIAimg.png';
import { MdLogout } from "react-icons/md";
import Swal from "sweetalert2";

import { useAuthHook } from '../hooks/useAuthHook';
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = ({ items, flag, sidebar = () => {} }) => {
  const { logout } = useAuthHook();
  const { user } = useAuthContext();
  const [fontColor, setFontColor] = useState('');
  const [hideText, setHideText] = useState('')

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

  useEffect(() => {
    if(flag){
      setHideText('block')
    }else {
      setHideText('hidden')
    }
  }, [flag])

  useEffect(() => {
    if (user && user.role === '0') {
      setFontColor('bg-superAdminBlue'); // For the background color
    }else if(user && user.role === '1'){
      setFontColor('bg-customgreen')
    }else if(user && user.role === '2'){
      setFontColor('bg-BOGreen')
    }else if(user && user.role === '3'){
      setFontColor('bg-fundingBlueGreen')
    }else if(user && user.role === '4'){
      setFontColor('bg-preparerPrimary')
    }else {
      setFontColor('bg-customFontColor')
    }
  }, [user]);

  return (
    <nav className="h-screen w-full flex flex-col justify-between bg-eggWhite border-r-2 shadow-gray-300 shadow-lg">
      <div>
        <div className="h-auto relative w-full px-4 py-3 flex gap-2 items-center justify-start">
          <img src={bgImage} alt="" className="w-10 sm:w-12 md:w-12 lg:w-10" />
          <h1 className={`font-bold text-2xl sm:text-3xl md:text-3xl lg:text-2xl text-customgreen ${hideText}`}>NIA-FIS</h1>
        </div>
        <div className="flex flex-col p-2">
          {items.map((item) => (
            <NavLink
              onClick={sidebar}
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `w-full h-auto flex items-center justify-start gap-2 px-4 py-3 mt-1 text-xs sm:text-base md:text-lg lg:text-xs rounded-xl transition-all duration-150 ${isActive ? `${fontColor} text-white` : 'text-customFontColor'} text-customFontColor`
              }
            >
              {item.icon}
              <span className={`${hideText}`}>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-start p-2">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center justify-start py-2 px-4 rounded-lg gap-2 text-sm sm:text-base md:text-lg lg:text-xs transition-all duration-150`}
        >
          <MdLogout size={22} />
          <span className={`${hideText}`}>Logout</span>
        </button>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
  flag: PropTypes.bool.isRequired,
  sidebar: PropTypes.func
};

export default Navbar;
