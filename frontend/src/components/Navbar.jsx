import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from "react";

import bgImage from '../assets/images/NIAimg.png';
import { MdLogout } from "react-icons/md";
import Swal from "sweetalert2";

import { useAuthHook } from '../hooks/useAuthHook';
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = ({ items }) => {
  const { logout } = useAuthHook();
  const { user } = useAuthContext();
  const [fontColor, setFontColor] = useState('');

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
    if (user && user.role === '0') {
      setFontColor('bg-superAdminBlue'); // For the background color
    }else if(user && user.role === '1'){
      setFontColor('bg-customgreen')
    }
    else {
      setFontColor('bg-customFontColor')
    }
  }, [user]);

  useEffect(() => {
    console.log('navbar', fontColor)
  }, [fontColor])

  return (
    <nav className="h-screen w-full flex flex-col justify-between bg-white border-r-[1px]">
      <div>
        <div className="h-auto w-full px-3 py-6 flex items-center justify-start">
          <img src={bgImage} alt="" className="w-10 mr-3" />
          <h1 className={`font-semibold text-sm`}>National Irrigation Administration</h1>
        </div>
        <div className="flex flex-col p-2">
          {items.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `w-full h-auto flex items-center justify-start gap-2 px-3 py-3 mt-1 font-normal text-xs rounded-xl transition-all duration-150 ${isActive ? `${fontColor} text-white` : 'text-customFontColor'} text-customFontColor hover:${fontColor} hover:text-white`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-start p-2">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center justify-start py-2 px-4 rounded-lg gap-2 text-sm hover:${fontColor} hover:text-white transition-all duration-150`}
        >
          <MdLogout size={20} />Logout
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
};

export default Navbar;
