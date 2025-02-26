import PropTypes from 'prop-types'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useEffect, useState } from 'react'
import { usePreparerHook } from '../../hooks/usePreparerHook'
import LargeLoader from '../Loaders/LargeLoader'
import Swal from 'sweetalert2'

const DVRegisterModal = ({modal, DVData}) => {
    const { user } = useAuthContext()
    const { DVRegisterData, isLoading, error } = usePreparerHook()
    const [data, setData] = useState({  
        PRNoDate: '', 
        PRNo: 0, 
        PONODate: '', 
        PONO: 0, 
        BURDate: '', 
        ADAfirst: '', 
        ADASecond: '', 
        checkDate: '', 
        checkNo: 0
    })

    useEffect(() => {
        setData({
            PRNoDate: DVData.PRNoDate, 
            PRNo: DVData.PRNo, 
            PONODate: DVData.PONODate, 
            PONO: DVData.PONO, 
            BURDate: DVData.BURDate, 
            ADAfirst: DVData.ADAfirst, 
            ADASecond: DVData.ADASecond, 
            checkDate: DVData.checkDate, 
            checkNo: DVData.checkNo
        })
    }, [DVData])

    const handleSubmit = async(e) => {
        e.preventDefault()
        const res = await DVRegisterData(data, DVData.DVKey) 

        if(res){
                Swal.fire({
                title: "Saved",
                text: "Successfully Saved",
                icon: "success",
                confirmButtonColor: "#009933"
            });
            modal()
        } else {
                Swal.fire({
                title: "Error",
                text: {error},
                icon: "error",
                confirmButtonColor: "#FF0000"
            });
        }
    }

  return (
    <form onSubmit={handleSubmit} className="w-[400px] h-auto rounded-lg bg-white p-3 flex flex-col">
        <div className='w-full py-3'>
            <h1 className={`${user?.role === '4' ? 'text-preparerPrimary' : 'text-fundingBlueGreen'} font-semibold text-xl`}>Add Transaction Reference Details</h1>
        </div>
        <div className='w-full flex-1 overflow-y-auto p-2'>
            <div className='w-full flex flex-row items-center justify-center gap-2'>
                <div className='w-1/2 flex flex-col'>
                    <label className='font-medium'>PR No. Date</label>
                    <input type="date" 
                        value={data.PRNoDate}
                        onChange={(e) => setData({...data, PRNoDate: e.target.value})}
                        className={`${user?.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                        />
                </div>
                <div className='w-1/2 flex flex-col'>
                    <label className='font-medium'>PR No.</label>
                    <input type="number" 
                        value={data.PRNo}
                        onChange={(e) => setData({...data, PRNo: e.target.value})}
                        className={`${user?.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`} 
                        />
                </div>
            </div>
            <div className='w-full flex flex-row items-center justify-center gap-2 mt-3'>
                <div className='w-1/2 flex flex-col'>
                    <label className='font-medium'>PO No. Date</label>
                    <input type="date" 
                        value={data.PONODate}
                        onChange={(e) => setData({...data, PONODate: e.target.value})}
                        className={`${user?.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                        />
                </div>
                <div className='w-1/2 flex flex-col'>
                    <label className='font-medium'>PO No.</label>
                    <input type="number" 
                        value={data.PONO}
                        onChange={(e) => setData({...data, PONO: e.target.value})}
                        className={`${user?.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`} 
                        />
                </div>
            </div>
            <div className='w-full flex flex-col mt-3'>
                <label className='font-medium'>BUR Date</label>
                <input type="date" 
                    value={data.BURDate}
                    onChange={(e) => setData({...data, BURDate: e.target.value})}
                    className={`${user?.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                    />
            </div>
            <div className='w-full flex flex-row items-center justify-center gap-2 mt-3'>
                <div className='w-1/2 flex flex-col'>
                    <label className='font-medium'>ADA - 1st</label>
                    <input type="text" 
                        value={data.ADAfirst}
                        onChange={(e) => setData({...data, ADAfirst: e.target.value})}
                        className={`${user?.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                        />
                </div>
                <div className='w-1/2 flex flex-col'>
                    <label className='font-medium'>ADA - 2nd</label>
                    <input type="text" 
                        value={data.ADASecond}
                        onChange={(e) => setData({...data, ADASecond: e.target.value})}
                        className={`${user?.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`} 
                        />
                </div>
            </div>
            <div className='w-full flex flex-row items-center justify-center gap-2 mt-3'>
                <div className='w-1/2 flex flex-col'>
                    <label className='font-medium'>Check Date</label>
                    <input type="date" 
                        value={data.checkDate}
                        onChange={(e) => setData({...data, checkDate: e.target.value})}
                        className={`${user?.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                        />
                </div>
                <div className='w-1/2 flex flex-col'>
                    <label className='font-medium'>Check No.</label>
                    <input type="text" 
                        value={data.checkNo}
                        onChange={(e) => setData({...data, checkNo: e.target.value})}
                        className={`${user?.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`} 
                        />
                </div>
            </div>
        </div>
        <div className="w-full h-fit py-2 flex items-center justify-end gap-2">
            <button 
                type='button' 
                onClick={modal}
                className='px-5 py-2 rounded-lg border-2 font-semibold'>Back</button>
            <button type="submit" className={`${user?.role === '4' ? 'bg-preparerPrimary' : 'bg-fundingBlueGreen'} px-5 py-2 rounded-lg text-white`} >Save</button>
        </div>
        {isLoading && (
            <LargeLoader/>
        )}
    </form>
  )
}


DVRegisterModal.propTypes = {
    modal: PropTypes.func.isRequired,
    DVData: PropTypes.func.isRequired,
}
export default DVRegisterModal