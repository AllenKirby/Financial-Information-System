import { useAuthContext } from "../../../hooks/useAuthContext"
import PropTypes from 'prop-types'

const TemplateModal = ({ templateFor }) => {   
    const { user } = useAuthContext()

  return (
    <div className="w-1/3 h-full flex flex-col bg-white">
        <div className="w-full h-auto p-3 border-b-2">
            <h1 className={`${user?.role === '1' ? 'text-customgreen' : 'text-BOGreen'} text-lg font-bold`}>{`Assign Excel Cell for ${templateFor}`}</h1>
        </div>
    </div>
  )
}

TemplateModal.propTypes = {
    templateFor: PropTypes.string.isRequired
}

export default TemplateModal