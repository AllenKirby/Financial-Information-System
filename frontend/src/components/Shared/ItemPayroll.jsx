import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types'

import { IoMdAdd  } from "react-icons/io";

const ItemPayroll = ({log, index, modal}) => {
  const navigate = useNavigate()
    const formatToPeso = (value) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(value);
    };

    console.log(log)
    return (
      <div onClick={() => navigate(``)} className={`${index % 2 == 0 ? 'bg-white' : 'bg-offWhite'} flex flex-col sm:flex-row w-full p-3 rounded-lg mt-1`}>
          <p className="w-full sm:w-2/5 text-sm text-left px-2 truncate font-semibold flex gap-2"><span className="font-bold block sm:hidden">Date:</span>{log[0]}</p>
          <p className="w-full sm:w-1/5 text-sm text-left sm:text-center px-2 flex gap-2"><span className="font-bold block sm:hidden">Amount:</span>{formatToPeso(log[1].amount)}</p>
          <p className="w-full sm:w-2/5 text-sm text-left sm:text-center px-2 flex gap-2"><span className="font-bold block sm:hidden">Particular:</span>{log[1].particular}</p>
          <button onClick={modal} className="w-fit"><IoMdAdd size={20}/></button>
      </div>
    )
  }

  ItemPayroll.propTypes = {
    log: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    modal: PropTypes.func.isRequired,
  }

export default ItemPayroll;