//import { useState } from "react"
//import { auth } from "../config/firebase-config"

const UserManagement = () => {
  //const [userData, setUserData] = useState({firstname: '', lastname: '', role: '', email: '', password: ''})

  const handleSubmit = async(e) => {
    e.preventDefault()
  }

  return (
    <section className="h-full w-full flex">
      <form onSubmit={handleSubmit} className="w-3/5 h-full rounded-xl mr-3 p-7 shadow-slate-200 shadow-customShadowStyle" action="">
        <h1 className="mb-3 font-semibold">Personal Information</h1>
        <div className="h-auto w-full flex gap-3">
          <input 
              className="text-sm w-1/2 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
              type="text" 
              placeholder="Firstname" 
              required />
          <input 
              className="text-sm w-1/2 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
              type="text" 
              placeholder="Lastname" 
              required />
        </div>
        <h1 className="py-3 font-semibold">Account Details</h1>
        <div className="h-auto w-full ">
          <select className="w-2/3 p-2 rounded-xl text-sm ">
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="guest">Guest</option>
          </select>
          <input 
              className="text-sm w-2/3 my-2 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
              type="email" 
              placeholder="Email" 
              required />
        </div>
        <h1 className="py-3 font-semibold">Set up Your Account</h1>
        <div className="h-auto w-full ">
          <div className="w-full h-auto flex gap-3">
            <input 
              className="text-sm w-1/2 my-2 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
              type="password" 
              placeholder="Password" 
              required />
              <input 
              className="text-sm w-1/2 my-2 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
              type="password" 
              placeholder="Re-enter your Password" 
              required />
          </div>
        </div>
        <div className="w-full h-auto py-2 flex items-center justify-center">
            <button type="submit" className="px-14 py-3 bg-customgreen rounded-xl text-white hover:scale-125 transition-all duration-100">Save</button>
        </div>
      </form>
      <aside className="w-2/5 h-full rounded-xl ml-3 shadow-slate-200 shadow-customShadowStyle">

      </aside>
    </section>
  )
}

export default UserManagement