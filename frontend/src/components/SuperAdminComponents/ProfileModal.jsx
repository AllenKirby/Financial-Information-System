import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import Profile from '../../assets/images/user.png' 
import { IoIosClose} from "react-icons/io";
import { MdOutlineMailOutline} from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { useSuperAdminHook } from '../../hooks/useSuperAdminHook';

const ProfileModal = ({modal, email, existingEmails}) => {
    const [userFound, setUserFound] = useState(null)
    const { updateRequest, isLoading, error } = useSuperAdminHook()

    const [uemail, ID] = email.split('|')

    useEffect(() => {
        const result = Object.entries(existingEmails).filter(([, user]) => user.email === uemail)
        if(result.length > 0) {
            console.log(result)
            setUserFound(result[0][1])
        } else {
            setUserFound(null)
        }
    }, [uemail, existingEmails])

    const bgColor = (role) => {
        switch(role) {
            case '0':
                return 'bg-superAdminBlue'
            case '1':
                return 'bg-customgreen'
            case '2':
                return 'bg-BOGreen'
            case '3':
                return 'bg-fundingBlueGreen'
            case '4':
                return 'bg-preparerPrimary'
            default:
                return 'bg-customFontColor'
        }
    }

    const role = (role) => {
        switch(role) {
            case '0':
                return 'Super Admin'
            case '1':
                return 'Approver'
            case '2':
                return 'Budget Officer'
            case '3':
                return 'Funding'
            case '4':
                return 'Preparer'
            default:
                return 'Unknown'
        }
    }

    const updateReq = async (flag, email = '') => {
        const res = await updateRequest(ID, flag, email)
        if(res) {
            Swal.fire({
                title: "Success",
                text: flag ? "The password reset request has been approved." : "The password reset request has been rejected.",
                icon: "success",
            });
            modal('')
        } else {
            Swal.fire({
                title: "Error",
                text: {error},
                icon: "error",
            });
        }
    }

  return (
    <div className="relative w-1/4 h-3/4  bg-white rounded-lg">
         <button onClick={() => modal('')} className='z-10 p-2 absolute top-3 right-3'>
            <IoIosClose color='black' size={25}/>
        </button>
        {userFound ? (
            <>
                <div className={`w-full h-1/3 rounded-t-lg ${userFound && userFound.role ? bgColor(userFound.role) : bgColor('')} relative flex items-start justify-end`}>
                    <div className='absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 rounded-full w-28 h-28 bg-white'>
                        <img src={Profile} className='w-full rounded-full h-full bg-cover' />
                    </div>
                </div>
                <div className='w-full h-2/3 rounded-b-lg'>
                    <div className='h-2/3 flex items-end justify-center py-7'>
                        <div>
                            <p className='text-xl font-bold text-center'>{userFound?.name.replace(',', ' ')}</p>
                            <div className='w-full py-5 px-10 flex flex-col gap-3'>
                                <p className='font-semibold flex gap-2'><FiUser size={20}/>{userFound && userFound.role ? role(userFound.role) : role('')}</p>
                                <p className='font-semibold flex gap-2'><MdOutlineMailOutline size={20}/>{userFound?.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className='p-3 h-1/3 flex flex-col gap-2'>
                        <button disabled={isLoading} onClick={() => updateReq(true, userFound.email)} className={`w-full py-1 text-lg rounded-lg text-white ${userFound && userFound.role ? bgColor(userFound.role) : bgColor('')}`}>Approve</button>
                        <button disabled={isLoading} onClick={() => updateReq(false, userFound.email)} className='w-full py-1 text-lg rounded-lg text-white bg-red-500'>Reject</button>
                    </div>
                </div>
            </>
        ) : (
            <>
                <div className='w-full h-5/6 flex items-center justify-center text-center p-3'>
                    <p>The email address is not associated with any account.</p>
                </div>
                <div className='p-3 h-1/6 flex items-end justify-center'>
                    <button disabled={isLoading} onClick={() => updateReq(false)} className='w-full py-1 text-lg rounded-lg text-white bg-red-500'>Reject</button>
                </div>
            </>
        )}
        
    </div>
  )
}

ProfileModal.propTypes = {
    modal: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    existingEmails: PropTypes.object.isRequired
}

export default ProfileModal