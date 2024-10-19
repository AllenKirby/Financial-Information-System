import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import Swal from 'sweetalert2';

import { MdDelete } from "react-icons/md";
import { FaUserAltSlash } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";

import { useDisableUser } from '../../hooks/useDisableUser';
import { useDeleteUser } from '../../hooks/useDeleteUser';

const AccountDetails = ({account}) => {
    const [role, setRole] = useState('');
    const {deleteUser, isLoadingDelete} = useDeleteUser()

    const {disableAcc, isLoading} = useDisableUser()

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
    }, [account.customClaims.role]);

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
                        text: "Error Disabling the Account",
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
                        text: "Error Deleting the Account",
                        icon: "error",
                    });
                }
            }
        });
    }

    return (
        <div className="w-full h-auto border-[1px] flex rounded-md py-2 hover:bg-slate-100 cursor-pointer my-1">
            <div className='w-[90%] h-auto flex'>
                <p className="w-1/5 px-2 truncate font-semibold">{account.customClaims.dispName.replace(',', ' ')}</p>
                <p className="w-1/5 px-2">{role}</p>
                <p className="w-1/5 px-2 truncate text-blue-500 underline">{account.email}</p>
                <p className={`w-1/5 px-2 text-center font-medium ${account.disabled ? 'text-red-500' : 'text-green-500'}`}>{account.disabled ? 'In Active' : 'Active'}</p>
                <p className={`w-1/5 px-2 text-center font-medium ${account.emailVerified ? 'text-green-500' : 'text-red-500'}`}>{account.emailVerified ? 'True' : 'False'}</p>
            </div>
            <div className='w-[10%] h-auto flex items-center justify-end px-2 gap-2'>
                {!account.disabled ? 
                    <FaUserAltSlash
                        disabled={isLoading} 
                        className={`${isLoading ? 'text-slate-100' : 'text-customFontColor'}`} 
                        size={17}
                        onClick={() => disableUser(true)} /> :
                    <FaUser 
                        disabled={isLoading}
                        className={`${isLoading ? 'text-slate-100' : 'text-customFontColor'}`}
                        size={15}
                        onClick={() => disableUser(false)}/>
                }
                <MdDelete 
                    onClick={deleteAcc} 
                    size={20} 
                    color='red'
                    className={`${isLoadingDelete ? 'text-slate-100' : 'text-red-500'}`}
                    />
            </div>
        </div>
    );
};

AccountDetails.propTypes = {
    account: PropTypes.object.isRequired,
}

export default AccountDetails;
