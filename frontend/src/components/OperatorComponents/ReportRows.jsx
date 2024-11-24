import { useState, useEffect } from "react"

const ReportRows = ({reportData}) => {
  const [data, setData] = useState({
    previousRO: 0,
    previousFO: 0,
    previousTotal: 0
  })
  useEffect(()=> {
    
    const computePreviousRO = () => {
        let TotalASA = parseFloat(reportData.TotalASA)
        const TotalFieldOfficeExpense = Object.values(reportData.fieldOffices).map(fieldOffice => parseFloat(fieldOffice.ASA))
        for(let i = 0; i < TotalFieldOfficeExpense.length; i++) {
            TotalASA -= TotalFieldOfficeExpense[i]
        }
        return TotalASA
    }

    const computePreviousFO = () => {
        const TotalFieldOfficeExpense = Object.values(reportData.fieldOffices).map(fieldOffice => parseFloat(fieldOffice.ASA))
        let sum = 0
        for(let i = 0; i < TotalFieldOfficeExpense.length; i++) {
            sum += TotalFieldOfficeExpense[i]
        }
        return sum
    }

    setData({
        previousRO: computePreviousRO(),
        previousFO: computePreviousFO(),
        previousTotal: computePreviousFO() + computePreviousRO()
    })
  }, [])

  return (
    <tbody className="w-full h-full">
        <tr>
            <td className='border-2 border-black'> </td>
            <td className='border-2 border-black font-bold'>{reportData.description}</td>
            <td className='border-2 border-black text-right font-bold'>{reportData.TotalASA}</td>
            <td className='border-2 border-black text-right font-bold'>{data.previousRO}</td>
            <td className='border-2 border-black text-right font-bold'>{data.previousFO}</td>
            <td className='border-2 border-black text-right font-bold'>{data.previousTotal}</td>
        </tr>
    </tbody>
  )
}

export default ReportRows