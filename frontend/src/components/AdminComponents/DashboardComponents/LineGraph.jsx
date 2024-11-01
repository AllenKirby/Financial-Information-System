import axios from "axios"
import { useEffect, useState } from "react"
const LineGraph = () => {

    const [values, setValues] = useState({})

    useEffect(() => {
        const getForecast = async () => {
            try{
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/getForecastedValues`, {
                    withCredentials: true
                })
                if(res.status === 200){
                    console.log('get forecast', res.data)
                    sessionStorage.setItem('forecasted', JSON.stringify(res.data))
                    setValues(res.data)
                }
            }catch(error){
                console.log('error on getting the forecasted values', error)
            }
        }
        const storedForecastedValues = sessionStorage.getItem('forecasted')
        if(storedForecastedValues){
            const parsedValue = JSON.parse(storedForecastedValues)
            setValues(parsedValue)
            console.log('from session storage', parsedValue)
        }else {
            getForecast()
        }
        
    }, [])

    return (
        <div>
            nasa console yung mga forecasted values
        </div>
    )
}

export default LineGraph