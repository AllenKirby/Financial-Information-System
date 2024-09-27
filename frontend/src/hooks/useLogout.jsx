import {useAuthContext} from '../hooks/useAuthContext.jsx'
import Cookies from 'universal-cookie';

export const useLogout = () => {
    const cookies = new Cookies();
    const {dispatch} = useAuthContext()

    const logout = () => {
        dispatch({type: 'LOGOUT', payload: null})
        cookies.remove('user', { path: '/' });
    }
  return{logout}
}
