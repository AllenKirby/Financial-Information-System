import { parse, formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';


const Notification = ({ notification, markAsRead, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuthContext()
  const [notifData, setNotifData] = useState({dateTime: '', docName: '', name: '', DV: ''})
  const [notifMessage, setNotifMessage] = useState({message1: '', message2: '' })
  const DVRecords = useSelector((state) => state.dvrecords)

  
  useEffect(() => {
      const [dateTime, docName, name, DV, fund] = notification.data.split('|');
      const DV_key = `${DV}|${fund}`
      setNotifData({ dateTime, docName, name, DV_key });
      setNotifMessage({message1: notification.message1, message2: notification.message2})
    
  }, [notification]);

  const openNotif = (DV) => {
    if(user.role === '3'){
      if(notification.message1.includes('Disbursement')) {
        const document = DVRecords.documents[DV].data 
        navigate(`records/disbursementrecords/${DV}|${document.status}|${user.role}`)
        onClose()
      } else {
        navigate(`records/burrecords/${DV.split('|')[0]}`)
        onClose()
      }
    }else if(user.role === '4'){
      if(notification.message1.includes('Disbursement')) {
        const document = DVRecords[DV]
        navigate(`records/disbursementrecords/${DV}|${document.status}|${user.role}`)
        onClose()
      } else {
        navigate(`records/burrecords/${DV.split('|')[0]}`)
        onClose()
      }
    }else if(user.role === '2'){
      if(notification.message1.includes('Disbursement')) {
        const document = DVRecords[DV].data
        navigate(`records/disbursementrecords/${DV}|${document.status}|${user.role}`)
        onClose()
      } else {
        navigate(`records/burrecords/${DV.split('|')[0]}`)
        onClose()
      }
    }else if(user.role === '1'){
      if(notification.message1.includes('Disbursement')) {
        const document = DVRecords[DV].data
        navigate(`records/disbursementrecords/${DV}|${document.status}|${user.role}`)
        onClose()
      } else {
        navigate(`records/burrecords/${DV.split('|')[0]}`)
        onClose()
      }
    }
  }

  const formateDateTime = (dateTime) => {
    if (!dateTime) return null;

    return parse(dateTime, 'MMMM dd, yyyy hh:mm:ss a', new Date());
  }

  //console.log(notification.data.split('|')[3])
  
  return (
    <li className='my-1 bg-white p-2 rounded-md cursor-pointer text-gray-500 hover:bg-slate-100' 
      onClick={() => {
      markAsRead(notification.key)
      const dvNo = notifData.DV_key
      openNotif(dvNo)
      }}>
      <p>{notifMessage.message1} <strong>{notifData.docName}</strong> {notifMessage.message2} <strong>{notifData.name.replace(',', ' ')}</strong></p>
      <p className='text-xs mt-2 flex items-center justify-between'>{formatDistanceToNow(formateDateTime(notifData.dateTime), { addSuffix: true })} {!notification.read && <strong className='flex items-end justify-end text-red-500'>Unread</strong>}</p>
    </li>
  );
};

Notification.propTypes = {
  notification: PropTypes.object.isRequired,
  markAsRead: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

export default Notification;