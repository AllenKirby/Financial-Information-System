import axios from "axios"
export const useEditForm = () => {

    const addNewFundCluster = async (newFundCluster, randKey) => {
        try{
            const data = {
                cluster: newFundCluster,
                key: randKey
            }

            const res = await axios.post('http://localhost:4000/admin/addNewFundCluster', data, {
                withCredentials: true
            })

            if(res.status === 200){
                console.log('successfully added new cluster', res.data)
                // setIsLoading(false)
            }
        }catch(error){
            console.log(`There's an error on adding new cluster fund ${error}`)
        }
    }

    const getFundCluster = async () => {
        try{
            const res = await axios.get('http://localhost:4000/admin/getFundCluster', {
                withCredentials: true
            })
            if(res.status === 200){
                const arr = res.data.formData
                console.log('successfully added new cluster', arr)
                sessionStorage.setItem('FundClusterData', JSON.stringify(arr));
                return arr
                
            }
        }catch(error){
            console.log(`There's an error on fetching cluster fund ${error}`)
        }
    }

    const deleteFundCluster = async (field_key) => {
        try{
            const res = await axios.delete(`http://localhost:4000/admin/deleteFundCluster/${field_key}`, {
                withCredentials: true
            })
            if(res.status === 200){
                console.log('successfully deleted the fund cluster')
                return true
                
            }
            return false
        }catch(error){
            console.log(`There's an error on fetching cluster fund ${error}`)
            return false
        }
    }

    return {addNewFundCluster, getFundCluster, deleteFundCluster}

}