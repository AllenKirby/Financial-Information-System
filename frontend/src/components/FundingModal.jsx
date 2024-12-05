
import { useEffect, useState, useRef } from "react";
import { useFundingHook } from "../hooks/useFundingHook";
import { useInitialStateDV } from "../hooks/useInitialStateDV";

import PropTypes from 'prop-types'
import Swal from 'sweetalert2'

import Loader from './Loader'

const FundingModal = ({modal, data}) => {
    const {getBurNo} = useInitialStateDV()
    const [isToggled, setIsToggled] = useState(false);
    const [operatorInput, setOperatorInput] = useState({ors: '', asa: ''})
    const {retrieveProjectName, updateASA_ORS, isLoading, error} = useFundingHook()
    const [ASANo, setASANo] = useState({})
    const [BUR, setBUR] = useState('')
    const [origBUR, setOrigBUR] = useState('')
    const [same, setSame] = useState(false)
    const prevASARef = useRef();

    const formatToPeso = (value) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(value);
    };

    useEffect(() => {
        const fetch = async () => { 
            const {bur, origBur} = await getBurNo()
            const primaryBUR = data.ORSBURS ? data.ORSBURS : bur
            console.log(bur)
            if(!data.ORSBURS && isToggled){
                setOperatorInput({...operatorInput, ors: primaryBUR})
            }
            setBUR(primaryBUR)
            setOrigBUR(origBur)
            const unsubscribe = await retrieveProjectName(setASANo)
            return () => unsubscribe()
        }
        fetch()

        
    }, [])


    useEffect(() => {
        const getData = async() => {
            setOperatorInput({
                asa: await data.ASA,
                ors: await data.ORSBURS,
            });
        }
        getData()
    }, [data])

    useEffect(() => {
        if(data.ASA) {
            prevASARef.current = data.ASA;
        }
    }, [data])

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
            data: operatorInput,
            DV: fieldOfficeData,
            previousASA: prevASARef.current,
            origBUR: origBUR
        }
        console.log(fundingData)
        
        const res = await updateASA_ORS(fundingData, DVNo)

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
            <h1 className="px-3 text-2xl font-bold text-fundingBlueGreen">Add ASA No. and ORS/BURS</h1>
            <div className="flex items-center gap-2 mt-4">
                {/* Input Field */}
                <input
                disabled
                type="text"
                placeholder={!isToggled ? 'ORS/BUR Not Required?' : ''}
                className='focus:outline-fundingBlueGreen w-full px-4 py-2 rounded-md border-2'
                value={data.ORSBURS ? data.ORSBURS: isToggled ? BUR : ''}
                />
                
                {/* Toggle Button */}
                <button
                disabled={data.ORSBURS ? true : false}
                className={`${isToggled ? 'bg-fundingBlueGreen' : 'bg-gray-300'} relative w-20 h-10 rounded-full focus:outline-none transition-colors duration-30 ease-in-out`}
                type="button"
                onClick={() => {
                    const value = !isToggled ? BUR : ''
                    setOperatorInput({...operatorInput, ors: value})
                    setIsToggled(!isToggled)
                }}
                >
                    <span
                        className={`absolute top-1/2 left-1 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full transition-transform duration-300 ease-in-out ${
                        isToggled ? 'translate-x-8' : 'translate-x-1'
                        }`}
                    ></span>
                </button>
            </div>
            <h1 className="px-3 py-4 text-2xl font-bold text-fundingBlueGreen"> Amount: {formatToPeso(data.amount)}</h1>
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
                                // console.log(ASANo)
                                const finalASANO = key.replace('|', ' ')
                                return(
                                    <optgroup key={key} label={finalASANO}>
                                        {asano.map((project, index) => (
                                            <option disabled={data.amount > project.RO} key={index} value={`${key}/${project.projectID}`}>{project.projectName} : {project.RO ? formatToPeso(project.RO) : null}</option>
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
                    className="py-2 px-5 rounded-md bg-fundingBlueGreen text-white font-bold">{isLoading ? <Loader/>: 'Save'}</button>
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