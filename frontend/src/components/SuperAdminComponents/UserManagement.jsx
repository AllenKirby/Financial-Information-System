import { IoSearchSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { useState, useEffect } from "react";
import axios from 'axios';

import CreateUser from './CreateUser';
import AccountDetails from "./AccountDetails";

const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [roleSort , setRoleSort] = useState('')

  const modal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    const getAllAccounts = async () => {
      try {
        console.log('Fetching all accounts');
        const res = await axios.get('http://localhost:4000/superadmin/getAllAccounts', {
          withCredentials: true
        });
        if (res.status === 200) {
          const accountsData = res.data;
          console.log('Accounts: ', accountsData);
          setAccounts(accountsData);
          setFilteredAccounts(accountsData);
        }
      } catch (error) {
        console.log(`Error fetching all accounts: ${error}`);
      }
    };

    getAllAccounts();
  }, []);

  useEffect(() => {
    const results = accounts.filter(account =>
      account.customClaims.dispName.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredAccounts(results);
  }, [accounts, search]);

  useEffect(() => {
    const results = accounts.filter(account =>
      account.customClaims.role.includes(roleSort)
    );
    setFilteredAccounts(results);
  }, [accounts, roleSort]);

  const sortValue = (value) => {
    setRoleSort(value)
  }

  return (
    <section className="w-full h-full">
      <div className="w-full h-auto flex items-center justify-end">
        <div className="flex gap-2">
          <div className='relative'>
            <IoSearchSharp size={20} className='absolute top-[12px] left-4 text-gray-400' />
            <input 
              type="search"
              placeholder='Search Name'
              onChange={(e) => setSearch(e.target.value)}
              className='py-2 pr-3 pl-10 text-sm rounded-2xl focus:outline-none border-2' />
          </div>
          <button onClick={modal} className="flex items-center justify-center gap-1 bg-customgreen text-sm text-white px-3 rounded-lg hover:scale-125 duration-150 transition-all">
            <IoMdAdd size={20} />Add User
          </button>
          {isModalOpen && (
            <>
              <div className="fixed inset-0 z-20 bg-black opacity-50" />
              <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
                <CreateUser modal={modal} flag={false} />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="w-full h-auto flex items-center justify-start border-b-2">
        <button onClick={() => sortValue('')} className={`${roleSort === '' ? 'text-customgreen border-b-2 border-b-customgreen' : ''} px-3 py-2 text-sm font-medium hover:border-b-2 hover:text-customgreen hover:border-b-customgreen`}>All</button>
        <button onClick={() => sortValue('4')} className={`${roleSort === '4' ? 'text-customgreen border-b-2 border-b-customgreen' : ''} px-3 py-2 text-sm font-medium hover:border-b-2 hover:text-customgreen hover:border-b-customgreen`}>Preparer</button>
        <button onClick={() => sortValue('3')} className={`${roleSort === '3' ? 'text-customgreen border-b-2 border-b-customgreen' : ''} px-3 py-2 text-sm font-medium hover:border-b-2 hover:text-customgreen hover:border-b-customgreen`}>Funding</button>
        <button onClick={() => sortValue('2')} className={`${roleSort === '2' ? 'text-customgreen border-b-2 border-b-customgreen' : ''} px-3 py-2 text-sm font-medium hover:border-b-2 hover:text-customgreen hover:border-b-customgreen`}>Budget Officer</button>
        <button onClick={() => sortValue('1')} className={`${roleSort === '1' ? 'text-customgreen border-b-2 border-b-customgreen' : ''} px-3 py-2 text-sm font-medium hover:border-b-2 hover:text-customgreen hover:border-b-customgreen`}>Approver</button>
        <button onClick={() => sortValue('0')} className={`${roleSort === '0' ? 'text-customgreen border-b-2 border-b-customgreen' : ''} px-3 py-2 text-sm font-medium hover:border-b-2 hover:text-customgreen hover:border-b-customgreen`}>Super Admin</button>
      </div>
      <div className="w-full h-full px-2 pt-5">
        <div className="w-full h-auto flex rounded-t-lg bg-customgreen text-white px-1">
          <div className="w-[90%] h-auto flex">
            <h1 className="w-1/5 px-2 py-1">Fullname</h1>
            <h1 className="w-1/5 px-2 py-1 ">Role</h1>
            <h1 className="w-1/5 px-2 py-1 ">Email</h1>
            <h1 className="w-1/5 px-2 py-1 text-center">Status</h1>
            <h1 className="w-1/5 px-2 py-1 text-center">Email Verified</h1>
          </div>
          <div className="w-[10%] h-auto"></div>
        </div>
        <div className="w-full h-full bg-white p-1">
          {filteredAccounts.length > 0 ? (
            filteredAccounts.reverse().map((account, index) => (
              <AccountDetails 
                key={index} 
                account={account} />
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div>
                <h1 className="text-xl font-semibold">No Accounts Found</h1>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default UserManagement;
