const ItemPayroll = ({log, index}) => {
    const formatToPeso = (value) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(value);
    };
    return (
      <div className={`${index % 2 == 0 ? 'bg-white' : 'bg-offWhite'} flex flex-col sm:flex-row w-full py-3 rounded-lg mt-1`}>
          <p className="w-full sm:w-1/4 text-sm text-left px-2 truncate font-semibold flex gap-2"><span className="font-bold block sm:hidden">Date:</span>{log[0]}</p>
          <p className="w-full sm:w-1/4 text-sm text-left sm:text-center px-2 flex gap-2"><span className="font-bold block sm:hidden">Amount:</span>{formatToPeso(log[1].amount)}</p>
          <p className="w-full sm:w-1/4 text-sm text-left sm:text-center px-2 flex gap-2"><span className="font-bold block sm:hidden">Particular:</span>{log[1].particular}</p>
      </div>
    )
  }

export default ItemPayroll;