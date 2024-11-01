import PropTypes from 'prop-types'

import { IoMdNotificationsOutline } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { GoInbox } from "react-icons/go";

import { useState, useEffect } from "react";
import { ref, onValue, update } from 'firebase/database';
import { RtDatabase } from '../config/firebase-config';

import { useAuthContext } from "../hooks/useAuthContext";
import Notification from './Notification';



const Header = ({ currentPage}) => {
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
          return parseInputDate(b.input) - parseInputDate(a.input);
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

  return (
    <header className="w-full h-auto flex pt-2 gap-2">
      <div className="w-4/6 p-5 flex items-center">
        <h1 className={`text-2xl font-semibold ${fontColor}`}>{currentPage}</h1>
      </div>
      <div className="h-14 w-2/6 px-4 relative z-20 flex items-center justify-end gap-3">
        {/* Notification Icon */}
        <div>
          <div className="relative">
            <div className='flex gap-3'>
              <GoInbox 
                size={35} 
                className="p-2 rounded-xl bg-white border-2 cursor-pointer hover:scale-125 duration-100 transition-all"
              />
              <IoMdNotificationsOutline 
                size={35} 
                className="p-2 rounded-xl bg-white border-2 cursor-pointer hover:scale-125 duration-100 transition-all"
                onClick={() => setShowNotifications(!showNotifications)}/>
            </div>
            <div className={`absolute -top-3 right-0 p-1 w-auto h-auto ${unreadNotifs > 0 ? 'bg-red-500 text-white': 'bg-gray-300'} rounded-full flex items-center justify-center`}>
              <p className="text-xs font-semibold">{unreadNotifs}</p>
            </div>
            {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(!showNotifications)}></div>

              <div className="absolute w-5 h-5 z-50 top-[39px] right-2 rounded-tl-lg border-l-[1px] border-t-[1px] bg-white rotate-45 "></div>
              <div className="absolute top-12 z-40 -right-28 w-96 bg-white border-[1px] p-4 rounded-lg">
                <h3 className='font-semibold text-xl my-2'>Notifications</h3>

                  <ul className='h-96 rounded-md p-1 flex flex-col overflow-y-auto'>
                    {notifications.length > 0 ? (
                      notifications.map((notification)=> (
                        <Notification key={notification.key} notification={notification} markAsRead={markAsRead} />
                      ))
                      ) : (
                        <li className='text-center'>No notifications found</li>
                      )
                    }
                  </ul>
              </div>
            </>
          )}
          </div>
        </div>

        <div className="w-auto flex py-1 pl-1 pr-5 gap-1 rounded-full border-2 bg-white font-medium relative">
          <div className='flex items-center justify-center'>
            <FaUserCircle size={40} className='text-customFontColor' />
          </div>
          <div>
            <p className={`rounded-full gap-2 ${fontColor}`}>{user?.name ? user?.name.split(',').slice()[0] : 'User'}</p>
            <p className={`rounded-full text-xs gap-2 font-normal ${fontColor}`}>{user?.uemail ? user?.uemail : 'email@gmail.com'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  currentPage: PropTypes.string.isRequired
};

export default Header;
