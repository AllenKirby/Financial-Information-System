import {useAuthContext} from '../hooks/useAuthContext.jsx'
import Cookies from 'universal-cookie';
import {useNavigate} from 'react-router-dom';
import axios from "axios"
import { useDisbursementContext } from './useDisbursementContext.jsx';


export const useLogout = () => {
    const cookies = new Cookies();
    const {dispatch} = useAuthContext()
    const {dispatch: dispatchDocuments} = useDisbursementContext()
    const navigate = useNavigate()

    const logout = async () => {
        
      try{
        const response = await axios.post('http://localhost:4000/logout', {}, {
          withCredentials: true
        });
        if(response.status === 200){
          dispatch({type: 'LOGOUT', payload: null})
          dispatchDocuments({type: 'SET_DOCUMENTS', payload: null })
          cookies.remove('user', { path: '/' });
          navigate('/', {replace: true})
        }
      }catch(error){
        console.log(`error logging out ${error}`)
      }
    }
  return{logout}
}
