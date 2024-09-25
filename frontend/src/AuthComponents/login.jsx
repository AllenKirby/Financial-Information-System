import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import bgImage from '../assets/images/NIAimg.png';

const Login = () => {
    const [isChecked, setIsChecked] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login, isLoading, error} = useLogin()

    const handleLogin = async(e) => {
        e.preventDefault()
        await login(email, password)
    }
    
  return (
    <form action="#" onSubmit={handleLogin} className="w-80 p-7 h-auto rounded-md shadow-md shadow-black bg-white">
        <div className="w-full flex items-center justify-center py-3">
            <img src={bgImage} alt="" className="w-20" />
        </div>
        <div className="text-center mb-2">
            <h1 className="text-2xl font-medium">Login</h1>
        </div>
        <div className="w-full flex items-center py-2 px-2 gap-2">
            <input 
            className="w-full peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
            type="text" 
            placeholder="Username" 
            required 
            onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className="w-full flex items-center py-2 px-2 gap-2">
            <input 
            className="w-full peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
            type={!isChecked ? 'password' : 'text'} 
            placeholder="Password" 
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
            >Login</button>
        </div>
        {error && (<div className="w-full text-center">
            <h4 className="text-lg text-red-600">{error}</h4>
        </div>)}
    </form>
  )
}
export default Login
