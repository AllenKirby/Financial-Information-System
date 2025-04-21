import { useAuthContext } from '../../hooks/useAuthContext'
import { useState, useEffect } from 'react'
import { useFundingHook } from '../../hooks/useFundingHook'

import Swal from 'sweetalert2'

import LargeLoader from '../Loaders/LargeLoader'

const AddTab = (props) => {
    const {modal, ASANo, currTabs, remainingASA} = props
    const { user } = useAuthContext()
    const {addingTab, isLoading, error} = useFundingHook()

    const [tabs, setTabs] = useState([{title: "", amount: 0}])
    const [tabsAmount, setTabsAmount] = useState(0)

    useEffect(() => {
        if(currTabs){
            setTabs(currTabs)
        }
    }, [currTabs])

    const sumAmountTabs = (currTabs) => {
        const totalAmount = currTabs.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        if(totalAmount > parseFloat(remainingASA)){
            return true
        }
        return false

    }



    const handleInputChange = (index, key, value) => {
        // setTabs((prevTab) => 
        //     prevTab.map((tab, i) =>{
        //         return i === index ? {...tab, [key]: value} : tab 
        //     })
        // )
        if (value === "") {
            setTabs(prev => 
                prev.map((tab, i) => i === index ? { ...tab, [key]: "" } : tab)
            );
            return;
        }
        if (key === "amount") {
            const numericValue = value.replace(/,/g, "");
            if (!isNaN(numericValue)) {
                setTabs(prevTab =>
                    prevTab.map((tab, i) =>
                        i === index ? { ...tab, [key]: numericValue } : tab
                    )
                );
            }
        } else {
            setTabs(prevTab =>
                prevTab.map((tab, i) =>
                    i === index ? { ...tab, [key]: value } : tab
                )
            );
        }
    }

    const formatNumberWithCommas = (value) => {
        if (!value) return "";
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const addRow = (index) => {
        if(index < tabs.length - 1){
            //deleting
            setTabs((prevTabs) => {
                const copy = [...prevTabs]
                copy.splice(index, 1)
                return copy
            })
        }else{
            setTabs((prevTabs) => [...prevTabs, {title: "", amount: 0}])
        } 
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const larger = sumAmountTabs(tabs)
        if(larger){
            Swal.fire({
                title: "Error",
                text: `Amount is too large!`,
                icon: "error",
                confirmButtonColor: "#009933"
            });
        }else{
            const res = await addingTab(tabs, ASANo)
            if(res) {
                Swal.fire({
                    title: "Saved",
                    text: `Added New Tab/s successfully!`,
                    icon: "success",
                    confirmButtonColor: "#009933"
                    });
                modal()
            } else {
                Swal.fire({
                    title: "Error",
                    text: `${error}`,
                    icon: "error",
                    confirmButtonColor: "#009933"
                });
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit} 
            className="w-full md:w-2/4 lg:w-1/4 h-auto bg-white p-3 rounded-lg">
            <h1 className='text-fundingBlueGreen px-3 text-2xl font-semibold'>Add Category</h1>
            {
                tabs.map((tab, index) => (
                    <div key={index} className='w-full h-auto p-3 flex gap-2'>
                            <input
                                required
                                onChange={(e) => handleInputChange(index, "title", e.target.value)}
                                value={tab.title}
                                placeholder='Title'
                                className='w-2/5 px-4 py-2 rounded-lg border-2 transition-all duration-500'
                                type="text"/>
                            <input
                                required
                                onChange={(e) => handleInputChange(index, "amount", e.target.value)}
                                // value={tab.amount === 0 ? '' : tab.amount}
                                value={formatNumberWithCommas(tab.amount)}
                                placeholder='0'
                                className='w-2/5 px-4 py-2 rounded-lg border-2 transition-all duration-500'
                                type="text"/>
                            <button
                                type='button'
                                onClick={() => addRow(index)}
                                className='w-1/5'>{index < tabs.length - 1 ? '-' : '+'}</button>
                        </div>
                ))
            }
            <div className='w-full h-auto flex items-center justify-end gap-2 my-2'>
                <button onClick={modal} className='px-5 py-2 rounded-lg font-semibold border-2 hover:bg-gray-200 transition-all duration-150'>Back</button>
                <button
                    className={`${user.role === '3' ? 'bg-fundingBlueGreen border-fundingBlueGreen hover:bg-white hover:text-fundingBlueGreen' : 'bg-preparerPrimary border-preparerPrimary hover:bg-white hover:text-preparerPrimary'} border-2 px-5 py-2 rounded-lg text-white font-semibold transition-all duration-150`}
                    type='submit'
                    >Save</button>
            </div>
            {isLoading && (
                <LargeLoader/>
            )}
        </form>
    )
}

export default AddTab