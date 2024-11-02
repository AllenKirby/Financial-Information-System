import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { GrFormNext } from "react-icons/gr";
import { GrFormPrevious } from "react-icons/gr";
import { useAuthContext } from '../hooks/useAuthContext';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const { user } = useAuthContext();
    const [bgColor, setBgColor] = useState('');

    useEffect(() => {
        if(user && user.role){
            switch (user.role) {
                case '4':
                    return setBgColor('bg-preparerPrimary');
                case '3':
                    return setBgColor('bg-fundingBlueGreen');
                case '2':
                    return setBgColor('bg-BOGreen');
                case '1':
                    return setBgColor('bg-customgreen');
                case '0':
                    return setBgColor('bg-superAdminBlue');
                default:
                    return setBgColor('bg-customFontColor');
            }
        }
    }, [user]);

    return (
        <div className='w-full h-full flex items-center justify-between px-3'>
            <button 
                onClick={() => onPageChange(currentPage - 1)} 
                disabled={currentPage === 1} 
                className='w-auto h-auto border-2 rounded-lg cursor-pointer'
            >
                <GrFormPrevious size={30} />
            </button>
            <div className='flex gap-1'>
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`py-1 px-3 rounded-lg ${page === currentPage ? `${bgColor} text-white` : ' text-customFontColor border-2'}`}
                    >
                        {page} 
                    </button>
                ))}
            </div>
            <button 
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={`w-auto h-auto border-2 rounded-lg cursor-pointer ${currentPage >= totalPages ? 'text-gray-200' : 'text-customFontColor'}`}
            >
                <GrFormNext size={30} />
            </button>
        </div>
    );
};

Pagination.propTypes = {
    totalPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
