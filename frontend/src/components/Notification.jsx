import { useEffect, useState } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { RtDatabase } from '../config/firebase-config';
import PropTypes from 'prop-types'

const Notification = ({ userId }) => {
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
        setNotifications(parsedNotifications);
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

  return (
    <div>
      <h3 className='font-semibold text-xl my-2'>Notifications</h3>
      <ul className='h-96 rounded-md p-1 flex flex-col overflow-y-auto'>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <li key={notification.key} onClick={() => markAsRead(notification.key)}>
              <p className='my-1 bg-white p-2 rounded-md cursor-pointer hover:bg-gray-200 '><strong>{notification.input.split('|').slice()[3].replace(',', ' ')}</strong> has successfully transferred the document: <strong>{notification.input.split('|').slice()[2]}</strong></p>
              {!notification.read && <strong> (Unread)</strong>}
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
  userId: PropTypes.string.isRequired
}

export default Notification;
