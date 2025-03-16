import { useAuthContext } from "../../hooks/useAuthContext"
import PropTypes from 'prop-types'
import { useEffect, useState } from "react"
import { firestore } from "../../config/firebase-config"
import { doc, onSnapshot } from "firebase/firestore";
import { useFundingHook } from "../../hooks/useFundingHook";

const PayrollModal = ({modal, log = {}}) => {
    const { user } = useAuthContext()

    const [payrollCB, setPayrollCB] = useState({})
    const [selectedKey, setSelectedKey] = useState("");
    const [selectedProject, setSelectedProject] = useState({projectName: '', projectID: ''});
    const {add_ASA_cashFO} = useFundingHook()
    const [disable, setDisable] = useState(false)

    useEffect(() => {
        const ref = doc(firestore, "formData","forPayrolls");
        const unsubscribe = onSnapshot(ref, (snapshot) => {
            if (snapshot.exists()) {
                setPayrollCB(snapshot.data());
            } else {
                setPayrollCB({});
            }
        });

        return () => unsubscribe();
    }, [])
    const keys = Object.keys(payrollCB);
    
  const handleSubmit = async (e) => {
    e.preventDefault()
    setDisable(true)
    const data = {
        project: selectedProject,
        amount: log[1].amount,
        particular: log[1].particular,
        date_id: log[0]
    }
    const res = await add_ASA_cashFO(data)
  }

  return (
    <form onSubmit={handleSubmit} className="w-[400px] h-auto rounded-lg bg-white p-3 text-gray-500">
        <div className="w-full py-3">
            <h1 className={`${user?.role === '4' ? 'text-preparerPrimary' : 'text-fundingBlueGreen'} font-semibold text-xl`}>Control Books</h1>
        </div>
        <div className="w-full h-auto p-2">
            <select
                onChange={(e) => setSelectedKey(e.target.value)}
                value={selectedKey}
            >
                <option value="" disabled>Select an option</option>
                {keys.map((key) => {
                    const displayText = key?.split('!')[0]?.replaceAll('|', ' ') || key;
                    return (
                        <option key={key} value={key}>
                            {displayText}
                        </option>
                    );
                })}
            </select>
            
                
            <select
                onChange={(e) => {
                    const selectedOption = e.target.options[e.target.selectedIndex];
                    setSelectedProject({projectName: selectedOption.getAttribute('name'), projectID: e.target.value})

                }}
                value={selectedProject.projectName}
                disabled={!selectedKey}
            >
                <option value="" disabled>
                    {selectedKey ? "Select a project" : "Select a top-level key first"}
                </option>
                { selectedKey &&
                    payrollCB[selectedKey].map((key) => (
                        <option key={key.projectID} value={key.projectID} name={key.projectName}>
                            {key.projectName}
                        </option>
                    ))
                }
            </select>
            
        </div>
        <div className="w-full h-fit py-2 flex items-center justify-end gap-2">
            <button 
                type='button' 
                onClick={modal}
                className='px-5 py-2 rounded-lg border-2 font-semibold'>Back</button>
            <button
                type="submit" 
                disabled={disable}
                className={`${user?.role === '4' ? 'bg-preparerPrimary' : 'bg-fundingBlueGreen'} px-5 py-2 rounded-lg text-white`} >Save</button>
        </div>
    </form>

    // <div className="w-full h-auto flex">
    //     <select
    //         onChange={(e) => setSelectedKey(e.target.value)}
    //         value={selectedKey}
    //     >
    //         <option value="" disabled>Select an option</option>
    //         {keys.map((key) => (
    //             <option key={key} value={key}>
    //                 {key}
    //             </option>
    //         ))}
    //     </select>
        
            
    //     <select
    //         onChange={(e) => {
    //             const selectedOption = e.target.options[e.target.selectedIndex];
    //             setSelectedProject({projectName: selectedOption.getAttribute('name'), projectID: e.target.value})

    //         }}
    //         value={selectedProject.projectName}
    //         disabled={!selectedKey}
    //     >
    //         <option value="" disabled>
    //             {selectedKey ? "Select a project" : "Select a top-level key first"}
    //         </option>
    //         { selectedKey &&
    //             payrollCB[selectedKey].map((key) => (
    //                 <option key={key.projectID} value={key.projectID} name={key.projectName}>
    //                     {key.projectName}
    //                 </option>
    //             ))
    //         }
    //     </select>
    //     <button 
    //             type='button' 
    //             onClick={modal}
    //             className='px-5 rounded-lg border-2 font-semibold'>Back</button>
    //     <button
    //             onClick={handleSubmit} 
    //             type="submit" 
    //             className={`${user?.role === '4' ? 'bg-preparerPrimary' : 'bg-fundingBlueGreen'} px-5 rounded-lg text-white`} >Save</button>
        
    // </div>
  )
}

PayrollModal.propTypes = {
    modal: PropTypes.func.isRequired
}

export default PayrollModal