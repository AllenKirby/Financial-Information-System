import { useAuthContext } from "../hooks/useAuthContext";
import Login from "../AuthComponents/login";
import AdminPage from "../pages/AdminPage";

export const AuthRole = () => {
    const {user} = useAuthContext();
    if(!user){
        return <Login/>
    }else if(user.role === 'admin'){
        return <AdminPage/>
    }else{
        return <div>asdasdasd</div>
    }
}