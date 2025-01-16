import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useAuthHook } from "../hooks/useAuthHook";

//import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { IoIosArrowRoundBack } from "react-icons/io";

import NIAlogo from '../assets/images/NIAimg.png' 
import LoginBG from '../assets/images/LoginBG.jpg'

import ChangePass from './ChangePass'
import Loader from "../components/Loaders/Loader";
import Swal from 'sweetalert2'

const Login = () => {
    const [isChecked, setIsChecked] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [flag, setFlag] = useState(false)
    const [recoveryEmail, setRecoveryEmail] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    
    //hooks
    const {login, resetPassword,  isLoading, error} = useAuthHook()
    const changePass = useSelector((state) => state.changePass)

    const openForgotPass = () => {
        setFlag(!flag)
    }

    const handleLogin = async(e) => {
        e.preventDefault()
        if(import.meta.env.VITE_STATUS_DEVELOPMENT === 'true'){
            await login(email, password)
        }else{
            setErrorMessage('Under Development...')
        }
    }

    // const handleGoogleLogin = async(e) => {
    //     e.preventDefault()
    //     await googleLogin()
    // }

    useEffect(() => {
        if(error) {
            if(error === 'Firebase: Error (auth/invalid-credential).') {
                setErrorMessage('Invalid Credentials. Please try again')
            } else if(error === 'Please verify your email.') {
                setErrorMessage('Please verify your email.')
            }   
        }
    }, [error])

    const forgotPassword = async(e) => {
        e.preventDefault()
        setErrorMessage(null)
        if(import.meta.env.VITE_STATUS_DEVELOPMENT === 'true'){
            const res = await resetPassword(recoveryEmail)
            if(res){
                Swal.fire({
                    title: "Sent!",
                    text: "Your password reset request has been successfully sent. Please wait for further instructions in your email.",
                    icon: "success",
                });
                openForgotPass()
            } else {
                Swal.fire({
                    title: "Error",
                    text: {error},
                    icon: "error",
                });
            }
        }else{
            setErrorMessage('Under Development...')
        }
    }

  return (
    <section className="w-full h-screen flex flex-col lg:flex-row  items-center justify-start bg-slate-100">
        <div className="w-full lg:w-2/3 h-1/3 lg:h-full py-5 flex flex-col items-center justify-center gap-2 px-5 bg-cover" style={{backgroundImage: `url(${LoginBG})`}}>
            <img className="w-28 sm:w-36 md:w-38 lg:w-48 xl:w-52 z-10" src={NIAlogo} alt="" />
            <h1 className="text-white text-center font-bold z-10 text-xl sm:text-xl md:text-3xl lg:text-4xl">Financial Information System</h1>
        </div>
        <div className="relative w-5/6 lg:w-1/3 h-2/3 lg:h-full flex items-center justify-center">
            <div className={`${flag ? 'w-0' : 'w-full'} h-auto transition-all duration-200`}>
                <form action="#" onSubmit={handleLogin} className={`${flag ? 'hidden' : 'block'} w-full h-auto p-5`}>
                    <div className="text-center mb-3">
                        <h1 className="text-2xl md:text-3xl text-customgreen font-bold">Welcome Back!</h1>
                        <h2 className="text-xs sm:text-xs md:text-sm lg:text-base xl:text-base my-2 text-gray-500">Please login your details to continue</h2>
                    </div>
                    {errorMessage && (
                        <div className={`w-full my-2 h-auto p-3 border-2 rounded-lg ${errorMessage || error ? 'border-red-500 text-red-500 bg-red-100' : 'border-customgreen text-customgreen bg-green-100'}`}>
                            <p className="text-center text-xs sm:text-sm md:text-base 2xl:text-lg">
                            {errorMessage && errorMessage }</p>
                        </div>
                    )}
                    <div className="w-full py-2 px-2 gap-2">
                        <label className="text-gray-500 font-medium text-base sm:text-base md:text-lg lg:text-base xl:text-base">Email</label>
                        <input 
                            className="text-base sm:text-base md:text:lg lg:text-base xl:text-base w-full px-4 py-2 rounded-full border-2 focus:outline-customgreen transition-all duration-100" 
                            type="text" 
                            placeholder="email@gmail.com" 
                            required 
                            onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="w-full py-2 px-2 gap-2">
                        <label className="text-gray-500 font-medium text-base sm:text-base md:text-lg lg:text-base xl:text-base">Password</label> 
                        <div className="relative">
                            <input 
                                className="text-base sm:text-base md:text:lg lg:text-base xl:text-base w-full pl-4 pr-11 py-2 rounded-full border-2 focus:outline-customgreen transition-all duration-500" 
                                type={!isChecked ? 'password' : 'text'} 
                                placeholder="••••••••" 
                                required 
                                onChange={(e) => setPassword(e.target.value)}/>
                            {!isChecked ? 
                                <FiEyeOff 
                                    className="absolute right-4 top-3 text-gray-500 cursor-pointer" 
                                    size={20}
                                    onClick={() => setIsChecked(!isChecked)}/> : 
                                <FiEye 
                                    className="absolute right-4 top-3 text-gray-500 cursor-pointer" 
                                    size={20}
                                    onClick={() => setIsChecked(!isChecked)}/>}
                        </div>
                    </div>
                    <div className="w-full flex items-center justify-center py-3">
                        <button 
                            type="submit" 
                            disabled={isLoading} 
                            className="text-sm sm:text-sm md:text:base lg:text-lg xl:text-lg py-2 px-10 rounded-md bg-customgreen text-white border-customgreen border-[1px] hover:bg-transparent hover:text-customgreen transition-all duration-150"
                            >{isLoading ? <Loader/> : 'Login'}</button>
                    </div>
                    <div className="w-full my-2 text-center">
                        <p onClick={openForgotPass} className="cursor-pointer">Forgot Password?</p>
                    </div>
                    {/* <div className="w-full h-auto px-2 pt-2">
                        <div className="w-full h-auto px-2 pt-2 border-t-2 relative">
                            <p className="text-center text-sm bg-slate-100 rounded-lg px-3 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Or</p>
                            <button 
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full my-3 flex items-center justify-center py-2 rounded-lg border-2"><FcGoogle size={20} className="mx-2" />Login with Google</button>
                        </div>
                    </div> */}
                </form>
            </div>
            <div className={`${flag ? 'w-full' : 'w-0'} h-auto flex flex-col items-center justify-center transition-all duration-200`}>
                <div className={`${flag ? 'block' : 'hidden'} `}>
                    <div className="w-full flex items-center justify-start px-5">
                        <button onClick={openForgotPass} className="text-gray-500 flex items-center justify-center gap-2">
                            <IoIosArrowRoundBack size={25}/>
                            Go Back
                        </button>
                    </div>
                    <form onSubmit={forgotPassword} className="w-full h-auto p-5">
                        <div className="w-full text-center">
                            <h1 className="text-xl font-bold text-customgreen">Forgot Password?</h1>
                            <p className="my-2 text-gray-500">No worries, we&apos;ll send you reset instructions.</p>
                        </div>
                        <div className="my-3">
                            <div className="w-full py-2 px-2 gap-2">
                                <label className="text-gray-500 font-medium text-base sm:text-base md:text-lg lg:text-base xl:text-base">Enter your Email</label>
                                <input 
                                    className="text-base sm:text-base md:text:lg lg:text-base xl:text-base w-full px-4 py-2 rounded-full border-2 focus:outline-customgreen transition-all duration-100" 
                                    type="text" 
                                    placeholder="email@gmail.com" 
                                    required 
                                    onChange={(e) => setRecoveryEmail(e.target.value)}/>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="text-sm sm:text-sm md:text:base lg:text-lg xl:text-lg py-2 px-10 rounded-md bg-customgreen text-white border-customgreen border-[1px] hover:bg-transparent hover:text-customgreen transition-all duration-150">{isLoading ? <Loader/> : 'Submit'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        {changePass && (
            <>
                <div className="fixed inset-0 z-20 bg-black opacity-50"/>
                <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
                    <ChangePass/>
                </div>
            </>
        )}
        
    </section>
  )
}
export default Login
