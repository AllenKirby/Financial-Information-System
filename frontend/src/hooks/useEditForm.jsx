import axios from "axios"
export const useEditForm = () => {

    const addNewFundCluster = async (newFundCluster) => {
        try{
            const data = {
                cluster: newFundCluster
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

    return {addNewFundCluster}

}