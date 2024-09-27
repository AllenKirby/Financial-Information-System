import { createContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';

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
