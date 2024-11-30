import { useState } from "react"
import { useAuthHook } from "../hooks/useAuthHook"

const ChangePass = () => {
  const { ChangePassword } = useAuthHook()
  const [password, setPassword] = useState({currentPassword: '' ,newPassword: '', confirmPassword: ''})

  const handleSubmit = async(e) => {
    e.preventDefault()
    await ChangePassword(password.newPassword, password.currentPassword)
  }

  return (
    <div onSubmit={handleSubmit} className="w-2/5 h-1/2 bg-white rounded-lg">
        <form>
          <div>
            <label>New Password</label>
            <input 
              type="text" 
              required 
              onChange={(e) => setPassword({...password, newPassword: e.target.value})} />
          </div>
          <div>
            <label>Confirm Password</label>
            <input 
              type="text" 
              required
              onChange={(e) => setPassword({...password, currentPassword: e.target.value})} />
          </div>
          <button type="submit">Save</button>
        </form>
    </div>
  )
}

export default ChangePass