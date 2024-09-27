import { useLogout } from "../hooks/useLogout"

const Header = () => {
  const {logout} = useLogout()
  
  const handleLogout = () => {
    logout()
  }

  return (
    <header className="w-full p-5 flex items-center justify-end rounded-xl shadow-slate-200 shadow-customShadowStyle">
        <button onClick={handleLogout}>Logout</button>
    </header>
  )
}

export default Header