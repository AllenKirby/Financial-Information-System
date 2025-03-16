import { useEffect, useState } from "react"
import { firestore } from '../../config/firebase-config'
import { collection, onSnapshot } from "firebase/firestore";
import PaginatedList from '../Pagination/PaginatedList';
import PayrollModal from "./PayrollModal";

const PayrollRecords = () => {
  const [payrollRecords, setPayrollRecords] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const payrollCollectionRef = collection(firestore, "PayrollRecords");
    const unsubscribe = onSnapshot(payrollCollectionRef, (snapshot) => {
      const records = snapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc
      }, {})
      setPayrollRecords(records);
    });

    return () => unsubscribe();
  }, [])

  const modal = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <div className="w-full h-full flex flex-col p-3 rounded-t-lg">
        <div className="w-full h-auto rounded-t-lg hidden sm:block">
            <div className="w-full h-full text-lg bg-gray-100 rounded-lg flex pr-4">
                <p className="text-gray-400 text-sm font-semibold w-2/5 py-2 border-white text-left px-2">Date</p>
                <p className="text-gray-400 text-sm font-semibold text-center w-1/5 py-2 border-white">Amount</p>
                <p className="text-gray-400 text-sm font-semibold text-center w-2/5 py-2 border-white">Particulars</p>
            </div>
        </div>
        <div className="w-full flex-1 overflow-y-auto text-gray-500">
          {payrollRecords && Object.entries(payrollRecords).length > 0 ? (
              <PaginatedList items={payrollRecords} paginationFor="payrollRecords" modal={modal}/>
          ) : (
              <div className=" w-full h-full flex items-center justify-center">
                  <p className="font-semibold">No Records Found</p>
              </div>
          )}
        </div>
        {/* {isModalOpen && (
            <>
                <div className="fixed inset-0 z-20 bg-black opacity-50" />
                <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
                    <PayrollModal modal={modal}/>
                </div>
            </>
        )} */}
    </div>
  )
}

export default PayrollRecords