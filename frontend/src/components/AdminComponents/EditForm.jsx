import { NameAndOffice } from "./editFormComponents/NameAndOffice";
import { TaxType } from "./editFormComponents/TaxType";
import { FundCluster } from "./editFormComponents/FundCluster";
import { ResCenter } from "./editFormComponents/ResCenter";

import { useAuthContext } from "../../hooks/useAuthContext";

const Editform = () => {
    const { user } = useAuthContext();

    return (
        <div className="w-full flex-1 overflow-y-auto p-2 text-gray-500">
            <div className="w-full h-auto px-2">
                <p className={`${user?.role === '1' ? 'text-customgreen' : 'text-BOGreen'} font-semibold text-sm sm:text-base`}>
                    Manage disbursement vouchers by adding new entries or deleting existing data effortlessly.
                </p>
            </div>
            <div className="w-full flex-1 overflow-y-auto px-2">
                <div className="w-full h-auto flex flex-col sm:flex-row items-start justify-center sm:gap-3 my-1">
                    {/* <div className="w-full sm:w-1/2 h-fit border-b-2 py-2">
                        <p className="text-lg font-bold">Fund Clusters</p>
                        <div className="p-2">
                            <FundCluster />
                        </div>
                    </div> */}
                    <div className="w-full sm:w-4/6 h-auto border-b-2 py-2">
                        <p className="text-lg font-bold">Name And Offices</p>
                        <div className="p-2">
                            <NameAndOffice />
                        </div>
                    </div>
                    <div className="w-full sm:w-2/6 h-fit border-b-2 py-2">
                        <p className="text-lg font-bold">Responsibility Centers</p>
                        <div className="p-2">
                            <ResCenter />
                        </div>
                    </div>
                </div>
                <div className="w-full h-auto border-b-2 py-2 my-1">
                    <p className="text-lg font-bold">Tax Types</p>
                    <div className="p-2">
                        <TaxType />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editform;
