import { parse, formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types'
import { useOpDisbursementContext } from '../hooks/useOpDisbursementContext';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useEffect, useState } from 'react';


const Notification = ({ notification, markAsRead }) => {
  const {OpDocuments} = useOpDisbursementContext();
  const navigate = useNavigate();
  const { user } = useAuthContext()
  const [notifData, setNotifData] = useState({date: '', time: '', docName: '', name: '', DV: ''})

  
  useEffect(() => {
    const [date, time, docName, name, DV] = notification.input.split('|');
    setNotifData({ date, time, docName, name, DV });
  }, [notification.input]);

  const openNotif = (DV) =>{
    const document = OpDocuments.documents[DV].data
    navigate(`disbursementrecords/${DV}|${document.status}|${user.role}`)
  }

  const formateDateTime = (date, time) => {
    if (!date && !time) return null;
    const formattedDateString = `${date} ${time}`;

    return parse(formattedDateString, 'MMMM dd, yyyy hh:mm:ss a', new Date());
  }
  
  return (
    <li className='my-1 bg-white p-2 rounded-md cursor-pointer hover:bg-gray-200' 
      onClick={() => {
      markAsRead(notification.key)
      console.log('hit notif', notification.input)
      const dvNo = notifData.DV
      openNotif(dvNo)
    }}>
      <p ><strong>{notifData.name.replace(',', ' ')}</strong> has successfully transferred the document: <strong>{notifData.docName}</strong></p>
      <p className='text-xs mt-2'>{formatDistanceToNow(formateDateTime(notifData.date, notifData.time), { addSuffix: true })}</p>
      {!notification.read && <strong className='flex items-end justify-end'>Unread</strong>}
    </li>
  );
};

Notification.propTypes = {
  notification: PropTypes.object.isRequired,
  markAsRead: PropTypes.func.isRequired
}

export default Notification;