import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useGoogleLogin } from "../hooks/useGoogleLogin";
import Loader from "../components/Loader";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
    const [isChecked, setIsChecked] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login, isLoading, error} = useLogin()
    const {googleLogin, isLoadingGoogle, errorGoogle} = useGoogleLogin()

    const handleLogin = async(e) => {
        e.preventDefault()
        await login(email, password)
    }

    const handleGoogleLogin = async(e) => {
        e.preventDefault()
        await googleLogin()
    }

  return (
    <div className="w-full h-screen flex items-center justify-center p-20">
        <form action="#" onSubmit={handleLogin} className="w-80 p-5 h-auto rounded-md bg-white shadow-md shadow-black">
            <div className="text-center mb-3">
                <h1 className="text-2xl font-medium">Welcome!</h1>
                <h2 className="text-sm my-2">Please login your details to continue</h2>
            </div>
            <div className="w-full py-2 px-2 gap-2">
                <label className="font-semibold ">Email</label>
                <input 
                    className="w-full px-4 py-2 rounded-md ring-customgreen border-2 border-customgreen focus:outline-none" 
                    type="text" 
                    placeholder="email@gmail.com" 
                    required 
                    onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="w-full py-2 px-2 gap-2">
                <label className="font-semibold ">Password</label> 
                <input 
                    className="w-full px-4 py-2 rounded-md ring-customgreen border-2 border-customgreen focus:outline-none" 
                    type={!isChecked ? 'password' : 'text'} 
                    placeholder="••••••••" 
                    required 
                    onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className="w-full flex gap-1 my-1 px-1"> 
                <input type="checkbox" onClick={() => setIsChecked(!isChecked)}/>
                <label className=" text-xs">Show Password</label>
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
                    <p className="text-center bg-white rounded-lg px-3 absolute -top-3 left-[100px]">Or</p>
                    <button 
                      onClick={handleGoogleLogin}
                      className="w-full my-3 flex items-center justify-center py-2 rounded-lg border-2"><FcGoogle size={20} className="mx-2" />Login with Google</button>
                </div>
        </form>
    </div>
  )
}
export default Login
