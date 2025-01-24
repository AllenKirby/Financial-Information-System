import PropTypes from 'prop-types'

const DVRegisterItems = ({DV, index}) => {

    const formatToPeso = (value) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(value);
    };

  return (
    <div className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} w-full h-auto rounded-lg p-2 flex flex-col sm:flex-row items-center justify-center text-sm`}>
        <p className='w-full sm:w-1/5 truncate flex items-center justify-start gap-2 font-semibold'><span className='font-normal block sm:hidden'>Payee: </span>{DV[1].data.payee}</p>
        <p className='w-full sm:w-1/5 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>DV NO.: </span>{DV[1].data.DV}</p>
        <p className='w-full sm:w-1/5 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>Date: </span>{DV[1].data.date}</p>
        <p className='w-full sm:w-1/5 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>ORS/BURS: </span>{DV[1].data.ORSBURS || '--'}</p>
        <p className='w-full sm:w-1/5 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>Amount: </span>{formatToPeso(DV[1].data.amount)}</p>
    </div>
  )
}

DVRegisterItems.propTypes = {
    DV: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
}

export default DVRegisterItems