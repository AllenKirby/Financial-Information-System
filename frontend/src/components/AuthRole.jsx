import { useAuthContext } from "../hooks/useAuthContext";
import Login from "../AuthComponents/login";
import AdminPage from "../pages/AdminPage";
import EditorPage from "../pages/EditorPage";
import OperatorPage from "../pages/OperatorPage";

export const AuthRole = () => {
    const {user} = useAuthContext();
    if(!user){
        return <Login/>
    }else if(user.role === '1'){
        return <AdminPage/>
    }else if(user.role === '3') {
        return <OperatorPage/>
    }else if (user.role === '4'){
        return <EditorPage/>
    }else{
        return <div>snaiksankd</div>
    }
}