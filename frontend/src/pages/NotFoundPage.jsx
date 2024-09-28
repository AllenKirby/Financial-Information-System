import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-9xl font-bold text-gray-800">404</h1>
      <p className="text-xl font-semibold text-gray-600 mt-4">Oops! Page not found.</p>
      <p className="text-gray-500 mt-2">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Link to="/" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
