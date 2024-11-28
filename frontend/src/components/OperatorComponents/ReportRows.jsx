import { useState, useEffect, useMemo } from "react"

const ReportRows = ({reportData}) => {
  const [data, setData] = useState({
    previousRO: 0,
    previousFO: 0,
    previousTotal: 0
  })


  const formatToPeso = (value) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(value);
  };


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

    const previousTOTAL = () => {
      const total = (reportData.prevMonthFO || 0) + (reportData.prevMonthRO || 0)
      return total 
    }

    setData({
        previousRO: computePreviousRO(),
        previousFO: computePreviousFO(),
        previousTotal: previousTOTAL()
    })

    console.log(reportData)
  }, [])

  const add = (firstNum, secondNum) => {
    const sum = parseFloat(firstNum || 0) + parseFloat(secondNum || 0)
    return sum
  } 

  const subtract = (firstNum, secondNum) => {
    const difference = parseFloat(firstNum || 0) - parseFloat(secondNum || 0)
    return difference
  }

  const CB_TotalObligations_RO = useMemo(() => {
    return add(reportData?.prevMonthRO, reportData?.thisMonthRO)
  }, [reportData?.thisMonthRO, reportData?.prevMonthRO])

  const CB_TotalObligations_FO = useMemo(() => {
    return add(reportData?.prevMonthFO, reportData?.thisMonthFO)
  }, [reportData?.thisMonthFO, reportData?.prevMonthFO])

  const CB_TotalObligations = useMemo(() => {
    return add(CB_TotalObligations_RO, CB_TotalObligations_FO)
  }, [reportData?.thisMonthFO, reportData?.prevMonthFO])

  return (
    <tbody className="w-full h-full">
        <tr>
            <td className='border-2 border-black'> </td>
            <td className='border-2 border-black font-bold'>{reportData.description}</td>
            <td className='border-2 border-black text-right font-bold'>{formatToPeso(reportData.TotalASA)}</td>
            <td className='border-2 border-black text-right font-bold'>{formatToPeso(reportData.prevMonthRO || 0)}</td>
            <td className='border-2 border-black text-right font-bold'>{formatToPeso(reportData.prevMonthFO || 0)}</td>
            <td className='border-2 border-black text-right font-bold'>{formatToPeso(data.previousTotal || 0)}</td>
            <td className='border-2 border-black text-right font-bold'>{formatToPeso(reportData.thisMonthRO || 0)}</td>
            <td className='border-2 border-black text-right font-bold'>{formatToPeso(reportData.thisMonthFO || 0)}</td>
            <td className='border-2 border-black text-right font-bold'>{formatToPeso(add(reportData.thisMonthRO, reportData.thisMonthFO))}</td>
            <td className='border-2 border-black text-right font-bold'>{formatToPeso(CB_TotalObligations_RO)}</td>
            <td className='border-2 border-black text-right font-bold'>{formatToPeso(CB_TotalObligations_FO)}</td>
            <td className='border-2 border-black text-right font-bold'>{formatToPeso(CB_TotalObligations)}</td>
            <td className='border-2 border-black text-center font-bold'>{`(TOTAL OBLG. - ASA)`}</td>
        </tr>
        {
          Object.keys(reportData.fieldOffices).length > 0 ? (
            <>
              {
                Object.keys(reportData.fieldOffices).map((key, index) => {
                  const totalObligationRO = add(reportData.fieldOffices[key].prevMonthRO, reportData.fieldOffices[key].thisMonthRO) || 0
                  const totalObligationFO = add(reportData.fieldOffices[key].prevMonthFO, reportData.fieldOffices[key].thisMonthFO) || 0
                  const totalObligation = add(totalObligationRO, totalObligationFO)
                  const Unobligated = subtract(totalObligation, reportData.fieldOffices[key].ASA || 0)
                  return (
                    <tr key={index}>
                      <td className='border-2 border-black'></td>
                      <td className='border-2 border-black'>{key.split(',')[1]}</td>
                      <td className='border-2 border-black text-right'>{formatToPeso(reportData.fieldOffices[key].ASA || 0)}</td>
                      <td className='border-2 border-black text-right'>{formatToPeso(reportData.fieldOffices[key].prevMonthRO || 0)}</td>
                      <td className='border-2 border-black text-right'>{formatToPeso(reportData.fieldOffices[key].prevMonthFO || 0)}</td>
                      <td className='border-2 border-black text-right'>{formatToPeso(add(reportData.fieldOffices[key].prevMonthRO, reportData.fieldOffices[key].prevMonthFO) || 0)}</td>
                      <td className='border-2 border-black text-right'>{formatToPeso(reportData.fieldOffices[key].thisMonthRO || 0)}</td>
                      <td className='border-2 border-black text-right'>{formatToPeso(reportData.fieldOffices[key].thisMonthFO || 0)}</td>
                      <td className='border-2 border-black text-right'>{formatToPeso(add(reportData.fieldOffices[key].thisMonthRO, reportData.fieldOffices[key].thisMonthFO) || 0)}</td>
                      <td className='border-2 border-black text-right'>{formatToPeso(totalObligationRO)}</td>
                      <td className='border-2 border-black text-right'>{formatToPeso(totalObligationFO)}</td>
                      <td className='border-2 border-black text-right'>{formatToPeso(totalObligation)}</td>
                      <td className='border-2 border-black text-center'>{formatToPeso(Unobligated)}</td>
                  </tr>
                  )
                })
              }
            </>
          ) : (
            <tr>
              <td className='border-2 border-black'> </td>
              <td className='border-2 border-black'></td>
              <td className='border-2 border-black text-right'></td>
              <td className='border-2 border-black text-right'></td>
              <td className='border-2 border-black text-right'></td>
              <td className='border-2 border-black text-right'></td>
          </tr>
          )
        }
    </tbody>
  )
}

export default ReportRows