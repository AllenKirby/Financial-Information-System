
import { useEffect, useState, useRef } from "react";
import { useFundingHook } from "../hooks/useFundingHook";
import { useAuthContext } from "../hooks/useAuthContext"
import { useInitialStateDV } from "../hooks/useInitialStateDV";

import PropTypes from 'prop-types'
import Swal from 'sweetalert2'
import { MdRemove } from "react-icons/md";

import LargeLoader from './LargeLoader'

const FundingModal = ({modal, data}) => {
    const {getBurNo} = useInitialStateDV()
    const [isToggled, setIsToggled] = useState(false);
    const [operatorInput, setOperatorInput] = useState({ors: '', asa: ''})
    const {retrieveProjectName, updateASA_ORS, isLoading, error} = useFundingHook()
    const [ASANo, setASANo] = useState({})
    const [BUR, setBUR] = useState('')
    const [origBUR, setOrigBUR] = useState('')
    //const [same, setSame] = useState(false)
    const prevASARef = useRef();

    const { user } = useAuthContext()

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

    const handleRemove_ASA = () => {
        setOperatorInput({...operatorInput, asa: ''})
    }

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
            origBUR: origBUR,
            controlBooks: CBAmount
        }
        console.log(fundingData)
        console.log(fieldOfficeData)
        console.log('hiyhiy')
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

    const [balances, setBalances] = useState({})
    const [addControlBook, setAddControlBook] = useState(false)
    const [budget, setBudget] = useState(0)
    const [CBAmount, setCBAmount] = useState({})
    const enoughBalance = (totalAmount, balance, key) => {
        const totalBalance = balances.length === 0 ? 0 : Object.values(balances).reduce((val, item) => val + parseFloat(item), 0)
        const enough = totalAmount >= totalBalance
        if(enough){
            console.log(`balances: ${totalBalance} amount: ${totalAmount}`)
            setBalances({...balances, [key]: balance})
            setAddControlBook(true)
        }
    }

    useEffect(() => {
        console.log(operatorInput)

    }, [operatorInput])

    const handleChangeBoxAmount = (checked, key, projectID, amount) => {
        const projectKey = `${key}/${projectID}`;
       
        //FOR NEXT UPDATE
        setASANo((prevState) => {
            const updatedState = { ...prevState };
            const projectIndex = updatedState[key]?.findIndex((proj) => proj.projectID === projectID);
    
            if (projectIndex !== -1) {
                const currentRO = parseFloat(updatedState[key][projectIndex].RO || 0);
                if (checked) {
                    updatedState[key][projectIndex].RO = Math.max(0, currentRO - parseFloat(data.amount)); //fix this
                } else {
                    updatedState[key][projectIndex].RO = currentRO + parseFloat(data.amount); //fix this
                }
            }
    
            return updatedState;
        });

        if (checked) {
            const exactAmount = parseFloat(data.amount) < amount + budget ? amount - (amount + budget - parseFloat(data.amount)) : amount;
            console.log(exactAmount)
            setOperatorInput((prev) => ({...prev,
                asa: {...(prev.asa || {}),[`${key}/${projectID}`]: exactAmount},
            }));
    
            setCBAmount((prev) => ({...prev,[key]: (prev[key] || 0) + exactAmount}));
            setBudget((prev) => prev + amount)
        } else {
            setOperatorInput((prev) => {
                const updatedAsa = { ...(prev.asa || {}) };
                delete updatedAsa[`${key}/${projectID}`]; // Remove the projID key
                return {
                    ...prev,
                    asa: updatedAsa,
                };
            });
    
            setCBAmount((prev) => ({...prev,[key]: (prev[key] || 0) - amount}));
            setBudget((prev) => prev - amount < 0 ? 0 : prev - amount)
        }

    }
    return(
        <form onSubmit={handleSubmit} className="bg-white w-2/6 h-auto p-3 rounded-lg text-gray-500">
            <h1 className="px-3 my-2 text-2xl font-bold text-fundingBlueGreen">Add ASA No. and ORS/BURS</h1>
            <div className="w-full h-auto px-3">
                <label className="font-semibold">ORS/BURS</label>
                <div className="flex items-center gap-2">
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
            </div>
            <h1 className="px-3 py-2 text-lg font-bold text-fundingBlueGreen"> Amount: {formatToPeso(data.amount)}</h1>
            <div className="px-3">
                <div>
                    <label className="font-semibold">ASA No.</label>
                    <p>Budget:{formatToPeso(budget > parseFloat(data.amount) ? data.amount : budget)}</p>
                    <div className="flex flex-col items-center justify-center w-full">
                        
                    {Object.entries(ASANo).length > 0 ? (
                            Object.entries(ASANo).map(([key, asano]) => {
                                const finalASANO = key.replace('|', ' ');
                                return (
                                    <div key={key} className="border-b pb-2">
                                        <h4 className="font-semibold text-lg mb-2">
                                            {finalASANO}
                                        </h4>
                                        <div className="space-y-1">
                                            {asano.map((project, index) => (
                                                <label key={index} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        value={`${key}/${project.projectID}`}
                                                        onChange={(e) => {
                                                            const isChecked = e.target.checked;
                                                            const projID = e.target.value;
                                                            const amount = parseFloat(
                                                                project.RO || 0
                                                            );
                                                            handleChangeBoxAmount(isChecked,key, project.projectID, amount)

                                                            // if (isChecked) {
                                                            //     // Add the selected project
                                                            //     const exactAmount = parseFloat(data.amount) < (amount + budget) ? amount - ((amount + budget) - parseFloat(data.amount)) : amount
                                                            //     setOperatorInput((prev) => ({...prev, asa: {...(prev.asa || {}), [projID]: exactAmount}}));
                                                            //     // setBudget((prev) => prev += amount)
                                                            //     setCBAmount((prev) => ({...prev, [key]: (prev[key] || 0) + exactAmount}))
                                                                
                                                                
                                                            // } else {
                                                            //     // Remove the unselected project
                                                            //     setOperatorInput((prev) => {
                                                            //         const updatedAsa = { ...(prev.asa || {}) };
                                                            //         delete updatedAsa[projID]; // Remove the projID key
                                                            //         return {
                                                            //             ...prev,
                                                            //             asa: updatedAsa,
                                                            //         };
                                                            //     });
                                                            //     // setBudget((prev) => prev -= amount)
                                                            //     setCBAmount((prev) => ({...prev, [key]: (prev[key] || 0) - amount}))
                                                            // }
                                                        }}
                                                        checked={Boolean(operatorInput.asa?.[`${key}/${project.projectID}`])}
                                                        disabled={
                                                            !Boolean(operatorInput.asa?.[`${key}/${project.projectID}`]) && 
                                                            Object.values(operatorInput.asa || {}).reduce((val, item) => val + item, 0) >= parseFloat(data.amount)
                                                        }
                                                    />
                                                    <span>
                                                        {project.projectName} :{' '}
                                                        {project.RO ? formatToPeso(project.RO) : formatToPeso(0)}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>No options available</p>
                        )}
                        
                        {/* <button
                        onClick={handleRemove_ASA}
                            type="button" 
                            className="w-1/5 flex justify-center items-center bg-red-500 rounded ml-1 py-1">
                            <MdRemove className="text-3xl text-white"/>
                        </button> */}
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-end gap-3 my-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`py-2 px-5 rounded-lg border-2 text-white font-semibold transition-all duration-150 ${user?.role === '3' ? 'bg-fundingBlueGreen border-fundingBlueGreen hover:bg-white hover:text-fundingBlueGreen' : 'bg-preparerPrimary'}`}>Save</button>
                <button 
                    onClick={modal}
                    className="py-2 px-5 rounded-lg font-semibold border-2 hover:bg-gray-200 transition-all duration-150"
                    >Back
                </button>
            </div>
            {isLoading && (
                <LargeLoader/>
            )}
        </form>
    )
}

FundingModal.propTypes = {
    modal: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

export default FundingModal;