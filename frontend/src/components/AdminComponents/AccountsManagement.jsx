import { useAuthContext } from '../../hooks/useAuthContext' 
import axios from "axios"
import { useEffect, useState } from "react"
import AccountDetails from './AccountDetails'

const AccountsManagement = () => {
    const [acc, setAcc] = useState([])
    const { user } = useAuthContext()

    useEffect(() => {
        const getAllAccount = async () => {
            try{
                const storedAccounts = sessionStorage.getItem('accounts');
                if(storedAccounts){
                    const accounts = JSON.parse(storedAccounts);
                    setAcc(accounts)
                }else{
                    const res = await axios.get('http://localhost:4000/admin/getAllAccounts', {
                    withCredentials: true
                    })
                    if(res.status === 200){
                        const accountsData = res.data 
                        console.log('accounts ', accountsData)

                        const accountsJSON = JSON.stringify(accountsData);
                        sessionStorage.setItem('accounts', accountsJSON);

                        setAcc(accountsData)
                    }
                }
                console.log(acc[0].email, acc[0].customClaims.dispName, acc[0].customClaims.role)
                // console.log(storedAccounts[0].email, storedAccounts[0].customClaims.dispName, storedAccounts[0].customClaims.role)

            }catch(error){
                console.log(`Error in fetching all accounts ${error}`)
            }
        }
        if(user){
            getAllAccount()
        }
    }, [user])


    return (
        <section className="w-4/5 p-3 h-[30rem] rounded-xl shadow-slate-200 shadow-customShadowStyle bg-white">
            
            <div className='w-full h-auto p-2'>
                <section className='w-full h-auto flex pl-3 pr-6 py-2'>
                    <h1 className='w-4/6 text-left font-bold'>Email</h1>
                    <h1 className='w-1/6 text-center font-bold'>Name</h1>
                    <h1 className='w-1/6 text-center font-bold'>Role</h1>
                </section>
                <div className="relative group">
                    {acc.length > 0 ? (
                    <section className="w-full h-[340px] overflow-auto rounded-md bg-gray-100 px-1">
                        {acc.reverse().map((account, index) => (
                            <AccountDetails 
                                key={index} 
                                email={account.email} 
                                name={account.customClaims.dispName} 
                                roleString={account.customClaims.role} 
                            />
                        ))}
                    </section>
                    ) : (
                        <div className='w-full h-[340px] overflow-auto rounded-md bg-gray-100 px-1'>
                            <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                            <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                            <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                            <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                            <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                            <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                            <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                        </div>
                    )}
                </div>
                
            </div>
        </section>
    )
}

export default AccountsManagement