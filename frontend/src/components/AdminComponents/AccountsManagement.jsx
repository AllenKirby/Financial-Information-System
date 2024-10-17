import { useAuthContext } from '../../hooks/useAuthContext' 
import axios from "axios"
import { useEffect, useState } from "react"

const AccountsManagement = () => {
    const [acc, setAcc] = useState([])
    const { user } = useAuthContext()

    useEffect(() => {
        const getAllAccount = async () => {
            try{
                console.log('fetching all accounts')
                const res = await axios.get('http://localhost:4000/admin/getAllAccounts', {
                withCredentials: true
                })
                if(res.status === 200){
                    const accountsData = res.data 
                    console.log('accounts ', accountsData)

                    setAcc(accountsData)
                }
            }catch(error){
                console.log(`Error in fetching all accounts ${error}`)
            }
        }
        
        getAllAccount()
    }, [])

    return (
        <section className="w-full p-3 h-[30rem] rounded-t-lg border-[1px] bg-white">
            
            <div className='w-full h-auto p-2'>
                <section className='w-full h-auto flex pl-3 pr-10 py-2'>
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