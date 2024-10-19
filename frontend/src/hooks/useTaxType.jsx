import axios from "axios"
export const useTaxType = () => {
    const addTax = async (tax, title, formula1, formula2, key) => {
        try{
            const data = {
                tax: tax,
                title: title,
                formula1: formula1,
                formula2: formula2,
                key: key
            }

            const res = await axios.post('http://localhost:4000/admin/addTaxType', data, {
                withCredentials: true
            })

            if(res.status === 200){
                console.log('succesfully added new tax')
            }


        }catch(error){
            console.log(`Error in creating new name and office ${error}`)
        }
    }

    const getTaxType = async () => {
        try{
            const res = await axios.get('http://localhost:4000/admin/getTaxType', {
                withCredentials: true
            })
            if(res.status === 200){
                const arr = res.data.formData
                console.log('successfully added new tax type', arr)
                sessionStorage.setItem('TaxTypeData', JSON.stringify(arr));
                return arr
                
            }
        }catch(error){
            console.log(`There's an error on fetching tax ${error}`)
        }
    }

    const deleteTax = async (field_key) => {
        try{
            const res = await axios.delete(`http://localhost:4000/admin/deleteTax/${field_key}`, {
                withCredentials: true
            })
            if(res.status === 200){
                console.log('successfully deleted the tax')
                return true
                
            }
            return false
        }catch(error){
            console.log(`There's an error on deleting tax ${error}`)
            return false
        }
    }

    return {addTax, getTaxType, deleteTax}
}  