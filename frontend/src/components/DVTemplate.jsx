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

  //GSIS computation
  const gross_gsis = (parseFloat(document?.amount) || 0) + (parseFloat(document?.stamp) || 0) + (parseFloat(document?.dst) || 0) + (parseFloat(document?.vat12) || 0)
  const amountDue_gsis = gross_gsis - (parseFloat(val1) || 0)

  //Meralco computation
  const meralcoVatAndNonvat = (parseFloat(document?.meralcoVAT) || 0) + (parseFloat(document?.meralcoNONVAT) || 0)
  const meralcoTax5 = eval(document?.meralcoVAT + document?.TT_formula1)
  const meralcoTax2 = eval(meralcoVatAndNonvat + document?.TT_formula2)
  const meralcoGross = parseFloat(document?.meralcoVAT || 0) + parseFloat(document?.meralcoNONVAT || 0) + parseFloat(document?.amount || 0)
  const meralcoTax = parseFloat(meralcoTax5 || 0) + parseFloat(meralcoTax2 || 0)
  const meralcoAmountDue = meralcoGross - meralcoTax


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

  useEffect(() => {
    console.log(document)
  }, [document])
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
          {
            document?.activeTab === 'DV' && (
              <div className='py-1 flex flex-row px-2 text-sm sm:text-base 2xl:text-lg'>
                <div className='w-2/5 h-full'>
                  <p className='text-gray-500'>Amount</p>
                  <p className='text-gray-500'>Total Tax Amount</p>
                  <p className='text-gray-500'>Amount Due</p>
                  <p className='text-gray-500'>Tax Type</p>
                  <p className='text-gray-500'>Tax Type Formulas</p>
                </div>
                <div className='w-3/5 h-full'>
                  <p className='text-customFontColor font-medium'>{`${formatToPeso(document?.amount)}`}</p>
                  <p className='text-customFontColor font-medium'>{`${formatToPeso(floatTotal_val)}`}</p>
                  <p className='text-customFontColor font-medium'>{`${formatToPeso(floatAmountDue)}`}</p>
                  <p className='text-customFontColor font-medium'>{`${document?.TT_tax} ${document?.TT_cost}`}</p>
                  <li className='text-customFontColor font-medium' key={'key1'}>{`${formatToPeso(document?.amount)} ${document?.TT_formula1.replace(/\*/g, ' x ').replace(/\//g, ' / ').replace(/\+/g, ' + ').replace(/\-/g, ' - ')} = ${val1}`}</li>
                  <li className='text-customFontColor font-medium' key={'key2'}>{`${formatToPeso(document?.amount)} ${document?.TT_formula2.replace(/\*/g, ' x ').replace(/\//g, ' / ').replace(/\+/g, ' + ').replace(/\-/g, ' - ')} = ${val2}`}</li>
                </div>
              </div>
            )
          }
          {
            document?.activeTab === 'GSIS' && (
              <div className='py-1 flex flex-row px-2 text-sm sm:text-base 2xl:text-lg'>
                <div className='w-2/5 h-full'>
                  <p className='text-gray-500'>Premium</p>
                  <p className='text-gray-500'>Doc. Stamp - DST Premium</p>
                  <p className='text-gray-500'>DST (COC)</p>
                  <p className='text-gray-500'>VAT 12%</p>
                  <p className='text-gray-500'>Amount</p>
                  <p className='text-gray-500'>Total Tax Amount</p>
                  <p className='text-gray-500'>Amount Due</p>
                  
                </div>
                <div className='w-3/5 h-full'>
                <p className='text-customFontColor font-medium'>{`${formatToPeso(document?.amount)}`}</p>
                  <p className='text-customFontColor font-medium'>{`${formatToPeso(document?.stamp)}`}</p>
                  <p className='text-customFontColor font-medium'>{`${formatToPeso(document?.dst)}`}</p>
                  <p className='text-customFontColor font-medium'>{`${formatToPeso(document?.vat12)}`}</p>
                  <p className='text-customFontColor font-medium'>{`${formatToPeso(gross_gsis)}`}</p>
                  <p className='text-customFontColor font-medium'>{`${formatToPeso(document?.amount)} ${document?.TT_formula1.replace(/\*/g, ' x ').replace(/\//g, ' / ').replace(/\+/g, ' + ').replace(/\-/g, ' - ')} = ${val1}`}</p>
                  <p className='text-customFontColor font-medium'>{`${formatToPeso(amountDue_gsis)}`}</p>
                </div>
              </div>
            )
          }
          {
            document?.activeTab === 'Meralco' && (
              <div className='py-1 flex flex-row px-2 text-sm sm:text-base 2xl:text-lg'>
                <div className='w-2/5 h-full'>
                  <p className='text-gray-500'>Amount</p>
                  <p className='text-gray-500'>Tax Base</p>
                  <p className='text-gray-500'>VAT</p>
                  <p className='text-gray-500'>NON VAT</p>
                  <p className='text-gray-500'>Tax(5%)</p>
                  <p className='text-gray-500'>Tax(2%)</p>
                  <p className='text-gray-500'>Total Tax Amount</p>
                  <p className='text-gray-500'>Amount Due</p>
                </div>
                <div className='w-3/5 h-full'>
                  <p className='text-customFontColor font-medium'>{`${formatToPeso(meralcoGross)}`}</p>
                  <p className='text-customFontColor font-medium'>{`${formatToPeso(document?.meralcoVAT)}`}</p>
                  <p className='text-customFontColor font-medium'>{`${formatToPeso(document?.amount)}`}</p>
                  <p className='text-customFontColor font-medium'>{`${formatToPeso(document?.meralcoNONVAT)}`}</p>
                  <p className='text-customFontColor font-medium' key={'key3'}>{`${formatToPeso(document?.meralcoVAT)} ${document?.TT_formula1.replace(/\*/g, ' x ').replace(/\//g, ' / ').replace(/\+/g, ' + ').replace(/\-/g, ' - ')} = ${formatToPeso(meralcoTax5)}`}</p>
                  <p className='text-customFontColor font-medium' key={'key4'}>{`${formatToPeso(document?.meralcoVAT)} + ${formatToPeso(document?.meralcoNONVAT)} ${document?.TT_formula2.replace(/\*/g, ' x ').replace(/\//g, ' / ').replace(/\+/g, ' + ').replace(/\-/g, ' - ')} = ${formatToPeso(meralcoTax2)}`}</p>
                  <p className='text-customFontColor font-medium'>{`${formatToPeso(meralcoTax)}`}</p>
                  <p className='text-customFontColor font-medium'>{`${formatToPeso(meralcoAmountDue)}`}</p>
                </div>
              </div>
            )
          }
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
              
              {
                document?.ASA ? (
                  <ul className="list-disc list-inside">
                    {Object.entries(document.ASA).map(([key, value], index) => {
                    const parts = key.split('|'); // Split the key
                    return (
                      <li key={index} className="text-customFontColor font-semibold">
                        {`${parts[0].replace('|', ' ')} : ${value}`}
                      </li>
                    );
                  })}
                  </ul>
                ) : (<p className="text-customFontColor font-semibold">--</p>)
              }
              <p className='text-customFontColor font-semibold'>{document?.NF_name}</p>
              <p className='text-customFontColor font-semibold'>{document?.NF_office}</p>
              {document?.accTitle.map((title, index) => (
                <>
                  <li key={`title-${index}`} className='text-customFontColor font-semibold truncate'>{title}</li>
                </>
              ))}
              {document?.accCode.map((code, index) => (
                <>
                  <li key={`code-${index}`} className='text-customFontColor font-semibold'>{code}</li>
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
              <p className='text-customFontColor font-medium'>{document?.DVBIR}</p>
              <p className='text-customFontColor font-medium'>RO</p>
              {
                document?.activeTab === 'DV' && (
                  <p className='text-customFontColor font-medium'>{`${formatToPeso(floatAmountDue)}`}</p>
                )
              }
              {
                document?.activeTab === 'GSIS' && (
                  <p className='text-customFontColor font-medium'>{`${formatToPeso(val1)}`}</p>
                )
              }
              <p className='text-customFontColor font-medium'>{document?.birParticular}</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='w-full py-1'>
            <h1 className='text-lg 2xl:text-xl font-semibold'>Action Log</h1>
          </div>
          <div className='py-1 flex flex-row px-2 text-sm sm:text-base 2xl:text-lg'>
            <div className='w-2/5 h-full'>
              <p className='text-gray-500'>Created By</p>
              <p className='text-gray-500'>Submitted By</p>
              <p className='text-gray-500'>Updated By</p>
              <p className='text-gray-500'>Reviewed By</p>
              <p className='text-gray-500'>Approved By</p>
            </div>
            <div className='w-3/5 h-full'>
              <p className='text-customFontColor font-medium'>{document?.createdBy}</p>
              <p className='text-customFontColor font-medium'>{document?.submittedBy ? document?.submittedBy.replace('|', ' on ') : '--'}</p>
              <p className='text-customFontColor font-medium'>{document?.updatedBy ? document?.updatedBy.replace('|', ' on ') : '--'}</p>
              <p className='text-customFontColor font-medium'>{document?.reviewedBy ? document?.reviewedBy.replace('|', ' on ') : '--'}</p>
              <p className='text-customFontColor font-medium'>{document?.approvedBy ? document?.approvedBy.replace('|', ' on ') : '--'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

DVTemplate.propTypes = {
    document: PropTypes.object
}

export default DVTemplate