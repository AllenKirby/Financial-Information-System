import PropTypes from 'prop-types'
import { useEffect, useState } from 'react';

import { IoIosClose, IoIosArrowRoundBack} from "react-icons/io";


import DVTemplate from '../../Shared/DVTemplate'

const FundClusterModal = ({fundCluster, modal, vouchers}) => {
    const [filteredVouchers, setFilteredVouchers] = useState({})
    const [selectedVoucher, setSelectedVoucher] = useState(null)

    useEffect(() => {
        const result = Object.entries(vouchers).filter(([,voucher]) => voucher.fund === fundCluster)
        if(result.length !== 0) {
            setFilteredVouchers(result)
        } else {
            console.log(`${fundCluster} voucher(s) is empty`)
        }
    }, [vouchers, fundCluster])

    const getStatusColor = (status) => {
        switch (status) {
          case 'Approved':
            return 'bg-green-200 text-green-500';
          case 'For Approval':
            return 'bg-yellow-200 text-yellow-500';
          case 'Under Review':
            return 'bg-orange-200 text-orange-500';
          case 'In Review':
            return 'bg-blue-200 text-blue-500';
          case 'Drafting':
            return 'bg-gray-200 text-gray-500';
          case 'Returned|3':
          case 'Returned|4':
            return 'bg-red-200 text-red-500';
          default:
            return 'bg-red-500 text-white';
        }
      };

  return (
    <div className="bg-white sm:rounded-lg w-full lg:w-4/6 flex flex-col h-full sm:h-2/3 p-3 text-gray-500">
        <div className='w-full h-auto flex items-center justify-between p-2'>
            {selectedVoucher ?  
                <button 
                    onClick={() => setSelectedVoucher(null)}>
                        <IoIosArrowRoundBack size={30}/>
                </button> : 
                <h1 className='font-bold text-sm sm:text-lg'>Disbursement Vouchers ({fundCluster})</h1>
            }
            <button onClick={() => modal('')}><IoIosClose size={30}/></button>
        </div>
        <div className='w-full flex-1 flex flex-col overflow-y-auto rounded-lg'>
            {!selectedVoucher && (
                <div className='w-full h-auto p-3 hidden sm:flex items-center rounded-lg py-2 text-sm justify-center bg-gray-200'>
                    <p className='w-2/4 px-3 font-bold'>Payee</p>
                    <p className='w-1/4 text-center font-bold'>DV No</p>
                    <p className='w-1/4 text-center font-bold'>Status</p>
                </div>
            )}
            <div className='w-full flex-1 overflow-y-auto' >
                {selectedVoucher ? (
                    <DVTemplate document={selectedVoucher}/>
                ) : (
                    filteredVouchers.length > 0 ? 
                        filteredVouchers.map((voucher, index) => (
                            <button key={index} onClick={() => setSelectedVoucher(voucher[1])} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} my-1 text-sm w-full p-2 rounded-md flex flex-col sm:flex-row`}>
                                <p className='w-full sm:w-2/4 truncate text-left font-semibold'>{voucher[1].payee}</p>
                                <p className='w-full sm:w-1/4 text-left sm:text-center'>{voucher[1].DV}</p>
                                <div className='w-full sm:w-1/4 flex items-center justify-start sm:justify-center'>
                                    <p className={`${getStatusColor(voucher[1].status)} w-auto px-4 rounded-md font-semibold`}>{voucher[1].status.includes('Returned') ? 'Returned' : voucher[1].status}</p>
                                </div>
                            </button>
                        )) : (
                            <div className='w-full h-full flex items-center justify-center'>
                                <p className='font-semibold'>No {fundCluster} Vouchers Found</p>
                            </div>
                        )
                )}
                
            </div>
        </div>
    </div>
  )
}

FundClusterModal.propTypes = {
    modal: PropTypes.func.isRequired,
    fundCluster: PropTypes.string.isRequired,
    vouchers: PropTypes.object.isRequired
}

export default FundClusterModal