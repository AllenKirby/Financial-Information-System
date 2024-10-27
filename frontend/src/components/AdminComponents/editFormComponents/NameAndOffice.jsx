import { IoAdd } from "react-icons/io5";
import { MdRemove } from "react-icons/md";

import { useEffect, useState } from "react";
import { useApproverHook } from "../../../hooks/useApproverHook";

export const NameAndOffice = () => {

    const [showInpuTBoxA, setShowInputBoxA] = useState(false);
    const [name, setName] = useState('');
    const [office, setOffice] = useState('');
    const [entries, setEntries] = useState({});
    const {addNewNameAndOffice, getNameAndOffice, deleteNameAndOffice} = useApproverHook()

    const handleAddNameOffice = () => {
        setShowInputBoxA(!showInpuTBoxA);
    }

    const handleInputChangeName = (e) => {
        setName(e.target.value);
    };
    
    const handleInputChangeOffice = (e) => {
        setOffice(e.target.value);
    };

    const handleSubmit = () => {
        
        if (name && office) {
            const input = name+office
            const randomKey = input.replace(/[^a-zA-Z0-9]/g, "");
            setEntries((prev) => {
                const newObj = {...prev}
                newObj[randomKey] = {name, office}
                return newObj
            })
            setName('');
            setOffice('');
            addNewNameAndOffice(name, office, randomKey)
            setShowInputBoxA(false)
            sessionStorage.removeItem('NameAndOfficeData')
        } else {
            alert("Both Name and Office must be filled.");
        }

    };

    const handleRemoveEntry = (keyToRemove) => {
        const deleting = async () => {
            const res_bool = await deleteNameAndOffice(keyToRemove)
            console.log('deleted?', res_bool)
            setEntries((prevEntries) => {
                const newEntries = { ...prevEntries };
                delete newEntries[keyToRemove];
                return newEntries;
            });
            sessionStorage.removeItem('NameAndOfficeData')
        }
        deleting()
    };

    useEffect(() => {
        const gettingData = async () => {

            const nameOfficeData = sessionStorage.getItem('NameAndOfficeData')

            if(!nameOfficeData){
                const nameAndOffice = await getNameAndOffice()
                addObjectToEntries(nameAndOffice)
            }else{
                const parsedNameOffice = JSON.parse(nameOfficeData);
                addObjectToEntries(parsedNameOffice)
            }
            
        }
        gettingData()
    }, [])

    const addObjectToEntries = (dataObject) => {
        const updatedEntries = Object.entries(dataObject).reduce((acc, [key, value]) => {
            acc[key] = { name: value[0], office: value[1] };
            return acc
        }, {})

        setEntries(prevEntries => ({
            ...prevEntries,
            ...updatedEntries
        }));
      };

    return (
        <div className="w-4/5 h-72">
            <div className="w-full h-full rounded-lg bg-white border-[1px]">
                <div className='w-full h-auto flex px-2 py-2 rounded-t-lg bg-customgreen text-white'>
                    <h1 className='w-2/5 text-center font-bold px-2'>Name</h1>
                    <h1 className='w-2/5 text-center font-bold'>Office</h1>
                    <div className="w-1/5 flex justify-center items-center">
                        <button 
                            className='bg-customgreen text-white text-2xl rounded-full hover:bg-white hover:text-customgreen'
                            onClick={handleAddNameOffice}><IoAdd/></button>
                    </div>
                </div>
                {showInpuTBoxA && (
                    <div className="px-2 py-2 bg-gray-200 flex gap-1">
                        <input
                            type="text"
                            value={name}
                            onChange={handleInputChangeName}
                            placeholder="e.g. Juan Dela Cruz"
                            className="border border-gray-300 p-2 rounded w-2/5"
                        />
                        <input
                            type="text"
                            value={office}
                            onChange={handleInputChangeOffice}
                            placeholder="e.g. Division Manager A, AFD"
                            className="border border-gray-300 p-2 rounded w-2/5"
                        />
                        <button
                            onClick={handleSubmit}
                            className="w-1/5 bg-adminBlue text-white rounded"
                        >
                            Submit
                        </button>
                    </div>
                )}
                <div className="h-88 overflow-y-auto">
                    {Object.entries(entries).map(([key, entry]) => (
                        <div key={key} className="flex border p-2 my-1 rounded-md">
                            <p className="w-2/5 flex justify-center">{entry.name}</p>
                            <p className="w-2/5 flex justify-center">{entry.office}</p>
                            <div className="w-1/5 flex justify-center">
                                <button
                                    className="text-red-500 w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-500 hover:text-white"
                                    onClick={() => handleRemoveEntry(key)}
                                >
                                    <MdRemove/>
                                </button>
                            </div>
                        </div>
                    ))}
                    
                </div>
                
            </div>
        </div>
    )
}
