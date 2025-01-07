import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { GrFormNext } from 'react-icons/gr';
import { GrFormPrevious } from 'react-icons/gr';
import { useAuthContext } from '../hooks/useAuthContext';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const { user } = useAuthContext();
    const [bgColor, setBgColor] = useState('');

    useEffect(() => {
        if (user && user.role) {
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

    // Calculate the page range to display
    const getPageRange = () => {
        const maxVisiblePages = 3;
        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust startPage if we are near the end
        const adjustedStartPage = Math.max(1, endPage - maxVisiblePages + 1);

        return Array.from(
            { length: endPage - adjustedStartPage + 1 },
            (_, i) => adjustedStartPage + i
        );
    };

    const pages = getPageRange();

    return (
        <div className="w-full h-full flex items-center justify-between gap-3  px-3">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-auto h-auto border-2 border-gray-300 rounded-lg cursor-pointer"
            >
                <GrFormPrevious size={30} />
            </button>
            <div className="flex gap-1">
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`py-1 px-3 rounded-lg ${
                            page === currentPage
                                ? `${bgColor} text-white`
                                : 'text-customFontColor border-2'
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={`w-auto h-auto border-2 border-gray-300 rounded-lg cursor-pointer ${
                    currentPage >= totalPages ? 'text-gray-300' : 'text-customFontColor'
                }`}
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
