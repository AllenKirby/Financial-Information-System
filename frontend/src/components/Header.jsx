import { useLogout } from "../hooks/useLogout";
import Swal from "sweetalert2";
import PropTypes from 'prop-types'

const Header = ({ currentPage }) => {
  const { logout } = useLogout();

  const handleLogout = () => {
    Swal.fire({
      title: "Do you want to logout?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Logout",
      confirmButtonColor: "#ab0310"
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  return (
    <header className="w-full p-5 bg-white flex items-center justify-between rounded-xl shadow-slate-200 shadow-customShadowStyle">
      {/* Display the current page */}
      <div>
        <h1 className="text-xl font-semibold">{currentPage}</h1>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
};

Header.propTypes = {
  currentPage: PropTypes.string.isRequired
};

export default Header;
