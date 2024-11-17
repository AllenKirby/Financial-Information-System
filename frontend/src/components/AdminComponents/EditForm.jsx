import { NameAndOffice } from "./editFormComponents/NameAndOffice";
import { TaxType } from "./editFormComponents/TaxType";
import { FundCluster } from "./editFormComponents/FundCluster";
import { ResCenter } from "./editFormComponents/ResCenter";

const Editform = () => {

    return (
        <div className="w-full h-full bg-white rounded-t-lg p-4">
            <div className="h-[550px] overflow-y-auto">
                <div className="w-full flex gap-2 ">
                    <div className="w-4/5 h-72">
                        <div className="w-full h-full rounded-lg bg-white border-[1px]">
                            <div className='w-full h-auto flex px-2 py-2 rounded-t-lg bg-customgreen text-white'>
                                <h1 className='w-3/5 text-left font-bold px-2'>Account Title</h1>
                                <h1 className='w-2/5 text-center font-bold'>Account Code</h1>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/5 h-72">
                        <FundCluster/>
                    </div>
                </div>
                <div className="w-full flex gap-2 mt-2">
                    <NameAndOffice/>
                    <ResCenter/>
                </div>
                <div className="w-full h-96 mt-2">
                    <TaxType/>
                </div>
            </div>
        </div>
    )
}

export default Editform