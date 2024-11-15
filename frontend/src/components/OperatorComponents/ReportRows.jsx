const ReportRows = () => {
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