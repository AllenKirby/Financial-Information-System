import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'

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
          <div className='py-1 flex flex-col px-2 text-sm sm:text-base 2xl:text-lg'>
            <div className='w-full h-auto flex items-center justify-center'>
              <p className='text-gray-500 w-2/5'>TIN/Employee No.</p>
              <p className='text-customFontColor font-medium w-3/5'>{document?.TIN}</p>
            </div>
            <div className='w-full h-auto flex items-center justify-center'>
              <p className='text-gray-500 w-2/5'>Address</p>
              <p className='text-customFontColor font-medium w-3/5'>{document?.address}</p>
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
          {
            document?.activeTab === 'To Release' && (
              <div className='py-1 flex flex-col px-2 text-sm sm:text-base 2xl:text-lg'>
                <div className='w-full h-auto flex items-center justify-center'>
                  <p className='text-gray-500 w-2/5'>Amount</p>
                  <p className='text-customFontColor font-medium w-3/5'>{`${formatToPeso(document?.amount)}`}</p>
                </div>
                <div className='w-full h-auto flex items-center justify-center'>
                  <p className='text-gray-500 w-2/5'>Total Tax Amount</p>
                  <p className='text-customFontColor font-medium w-3/5'>{`${formatToPeso(floatTotal_val)}`}</p>
                </div>
                <div className='w-full h-auto flex items-center justify-center'>
                  <p className='text-gray-500 w-2/5'>Amount Due</p>
                  <p className='text-customFontColor font-medium w-3/5'>{`${formatToPeso(floatAmountDue)}`}</p>
                </div>
                <div className='w-full h-auto flex items-center justify-center'>
                  <p className='text-gray-500 w-2/5'>Tax Type</p>
                  <p className='text-customFontColor font-medium w-3/5'>{`${document?.TT_tax} ${document?.TT_cost}`}</p>
                </div>
                <div className='w-full h-auto flex items-start justify-center'>
                  <p className='text-gray-500 w-2/5'>Tax Type Formulas</p>
                  <div className=' w-3/5'>
                    <li className='text-customFontColor font-medium' key={'key1'}>{`${formatToPeso(document?.amount)} ${document?.TT_formula1.replace(/\*/g, ' x ').replace(/\//g, ' / ').replace(/\+/g, ' + ').replace(/\-/g, ' - ')} = ${val1}`}</li>
                    <li className='text-customFontColor font-medium' key={'key2'}>{`${formatToPeso(document?.amount)} ${document?.TT_formula2.replace(/\*/g, ' x ').replace(/\//g, ' / ').replace(/\+/g, ' + ').replace(/\-/g, ' - ')} = ${val2}`}</li>
                  </div>
                </div>
              </div>
            )
          }
          {
            document?.activeTab === 'GSIS' && (
              <div className='py-1 flex flex-col px-2 text-sm sm:text-base 2xl:text-lg'>
                <div className='w-full h-auto flex items-start justify-center'>
                  <p className='text-gray-500 w-2/5'>Premium</p>
                  <p className='text-customFontColor font-medium w-3/5'>{`${formatToPeso(document?.amount)}`}</p>
                </div>
                <div className='w-full h-auto flex items-start justify-center'>
                  <p className='text-gray-500 w-2/5'>Doc. Stamp - DST Premium</p>
                  <p className='text-customFontColor font-medium w-3/5'>{`${formatToPeso(document?.stamp)}`}</p>
                </div>
                <div className='w-full h-auto flex items-start justify-center'>
                  <p className='text-gray-500 w-2/5'>DST (COC)</p>
                  <p className='text-customFontColor font-medium w-3/5'>{`${formatToPeso(document?.dst)}`}</p>
                </div>
                <div className='w-full h-auto flex items-start justify-center'>
                  <p className='text-gray-500 w-2/5'>VAT 12%</p>
                  <p className='text-customFontColor font-medium w-3/5'>{`${formatToPeso(document?.vat12)}`}</p>
                </div>
                <div className='w-full h-auto flex items-start justify-center'>
                  <p className='text-gray-500 w-2/5'>Amount</p>
                  <p className='text-customFontColor font-medium w-3/5'>{`${formatToPeso(gross_gsis)}`}</p>
                </div>
                <div className='w-full h-auto flex items-start justify-center'>
                  <p className='text-gray-500 w-2/5'>Total Tax Amount</p>
                  <p className='text-customFontColor font-medium w-3/5'>{`${formatToPeso(document?.amount)} ${document?.TT_formula1.replace(/\*/g, ' x ').replace(/\//g, ' / ').replace(/\+/g, ' + ').replace(/\-/g, ' - ')} = ${val1}`}</p>
                </div>
                <div className='w-full h-auto flex items-start justify-center'>
                  <p className='text-gray-500 w-2/5'>Amount Due</p>
                  <p className='text-customFontColor font-medium w-3/5'>{`${formatToPeso(amountDue_gsis)}`}</p>
                </div>
              </div>
            )
          }
          {
            document?.activeTab === 'Meralco' && (
              <div className='py-1 flex flex-col px-2 text-sm sm:text-base 2xl:text-lg'>
                <div className='w-full h-auto flex items-start justify-center'>
                  <p className='text-gray-500 w-2/5'>Amount</p>
                  <p className='text-customFontColor font-medium w-3/5'>{`${formatToPeso(meralcoGross)}`}</p>
                </div>
                <div className='w-full h-auto flex items-start justify-center'>
                  <p className='text-gray-500 w-2/5'>Tax Base</p>
                  <p className='text-customFontColor font-medium w-3/5'>{`${formatToPeso(document?.meralcoVAT)}`}</p>
                </div>
                <div className='w-full h-auto flex items-start justify-center'>
                  <p className='text-gray-500 w-2/5'>VAT</p>
                  <p className='text-customFontColor font-medium w-3/5'>{`${formatToPeso(document?.amount)}`}</p>
                </div>
                <div className='w-full h-auto flex items-start justify-center'>
                  <p className='text-gray-500 w-2/5'>NON VAT</p>
                  <p className='text-customFontColor font-medium w-3/5'>{`${formatToPeso(document?.meralcoNONVAT)}`}</p>
                </div>
                <div className='w-full h-auto flex items-start justify-center'>
                  <p className='text-gray-500 w-2/5'>Tax(5%)</p>
                  <p className='text-customFontColor font-medium w-3/5' key={'key3'}>{`${formatToPeso(document?.meralcoVAT)} ${document?.TT_formula1.replace(/\*/g, ' x ').replace(/\//g, ' / ').replace(/\+/g, ' + ').replace(/\-/g, ' - ')} = ${formatToPeso(meralcoTax5)}`}</p>
                </div>
                <div className='w-full h-auto flex items-start justify-center'>
                  <p className='text-gray-500 w-2/5'>Tax(2%)</p>
                  <p className='text-customFontColor font-medium w-3/5' key={'key4'}>{`${formatToPeso(document?.meralcoVAT)} + ${formatToPeso(document?.meralcoNONVAT)} ${document?.TT_formula2.replace(/\*/g, ' x ').replace(/\//g, ' / ').replace(/\+/g, ' + ').replace(/\-/g, ' - ')} = ${formatToPeso(meralcoTax2)}`}</p>
                </div>
                <div className='w-full h-auto flex items-start justify-center'>
                  <p className='text-gray-500 w-2/5'>Total Tax Amount</p>
                  <p className='text-customFontColor font-medium w-3/5'>{`${formatToPeso(meralcoTax)}`}</p>
                </div>
                <div className='w-full h-auto flex items-start justify-center'>
                  <p className='text-gray-500 w-2/5'>Amount Due</p>
                  <p className='text-customFontColor font-medium w-3/5'>{`${formatToPeso(meralcoAmountDue)}`}</p>
                </div>
              </div>
            )
          }
        </div>
        <div className='flex flex-col'>
          <div className='w-full py-1'>
            <h1 className='text-lg 2xl:text-xl font-semibold'>Other Information</h1>
          </div>
          <div className='py-1 flex flex-col px-2 text-sm sm:text-base 2xl:text-lg'>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='text-gray-500 w-2/5'>Cash Available</p>
              <p className='text-customFontColor font-semibold w-3/5'>{document?.cashAvailable ? `✓` : '--'}</p>
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='text-gray-500 w-2/5'>Subject to Authority to Debit Account</p>
              <p className='text-customFontColor font-semibold w-3/5'>{document?.debitAccount ? `✓` : '--'}</p>
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='text-gray-500 w-2/5'>Supporting documents complete and amount claimed proper</p>
              <p className='text-customFontColor font-semibold w-3/5'>{document?.supportingDocuments ? `✓` : '--'}</p>
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
                    const parts = key.split('|'); // Split the key
                    return (
                      <li key={index} className="text-customFontColor font-semibold">
                        {`${parts[0].replace('|', ' ')} : ${formatToPeso(value)}`}
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
        </div>
        <div className='flex flex-col'>
          <div className='w-full py-1'>
            <h1 className='text-lg 2xl:text-xl font-semibold'>BIR Information</h1>
          </div>
          <div className='py-1 flex flex-col px-2 text-sm sm:text-base 2xl:text-lg'>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='text-gray-500 w-2/5'>Payee</p>
              <p className='text-customFontColor font-medium w-3/5'>BIR</p>
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='text-gray-500 w-2/5'>Address</p>
              <p className='text-customFontColor font-medium w-3/5'>Calamba, Laguna</p>
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='text-gray-500 w-2/5'>DV No.</p>
              <p className='text-customFontColor font-medium w-3/5'>{document?.DVBIR}</p>
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='text-gray-500 truncate w-2/5'>Responsibility Center</p>
              <p className='text-customFontColor font-medium w-3/5'>RO</p>
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='text-gray-500 w-2/5'>Amount Due</p>
              {
                document?.activeTab === 'To Release' && (
                  <p className='text-customFontColor font-medium w-3/5'>{`${formatToPeso(floatAmountDue)}`}</p>
                )
              }
              {
                document?.activeTab === 'GSIS' && (
                  <p className='text-customFontColor font-medium w-3/5'>{`${formatToPeso(val1)}`}</p>
                )
              }
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='text-gray-500 w-2/5'>Particulars</p>
              <p className='text-customFontColor font-medium break-words w-3/5'>{document?.birParticular}</p>
            </div>
          </div>
        </div>
        {document?.ORSBURS && (
          <div className='w-full h-auto flex flex-col'>
            <div className='w-full py-1'>
              <h1 className='text-lg 2xl:text-xl font-semibold'>Budget Utilization Request and Status</h1>
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='w-2/5'>Payee:</p>
              <p className='w-3/5 text-customFontColor font-medium'>{document?.payee}</p>
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='w-2/5'>Office:</p>
              <p className='w-3/5 text-customFontColor font-medium'></p>
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='w-2/5'>Address:</p>
              <p className='w-3/5 text-customFontColor font-medium'>{document?.address}</p>
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='w-2/5'>Date:</p>
              <p className='w-3/5 text-customFontColor font-medium'>{document?.date}</p>
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='w-2/5'>Serial No:</p>
              <p className='w-3/5 text-customFontColor font-medium'></p>
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='w-2/5'>Fund Cluster:</p>
              <p className='w-3/5 text-customFontColor font-medium'>{document?.fund}</p>
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='w-2/5'>Responsibility Center:</p>
              <p className='w-3/5 text-customFontColor font-medium'>{document?.RC}</p>
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='w-2/5'>Paticulars:</p>
              <p className='w-3/5 text-customFontColor font-medium'>{document?.particular}</p>
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='w-2/5'>Amount:</p>
              <p className='w-3/5 text-customFontColor font-medium'>{`${formatToPeso(document?.amount)}`}</p>
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='w-2/5'>Amount Due:</p>
              <p className='w-3/5 text-customFontColor font-medium'>{`${formatToPeso(floatAmountDue)}`}</p>
            </div>
          </div>
        )}
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
    </div>
  )
}

DVTemplate.propTypes = {
    document: PropTypes.object
}

export default DVTemplate