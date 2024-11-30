import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import Loader from "../Loader"

import { FiEye, FiEyeOff } from "react-icons/fi";

import PropTypes from 'prop-types'
import { useSuperAdminHook } from "../../hooks/useSuperAdminHook"

const UserManagement = ({modal, account = {}, flag}) => {
  //state
  const [userData, setUserData] = useState({ firstname: '', lastname: '', role: '', email: '', password: '' })
  const [isChecked, setIsChecked] = useState(false)
  //hooks
  const {createAcc, isLoading, error} = useSuperAdminHook()

  useEffect(() => {
    if(flag && account){
      setUserData({
        firstname: account.customClaims.dispName.split(',').slice()[0] || '',
        lastname: account.customClaims.dispName.split(',').slice()[1] || '',
        role: account.customClaims.role || '',
        email: account.email || ''
      })
    }
  }, [account, flag])

  useEffect(() => {
    switch(userData.role) {
      case '0':
        setUserData({...userData, password: 'SuperAdmin123'})
        break
      case '1':
        setUserData({...userData, password: 'Approver123'})
        break
      case '2':
        setUserData({...userData, password: 'BudgetOfficer123'})
        break
      case '3':
        setUserData({...userData, password: 'Funding123'})
        break
      case '4':
        setUserData({...userData, password: 'Preparer123'})
        break
    }
  }, [userData.role])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res_creatingAccount = await createAcc(userData)
    if(res_creatingAccount){
      Swal.fire({
        title: "Saved",
        text: "Account is successfully created!",
        icon: "success",
        confirmButtonColor: "#009933"
      });
      modal()
    }
  }
  return (
    <form onSubmit={handleSubmit} className="bg-white w-2/5 rounded-lg border-[1px] mr-3 p-5">
      <h1 className="text-center text-3xl mb-3 font-bold text-superAdminBlue">Create Account</h1>
      <h1 className="mb-3 font-semibold text-lg">Personal Information</h1>
      <div className="h-auto w-full flex gap-3">
        <div className="flex flex-col w-1/2">
          <label className="text-base">Firstname</label>
          <input
            className="w-full px-4 py-2 rounded-md border-2 focus:outline-none"
            type="text"
            placeholder="e.g., John"
            value={userData.firstname}
            pattern="[A-Za-z-_]+" title="Numbers and Special Characters are not allowed"
            onChange={(e) => setUserData({ ...userData, firstname: e.target.value })}
            required />
        </div>
        <div>
        <label className="text-base">Lastname</label>
          <input
            className="w-full px-4 py-2 rounded-md border-2 focus:outline-none"
            type="text"
            placeholder="e.g., Dela Cruz"
            value={userData.lastname}
            pattern="[A-Za-z]+" title="Numbers and Special Characters are not allowed"
            onChange={(e) => setUserData({ ...userData, lastname: e.target.value })}
            required />
        </div>
      </div>
      <h1 className="py-3 font-semibold">Set up Your Account</h1>
      <div className="h-auto w-full ">
        <div className="w-full h-auto">
          <div className="flex gap-2">
            <div className="flex flex-col w-2/3">
              <label className="text-base">Email</label>
              <input
                className=" w-full px-4 py-2 rounded-md border-2 focus:outline-none"
                type="email"
                placeholder="email@gmail.com"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                required />
            </div>
            <div className="w-1/3 flex flex-col">
              <label className="text-base">Role</label>
              <select className="w-full px-4 py-2 rounded-md border-2 focus:outline-none" 
                required 
                value={userData.role} 
                onChange={(e) => setUserData({ ...userData, role: e.target.value })}>
                  <option value="" disabled>Select role</option>
                  <option value="0">Super Admin</option>
                  <option value="1">Approver</option>
                  <option value="2">Budget Officer</option>
                  <option value="3">Funding</option>
                  <option value="4">Preparer</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col w-full my-3">
            <label className="text-base">Password</label>
            <div className="relative">
              <input
                className="w-full px-4 py-2 rounded-md border-2 focus:outline-none"
                type={isChecked ? "text" : "password"}
                placeholder="••••••••"
                value={userData.password}
                disabled
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long"
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                required />
                {!isChecked ? 
                  <FiEyeOff 
                      className="absolute right-4 top-3 text-gray-500 cursor-pointer" 
                      size={20}
                      onClick={() => setIsChecked(!isChecked)}/> : 
                  <FiEye 
                      className="absolute right-4 top-3 text-gray-500 cursor-pointer" 
                      size={20}
                      onClick={() => setIsChecked(!isChecked)}/>
                }
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-auto py-4 flex items-center justify-end gap-3">
        <button disabled={isLoading} type="submit" className="px-10 py-2 bg-superAdminBlue rounded-lg text-white">{isLoading ? <Loader /> : 'Save'}</button>
        <button onClick={modal} className="px-10 py-2 rounded-lg text-superAdminBlue font-semibold">Back</button>
      </div>
      {error && (
        <div className="h-auto w-full py-3 text-center">
          <h5 className="text-superAdminMustard font-semibold">{error === 'Firebase: Error (auth/email-already-in-use).' ? 'Email is already in use' : error}</h5>
        </div>
      )}
    </form>
  )
}

UserManagement.propTypes = {
  modal: PropTypes.func.isRequired,
  account: PropTypes.object,
  flag: PropTypes.bool.isRequired
}

export default UserManagement
