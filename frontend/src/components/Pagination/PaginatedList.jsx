import React, { useState, Suspense } from 'react'; 
import PropTypes from 'prop-types'

import Pagination from './Pagination';
import Loading from './Loading';
import LoadingForControlBook from './LoadingForControlBook'

const DocumentDetails = React.lazy(() => import('../Shared/DocumentDetails'));
const HistoryLogsItem = React.lazy(() => import('../Shared/HistoryLogsItem'));
const Folder = React.lazy(() => import('../OperatorComponents/Folder'));
const UserLogs = React.lazy(() => import('../SuperAdminComponents/UserLogs'));
const AccessControlLogs = React.lazy(() => import('../SuperAdminComponents/AccessControlLogs'));
const DVRegisterItems = React.lazy(() => import('../EditorComponents/DVRegisterItems'));
const ItemPayroll = React.lazy(() => import('../Shared/ItemPayroll'))
const BURRecordsItem = React.lazy(() => import('../Shared/BURRecordsItem'))

const PaginatedList = ({ items, type = '', activeTab = '', paginationFor, counter = 0, modal = () => {} , total = 0}) => {

  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 20;

  const itemsArray = Object.entries(items);

  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = itemsArray.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(itemsArray.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className='w-full h-full flex flex-col'>
        <div className={`${paginationFor === 'ControlBook' ? 'relative p-2 w-full flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 border-2 rounded-lg overflow-y-auto' : ' w-full flex-1 overflow-y-auto'}`}>
            <Suspense fallback={paginationFor === 'ControlBook' ? <LoadingForControlBook/> : <Loading/>}>
                {Object.entries(currentItems).map(([key, document], index) => {
                    if(paginationFor === 'DV') return <DocumentDetails key={key} index={key} documents={document[1]} type={type} activeTab={activeTab} />
                    if(paginationFor === 'HistoryLogs') return <HistoryLogsItem key={key} log={document} index={key}/>
                    if(paginationFor === 'ControlBook') return <Folder key={key} controlBook={document[1]} ASANo={document[0]}/>
                    if(paginationFor === 'loginLogs') return <UserLogs key={key} index={key} log={document}/>
                    if(paginationFor === 'AccessControl') return <AccessControlLogs key={key} index={key} log={document}/>
                    if(paginationFor === 'payrollRecords') return <ItemPayroll key={key} index={key} log={document} modal={modal}/>
                    if(paginationFor === 'DVRegister') return <DVRegisterItems key={key} index={key} DV={document} counter={counter} modal={modal}/>
                    if(paginationFor === 'BUR') return <BURRecordsItem key={index} index={index} BUR={document[1]} activeTab={activeTab}/>
                })}
            </Suspense>
        </div>
        {paginationFor === 'DVRegister' && (
            <div className='w-full py-2 font-bold px-10 flex items-center justify-between border-t-2'>
                <p className='w-1/6'>Total</p>
                {counter === 3 && ( <p className='w-1/5 text-center'>{total.ASA}</p> )}
                {counter === 4 && ( 
                    <div className='w-5/6 flex flex-row'>
                        <p className='w-1/3 text-center'>{total.ADAfirst}</p> 
                        <p className='w-1/3 text-center'>{total.ADAsecond}</p> 
                        <p className='w-1/3 text-center'>{total.cash}</p> 
                    </div>
                )}
                {counter === 5 && ( 
                    <div className='w-5/6 flex flex-row'>
                        <p className='w-1/4 text-center'>{total.ASATotal}</p> 
                        <p className='w-1/4 text-center'>{total.ASAReleases}</p> 
                        <p className='w-1/4 text-center'>{total.cashTotal}</p> 
                        <p className='w-1/4 text-center'>{total.cashReleases}</p> 
                    </div>
                )}
            </div>
        )}
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
    type: PropTypes.string,
    activeTab: PropTypes.string,
    paginationFor: PropTypes.string.isRequired,
    counter: PropTypes.number,
    modal: PropTypes.func,
    total: PropTypes.object
  };

export default PaginatedList