import { parse, formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types'
import { useOpDisbursementContext } from '../hooks/useOpDisbursementContext';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useEffect, useState } from 'react';
import { useDisbursementContext } from '../hooks/useDisbursementContext';
import { useHeadDisbursementContext } from '../hooks/useHeadDisbursementContext';
import { useAdminDisbursementContext } from '../hooks/useAdminDisbursementContext';


const Notification = ({ notification, markAsRead }) => {
  const {OpDocuments} = useOpDisbursementContext();
  const navigate = useNavigate();
  const { user } = useAuthContext()
  const [notifData, setNotifData] = useState({date: '', time: '', docName: '', name: '', DV: ''})
  const [notifMessage, setNotifMessage] = useState({message1: '', message2: '' })
  const { documents } = useDisbursementContext()
  const { HeadDocuments } = useHeadDisbursementContext()
  const {AdminDocuments} = useAdminDisbursementContext()

  
  useEffect(() => {
      const [date, time, docName, name, DV, fund] = notification.data.split('|');
      const DV_key = `${DV}|${fund}`
      setNotifData({ date, time, docName, name, DV_key });
      setNotifMessage({message1: notification.message1, message2: notification.message2})
    
  }, [notification]);

  const openNotif = (DV) =>{
    console.log(user.role)
    if(user.role === '3'){
      const document = OpDocuments.documents[DV].data
      navigate(`disbursementrecords/${DV}|${document.status}|${user.role}`)
    }else if(user.role === '4'){
      const document = documents[DV]
      navigate(`disbursementrecords/${DV}|${document.status}|${user.role}`)
    }else if(user.role === '2'){
      const document = HeadDocuments[DV].data
      navigate(`disbursementrecords/${DV}|${document.status}|${user.role}`)
    }else if(user.role === '1'){
      const document = AdminDocuments[DV].data
      navigate(`disbursementrecords/${DV}|${document.status}|${user.role}`)
    }
  }

  const formateDateTime = (date, time) => {
    if (!date && !time) return null;
    const formattedDateString = `${date} ${time}`;

    return parse(formattedDateString, 'MMMM dd, yyyy hh:mm:ss a', new Date());
  }
  
  return (
    <li className='my-1 bg-white p-2 rounded-md cursor-pointer hover:bg-slate-100' 
      onClick={() => {
      markAsRead(notification.key)
      const dvNo = notifData.DV_key
      openNotif(dvNo)
      }}>
      <p >{notifMessage.message1} <strong>{notifData.docName}</strong> {notifMessage.message2} <strong>{notifData.name.replace(',', ' ')}</strong></p>
      <p className='text-xs mt-2 flex items-center justify-between'>{formatDistanceToNow(formateDateTime(notifData.date, notifData.time), { addSuffix: true })} {!notification.read && <strong className='flex items-end justify-end'>Unread</strong>}</p>
    </li>
  );
};

Notification.propTypes = {
  notification: PropTypes.object.isRequired,
  markAsRead: PropTypes.func.isRequired
}

export default Notification;