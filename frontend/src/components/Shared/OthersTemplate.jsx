
import { useEffect, useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'

const OtherTemplate = ({document}) => {
    const {user} = useAuthContext() 
    const [fontColor, setFontColor] = useState('')

    useEffect(() => {
        if(user && user.role) {
          switch(user.role) {
            case '4': 
              setFontColor('text-preparerPrimary')
              break
            case '3': 
              setFontColor('text-fundingBlueGreen')
              break
            case '2': 
              setFontColor('text-BOGreen')
              break
            case '1': 
              setFontColor('text-customgreen')
              break
          
          }
        }
      }, [user])

      const formatToPeso = (value) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(value);
      };

    return(
        <div className="w-full h-auto p-5 border-b-2">
            <div className='mb-2'>
                <p className={`font-bold text-xl 2xl:text-2xl ${fontColor}`}>{document?.payee}</p>
            </div>
            <div className='w-full h-auto'>
                <div className='flex flex-col'>
                    <div className='w-full py-1'>
                        <h1 className='text-lg 2xl:text-xl font-semibold'>Payee Information</h1>
                    </div>
                    <div className='py-1 flex flex-col px-2 text-sm sm:text-base 2xl:text-lg'>
                        {/* TIN ID GOT REMOVED SINCE IT IS NOT NEEDED FOR GSIS REMITTANCE */}
                        <div className='w-full h-auto flex items-center justify-center'>
                            <p className='text-gray-500 w-2/5'>Address</p>
                            <p className='text-customFontColor font-medium w-3/5'>{document?.address}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col'>
                <div className='w-full py-1'>
                    <h1 className='text-lg 2xl:text-xl font-semibold'>Disbursement Voucher Details</h1>
                </div>
                <div className='py-1 flex flex-col px-2 text-sm sm:text-base 2xl:text-lg'>
                    <div className='w-full h-auto flex items-center justify-center'>
                        <p className='text-gray-500 w-2/5'>Date</p>
                        <p className='text-customFontColor font-medium w-3/5'>{document?.date}</p>
                    </div>
                    <div className='w-full h-auto flex items-center justify-center'>
                        <p className='text-gray-500 w-2/5'>Fund Cluster</p>
                        <p className='text-customFontColor font-medium w-3/5'>{document?.fund === 'Contract Farming' ? 'Farming Support Service Program' : document?.fund}</p>
                    </div>
                    <div className='w-full h-auto flex items-center justify-center'>
                        <p className='text-gray-500 w-2/5'>DV No.</p>
                        <p className='text-customFontColor font-medium w-3/5'>{document?.DV}</p>
                    </div>
                </div>
            </div>
            <div className='flex flex-col'>
                <div className='w-full py-1'>
                    <h1 className='text-lg 2xl:text-xl font-semibold'>Financial Details</h1>
                </div>
                <div className='py-1 flex flex-col px-2 text-sm sm:text-base 2xl:text-lg'>
                    <div className='w-full h-auto flex items-center justify-center'>
                        <p className='text-gray-500 w-2/5'>Gross Amount</p>
                        <p className='text-customFontColor font-medium w-3/5'>{`${formatToPeso(document?.amount)}`}</p>
                    </div>
                </div>
            </div>
            <div className='flex flex-col'>
                <div className='w-full py-1'>
                    <h1 className='text-lg 2xl:text-xl font-semibold'>Other Information</h1>
                </div>
                <div className='w-full h-auto flex items-start justify-center'>
                    <p className='text-gray-500 w-2/5'>Mode of Payment</p>
                    <p className='text-customFontColor font-semibold w-3/5'>{document?.MOP === 'Others' ? `${document?.MOP}(${document?.specifiedMOP})` : document?.MOP}</p>
                </div>
                <div className='w-full h-auto flex items-start justify-center'>
                    <p className='text-gray-500 w-2/5'>ORS/BURS</p>
                    <p className='text-customFontColor font-semibold w-3/5'>{document?.ORSBURS ? document.ORSBURS : '--'}</p>
                </div>
                <div className='w-full h-auto flex items-start justify-center'>
                    <p className='text-gray-500 truncate w-2/5'>Responsibility Center</p>
                    <p className='text-customFontColor font-semibold w-3/5'>{document?.RC}</p>
                </div>
                <div className='w-full h-auto flex items-start justify-center'>
                <p className='text-gray-500 w-2/5'>ASA No</p>
                {
                    document?.ASA ? (
                    <ul className="list-disc list-inside w-3/5">
                        {Object.entries(document.ASA).map(([key, value], index) => {
                        const parts = key.split('/'); // Split the key
                        const controlBookNumber = parts[1].split('|')[0]
                        const controlBookDesc = parts[1].split('|')[1].split('!')[0]
                        const projectName = parts[1].split(',')[1]. replace('>', ' ')

                        const display = `${controlBookDesc} ${projectName}`
                        // controlBookNumber
                        return (
                        <li key={index} className="text-customFontColor font-semibold">
                            {`${display}: ${formatToPeso(value)}`}
                        </li>
                        );
                    })}
                    </ul>
                    ) : (<p className="text-customFontColor font-semibold w-3/5">--</p>)
                }
                </div>
                <div className='w-full h-auto flex items-start justify-center'>
                    <p className='text-gray-500 w-2/5'>Name</p>
                    <p className='text-customFontColor font-semibold w-3/5'>{document?.NF_name}</p>
                </div>
                <div className='w-full h-auto flex items-start justify-center'>
                    <p className='text-gray-500 w-2/5'>Office</p>
                    <p className='text-customFontColor font-semibold w-3/5'>{document?.NF_office}</p>
                </div>
                <div className='w-full h-auto flex items-start justify-center'>
                    <p className='text-gray-500 w-2/5'>Account Title</p>
                    {document?.accTitle.map((title, index) => (
                        <>
                        <li key={`title-${index}`} className='text-customFontColor font-semibold truncate w-3/5'>{title}</li>
                        </>
                    ))}
                </div>
                <div className='w-full h-auto flex items-start justify-center'>
                    <p className='text-gray-500 w-2/5'>Account Code</p>
                    {document?.accCode.map((code, index) => (
                        <>
                        <li key={`code-${index}`} className='text-customFontColor font-semibold w-3/5'>{code}</li>
                        </>
                    ))}
                </div>
                <div className='w-full h-auto flex items-start justify-center'>
                    <p className='text-gray-500 w-2/5'>Particulars</p>
                    <p className='text-customFontColor font-semibold break-words w-3/5'>{document?.particular}</p>
                </div>
            </div>
            <div className='flex flex-col'>
                <div className='w-full py-1'>
                    <h1 className='text-lg 2xl:text-xl font-semibold'>Action Log</h1>
                </div>
                <div className='py-1 flex flex-col px-2 text-sm sm:text-base 2xl:text-lg'>
                    <div className='w-full h-auto flex items-start justify-centerl'>
                        <p className='text-gray-500 w-2/5'>Created By</p>
                        <p className='text-customFontColor font-medium w-3/5'>{document?.createdBy}</p>
                    </div>
                    <div className='w-full h-auto flex items-start justify-center'>
                        <p className='text-gray-500 w-2/5'>Submitted By</p>
                        <p className='text-customFontColor font-medium w-3/5'>{document?.submittedBy ? document?.submittedBy.replace('|', ' on ') : '--'}</p>
                    </div>
                    <div className='w-full h-auto flex items-start justify-center'>
                        <p className='text-gray-500 w-2/5'>Updated By</p>
                        <p className='text-customFontColor font-medium w-3/5'>{document?.updatedBy ? document?.updatedBy.replace('|', ' on ') : '--'}</p>
                    </div>
                    <div className='w-full h-auto flex items-start justify-center'>
                        <p className='text-gray-500 w-2/5'>Reviewed By</p>
                        <p className='text-customFontColor font-medium w-3/5'>{document?.reviewedBy ? document?.reviewedBy.replace('|', ' on ') : '--'}</p>
                    </div>
                    <div className='w-full h-auto flex items-start justify-center'>
                        <p className='text-gray-500 w-2/5'>Approved By</p>
                        <p className='text-customFontColor font-medium w-3/5'>{document?.approvedBy ? document?.approvedBy.replace('|', ' on ') : '--'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OtherTemplate