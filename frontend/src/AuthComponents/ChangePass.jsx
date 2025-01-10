import { useEffect, useState } from "react"
import { useAuthHook } from "../hooks/useAuthHook"

import { FiEye, FiEyeOff } from "react-icons/fi";
import Loader from "../components/Loaders/Loader";

const ChangePass = () => {
  const { ChangePassword, isLoading, error } = useAuthHook()
  const [password, setPassword] = useState({currentPassword: '', newPassword: '', confirmPassword: ''})
  const [flag, setFlag] = useState({currentPassword: false, newPassword: false, confirmPassword: false})
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    if(error) {
      if(error === 'Firebase: Error (auth/invalid-credential).') {
        setErrorMessage('Incorrect current password. Please try again.')
      }
    }
  }, [error])

  const handleSubmit = async(e) => {
    e.preventDefault()

    setErrorMessage(null)
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if(password.newPassword === password.confirmPassword) {
      if(regex.test(password.newPassword)) {
        await ChangePassword(password.newPassword, password.currentPassword)
      } else {
        setErrorMessage('The password must be at least 8 characters long, contain at least one uppercase letter, and include only alphanumeric characters (letters and numbers)')
      }
    } else {
      setErrorMessage("Password doesn't match")
    }
  }

  return (
    <div onSubmit={handleSubmit} className="w-5/6 xl:w-2/5 h-auto bg-white rounded-lg">
      <form className="w-full h-full p-3">
        <div className="w-full h-auto p-3">
          <h1 className="text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-bold text-customgreen my-2">Get Started</h1>
          <p className="text-justify text-xs sm:text-sm md:text-base 2xl:text-lg">Welcome! As this is your first time logging in, please update your password for security purposes.</p>
        </div>
        <div className={`w-full h-auto p-3 border-2 rounded-lg ${errorMessage || error ? 'border-red-500 text-red-500 bg-red-100' : 'border-customgreen text-customgreen bg-green-100'}`}>
          <p className="text-center text-xs sm:text-sm md:text-base 2xl:text-lg">
            {errorMessage ? 
              errorMessage: 
              'Note: The password must be at least 8 characters long, contain at least one uppercase letter, and include only alphanumeric characters (letters and numbers)'
            }</p>
        </div>
        <div className="w-full h-auto p-3">
          <div className="w-full py-2 px-2 gap-2">
            <label className="font-semibold text-base sm:text-base md:text-lg lg:text-base xl:text-base">Current Password</label> 
            <div className="relative">
              <input 
                className={`${errorMessage ? 'border-red-500 outline-none' : 'focus:outline-customgreen'} text-base sm:text-base md:text:lg lg:text-base xl:text-base w-full pl-4 pr-11 py-2 rounded-full border-2 transition-all duration-500`}
                type={!flag.currentPassword ? 'password' : 'text'} 
                placeholder="••••••••" 
                required
                onChange={(e) => setPassword({...password, currentPassword: e.target.value})}/>
                {!flag.currentPassword ? 
                  <FiEyeOff 
                    className="absolute right-4 top-3 text-gray-500 cursor-pointer" 
                    size={20}
                    onClick={() => setFlag({...flag, currentPassword: !flag.currentPassword})}
                  /> : 
                  <FiEye 
                    className="absolute right-4 top-3 text-gray-500 cursor-pointer" 
                    size={20}
                    onClick={() => setFlag({...flag, currentPassword: !flag.currentPassword})}
                  />
                }
            </div>
          </div>
          <div className="w-full py-2 px-2 gap-2">
            <label className="font-semibold text-base sm:text-base md:text-lg lg:text-base xl:text-base">New Password</label> 
            <div className="relative">
              <input 
                className={`${errorMessage ? 'border-red-500 outline-none' : 'focus:outline-customgreen'} text-base sm:text-base md:text:lg lg:text-base xl:text-base w-full pl-4 pr-11 py-2 rounded-full border-2 transition-all duration-500`}
                type={!flag.newPassword ? 'password' : 'text'} 
                placeholder="••••••••" 
                required 
                onChange={(e) => setPassword({...password, newPassword: e.target.value})}/>
                {!flag.newPassword ? 
                  <FiEyeOff 
                    className="absolute right-4 top-3 text-gray-500 cursor-pointer" 
                    size={20}
                    onClick={() => setFlag({...flag, newPassword: !flag.newPassword})}
                  /> : 
                  <FiEye 
                    className="absolute right-4 top-3 text-gray-500 cursor-pointer" 
                    size={20}
                    onClick={() => setFlag({...flag, newPassword: !flag.newPassword})}
                  />
                }
            </div>
          </div>
          <div className="w-full py-2 px-2 gap-2">
            <label className="font-semibold text-base sm:text-base md:text-lg lg:text-base xl:text-base">Confirm Password</label> 
            <div className="relative">
              <input 
                className={`${errorMessage ? 'border-red-500 outline-none' : 'focus:outline-customgreen'} text-base sm:text-base md:text:lg lg:text-base xl:text-base w-full pl-4 pr-11 py-2 rounded-full border-2 transition-all duration-500`}
                type={!flag.confirmPassword ? 'password' : 'text'} 
                placeholder="••••••••" 
                required 
                onChange={(e) => setPassword({...password, confirmPassword: e.target.value})}/>
                {!flag.confirmPassword ? 
                  <FiEyeOff 
                    className="absolute right-4 top-3 text-gray-500 cursor-pointer" 
                    size={20}
                    onClick={() => setFlag({...flag, confirmPassword: !flag.confirmPassword})}
                  /> : 
                  <FiEye 
                    className="absolute right-4 top-3 text-gray-500 cursor-pointer" 
                    size={20}
                    onClick={() => setFlag({...flag, confirmPassword: !flag.confirmPassword})}
                  />
                }
            </div>
          </div>
        </div>
        <div className="w-full h-auto p-2 flex items-center justify-center">
          <button 
            disabled={isLoading}
            type="submit"
            className="text-sm lg:text-base xl:text-lg w-full py-2 rounded-lg bg-customgreen text-white flex items-center justify-center">{isLoading ? <Loader/> : 'Save'}</button>
        </div>
      </form>
    </div>
  )
}

export default ChangePass