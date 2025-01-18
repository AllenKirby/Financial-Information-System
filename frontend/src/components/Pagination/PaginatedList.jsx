import React, { useState, Suspense } from 'react'; 
import PropTypes from 'prop-types'

import Pagination from './Pagination';
import Loading from './Loading';
import LoadingForControlBook from './LoadingForControlBook'
// import DocumentDetails from '../Shared/DocumentDetails';
// import HistoryLogsItem from '../Shared/DocumentDetails';
// import Folder from '../OperatorComponents/Folder';
// import UserLogs from '../SuperAdminComponents/UserLogs';
// import AccessControlLogs from '../SuperAdminComponents/AccessControlLogs';

const DocumentDetails = React.lazy(() => import('../Shared/DocumentDetails'));
const HistoryLogsItem = React.lazy(() => import('../Shared/HistoryLogsItem'));
const Folder = React.lazy(() => import('../OperatorComponents/Folder'));
const UserLogs = React.lazy(() => import('../SuperAdminComponents/UserLogs'));
const AccessControlLogs = React.lazy(() => import('../SuperAdminComponents/AccessControlLogs'));

const PaginatedList = ({ items, type = '', activeTab = '', paginationFor }) => {

  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 20;

  console.log(items)

  const itemsArray = Object.entries(items);

  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = itemsArray.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(itemsArray.length / itemsPerPage);
  

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className='w-full h-full flex flex-col'>
        <div className={`${paginationFor === 'ControlBook' ? 'relative p-2 w-full flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 border-2 rounded-lg overflow-y-auto' : ' w-full flex-1 overflow-auto'}`}>
            <Suspense fallback={paginationFor === 'ControlBook' ? <LoadingForControlBook/> : <Loading/>}>
                {Object.entries(currentItems).map(([key, document]) => {
                    if(paginationFor === 'DV') return <DocumentDetails key={key} index={key} documents={document[1]} type={type} activeTab={activeTab} />
                    if(paginationFor === 'HistoryLogs') return <HistoryLogsItem key={key} log={document} index={key}/>
                    if(paginationFor === 'ControlBook') return <Folder key={key} controlBook={document[1]} ASANo={document[0]}/>
                    if(paginationFor === 'loginLogs') return <UserLogs key={key} index={key} log={document}/>
                    if(paginationFor === 'AccessControl') return <AccessControlLogs key={key} index={key} log={document}/>
                })}
            </Suspense>
        </div>
        <div className='w-full h-auto py-3 bg-white flex items-center justify-center'>
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
    activeTab: PropTypes.string.isRequired,
    paginationFor: PropTypes.string.isRequired
  };

export default PaginatedList