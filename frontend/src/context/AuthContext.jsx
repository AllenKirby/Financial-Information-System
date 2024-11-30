import { createContext, useReducer, useEffect} from 'react';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import { onIdTokenChanged } from 'firebase/auth';
import axios from 'axios';
import { auth } from '../config/firebase-config';
import { toggleChangePassFlag } from '../redux/ChangePasswordFlagRedux';
import { useDispatch } from 'react-redux';

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
    const dispatchFlag = useDispatch()

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
                        const userData = response.data
                        const data = {
                            success: userData.success,
                            name: userData.name,
                            uemail: userData.uemail,
                            uid: userData.uid,
                            role: userData.role,
                            firstTimeLogin: userData.firstTimeLogin
                        }
                        console.log(userData.firstTimeLogin)
                        if(userData.firstTimeLogin){
                            dispatchFlag(toggleChangePassFlag())
                        } else {
                            cookies.set('user', JSON.stringify(data), { path: '/', secure: true, sameSite: 'Strict' });
                            dispatch({type: 'LOGIN', payload: data})
                        }
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