import { useAuthContext } from "../../../hooks/useAuthContext"
//import PropTypes from 'prop-types'

const TemplateModal = () => {   
    const { user } = useAuthContext()

  return (
    <div className="w-1/3 h-2/3 flex flex-col bg-white rounded-lg text-gray-500">
        <div className="w-full h-auto p-3 border-b-2">
          <h1 className={`${user?.role === '1' ? 'text-customgreen' : 'text-BOGreen'} text-lg font-bold`}>Assign Excel Cell</h1>
        </div>
        <div className="w-full flex-1 overflow-y-auto p-2">
          <div className="w-full h-auto my-1">
            <h1 className="text-lg font-semibold">Payee Information</h1>
            <div className="w-full h-auto flex items-center justify-center gap-2 my-1">
              <div className="w-1/3 h-auto flex flex-col">
                <label className="text-sm">Payee</label>
                <input 
                  type="text" 
                  className={`${user.role === '1' ? 'focus:outline-customgreen' : 'focus:outline-BOGreen'} w-full px-4 py-2 rounded-md border-2`}/>
              </div>
              <div className="w-1/3 h-auto flex flex-col">
                <label className="text-sm">Address</label>
                <input 
                  type="text" 
                  className={`${user.role === '1' ? 'focus:outline-customgreen' : 'focus:outline-BOGreen'} w-full px-4 py-2 rounded-md border-2`}/>
              </div>
              <div className="w-1/3 h-auto flex flex-col">
                <label className="text-sm">TIN/Employee No.</label>
                <input 
                  type="text" 
                  className={`${user.role === '1' ? 'focus:outline-customgreen' : 'focus:outline-BOGreen'} w-full px-4 py-2 rounded-md border-2`}/>
              </div>
            </div>
          </div>
          <div className="w-full h-auto my-1">
            <h1 className="text-lg font-semibold">Document/Transaction Information</h1>
            <div className="w-full h-auto flex flex-col items-center justify-center gap-2 my-1">
              <div className="w-full h-auto my-1 flex items-center justify-center gap-2">
                <div className="w-1/2 h-auto flex flex-col">
                  <label className="text-sm">Fund Cluster</label>
                  <input 
                    type="text" 
                    className={`${user.role === '1' ? 'focus:outline-customgreen' : 'focus:outline-BOGreen'} w-full px-4 py-2 rounded-md border-2`}/>
                </div>
                <div className="w-1/2 h-auto flex flex-col">
                  <label className="text-sm">Date</label>
                  <input 
                    type="text" 
                    className={`${user.role === '1' ? 'focus:outline-customgreen' : 'focus:outline-BOGreen'} w-full px-4 py-2 rounded-md border-2`}/>
                </div>
              </div>
              <div className="w-full h-auto my-1 flex items-center justify-center gap-2">
                <div className="w-1/2 h-auto flex flex-col">
                  <label className="text-sm">DV No.</label>
                  <input 
                    type="text" 
                    className={`${user.role === '1' ? 'focus:outline-customgreen' : 'focus:outline-BOGreen'} w-full px-4 py-2 rounded-md border-2`}/>
                </div>
                <div className="w-1/2 h-auto flex flex-col">
                  <label className="text-sm">Responsibility Center</label>
                  <input 
                    type="text" 
                    className={`${user.role === '1' ? 'focus:outline-customgreen' : 'focus:outline-BOGreen'} w-full px-4 py-2 rounded-md border-2`}/>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-auto my-1">
            <h1 className="text-lg font-semibold">Certified By</h1>
            <div className="w-full h-auto flex items-center justify-center gap-2 my-1">
              <div className="w-1/2 h-auto flex flex-col">
                <label className="text-sm">Name</label>
                <input 
                  type="text" 
                  className={`${user.role === '1' ? 'focus:outline-customgreen' : 'focus:outline-BOGreen'} w-full px-4 py-2 rounded-md border-2`}/>
              </div>
              <div className="w-1/2 h-auto flex flex-col">
                <label className="text-sm">Office</label>
                <input 
                  type="text" 
                  className={`${user.role === '1' ? 'focus:outline-customgreen' : 'focus:outline-BOGreen'} w-full px-4 py-2 rounded-md border-2`}/>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-auto py-3 flex items-center justify-end">
          <button>Back</button>
          <button>Save</button>
        </div>
    </div>
  )
}

// TemplateModal.propTypes = {

// }

export default TemplateModal