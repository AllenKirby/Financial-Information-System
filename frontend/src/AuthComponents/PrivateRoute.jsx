import Cookies from 'universal-cookie';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const cookies = new Cookies();
  const user_cookie = cookies.get('user');
  console.log(user_cookie)
  try{
    
    const success = user_cookie.success;
    const role = user_cookie.role;

    console.log(`private route authorize:${success} role:${role}`)
    if (!success) {
        return <Navigate to="/" replace />;
    }
    if (!allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }
    return children;
  }catch(error){
    console.error('Error parsing cookie data:', error);
  }
  
};

export default PrivateRoute;
