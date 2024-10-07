import React, { useEffect, useState } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { RtDatabase } from '../config/firebase-config';

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
      <h3>Notifications</h3>
      <ul>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <li key={notification.key} onClick={() => markAsRead(notification.key)}>
              {notification.input}
              {!notification.read && <strong> (Unread)</strong>}
            </li>
          ))
        ) : (
          <li>No notifications found</li>
        )}
      </ul>
    </div>
  );
};

export default Notification;
