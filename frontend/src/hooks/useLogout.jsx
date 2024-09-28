import {useAuthContext} from '../hooks/useAuthContext.jsx'
import Cookies from 'universal-cookie';
import {useNavigate} from 'react-router-dom';


export const useLogout = () => {
    const cookies = new Cookies();
    const {dispatch} = useAuthContext()
    const navigate = useNavigate()

    const logout = () => {
        dispatch({type: 'LOGOUT', payload: null})
        cookies.remove('user', { path: '/' });
        navigate('/')
    }
  return{logout}
}
