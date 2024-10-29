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
    <section className="w-full h-screen flex items-center justify-start bg-slate-100">
        <div className="w-1/3 h-full flex items-center justify-center">
            <form action="#" onSubmit={handleLogin} className="w-80 p-5 h-auto rounded-md shadow-lg shadow-gray-400 bg-white">
                <div className="text-center mb-3">
                    <h1 className="text-3xl text-customgreen font-medium">Login</h1>
                    <h2 className="text-sm my-2 text-gray-400">Please login your details to continue</h2>
                </div>
                <div className="w-full py-2 px-2 gap-2">
                    <label className="font-semibold ">Email</label>
                    <input 
                        className="w-full px-4 py-2 rounded-full ring-customgreen border-2 border-customgreen focus:outline-none" 
                        type="text" 
                        placeholder="email@gmail.com" 
                        required 
                        onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="w-full py-2 px-2 gap-2">
                    <label className="font-semibold ">Password</label> 
                    <div className="relative">
                        <input 
                            className="w-full pl-4 pr-11 py-2 rounded-full ring-customgreen border-2 border-customgreen focus:outline-none" 
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
                    className="py-2 px-10 rounded-md bg-customgreen text-white hover:scale-125 transition-all duration-100"
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
        <div className="relative w-2/3 h-full py-5 flex flex-col items-center justify-center gap-2 rounded-l-3xl px-5 bg-gradient-to-tr from-customgreen to-white overflow-hidden">
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <div className="absolute -top-16 -left-10 w-screen h-2/3 transform rotate-12 bg-gradient-to-tr from-customgreen to-white opacity-50"></div>
            </div>
            <img className="w-72 z-10" src={NIAlogo} alt="" />
            <h1 className="text-white text-center text-4xl font-bold z-10">Financial Information System</h1>
        </div>
    </section>
  )
}
export default Login
