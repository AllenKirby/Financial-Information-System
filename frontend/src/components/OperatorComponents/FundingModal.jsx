
import { useEffect, useState, useRef } from "react";
import { useFundingHook } from "../../hooks/useFundingHook";
import { useAuthContext } from "../../hooks/useAuthContext"
import { useInitialStateDV } from "../../hooks/useInitialStateDV";

import PropTypes from 'prop-types'
import Swal from 'sweetalert2'

import LargeLoader from '../Loaders/LargeLoader'

const FundingModal = ({modal, data, fundCluster}) => {
    const {getBurNo} = useInitialStateDV()
    const [isToggled, setIsToggled] = useState(false);
    const [operatorInput, setOperatorInput] = useState({ors: '', asa: ''})
    const {retrieveProjectName, updateASA_ORS,updateCASH, isLoading, error} = useFundingHook()
    const [ASANo, setASANo] = useState({})
    const [BUR, setBUR] = useState('')
    const [origBUR, setOrigBUR] = useState('')
    const [selectedASANo, setSelectedASANo] = useState('')
    const [filterDocuments, setFilteredDocuments]= useState({})
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
            const {bur, origBur} = await getBurNo(fundCluster)
            const primaryBUR = data.ORSBURS ? data.ORSBURS : bur
            if(!data.ORSBURS && isToggled){
                setOperatorInput({...operatorInput, ors: primaryBUR})
            }
            setBUR(primaryBUR)
            setOrigBUR(origBur)
            const unsubscribe = await retrieveProjectName(setASANo)

            if(Boolean(data)){
                getPrevBudget()
                await getData()
            }

            return () => unsubscribe()
        }
        fetch()
        
    }, [])

    const getData = async() => {
        setOperatorInput({
            asa: await data.ASA,
            ors: await data.ORSBURS,
        });
    }

    const[needUpdate, setNeedUpdate] = useState(false)
    useEffect(() => {
        
        if(data.ASA) {
            prevASARef.current = data.ASA;
            setNeedUpdate(true)
        }
    }, [data])

    // const handleRemove_ASA = () => {
    //     setOperatorInput({...operatorInput, asa: ''})
    // }

    const handleSubmit = async(e) => {
        e.preventDefault()

        const DVNo = `${data.DV}|${data.fund.replace(' ', '')}`

        const fieldOfficeData = {
            date: data.date,
            DVNo: data.DV,
            BUR: data.ORSBURS,
            payee: data.payee,
            particulars: data.particular,
            amount: data.amount
        }

        const fundingData = {
            data: operatorInput,
            DV: fieldOfficeData,
            previousASA: prevASARef.current,
            origBUR: origBUR,
            // controlBooks: CBAmount,
            update: needUpdate,
            fund: data.fund
        }
        const neededAmount = parseFloat(data.amount)
        let res = true;
        if(isToggled){
            if(data.activeTab === 'Others'){
                res = await updateASA_ORS(fundingData, DVNo)
            }else{
                res = neededAmount != budget ? false : await updateASA_ORS(fundingData, DVNo)
            }
            
        }else{
            if(data.activeTab === 'Others'){
                await updateCASH(fundingData, DVNo)
            }else{
                res = neededAmount != budget ? false : await updateCASH(fundingData, DVNo)
            }
        }
        
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
    const [, setAddControlBook] = useState(false)
    const [budget, setBudget] = useState(0)
    const [CBAmount, setCBAmount] = useState({})
    const enoughBalance = (totalAmount, balance, key) => {
        const totalBalance = balances.length === 0 ? 0 : Object.values(balances).reduce((val, item) => val + parseFloat(item), 0)
        const enough = totalAmount >= totalBalance
        if(enough){
            setBalances({...balances, [key]: balance})
            setAddControlBook(true)
        }
    }

    const getPrevBudget = () => {
        const newBudget = data.ASA ? Object.values(data.ASA).reduce((acc, val) => acc + val, 0) : 0
        setBudget(newBudget)
    }


    

    //this function works for new ASA
    const handleChangeBoxAmount = (checked, key, projectID, amount, projectName) => {
        const exactAmount = parseFloat(data.amount) < amount + budget ? amount - (amount + budget - parseFloat(data.amount)) : amount;
        if (checked) {

            if(exactAmount <= 0){
                return
            }

            setOperatorInput((prev) => ({...prev,
                asa: {...(prev.asa || {}),[`${key}/${projectID}`]: exactAmount},
            }));
    
            setCBAmount((prev) => ({...prev,[key]: (prev[key] || 0) + exactAmount}));
            setBudget((prev) => prev + exactAmount)

            setASANo((prev) => {
                
                return{
                    ...prev,[key] : {
                        ...prev[key], [projectID] : {
                            ...prev[key][projectID], RO: parseFloat(prev[key][projectID].RO) - exactAmount
                        }
                    }
                }
            })

        } else {
            // const prevAmount = parseFloat(operatorInput?.asa[`${key}/${projectID}`] || 0)
            let unselectedAmount
            setOperatorInput((prev) => {
                const updatedAsa = { ...(prev.asa || {}) };
                unselectedAmount = parseFloat(updatedAsa[`${key}/${projectID}`])
                delete updatedAsa[`${key}/${projectID}`]; // Remove the projID key
                return {
                    ...prev,
                    asa: updatedAsa,
                };
            });
            setCBAmount((prev) => ({...prev,[key]: (prev[key] || 0) - amount}));
            setBudget((prev) => {
                const prevAmount = operatorInput?.asa[`${key}/${projectID}`] ? parseFloat(operatorInput?.asa[`${key}/${projectID}`] || 0) : amount
             
                if(Boolean(operatorInput?.asa[`${key}/${projectID}`])){
                    console.log(parseFloat(operatorInput?.asa[`${key}/${projectID}`] || 0))
                }else{
                    console.log(amount)
                }
                const newAmount = prev - prevAmount < 0 ? 0  : prev - prevAmount
                return newAmount
            })

            //FOR INTEREACTIVITY DIFFERENCE
            setASANo((prev) => {
                const prevAmount = operatorInput?.asa[`${key}/${projectID}`] ? parseFloat(operatorInput?.asa[`${key}/${projectID}`] || 0) : amount
              
                return{
                    ...prev,[key] : {
                        ...prev[key], [projectID] : {
                            ...prev[key][projectID], RO: prev[key][projectID].RO + prevAmount
                        }
                    }
                }
            })
        }
    }

    const handlechange = (checked, ) => {
        if(checked){
            setOperatorInput((prev) => ({...prev,
                asa: {...(prev.asa || {}),[`${key}/${projectID}`]: exactAmount},
            }));
        }else{

        }
    }

    //pending
    const handleChangeBoxAmountCASH = (checked, key, projectID, amount, projectName) => {
        // const exactAmount = parseFloat(data.amount) < amount + budget ? amount - (amount + budget - parseFloat(data.amount)) : amount;
        const exactAmount = amount - (amount + budget - parseFloat(data.amount))
        if (checked) {

            if(exactAmount <= 0){
                return
            }

            setOperatorInput((prev) => ({...prev,
                asa: {...(prev.asa || {}),[`${key}/${projectID}`]: exactAmount},
            }));
    
            setCBAmount((prev) => ({...prev,[key]: (prev[key] || 0) + exactAmount}));
            setBudget((prev) => prev + exactAmount)

            setASANo((prev) => {
                
                return{
                    ...prev,[key] : {
                        ...prev[key], [projectID] : {
                            ...prev[key][projectID], cash: parseFloat(prev[key][projectID].cash) - exactAmount
                        }
                    }
                }
            })

        } else {
            // const prevAmount = parseFloat(operatorInput?.asa[`${key}/${projectID}`] || 0)
            let unselectedAmount
            setOperatorInput((prev) => {
                const updatedAsa = { ...(prev.asa || {}) };
                unselectedAmount = parseFloat(updatedAsa[`${key}/${projectID}`])
                delete updatedAsa[`${key}/${projectID}`]; // Remove the projID key
                return {
                    ...prev,
                    asa: updatedAsa,
                };
            });
            setCBAmount((prev) => ({...prev,[key]: (prev[key] || 0) - amount}));
            setBudget((prev) => {
                const prevAmount = operatorInput?.asa[`${key}/${projectID}`] ? parseFloat(operatorInput?.asa[`${key}/${projectID}`] || 0) : amount
             
                if(Boolean(operatorInput?.asa[`${key}/${projectID}`])){
                    console.log(parseFloat(operatorInput?.asa[`${key}/${projectID}`] || 0))
                }else{
                    console.log(amount)
                }
                const newAmount = prev - prevAmount < 0 ? 0  : prev - prevAmount
                return newAmount
            })

            //FOR INTEREACTIVITY DIFFERENCE
            setASANo((prev) => {
                const prevAmount = operatorInput?.asa[`${key}/${projectID}`] ? parseFloat(operatorInput?.asa[`${key}/${projectID}`] || 0) : amount
              
                return{
                    ...prev,[key] : {
                        ...prev[key], [projectID] : {
                            ...prev[key][projectID], cash: prev[key][projectID].cash + prevAmount
                        }
                    }
                }
            })
        }
    }


    const filterFundCluster = (controlBook) => {
        if(controlBook && Object.entries(controlBook).length > 0) {
            return Object.fromEntries(Object.entries(controlBook).filter(([ASA,]) => 
                ASA.split("!")[1] === fundCluster
            ))
        } else {
            return {}
        }
    }

    const filterSelectedASA = (controlBook) => {
        if(controlBook && Object.entries(controlBook).length > 0) {
            if(selectedASANo) {
                return Object.fromEntries(Object.entries(controlBook).filter(([ASA,]) => 
                    ASA === selectedASANo
                ))
            } else {
                return controlBook
            }
        } else {
            return {}
        }
    }

    // const handleUpdateChangeBoxAmount = (checked) => {

    //     if(checked){
    //         setOperatorInput((prev) => ({...prev,
    //             asa: {...(prev.asa || {}),[`${key}/${projectID}`]: exactAmount},
    //         }));
    //     }else{
    //         setOperatorInput((prev) => {
    //             const updatedAsa = { ...(prev.asa || {}) };
    //             delete updatedAsa[`${key}/${projectID}`]; // Remove the projID key
    //             return {
    //                 ...prev,
    //                 asa: updatedAsa,
    //             };
    //         });
    //     }
    // }

    useEffect(() => {
        if(data.ORSBURS){
            setIsToggled(true)
        }
    }, [])

    useEffect(() => {
        setOperatorInput({...operatorInput, asa: ''})
        setBudget(0)
    }, [isToggled])

    return(
        <form onSubmit={handleSubmit} className="bg-white w-full sm:w-2/6 h-4/5 p-3 rounded-lg flex flex-col text-gray-500">
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
                    disabled={needUpdate}
                    className={`${isToggled ? 'bg-fundingBlueGreen' : 'bg-gray-300'} relative w-20 h-10 rounded-full focus:outline-none transition-colors duration-30 ease-in-out`}
                    type="button"
                    onClick={() => {
                        // const value = !isToggled ? BUR : ''
                        const value = BUR
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
            <div className="flex-1 overflow-y-auto mt-2">
                <div className="w-full h-full flex flex-col px-3">
                    <div className="w-full h-auto flex items-center justify-between">
                        <label className="font-semibold">ASA No.</label>
                        <p className={`${user.role === '3' ? 'text-fundingBlueGreen' : 'text-preparerPrimary'} font-bold`}>Budget:{formatToPeso(budget > parseFloat(data.amount) ? data.amount : budget)}</p>
                    </div>

                    <div className="flex-1 overflow-y-auto gap-2 p-2 w-full">
                        {
                            Object.entries(filterFundCluster(ASANo)).length > 0 && isToggled ? (
                                Object.entries(filterFundCluster(ASANo)).map(([key, asano]) => {
                                    const finalASANO = key.replace('|', ' ').split('!')[0];
                                    return (
                                        <div key={key} className="w-full h-auto border-b pb-2">
                                            <h4 className="font-semibold text-lg mb-2">
                                                {finalASANO}
                                            </h4>
                                            <div className="flex flex-wrap items-center justify-start gap-2">
                                                {Object.entries(asano).map(([projectID, project]) => (
                                                    <label key={projectID} className="peer flex items-center gap-2">
                                                        <input
                                                            name="utilized"
                                                            type="checkbox"
                                                            // required
                                                            value={projectID}
                                                            className="peer hidden"
                                                            onChange={(e) => {
                                                                const isChecked = e.target.checked;
                                                                const projID = e.target.value;
                                                                const amount = parseFloat(
                                                                    project.RO || 0
                                                                );
                                                                handleChangeBoxAmount(isChecked,key, projID, amount, project.projectName)
    
                                                                
                                                            }}
                                                            checked={Boolean(operatorInput.asa?.[`${key}/${projectID}`])}
                                                            disabled={
                                                                !Boolean(operatorInput.asa?.[`${key}/${projectID}`]) && 
                                                                Object.values(operatorInput.asa || {}).reduce((val, item) => val + item, 0) >= parseFloat(data.amount)
                                                            }
                                                            
                                                        />
                                                        <span className="cursor-pointer border-2 px-5 py-1 flex items-center justify-center gap-2 rounded-full peer-checked:border-fundingBlueGreen peer-checked:bg-fundingBlueGreen peer-checked:text-white hover:text-fundingBlueGreen hover:border-fundingBlueGreen hover:shadow-lg transition-all duration-150">
                                                            {/* .match(/,([^,>]+)>/)?.[1] || "N/A" */}
                                                            <span className="font-medium">{projectID.split(",")[1]?.split(">")[0] || "N/A"}</span>
                                                            {project.tabStatus && (
                                                                <span className="text-sm bg-teal-700 rounded text-white px-2">{project.tabStatus}</span>
                                                            )}
                                                            <span>:</span>
                                                            <span className="font-semibold">
                                                                {project.RO ? formatToPeso(project.RO) : formatToPeso(0)}
                                                            </span>
                                                            
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                Object.entries(filterFundCluster(ASANo)).map(([key, asano]) => {
                                    const finalASANO = key.replace('|', ' ').split('!')[0];
                                    return (
                                        <div key={key} className="w-full h-auto border-b pb-2">
                                            <h4 className="font-semibold text-lg mb-2">
                                                {finalASANO}
                                            </h4>
                                            <div className="flex flex-wrap items-center justify-start gap-2">
                                                {Object.entries(asano).map(([projectID, project]) => (
                                                    <label key={projectID} className="peer flex items-center gap-2">
                                                        <input
                                                            name="disbursed"
                                                            type="checkbox"
                                                            // required
                                                            value={projectID}
                                                            className="peer hidden"
                                                            onChange={(e) => {
                                                                const isChecked = e.target.checked;
                                                                const projID = e.target.value;
                                                                const amount = parseFloat(
                                                                    project.cash || 0
                                                                );
                                                                handleChangeBoxAmountCASH(isChecked,key, projID, amount, project.projectName)
                                                            }}
                                                            checked={Boolean(operatorInput.asa?.[`${key}/${projectID}`])}
                                                            disabled={
                                                                // !Boolean(operatorInput.asa?.[`${key}/${projectID}`])
                                                                false
                                                            }
                                                            
                                                        />
                                                        <span className="cursor-pointer border-2 px-5 py-1 flex items-center justify-center gap-2 rounded-full peer-checked:border-fundingBlueGreen peer-checked:bg-fundingBlueGreen peer-checked:text-white hover:text-fundingBlueGreen hover:border-fundingBlueGreen hover:shadow-lg transition-all duration-150">
                                                            {/* .match(/,([^,>]+)>/)?.[1] || "N/A" */}
                                                            <span className="font-medium">{projectID.split(",")[1]?.split(">")[0] || "N/A"}</span>
                                                            {project.tabStatus && (
                                                                <span className="text-sm bg-teal-700 rounded text-white px-2">{project.tabStatus}</span>
                                                            )}
                                                            {/* <span>:</span>
                                                            <span className="font-semibold">
                                                                {project.cash ? formatToPeso(project.cash) : formatToPeso(0)}
                                                            </span> */}
                                                            
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })
                            )
                        }
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-end gap-3 my-2">
                <button 
                    onClick={modal}
                    className="py-2 px-5 rounded-lg font-semibold border-2 hover:bg-gray-200 transition-all duration-150"
                    >Back
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`py-2 px-5 rounded-lg border-2 text-white font-semibold transition-all duration-150 ${user?.role === '3' ? 'bg-fundingBlueGreen border-fundingBlueGreen hover:bg-white hover:text-fundingBlueGreen' : 'bg-preparerPrimary'}`}>Save</button>
            </div>
            {isLoading && (
                <LargeLoader/>
            )}
        </form>
    )
}

FundingModal.propTypes = {
    modal: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    fundCluster: PropTypes.string.isRequired
}

export default FundingModal;