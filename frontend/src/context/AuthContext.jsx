import { createContext, useReducer, useEffect} from 'react';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import { onIdTokenChanged } from 'firebase/auth';
import axios from 'axios';
import { auth } from '../config/firebase-config';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload };
        case 'LOGOUT':
            return { user: null };
        default:
            return state;
    }
};

export const AuthContextProvider = ({ children }) => {
    const cookies = new Cookies();
    const [state, dispatch] = useReducer(authReducer, { user: null });

    useEffect(() => {
        const unsubscribe = onIdTokenChanged(auth, async (userAuth) => {
            if(userAuth){
                try{
                    const token = await userAuth.getIdToken()
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/refreshToken`, {
                        headers: {
                        'Content-Type': 'application/json',
                        'Authorization':` Bearer ${token} `
                        },
                        withCredentials: true,
                    });
                    if (response.status === 200) {
                        cookies.set('user', JSON.stringify(response.data), { path: '/', secure: true, sameSite: 'Strict' });
                        dispatch({type: 'LOGIN', payload: response.data})
                    }
                }catch(error){
                    cookies.remove('token')
                    cookies.remove('user')
                    dispatch({type: 'LOGOUT'})
                    console.log(error)
                }
            }else{
                cookies.remove("token");
                cookies.remove("user");
                dispatch({ type: "LOGOUT" });
            }
        })
        return () => unsubscribe()
    //   const userCookie = cookies.get('user');
    //     if (userCookie) {
    //       dispatch({ type: 'LOGIN', payload: userCookie });
    //     }

    //     const unsubscribe = onIdTokenChanged(auth, async (user) => {
            
    //         if(user){
    //             if(user.emailVerified){
    //                 try{
    //                     const token = await user.getIdToken();
    //                     const response = await axios.post(${import.meta.env.VITE_API_URL}/user/refreshToken, {}, {
    //                         headers: {
    //                         'Content-Type': 'application/json',
    //                         'Authorization':` Bearer ${token} `
    //                         },
    //                         withCredentials: true,
    //                     });
    
    //                     if (response.status === 200) {
    //                         cookies.set('user', JSON.stringify(response.data), { path: '/', secure: true, sameSite: 'None' });
    //                         dispatch({type: 'LOGIN', payload: response.data})
    //                     } 
    //                 }catch(error){
    //                     console.log("Error at authcontext: ", error)
    //                     console.error('Token verification failed:', error);
    //                     dispatch({ type: 'LOGOUT' }); 
    //                     cookies.remove('user', { path: '/' });
    //                 }
    //             }
    //         }else {
    //             console.log('else authcontetx')
    //             dispatch({ type: 'LOGOUT' }); 
    //             cookies.remove('user', { path: '/' }); 
    //         }
    //     })
    //     return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};