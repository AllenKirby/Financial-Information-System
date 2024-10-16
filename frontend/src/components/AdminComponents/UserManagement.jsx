import { useEffect, useState } from "react"
import { useCreateAcc } from "../../hooks/useCreateAcc"
import Swal from "sweetalert2"
import Loader from "../Loader"

const UserManagement = () => {
  const [userData, setUserData] = useState({ firstname: '', lastname: '', role: '', email: '', password: '', confirmPassword: '' })
  const { createAcc, isLoading, error } = useCreateAcc()
  const [passwordError, setPasswordError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (userData.password !== userData.confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }
    setPasswordError("") 

    const res_creatingAccount = await createAcc(userData)
    console.log(res_creatingAccount)
    if(res_creatingAccount){
      console.log('usermanagement if')
      Swal.fire({
        title: "Saved",
        text: "Account is successfully created!",
        icon: "success",
        confirmButtonColor: "#009933"
      });
    }
  }

  useEffect(()=>{
    console.log(userData.role)
  }, [userData.role])

  return (
    <section className="w-full h-full flex ">
      <form onSubmit={handleSubmit} className="bg-white w-3/5 rounded-t-xl border-[1px] mr-3 p-5">
        <h1 className="mb-3 font-semibold text-lg">Personal Information</h1>
        <div className="h-auto w-full flex gap-3">
          <div className="flex flex-col w-1/2">
            <label className="text-base">Firstname</label>
            <input
              className="text-sm w-full px-4 py-2 rounded-md border-2 focus:outline-none"
              type="text"
              placeholder="e.g., John"
              pattern="[A-Za-z]+" title="Numbers and Special Characters are not allowed"
              onChange={(e) => setUserData({ ...userData, firstname: e.target.value })}
              required />
          </div>
          <div>
          <label className="text-base">Lastname</label>
            <input
              className="text-sm w-full px-4 py-2 rounded-md border-2 focus:outline-none"
              type="text"
              placeholder="e.g., Dela Cruz"
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
                  className="text-sm w-full px-4 py-2 rounded-md border-2 focus:outline-none"
                  type="email"
                  placeholder="email@gmail.com"
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  required />
              </div>
              <div className="w-1/3 flex flex-col">
                <label className="text-base">Role</label>
                <select className="w-full px-4 pt-[6px] pb-[5px] rounded-md border-2 focus:outline-none" 
                  required 
                  value={userData.role} 
                  onChange={(e) => setUserData({ ...userData, role: e.target.value })}>
                    <option value="" disabled>Select role</option>
                    <option value="1">Admin</option>
                    <option value="2">Head</option>
                    <option value="3">Operator</option>
                    <option value="4">Editor</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-3">
              <div className="flex flex-col w-1/2">
                <label className="text-base">Password</label>
                <input
                  className="text-sm w-full px-4 py-2 rounded-md border-2 focus:outline-none"
                  type="password"
                  placeholder="••••••••"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long"
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                  required />
              </div>
              <div className="flex flex-col w-1/2">
                <label className="text-base">Confirm your Password</label>
                <input
                  className="text-sm w-full px-4 py-2 rounded-md border-2 focus:outline-none"
                  type="password"
                  placeholder="••••••••"
                  onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                  required />
              </div>
            </div>
          </div>
          {passwordError && (
            <div className="text-red-600 font-semibold">
              {passwordError}
            </div>
          )}
        </div>
        <div className="w-full h-auto py-4 flex items-center justify-center">
          <button disabled={isLoading} type="submit" className="px-14 py-2 bg-customgreen rounded-lg text-white hover:scale-125 transition-all duration-100">{isLoading ? <Loader /> : 'Save'}</button>
        </div>
        {error && (
          <div className="h-auto w-full py-3 text-center">
            <h5 className="text-red-600 font-semibold">{error}</h5>
          </div>
        )}
      </form>
    </section>
  )
}

export default UserManagement
