import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import Swal from 'sweetalert2';

import { MdDelete } from "react-icons/md";
import { FaUserAltSlash } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";

import LargeLoader from '../Loaders/LargeLoader';

import { useSuperAdminHook } from '../../hooks/useSuperAdminHook';

const AccountDetails = ({index, account}) => {
    //state
    const [role, setRole] = useState('');

    //hooks
    const {deleteUser, disableAcc, isLoading, error} = useSuperAdminHook()

    const getAccCode = (roleCode) => {
        switch (roleCode) {
            case '0':
                return 'Super Admin';
            case '1':
                return 'Approver';
            case '2':
                return 'Budget Officer';
            case '3':
                return 'Funding';
            case '4':
                return 'Preparer';
            default:
                return 'Unknown';
        }
    };

    useEffect(() => {
        setRole(getAccCode(account.customClaims.role));
    }, [account]);

    const disableUser = async(flag) => {

        Swal.fire({
            title: "Are you sure you want to disable this account?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#009933",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Disable it!",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const res = await disableAcc(account.uid, flag)
                    if (res) {
                        Swal.fire({
                            title: "Disabled!",
                            text: "Account has been disabled.",
                            icon: "success",
                        });
                    }else{
                    Swal.fire({
                        title: "Error!",
                        text: {error},
                        icon: "error",
                    });
                }
            }
        });
    }

    const deleteAcc = async() => {

        Swal.fire({
            title: "Are you sure you want to delete this account?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#009933",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete it!",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const res = await deleteUser(account.uid)
                    if (res) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Account has been Deleted.",
                            icon: "success",
                        });
                    }else{
                    Swal.fire({
                        title: "Error!",
                        text: {error},
                        icon: "error",
                    });
                }
            }
        });
    }

    return (
        <div className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-200'} w-full h-auto rounded-lg flex flex-col sm:flex-row p-2 cursor-pointer my-1`}>
            <div className='w-[90%] h-auto flex flex-col sm:flex-row'>
                <p className="w-full sm:w-1/5 truncate font-semibold flex gap-2"><span className="font-bold block sm:hidden">Fullname:</span>{account.customClaims.dispName.replace(',', ' ')}</p>
                <p className="w-full sm:w-1/5 flex gap-2"><span className="font-bold block sm:hidden">Role:</span>{role}</p>
                <p className="w-full sm:w-1/5 truncate flex gap-2"><span className="font-bold block sm:hidden">Email:</span><span className='text-blue-500 underline'>{account.email}</span></p>
                <p className={`w-full sm:w-1/5 font-medium flex items-center justify-start sm:justify-center gap-2`}><span className="font-bold block sm:hidden">Active:</span><span className={`${account.disabled ? 'text-superAdminMustard' : 'text-green-500'}`}>{account.disabled ? 'In Active' : 'Active'}</span></p>
                <p className={`w-full sm:w-1/5 font-medium flex items-center justify-start sm:justify-center gap-2`}><span className="font-bold block sm:hidden">Email Verified:</span><span className={`${account.emailVerified ? 'text-green-500' : 'text-red-500'}`}>{account.emailVerified ? 'True' : 'False'}</span></p>
            </div>
            <div className='w-[10%] h-auto flex items-center justify-end gap-2'>
                {!account.disabled ? 
                    <FaUserAltSlash
                        disabled={isLoading} 
                        size={23}
                        className={`text-superAdminMustard ${isLoading ? 'text-slate-100' : 'text-superAdminMustard'}`} 
                        onClick={() => disableUser(true)} /> :
                    <FaUser 
                        disabled={isLoading}
                        size={20}
                        className={`text-superAdminMustard ${isLoading ? 'text-slate-100' : 'text-superAdminMustard'}`}
                        onClick={() => disableUser(false)}/>
                }
                <MdDelete 
                    onClick={deleteAcc} 
                    size={20}
                    className="text-red-500"
                    />
            </div>
            {(isLoading) && (
                <LargeLoader/>
            )}
        </div>
    );
};

AccountDetails.propTypes = {
    account: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
}

export default AccountDetails;
