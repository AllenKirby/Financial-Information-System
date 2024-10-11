import {useAuthContext} from '../hooks/useAuthContext.jsx'
import Cookies from 'universal-cookie';
import {useNavigate} from 'react-router-dom';
import axios from "axios"
import { useDisbursementContext } from './useDisbursementContext.jsx';
import { getAuth, signOut } from "firebase/auth"; 
import { useOpDisbursementContext } from './useOpDisbursementContext.jsx';
import { useHeadDisbursementContext } from './useHeadDisbursementContext.jsx';


export const useLogout = () => {
    const cookies = new Cookies();
    const {dispatch} = useAuthContext()
    const {dispatch: dispatchDocuments} = useDisbursementContext()
    const { dispatch: dispatchOpDocuments } = useOpDisbursementContext()
    const { dispatch: dispatchHeadDocuments } = useHeadDisbursementContext()
    const navigate = useNavigate()

    const logout = async () => {
      const auth = getAuth();  
      try{
        await signOut(auth);
        const response = await axios.post('http://localhost:4000/logout', {}, {
          withCredentials: true
        });
        if(response.status === 200){
          dispatch({type: 'LOGOUT', payload: null})
          dispatchDocuments({type: 'SET_DOCUMENTS', payload: null })
          dispatchOpDocuments({type: 'SET_OPDOCUMENTS', payload: null })
          dispatchHeadDocuments({type: 'SET_HEADDOCUMENTS', payload: null })
          cookies.remove('user', { path: '/' });
          navigate('/', {replace: true})
        }
      }catch(error){
        console.log(`error logging out ${error}`)
      }
    }
  return{logout}
}
