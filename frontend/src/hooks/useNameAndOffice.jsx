import axios from "axios";

export const useNameAndOffice = () => {
    const addNewNameAndOffice = async (name, office, key) => {
        try{
            const data = {
                name: name,
                office: office,
                key: key
            }

            const res = await axios.post('http://localhost:4000/admin/addNameAndOffice', data, {
                withCredentials: true
            })

            if(res.status === 200){
                
            }


        }catch(error){
            console.log(`Error in creating new name and office ${error}`)
        }
    }

    const getNameAndOffice = async () => {
        try{
            const res = await axios.get('http://localhost:4000/admin/getNameAndOffice', {
                withCredentials: true
            })
            if(res.status === 200){
                const arr = res.data.formData
                console.log('successfully added new RC', arr)
                sessionStorage.setItem('NameAndOfficeData', JSON.stringify(arr));
                return arr
                
            }
        }catch(error){
            console.log(`There's an error on fetching name and office ${error}`)
        }
    }

    const deleteNameAndOffice = async (field_key) => {
        try{
            const res = await axios.delete(`http://localhost:4000/admin/deleteNameAndOffice/${field_key}`, {
                withCredentials: true
            })
            if(res.status === 200){
                console.log('successfully deleted the name and office')
                return true
                
            }
            return false
        }catch(error){
            console.log(`There's an error on deleting name and office ${error}`)
            return false
        }
    }


    return {addNewNameAndOffice, getNameAndOffice, deleteNameAndOffice}
}