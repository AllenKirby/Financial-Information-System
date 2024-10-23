import axios from "axios"

export const useInitialStateDV = () => {
    const setDVno = async (fundCluster) => {
        try{
            const res = await axios.get('http://localhost:4000/editor/getNumberOfCopies', {
                params: {cluster: fundCluster},
                withCredentials: true
            })

            if(res.status === 200){
                const resData = res.data.data
                console.log(resData)
                sessionStorage.setItem('pendingDVNumbers', JSON.stringify(resData))
                return resData
            }else{
                console.log('error in setDvno (useinitialstatedv)', error)
            }
        }catch(error){
            console.log(`Error on SET initial state of DV no: ${error}`)
        }
    }

    const getDVno = async (fundCluster) => {
        try{
            const storedDVNumbers = sessionStorage.getItem('pendingDVNumbers')
            const resData = storedDVNumbers ? JSON.parse(storedDVNumbers) : await setDVno(fundCluster)
            const currentVal = resData[`DVno${fundCluster}`]
            const increamentedData = (parseInt(currentVal, 10) + 1).toString().padStart(4, '0');
            console.log(increamentedData)

            const today = new Date();
            const yearMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');

            const template =`501-${yearMonth}-`
            const value = increamentedData

            return {template,value, currentVal}
        }catch(error){
            console.log(`Error on GET initial state of DV no: ${error}`)
        }
    }

    return {getDVno}
}

