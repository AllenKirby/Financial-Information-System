
import { useEffect, useState, useRef } from "react";
import { useFundingHook } from "../hooks/useFundingHook";
import { useInitialStateDV } from "../hooks/useInitialStateDV";

import PropTypes from 'prop-types'
import Swal from 'sweetalert2'

const FundingModal = ({modal, data}) => {
    const {getBurNo} =useInitialStateDV()
    const [isToggled, setIsToggled] = useState(false);
    const [operatorInput, setOperatorInput] = useState({ors: '', asa: ''})
    const {retrieveProjectName, inputOperator, isLoading, error} = useFundingHook()
    const [ASANo, setASANo] = useState({})
    const [BUR, setBUR] = useState('')
    const prevASARef = useRef();

    useEffect(() => {
        const fetch = async () => {
            const bur = await getBurNo()
            setBUR(bur)
            const parsedPorjectName = JSON.parse(sessionStorage.getItem('ProjectName'))
            if (parsedPorjectName){
                setASANo(parsedPorjectName)
            }else{
                const unsubscribe = await retrieveProjectName(setASANo)
                return () => unsubscribe()
            }
        }
        fetch()
    }, [])

    useEffect(() => {
        setOperatorInput({
            ors: data.ORSBURS,
            asa: data.ASA
        })
    }, [])

    useEffect(() => {
        if(data.ASA) {
            prevASARef.current = data.ASA;
        }
    }, [data])

    console.log(data)
    console.log('previous ASA', prevASARef.current)

    const handleSubmit = async(e) => {
        e.preventDefault()

        const DVNo = `${data.DV}|${data.fund.replace(' ', '')}`

        const fieldOfficeData = {
            date: data.date,
            DVNo: data.DV,
            BUR: data.ors,
            payee: data.payee,
            particulars: data.particular,
            amount: data.amount
        }
    
        const fundingData = {
            fundingData: operatorInput,
            fieldOfficeData: fieldOfficeData,
            previousASA: prevASARef.current
        }
        const res = await inputOperator(fundingData, DVNo)
        if(res){
            Swal.fire({
                title: "Saved",
                text: "Disbursement Voucher is successfully save!",
                icon: "success",
                confirmButtonColor: "#009933"
            });
            modal()
        } else {
            Swal.fire({
                title: "Error",
                text: {error},
                icon: "error",
                confirmButtonColor: "#009933"
            });
        }
    }

    return(
        <form onSubmit={handleSubmit} className="bg-white w-2/5 h-auto p-3 rounded-lg">
            <h1 className="px-3 text-2xl font-bold text-fundingBlueGreen">ADD ASA No and ORS/BURS</h1>
            <div className="flex items-center gap-2 mt-4">
                {/* Input Field */}
                <input
                disabled
                type="text"
                placeholder="Enter value"
                className='focus:outline-fundingBlueGreen w-full px-4 py-2 rounded-md border-2'
                value={isToggled? BUR : 'ORS/BUR Not Required?'}
                />
                
                {/* Toggle Button */}
                <button
                className={`${isToggled ? 'bg-fundingBlueGreen' : 'bg-gray-300'} relative w-20 h-10 rounded-full focus:outline-none transition-colors duration-30 ease-in-out`}
                type="button"
                onClick={() => setIsToggled(!isToggled)}
                >
                    <span
                        className={`absolute top-1/2 left-1 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full transition-transform duration-300 ease-in-out ${
                        isToggled ? 'translate-x-8' : 'translate-x-1'
                        }`}
                    ></span>
                </button>
            </div>

            <div className="px-3">
                <div className="my-2">
                    <label className="font-semibold">ASA No.</label>
                    <select    
                        className='focus:outline-fundingBlueGreen w-full px-4 py-2 rounded-md border-2'
                        onChange={(e) => {
                            
                            setOperatorInput({...operatorInput, asa: e.target.value})
                        }}
                        value={operatorInput.asa}
                        required>
                        <option value="" disabled>Select</option>
                        {Object.entries(ASANo).length > 0 ? (
                            Object.entries(ASANo).map(([key, asano]) => {
                                const finalASANO = key.replace('|', ' ')
                                return(
                                    <optgroup key={key} label={finalASANO}>
                                        {asano.map((projectName, index) => (
                                            <option key={index} value={`${key}/${projectName.projectID}`}>{projectName.projectName  }</option>
                                        ))}
                                    </optgroup>
                                )   
                            })
                        ) : (
                            <option value="" disabled>
                                No options available
                            </option>
                        )}
                    </select>
                </div>
            </div>
            <div className="flex items-center justify-end gap-3 my-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="py-2 px-5 rounded-md bg-fundingBlueGreen text-white font-bold">Save</button>
                <button 
                    onClick={modal}
                    className="py-2 px-5 rounded-md text-customFontColor font-bold"
                    >Back
                </button>
            </div>
        </form>
    )
}

FundingModal.propTypes = {
    modal: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

export default FundingModal;