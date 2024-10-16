import { IoSearchSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
//import { MdDelete } from "react-icons/md";
import { useState } from "react";

import CreateUser from './CreateUser'

const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const modal = () => setIsModalOpen(!isModalOpen)

  return (
    <section className="w-full h-full">
      <div className="w-full h-auto flex items-center justify-end">
        <div className="flex gap-2">
          <div className='relative'>
            <IoSearchSharp size={20} className='absolute top-[12px] left-4 text-gray-400'/>
            <input 
              type="search"
              placeholder='Search'
              className='py-2 pr-3 pl-10 text-sm rounded-2xl focus:outline-none border-2' />
          </div>
          <button onClick={modal} className="flex items-center justify-center gap-1 bg-customgreen text-sm text-white px-3 rounded-lg"><IoMdAdd size={20} />Add User</button>
          {isModalOpen && (
            <>
              <div className="fixed inset-0 z-20 bg-black opacity-50"/>
              <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
                <CreateUser modal={modal} />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="w-full h-auto flex items-center justify-start border-b-2">
        <button className="px-3 py-2 text-sm font-medium hover:border-b-2 hover:text-customgreen hover:border-b-customgreen">Preparer</button>
        <button className="px-3 py-2 text-sm font-medium hover:border-b-2 hover:text-customgreen hover:border-b-customgreen">Funding</button>
        <button className="px-3 py-2 text-sm font-medium hover:border-b-2 hover:text-customgreen hover:border-b-customgreen">Budget Officer</button>
        <button className="px-3 py-2 text-sm font-medium hover:border-b-2 hover:text-customgreen hover:border-b-customgreen">Approver</button>
        <button className="px-3 py-2 text-sm font-medium hover:border-b-2 hover:text-customgreen hover:border-b-customgreen">Super Admin</button>
      </div>
      <div className="w-full h-full px-2 pt-5">
        <div className="w-full h-auto flex rounded-t-lg bg-customgreen text-white px-1">
          <h1 className="w-1/3 px-2 py-1 ">Fullname</h1>
          <h1 className="w-1/3 px-2 py-1 ">Role</h1>
          <h1 className="w-1/3 px-2 py-1 ">Email</h1>
        </div>
        <div className="w-full h-full bg-white p-1">
          <div className="w-full h-auto border-[1px] flex rounded-md py-2 hover:bg-slate-100 cursor-pointer">
            <p className="w-1/3 px-2">Allen Kirby</p>
            <p className="w-1/3 px-2">Super Admin</p>
            <p className="w-1/3 px-2 text-blue-600 underline">santilecesallen6@gmail.com</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UserManagement
