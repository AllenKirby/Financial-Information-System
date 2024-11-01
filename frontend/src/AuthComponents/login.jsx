import { useState } from "react";

import Loader from "../components/Loader";
import { useAuthHook } from "../hooks/useAuthHook";

import { FcGoogle } from "react-icons/fc";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import NIAlogo from '../assets/images/NIAimg.png' 

const Login = () => {
    const [isChecked, setIsChecked] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    //hooks
    const {login, googleLogin, isLoading, error} = useAuthHook()

    const handleLogin = async(e) => {
        e.preventDefault()
        await login(email, password)
    }

    const handleGoogleLogin = async(e) => {
        e.preventDefault()
        await googleLogin()
    }

  return (
    <section className="w-full h-screen flex flex-col sm:flex-col md:flex-col lg:flex-row xl:flex-row items-center justify-start bg-slate-100">
        <div className="w-full sm:w-full md:w-full lg:1/2 xl:1/2 h-1/3 sm:1/3 md:h-1/3 lg:h-full xl:h-full rounded-b-3xl sm:rounded-rounded-b-3xl md:rounded-b-3xl lg:rounded-r-3xl xl:rounded-r-3xl relative py-5 flex flex-col items-center justify-center gap-2 px-5 bg-gradient-to-tr from-customgreen to-white overflow-hidden">
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <div className="absolute -top-16 -left-10 w-screen h-2/3 transform rotate-12 bg-gradient-to-tr from-customgreen to-white opacity-50"></div>
            </div>
            <img className="w-28 sm:w-36 md:w-48 lg:70 xl:w-82 z-10" src={NIAlogo} alt="" />
            <h1 className="text-white text-center font-bold z-10 text-xl sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl">Financial Information System</h1>
        </div>
        <div className="w-5/6 sm:w-5/6 md:w-5/6 lg:w-1/2 xl:w-1/2 h-2/3 sm:h-2/3 md:h-2/3 lg:h-full xl:h-full flex items-center justify-center">
            <form action="#" onSubmit={handleLogin} className="w-full sm:w-full md:w-2/3 lg:w-80 xl:w-80 2xl:w-96 h-[26rem] sm:h-[26rem] md:h-auto lg:h-auto xl:h-auto p-5 rounded-md shadow-lg shadow-gray-400 bg-white">
                <div className="text-center mb-3">
                    <h1 className="text-2xl sm:text-2xl md:text-4xl lg:text-3xl xl:text-3xl text-customgreen font-medium">Login</h1>
                    <h2 className="text-xs sm:text-xs md:text-base lg:text-sm xl:text-sm my-2 text-gray-400">Please login your details to continue</h2>
                </div>
                <div className="w-full py-2 px-2 gap-2">
                    <label className="font-semibold text-base sm:text-base md:text-lg lg:text-base xl:text-base">Email</label>
                    <input 
                        className="text-base sm:text-base md:text:lg lg:text-base xl:text-base w-full px-4 py-2 rounded-full ring-customgreen border-2 border-customgreen focus:outline-none" 
                        type="text" 
                        placeholder="email@gmail.com" 
                        required 
                        onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="w-full py-2 px-2 gap-2">
                    <label className="font-semibold text-base sm:text-base md:text-lg lg:text-base xl:text-base">Password</label> 
                    <div className="relative">
                        <input 
                            className="text-base sm:text-base md:text:lg lg:text-base xl:text-base w-full pl-4 pr-11 py-2 rounded-full ring-customgreen border-2 border-customgreen focus:outline-none" 
                            type={!isChecked ? 'password' : 'text'} 
                            placeholder="••••••••" 
                            required 
                            onChange={(e) => setPassword(e.target.value)}/>
                        {!isChecked ? 
                            <FiEyeOff 
                                className="absolute right-3 top-3 text-gray-500 cursor-pointer" 
                                size={20}
                                onClick={() => setIsChecked(!isChecked)}/> : 
                            <FiEye 
                                className="absolute right-3 top-3 text-gray-500 cursor-pointer" 
                                size={20}
                                onClick={() => setIsChecked(!isChecked)}/>}
                    </div>
                </div>
                <div className="w-full flex items-center justify-center py-3">
                    <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="text-base sm:text-base md:text:lg lg:text-base xl:text-base py-2 px-10 rounded-md bg-customgreen text-white hover:scale-125 transition-all duration-100"
                    >{isLoading ? <Loader/> : 'Login'}</button>
                </div>
                {error && (<div className="w-full text-center">
                    <h4 className="text-sm text-red-600">{error}</h4>
                </div>)}
                <div className="w-full h-auto px-2 pt-2">
                    <div className="w-full h-auto px-2 pt-2 border-t-2 relative">
                        <p className="text-center text-sm bg-white rounded-lg px-3 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Or</p>
                        <button 
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full my-3 flex items-center justify-center py-2 rounded-lg border-2"><FcGoogle size={20} className="mx-2" />Login with Google</button>
                    </div>
                </div>
            </form>
        </div>
        
    </section>
  )
}
export default Login
