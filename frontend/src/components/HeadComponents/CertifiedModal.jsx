import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useBudgetOfficerHook } from '../../hooks/useBudgetOfficerHook'
import Swal from 'sweetalert2'
import LargeLoader from '../Loaders/LargeLoader'

const CertifiedModal = ({modal, data}) => {
    const [certified, setCertified] = useState({cashAvailable: false, debitAccount: false, supportingDocuments: false})
    const { addCertified, isLoading, error } = useBudgetOfficerHook()

    useEffect(() => {
        setCertified({
            cashAvailable: data.cashAvailable ? data.cashAvailable : false,
            debitAccount: data.debitAccount ? data.debitAccount : false,
            supportingDocuments: data.supportingDocuments ? data.supportingDocuments : false
        })
    }, [data])

    const handleSubmit = async(e) => {
        e.preventDefault()
        console.log(certified)
        const res = await addCertified(certified, data.DVKey)

        if(res){
            Swal.fire({
                title: "Saved",
                text: "Successfully Save!",
                icon: "success",
                confirmButtonColor: "#009933"
            });
            modal()
        } else {
            Swal.fire({
                title: "Error",
                text: {error},
                icon: "error",
                confirmButtonColor: "#009933"
            });
        }
    }

  return (
    <form onSubmit={handleSubmit} className="w-[550px] h-auto bg-white rounded-lg p-5 flex flex-col gap-5">
        <h1 className="font-semibold text-lg text-BOGreen">Certification of Fund Availability and Document Completeness</h1>
        <div className='w-full flex flex-col gap-3 px-5'>
            <div className='w-full flex items-center justify-between'>
                <label className='font-semibold'>Cash Available</label>
                <input type="checkbox" checked={certified.cashAvailable} onChange={(e) => setCertified({...certified, cashAvailable: e.target.checked})} className='accent-BOGreen scale-125'/>
            </div>
            <div className='w-full flex items-center justify-between'>
                <label className='font-semibold'>Subject to Authority to Debit Account(When Applicable)</label>
                <input type="checkbox" checked={certified.debitAccount} onChange={(e) => setCertified({...certified, debitAccount: e.target.checked})} className='accent-BOGreen scale-125'/>
            </div>
            <div className='w-full flex items-center justify-between'>
                <label className='font-semibold'>Support documents complete and claimed proper</label>
                <input type="checkbox" checked={certified.supportingDocuments} onChange={(e) => setCertified({...certified, supportingDocuments: e.target.checked})} className='accent-BOGreen scale-125'/>
            </div>
        </div>
        <div className="w-full flex items-center justify-end gap-2 py-2">
            <button 
                type="button" 
                className='px-5 py-2 border-2 rounded-lg font-semibold' 
                onClick={modal}
                >
                    Back
            </button>
            <button 
                type="submit"
                disabled={isLoading}
                className='px-5 py-2 bg-BOGreen rounded-lg text-white'
                >
                    Save
            </button>
        </div>
        {isLoading && (
            <LargeLoader/>
        )}
    </form>
  )
}

CertifiedModal.propTypes = {
    modal: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

export default CertifiedModal