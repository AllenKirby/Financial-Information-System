import axios from "axios"

export const useInitialStateDV = () => {
    const apiURL = import.meta.env.VITE_API_URL
    // async (fundCluster)
    const setDVno = async () => {
        try{
            const res = await axios.get(`${apiURL}/editor/getNumberOfCopies`, {
                // params: {cluster: fundCluster},
                withCredentials: true
            })

            if(res.status === 200){
                const resData = res.data.data
                console.log(resData)
                sessionStorage.setItem('pendingDVNumbers', JSON.stringify(resData))
                return resData
            }else{
                console.log('error in setDvno (useinitialstatedv)')
            }
        }catch(error){
            console.log(`Error on SET initial state of DV no: ${error}`)
        }
    }

    const getDVno = async (fundCluster) => {
        try{
            const storedDVNumbers = sessionStorage.getItem('pendingDVNumbers')
            const resData = storedDVNumbers ? JSON.parse(storedDVNumbers) : await setDVno()
            const currentVal = resData[`DVno${fundCluster}`]
            const increamentedData = (parseInt(currentVal, 10) + 1).toString().padStart(4, '0');

            const today = new Date();
            const yearMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');

            const template =`501-${yearMonth}-`
            const value = increamentedData

            return {template,value, currentVal}
        }catch(error){
            console.log(`Error on GET initial state of DV no: ${error}`)
        }
    }

    const getBurNo = async () => {
        try{
            const res = await axios.get(`${apiURL}/operator/getBUR`, {
                withCredentials: true
            })
            if(res.status === 200){
                const burnumber = res.data.currentBUR
                console.log(burnumber)
                const increamentedData = (parseInt(burnumber, 10) + 1).toString().padStart(4, 0)
                const today = new Date()
                const bur = `501-${today.getFullYear()}-${today.getMonth()+1}-${increamentedData}`
                return {bur, burnumber}
            }
            
            return bur
        }catch(error){
            console.log('error on getting bur no. at useinitialdv')
        }
    }

    return {getDVno, getBurNo}
}

