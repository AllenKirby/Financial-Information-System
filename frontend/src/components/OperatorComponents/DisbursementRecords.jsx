import { Outlet, useParams } from 'react-router-dom'
import { useOpDisbursementContext } from '../../hooks/useOpDisbursementContext'
import DocumentDetails from '../DocumentDetails'
import { IoSearchSharp, IoAdd } from "react-icons/io5";
import { useState, useEffect } from 'react';
import DisbursementVoucher from '../DisbursementVoucher';
import { useSelector } from 'react-redux';
import { FiFilter } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

const DisbursementRecords = () => {
  const { OpDocuments } = useOpDisbursementContext()
  const { id } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const permission = useSelector((state) => state.permission)
  const [filterFlag, setFilterFlag] = useState(false)
  const [filter, setFilter] = useState('')
  const [filteredDocuments, setFilteredDocuments] = useState({})

  const modal = () => setIsModalOpen(!isModalOpen)

  const filterModal = (value) => {
    setFilter(value)
    setFilterFlag(!filterFlag)
  }

  useEffect(() => {
    if (OpDocuments.documents && Object.keys(OpDocuments.documents).length > 0) {
      const filteredResults = Object.fromEntries(
        Object.entries(OpDocuments.documents).filter(([, document]) => 
          document.data.fund.toLowerCase().includes(filter.toLowerCase())
        )
      );
      console.log(filteredResults)
      setFilteredDocuments(filteredResults);
    } else {
      setFilteredDocuments({});
    }
  }, [filter, OpDocuments]);

  return (
    <section className='w-full h-[100%]'>
      <div className='w-full h-auto p-1 flex'>
        <div className="w-1/2 flex flex-col">
          <div className='flex items-center justify-start gap-2'>
            {(permission && permission?.data?.permission) && (
              <button onClick={modal} className="flex items-center justify-center gap-2 pl-3 py-1 pr-4 rounded-lg bg-fundingBlueGreen text-white font-semibold hover:scale-125 transition-all duration-100">
                <IoAdd size={20} className='font-bold'/>New
              </button>
            )}
            <div className='relative'>
              <button onClick={() => setFilterFlag(!filterFlag)} className='flex relative bg-white z-10 w-fit items-center justify-center gap-2 px-2 py-2 border-2 border-customFontColor rounded-lg text-xs'><FiFilter size={15}/>{filter ? <>{filter} <RxCross2 onClick={() => setFilter('')}/></>: 'Filter by Fund Cluster'}</button>
              {filterFlag && (
                <>
                  <div className="fixed inset-0 z-0" onClick={() => setFilterFlag(!filterFlag)}/>
                  <div className='absolute w-full bg-white pt-5 top-5 z-0 p-1 border-[1px]'>
                    <div onClick={() => filterModal('501 COB')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1 text-sm'>501 COB</div>
                    <div onClick={() => filterModal('501 LFP')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1 text-sm'>501 LFP</div>
                    <div onClick={() => filterModal('501 CARP')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1 text-sm'>501 CARP</div>
                    <div onClick={() => filterModal('Contract Farming')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1 text-sm'>Contract Farming</div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className='pt-3'>
            <p className='font-semibold text-fundingBlueGreen px-2'>All Disbursement Voucher</p>
          </div>
        </div>
        <div className='w-1/2 flex items-end justify-end '>
          <div className='relative w-auto'>
            <IoSearchSharp size={20} className='absolute top-[12px] left-4 text-gray-400'/>
            <input 
              type="search"
              placeholder='Search'
              className='py-2 pr-3 text-sm pl-10 rounded-3xl focus:outline-none border-2' />
          </div>
        </div>
      </div>
      <div className="w-full h-screen rounded-t-lg border-[1px] bg-white">
        {!id ? ( 
          <>
            <div className='w-full h-full p-2'>
              <section className='w-full h-auto flex px-2 py-2 rounded-t-lg bg-fundingBlueGreen text-white'>
                <h1 className='w-4/6 text-left font-bold px-2'>Payee</h1>
                <h1 className='w-1/6 text-center font-bold'>DV No.</h1>
                <h1 className='w-1/6 text-center font-bold'>Status</h1>
                <h1 className='w-1/6 text-center font-bold text-sm'>Time Transferred</h1>
              </section>
            {Object.keys(filteredDocuments).length > 0 ? (
              <div className="w-full h-[375px] overflow-auto">
                {Object.entries(filteredDocuments).map(([key, document]) => (
                  <DocumentDetails key={key} documents={document} type={'3'} />
                ))}
              </div>
            ) : (
            <div className='w-full h-full flex items-center justify-center'>
                <div>No Documents Found</div>
              </div>
              // <div className='w-full h-[340px] overflow-auto rounded-md bg-gray-100 px-1'>
              //   <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
              //   <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
              //   <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
              //   <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
              //   <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
              //   <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
              //   <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
              // </div>
              )}
            </div>
          </>
        ) : <Outlet/>}
        {isModalOpen && (
          <>
            <div className="fixed inset-0 z-20 bg-black opacity-50" onClick={modal} />
            <section className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
              <DisbursementVoucher modal={modal} flag={false}/>
            </section>
          </>
        )}
      </div>
    </section>
    
  )
}

export default DisbursementRecords