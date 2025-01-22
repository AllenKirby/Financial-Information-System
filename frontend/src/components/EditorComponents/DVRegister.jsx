import { useState } from "react"

import { IoSearchSharp } from "react-icons/io5";

const DVRegister = () => {
    const [activeTab, setActiveTabs] = useState('501 COB') 
    const [search, setSearch]= useState('')
    const [searchModal, setSearchModal] = useState(false)

  return (
    <section className="w-full h-full flex flex-col p-2 text-gray-500">
        <div className="w-full h-auto pt-2 flex items-center justify-between">
            <div className="flex items-center justify-center gap-1">
                <button onClick={() => setActiveTabs('501 COB')} className={`${activeTab === '501 COB' ? 'text-preparerPrimary border-b-2 border-preparerPrimary' : ''} px-1 py-2 hover:text-preparerPrimary hover:border-b-2 hover:border-preparerPrimary transition-all duration-100`}>501 COB</button>
                <button onClick={() => setActiveTabs('501 LFP')} className={`${activeTab === '501 LFP' ? 'text-preparerPrimary border-b-2 border-preparerPrimary' : ''} px-1 py-2 hover:text-preparerPrimary hover:border-b-2 hover:border-preparerPrimary transition-all duration-100`}>501 LFP</button>
                <button onClick={() => setActiveTabs('501 CARP')} className={`${activeTab === '501 CARP' ? 'text-preparerPrimary border-b-2 border-preparerPrimary' : ''} px-1 py-2 hover:text-preparerPrimary hover:border-b-2 hover:border-preparerPrimary transition-all duration-100`}>501 CARP</button>
                <button onClick={() => setActiveTabs('Farming Support Services Program')} className={`${activeTab === 'Farming Support Services Program' ? 'text-preparerPrimary border-b-2 border-preparerPrimary' : ''} px-1 py-2 hover:text-preparerPrimary hover:border-b-2 hover:border-preparerPrimary transition-all duration-100`}>Farming Support Services Program</button>
            </div>
            <div>
                <div className='relative w-auto hidden sm:block'>
                    <IoSearchSharp size={20} className='absolute top-[10px] left-4 text-gray-400'/>
                    <input 
                        type="search"
                        placeholder='Search'
                        onChange={(e) => setSearch(e.target.value)}
                        className='w-14 sm:w-auto py-2 text-sm 2xl:text-base pl-10 placeholder-transparent sm:placeholder-gray-500 rounded-lg focus:outline-none border-2' />
                </div>
                <button onClick={() => setSearchModal(!searchModal)} className='block sm:hidden'>
                    <IoSearchSharp size={38} className='border-2 rounded-lg px3 py-2 text-gray-400'/>
                </button>
            </div>
        </div>
        <div className="w-full flex-1 py-2">
            <div className="w-full h-full flex flex-col">
                <div className="w-full h-auto rounded-lg flex items-center justify-center bg-gray-100 text-gray-400 text-sm py-2">
                    <p className="w-1/5 text-center font-bold">Payee</p>
                    <p className="w-1/5 text-center font-bold">DV No.</p>
                    <p className="w-1/5 text-center font-bold">Date</p>
                    <p className="w-1/5 text-center font-bold">ORS/BURS</p>
                    <p className="w-1/5 text-center font-bold">Amount</p>
                </div>
            </div>
            <div className="w-full flex-1">

            </div>
        </div>
    </section>
  )
}

export default DVRegister