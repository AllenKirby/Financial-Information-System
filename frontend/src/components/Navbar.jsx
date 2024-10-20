import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';


import bgImage from '../assets/images/NIAimg.png';
import { MdLogout } from "react-icons/md";
import Swal from "sweetalert2";

import { useAuthHook } from '../hooks/useAuthHook';

const Navbar = ({ items }) => {
  const {logout} = useAuthHook()

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
    <nav className="h-screen w-full flex flex-col justify-between bg-white border-r-[1px]">
      <div>
        <div className='h-auto w-full px-3 py-6 flex items-center justify-start'>
          <img src={bgImage} alt="" className="w-10 mr-3" />
          <h1 className='font-semibold text-sm'>National Irrigation Administration</h1>
        </div>
        <div className='flex flex-col p-2'>
          {items.map((item) => (
            <NavLink 
                key={item.label} 
                to={item.path}
                className='w-full h-auto flex items-center justify-start gap-2 px-3 py-3 font-normal text-xs rounded-xl hover:bg-customFontColor hover:text-white transition-all duration-150'>
                {item.icon}{item.label}
                </NavLink>
            ))}
        </div>
      </div>
      <div className='flex items-center justify-start p-2'>
        <button onClick={handleLogout} className='w-full flex items-center justify-start py-2 px-4 rounded-lg gap-2 text-sm hover:bg-customFontColor hover:text-white transition-all duration-150'><MdLogout size={20}/>Logout</button>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired, // Ensure this matches how you're using it
    })
  ).isRequired,
};

export default Navbar;
