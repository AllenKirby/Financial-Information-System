import { useAuthContext } from '../hooks/useAuthContext'
import { usePreparerHook } from '../hooks/usePreparerHook'
import { useFundingHook } from '../hooks/useFundingHook';
import { useBudgetOfficerHook } from '../hooks/useBudgetOfficerHook';
import { useApproverHook } from '../hooks/useApproverHook';
import { useAuthHook } from '../hooks/useAuthHook';

import { MdOutlineMailOutline, MdVerified, MdCameraAlt } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { useState } from 'react';

import DP from '../assets/images/user.png'
import Swal from 'sweetalert2';

const Profile = () => {
    const { user } = useAuthContext()
    const { resetPassword, isLoading: isLoadingUser, error: errorUser } = useAuthHook()
    const { updateAccount: updatePreparerAcc, isLoading: isLoadingPreparer, error: errorPreparer} = usePreparerHook()
    const { updateAccount: updateFundingAcc, isLoading: isLoadingFunding, error: errorFunding} = useFundingHook()
    const { updateAccount: updateBOAcc, isLoading: isLoadingBO, error: errorBO } = useBudgetOfficerHook()
    const { updateAccount: updateApproverAcc, isLoading: isLoadingApprover, error: errorApprover } = useApproverHook()

    const [editProfile, setEditProfile] = useState(false)
    const [userData, setUserData] = useState({name: ''})
    const [imagePreview, setImagePreview] = useState(DP)
    const [error, setError] = useState(null)

    const edit = () => {
        setEditProfile(!editProfile)
        setError(null)
        if(editProfile){
            setImagePreview(DP)
        }
    }

    const userRole = (role) => {
        switch(role) {
            case '1': 
                return 'Approver'
            case '2':
                return 'Budget Officer'
            case '3':
                return 'Funding'
            case '4':
                return 'Preparer'
            default:
                return 'User'
        }
    }

    // const handleUploadImage = (e) => {
    //     const image = e.target.file[0]
    //     // if (image) {
    //     //     const reader = new FileReader();
    //     //     reader.onload = () => {
    //     //       setUserData({...userData, image: reader.result});
    //     //     };
    //     //     reader.readAsDataURL(image);
    //     //   }
    // }

    const uploadImage = () => {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = '.png, .jpg, .jpeg'
        input.addEventListener('change', (event) => {
            const image = event.target.files[0]
            if (image) {
                const reader = new FileReader();
                reader.onload = () => {
                    setImagePreview(reader.result)
                };
                reader.readAsDataURL(image);
            }
        })
        input.click();
    }

    const updateAcc = async() => {
        setError(null)
        const data = {
            role: user.role,
            name: userData.name
        }
        if(userData.name) {
            let res
           switch(user.role) {
            case '4':
                res = await updatePreparerAcc(data)
                break
            case '3':
                res = await updateFundingAcc(data)
                break
            case '2':
                res = await updateBOAcc(data)
                break
            case '1':
                res = await updateApproverAcc(data)
                break
           }

           if(res){
                Swal.fire({
                    title: "Sent!",
                    text: "Your Profile has been updated",
                    icon: "success",
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: {errorPreparer, errorFunding, errorBO, errorApprover},
                    icon: "error",
                });
            }
        } else(
            Swal.fire({
                title: "Error",
                text: 'Please fill out the name before saving.',
                icon: "error",
            })
        )
    }

    const bgColor = () => {
        switch(user?.role) {
            case '4':
                return 'bg-preparerPrimary'
            case '3':
                return 'bg-fundingBlueGreen'
            case '2':
                return 'bg-BOGreen'
            case '1':
                return 'bg-customgreen'
        }
    }

    const outlineColor = () => {
        switch(user?.role) {
            case '4':
                return 'focus:outline-preparerPrimary'
            case '3':
                return 'focus:outline-fundingBlueGreen'
            case '2':
                return 'focus:outlineBOGreen'
            case '1':
                return 'focus:outline-customgreen'
        }
    }    

    const resetUserPassword = async() => {
            const res = await resetPassword(user.email)
            if(res){
                Swal.fire({
                    title: "Sent!",
                    text: "Your password reset request has been successfully sent. Please wait for further instructions in your email.",
                    icon: "success",
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: {errorUser},
                    icon: "error",
                });
            }
    }

  return (
    <section className='w-full h-full p-3 flex items-center justify-center gap-3'>
        <div className='w-2/3 h-full border-2 rounded-lg'>  
            <div className={`${bgColor()} relative w-full h-1/2 rounded-t-lg flex items-center justify-end p-5`}>
                {editProfile ? (
                    <div className='flex gap-3'>
                        <button disabled={isLoadingPreparer || isLoadingFunding || isLoadingBO || isLoadingApprover} onClick={updateAcc} className='px-5 py-2 text-white font-semibold rounded-lg bg-preparerSecondary'>Save</button>
                        <button onClick={edit} className='px-5 py-2 text-white font-semibold rounded-lg bg-preparerSecondary'>Cancel</button>
                    </div>
                ) : (
                    <button 
                        className="px-5 py-2 text-white font-semibold rounded-lg bg-preparerSecondary"
                        onClick={edit}>Edit Profile</button>
                )}
                <div className="absolute -bottom-28 left-10 w-52 h-52 rounded-full border-4 border-white">
                    <div className='w-full h-full relative bg-white rounded-full'>
                        <img className='w-full h-full object-cover rounded-full' src={imagePreview} alt="profile picture" />
                        {editProfile && (
                            <button onClick={uploadImage} className='absolute right-0 bottom-[22px] p-3 w-auto h-auto rounded-full bg-gray-200'>
                                <MdCameraAlt size={25}/>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="w-full h-1/2 rounded-lg flex items-center justify-end py-8">
                <div className='w-3/5 h-full'>
                    {editProfile ? (
                        <div className='flex flex-col'>
                            <label>Name</label>
                            <input 
                                className={`${outlineColor()} text-xl w-3/4 px-4 py-2 rounded-lg border-2 transition-all duration-100`}
                                type="text" 
                                placeholder="e.g. Juan dela Cruz" 
                                required 
                                value={userData.name}
                                onChange={(e) => setUserData({name: e.target.value})}
                            />
                            <p className='text-red-500'>{error}</p>
                        </div>
                    ) : (
                        <p className='font-bold text-3xl py-2'>{user?.name.replace(',', ' ')}</p>
                    )}
                </div>
            </div>
        </div>
        <div className='w-1/3 h-full flex flex-col gap-3'>
            <div className='w-full h-1/3 border-2 rounded-lg p-5'>
                <h1 className='text-lg font-bold'>General Information</h1>
                <div className='flex flex-col gap-3 my-3 px-3'>
                    <div className='w-full flex items-center justify-start'>
                        <p className='text-lg flex items-center justify-start gap-3'>
                            <FiUser size={25}/> 
                            {userRole(user?.role)}
                        </p>
                    </div>
                    <div className='w-full flex items-center justify-start'>
                        <p className='text-lg flex items-center justify-start gap-3'>
                            <MdOutlineMailOutline size={25}/> 
                            {user?.uemail}
                            <MdVerified color='green'/>
                        </p>
                    </div>
                </div>
            </div>
            <div className='w-full h-2/3 border-2 rounded-lg p-3'>
                <div className='px-2 py-2'>
                    <h1 className='text-lg font-bold h-1/6'>Security</h1>
                </div>
                <div className='w-full h-5/6 flex items-center justify-center p-2 bg-gray-200 rounded-lg'>
                    <div className='flex flex-col gap-3'>
                        <div className='flex items-center justify-center'>
                            <button disabled={isLoadingUser} onClick={resetUserPassword} className={`${bgColor()} px-5 py-2 rounded-lg text-white`}>Send a Request</button>
                        </div>
                        <p className='text-sm text-center'>Request a password change if you’ve forgotten your current password.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Profile