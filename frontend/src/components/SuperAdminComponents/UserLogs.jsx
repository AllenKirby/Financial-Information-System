import PropTypes from 'prop-types'

const UserLogs = ({index, log}) => {
    
    const role = log[1].role === "0" ? "Super Admin" :
                log[1].role === "1" ? "Head of Finance" :
                log[1].role === "2" ? "Budget Officer" :
                log[1].role === "3" ? "Funding" :
                "Preparer"
    const [date, time] = log[0].split(',').map(part => part.trim());
  return (
    <div className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} flex flex-col sm:flex-row rounded-lg mt-2`}>
        <div className="w-full sm:w-1/6 px-4 py-2 flex gap-2"><span className="font-bold block sm:hidden">Date: </span>{date}</div>
        <div className="w-full sm:w-1/6 px-4 py-2 flex gap-2"><span className="font-bold block sm:hidden">Time:</span>{time}</div>
        <div className="w-full sm:w-1/6 px-4 py-2 flex gap-2 truncate"><span className="font-bold block sm:hidden">Fullname:</span>{log[1].name}</div>
        <div className="w-full sm:w-1/6 px-4 py-2 flex gap-2"><span className="font-bold block sm:hidden">Role:</span>{role}</div>
        <div className="w-full sm:w-1/6 px-4 py-2 flex gap-2 truncate"><span className="font-bold block sm:hidden">Email:</span><span className="text-blue-500 underline">{log[1].email}</span></div>
        <div className="w-full sm:w-1/6 px-4 py-2 flex gap-2 truncate"><span className="font-bold block sm:hidden">UID:</span><span className="text-green-500">{log[1].uid}</span></div>
    </div>
  )
}

UserLogs.propTypes = {
    index: PropTypes.number.isRequired,
    log: PropTypes.array.isRequired
}

export default UserLogs