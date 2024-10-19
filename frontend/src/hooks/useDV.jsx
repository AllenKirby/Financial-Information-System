import axios from "axios"
import { useState, useEffect } from "react"

export const useDV = () => {

    // const [arrFundCluster, setArrFundCluster] = useState([])

    const getFormData = async () => {
        try{

            const res = await axios.get('http://localhost:4000/editor/getFormData', {
                withCredentials: true
            })

            if(res.status === 200){
                console.log(res.data.form)
                return res.data.form
                // const formData = res.data.form
                // setArrFundCluster(Object.values(formData.fundCluster))
                // console.log(Object.values(formData.fundCluster))
            }

        }catch(error){
            console.log(`Error fetching form data ${error}`)
        }
    }

    return {getFormData}
}