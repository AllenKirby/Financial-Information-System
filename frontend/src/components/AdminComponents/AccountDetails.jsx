import { useState, useEffect } from 'react';

const AccountDetails = ({ email, name, roleString }) => {
    const [role, setRole] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const getAccCode = (roleCode) => {
        switch (roleCode) {
            case '1':
                return 'Admin';
            case '2':
                return 'Head';
            case '3':
                return 'Operator';
            case '4':
                return 'Editor';
            default:
                return 'Unknown';
        }
    };

    useEffect(() => {
        setRole(getAccCode(roleString));
    }, [roleString]);

    const handleButtonClick = () => {
        setIsMenuOpen((prev) => !prev); // Toggle the menu open state
    };

    return (
        <div
            className="relative w-full h-12 rounded-md my-1 bg-white text-customFontGreen cursor-pointer flex items-center justify-between"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setIsMenuOpen(false); // Close menu on mouse leave
            }}
        >
            {/* Email column */}
            <h2 className="font-semibold text-lg text-left w-4/6 px-3">{email}</h2>
            {/* Name column */}
            <h2 className="text-xs font-light text-center w-1/6">{name}</h2>
            {/* Role column */}
            <h2 className="text-xs font-light flex items-center justify-center w-1/6">{role}</h2>

            {/* Button column */}
            <div className="relative w-1/12 flex justify-end pr-2">
                {isHovered && (
                    <button
                        className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
                        onClick={handleButtonClick}
                    >
                        :
                    </button>
                )}

                {/* Dropdown Menu */}
                {isMenuOpen && (
                    <div className="absolute right-0 mt-1 bg-white shadow-md rounded-md z-10">
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => alert('Update clicked')}>
                            Update
                        </button>
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => alert('Delete clicked')}>
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountDetails;
