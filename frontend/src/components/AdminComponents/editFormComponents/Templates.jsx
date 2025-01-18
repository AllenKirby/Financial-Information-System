import { useState } from "react";

import { IoAdd } from "react-icons/io5";
import { MdRemove } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";

import TemplateModal from "./TemplateModal";

const Templates = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const modal = () => {
        setIsModalOpen(!isModalOpen)
    }
  return (
    <div className='w-full h-auto p-2 text-gray-500'>
        <div className='w-full h-auto px-4 py-1 flex items-center justify-between rounded-lg bg-gray-200'>
            <p className="font-bold">Templates</p>
            <button onClick={modal} className="text-2xl rounded-full">
                <IoAdd/>
            </button>
        </div>
        <div className="w-full h-auto py-1">
            <div className="w-full h-auto px-4 py-1 flex items-center justify-between rounded-lg">
                <p>Disbursement Voucher</p>
                <div className="flex items-center justify-center gap-2">
                    <button className="text-2xl rounded-full">
                        <MdOutlineEdit size={20}/>
                    </button>
                    <button className="text-2xl rounded-full text-red-500">
                        <MdRemove/>
                    </button>
                </div>
            </div>
        </div>
        {isModalOpen && (
            <>
                <div className="fixed inset-0 z-20 bg-black opacity-50"/>
                <section 
                    onClick={(e) => e.stopPropagation()} 
                    className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center"
                >
                    <TemplateModal/>
                
                </section>
            </>
        )}
    </div>
  )
}

export default Templates