import PropTypes from 'prop-types'
import { useEffect, useState } from 'react';

import { IoIosClose, IoIosArrowRoundBack} from "react-icons/io";


import Document from '../../Document'

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
            return 'border-l-green-500';
          case 'For Approval':
            return 'border-l-yellow-500';
          case 'Under Review':
            return 'border-l-orange-500';
          case 'In Review':
            return 'border-l-blue-500';
          case 'Drafting':
            return 'border-l-gray-200';
          case 'Returned|3':
          case 'Returned|4':
            return 'border-l-red-500';
          default:
            return 'bg-red-500';
        }
      };

  return (
    <div className="bg-white rounded-lg w-4/6 h-2/3 p-3">
        <div className='w-full h-[10%] flex items-center justify-between p-2'>
            {selectedVoucher ?  
                <button 
                    onClick={() => setSelectedVoucher(null)}>
                        <IoIosArrowRoundBack size={25}/>
                </button> : 
                <h1 className='font-bold text-lg'>Disbursement Vouchers ({fundCluster})</h1>
            }
            <button onClick={() => modal('')}><IoIosClose size={25}/></button>
        </div>
        <div className='w-full h-[90%] rounded-lg border-2'>
            {!selectedVoucher && (
                <div className='w-full h-[7%] flex items-center justify-center bg-gray-200'>
                    <p className='w-2/4 px-3 font-bold'>Payee</p>
                    <p className='w-1/4 text-center font-bold'>DV No</p>
                    <p className='w-1/4 text-center font-bold'>Status</p>
                </div>
            )}
            <div className='w-full h-[320px] p-1 overflow-y-auto'>
                {selectedVoucher ? (
                    <div className='w-full h-auto'>
                        <Document document={selectedVoucher}/>
                    </div>
                ) : (
                    filteredVouchers.length > 0 ? 
                        filteredVouchers.map((voucher, index) => (
                            <button key={index} onClick={() => setSelectedVoucher(voucher[1])} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} ${getStatusColor(voucher[1].status)} border-l-4 my-1 w-full p-2 rounded-md flex items-center justify-center`}>
                                <p className='w-2/4 truncate text-left font-semibold'>{voucher[1].payee}</p>
                                <p className='w-1/4 text-center'>{voucher[1].DV}</p>
                                <div className='w-1/4 text-center'>
                                    <p className='px-2'>{voucher[1].status}</p>
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