import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

import bgImage from '../../assets/images/NIAimg.png';

import { MdLogout } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FiBook} from "react-icons/fi";
import { MdOutlineHistory } from "react-icons/md";
import { FaRegFile } from "react-icons/fa";
import { LuFiles } from "react-icons/lu";
//import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { TbLayoutDashboard } from "react-icons/tb";
import { TbEdit } from "react-icons/tb";
import { PiUsersThreeBold } from "react-icons/pi";
import { TbUserShield } from "react-icons/tb";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

import { useAuthHook } from '../../hooks/useAuthHook';
import { useAuthContext } from "../../hooks/useAuthContext";
import { useSelector } from 'react-redux';

const Navbar = ({flag, sidebar = () => {}, sidebarMobile = () => {} }) => {
  const { logout } = useAuthHook();
  const { user } = useAuthContext();
  const [fontColor, setFontColor] = useState('');
  const [hideText, setHideText] = useState('')
  const permission = useSelector((state) => state.permission)
  const [activeTab, setActiveTab] = useState('')
  const [recordsFlag, setRecordsFlag] = useState(false)
  const [activeSubTab, setActiveSubTab] = useState('DV')
  const location = useLocation()

  useEffect(() => {
    if(user?.role !== '0') {
      if(user?.role === '3' || user?.role === '4') return  setActiveTab('records')
      if(user?.role === '2' || user?.role === '1') return setActiveTab('dashboard')
    } else {
      setActiveTab('usermanagement')
    }
  }, [user])

  useEffect(() => {
    setActiveSubTab(location.pathname)
  }, [location])

  const getRole = () => {
    switch(user?.role) {
      case '0':
        return 'superadmin'
      case '1':
        return 'admin'
      case '2':
        return 'head'
      case '3':
        return 'operator'
      case '4':
        return 'editor'
      default:
        return ''
    }
  }

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
    console.log(hideText, flag)
    if(flag){
      setHideText('block')
    }else {
      setHideText('hidden')
    }
  }, [flag])

  useEffect(() => {
    if (user && user.role === '0') {
      setFontColor('bg-superAdminBlue text-white'); // For the background color
    }else if(user && user.role === '1'){
      setFontColor('bg-customgreen text-white')
    }else if(user && user.role === '2'){
      setFontColor('bg-BOGreen text-white')
    }else if(user && user.role === '3'){
      setFontColor('bg-fundingBlueGreen text-white')
    }else if(user && user.role === '4'){
      setFontColor('bg-preparerPrimary text-white')
    }else {
      setFontColor('bg-customFontColor text-white')
    }
  }, [user]);

  return (
    <nav className="h-screen w-full flex flex-col justify-start bg-gray-100 border-r-2">
      <div className="h-[8%] lg:h-[10%] relative w-full px-4 py-1 sm:py-3 md:py-5 xl:py-3 2xl:py-8 flex gap-2 items-center justify-start">
        <IoIosClose onClick={sidebarMobile} size={30} className="z-50 absolute top-1/2 right-2 transform -translate-y-1/2 block lg:hidden"/>
        <img src={bgImage} alt="" className="w-10 sm:w-12 md:w-12 lg:w-10 2xl:w-16" />
        <h1 className={`font-bold text-2xl sm:text-3xl md:text-3xl lg:text-xl xl:text-2xl 2xl:text-3xl text-customgreen ${hideText}`}>NIA-FIS</h1>
        <button onClick={sidebar} className={`${flag ? 'rotate-180' : ''} z-10 absolute -right-4 rounded-full bg-white border-2 hidden lg:block transition-all duration-150`}>
          <MdKeyboardArrowRight size={25}/>
        </button>
      </div>
      <div className='flex flex-col items-start justify-between w-full h-[92%] lg:h-[90%]'>
        <div className="w-full flex flex-col p-2">
          {user?.role !== '0' && (
            <>
              {(user?.role === '2' || user?.role === '1') && (
                <NavLink 
                  onClick={() => setActiveTab('dashboard')} 
                  to={`/${getRole()}/dashboard`} 
                  className={`w-full h-fit flex items-center justify-start gap-3 px-5 py-3 my-1 text-gray-500 font-bold text-sm sm:text-base md:text-lg lg:text-sm 2xl:text-lg rounded-md ${activeTab === 'dashboard' ? `${fontColor}` : ''}`}>
                    <TbLayoutDashboard size={20}/><span className={`${hideText}`}>Dashboard</span>
                </NavLink>
              )}
              
              <button 
                onClick={() => {setRecordsFlag(!recordsFlag); setActiveTab('records');}} 
                className={`w-full h-fit flex items-center justify-between px-5 py-3 my-1 text-gray-500 font-bold text-sm sm:text-base md:text-lg lg:text-sm 2xl:text-lg rounded-md ${activeTab === 'records' ? `${fontColor}` : ''}`}>
                  <span className='flex items-center justify-center gap-3'><FaRegFile size={20}/><span className={`${hideText}`}>Records</span></span> {recordsFlag ? <IoIosArrowUp size={20}/> : <IoIosArrowDown size={20}/> }
              </button>
              {recordsFlag || flag && (
                <div className='w-full flex flex-col items-center justify-start text-gray-500 font-bold px-7 text-sm'>
                  <NavLink 
                    to={`/${getRole()}/records/disbursementrecords`} 
                    className={`${activeSubTab === `/${getRole()}/records/disbursementrecords` ? `${fontColor} rounded-md` : ''} w-full border-l-2 py-2 px-3`}>
                      DV
                  </NavLink>
                  
                  {(user?.role !== '4' || permission?.data?.permission && permission?.data?.roleName === 'Preparer') && (
                    <NavLink 
                      to={`/${getRole()}/records/burrecords`} 
                      className={`${activeSubTab === `/${getRole()}/records/burrecords` ? `${fontColor} rounded-md` : ''} w-full border-l-2 py-2 px-3`}>
                        BUR
                    </NavLink>
                  )}
                  
                  {(user?.role === '4' || user?.role === '3') && (
                    <NavLink 
                      to={`/${getRole()}/records/payrollrecords`} 
                      className={`${activeSubTab === `/${getRole()}/records/payrollrecords` ? `${fontColor} rounded-md` : ''} w-full border-l-2 py-2 px-3`}>
                        Payroll
                    </NavLink>
                  )}
                </div>
              )}
              
              {(user?.role === '3' || user?.role === '4') && (
                <NavLink 
                  onClick={() => setActiveTab('dvregister')} 
                  to={`/${getRole()}/dvregister`} 
                  className={`w-full h-fit flex items-center justify-start gap-3 px-5 py-3 my-1 text-gray-500 font-bold text-sm sm:text-base md:text-lg lg:text-sm 2xl:text-lg rounded-md ${activeTab === 'dvregister' ? `${fontColor}` : ''}`}>
                    <LuFiles size={20}/><span className={`${hideText}`}>DV Register</span>
                </NavLink>
              )}
              
              {(user?.role === '3' || permission?.data?.permission && permission?.data?.roleName === 'Preparer') && (
                <NavLink 
                  onClick={() => setActiveTab('controlbook')} 
                  to={`/${getRole()}/controlbook`} 
                  className={`w-full h-fit flex items-center justify-start gap-3 px-5 py-3 my-1 text-gray-500 font-bold text-sm sm:text-base md:text-lg lg:text-sm 2xl:text-lg rounded-md ${activeTab === 'controlbook' ? `${fontColor}` : ''}`}>
                    <FiBook size={20}/><span className={`${hideText}`}>Control Book</span>
                </NavLink>
              )}
              
              {(user?.role === '1' || permission?.data?.permission && permission?.data?.roleName === 'Budget Officer') && (
                <NavLink 
                  onClick={() => setActiveTab('editform')} 
                  to={`/${getRole()}/editform`} 
                  className={`w-full h-fit flex items-center justify-start gap-3 px-5 py-3 my-1 text-gray-500 font-bold text-sm sm:text-base md:text-lg lg:text-sm 2xl:text-lg rounded-md ${activeTab === 'editform' ? `${fontColor}` : ''}`}>
                    <TbEdit size={20}/><span className={`${hideText}`}>Edit Form</span>
                </NavLink>
              )}
              
              <NavLink 
                onClick={() => setActiveTab('logs')} 
                to={`/${getRole()}/disbursementlogs`} 
                className={`w-full h-fit flex items-center justify-start gap-3 px-5 py-3 my-1 text-gray-500 font-bold text-sm sm:text-base md:text-lg lg:text-sm 2xl:text-lg rounded-md ${activeTab === 'logs' ? `${fontColor}` : ''}`}>
                  <MdOutlineHistory size={20}/><span className={`${hideText}`}>Logs</span>
              </NavLink>
            </>
          )}

          {user?.role === '0' && (
            <>
              <NavLink 
                onClick={() => setActiveTab('usermanagement')} 
                to={`/${getRole()}/usermanagement`} 
                className={`w-full h-fit flex items-center justify-start gap-3 px-5 py-3 my-1 text-gray-500 font-bold text-sm sm:text-base md:text-lg lg:text-sm 2xl:text-lg rounded-md ${activeTab === 'usermanagement' ? `${fontColor}` : ''}`}>
                  <PiUsersThreeBold size={20}/><span className={`${hideText}`}>User Management</span>
              </NavLink>

              <NavLink 
                onClick={() => setActiveTab('accesscontrol')} 
                to={`/${getRole()}/accesscontrol`} 
                className={`w-full h-fit flex items-center justify-start gap-3 px-5 py-3 my-1 text-gray-500 font-bold text-sm sm:text-base md:text-lg lg:text-sm 2xl:text-lg rounded-md ${activeTab === 'accesscontrol' ? `${fontColor}` : ''}`}>
                  <TbUserShield size={20}/><span className={`${hideText}`}>Access Control</span>
              </NavLink>

              <NavLink 
                onClick={() => setActiveTab('logs')} 
                to={`/${getRole()}/logs`} 
                className={`w-full h-fit flex items-center justify-start gap-3 px-5 py-3 my-1 text-gray-500 font-bold text-sm sm:text-base md:text-lg lg:text-sm 2xl:text-lg rounded-md ${activeTab === 'logs' ? `${fontColor}` : ''}`}>
                  <MdOutlineHistory size={20}/><span className={`${hideText}`}>Activity Logs</span>
              </NavLink>
            </>
          )}
          {/* {items.map((item) => (
            <NavLink
              onClick={sidebarMobile}
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `w-full h-auto flex items-center justify-start gap-3 px-4 my-1 py-3 mt-1 text-gray-500 font-bold text-sm sm:text-base md:text-lg lg:text-sm 2xl:text-lg rounded-md transition-all duration-100 ${isActive ? `${fontColor}` : ''}`
              }
            >
              {item.icon}
              <span className={`${hideText}`}>{item.label}</span>
            </NavLink>
          ))} */}
        </div>
        <div className="w-full flex items-center justify-center p-2">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-start py-2 px-4 rounded-lg gap-2 font-semibold text-sm sm:text-base md:text-lg lg:text-base 2xl:text-lg transition-all duration-150`}
          >
            <MdLogout size={20} />
            <span className={`${hideText}`}>Logout</span>
          </button>
        </div>
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
  sidebarMobile: PropTypes.func,
  sidebar: PropTypes.func
};

export default Navbar;
