import axios from "axios";
import { useEffect, useState } from "react";
import { firestore } from "../../../config/firebase-config";
import { collection, onSnapshot} from "firebase/firestore";
import LineGraph from "./LineGraph";


const ChartData = ({customYear, value}) => {
    const apiURL = import.meta.env.VITE_API_URL
    const [, setValues] = useState({});
    const [records, setRecords] = useState({});
    const [graphData, setGraphData] = useState({})
    const [monthlyTotalData, setMonthlyTotalData] = useState({});
    const [, setQuarterlyTotalData] = useState({});
    const [, setCategorizedData] = useState({});


    useEffect(() => {
        const fetch = async () => {
            const res = await axios.get(`${apiURL}/adminhead/getRecords`, {
                withCredentials: true
            });
            if(res.status === 200){
                console.log(res.data)
                setGraphData(res.data)
            }else{
                console.log('failed')
            }
        }

        fetch()
    }, [apiURL])

    

    return (
        <div className="w-full h-full flex flex-col">
           <LineGraph chartData={graphData} customYear={customYear} test_values={value}/>
           {/* <BarChart BarChartData={categorizedData}/> */}
        </div>
    );
};

export default ChartData;
