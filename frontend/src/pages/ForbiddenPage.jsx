import { useNavigate } from 'react-router-dom'; 
import Cookies from 'universal-cookie';
import { useAuthContext } from '../hooks/useAuthContext';

const ForbiddenPage = () => {
    const cookies = new Cookies()
    const navigate = useNavigate()
    const {dispatch} = useAuthContext()

    const handleBack = () => {
        navigate('/')
        cookies.remove('user', { path: '/' });
        dispatch({ type: 'LOGOUT' }); 
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center">
          <h1 className="text-9xl font-bold text-gray-800">403</h1>
          <p className="text-xl font-semibold text-gray-600 mt-4">Oops! You're email is unauthorized</p>
          <p className="text-gray-500 mt-2">Please use an email known by the admin. Or request from the admin to create a new account with this email.</p>
          <button onClick={handleBack} className="mt-6 px-6 py-3 bg-customgreen text-white rounded-lg hover:bg-white hover:text-customFontColor transition duration-200">Go Back</button>
        </div>
      );
}

export default ForbiddenPage;