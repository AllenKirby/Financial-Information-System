import PropTypes from 'prop-types'

const AccessControlLogs = ({index, log}) => {
    console.log(log[1])
    const desc = log[1].event ? (
        <>
            The role {log[1].role} granted access feature of {log.feature}
        </>
    ) : (
        <>
            The role {log[1].role} revoked access feature
        </>
    )

    const [date, time] = log[0].split(',').map(part => part.trim());

    return (
        <div key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} flex flex-col sm:flex-row rounded-lg mt-2`}>
            <div className="w-full sm:w-1/5 px-4 py-2 flex gap-2"><span className="font-bold block sm:hidden">Date:</span> {date}</div>
            <div className="w-full sm:w-1/5 px-4 py-2 flex gap-2"><span className="font-bold block sm:hidden">Time:</span>{time}</div>
            <div className="w-full sm:w-3/5 px-4 py-2 flex gap-2"><span className="font-bold block sm:hidden">Description:</span>{desc}</div>
        </div>
    )
}

AccessControlLogs.propTypes = {
    index: PropTypes.number.isRequired,
    log: PropTypes.array.isRequired
}

export default AccessControlLogs