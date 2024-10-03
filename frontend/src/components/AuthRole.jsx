import { useAuthContext } from "../hooks/useAuthContext";
import Login from "../AuthComponents/login";  
import { useNavigate } from "react-router-dom";

export const AuthRole = () => {
    const navigate = useNavigate()
    const {user} = useAuthContext();
    if(!user){
        return <Login/>
    }else if(user.role === '1'){
        navigate('/admin/dashboard');
    }else if(user.role === '3') {
        navigate('/operator/disbursementrecords');
    }else if (user.role === '4'){
        navigate('/editor/disbursementrecords');
    }else{
        return <div>Oopss</div>
    }
}