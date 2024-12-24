import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'

const DVTemplate = ({document}) => {
  const {user} = useAuthContext() 
  const [fontColor, setFontColor] = useState('')
  //computations
  const val1 = eval(document?.amount + document?.TT_formula1).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const val2 = eval(document?.amount + document?.TT_formula2).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const tval = parseFloat(val1.replace(/,/g, '')) + parseFloat(val2.replace(/,/g, ''))
  const total_val = tval.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const floatTotal_val = parseFloat(total_val.replace(/,/g, ''))
  
  const adue = document?.amount - tval
  const amount_due = adue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const floatAmountDue = parseFloat(amount_due.replace(/,/g, ''))

  console.log(document)
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
  return (
    <div className="w-full h-auto p-5 border-b-2">
      <div className='mb-2'>
        <p className={`font-bold text-xl 2xl:text-2xl ${fontColor}`}>{document?.payee}</p>
      </div>
      <div className='w-full h-auto'>
        <div className='flex flex-col'>
          <div className='w-full py-1'>
            <h1 className='text-lg 2xl:text-xl font-semibold'>Payee Information</h1>
          </div>
          <div className='py-1 flex flex-row px-2 text-sm sm:text-base 2xl:text-lg'>
            <div className='w-2/5 h-full'>
              <p className='text-gray-500'>TIN/Employee No.</p>
              <p className='text-gray-500'>Address</p>
            </div>
            <div className='w-3/5 h-full'>
              <p className='text-customFontColor font-medium'>{document?.TIN}</p>
              <p className='text-customFontColor font-medium'>{document?.address}</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='w-full py-1'>
            <h1 className='text-lg 2xl:text-xl font-semibold'>Disbursement Voucher Details</h1>
          </div>
          <div className='py-1 flex flex-row px-2 text-sm sm:text-base 2xl:text-lg'>
            <div className='w-2/5 h-full'>
              <p className='text-gray-500'>Date</p>
              <p className='text-gray-500'>Fund Cluster</p>
              <p className='text-gray-500'>DV No.</p>
            </div>
            <div className='w-3/5 h-full'>
              <p className='text-customFontColor font-medium'>{document?.date}</p>
              <p className='text-customFontColor font-medium'>{document?.fund}</p>
              <p className='text-customFontColor font-medium'>{document?.DV}</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='w-full py-1'>
            <h1 className='text-lg 2xl:text-xl font-semibold'>Financial Details</h1>
          </div>
          <div className='py-1 flex flex-row px-2 text-sm sm:text-base 2xl:text-lg'>
            <div className='w-2/5 h-full'>
              <p className='text-gray-500'>Amount</p>
              <p className='text-gray-500'>Total Tax Amount</p>
              <p className='text-gray-500'>Amount Due</p>
              <p className='text-gray-500'>Tax Type</p>
              <p className='text-gray-500'>Tax Type Formulas</p>
            </div>
            <div className='w-3/5 h-full'>
              <p className='text-customFontColor font-medium'>{`₱ ${document?.amount}`}</p>
              <p className='text-customFontColor font-medium'>{`₱ ${floatTotal_val}`}</p>
              <p className='text-customFontColor font-medium'>{`₱ ${floatAmountDue}`}</p>
              <p className='text-customFontColor font-medium'>{`${document?.TT_tax} ${document?.TT_cost}`}</p>
              <li className='text-customFontColor font-medium'>{`${document?.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${document?.TT_formula1.replace(/\*/g, ' x ').replace(/\//g, ' / ').replace(/\+/g, ' + ').replace(/\-/g, ' - ')} = ${val1}`}</li>
              <li className='text-customFontColor font-medium'>{`${document?.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${document?.TT_formula2.replace(/\*/g, ' x ').replace(/\//g, ' / ').replace(/\+/g, ' + ').replace(/\-/g, ' - ')} = ${val2}`}</li>
            </div>
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='w-full py-1'>
            <h1 className='text-lg 2xl:text-xl font-semibold'>Other Information</h1>
          </div>
          <div className='py-1 flex flex-row px-2 text-sm sm:text-base 2xl:text-lg'>
            <div className='w-2/5 h-full'>
              <p className='text-gray-500'>Mode of Payment</p>
              <p className='text-gray-500'>ORS/BURS</p>
              <p className='text-gray-500 truncate'>Responsibility Center</p>
              <p className='text-gray-500'>ASA No</p>
              <p className='text-gray-500'>Name</p>
              <p className='text-gray-500'>Office</p>
              <p className='text-gray-500'>Account Title</p>
              <span>
                {
                  document?.accTitle.length > 0 &&
                  document?.accTitle.map((_, index) => {
                    const adjustedIndex = index - 1;
                    return adjustedIndex >= 0 ? <br key={adjustedIndex} /> : null;
                  })
                }
              </span>
              <p className='text-gray-500'>Account Code</p>
              <span>
                {
                  document?.accCode.length > 0 &&
                  document?.accCode.map((_, index) => {
                    const adjustedIndex = index - 1;
                    return adjustedIndex >= 0 ? <br key={adjustedIndex} /> : null;
                  })
                }
              </span>
              <p className='text-gray-500'>Particulars</p>
            </div>
            <div className='w-3/5 h-full'>
              <p className='text-customFontColor font-semibold'>{document?.MOP === 'Others' ? `${document?.MOP}(${document?.specifiedMOP})` : document?.MOP}</p>
              <p className='text-customFontColor font-semibold'>{document?.ORSBURS ? document.ORSBURS : '--'}</p>
              <p className='text-customFontColor font-semibold'>{document?.RC}</p>
              <p className='text-customFontColor font-semibold'>{document?.ASA ? document?.ASA : '--'}</p>
              <p className='text-customFontColor font-semibold'>{document?.NF_name}</p>
              <p className='text-customFontColor font-semibold'>{document?.NF_office}</p>
              {document?.accTitle.map((title, index) => (
                <>
                  <li key={index} className='text-customFontColor font-semibold truncate'>{title}</li>
                </>
              ))}
              {document?.accCode.map((code, index) => (
                <>
                  <li key={index} className='text-customFontColor font-semibold'>{code}</li>
                </>
              ))}
              <p className='text-customFontColor font-semibold text-justify'>{document?.particular}</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='w-full py-1'>
            <h1 className='text-lg 2xl:text-xl font-semibold'>BIR Information</h1>
          </div>
          <div className='py-1 flex flex-row px-2 text-sm sm:text-base 2xl:text-lg'>
            <div className='w-2/5 h-full'>
              <p className='text-gray-500'>Payee</p>
              <p className='text-gray-500'>Address</p>
              <p className='text-gray-500'>DV No.</p>
              <p className='text-gray-500 truncate'>Responsibility Center</p>
              <p className='text-gray-500'>Amount Due</p>
              <p className='text-gray-500'>Particulars</p>
            </div>
            <div className='w-3/5 h-full'>
              <p className='text-customFontColor font-medium'>BIR</p>
              <p className='text-customFontColor font-medium'>Calamba, Laguna</p>
              <p className='text-customFontColor font-medium'>{document?.DV}</p>
              <p className='text-customFontColor font-medium'>RO</p>
              <p className='text-customFontColor font-medium'>{`₱ ${floatAmountDue}`}</p>
              <p className='text-customFontColor font-medium'>{document?.birParticular}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

DVTemplate.propTypes = {
    document: PropTypes.object.isRequired
}

export default DVTemplate