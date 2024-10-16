import { useAuthContext } from "../hooks/useAuthContext";
import Login from "../AuthComponents/login";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthRole = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      if (user.role === '1') {
        navigate('/admin/dashboard');
      }else if (user.role === '2') {
        navigate('/head/disbursementrecords');
      }else if (user.role === '3') {
        navigate('/operator/disbursementrecords');
      } else if (user.role === '4') {
        navigate('/editor/disbursementrecords');
      }else{
        navigate('/unauthorizedEmail')
      }
    }
  }, [user, navigate]);

  if (!user) {
    return <Login />;
  }

  return <Login />;
};
