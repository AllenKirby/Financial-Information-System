import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types'
import { useState } from "react";
import PayrollModal from "./PayrollModal";

import { IoMdAdd  } from "react-icons/io";

const ItemPayroll = ({log, index}) => {
  const navigate = useNavigate()
    const formatToPeso = (value) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(value);
    };

    const [isModalOpen, setIsModalOpen] = useState(false)

    const modal = () => {
      setIsModalOpen(!isModalOpen)
    }
    return (
      <div onClick={() => navigate(``)} className={`${index % 2 == 0 ? 'bg-white' : 'bg-offWhite'} flex flex-col sm:flex-row w-full p-3 rounded-lg mt-1`}>
        <>
          <p className="w-full sm:w-2/5 text-sm text-left px-2 truncate flex gap-2"><span className="font-bold block sm:hidden">Date:</span>{log[0]}</p>
          <p className="w-full sm:w-1/5 text-sm flex items-center justify-start sm:justify-center font-semibold px-2 gap-2"><span className="font-bold block sm:hidden">Amount:</span>{formatToPeso(log[1].amount)}</p>
          <p className="w-full sm:w-2/5 text-sm flex items-center justify-start sm:justify-center px-2 gap-2"><span className="font-bold block sm:hidden">Particular:</span>{log[1].particular}</p>
          <div className="w-full sm:w-fit flex items-center justify-center">
            <button onClick={modal} className="w-fit"><IoMdAdd size={20}/></button>
          </div>
        </>
        {isModalOpen && (
          <>
            <div className="fixed inset-0 z-20 bg-black opacity-50" />
            <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
              <PayrollModal modal={modal} log={log}/>
            </div>
          </>
        )}
      </div>
    )
  }

  ItemPayroll.propTypes = {
    log: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    modal: PropTypes.func.isRequired,
  }

export default ItemPayroll;