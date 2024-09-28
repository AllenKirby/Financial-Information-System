import {useAuthContext} from '../hooks/useAuthContext.jsx'
import Cookies from 'universal-cookie';
import {useNavigate} from 'react-router-dom';
import axios from "axios"


export const useLogout = () => {
    const cookies = new Cookies();
    const {dispatch} = useAuthContext()
    const navigate = useNavigate()

    const logout = async () => {
        
      try{
        const response = await axios.post('http://localhost:4000/logout', {}, {
          withCredentials: true
        });
        if(response.status === 200){
          dispatch({type: 'LOGOUT', payload: null})
          cookies.remove('user', { path: '/' });
          navigate('/')
        }
      }catch(error){
        console.log(`error logging out ${error}`)
      }
    }
  return{logout}
}
