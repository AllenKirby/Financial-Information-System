import { Outlet, useParams } from 'react-router-dom'
import { useDisbursementContext } from '../../hooks/useDisbursementContext'
import DocumentDetails from '../DocumentDetails'
import { useEffect, useState } from 'react';
import DisbursementVoucher from '../DisbursementVoucher';
import { IoSearchSharp, IoAdd  } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

const DisbursementRecords = () => {
  const { documents } = useDisbursementContext()
  const { id } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterFlag, setFilterFlag] = useState(false)
  const [filter, setFilter] = useState('')
  const [filteredDocuments, setFilteredDocuments] = useState({})

  const modal = () => setIsModalOpen(!isModalOpen)

  const filterModal = (value) => {
    setFilter(value)
    setFilterFlag(!filterFlag)
  }

  useEffect(() => {
    if (documents && Object.keys(documents).length > 0) {
      const filteredResults = Object.fromEntries(

        Object.entries(documents).filter(([, document]) => 
          document.fund.toLowerCase().includes(filter.toLowerCase())
        )

      );
      console.log(filteredResults)
      setFilteredDocuments(filteredResults);
    } else {
      setFilteredDocuments({}); 
    }
  }, [filter, documents]);
  

  return (
    <section className='w-full h-full'>
      <div className='w-full p-1 flex items-center justify-between'>
        <div className="w-1/2 py-1 flex items-center justify-between">
          <button onClick={modal} className="flex items-center justify-center gap-2 pl-3 py-1 pr-4 rounded-lg bg-preparerPrimary text-white font-semibold border-2 hover:scale-125 transition-all duration-100">
            <IoAdd size={20} className='font-bold'/>Add DV
          </button>
        </div>
        <div className='relative w-1/2 flex items-center justify-end gap-2'>
          <div className='relative w-auto'>
            <IoSearchSharp size={20} className='absolute top-[12px] left-4 text-gray-400'/>
            <input 
              type="search"
              placeholder='Search'
              className='py-2 pr-3 pl-10 rounded-3xl focus:outline-none border-2' />
          </div>
          <div className='relative'>
            <button onClick={() => setFilterFlag(!filterFlag)} className='flex relative bg-white z-20 w-fit items-center justify-center gap-2 px-2 py-2 border-2 border-customFontColor rounded-full text-sm'><FiFilter size={15}/>{filter ? <>{filter} <RxCross2 onClick={() => setFilter('')}/></>: 'Filter by Fund Cluster'}</button>
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
      </div>
      <div className='w-full h-full flex gap-2'>
        <div className="w-5/6 p-3 h-full rounded-lg border-[1px] bg-white">
          {!id ? ( 
            <>
              <div className='w-full h-full p-2'>
                <section className='w-full h-auto flex px-2 py-2 rounded-t-lg bg-preparerPrimary text-white'>
                  <h1 className='w-4/6 text-left font-bold px-2'>Payee</h1>
                  <h1 className='w-1/6 text-center font-bold'>DV No.</h1>
                  <h1 className='w-1/6 text-center font-bold'>Status</h1>
                  <h1 className='w-1/6 text-center font-bold'>Time Created</h1>
                </section>
                {Object.keys(filteredDocuments).length > 0 ? (
                  <section className="w-full h-[340px] overflow-auto">
                    {Object.entries(filteredDocuments).map(([key, document]) => (
                      <DocumentDetails key={key} documents={document} type={'4'}/>
                    ))}
                  </section>
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
        <div className='w-1/6 h-full flex flex-col gap-2'>
          <div className='w-full h-1/3 bg-white rounded-lg text-center'>

          </div>
          <div className='w-full h-1/3 bg-gray-200 text-preparerPrimary rounded-lg text-center p-3 flex items-center justify-center'>
            <div>
              <h1 className='text-7xl text-'>3</h1>
              <p className='text-xs '>Number of Disbursement Vouchers with Drafting Status</p>
            </div>
          </div>
          <div className='w-full h-1/3 bg-red-500 text-white rounded-lg text-center p-3 flex items-center justify-center'>
          <div>
              <h1 className='text-7xl text-'>3</h1>
              <p className='text-xs '>Number of Disbursement Vouchers with Returned Status</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DisbursementRecords