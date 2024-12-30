import PropTypes from 'prop-types'

import { IoMdNotificationsOutline } from "react-icons/io";
import { IoMdNotifications } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";

import { useState, useEffect } from "react";
import { ref, onValue, update } from 'firebase/database';
import { RtDatabase } from '../config/firebase-config';

import { useAuthContext } from "../hooks/useAuthContext";
import Notification from './Notification';

const Header = ({ currentPage, sidebar}) => {
  const [showNotifications, setShowNotifications] = useState(false); // For showing notification dropdown
  const [unreadNotifs, setUnreadNotifs] = useState(0)
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuthContext();
  const userId = user?.uid
  const [fontColor, setFontColor] = useState('')

  const notifs = (n) => setUnreadNotifs(n)

  const parseInputDate = (input) => {
    const [datePart, timePart] = input.split('|'); // Split into date and time parts
    const formattedDate = `${datePart} ${timePart}`; // Combine date and time
    return new Date(formattedDate); // Create Date object
  };

  useEffect(() => {
    if (!userId) return;
    const notificationsRef = ref(RtDatabase, `users/${userId}/notifications`);

    // Listen for changes to the notifications node
    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const parsedNotifications = Object.keys(data).map((key) => ({
          key,
          ...data[key]
        }));

        const sortedNotifications = parsedNotifications.sort((a, b) => {
          return parseInputDate(b.data) - parseInputDate(a.data);
        });
        setNotifications(sortedNotifications);

      } else {
        setNotifications([]);  // No notifications found
      }
    });


    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [userId]);

    // Function to mark notifications as read

  const markAsRead = (notificationKey) => {
    const notificationRef = ref(RtDatabase, `users/${userId}/notifications/${notificationKey}`);
    update(notificationRef, { read: true }); // Update the 'read' status
  };

  
  useEffect(() => {
    const unreadnotifs = () => {
      return notifications.filter(notification => !notification.read).length
    }
    notifs(unreadnotifs())
  }, [notifications])

  useEffect(()=> {
    if(user && user.role === '0'){
      setFontColor('text-superAdminBlue')
    }else if(user && user.role === '1'){
      setFontColor('text-customgreen')
    }else if(user && user.role === '2'){
      setFontColor('text-BOGreen')
    }else if(user && user.role === '3'){
      setFontColor('text-fundingBlueGreen')
    }else if(user && user.role === '4'){
      setFontColor('text-preparerPrimary')
    }
    else {
      setFontColor('text-customFontColor')
    }
  },[user])

  const avatar = (name) => {
    if(name){
      const nameSplit = name.split(' ')
      const initial =  `${nameSplit[0].charAt(0)}${nameSplit[1].charAt(0)}`
      return initial.toUpperCase()
    }
  }


  return (
    <header className="w-full h-auto flex px-2 relative bg-white">
      <div className="w-4/6 p-3 flex items-center justify-start gap-2">
        <GiHamburgerMenu 
          size={25}
          className='bg-white cursor-pointer block lg:hidden'
          onClick={sidebar}/>
        <h1 className={`text-base sm:text-lg md:text-2xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-bold ${fontColor}`}>{currentPage}</h1>
      </div>
      <div className="h-inherit w-2/6 px-4 relative z-20 flex items-center justify-end gap-3">
        {/* Notification Icon */}
        <div className='w-1/4'>
          <div className="relative">
            <div className='flex items-center justify-end gap-3'>
              {showNotifications ? (
                <IoMdNotifications 
                  className="bg-white cursor-pointer text-[25px] md:text-[30px] lg:text-[30px] xl:text-[25px] 2xl:text-[30px]"
                  onClick={() => setShowNotifications(!showNotifications)}/>
                )
              :(
                <IoMdNotificationsOutline 
                  className="bg-white cursor-pointer text-[25px] md:text-[30px] lg:text-[30px] xl:text-[25px] 2xl:text-[30px]"
                  onClick={() => setShowNotifications(!showNotifications)}/>
              )}
            </div>
            <div className={`absolute -top-2 right-0 p-1 w-auto h-auto ${unreadNotifs > 0 ? 'bg-red-500 text-white': 'bg-gray-300'} rounded-full flex items-center justify-center`}>
              <p className="text-[8px] font-semibold">{unreadNotifs}</p>
            </div>
          </div>
        </div>
        <div className="hidden sm:hidden md:hidden lg:flex xl:flex 2xl:flex items-center gap-2">
          <div className="bg-gray-300 w-12 h-12 rounded-full flex items-center justify-center">
            <p className='font-bold'>{avatar(user?.name)}</p>
          </div> 
          <div className="flex flex-col justify-center">
            <p className={`font-bold text-sm lg:text-base xl:text-base 2xl:text-base truncate ${fontColor}`}>
              {user?.name || "User"}
            </p>
            <p className="text-xs lg:text-sm xl:text-sm 2xl:text-base truncate text-gray-500">
              {user?.uemail || "email@gmail.com"}
            </p>
          </div>
        </div>
        <div className='sm:flex md:flex lg:hidden xl:hidden 2xl:hidden flex items-center justify-center'>
          <div className="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center">
            <p className='font-bold text-sm'>{avatar(user?.name)}</p>
          </div>
        </div>
      </div>
      {/* Notifications Dropdown */}
      {showNotifications && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(!showNotifications)}></div>
          <div className="absolute shadow-lg shadow-gray-400 top-[60px] z-40 md:right-2 lg:right-2 w-full md:w-1/2 lg:w-1/3 bg-white border-[1px] p-4 rounded-lg">
            <h3 className={`font-semibold text-xl my-2 ${fontColor}`}>Notifications</h3>
              <ul className='h-96 rounded-md p-1 flex flex-col overflow-y-auto'>
                {notifications.length > 0 ?( 
                  notifications.map((notification)=> (
                    <Notification key={notification.key} notification={notification} markAsRead={markAsRead} />
                  ))): (
                    <div className='w-full h-full flex items-center justify-center'>
                      <li className='text-center'>No Notifications found</li>
                    </div>
                  )
                }
              </ul>
          </div>
        </>
      )}
    </header>
  );
};

Header.propTypes = {
  currentPage: PropTypes.string.isRequired,
  sidebar: PropTypes.func.isRequired
};

export default Header;
