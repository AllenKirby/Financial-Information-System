import { useFundingHook } from "../../hooks/useFundingHook"

const Dashboard = () => {
    const { appendDataToSheet, isLoading,} = useFundingHook()

    const values = [
        ['Data1', 'Data2', 'Data3'], // Row 1 data
        ['MoreData1', 'MoreData2', 'MoreData3'], // Row 2 data
      ];
      
  return (
    <button
        onClick={() => appendDataToSheet(values)}
        disabled={isLoading}
        >Send Data</button>
  )
}

export default Dashboard