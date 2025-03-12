import { NameAndOffice } from "./editFormComponents/NameAndOffice";
import { TaxType } from "./editFormComponents/TaxType";
import { FundCluster } from "./editFormComponents/FundCluster";
import { ResCenter } from "./editFormComponents/ResCenter";

import { IoIosArrowDown } from "react-icons/io";
import { useRef, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

const Editform = () => {
    const accountCodeRef = useRef(null)
    const fundClusterRef = useRef(null)
    const resCenRef = useRef(null)
    const nameOfficeRef = useRef(null)
    const taxTypeRef = useRef(null)

    const { user } = useAuthContext()

    const [flag, setFlag] = useState({
        accountCode: false, 
        fundCluster: false, 
        nameOffice: false, 
        resCen: false, 
        taxType: false,
        DVTemplates: false
    })

    return (
        <div className="w-full flex-1 overflow-y-auto p-2 text-gray-500">
            <div className="w-full h-auto px-2">
                <p className={`${user?.role === '1' ? 'text-customgreen' : 'text-BOGreen'} font-semibold text-sm sm:text-base`}>Manage disbursement vouchers by adding new entries or deleting existing data effortlessly.</p>
            </div>
            <div className="w-full flex-1 overflow-y-auto px-2">
                <div className="w-full h-auto border-b-2 py-2 my-1 transition-all duration-150">
                    <div onClick={() => setFlag({...flag, accountCode: !flag.accountCode})} className="w-full h-auto flex items-center justify-between cursor-pointer">
                        <p className="text-lg font-bold">Account Codes</p>
                        <IoIosArrowDown
                            size={20}
                            className={`transition-transform duration-300 ${flag.accountCode ? "rotate-180" : ""}`}
                        />
                    </div>
                    <div ref={accountCodeRef} className="overflow-hidden transition-all duration-500" style={{height: flag.accountCode ? `${accountCodeRef.current.scrollHeight}px` : "0px",}}>
                        <div className="p-2">
                            <div className="w-full h-auto">
                                <div className="flex items-center justify-center bg-gray-200 rounded-lg py-1">
                                    <p className="w-1/2 text-center font-bold">Account Title</p>
                                    <p className="w-1/2 text-center font-bold">Account Code</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full h-auto flex flex-col sm:flex-row items-start justify-center sm:gap-3 my-1">
                    <div className="w-full sm:w-1/2 h-auto border-b-2 py-2 transition-all duration-150">
                        <div onClick={() => setFlag({...flag, fundCluster: !flag.fundCluster})} className="w-full h-auto flex items-center justify-between cursor-pointer">
                            <p className="text-lg font-bold">Fund Clusters</p>
                            <IoIosArrowDown
                                size={20}
                                className={`transition-transform duration-300 ${flag.fundCluster ? "rotate-180" : ""}`}
                            />
                        </div>
                        <div ref={fundClusterRef} className="overflow-hidden transition-all duration-500" style={{height: flag.fundCluster ? `${fundClusterRef.current.scrollHeight}px` : "0px",}}>
                            <div className="p-2">
                                <FundCluster/>
                            </div>
                        </div>
                    </div>
                    <div className="w-full sm:w-1/2 h-auto border-b-2 py-2 transition-all duration-150">
                        <div onClick={() => setFlag({...flag, resCen: !flag.resCen})} className="w-full h-auto flex items-center justify-between cursor-pointer">
                            <p className="text-lg font-bold">Responsibility Centers</p>
                            <IoIosArrowDown
                                size={20}
                                className={`transition-transform duration-300 ${flag.resCen ? "rotate-180" : ""}`}
                            />
                        </div>
                        <div ref={resCenRef} className="overflow-hidden transition-all duration-500" style={{height: flag.resCen ? `${resCenRef.current.scrollHeight}px` : "0px",}}>
                            <div className="p-2">
                                <ResCenter/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full h-auto border-b-2 py-2 my-1 transition-all duration-150">
                    <div onClick={() => setFlag({...flag, nameOffice: !flag.nameOffice})} className="w-full h-auto flex items-center justify-between cursor-pointer">
                        <p className="text-lg font-bold">Name And Offices</p>
                        <IoIosArrowDown
                            size={20}
                            className={`transition-transform duration-300 ${flag.nameOffice ? "rotate-180" : ""}`}
                        />
                    </div>
                    <div ref={nameOfficeRef} className="overflow-hidden transition-all duration-500" style={{height: flag.nameOffice ? `${nameOfficeRef.current.scrollHeight}px` : "0px",}}>
                        <div className="p-2">
                            <NameAndOffice/>
                        </div>
                    </div>
                </div>
                <div className="w-full h-auto border-b-2 py-2 my-1 transition-all duration-150">
                    <div onClick={() => setFlag({...flag, taxType: !flag.taxType})} className="w-full h-auto flex items-center justify-between cursor-pointer">
                        <p className="text-lg font-bold">Tax Types</p>
                        <IoIosArrowDown
                            size={20}
                            className={`transition-transform duration-300 ${flag.taxType ? "rotate-180" : ""}`}
                        />
                    </div>
                    <div ref={taxTypeRef} className="overflow-hidden transition-all duration-500" style={{height: flag.taxType ? `${taxTypeRef.current.scrollHeight}px` : "0px",}}>
                        <div className="p-2">
                            <TaxType/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Editform