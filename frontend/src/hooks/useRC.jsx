import axios from "axios";

export const useRC = () => {

    const addNewRC = async (newRC, randKey) => {
        try{
            const data = {
                RC: newRC,
                key: randKey
            }

            const res = await axios.post('http://localhost:4000/admin/addRC', data, {
                withCredentials: true
            })

            if(res.status === 200){
                console.log('successfully added RC', res.data)
                // setIsLoading(false)
            }
        }catch(error){
            console.log(`There's an error on adding new RC ${error}`)
        }
    }

    const getRC = async () => {
        try{
            const res = await axios.get('http://localhost:4000/admin/getRC', {
                withCredentials: true
            })
            if(res.status === 200){
                const arr = res.data.formData
                console.log('successfully added new RC', arr)
                sessionStorage.setItem('RCData', JSON.stringify(arr));
                return arr
                
            }
        }catch(error){
            console.log(`There's an error on fetching RC ${error}`)
        }
    }

    const deleteRC = async (field_key) => {
        try{
            const res = await axios.delete(`http://localhost:4000/admin/deleteRC/${field_key}`, {
                withCredentials: true
            })
            if(res.status === 200){
                console.log('successfully deleted the RC')
                return true
                
            }
            return false
        }catch(error){
            console.log(`There's an error on fetching RC ${error}`)
            return false
        }
    }

    return {addNewRC, getRC, deleteRC}

}