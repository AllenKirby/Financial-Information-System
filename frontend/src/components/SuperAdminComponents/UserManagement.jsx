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
  const [numOfRole, setNumOfRole] = useState({all: 0, preparer: 0, funding: 0, BO: 0, approver: 0, superAdmin: 0,})

  const modal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    const getAllAccounts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/superadmin/getAllAccounts`, {
          withCredentials: true
        }); 
        if (res.status === 200) {
          const accountsData = res.data;
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
    const result = accounts.filter(account => account.customClaims.dispName.toLowerCase().includes(search.toLowerCase()));
    setFilteredAccounts(result);
  }, [accounts, search]);

  useEffect(() => {
    const result = accounts.filter(account => account.customClaims.role.includes(roleSort));
    setFilteredAccounts(result);
  }, [accounts, roleSort]);

  useEffect(() => {
    const preparer = accounts.filter(account => account.customClaims.role === '4')
    const funding = accounts.filter(account => account.customClaims.role === '3')
    const BO = accounts.filter(account => account.customClaims.role === '2')
    const approver = accounts.filter(account => account.customClaims.role === '1')
    const superAdmin = accounts.filter(account => account.customClaims.role === '0')
    setNumOfRole({
      all: accounts.length,
      preparer: preparer.length,
      funding: funding.length,
      BO: BO.length,
      approver: approver.length,
      superAdmin: superAdmin.length
    });
  }, [accounts])

  const sortValue = (value) => {
    setRoleSort(value)
  }

  return (
    <section className="w-full h-full p-2">
      <div className="w-full h-[10%] flex items-center justify-end">
        <div className="flex gap-2">
          <div className='relative'>
            <IoSearchSharp size={20} className='absolute top-[12px] left-4 text-gray-400' />
            <input 
              type="search"
              placeholder='Search Name'
              onChange={(e) => setSearch(e.target.value)}
              className='py-2 pr-3 pl-10 text-sm rounded-2xl focus:outline-none border-2' />
          </div>
          <button onClick={modal} className="flex items-center justify-center gap-1 bg-superAdminBlue text-sm text-white px-3 rounded-lg hover:scale-125 duration-150 transition-all">
            <IoMdAdd size={20} />Add Account
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
      <div className="w-full h-[10%] flex items-center justify-start py-2">
        <button onClick={() => sortValue('')} className={`${roleSort === '' ? 'text-superAdminMustard border-b-2 border-b-superAdminMustard' : ''} px-3 py-2 text-sm font-medium hover:border-b-2 hover:text-superAdminMustard hover:border-b-superAdminMustard transition-all duration-100`}>All ({numOfRole.all})</button>
        <button onClick={() => sortValue('4')} className={`${roleSort === '4' ? 'text-superAdminMustard border-b-2 border-b-superAdminMustard' : ''} px-3 py-2 text-sm font-medium hover:border-b-2 hover:text-superAdminMustard hover:border-b-superAdminMustard transition-all duration-100`}>Preparer ({numOfRole.preparer})</button>
        <button onClick={() => sortValue('3')} className={`${roleSort === '3' ? 'text-superAdminMustard border-b-2 border-b-superAdminMustard' : ''} px-3 py-2 text-sm font-medium hover:border-b-2 hover:text-superAdminMustard hover:border-b-superAdminMustard transition-all duration-100`}>Funding ({numOfRole.funding})</button>
        <button onClick={() => sortValue('2')} className={`${roleSort === '2' ? 'text-superAdminMustard border-b-2 border-b-superAdminMustard' : ''} px-3 py-2 text-sm font-medium hover:border-b-2 hover:text-superAdminMustard hover:border-b-superAdminMustard transition-all duration-100`}>Budget Officer ({numOfRole.BO})</button>
        <button onClick={() => sortValue('1')} className={`${roleSort === '1' ? 'text-superAdminMustard border-b-2 border-b-superAdminMustard' : ''} px-3 py-2 text-sm font-medium hover:border-b-2 hover:text-superAdminMustard hover:border-b-superAdminMustard transition-all duration-100`}>Approver ({numOfRole.approver})</button>
        <button onClick={() => sortValue('0')} className={`${roleSort === '0' ? 'text-superAdminMustard border-b-2 border-b-superAdminMustard' : ''} px-3 py-2 text-sm font-medium hover:border-b-2 hover:text-superAdminMustard hover:border-b-superAdminMustard transition-all duration-100`}>Super Admin ({numOfRole.superAdmin})</button>
      </div>
      <div className="w-full h-[80%] border-2 rounded-lg">
        <div className="w-full h-auto flex rounded-t-lg bg-gray-100  px-1">
          <div className="w-[90%] h-auto flex">
            <h1 className="w-1/5 px-2 py-1 font-semibold text-gray-400">Fullname</h1>
            <h1 className="w-1/5 px-2 py-1 font-semibold text-gray-400">Role</h1>
            <h1 className="w-1/5 px-2 py-1 font-semibold text-gray-400">Email</h1>
            <h1 className="w-1/5 px-2 py-1 text-center font-semibold text-gray-400">Status</h1>
            <h1 className="w-1/5 px-2 py-1 text-center font-semibold text-gray-400">Email Verified</h1>
          </div>
          <div className="w-[10%] h-auto"></div>
        </div>
        <div className="w-full h-[370px] overflow-auto bg-white">
          {filteredAccounts.length > 0 ? (
            filteredAccounts.reverse().map((account, index) => (
              <AccountDetails 
                key={index}
                index={index} 
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
