import { Outlet, useParams } from 'react-router-dom'
import { useDisbursementContext } from '../../hooks/useDisbursementContext'
import { useEffect, useState } from 'react';
import DisbursementVoucher from '../DisbursementVoucher';
import { IoSearchSharp, IoAdd  } from "react-icons/io5";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";
import { BsSortAlphaDown } from "react-icons/bs";
import { BsSortAlphaDownAlt } from "react-icons/bs";
import { FaSort } from "react-icons/fa";
import PaginatedList from '../PaginatedList';

const DisbursementRecords = () => {
  const { documents } = useDisbursementContext()
  const { id } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterFlag, setFilterFlag] = useState(false)
  const [filter, setFilter] = useState('')
  const [filteredDocuments, setFilteredDocuments] = useState({})
  const [alphabeticalFlag, setAlphabeticalFlag] = useState(false)

  const modal = () => setIsModalOpen(!isModalOpen)

  console.log(documents)

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
      setFilteredDocuments(filteredResults);
    } else {
      setFilteredDocuments({}); 
    }
  }, [filter, documents]);

  const sortAphabetically = (flag) => {
    setAlphabeticalFlag(!alphabeticalFlag)
    if (documents && Object.keys(documents).length > 0) {
      if(flag) {
        const sortedEntries = Object.entries(documents).sort(([, a], [, b]) => 
          a.payee.localeCompare(b.payee)
        );
        const filteredResults = Object.fromEntries(sortedEntries);
        setFilteredDocuments(filteredResults);
      }
      else {
        const sortedEntries = Object.entries(documents).sort(([, a], [, b]) => 
          a.payee.localeCompare(b.payee)
        );
        const filteredResults = Object.fromEntries(sortedEntries.reverse());
        setFilteredDocuments(filteredResults);
      }
    } else {
      setFilteredDocuments({}); 
    }
  }

  return (
    <section className='w-full h-full'>
      {!id ? (
        <>
          <div className='w-full h-auto py-2 flex'>
            <div className="w-1/2 flex flex-col">
              <div className='pt-3'>
                <p className='font-semibold text-preparerPrimary px-2'>Disbursement Vouchers ({Object.entries(filteredDocuments).length})</p>
              </div>
            </div>
            <div className='w-1/2 flex items-end justify-end gap-2'>
              <button onClick={modal} className="flex items-center justify-center gap-2 pl-3 py-2 pr-4 rounded-full bg-preparerPrimary text-white hover:scale-125 transition-all duration-100">
                <IoAdd size={20} className='font-bold'/>New
              </button>
              <div className='relative'>
                <button onClick={() => setFilterFlag(!filterFlag)} className='flex relative bg-white z-10 w-fit items-center justify-center gap-2 px-2 py-2 border-2 rounded-full text-sm'>
                  <HiAdjustmentsHorizontal 
                    size={15}/>
                    {filter ? <>{filter} <RxCross2 onClick={() => setFilter('')}/></>: 'Filter by Fund Cluster'}
                </button>
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
                <div className='relative w-auto'>
                  <IoSearchSharp size={20} className='absolute top-[10px] left-4 text-gray-400'/>
                  <input 
                    type="search"
                    placeholder='Search'
                    className='py-2 pr-3 text-sm pl-10 rounded-full focus:outline-none border-2' />
                </div>
            </div>
          </div>
          <div className="w-full h-full rounded-lg">
            <div className='w-full h-full'>
              <div className='w-full h-auto flex px-2 py-2 rounded-t-lg bg-gray-200'>
                <div className='w-2/6 flex '>
                  <h1 className='w-auto text-left px-2 font-bold flex items-center justify-center gap-2'>
                    Payee {alphabeticalFlag ? 
                      <BsSortAlphaDownAlt 
                        size={20} 
                        onClick={() => sortAphabetically(true)}
                        className='cursor-pointer'/> : 
                      <BsSortAlphaDown 
                        size={20} 
                        onClick={() => sortAphabetically(false)}
                        className='cursor-pointer'/>
                    }
                  </h1>
                </div>
                <div className='w-1/6 flex items-end justify-center gap-2'>
                  <h1 className='w-auto text-center font-bold flex items-center justify-center gap-2'>DV No. <FaSort/></h1>
                </div>
                <h1 className='w-1/6 text-center font-bold'>Status</h1>
                <div className='w-1/6 flex items-end justify-center gap-2'>
                  <h1 className='w-auto text-center font-bold flex items-center justify-center gap-2'>Time Created <FaSort/></h1>
                </div>
                <div className='w-1/6 flex items-end justify-center gap-2'>
                  <h1 className='w-auto text-center font-bold flex items-center justify-center gap-2'>Time Returned <FaSort/></h1>
                </div>
              </div>
              <div className="w-full h-[430px] border-[1px] overflow-auto bg-white p-1">
                <PaginatedList items={filteredDocuments} type={'4'}/>
              </div>
            </div>
            {isModalOpen && (
              <>
                <div className="fixed inset-0 z-20 bg-black opacity-50" onClick={modal} />
                <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
                  <DisbursementVoucher modal={modal} flag={false}/>
                </div>
              </>
            )}
          </div>
        </>
      ): <Outlet/>}
    </section>
  )
}

export default DisbursementRecords