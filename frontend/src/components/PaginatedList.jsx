import { useState } from 'react'; 
import PropTypes from 'prop-types'

import Pagination from './Pagination';
import DocumentDetails from './DocumentDetails';

const PaginatedList = ({ items, type }) => {

  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 10;

  const itemsArray = Object.entries(items);

  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = itemsArray.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(itemsArray.length / itemsPerPage);
  

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className='w-full h-full'>
        <div className='w-full h-[85%] overflow-auto'>
            {Object.keys(currentItems).length > 0 ? (
                Object.entries(currentItems).map(([key, document]) => (
                    <DocumentDetails key={key} index={key} documents={document[1]} type={type}/>
                ))
                ) : (
                <div className='w-full h-full flex items-center justify-center'>
                    <div>No Documents Found</div>
                </div>
                // <div className='w-full h-[340px] overflow-auto rounded-md bg-gray-100 px-1'>
                //   <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                //   <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                //   <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                //   <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                //   <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                //   <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                //   <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                // </div>
            )}
        </div>
        <div className='w-full h-[15%] bg-white flex items-center justify-center'>
            <div className='w-auto'>
                <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
            </div>
        </div>  
    </div>
    );
};

PaginatedList.propTypes = {
    items: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
  };

export default PaginatedList