import PropTypes from 'prop-types'

const HistoryLogsItem = ({log, index}) => {
  return (
    <div className={`${index % 2 == 0 ? 'bg-white' : 'bg-offWhite'} flex flex-col sm:flex-row w-full py-3 rounded-lg mt-1`}>
        <p className="w-full sm:w-1/4 text-sm text-left px-2 truncate font-semibold flex gap-2"><span className="font-bold block sm:hidden">Payee:</span>{log[1].split('!')[0]}</p>
        <p className="w-full sm:w-1/4 text-sm text-left sm:text-center px-2 flex gap-2"><span className="font-bold block sm:hidden">DV No.:</span>{log[1].split('!')[1].split('|').slice()[0]}</p>
        <p className="w-full sm:w-1/4 text-sm text-left sm:text-center px-2 flex gap-2"><span className="font-bold block sm:hidden">Status:</span>{log[1].split('!')[4]}</p>
        <p className="w-full sm:w-1/4 text-sm text-left sm:text-center px-2 flex gap-2"><span className="font-bold block sm:hidden">Last Action By Name:</span>{log[1].split('!')[2].replace(',', ' ')}</p>
        <p className="w-full sm:w-1/4 text-sm text-left sm:text-center px-2 flex gap-2"><span className="font-bold block sm:hidden">Action Time and Date:</span>{`${log[1].split('!')[3]}`}</p>
    </div>
  )
}

HistoryLogsItem.propTypes = {
    index: PropTypes.number.isRequired,
    log: PropTypes.array.isRequired
}

export default HistoryLogsItem