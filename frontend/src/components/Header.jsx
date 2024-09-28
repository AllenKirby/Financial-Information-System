import { useLogout } from "../hooks/useLogout"
import Swal from 'sweetalert2';
const Header = () => {
  const {logout} = useLogout()
  
  const handleLogout = () => {
    Swal.fire({
      title: "Do you want to logout?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Logout",
      confirmButtonColor: '#ab0310'
    }).then((result) => {
      if (result.isConfirmed) {
        logout()
      }
    });

    
  }

  return (
    <header className="w-full p-5 flex items-center justify-end rounded-xl shadow-slate-200 shadow-customShadowStyle">
        <button onClick={handleLogout}>Logout</button>
    </header>
  )
}

export default Header