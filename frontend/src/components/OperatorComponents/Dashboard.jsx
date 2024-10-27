import { useFundingHook } from "../../hooks/useFundingHook"

const Dashboard = () => {
    const { appendDataToSheet, isLoading,} = useFundingHook()

    const values = [
        ['Data11', 'Data21', 'Data31'], // Row 1 data
        ['MoreData11', 'MoreData21', 'MoreData31'], // Row 2 data
      ];
      
  return (
    <button
        onClick={() => appendDataToSheet(values)}
        disabled={isLoading}
        >Send Data</button>
  )
}

export default Dashboard