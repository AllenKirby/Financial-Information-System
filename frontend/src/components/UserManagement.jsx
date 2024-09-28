import { useEffect, useState } from "react"
import { useCreateAcc } from "../hooks/useCreateAcc"
import DisbursementVoucher from "./DisbursementVoucher"

const UserManagement = () => {
  const [userData, setUserData] = useState({ firstname: '', lastname: '', role: '', email: '', password: '', confirmPassword: '' })
  const { createAcc, isLoading, error } = useCreateAcc()
  const [passwordError, setPasswordError] = useState('')
  const [documentFlag, setDocumentFlag] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (userData.password !== userData.confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }
    setPasswordError("") 

    await createAcc(userData)
  }

  useEffect(()=>{
    console.log(userData.role)
  }, [userData.role])

  return (
    <section className="h-full w-full flex">
      <form onSubmit={handleSubmit} className="w-3/5 rounded-xl mr-3 p-7 shadow-slate-200 shadow-customShadowStyle">
        <h1 className="mb-3 font-semibold">Personal Information</h1>
        <div className="h-auto w-full flex gap-3">
          <input
            className="text-sm w-1/2 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen"
            type="text"
            placeholder="Firstname"
            pattern="[A-Za-z]+" title="Numbers and Special Characters are not allowed"
            onChange={(e) => setUserData({ ...userData, firstname: e.target.value })}
            required />
          <input
            className="text-sm w-1/2 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen"
            type="text"
            placeholder="Lastname"
            pattern="[A-Za-z]+" title="Numbers and Special Characters are not allowed"
            onChange={(e) => setUserData({ ...userData, lastname: e.target.value })}
            required />
        </div>
        <h1 className="py-3 font-semibold">Account Details</h1>
        <div className="h-auto w-full ">
          <select className="w-2/3 p-2 rounded-xl text-sm" 
          required value={userData.role} 
          onChange={(e) => setUserData({ ...userData, role: e.target.value })}>
             <option value="" disabled>Select role</option>
            <option value="1">Admin</option>
            <option value="4">Editor</option>
          </select>
        </div>
        <h1 className="py-3 font-semibold">Set up Your Account</h1>
        <div className="h-auto w-full ">
          <div className="w-full h-auto">
            <input
              className="text-sm w-2/3 my-2 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen"
              type="email"
              placeholder="Email"
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              required />
            <div className="flex gap-3">
              <input
                className="text-sm w-1/2 my-2 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen"
                type="password"
                placeholder="Password"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long"
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                required />
              <input
                className="text-sm w-1/2 my-2 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen"
                type="password"
                placeholder="Confirm your Password"
                onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                required />
            </div>
          </div>
          {passwordError && (
            <div className="text-red-600 font-semibold">
              {passwordError}
            </div>
          )}
        </div>
        <div className="w-full h-auto py-2 flex items-center justify-center">
          <button disabled={isLoading} type="submit" className="px-14 py-3 bg-customgreen rounded-xl text-white hover:scale-125 transition-all duration-100">Save</button>
        </div>
        {error && (
          <div className="h-auto w-full py-3 text-center">
            <h5 className="text-red-600 font-semibold">{error}</h5>
          </div>
        )}
      </form>
      <aside className="w-2/5 h-full rounded-xl ml-3 p-10 shadow-slate-200 shadow-customShadowStyle">
        <button onClick={() => setDocumentFlag(true)}>View Document</button>
      </aside>
      {documentFlag && <DisbursementVoucher/>}
    </section>
  )
}

export default UserManagement
