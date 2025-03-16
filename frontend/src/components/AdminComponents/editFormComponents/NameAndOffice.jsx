import { IoAdd } from "react-icons/io5";
import { MdOutlineEdit, MdRemove } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";

import { useEffect, useState } from "react";
import { useApproverHook } from "../../../hooks/useApproverHook";
import { useAuthContext } from '../../../hooks/useAuthContext'
import LargeLoader from '../../Loaders/LargeLoader'

export const NameAndOffice = () => {
    const { user } = useAuthContext()
    const [showInpuTBoxA, setShowInputBoxA] = useState(false);
    const [name, setName] = useState('');
    const [office, setOffice] = useState('');
    const [entries, setEntries] = useState({});
    const {addNewNameAndOffice, getNameAndOffice, deleteNameAndOffice, updateNameOffice, isLoading} = useApproverHook()
    const [updateFlag, setUpdateFlag] = useState(false)
    const [key, setKey] = useState('')

    useEffect(() => {
        if(!updateFlag) {
            setName("")
            setOffice("")
        }
    }, [showInpuTBoxA])

    const handleAddNameOffice = (flag, name = '', office = '', key = '') => {
        if(flag) { 
            setName(name)
            setOffice(office)
            setKey(key)
            setUpdateFlag(true)
        } else {
            setUpdateFlag(false)
        }
        setShowInputBoxA(!showInpuTBoxA);
    }

    const handleInputChangeName = (e) => {
        setName(e.target.value);
    };
    
    const handleInputChangeOffice = (e) => {
        setOffice(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const input = name+office
        const randomKey = input.replace(/[^a-zA-Z0-9]/g, "");
        setEntries((prev) => {
            const newObj = {...prev}
            newObj[randomKey] = {name, office}
            return newObj
        })
        setName('');
        setOffice('');
        await addNewNameAndOffice(name, office, randomKey)
        setShowInputBoxA(false)
        sessionStorage.removeItem('NameAndOfficeData')
    };

    const handleUpdate = async (e) => {
        e.preventDefault()
        await updateNameOffice(key, name, office)
        setName('');
        setOffice('');
        setUpdateFlag(false)
        setShowInputBoxA(false)
        setEntries((prev) => {
            const newObj = {...prev}
            newObj[key] = {name, office}
            return newObj
        })
        sessionStorage.removeItem('NameAndOfficeData')
    }

    const handleRemoveEntry = (keyToRemove) => {
        const deleting = async () => {
             deleteNameAndOffice(keyToRemove)
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
        <div className="w-full h-auto flex flex-col rounded-lg">
            <div className="w-full h-auto flex items-center justify-between px-2 py-1 rounded-lg bg-gray-200 text-gray-500">
                <h1 className='hidden sm:block w-5/12 text-sm text-left font-bold px-2'>Name</h1>
                <h1 className='hidden sm:block w-5/12 text-sm text-center font-bold px-2'>Office</h1>
                <div className="w-2/12 flex justify-center items-center">
                    <button 
                        className='text-2xl rounded-full'
                        onClick={() => handleAddNameOffice(false)}>{showInpuTBoxA ? <IoIosClose />: <IoAdd/>}</button>
                </div>
            </div>
            {showInpuTBoxA && (
                <form onSubmit={updateFlag ? handleUpdate : handleSubmit} className="px-2 py-2 bg-gray-100 flex gap-1">
                    <input
                        type="text"
                        value={name}
                        required
                        onChange={handleInputChangeName}
                        placeholder="e.g. Juan Dela Cruz"
                        className={`${user?.role === '1' ? 'outline-customgreen' : 'outline-BOGreen'} border border-gray-300 p-2 rounded-lg w-4/5`}
                    />
                    <input
                        type="text"
                        value={office}
                        required
                        onChange={handleInputChangeOffice}
                        placeholder="e.g. Division Manager A, AFD"
                        className={`${user?.role === '1' ? 'outline-customgreen' : 'outline-BOGreen'} border border-gray-300 p-2 rounded-lg w-4/5`}
                    />
                    <button
                        type="submit"
                        className={`${user?.role === '1' ? 'bg-customgreen' : 'bg-BOGreen'} w-1/5 h-auto text-white rounded-lg flex items-center justify-center`}
                    >
                        <FaCheck size={15} />
                    </button>
                </form>
            )}
            <div className="flex-1 overflow-y-auto">
                {Object.entries(entries).map(([key, entry], index) => (
                    <div key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} w-full h-auto rounded-lg px-4 py-2 flex flex-col sm:flex-row`}>
                        <p className="w-full sm:w-5/12 flex justify-start">{entry.name}</p>
                        <p className="w-full sm:w-5/12 flex justify-start sm:justify-center">{entry.office}</p>
                        <div className="w-full sm:w-2/12 flex justify-start sm:justify-center">
                            <button 
                                onClick={() => handleAddNameOffice(true, entry.name, entry.office, key)}
                                className="px-1 py-1 rounded-full"
                            >
                                <MdOutlineEdit />
                            </button>
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
            {isLoading && (
                <LargeLoader/>
            )}
        </div>
    )
}
