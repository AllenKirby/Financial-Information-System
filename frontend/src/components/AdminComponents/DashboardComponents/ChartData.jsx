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

    // useEffect(() => {

    //     const unsubscribe = onSnapshot(
    //         collection(firestore, "AmountRecord"),
    //         (snapshot) => {
    //             const docs = {};
    //             snapshot.forEach((doc) => (docs[doc.id] = doc.data()));
    //             setRecords(docs);
    //         },
    //         (error) => console.error("Error listening to collection:", error)
    //     );
    //     return () => unsubscribe();
    // }, []);

    // useEffect(() => {
    //     getValues();
        
    // }, [records]);

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
    }, [])

    // const getValues = async () => {
    //     const categorized = Object.keys(records).reduce((acc, date) => {
    //         const [year, month] = date.split('-');
    //         if (!acc[year]) acc[year] = {};
    //         acc[year][date] = records[date];
    //         return acc;
    //     }, {});

    //     const monthlyTotal = {};
    //     const quarterlyTotal = {};
    //     const quarterlyCluster = {};
    //     const yearlyCluster = {};

    //     for (const year in categorized) {
    //         if (!monthlyTotal[year]) monthlyTotal[year] = {};
    //         if (!quarterlyTotal[year]) quarterlyTotal[year] = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
    //         if (!quarterlyCluster[year]) quarterlyCluster[year] = {
    //             Q1: { COB: 0, LFP: 0, CF: 0, CARP: 0 },
    //             Q2: { COB: 0, LFP: 0, CF: 0, CARP: 0 },
    //             Q3: { COB: 0, LFP: 0, CF: 0, CARP: 0 },
    //             Q4: { COB: 0, LFP: 0, CF: 0, CARP: 0 }
    //         };
    //         if (!yearlyCluster[year]) yearlyCluster[year] = { COB: 0, LFP: 0, CF: 0, CARP: 0 };

    //         for (const month in categorized[year]) {
    //             const keyvalue = categorized[year][month];
    //             const sum = Object.values(keyvalue).map(value => parseFloat(value)).reduce((acc, curr) => acc + curr, 0);
    //             monthlyTotal[year][month] = sum;

    //             const monthNumber = parseInt(month.split('-')[1], 10);
    //             if (monthNumber >= 1 && monthNumber <= 3) {
    //                 quarterlyTotal[year].Q1 += sum;
    //             } else if (monthNumber >= 4 && monthNumber <= 6) {
    //                 quarterlyTotal[year].Q2 += sum;
    //             } else if (monthNumber >= 7 && monthNumber <= 9) {
    //                 quarterlyTotal[year].Q3 += sum;
    //             } else if (monthNumber >= 10 && monthNumber <= 12) {
    //                 quarterlyTotal[year].Q4 += sum;
    //             }
    //         }

    //         for (const month in categorized[year]) {
    //             const monthNumber = parseInt(month.split('-')[1], 10);
    //             const values = categorized[year][month];
    //             if (monthNumber >= 1 && monthNumber <= 3) {
    //                 quarterlyCluster[year].Q1.COB += parseFloat(values.COB);
    //                 quarterlyCluster[year].Q1.LFP += parseFloat(values.LFP);
    //                 quarterlyCluster[year].Q1.CF += parseFloat(values.CF);
    //                 quarterlyCluster[year].Q1.CARP += parseFloat(values.CARP);
    //             } else if (monthNumber >= 4 && monthNumber <= 6) {
    //                 quarterlyCluster[year].Q2.COB += parseFloat(values.COB);
    //                 quarterlyCluster[year].Q2.LFP += parseFloat(values.LFP);
    //                 quarterlyCluster[year].Q2.CF += parseFloat(values.CF);
    //                 quarterlyCluster[year].Q2.CARP += parseFloat(values.CARP);
    //             } else if (monthNumber >= 7 && monthNumber <= 9) {
    //                 quarterlyCluster[year].Q3.COB += parseFloat(values.COB);
    //                 quarterlyCluster[year].Q3.LFP += parseFloat(values.LFP);
    //                 quarterlyCluster[year].Q3.CF += parseFloat(values.CF);
    //                 quarterlyCluster[year].Q3.CARP += parseFloat(values.CARP);
    //             } else if (monthNumber >= 10 && monthNumber <= 12) {
    //                 quarterlyCluster[year].Q4.COB += parseFloat(values.COB);
    //                 quarterlyCluster[year].Q4.LFP += parseFloat(values.LFP);
    //                 quarterlyCluster[year].Q4.CF += parseFloat(values.CF);
    //                 quarterlyCluster[year].Q4.CARP += parseFloat(values.CARP);
    //             }

    //             for (const date in categorized[year]) {
    //                 const values = categorized[year][date];
    //                 yearlyCluster[year].COB += parseFloat(values.COB);
    //                 yearlyCluster[year].LFP += parseFloat(values.LFP);
    //                 yearlyCluster[year].CF += parseFloat(values.CF);
    //                 yearlyCluster[year].CARP += parseFloat(values.CARP);
    //             }
    //         }
    //     }

        // setMonthlyTotalData(monthlyTotal);
        // setQuarterlyTotalData(quarterlyTotal)
        // setCategorizedData(categorized)
        // console.log('bar chart per month', categorized) //bar chart to per month ng LFP, COB, CARP, CONTRACT FARMING
        // console.log('bar chart by quarter',quarterlyCluster) //bar chart by quarter LFP, COB, CARP, CONTRACT FARMING
        // console.log(yearlyCluster)
        // console.log('line graph', monthlyTotal) // line graph x = date (e.g. 2024-01) y = 60000, monthly, categorized per year
        // console.log('line graph 1', quarterlyTotal) // quarterly, line graph, categorized per year
    // };

    

    return (
        <div className="w-full h-full flex flex-col">
           <LineGraph chartData={graphData} customYear={customYear} test_values={value}/>
           {/* <BarChart BarChartData={categorizedData}/> */}
        </div>
    );
};

export default ChartData;
