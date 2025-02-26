import { useAuthContext } from "../../hooks/useAuthContext"
import PropTypes from 'prop-types'

const PayrollModal = ({modal}) => {
    const { user } = useAuthContext()
  return (
    <form className="w-[400px] h-auto rounded-lg bg-white p-3 text-gray-500">
        <div className="w-full py-3">
            <h1 className={`${user?.role === '4' ? 'text-preparerPrimary' : 'text-fundingBlueGreen'} font-semibold text-xl`}>Bahala ka na sa Title neto</h1>
        </div>
        <div className="w-full h-auto p-2">
            {/* dito ka maglagay */}
        </div>
        <div className="w-full h-fit py-2 flex items-center justify-end gap-2">
            <button 
                type='button' 
                onClick={modal}
                className='px-5 py-2 rounded-lg border-2 font-semibold'>Back</button>
            <button type="submit" className={`${user?.role === '4' ? 'bg-preparerPrimary' : 'bg-fundingBlueGreen'} px-5 py-2 rounded-lg text-white`} >Save</button>
        </div>
    </form>
  )
}

PayrollModal.propTypes = {
    modal: PropTypes.func.isRequired
}

export default PayrollModal