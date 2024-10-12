import { createContext, useReducer, useEffect } from 'react';
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
      const userCookie = cookies.get('user');
        if (userCookie) {
          dispatch({ type: 'LOGIN', payload: userCookie });
        }

        const unsubscribe = onIdTokenChanged(auth, async (user) => {
            if(user){
                cookies.remove('user', { path: '/' }); 
                try{
                    const token = await user.getIdToken();
                    console.log('REFRESHED')
                    const response = await axios.post('http://localhost:4000/user/refreshToken', {}, {
                        headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                        },
                        withCredentials: true,
                    });

                    if (response.status === 200) {
                        console.log("success")
                        console.log(response.data)
                        cookies.set('user', JSON.stringify(response.data), { path: '/', secure: true, sameSite: 'strict' });
                        dispatch({type: 'LOGIN', payload: response.data})
                    } 
                }catch(error){
                    console.error('Token verification failed:', error);
                    dispatch({ type: 'LOGOUT' }); 
                    cookies.remove('user', { path: '/' }); 
                }
            }else {
                dispatch({ type: 'LOGOUT' }); 
                cookies.remove('user', { path: '/' }); 
            }
        })
        return () => unsubscribe();
    }, []);

    console.log('AuthContext state:', state);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
