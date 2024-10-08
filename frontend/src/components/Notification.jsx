import { useEffect, useState } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { RtDatabase } from '../config/firebase-config';
import PropTypes from 'prop-types'

const Notification = ({ userId, notifs }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) return;
    console.log('hit notif op, ', userId)
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

  const parseInputDate = (input) => {
    const [datePart, timePart] = input.split('|'); // Split into date and time parts
    const formattedDate = `${datePart} ${timePart}`; // Combine date and time
    return new Date(formattedDate); // Create Date object
  };

  // Function to mark notifications as read
  const markAsRead = (notificationKey) => {
    const notificationRef = ref(RtDatabase, `users/${userId}/notifications/${notificationKey}`);
    update(notificationRef, { read: true }); // Update the 'read' status
  };
  const unreadNotifs = () => {
    const unreads = notifications.filter(notification => !notification.read).length
    return unreads
  }
  notifs(unreadNotifs())
  return (
    <div>
      <h3 className='font-semibold text-xl my-2'>Notifications</h3>
      <ul className='h-96 rounded-md p-1 flex flex-col overflow-y-auto'>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <li className='my-1 bg-white p-2 rounded-md cursor-pointer hover:bg-gray-200 ' key={notification.key} onClick={() => markAsRead(notification.key)}>
              <p ><strong>{notification.input.split('|').slice()[3].replace(',', ' ')}</strong> has successfully transferred the document: <strong>{notification.input.split('|').slice()[2]}</strong></p>
              {!notification.read && <strong className='flex items-end justify-end'> Unread</strong>}
            </li>
          ))
        ) : (
          <li className='text-center'>No notifications found</li>
        )}
      </ul>
    </div>
  );
};

Notification.propTypes = {
  userId: PropTypes.string.isRequired,
  notifs: PropTypes.func.isRequired
}

export default Notification;
